import type { Icon } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export interface StatCardData {
    title: string;
    value: string;
    badge?: string;
    badgeVariant?: "default" | "outline" | "secondary";
    icon?: Icon;
}

export function StatCard({
    title,
    value,
    badge,
    badgeVariant = "outline",
    icon: Icon,
}: StatCardData) {
    return (
        <Card className="@container/card glass-card card-accent">
            <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl gradient-text">
                    {value}
                </CardTitle>
                <CardAction>
                    {badge && (
                        <Badge variant={badgeVariant}>
                            {Icon && <Icon className="size-3" />}
                            {badge}
                        </Badge>
                    )}
                </CardAction>
            </CardHeader>
        </Card>
    );
}
