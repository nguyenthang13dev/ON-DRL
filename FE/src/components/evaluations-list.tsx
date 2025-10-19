"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Eye, Send } from "lucide-react";
import Link from "next/link";
import { evaluationsData } from "@/libs/mock-data";
import { formatDate } from "@/libs/utils";

export function EvaluationsList() {
    const [evaluations, setEvaluations] = useState(evaluationsData);
    const [filter, setFilter] = useState<"all" | "submitted" | "pending">(
        "all",
    );

    const filteredEvaluations = evaluations.filter((e) => {
        if (filter === "submitted") return e.submitted;
        if (filter === "pending") return !e.submitted;
        return true;
    });

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

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                    Danh Sách Đánh Giá
                </h1>

                {/* Filter Buttons */}
                <div className="flex gap-3">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        onClick={() => setFilter("all")}
                    >
                        Tất Cả ({evaluations.length})
                    </Button>
                    <Button
                        variant={filter === "submitted" ? "default" : "outline"}
                        onClick={() => setFilter("submitted")}
                    >
                        Đã Gửi ({evaluations.filter((e) => e.submitted).length})
                    </Button>
                    <Button
                        variant={filter === "pending" ? "default" : "outline"}
                        onClick={() => setFilter("pending")}
                    >
                        Chưa Gửi (
                        {evaluations.filter((e) => !e.submitted).length})
                    </Button>
                </div>
            </div>

            {/* Evaluations Table */}
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
                                <Link href={`/evaluations/${evaluation.id}`}>
                                    <Button variant="outline" size="sm">
                                        <Eye size={16} />
                                        <span className="ml-2">Xem</span>
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
                                        <span className="ml-2">Gửi</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </main>
    );
}
