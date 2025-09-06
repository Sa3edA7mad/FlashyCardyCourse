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
import { createCardAction } from "@/app/actions/card-actions";

interface AddCardDialogProps {
  deckId: number;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function AddCardDialog({ deckId, trigger, children }: AddCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [errors, setErrors] = useState<{front?: string; back?: string; general?: string}>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate fields
    const newErrors: {front?: string; back?: string} = {};
    if (!front.trim()) {
      newErrors.front = "Front text is required";
    }
    if (!back.trim()) {
      newErrors.back = "Back text is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await createCardAction({
        deckId,
        front: front.trim(),
        back: back.trim(),
      });

      // Reset form and close dialog
      setFront("");
      setBack("");
      setOpen(false);
      
      // Refresh the page to show the new card
      router.refresh();
    } catch (error) {
      console.error("Failed to create card:", error);
      setErrors({
        general: error instanceof Error ? error.message : "Failed to create card. Please try again.",
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
        setFront("");
        setBack("");
        setErrors({});
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button variant="outline" size="lg">
            Add New Card
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Create a new flashcard by adding the front and back text.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="front">Front Text</Label>
              <Input
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Enter the question or prompt..."
                disabled={isSubmitting}
              />
              {errors.front && (
                <p className="text-sm text-destructive">{errors.front}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="back">Back Text</Label>
              <Input
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Enter the answer..."
                disabled={isSubmitting}
              />
              {errors.back && (
                <p className="text-sm text-destructive">{errors.back}</p>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
