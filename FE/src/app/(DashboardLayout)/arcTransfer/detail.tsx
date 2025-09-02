'use client';

import React, {useState} from 'react';
import {Button, Descriptions, Drawer, Modal, Space, Typography} from "antd";
import {ArcTransferType} from "@/types/arcTransfer/arcTransfer";
import {
    ApartmentOutlined,
    BoxPlotOutlined,
    CalendarOutlined,
    DownloadOutlined,
    EyeOutlined,
    FileExcelOutlined,
    FileImageOutlined,
    FileOutlined,
    FilePdfOutlined,
    FileTextOutlined,
    FileWordOutlined,
    FolderOutlined,
    InfoCircleOutlined,
    TeamOutlined
} from '@ant-design/icons';
import dayjs from "dayjs";

const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

const {Title} = Typography;

interface ArcTransferDetailProps {
    record?: ArcTransferType | null;
    visible: boolean;
    onClose: () => void;
}

const ArcTransferDetail: React.FC<ArcTransferDetailProps> = ({
                                                                 record,
                                                                 visible,
                                                                 onClose
                                                             }) => {
    const [fileViewerOpen, setFileViewerOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState<{ url: string; name: string }>({
        url: '',
        name: '',
    });

    if (!record) return null;


    const getFileIcon = (fileName: string) => {
        if (!fileName) return <FileOutlined/>;
        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf':
                return <FilePdfOutlined style={{color: '#ff4d4f'}}/>;
            case 'doc':
            case 'docx':
                return <FileWordOutlined style={{color: '#1890ff'}}/>;
            case 'xls':
            case 'xlsx':
                return <FileExcelOutlined style={{color: '#52c41a'}}/>;
            case 'png':
            case 'jpg':
            case 'jpeg':
                return <FileImageOutlined style={{color: '#faad14'}}/>;
            default:
                return <FileOutlined/>;
        }
    };

    const openFileViewer = (fileUrl: string, fileName: string) => {
        setCurrentFile({url: fileUrl, name: fileName});
        setFileViewerOpen(true);
    };

    const renderFileContent = () => {
        const fileExt = currentFile.name.split('.').pop()?.toLowerCase();

        if (fileExt === 'pdf') {
            return (
                <iframe
                    src={`${currentFile.url}#toolbar=0&navpanes=0&scrollbar=0`}
                    style={{width: '100%', height: '70vh'}}
                    title="PDF Viewer"
                />
            );
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '')) {
            return (
                <img
                    src={currentFile.url}
                    alt={currentFile.name}
                    style={{maxWidth: '100%', maxHeight: '70vh', margin: '0 auto', display: 'block'}}
                />
            );
        } else if (['doc', 'docx', 'xls', 'xlsx'].includes(fileExt || '')) {
            return (
                <div className="text-center p-4 w-50 mx-auto"> {/* Added mx-auto, removed justify-content-center */}
                    <p>Không thể hiển thị trực tiếp file {fileExt}. Vui lòng tải xuống để xem.</p>
                    <a href={currentFile.url} download target="_blank" rel="noopener noreferrer">
                        <Button type="primary" icon={<DownloadOutlined/>}>
                            Tải xuống
                        </Button>
                    </a>
                </div>
            );
        } else {
            return (
                <div className="text-center p-4 w-50 mx-auto"> {/* Added mx-auto */}
                    <p>Không thể xem trước loại file này.</p>
                    <a href={currentFile.url} download target="_blank" rel="noopener noreferrer">
                        <Button type="primary" icon={<DownloadOutlined/>}>
                            Tải xuống
                        </Button>
                    </a>
                </div>
            );
        }
    };

    return (
        <>
            <Drawer
                title={
                    <div className="text-l font-bold text-gray-800 tracking-wide">
                        Chi tiết biên bản bàn giao tài liệu
                    </div>
                }
                width="700px"
                placement="right"
                onClose={onClose}
                closable={true}
                open={visible}
                styles={{
                    header: {
                        borderBottom: "2px solid #e5e7eb",
                        padding: "16px 24px",
                    },
                    body: {
                        backgroundColor: "#fafafa",
                        borderRadius: "8px",
                        padding: "20px",
                    },
                    footer: {
                        textAlign: 'center', // Aligns the button to the right
                        borderTop: "1px solid #e5e7eb", // Optional: adds a separator line
                        padding: "10px 24px", // Optional: adds some padding
                    }
                }}
                footer={
                    <Button type="primary" onClick={onClose}>
                        Đóng
                    </Button>
                }
            >
                {/* Existing drawer content */}
                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                    <Title level={5} className="mb-4 flex items-center">
                        <FileOutlined className="mr-2"/>
                        {record.tenKhoiTaiLieu || "--"}
                    </Title>

                    <Descriptions bordered column={1} size="small" className="mb-4">
                        <Descriptions.Item label="Căn cứ">{record.canCu || "--"}</Descriptions.Item>

                        <Descriptions.Item
                            label={<div className="flex items-center"><TeamOutlined className="mr-2"/>Người giao</div>}
                        >
                            {record.tenUserGiao || "--"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Chức vụ người giao">{record.chucVuGiao || "--"}</Descriptions.Item>

                        <Descriptions.Item
                            label={<div className="flex items-center"><TeamOutlined className="mr-2"/>Người nhận</div>}
                        >
                            {record.tenUserNhan || "--"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Chức vụ người nhận">{record.chucVuNhan || "--"}</Descriptions.Item>

                        <Descriptions.Item
                            label={<div className="flex items-center"><CalendarOutlined className="mr-2"/>Ngày giao nhận
                            </div>}
                        >
                            {record.ngayGiaoNhan ? dayjs(record.ngayGiaoNhan).format('DD/MM/YYYY') : "--"}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={<div className="flex items-center"><ApartmentOutlined className="mr-2"/>Nguồn giao
                                nhận</div>}
                        >
                            {record.tenNguonGiaoNhan || "--"}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={<div className="flex items-center"><BoxPlotOutlined className="mr-2"/>Tổng số hộp
                            </div>}
                        >
                            {record.tongSoHop || "0"}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={<div className="flex items-center"><FolderOutlined className="mr-2"/>Tổng số hồ sơ
                            </div>}
                        >
                            {record.tongSoHoSo || "0"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Số mét hồ sơ">{record.soMetHoSo || "0"}</Descriptions.Item>
                        <Descriptions.Item label="Thời gian hồ sơ">{record.thoiGianHoSo || "--"}</Descriptions.Item>

                        <Descriptions.Item
                            label={<div className="flex items-center"><FileTextOutlined className="mr-2"/>Tổng số hồ sơ
                                điện tử</div>}
                        >
                            {record.tongSoHoSoDienTu || "0"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tổng số tệp tin">{record.tongSoTepTin || "0"}</Descriptions.Item>

                        <Descriptions.Item
                            label={<div className="flex items-center"><InfoCircleOutlined className="mr-2"/>Tình trạng
                                tài liệu</div>}
                        >
                            {record.tinhTrangTaiLieu || "--"}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <div className="flex items-center">
                                    <FileOutlined className="mr-2"/>
                                    Tệp đính kèm
                                </div>
                            }
                            span={3}
                        >
                            {record.bienBanDinhKem?.length ? (
                                <ul className="pl-0 list-none">
                                    {record.bienBanDinhKem.map(({id, duongDanFile,tenTaiLieu}, index) => {
                                        const fileName = tenTaiLieu || `File ${index + 1}`;
                                        const fileUrl = `${StaticFileUrl}${duongDanFile}`;

                                        return (
                                            <li key={id} className="mb-2 flex items-center">
                                                {getFileIcon(fileName)}
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        openFileViewer(fileUrl, fileName);
                                                    }}
                                                    className="mx-2 hover:underline text-blue-600"
                                                >
                                                    {fileName}
                                                </a>
                                                <Space>
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        icon={<EyeOutlined/>}
                                                        onClick={() => openFileViewer(fileUrl, fileName)}
                                                        title="Xem tệp"
                                                    />
                                                    <a href={fileUrl} download target="_blank"
                                                       rel="noopener noreferrer">
                                                        <Button
                                                            type="link"
                                                            size="small"
                                                            icon={<DownloadOutlined/>}
                                                            title="Tải xuống"
                                                        />
                                                    </a>
                                                </Space>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <span className="text-gray-500">Không có tệp đính kèm</span>
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </Drawer>

            {/* File Viewer Modal */}
            <Modal
                title={currentFile.name}
                open={fileViewerOpen}
                onCancel={() => setFileViewerOpen(false)}
                width="50%"
                footer={
                    record.bienBanDinhKem?.length ? (
                        [
                            <Button type="primary" key="close" onClick={() => setFileViewerOpen(false)}>
                                Đóng
                            </Button>,
                        ]
                    ) : (
                        [
                            <a
                                key="download"
                                href={currentFile.url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button type="primary" icon={<DownloadOutlined/>}>
                                    Tải xuống
                                </Button>
                            </a>,
                        ]
                    )
                }
            >
                {renderFileContent()}
            </Modal>
        </>
    );
};

export default ArcTransferDetail;