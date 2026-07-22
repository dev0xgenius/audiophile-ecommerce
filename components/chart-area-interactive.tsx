"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
  previousRevenue: {
    label: "Previous Period",
    color: "var(--accent-foreground)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [data, setData] = React.useState<{ date: string; revenue: number; previousRevenue: number }[]>([])
  const [total, setTotal] = React.useState(0)
  const [change, setChange] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  React.useEffect(() => {
    setLoading(true)
    fetch(`/api/dashboard/revenue?period=${timeRange}`)
      .then((r) => r.json())
      .then((j) => {
        const d = j.data ?? {}
        const revenue: { date: string; revenue: number }[] = d.revenue ?? []
        const previousRevenue: { date: string; revenue: number }[] = d.previousRevenue ?? []
        setTotal(d.total ?? 0)
        setChange(d.change)

        const merged = revenue.map((r, i) => ({
          date: r.date,
          revenue: r.revenue,
          previousRevenue: previousRevenue[i]?.revenue ?? 0,
        }))
        setData(merged)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [timeRange])

  return (
    <Card className="@container/card glass-card card-accent">
      <CardHeader>
        <CardTitle>
          Revenue
          {!loading && (
            <span className="ml-2 text-lg font-normal tabular-nums">
              ${total.toLocaleString()}
              {change !== null && (
                <span className={`ml-1 text-sm ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
                </span>
              )}
            </span>
          )}
        </CardTitle>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v) => v && setTimeRange(v)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="aspect-auto h-[250px] w-full rounded-lg bg-muted animate-pulse" />
        ) : data.length === 0 ? (
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center text-muted-foreground text-sm">
            No revenue data for this period.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={1.0} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-previousRevenue)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-previousRevenue)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="previousRevenue"
                type="natural"
                fill="url(#fillPrevious)"
                stroke="var(--color-previousRevenue)"
                stackId="a"
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
