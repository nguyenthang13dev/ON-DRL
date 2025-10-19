"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, AlertCircle } from "lucide-react";
import TextArea from "antd/es/input/TextArea";

interface Criterion {
    name: string;
    description: string;
    score: number;
}

interface EvaluationFormProps {
    studentName: string;
    criteria: Criterion[];
    notes: string;
    onSubmit: (updatedCriteria: Criterion[], updatedNotes: string) => void;
    isSubmitted: boolean;
}

export function EvaluationForm({
    studentName,
    criteria,
    notes,
    onSubmit,
    isSubmitted,
}: EvaluationFormProps) {
    const [formCriteria, setFormCriteria] = useState<Criterion[]>(criteria);
    const [formNotes, setFormNotes] = useState(notes);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitted, setSubmitted] = useState(isSubmitted);

    const handleScoreChange = (index: number, newScore: number) => {
        const updated = [...formCriteria];
        updated[index].score = newScore;
        setFormCriteria(updated);
    };

    const handleSubmit = () => {
        onSubmit(formCriteria, formNotes);
        setSubmitted(true);
        setShowConfirm(false);
    };

    const completionPercentage = Math.round(
        (formCriteria.filter((c) => c.score > 0).length / formCriteria.length) *
            100,
    );

    if (submitted) {
        return (
            <Card className="p-8 bg-green-50 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle size={24} className="text-green-600" />
                    <h2 className="text-xl font-semibold text-green-900">
                        Đánh Giá Đã Gửi Thành Công
                    </h2>
                </div>
                <p className="text-green-800">
                    Đánh giá cho {studentName} đã được gửi vào hệ thống.
                </p>
            </Card>
        );
    }

    return (
        <>
            <Card className="p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Biểu Mẫu Đánh Giá
                    </h2>
                    <p className="text-muted-foreground">
                        Hoàn thành: {completionPercentage}%
                    </p>
                </div>

                <div className="space-y-8">
                    {formCriteria.map((criterion, index) => (
                        <div
                            key={index}
                            className="border border-border rounded-lg p-6"
                        >
                            <div className="mb-4">
                                <h3 className="font-semibold text-foreground mb-1">
                                    {criterion.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {criterion.description}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-foreground">
                                        Điểm: {formCriteria[index].score}/10
                                    </span>
                                </div>
                                <Slider
                                    value={[formCriteria[index].score]}
                                    onValueChange={(value) =>
                                        handleScoreChange(index, value[0])
                                    }
                                    min={0}
                                    max={10}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    ))}

                    <div className="border border-border rounded-lg p-6">
                        <label className="block mb-3">
                            <span className="font-semibold text-foreground mb-2 block">
                                Ghi Chú Bổ Sung
                            </span>
                            <TextArea
                                value={formNotes}
                                onChange={(e) => setFormNotes(e.target.value)}
                                placeholder="Nhập ghi chú về đánh giá..."
                                className="min-h-32"
                            />
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <Button
                        onClick={() => setShowConfirm(true)}
                        className="bg-green-600 hover:bg-green-700"
                        size="lg"
                    >
                        Gửi Đánh Giá
                    </Button>
                </div>
            </Card>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle
                                size={20}
                                className="text-yellow-600"
                            />
                            Xác Nhận Gửi Đánh Giá
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn gửi đánh giá cho {studentName}
                            ? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                        <p className="text-sm text-blue-900">
                            <strong>Hoàn thành:</strong> {completionPercentage}%
                        </p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Xác Nhận Gửi
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
