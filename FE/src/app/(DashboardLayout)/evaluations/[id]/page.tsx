"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { evaluationsData } from "@/lib/mock-data";
import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EvaluationForm } from "@/components/evaluation-form";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { formatDate } from "@/libs/utils";

export default function EvaluationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [evaluation, setEvaluation] = useState(
        evaluationsData.find((e) => e.id === params.id),
    );
    const [isEditing, setIsEditing] = useState(!evaluation?.submitted);

    if (!evaluation) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-foreground">Không tìm thấy đánh giá</p>
                </main>
            </div>
        );
    }

    const handleSubmitEvaluation = (
        updatedCriteria: any[],
        updatedNotes: string,
    ) => {
        const updatedEvaluation = {
            ...evaluation,
            submitted: true,
            submittedDate: new Date().toISOString(),
            completionPercentage: 100,
            criteria: updatedCriteria,
            notes: updatedNotes,
        };
        setEvaluation(updatedEvaluation);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/evaluations">
                    <Button variant="outline" className="mb-6 bg-transparent">
                        <ArrowLeft size={16} />
                        <span className="ml-2">Quay Lại</span>
                    </Button>
                </Link>

                <Card className="p-8 mb-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {evaluation.studentName}
                        </h1>
                        <p className="text-muted-foreground">
                            ID: {evaluation.studentId}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground mb-4">
                                Thông Tin Cơ Bản
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm text-muted-foreground">
                                        Môn Học
                                    </span>
                                    <p className="font-medium text-foreground">
                                        {evaluation.subject}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">
                                        Lớp
                                    </span>
                                    <p className="font-medium text-foreground">
                                        {evaluation.class}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">
                                        Giáo Viên
                                    </span>
                                    <p className="font-medium text-foreground">
                                        {evaluation.teacher}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-foreground mb-4">
                                Trạng Thái Đánh Giá
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm text-muted-foreground">
                                        Trạng Thái
                                    </span>
                                    <div className="flex items-center gap-2 mt-2">
                                        {evaluation.submitted ? (
                                            <>
                                                <CheckCircle
                                                    size={20}
                                                    className="text-green-600"
                                                />
                                                <span className="font-medium text-green-600">
                                                    Đã Gửi
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Clock
                                                    size={20}
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
                                    <span className="text-sm text-muted-foreground">
                                        Hoàn Thành
                                    </span>
                                    <p className="font-medium text-foreground text-2xl mt-2">
                                        {evaluation.completionPercentage}%
                                    </p>
                                </div>
                                {evaluation.submitted &&
                                    evaluation.submittedDate && (
                                        <div>
                                            <span className="text-sm text-muted-foreground">
                                                Ngày Gửi
                                            </span>
                                            <p className="font-medium text-foreground">
                                                {formatDate(
                                                    evaluation.submittedDate,
                                                )}
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </Card>

                {isEditing ? (
                    <EvaluationForm
                        studentName={evaluation.studentName}
                        criteria={evaluation.criteria}
                        notes={evaluation.notes}
                        onSubmit={handleSubmitEvaluation}
                        isSubmitted={evaluation.submitted}
                    />
                ) : (
                    <Card className="p-8">
                        <div className="border-b border-border pb-8 mb-8">
                            <h2 className="text-lg font-semibold text-foreground mb-4">
                                Chi Tiết Đánh Giá
                            </h2>
                            <div className="space-y-6">
                                {evaluation.criteria.map((criterion, index) => (
                                    <div
                                        key={index}
                                        className="border border-border rounded-lg p-4"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium text-foreground">
                                                {criterion.name}
                                            </h3>
                                            <span className="text-sm font-semibold text-primary">
                                                {criterion.score}/10
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {criterion.description}
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${
                                                        (criterion.score / 10) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {evaluation.notes && (
                            <div>
                                <h2 className="text-lg font-semibold text-foreground mb-4">
                                    Ghi Chú
                                </h2>
                                <p className="text-foreground whitespace-pre-wrap">
                                    {evaluation.notes}
                                </p>
                            </div>
                        )}
                    </Card>
                )}
            </main>
        </div>
    );
}
