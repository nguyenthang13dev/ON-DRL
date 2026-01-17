"use client";

import
    {
        ReloadOutlined,
        SearchOutlined
    } from "@ant-design/icons";
import { Button, Card, Input, Pagination, Select, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import { StatusConstant } from "@/constants/StatusConstant";
import withAuthorization from "@/libs/authentication";
import { configFormService } from "@/services/ConfigForm/ConfigForm.service";
import { keKhaiSummaryService } from "@/services/keKhaiSoLieu/KeKhaiSoLieuService.service";
import { AppDispatch, AppState } from "@/store/store";
import
    {
        FormAssignByUser,
        SearchConfigFormDataByUser,
    } from "@/types/ConfigForm/ConfigForm";
import { upDateKeKhaiSummaryVM } from "@/types/KeKhaiSummary/keKhaiSummary";
import KeKhaiCardList from "../KeKhaiDanhGia/Components/KeKhaiCardList";

import
    {
        CheckCircleOutlined,
        ClockCircleOutlined,
        FileTextOutlined,
        FormOutlined,
    } from "@ant-design/icons";
import classes from "./page.module.css";

const { Search } = Input;
const { Option } = Select;

const DanhSachKeKhai: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const user = useSelector((state: AppState) => state.auth.User);
    const roles = user?.listRole as string[];

    // State management
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);
    const [loading, setLoading] = useState<boolean>(false);
    const [ListFormKeKhai, setListFormKeKhai] = useState<FormAssignByUser[]>(
        [],
    );
    const [searchText, setSearchText] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<number | null>(null);
    const [selectedFormAssign, setSelectedFormAssign] =
        useState<FormAssignByUser | null>(null);

    // Load data
    const handleGetListFormAssign = async () => {
        try {
            setLoading(true);
            const response = await configFormService.GetDanhSachKeKhaiByUser({
                userId: null,
                formId: null,
            } as SearchConfigFormDataByUser);
            if (response.status) {
                setListFormKeKhai(response.data);
            }
        } catch (error) {
            message.error("Lỗi khi tải danh sách biểu mẫu kê khai");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetListFormAssign();
    }, []);

    // Handlers
    const handleKeKhai = useCallback(
        (record: FormAssignByUser) => {
            router.push(`/KeKhaiDanhGia/evaluation/${record.formId}`);
        },
        [router],
    );

    const handleView = useCallback(
        (record: FormAssignByUser) => {
            router.push(`/KeKhaiDanhGia/view/${record.formId}`);
        },
        [router],
    );

    const handleSendToClassLeader = useCallback(
        async (record: FormAssignByUser) => {
            try {
                const response = await keKhaiSummaryService.UpdateStatus({
                    formId: record.formId,
                    redirect: StatusConstant.GUILOPTRUONG,
                } as upDateKeKhaiSummaryVM);
                if (response.status) {
                    message.success("Cập nhật biểu mẫu kê khai thành công");
                    handleGetListFormAssign(); // Refresh data
                }
            } catch (error) {
                message.error("Lỗi khi cập nhật trạng thái");
            }
        },
        [],
    );


     const handleSendToGV = useCallback(
        async (record: FormAssignByUser) => {
            try {
                const response = await keKhaiSummaryService.UpdateStatus({
                    formId: record.formId,
                    redirect: StatusConstant.GUIGIAOVIEN,
                } as upDateKeKhaiSummaryVM);
                if (response.status) {
                    message.success("Cập nhật biểu mẫu kê khai thành công");
                    handleGetListFormAssign(); // Refresh data
                }
            } catch (error) {
                message.error("Lỗi khi cập nhật trạng thái");
            }
        },
        [],
    );


    const handleViewStudents = useCallback(
        (record: FormAssignByUser) => {
            router.push(`/DanhSachKeKhai/${record.formId}`);
        },
        [router],
    );

    const handlePageChange = (page: number, size?: number) => {
        setPageIndex(page);
        if (size) setPageSize(size);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1);
    };

    const handleStatusFilter = (value: number | null) => {
        setStatusFilter(value);
        setPageIndex(1);
    };

    const handleRefresh = () => {
        handleGetListFormAssign();
        setSearchText("");
        setStatusFilter(null);
        setPageIndex(1);
    };

    

    // Filter and search logic
    const filteredData = ListFormKeKhai.filter((item) => {
        const matchesSearch =
            searchText === "" ||
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.description.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus =
            statusFilter === null || item.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // Calculate statistics
    const totalEvaluations = ListFormKeKhai.length;
    const completedEvaluations = ListFormKeKhai.filter(
        (item) =>
            item.status == StatusConstant.GUIGIAOVIEN ||
            item.status == StatusConstant.GUILOPTRUONG,
    ).length;
    const inProgressEvaluations = ListFormKeKhai.filter(
        (item) => item.status == StatusConstant.DANGKEKHAI,
    ).length;
    const notStartedEvaluations = ListFormKeKhai.filter(
        (item) => item.status == StatusConstant.CHUAKEKHAI,
    ).length;
    const returnedEvaluations = ListFormKeKhai.filter(
        (item) => item.status == StatusConstant.TRAVESINHVIEN,
    ).length;

    return (
        <>
            <AutoBreadcrumb />

            {/* Header with Statistics */}
            <div className={classes.headerSection}>
                <div className={classes.titleSection}>
                    <h1 className={classes.pageTitle}>
                        <FileTextOutlined className={classes.titleIcon} />
                        Danh sách Kê khai
                    </h1>
                    <p className={classes.pageDescription}>
                        Quản lý và theo dõi tất cả các kê khai đánh giá
                    </p>
                </div>

                <div className={classes.statsGrid}>
                    <div className={classes.statCard}>
                        <div
                            className={classes.statIcon}
                            style={{
                                backgroundColor: "#e6f7ff",
                                color: "#1890ff",
                            }}
                        >
                            <FileTextOutlined />
                        </div>
                        <div className={classes.statContent}>
                            <div className={classes.statNumber}>
                                {totalEvaluations}
                            </div>
                            <div className={classes.statLabel}>Tổng số</div>
                        </div>
                    </div>

                    <div className={classes.statCard}>
                        <div
                            className={classes.statIcon}
                            style={{
                                backgroundColor: "#f6ffed",
                                color: "#52c41a",
                            }}
                        >
                            <CheckCircleOutlined />
                        </div>
                        <div className={classes.statContent}>
                            <div className={classes.statNumber}>
                                {completedEvaluations}
                            </div>
                            <div className={classes.statLabel}>
                                Đã hoàn thành
                            </div>
                        </div>
                    </div>

                    <div className={classes.statCard}>
                        <div
                            className={classes.statIcon}
                            style={{
                                backgroundColor: "#fff7e6",
                                color: "#fa8c16",
                            }}
                        >
                            <ClockCircleOutlined />
                        </div>
                        <div className={classes.statContent}>
                            <div className={classes.statNumber}>
                                {inProgressEvaluations}
                            </div>
                            <div className={classes.statLabel}>
                                Đang thực hiện
                            </div>
                        </div>
                    </div>

                    <div className={classes.statCard}>
                        <div
                            className={classes.statIcon}
                            style={{
                                backgroundColor: "#fafafa",
                                color: "#8c8c8c",
                            }}
                        >
                            <FormOutlined />
                        </div>
                        <div className={classes.statContent}>
                            <div className={classes.statNumber}>
                                {notStartedEvaluations}
                            </div>
                            <div className={classes.statLabel}>
                                Chưa bắt đầu
                            </div>
                        </div>
                    </div>

                    <div className={classes.statCard}>
                        <div
                            className={classes.statIcon}
                            style={{
                                backgroundColor: "#fff2f0",
                                color: "#ff4d4f",
                            }}
                        >
                            <ClockCircleOutlined />
                        </div>
                        <div className={classes.statContent}>
                            <div className={classes.statNumber}>
                                {returnedEvaluations}
                            </div>
                            <div className={classes.statLabel}>Trả về</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <Card className={classes.searchCard} style={{ marginBottom: 20 }}>
                <div className={classes.searchSection}>
                    <div className={classes.searchControls}>
                        <Search
                            placeholder="Tìm kiếm theo tên form hoặc mô tả..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onSearch={handleSearch}
                            className={classes.searchInput}
                        />

                        <Select
                            placeholder="Lọc theo trạng thái"
                            allowClear
                            size="large"
                            value={statusFilter}
                            onChange={handleStatusFilter}
                            className={classes.statusFilter}
                        >
                            <Option value={StatusConstant.CHUAKEKHAI}>
                                Chưa bắt đầu
                            </Option>
                            <Option value={StatusConstant.DANGKEKHAI}>
                                Đang thực hiện
                            </Option>
                            <Option value={StatusConstant.GUIGIAOVIEN}>
                                Đã gửi giáo viên
                            </Option>
                            <Option value={StatusConstant.GUILOPTRUONG}>
                                Đã gửi lớp trưởng
                            </Option>
                            <Option value={StatusConstant.TRAVESINHVIEN}>
                                Trả về sinh viên
                            </Option>
                        </Select>

                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                            size="large"
                            className={classes.refreshButton}
                        >
                            Làm mới
                        </Button>
                    </div>

                    <div className={classes.filterInfo}>
                        <span className={classes.filterText}>
                            Hiển thị {filteredData.length} kết quả
                            {searchText && ` cho "${searchText}"`}
                            {statusFilter !== null && ` với trạng thái đã chọn`}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Main Content */}
            <Card
                title={
                    <div className="flex items-center justify-between">
                        <span>Danh sách kê khai</span>
                        <div className="text-sm text-gray-600">
                            {filteredData.length > 0
                                ? `Hiển thị ${Math.min(
                                      (pageIndex - 1) * pageSize + 1,
                                      filteredData.length,
                                  )}-${Math.min(
                                      pageIndex * pageSize,
                                      filteredData.length,
                                  )} của ${filteredData.length}`
                                : "Không có dữ liệu"}
                        </div>
                    </div>
                }
                className={classes.customCardShadow}
                style={{ padding: "0px" }}
            >
                <KeKhaiCardList
                    formList={filteredData.slice(
                        (pageIndex - 1) * pageSize,
                        pageIndex * pageSize,
                    )}
                    loading={loading}
                    onViewDetail={handleView}
                    onKeKhai={handleKeKhai}
                    onSendToClassLeader={handleSendToClassLeader}
                    onViewStudents={handleViewStudents}
                    onSendToGV={handleSendToGV}
                />

                {/* Empty State */}
                {!loading && filteredData.length === 0 && (
                    <div className={classes.emptyState}>
                        <FileTextOutlined className={classes.emptyIcon} />
                        <h3 className={classes.emptyTitle}>
                            {searchText || statusFilter !== null
                                ? "Không tìm thấy kết quả phù hợp"
                                : "Không có kê khai nào"}
                        </h3>
                        <p className={classes.emptyDescription}>
                            {searchText || statusFilter !== null
                                ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                                : "Chưa có kê khai nào được tạo"}
                        </p>
                    </div>
                )}

                <div className="px-4 py-3 border-t">
                    <Pagination
                        current={pageIndex}
                        pageSize={pageSize}
                        total={filteredData.length}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} của ${total} mục`
                        }
                        onChange={handlePageChange}
                        className="text-right"
                    />
                </div>
            </Card>
        </>
    );
};

export default withAuthorization(DanhSachKeKhai, "");
