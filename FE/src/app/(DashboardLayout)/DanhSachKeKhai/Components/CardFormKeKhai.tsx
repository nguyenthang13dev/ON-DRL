"use client";

import { StatusConstant } from "@/constants/StatusConstant";
import { FormAssignByUser } from "@/types/ConfigForm/ConfigForm";
import
    {
        CheckCircleOutlined,
        ClockCircleOutlined,
        EyeOutlined,
        FileTextOutlined,
        SendOutlined,
        UndoOutlined,
        UserOutlined,
    } from "@ant-design/icons";
import { Button, Card, Modal, Space, Table, Tag, Tooltip, message } from "antd";
import React, { useState } from "react";
import classes from "./KeKhaiCardList.module.css";

interface StudentSubmission
{
    id: string;
    studentName: string;
    studentId: string;
    className: string;
    status: number;
    submitDate?: string;
    progress: number;
    note?: string;
}

interface CardFormKeKhaiProps {
    formList: FormAssignByUser[];
    loading: boolean;
    onViewDetail: (form: FormAssignByUser) => void;
    onKeKhai: (form: FormAssignByUser) => void;
    onSendToClassLeader: (form: FormAssignByUser) => void;
    onViewStudents?: (form: FormAssignByUser) => void;
}

const CardFormKeKhai: React.FC<CardFormKeKhaiProps> = ({
    formList,
    loading,
    onViewDetail,
    onKeKhai,
    onSendToClassLeader,
    onViewStudents,
}) => {
    const [selectedForm, setSelectedForm] = useState<FormAssignByUser | null>(
        null,
    );
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [studentList, setStudentList] = useState<StudentSubmission[]>([]);


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
    
    const handleViewStudents = (form: FormAssignByUser) => {
        if (onViewStudents) {
            onViewStudents(form);
        } else {
            setSelectedForm(form);
            setShowStudentModal(true);
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
        <>
            <div className={classes.cardGrid}>
                {loading
                    ? // Loading skeleton cards
                      Array.from({ length: 6 }).map((_, index) => (
                          <Card
                              key={index}
                              className={classes.evaluationCard}
                              loading
                          />
                      ))
                    : formList.map((form) => (
                          <Card
                              key={form.id}
                              className={classes.evaluationCard}
                              hoverable
                              actions={[
                                  <Tooltip
                                      title="Xem danh sách sinh viên"
                                      key="students"
                                  >
                                      <Button
                                          type="text"
                                          icon={<UserOutlined />}
                                          onClick={() =>
                                              handleViewStudents(form)
                                          }
                                          className={classes.studentButton}
                                      >
                                          Danh sách SV
                                      </Button>
                                  </Tooltip>,
                                  <Tooltip title="Xem chi tiết" key="view">
                                      <Button
                                          type="text"
                                          icon={<EyeOutlined />}
                                          onClick={() => onViewDetail(form)}
                                          className={classes.viewButton}
                                      >
                                          Xem chi tiết
                                      </Button>
                                  </Tooltip>,
                                  <Tooltip
                                      title="Kê khai đánh giá"
                                      key="declare"
                                  >
                                      <Button
                                          type="primary"
                                          icon={<FileTextOutlined />}
                                          onClick={() => onKeKhai(form)}
                                          size="small"
                                          className={classes.declareButton}
                                      >
                                          Kê khai
                                      </Button>
                                  </Tooltip>,
                                  <Tooltip title="Gửi lớp trưởng" key="send">
                                      <Button
                                          type="primary"
                                          icon={<SendOutlined />}
                                          onClick={() =>
                                              onSendToClassLeader(form)
                                          }
                                          size="small"
                                          className={classes.sendButton}
                                      >
                                          Gửi LTT
                                      </Button>
                                  </Tooltip>,
                              ]}
                          >
                              <div className={classes.cardContent}>
                                  {/* Form Info Header */}
                                  <div className={classes.formHeader}>
                                      <div className={classes.formInfo}>
                                          <h3 className={classes.formName}>
                                              {form.name}
                                          </h3>
                                          <p
                                              className={
                                                  classes.formDescription
                                              }
                                          >
                                              {form.description}
                                          </p>
                                      </div>
                                      <div className={classes.statusWrapper}>
                                          {getStatusTag(form.status)}
                                      </div>
                                  </div>

                                  {/* Details Grid */}
                                  <div className={classes.detailsGrid}>
                                      <div className={classes.detailItem}>
                                          <span className={classes.detailLabel}>
                                              Môn học:
                                          </span>
                                          <span className={classes.detailValue}>
                                              {form.name}
                                          </span>
                                      </div>
                                      <div className={classes.detailItem}>
                                          <span className={classes.detailLabel}>
                                              Lớp:
                                          </span>
                                          <span className={classes.detailValue}>
                                              {form.description}
                                          </span>
                                      </div>
                                      <div className={classes.detailItem}>
                                          <span className={classes.detailLabel}>
                                              Ngày tạo:
                                          </span>
                                          <span className={classes.detailValue}>
                                              {form.createDate
                                                  ? new Date(
                                                        form.createDate,
                                                    ).toLocaleDateString(
                                                        "vi-VN",
                                                    )
                                                  : "Chưa có"}
                                          </span>
                                      </div>
                                  </div>

                                  {/* Progress Section */}
                                  <div className={classes.progressSection}>
                                      <div className={classes.progressHeader}>
                                          <span
                                              className={classes.progressLabel}
                                          >
                                              Tiến độ hoàn thành
                                          </span>
                                          <span
                                              className={
                                                  classes.progressPercent
                                              }
                                          >
                                              {form.processs}%
                                          </span>
                                      </div>
                                      <div className={classes.progressBar}>
                                          <div
                                              className={classes.progressFill}
                                              style={{
                                                  width: `${form.processs}%`,
                                              }}
                                          />
                                      </div>
                                  </div>
                              </div>
                          </Card>
                      ))}
            </div>

            {/* Student List Modal */}
            <Modal
                title={
                    <div className={classes.modalHeader}>
                        <UserOutlined className={classes.modalIcon} />
                        <span>Danh sách sinh viên - {selectedForm?.name}</span>
                    </div>
                }
                open={showStudentModal}
                onCancel={() => setShowStudentModal(false)}
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
        </>
    );
};

export default CardFormKeKhai;
