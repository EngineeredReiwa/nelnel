'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { type TimelineActivity } from '@/lib/utils'

interface ActivityChartProps {
  data: TimelineActivity[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  // Aggregate data by activity type
  const aggregatedData = data.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.activity)
    if (existing) {
      existing.value += curr.duration
      existing.count += 1
    } else {
      acc.push({
        name: curr.activity,
        value: curr.duration,
        count: 1,
        color: curr.color,
        emoji: curr.emoji
      })
    }
    return acc
  }, [] as Array<{
    name: string
    value: number
    count: number
    color: string
    emoji: string
  }>)

  // Sort by duration desc
  aggregatedData.sort((a, b) => b.value - a.value)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{data.emoji}</span>
            <span className="font-semibold">{data.name}</span>
          </div>
          <div className="text-sm text-gray-600">
            <div>合計時間: {data.value}分</div>
            <div>回数: {data.count}回</div>
            <div>平均: {Math.round(data.value / data.count)}分/回</div>
          </div>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload?.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-1 text-xs"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.payload.emoji}</span>
            <span className="text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (aggregatedData.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-gray-500">
        データがありません
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={aggregatedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {aggregatedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}