"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UserDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userName: string
    onConfirm: () => void
}

export function UserDeleteDialog({
    open,
    onOpenChange,
    userName,
    onConfirm,
}: UserDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Deactivate User</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to deactivate <strong>{userName}</strong>? They
                        will lose access to the dashboard.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm()
                            onOpenChange(false)
                        }}
                    >
                        Deactivate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
