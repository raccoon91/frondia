import type { FC, PropsWithChildren } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteDialogProps {
  isOpen: boolean;
  title: string;
  onClose: (open?: boolean) => void;
  onConfirm: () => Promise<void>;
}

export const DeleteDialog: FC<PropsWithChildren<DeleteDialogProps>> = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {children}

        <DialogFooter>
          <Button size="sm" variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
