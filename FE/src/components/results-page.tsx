"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import { evaluationsData } from "@/libs/mock-data";

export function ResultsPage() {
    const [selectedCriteria, setSelectedCriteria] = useState<string | null>(
        null,
    );

    // Prepare data for different visualizations
    const submittedEvaluations = evaluationsData.filter((e) => e.submitted);

    const criteriaAverages =
        evaluationsData[0]?.criteria.map((criterion) => {
            const avg = Math.round(
                submittedEvaluations.reduce((sum, e) => {
                    const crit = e.criteria.find(
                        (c) => c.name === criterion.name,
                    );
                    return sum + (crit?.score || 0);
                }, 0) / (submittedEvaluations.length || 1),
            );
            return {
                name: criterion.name,
                average: avg,
                count: submittedEvaluations.length,
            };
        }) || [];

    const studentScores = submittedEvaluations.map((e) => ({
        name: e.studentName.split(" ").pop(),
        score: Math.round(
            e.criteria.reduce((sum, c) => sum + c.score, 0) / e.criteria.length,
        ),
    }));

    const completionTrend = evaluationsData.map((e, idx) => ({
        name: `SV ${idx + 1}`,
        completion: e.completionPercentage,
        submitted: e.submitted ? 1 : 0,
    }));

    const CriteriaTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-semibold text-foreground">
                        {payload[0].payload.name}
                    </p>
                    <p className="text-sm text-primary font-bold">
                        Điểm: {payload[0].value}/10
                    </p>
                </div>
            );
        }
        return null;
    };

    const StudentTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-semibold text-foreground">
                        {payload[0].payload.name}
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                        Điểm: {payload[0].value}/10
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
                Kết Quả Đánh Giá
            </h1>
            <p className="text-muted-foreground mb-8">
                Phân tích chi tiết kết quả đánh giá học sinh
            </p>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                    <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-2">
                        Tổng Đánh Giá Đã Gửi
                    </div>
                    <div className="text-4xl font-bold text-purple-700 dark:text-purple-300">
                        {submittedEvaluations.length}
                    </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800">
                    <div className="text-sm text-pink-600 dark:text-pink-400 font-medium mb-2">
                        Tỷ Lệ Hoàn Thành
                    </div>
                    <div className="text-4xl font-bold text-pink-700 dark:text-pink-300">
                        {Math.round(
                            (submittedEvaluations.length /
                                evaluationsData.length) *
                                100,
                        )}
                        %
                    </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
                    <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                        Điểm Trung Bình
                    </div>
                    <div className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">
                        {Math.round(
                            submittedEvaluations.reduce((sum, e) => {
                                const avg =
                                    e.criteria.reduce(
                                        (s, c) => s + c.score,
                                        0,
                                    ) / e.criteria.length;
                                return sum + avg;
                            }, 0) / (submittedEvaluations.length || 1),
                        )}
                        <span className="text-lg">/10</span>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                        Điểm Trung Bình Theo Tiêu Chí
                    </h2>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                            data={criteriaAverages}
                            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                        >
                            <defs>
                                <linearGradient
                                    id="colorCriteria"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#1e40af"
                                        stopOpacity={0.8}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                            />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                stroke="#6b7280"
                            />
                            <YAxis domain={[0, 10]} stroke="#6b7280" />
                            <Tooltip content={<CriteriaTooltip />} />
                            <Bar
                                dataKey="average"
                                fill="url(#colorCriteria)"
                                radius={[8, 8, 0, 0]}
                                animationDuration={800}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                        Điểm Sinh Viên
                    </h2>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                            data={studentScores}
                            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                        >
                            <defs>
                                <linearGradient
                                    id="colorStudent"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#10b981"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#047857"
                                        stopOpacity={0.8}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                            />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis domain={[0, 10]} stroke="#6b7280" />
                            <Tooltip content={<StudentTooltip />} />
                            <Bar
                                dataKey="score"
                                fill="url(#colorStudent)"
                                radius={[8, 8, 0, 0]}
                                animationDuration={800}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <Card className="p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                    Tỷ Lệ Hoàn Thành Theo Sinh Viên
                </h2>
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                        data={completionTrend}
                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorLine"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#8b5cf6"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#6d28d9"
                                    stopOpacity={0.2}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis domain={[0, 100]} stroke="#6b7280" />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                                            <p className="text-sm font-semibold text-foreground">
                                                {payload[0].payload.name}
                                            </p>
                                            <p className="text-sm text-purple-600 dark:text-purple-400 font-bold">
                                                {payload[0].value}%
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="completion"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            dot={{ fill: "#8b5cf6", r: 5 }}
                            activeDot={{ r: 7 }}
                            animationDuration={800}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </main>
    );
}
