"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Card,
    Table,
    Tag,
    Space,
    Tooltip,
    Button,
    message,
    Spin,
    Alert,
} from "antd";
import {
    ArrowLeftOutlined,
    UserOutlined,
    EyeOutlined,
    UndoOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    ReloadOutlined,
} from "@ant-design/icons";

import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import { StatusConstant } from "@/constants/StatusConstant";
import { configFormService } from "@/services/ConfigForm/ConfigForm.service";
import {
    FormAssignByUser,
    SearchConfigFormDataByUser,
} from "@/types/ConfigForm/ConfigForm";
import withAuthorization from "@/libs/authentication";

import classes from "./page.module.css";

interface StudentSubmission {
    id: string;
    studentName: string;
    studentId: string;
    className: string;
    status: number;
    submitDate?: string;
    progress: number;
    note?: string;
    email?: string;
    phone?: string;
}

const DanhSachKeKhaiDetail: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const formId = params.id as string;

    // State management
    const [loading, setLoading] = useState<boolean>(false);
    const [formInfo, setFormInfo] = useState<FormAssignByUser | null>(null);
    const [studentList, setStudentList] = useState<StudentSubmission[]>([]);
    const [loadingStudents, setLoadingStudents] = useState<boolean>(false);

    // Load form information
    const handleGetFormInfo = useCallback(async () => {
        try {
            setLoading(true);
            const response = await configFormService.GetFormByUser({
                userId: null,
                formId: formId,
            } as SearchConfigFormDataByUser);
            if (response.status && response.data.length > 0) {
                setFormInfo(response.data[0]);
            } else {
                message.error("Không tìm thấy thông tin form");
                router.back();
            }
        } catch (error) {
            message.error("Lỗi khi tải thông tin form");
            router.back();
        } finally {
            setLoading(false);
        }
    }, [formId, router]);

    // Load student list
    const handleGetStudentList = useCallback(async () => {
        try {
            setLoadingStudents(true);
            // Replace with actual API call
            // const response = await studentService.GetStudentsByFormId(formId);
            // setStudentList(response.data);

            // Using mock data for now
            const mockData: StudentSubmission[] = [
                {
                    id: "1",
                    studentName: "Nguyễn Văn A",
                    studentId: "SV001",
                    className: "Lớp 10A1",
                    status: StatusConstant.GUIGIAOVIEN,
                    submitDate: "2024-01-15",
                    progress: 100,
                    note: "Hoàn thành tốt",
                    email: "nguyenvana@email.com",
                    phone: "0123456789",
                },
                {
                    id: "2",
                    studentName: "Trần Thị B",
                    studentId: "SV002",
                    className: "Lớp 10A1",
                    status: StatusConstant.DANGKEKHAI,
                    submitDate: "2024-01-14",
                    progress: 75,
                    note: "Đang hoàn thiện",
                    email: "tranthib@email.com",
                    phone: "0123456790",
                },
                {
                    id: "3",
                    studentName: "Lê Văn C",
                    studentId: "SV003",
                    className: "Lớp 10A1",
                    status: StatusConstant.TRAVESINHVIEN,
                    submitDate: "2024-01-13",
                    progress: 60,
                    note: "Cần chỉnh sửa",
                    email: "levanc@email.com",
                    phone: "0123456791",
                },
                {
                    id: "4",
                    studentName: "Phạm Thị D",
                    studentId: "SV004",
                    className: "Lớp 10A1",
                    status: StatusConstant.CHUAKEKHAI,
                    progress: 0,
                    note: "Chưa bắt đầu",
                    email: "phamthid@email.com",
                    phone: "0123456792",
                },
                {
                    id: "5",
                    studentName: "Hoàng Văn E",
                    studentId: "SV005",
                    className: "Lớp 10A1",
                    status: StatusConstant.GUILOPTRUONG,
                    submitDate: "2024-01-16",
                    progress: 100,
                    note: "Đã gửi lớp trưởng",
                    email: "hoangvane@email.com",
                    phone: "0123456793",
                },
            ];
            setStudentList(mockData);
        } catch (error) {
            message.error("Lỗi khi tải danh sách sinh viên");
        } finally {
            setLoadingStudents(false);
        }
    }, []);

    useEffect(() => {
        if (formId) {
            handleGetFormInfo();
            handleGetStudentList();
        }
    }, [formId, handleGetFormInfo, handleGetStudentList]);

    // Handlers
    const handleBack = () => {
        router.back();
    };

    const handleViewStudentDetail = (student: StudentSubmission) => {
        message.info(`Xem chi tiết kê khai của ${student.studentName}`);
        // Navigate to student detail page
        // router.push(`/DanhSachKeKhai/${formId}/student/${student.id}`);
    };

    const handleReturnSubmission = (student: StudentSubmission) => {
        message.success(`Đã trả về kê khai cho ${student.studentName}`);
        // Implement return submission logic
        // Update student status to TRAVESINHVIEN
    };

    const handleRefresh = () => {
        handleGetStudentList();
    };

    const getStatusTag = (status: number) => {
        if (
            status == StatusConstant.GUIGIAOVIEN ||
            status == StatusConstant.GUILOPTRUONG
        ) {
            return (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                    Đã hoàn thành
                </Tag>
            );
        } else if (status == StatusConstant.DANGKEKHAI) {
            return (
                <Tag color="processing" icon={<ClockCircleOutlined />}>
                    Đang thực hiện
                </Tag>
            );
        } else if (status == StatusConstant.TRAVESINHVIEN) {
            return (
                <Tag color="error" icon={<ClockCircleOutlined />}>
                    Yêu cầu chỉnh sửa
                </Tag>
            );
        } else {
            return (
                <Tag color="default" icon={<FileTextOutlined />}>
                    Chưa bắt đầu
                </Tag>
            );
        }
    };

    const studentColumns = [
        {
            title: "Tên sinh viên",
            dataIndex: "studentName",
            key: "studentName",
            render: (text: string, record: StudentSubmission) => (
                <div className={classes.studentInfo}>
                    <div className={classes.studentName}>{text}</div>
                    <div className={classes.studentId}>
                        MSSV: {record.studentId}
                    </div>
                    <div className={classes.studentContact}>
                        {record.email && <span>📧 {record.email}</span>}
                        {record.phone && <span>📞 {record.phone}</span>}
                    </div>
                </div>
            ),
        },
        {
            title: "Lớp",
            dataIndex: "className",
            key: "className",
        },
        {
            title: "Tình trạng",
            dataIndex: "status",
            key: "status",
            render: (status: number) => getStatusTag(status),
        },
        {
            title: "Ngày nộp",
            dataIndex: "submitDate",
            key: "submitDate",
            render: (date: string) =>
                date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa nộp",
        },
        {
            title: "Tiến độ",
            dataIndex: "progress",
            key: "progress",
            render: (progress: number) => (
                <div className={classes.progressContainer}>
                    <div className={classes.progressBar}>
                        <div
                            className={classes.progressFill}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className={classes.progressText}>{progress}%</span>
                </div>
            ),
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            render: (note: string) => (
                <span className={classes.noteText}>{note || "Không có"}</span>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (record: StudentSubmission) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewStudentDetail(record)}
                            size="small"
                            className={classes.actionButton}
                        />
                    </Tooltip>
                    {record.status === StatusConstant.DANGKEKHAI && (
                        <Tooltip title="Trả về">
                            <Button
                                type="text"
                                icon={<UndoOutlined />}
                                onClick={() => handleReturnSubmission(record)}
                                size="small"
                                danger
                                className={classes.actionButton}
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    if (loading) {
        return (
            <div className={classes.loadingContainer}>
                <Spin size="large" />
                <p>Đang tải thông tin...</p>
            </div>
        );
    }

    if (!formInfo) {
        return (
            <div className={classes.errorContainer}>
                <Alert
                    message="Lỗi"
                    description="Không tìm thấy thông tin form"
                    type="error"
                    showIcon
                />
                <Button onClick={handleBack} style={{ marginTop: 16 }}>
                    Quay lại
                </Button>
            </div>
        );
    }

    return (
        <>
            <AutoBreadcrumb />

            {/* Header Section */}
            <div className={classes.headerSection}>
                <div className={classes.headerContent}>
                    <div className={classes.headerLeft}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBack}
                            className={classes.backButton}
                        >
                            Quay lại
                        </Button>
                        <div className={classes.titleSection}>
                            <h1 className={classes.pageTitle}>
                                <UserOutlined className={classes.titleIcon} />
                                Danh sách sinh viên
                            </h1>
                            <p className={classes.pageDescription}>
                                {formInfo.name} - {formInfo.description}
                            </p>
                        </div>
                    </div>
                    <div className={classes.headerRight}>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                            loading={loadingStudents}
                            className={classes.refreshButton}
                        >
                            Làm mới
                        </Button>
                    </div>
                </div>
            </div>

            {/* Form Info Card */}
            <Card className={classes.formInfoCard} style={{ marginBottom: 20 }}>
                <div className={classes.formInfoContent}>
                    <div className={classes.formInfoLeft}>
                        <h3 className={classes.formName}>{formInfo.name}</h3>
                        <p className={classes.formDescription}>
                            {formInfo.description}
                        </p>
                        <div className={classes.formMeta}>
                            <span>
                                Ngày tạo:{" "}
                                {formInfo.createDate
                                    ? new Date(
                                          formInfo.createDate,
                                      ).toLocaleDateString("vi-VN")
                                    : "Chưa có"}
                            </span>
                            <span>
                                Trạng thái: {getStatusTag(formInfo.status)}
                            </span>
                        </div>
                    </div>
                    <div className={classes.formInfoRight}>
                        <div className={classes.progressSection}>
                            <div className={classes.progressHeader}>
                                <span className={classes.progressLabel}>
                                    Tiến độ hoàn thành
                                </span>
                                <span className={classes.progressPercent}>
                                    {formInfo.processs}%
                                </span>
                            </div>
                            <div className={classes.progressBar}>
                                <div
                                    className={classes.progressFill}
                                    style={{ width: `${formInfo.processs}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Student List Card */}
            <Card
                title={
                    <div className={classes.cardTitle}>
                        <UserOutlined className={classes.cardTitleIcon} />
                        <span>Danh sách sinh viên ({studentList.length})</span>
                    </div>
                }
                className={classes.studentCard}
                extra={
                    <div className={classes.cardExtra}>
                        <span className={classes.studentCount}>
                            {
                                studentList.filter(
                                    (s) =>
                                        s.status ===
                                            StatusConstant.GUIGIAOVIEN ||
                                        s.status ===
                                            StatusConstant.GUILOPTRUONG,
                                ).length
                            }{" "}
                            đã hoàn thành
                        </span>
                    </div>
                }
            >
                <Table
                    columns={studentColumns}
                    dataSource={studentList}
                    rowKey="id"
                    loading={loadingStudents}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} sinh viên`,
                    }}
                    className={classes.studentTable}
                />
            </Card>
        </>
    );
};

export default withAuthorization(DanhSachKeKhaiDetail, "");
