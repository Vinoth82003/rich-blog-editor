"use client";

import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "./ui/card";

export default function AnalyticsChart({ data }) {
    return (
        <Card>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", marginTop: "1rem", marginLeft: "1rem" }}>
                📈 Blog Engagement Chart
            </h3>
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4ade80" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity={0.2} />
                        </linearGradient>
                        <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="title" tick={{ fontSize: 12 }} angle={-10} interval={0} />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "0.5rem",
                            border: "1px solid #ddd",
                            fontSize: "0.875rem",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                            color: "#111"
                        }}
                        itemStyle={{ color: "#111" }}
                        formatter={(value, name) => [value, name === "views" ? "Views" : "Likes"]}
                    />

                    <Legend verticalAlign="top" height={36} />

                    <Bar
                        dataKey="views"
                        barSize={18}
                        name="Views"
                        fill="url(#colorViews)"
                        radius={[4, 4, 0, 0]}
                    />
                    <Line
                        type="monotone"
                        dataKey="likes"
                        name="Likes"
                        stroke="url(#colorLikes)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#8b5cf6" }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </Card>
    );
}
