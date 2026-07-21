"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

const formSchema = z.object({
    provider: z.enum(["paystack"]),
    label: z.string().min(1, "Label is required").max(100),
    secretKey: z.string().min(1, "Secret key is required"),
    isDefault: z.boolean().default(false),
    liveMode: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

interface PspFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function PspFormDialog({ open, onOpenChange, onSuccess }: PspFormDialogProps) {
    const [submitting, setSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            provider: "paystack",
            label: "",
            secretKey: "",
            isDefault: false,
            liveMode: false,
        },
    })

    const provider = watch("provider")
    const isDefault = watch("isDefault")
    const liveMode = watch("liveMode")

    const handleFormSubmit = async (data: FormValues) => {
        setSubmitting(true)
        try {
            const res = await fetch("/api/psp/connections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error ?? "Failed to create connection")
            }
            toast.success("PSP connection created")
            reset()
            onSuccess()
            onOpenChange(false)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create connection")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Payment Provider</DialogTitle>
                    <DialogDescription>
                        Connect a payment service provider to process transactions.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="provider">Provider</Label>
                            <Select
                                value={provider}
                                onValueChange={(v: string) => setValue("provider", v as "paystack")}
                            >
                            <SelectTrigger id="provider">
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="paystack">Paystack</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="label">Label</Label>
                        <Input id="label" placeholder="e.g. Production Paystack" {...register("label")} />
                        {errors.label && <p className="text-sm text-error">{errors.label.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="secretKey">Secret Key</Label>
                        <Input id="secretKey" type="password" placeholder="sk_..." {...register("secretKey")} />
                        {errors.secretKey && <p className="text-sm text-error">{errors.secretKey.message}</p>}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="isDefault"
                                checked={isDefault}
                                onCheckedChange={(v: boolean) => setValue("isDefault", v)}
                            />
                            <Label htmlFor="isDefault">Default</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="liveMode"
                                checked={liveMode}
                                onCheckedChange={(v: boolean) => setValue("liveMode", v)}
                            />
                            <Label htmlFor="liveMode">Live Mode</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Saving..." : "Add Connection"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
