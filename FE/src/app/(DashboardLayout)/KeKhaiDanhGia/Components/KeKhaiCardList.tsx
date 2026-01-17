"use client";

import { RoleConstant } from "@/constants/RoleConstant";
import { StatusConstant } from "@/constants/StatusConstant";
import { useSelector } from "@/store/hooks";
import { FormAssignByUser } from "@/types/ConfigForm/ConfigForm";
import
    {
        CheckCircleOutlined,
        ClockCircleOutlined,
        FileTextOutlined,
        SendOutlined,
        UserOutlined
    } from "@ant-design/icons";
import { Button, Card, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import classes from "./KeKhaiCardList.module.css";
import StudentListModal from "./StudentListModal";

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

interface KeKhaiCardListProps {
    formList: FormAssignByUser[];
    loading: boolean;
    onViewDetail: (form: FormAssignByUser) => void;
    onKeKhai: (form: FormAssignByUser) => void;
    onSendToClassLeader: (form: FormAssignByUser) => void;
    onViewStudents?: (form: FormAssignByUser) => void;
}

const KeKhaiCardList: React.FC<KeKhaiCardListProps> = ({
    formList,
    loading,
    onViewDetail,
    onKeKhai,
    onSendToClassLeader,
    onViewStudents,
}) => {

    const user = useSelector((state) => state.auth.User);
    const roles = user?.listRole ?? [];
    
    const [selectedForm, setSelectedForm] = useState<FormAssignByUser | null>(
        null,
    );
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [studentList, setStudentList] = useState<StudentSubmission[]>([]);

    // Mock data for student submissions - replace with actual API call
    const mockStudentData: StudentSubmission[] = [
        {
            id: "1",
            studentName: "Nguyễn Văn A",
            studentId: "SV001",
            className: "Lớp 10A1",
            status: StatusConstant.GUIGIAOVIEN,
            submitDate: "2024-01-15",
            progress: 100,
            note: "Hoàn thành tốt",
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
        },
        {
            id: "4",
            studentName: "Phạm Thị D",
            studentId: "SV004",
            className: "Lớp 10A1",
            status: StatusConstant.CHUAKEKHAI,
            progress: 0,
            note: "Chưa bắt đầu",
        },
    ];

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
            // Fallback to modal for backward compatibility
            setSelectedForm(form);
            setStudentList(mockStudentData);
            setShowStudentModal(true);
        }
    };



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
                                roles.includes( RoleConstant.LOPTRUONG || RoleConstant.GIAOVIEN ) ? (
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
                                            Danh sách
                                        </Button>
                                    </Tooltip>
                                    ) : (<></>)
                                 ,
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
            <StudentListModal
                open={showStudentModal}
                onCancel={() => setShowStudentModal(false)}
                formName={selectedForm?.name}
                studentList={studentList}
            />
        </>
    );
};

export default KeKhaiCardList;
