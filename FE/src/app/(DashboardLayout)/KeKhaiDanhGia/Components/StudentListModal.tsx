"use client";

import { StatusConstant } from "@/constants/StatusConstant";
import
    {
        CheckCircleOutlined,
        ClockCircleOutlined,
        EyeOutlined,
        FileTextOutlined,
        UndoOutlined,
        UserOutlined,
    } from "@ant-design/icons";
import { Button, Modal, Space, Table, Tag, Tooltip, message } from "antd";
import React from "react";
import classes from "./KeKhaiCardList.module.css";

interface StudentSubmission {
    id: string;
    studentName: string;
    studentId: string;
    className: string;
    status: number;
    submitDate?: string;
    progress: number;
    note?: string;
}

interface StudentListModalProps {
    open: boolean;
    onCancel: () => void;
    formName?: string;
    studentList: StudentSubmission[];
}

const StudentListModal: React.FC<StudentListModalProps> = ({
    open,
    onCancel,
    formName,
    studentList,
}) => {
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

    const handleViewStudentDetail = (student: StudentSubmission) => {
        message.info(`Xem chi tiết kê khai của ${student.studentName}`);
        // Implement view student detail logic
    };

    const handleReturnSubmission = (student: StudentSubmission) => {
        message.success(`Đã trả về kê khai cho ${student.studentName}`);
        // Implement return submission logic
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
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Modal
            title={
                <div className={classes.modalHeader}>
                    <UserOutlined className={classes.modalIcon} />
                    <span>Danh sách sinh viên - {formName}</span>
                </div>
            }
            open={open}
            onCancel={onCancel}
            width={1000}
            footer={null}
            className={classes.studentModal}
        >
            <Table
                columns={studentColumns}
                dataSource={studentList}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} sinh viên`,
                }}
                className={classes.studentTable}
            />
        </Modal>
    );
};

export default StudentListModal;
