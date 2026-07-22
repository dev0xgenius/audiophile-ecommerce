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

interface RoleDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    roleName: string
    onConfirm: () => void
}

export function RoleDeleteDialog({
    open,
    onOpenChange,
    roleName,
    onConfirm,
}: RoleDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Role</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <strong>{roleName}</strong>? This
                        action cannot be undone. Users assigned this role will lose its permissions.
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
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
