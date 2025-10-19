"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { evaluationsData } from "@/libs/mock-data";
import { Card } from "antd";

export function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        submitted: 0,
        pending: 0,
        avgCompletion: 0,
    });

    useEffect(() => {
        const total = evaluationsData.length;
        const submitted = evaluationsData.filter((e) => e.submitted).length;
        const pending = total - submitted;
        const avgCompletion = Math.round(
            evaluationsData.reduce(
                (sum, e) => sum + e.completionPercentage,
                0,
            ) / total,
        );

        setStats({ total, submitted, pending, avgCompletion });
    }, []);

    const statusData = [
        { name: "Đã Gửi", value: stats.submitted, fill: "#06b6d4" },
        { name: "Chưa Gửi", value: stats.pending, fill: "#f97316" },
    ];

    const completionData = evaluationsData.map((e) => ({
        name: e.studentName.split(" ").pop(),
        completion: e.completionPercentage,
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-semibold text-foreground">
                        {payload[0].payload.name}
                    </p>
                    <p className="text-sm text-primary font-bold">
                        {payload[0].value}%
                    </p>
                </div>
            );
        }
        return null;
    };

    const PieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-semibold text-foreground">
                        {payload[0].name}
                    </p>
                    <p
                        className="text-sm font-bold"
                        style={{ color: payload[0].fill }}
                    >
                        {payload[0].value} sinh viên
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard Tổng Quan
            </h1>
            <p className="text-muted-foreground mb-8">
                Theo dõi tiến độ đánh giá học sinh
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                        Tổng Số Đánh Giá
                    </div>
                    <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                        {stats.total}
                    </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
                    <div className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mb-2">
                        Đã Gửi
                    </div>
                    <div className="text-4xl font-bold text-cyan-700 dark:text-cyan-300">
                        {stats.submitted}
                    </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                    <div className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-2">
                        Chưa Gửi
                    </div>
                    <div className="text-4xl font-bold text-orange-700 dark:text-orange-300">
                        {stats.pending}
                    </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                        Hoàn Thành Trung Bình
                    </div>
                    <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
                        {stats.avgCompletion}%
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                        Trạng Thái Gửi Đánh Giá
                    </h2>
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value, percent }: any) =>
                                    `${name}: ${value} (${Number(
                                        percent * 100,
                                    ).toFixed(0)}%)`
                                }
                                outerRadius={100}
                                innerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                                animationDuration={800}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                        Tỷ Lệ Hoàn Thành Theo Sinh Viên
                    </h2>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                            data={completionData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                        >
                            <defs>
                                <linearGradient
                                    id="colorCompletion"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#06b6d4"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#0891b2"
                                        stopOpacity={0.8}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                            />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="completion"
                                fill="url(#colorCompletion)"
                                radius={[8, 8, 0, 0]}
                                animationDuration={800}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </main>
    );
}
