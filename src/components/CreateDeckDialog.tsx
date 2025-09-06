"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDeckAction } from "@/app/actions/deck-actions";

interface CreateDeckDialogProps {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function CreateDeckDialog({ trigger, children }: CreateDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{title?: string; description?: string; general?: string}>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate fields
    const newErrors: {title?: string; description?: string} = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (title.trim().length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }
    if (description.length > 500) {
      newErrors.description = "Description must be 500 characters or less";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const newDeck = await createDeckAction({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      // Close dialog and reset form
      setOpen(false);
      setTitle("");
      setDescription("");
      setErrors({});
      
      // Navigate to the new deck
      router.push(`/decks/${newDeck.id}`);
    } catch (error) {
      console.error("Failed to create deck:", error);
      setErrors({
        general: error instanceof Error ? error.message : "Failed to create deck. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset form when closing
        setTitle("");
        setDescription("");
        setErrors({});
      }
    }
  };

  const canSubmit = title.trim().length > 0 && !isSubmitting;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button>
            Create New Deck
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Deck</DialogTitle>
          <DialogDescription>
            Create a new flashcard deck to start learning.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter deck title..."
                disabled={isSubmitting}
                maxLength={100}
                autoFocus
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter deck description..."
                disabled={isSubmitting}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
            {errors.general && (
              <p className="text-sm text-destructive">{errors.general}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Creating..." : "Create Deck"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
