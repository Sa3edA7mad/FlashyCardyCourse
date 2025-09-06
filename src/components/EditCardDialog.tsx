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
import { updateCardAction } from "@/app/actions/card-actions";

interface EditCardDialogProps {
  cardId: number;
  currentFront: string;
  currentBack: string;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function EditCardDialog({ 
  cardId, 
  currentFront, 
  currentBack, 
  trigger, 
  children 
}: EditCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [front, setFront] = useState(currentFront);
  const [back, setBack] = useState(currentBack);
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
      await updateCardAction({
        id: cardId,
        front: front.trim(),
        back: back.trim(),
      });

      // Close dialog
      setOpen(false);
      
      // Refresh the page to show the updated card
      router.refresh();
    } catch (error) {
      console.error("Failed to update card:", error);
      setErrors({
        general: error instanceof Error ? error.message : "Failed to update card. Please try again.",
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
        setFront(currentFront);
        setBack(currentBack);
        setErrors({});
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button variant="ghost" size="sm" className="flex-1">
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>
            Update the front and back text of this flashcard.
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
              {isSubmitting ? "Updating..." : "Update Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
