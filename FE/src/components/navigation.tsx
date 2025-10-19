"use client";

import Link from "next/link";
import { BarChart3, ListChecks, Home } from "lucide-react";

export function Navigation() {
    return (
        <nav className="border-b border-border bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <Link
                            href="/KeKhaiDanhGia"
                            className="font-bold text-lg text-primary"
                        >
                            Hệ Thống Đánh Giá
                        </Link>
                        <div className="flex gap-6">
                            <Link
                                href="/KeKhaiDanhGia"
                                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                            >
                                <Home size={20} />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                href="/KeKhaiDanhGia/evaluations"
                                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                            >
                                <ListChecks size={20} />
                                <span>Danh Sách Đánh Giá</span>
                            </Link>
                            <Link
                                href="/KeKhaiDanhGia/results"
                                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                            >
                                <BarChart3 size={20} />
                                <span>Kết Quả</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
