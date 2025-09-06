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
import { deleteDeckAction } from "@/app/actions/deck-actions";

interface DeleteDeckDialogProps {
  deckId: number;
  deckTitle: string;
  cardCount: number;
  onDeleteSuccess?: () => void;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function DeleteDeckDialog({ deckId, deckTitle, cardCount, onDeleteSuccess, trigger, children }: DeleteDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);

    try {
      await deleteDeckAction({ id: deckId });

      // Call the success callback to close parent dialogs
      onDeleteSuccess?.();
      
      // Close dialog and redirect to dashboard
      setOpen(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete deck:", error);
      setError(error instanceof Error ? error.message : "Failed to delete deck. Please try again.");
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
          <Button variant="destructive" size="lg">
            Delete Deck
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Deck</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <strong>"{deckTitle}"</strong>? This action cannot be undone.
            </p>
            {cardCount > 0 && (
              <p className="text-destructive font-medium">
                This will also permanently delete all {cardCount} {cardCount === 1 ? 'card' : 'cards'} in this deck.
              </p>
            )}
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
            {isDeleting ? "Deleting..." : "Delete Deck"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
