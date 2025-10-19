"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    LineChart,
    Line,
} from "recharts";
import { CheckCircle, Clock, Eye, Send } from "lucide-react";
import Link from "next/link";
import { evaluationsData } from "@/libs/mock-data";
import { formatDate } from "@/libs/utils";

export function UnifiedDashboard() {
    const [activeTab, setActiveTab] = useState<
        "overview" | "evaluations" | "results"
    >("overview");
    const [evaluations, setEvaluations] = useState(evaluationsData);
    const [filter, setFilter] = useState<"all" | "submitted" | "pending">(
        "all",
    );

    // Calculate stats
    const total = evaluations.length;
    const submitted = evaluations.filter((e) => e.submitted).length;
    const pending = total - submitted;
    const avgCompletion = Math.round(
        evaluations.reduce((sum, e) => sum + e.completionPercentage, 0) / total,
    );

    const statusData = [
        { name: "Đã Gửi", value: submitted, fill: "#06b6d4" },
        { name: "Chưa Gửi", value: pending, fill: "#f97316" },
    ];

    const completionData = evaluations.map((e) => ({
        name: e.studentName.split(" ").pop(),
        completion: e.completionPercentage,
    }));

    const filteredEvaluations = evaluations.filter((e) => {
        if (filter === "submitted") return e.submitted;
        if (filter === "pending") return !e.submitted;
        return true;
    });

    const submittedEvaluations = evaluations.filter((e) => e.submitted);

    const criteriaAverages =
        evaluations[0]?.criteria.map((criterion) => {
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

    const completionTrend = evaluations.map((e, idx) => ({
        name: `SV ${idx + 1}`,
        completion: e.completionPercentage,
        submitted: e.submitted ? 1 : 0,
    }));

    const handleSubmit = (id: string) => {
        setEvaluations((prev) =>
            prev.map((e) =>
                e.id === id
                    ? {
                          ...e,
                          submitted: true,
                          submittedDate: new Date().toISOString(),
                          completionPercentage: 100,
                      }
                    : e,
            ),
        );
    };

    // Custom Tooltips
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
        <main className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <div className="flex gap-2 border-b border-border">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                            activeTab === "overview"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Tổng Quan
                    </button>
                    <button
                        onClick={() => setActiveTab("evaluations")}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                            activeTab === "evaluations"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Danh Sách Đánh Giá
                    </button>
                    <button
                        onClick={() => setActiveTab("results")}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                            activeTab === "results"
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Kết Quả
                    </button>
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                                Tổng Số Đánh Giá
                            </div>
                            <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                                {total}
                            </div>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
                            <div className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mb-2">
                                Đã Gửi
                            </div>
                            <div className="text-4xl font-bold text-cyan-700 dark:text-cyan-300">
                                {submitted}
                            </div>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                            <div className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-2">
                                Chưa Gửi
                            </div>
                            <div className="text-4xl font-bold text-orange-700 dark:text-orange-300">
                                {pending}
                            </div>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
                            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                                Hoàn Thành Trung Bình
                            </div>
                            <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
                                {avgCompletion}%
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
                                        label={({
                                            name,
                                            value,
                                            percent,
                                        }: any) =>
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
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 0,
                                        bottom: 20,
                                    }}
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
                </div>
            )}

            {/* Evaluations Tab */}
            {activeTab === "evaluations" && (
                <div className="space-y-6">
                    {/* Filter Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant={filter === "all" ? "default" : "outline"}
                            onClick={() => setFilter("all")}
                        >
                            Tất Cả ({evaluations.length})
                        </Button>
                        <Button
                            variant={
                                filter === "submitted" ? "default" : "outline"
                            }
                            onClick={() => setFilter("submitted")}
                        >
                            Đã Gửi (
                            {evaluations.filter((e) => e.submitted).length})
                        </Button>
                        <Button
                            variant={
                                filter === "pending" ? "default" : "outline"
                            }
                            onClick={() => setFilter("pending")}
                        >
                            Chưa Gửi (
                            {evaluations.filter((e) => !e.submitted).length})
                        </Button>
                    </div>

                    {/* Evaluations List */}
                    <div className="space-y-4">
                        {filteredEvaluations.map((evaluation) => (
                            <Card key={evaluation.id} className="p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {evaluation.studentName}
                                            </h3>
                                            <span className="text-sm text-muted-foreground">
                                                ({evaluation.studentId})
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Môn Học:
                                                </span>
                                                <p className="font-medium text-foreground">
                                                    {evaluation.subject}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Trạng Thái:
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {evaluation.submitted ? (
                                                        <>
                                                            <CheckCircle
                                                                size={16}
                                                                className="text-green-600"
                                                            />
                                                            <span className="font-medium text-green-600">
                                                                Đã Gửi
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock
                                                                size={16}
                                                                className="text-yellow-600"
                                                            />
                                                            <span className="font-medium text-yellow-600">
                                                                Chưa Gửi
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Hoàn Thành:
                                                </span>
                                                <div className="mt-1">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{
                                                                width: `${evaluation.completionPercentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-xs font-medium mt-1">
                                                        {
                                                            evaluation.completionPercentage
                                                        }
                                                        %
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Ngày Gửi:
                                                </span>
                                                <p className="font-medium text-foreground">
                                                    {evaluation.submitted &&
                                                    evaluation.submittedDate
                                                        ? formatDate(
                                                              evaluation.submittedDate,
                                                          )
                                                        : "Chưa gửi"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/evaluations/${evaluation.id}`}
                                        >
                                            <Button variant="outline" size="sm">
                                                <Eye size={16} />
                                                <span className="ml-2">
                                                    Xem
                                                </span>
                                            </Button>
                                        </Link>
                                        {!evaluation.submitted && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleSubmit(evaluation.id)
                                                }
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <Send size={16} />
                                                <span className="ml-2">
                                                    Gửi
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Results Tab */}
            {activeTab === "results" && (
                <div className="space-y-8">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        evaluations.length) *
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="p-6 shadow-lg">
                            <h2 className="text-xl font-semibold text-foreground mb-6">
                                Điểm Trung Bình Theo Tiêu Chí
                            </h2>
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart
                                    data={criteriaAverages}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 0,
                                        bottom: 60,
                                    }}
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
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 0,
                                        bottom: 20,
                                    }}
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
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 0,
                                    bottom: 20,
                                }}
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
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis domain={[0, 100]} stroke="#6b7280" />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (
                                            active &&
                                            payload &&
                                            payload.length
                                        ) {
                                            return (
                                                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {
                                                            payload[0].payload
                                                                .name
                                                        }
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
                </div>
            )}
        </main>
    );
}
