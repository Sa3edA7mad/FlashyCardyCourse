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
import { deleteCardAction } from "@/app/actions/card-actions";

interface DeleteCardDialogProps {
  cardId: number;
  cardIndex: number;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function DeleteCardDialog({ cardId, cardIndex, trigger, children }: DeleteCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);

    try {
      await deleteCardAction({ id: cardId });

      // Close dialog and refresh page
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete card:", error);
      setError(error instanceof Error ? error.message : "Failed to delete card. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset error when closing
        setError("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button variant="ghost" size="sm" className="flex-1 text-destructive hover:text-destructive border">
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Card</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete Card #{cardIndex + 1}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="py-2">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleOpenChange(false)} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
