import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export function LiveAreaChart({ data, color = "#81ecff" }: { data: any[], color?: string }) {
  const config = {
    value: {
      label: "Value",
      color: color,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="w-full h-full min-h-[1px] aspect-auto">
      <AreaChart
        data={data}
        margin={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id={`fillColor-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="value"
          type="natural"
          fill={`url(#fillColor-${color.replace("#", "")})`}
          fillOpacity={0.4}
          stroke={color}
          strokeWidth={3}
          isAnimationActive={true}
          animationDuration={1000}
        />
      </AreaChart>
    </ChartContainer>
  );
}
