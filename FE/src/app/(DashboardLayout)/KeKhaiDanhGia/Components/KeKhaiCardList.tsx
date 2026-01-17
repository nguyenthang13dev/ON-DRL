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
    onSendToGV: (form: FormAssignByUser) => void;
    onViewStudents?: (form: FormAssignByUser) => void;
}

const KeKhaiCardList: React.FC<KeKhaiCardListProps> = ({
    formList,
    loading,
    onViewDetail,
    onKeKhai,
    onSendToClassLeader,
    onSendToGV,
    onViewStudents,
}) => {

    const user = useSelector((state) => state.auth.User);
    const roles = user?.listRole ?? [];
    console.log(roles);
    
    const [selectedForm, setSelectedForm] = useState<FormAssignByUser | null>(
        null,
    );
    const [showStudentModal, setShowStudentModal] = useState(false);
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
        setShowStudentModal(true);
         setSelectedForm(form);
    };

    console.log(roles.includes(  RoleConstant.GIAOVIEN ));
    

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
                                roles.includes( RoleConstant.LOPTRUONG ) || roles.includes(RoleConstant.GIAOVIEN) ? (
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
                                ( (form.status === StatusConstant.CHUAKEKHAI
                                    || form.status === StatusConstant.DANGKEKHAI
                                    || form.status == StatusConstant.TRAVESINHVIEN)
                                && !roles.includes(RoleConstant.GIAOVIEN)) && ( <Tooltip title="Kê khai số liệu" key="kekhai">
                                      <Button
                                          type="primary"
                                          icon={<FileTextOutlined />}
                                          onClick={() => onKeKhai(form)}
                                          size="small"
                                          className={classes.declareButton}
                                      >
                                          Kê khai
                                      </Button>
                                </Tooltip>),
                                ( (
                                    form.status === StatusConstant.DANGKEKHAI
                                    || form.status === StatusConstant.CHUAKEKHAI
                                ) && !roles.includes(RoleConstant.GIAOVIEN)) && ( <Tooltip title="Gửi lớp trưởng" key="send">
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
                                </Tooltip>),
                                (roles.includes( RoleConstant.LOPTRUONG ) && form.status !== StatusConstant.GUIGIAOVIEN) ? (
                                    <Tooltip title="Gửi giáo viên" key="sendGV">
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={() =>
                                                onSendToGV(form)
                                            }
                                            size="small"
                                            className={classes.sendButton}
                                        >
                                            Gửi GV
                                        </Button>
                                    </Tooltip>
                                ) : ( <></> ),
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
                idForm={selectedForm?.formId}
            />
        </>
    );
};

export default KeKhaiCardList;
