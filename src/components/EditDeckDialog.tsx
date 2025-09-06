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
import { updateDeckAction } from "@/app/actions/deck-actions";
import { DeleteDeckDialog } from "@/components/DeleteDeckDialog";

interface EditDeckDialogProps {
  deckId: number;
  currentTitle: string;
  currentDescription?: string | null;
  cardCount: number;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function EditDeckDialog({ 
  deckId, 
  currentTitle, 
  currentDescription, 
  cardCount,
  trigger, 
  children 
}: EditDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription || "");
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
      await updateDeckAction({
        id: deckId,
        title: title.trim(),
        description: description.trim() || null,
      });

      // Close dialog
      setOpen(false);
      
      // Refresh the page to show the updated deck
      router.refresh();
    } catch (error) {
      console.error("Failed to update deck:", error);
      setErrors({
        general: error instanceof Error ? error.message : "Failed to update deck. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset form to original values when closing
        setTitle(currentTitle);
        setDescription(currentDescription || "");
        setErrors({});
      }
    }
  };

  // Helper function to normalize description values for comparison
  const normalizeDescription = (desc: string | null | undefined) => {
    return desc?.trim() || null;
  };

  const hasChanges = 
    title.trim() !== currentTitle || 
    normalizeDescription(description) !== normalizeDescription(currentDescription);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button variant="outline" size="lg">
            Edit Deck
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Deck</DialogTitle>
          <DialogDescription>
            Update the title and description of your flashcard deck.
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
          <DialogFooter className="flex-col sm:flex-row sm:justify-between">
            {/* Delete button on the left */}
            <div className="flex">
              <DeleteDeckDialog
                deckId={deckId}
                deckTitle={currentTitle}
                cardCount={cardCount}
                onDeleteSuccess={() => setOpen(false)}
              >
                <Button type="button" variant="destructive" disabled={isSubmitting}>
                  Delete Deck
                </Button>
              </DeleteDeckDialog>
            </div>
            
            {/* Cancel and Update buttons on the right */}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !hasChanges}>
                {isSubmitting ? "Updating..." : "Update Deck"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
