"use client";

import Loading from "@/components/effect-components/Loading";
import KySoInfo from "@/components/signature/SisnatureInfo";
import { RoleConstant } from "@/constants/RoleConstant";
import { StatusConstant } from "@/constants/StatusConstant";
import { keKhaiSummaryService } from "@/services/keKhaiSoLieu/KeKhaiSoLieuService.service";
import { soLieuKeKhaiService } from "@/services/SoLieuKeKhai/soLieuKeKhai.service";
import { useSelector } from "@/store/hooks";
import { upDateKeKhaiSummaryVM } from "@/types/KeKhaiSummary/keKhaiSummary";
import { PdfDisplayType } from "@/types/kySoCauHinh/kySoCauHinh";
import
    {
        CheckCircleOutlined,
        ClockCircleOutlined,
        EyeOutlined,
        FileTextOutlined,
        UndoOutlined,
        UserOutlined
    } from "@ant-design/icons";
import { PdfJs, Viewer, Worker } from "@react-pdf-viewer/core";
import { Button, message, Modal, Space, Spin, Table, Tag, Tooltip } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import classes from "./KeKhaiCardList.module.css";
const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;
const workerUrl = "/pdf.worker.min.js";
interface StudentSubmission {
    id: string;
    studentName: string;
    studentId: string;
    className: string;
    status: number;
    submitDate?: string;
    progress: number;
    note?: string;
    formId?: string;
    userId?: string;
    idDTTienTrinhXuLy?: string;
}

interface StudentListModalProps {
    open: boolean;
    onCancel: () => void;
    formName?: string;
    idForm?: string;
}

const StudentListModal: React.FC<StudentListModalProps> = ({
    open,
    onCancel,
    formName,
    idForm,
}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<StudentSubmission[]>([]);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);
  // PDF hiển thị
  const [pdfDisplay, setPdfDisplay] = useState<PdfDisplayType>({
    displayWidth: 0,
    displayHeight: 0,
    marginLeft: 0,
    marginTop: 5,
  });

    // 3. Xử lý PDF và lấy dữ liệu
      const handleDocumentLoad = useCallback((e: { doc: PdfJs.PdfDocument }) => {
        const doc = e.doc;
        doc.getPage(1).then((page) => {
          const viewport = page.getViewport({ scale: 1 });
          const pdfWidth = viewport.width;
          const pdfHeight = viewport.height;
          const containerWidth = 793;
          const marginLeft = Math.floor((containerWidth - pdfWidth) / 2);
          setPdfDisplay({
            displayWidth: pdfWidth,
            displayHeight: pdfHeight,
            marginLeft,
            marginTop: 5,
          });
        });
      }, [] );
    
    
        const user = useSelector((state) => state.auth.User);
        const roles = user?.listRole ?? [];
    // Gọi API để lấy danh sách sinh viên khi modal mở
    useEffect(() => {
        if (open && idForm) {
            handleGetStudentSubmission();
        }
    }, [open, idForm]);

    const handleGetStudentSubmission = async () => {
        try {
            setLoading(true);
            const response = await keKhaiSummaryService.GetStudentSubmission(
                {
                    pageIndex: 1,
                    pageSize: 20,
                } as any,
                idForm || ""
            );
            if (response.status && response.data) {
                // API trả về object với cấu trúc { items: [], pageIndex, pageSize, totalCount, totalPage }
                const items = response.data.items || response.data;
                setData(Array.isArray(items) ? items : []);
            } else {
                message.error("Không thể tải danh sách sinh viên");
                setData([]);
            }
        } catch (error) {
            console.error("Error loading student submission:", error);
            message.error("Có lỗi xảy ra khi tải dữ liệu");
            setData([]);
        } finally {
            setLoading(false);
        }
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

    const handleViewStudentDetail =  async (student: StudentSubmission) => {
        try {
            setDetailLoading(true);
            const res = await soLieuKeKhaiService.GetDetail(student.formId!, student.userId!);
            if (res.status) {
                setDetailData(res.data);
                setDetailModalOpen(true);
                message.success( `Đã tải chi tiết kê khai của ${student.studentName}` );
            } else {
                message.error("Không thể xem chi tiết");
            }
        } catch (error) {
            console.error("Error loading detail:", error);
            message.error("Có lỗi xảy ra khi tải chi tiết");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleReturnSubmission = async (student: StudentSubmission) => {
        try {
            const response = await keKhaiSummaryService.UpdateStatus({
                formId: student.formId!,
                redirect: StatusConstant.TRAVESINHVIEN,
            } as upDateKeKhaiSummaryVM);
            
            if (response.status) {
                message.success(`Đã trả về kê khai cho ${student.studentName}`);
                // Reload danh sách sau khi trả về thành công
                handleGetStudentSubmission();
            } else {
                message.error("Không thể trả về kê khai");
            }
        } catch (error) {
            console.error("Error returning submission:", error);
            message.error("Có lỗi xảy ra khi trả về kê khai");
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
                    {(record.status === StatusConstant.GUIGIAOVIEN  && roles.includes(RoleConstant.GIAOVIEN)) && (
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
                    {( ( roles.includes( RoleConstant.LOPTRUONG ) && record.status == StatusConstant.GUILOPTRUONG ) || (
                        ( roles.includes(RoleConstant.GIAOVIEN) && record.status == StatusConstant.GUIGIAOVIEN)
                    )) && (
                        <Tooltip title="Ký số">
                            <KySoInfo idBieuMau={record.formId!} idDTTienTrinhXuLy={record.idDTTienTrinhXuLy!} isLopTruongOrGvhd={roles.includes( RoleConstant.GIAOVIEN )
                                || roles.includes(RoleConstant.LOPTRUONG)} idUser={record.userId} />
                        </Tooltip>
                     )}
                </Space>
            ),
        },
    ];




    return (
        <>
            {/* Main Student List Modal */}
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
                {loading ? (
                    <div style={{ textAlign: "center", padding: "50px" }}>
                        <Spin size="large" />
                        <p style={{ marginTop: "16px" }}>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <Table
                        columns={studentColumns}
                        dataSource={data}
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
                )}
            </Modal>

            {/* Detail Modal */}
            <Modal
                title={
                    <div className={classes.modalHeader}>
                        <FileTextOutlined className={classes.modalIcon} />
                        <span>Chi tiết kê khai</span>
                    </div>
                }
                open={detailModalOpen}
                onCancel={() => setDetailModalOpen(false)}
                width={1200}
                footer={null}
                className={classes.detailModal}
            >
                {detailLoading ? (
                    <div style={{ textAlign: "center", padding: "50px" }}>
                        <Spin size="large" />
                        <p style={{ marginTop: "16px" }}>Đang tải chi tiết...</p>
                    </div>
                ) : (
                    <div style={{ padding: "20px" }}>
                        {detailData ? (
                            <div>
                                <Worker workerUrl={workerUrl}>
                                               <Viewer
                                                 fileUrl={`${StaticFileUrl}/${detailData}`}
                                                 defaultScale={1}
                                                 // defaultScale={scale}
                                                 onDocumentLoad={handleDocumentLoad}
                                                 renderLoader={() => <Loading className="mt-12" />}
                                               />
                                             </Worker>
                            </div>
                        ) : (
                            <p>Không có dữ liệu</p>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
};

export default StudentListModal;
