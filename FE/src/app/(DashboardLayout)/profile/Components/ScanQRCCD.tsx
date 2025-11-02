import { userService } from "@/services/user/user.service";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Image, message, Modal, Upload } from "antd";
import { useState } from "react";
import styles from "./avatar.module.css";

const ScanQRCCD = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const handleCancel = () => {
        setOpen(false);
    };
    const handleBeforeUpload = (file: File) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            alert("Chỉ cho phép tải file ảnh!");
            return false;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setFile(file);
        return false; // Không upload ngay
    };

    const handleOK = async () => {
        if (file) {
            const response = await userService.CheckQRCCCD(file);
            if (response.status) {
                if (response.data) {
                    message.success("Xác thực thành công");
                } else {
                    message.error("Xác thực thất bại");
                }
            } else {
                message.error("Xác thực thất bại");
            }
        }
    };
    return (
        <div className={styles.modalWrapper}>
            <Button
                onClick={() => {
                    setOpen(true);
                }}
            >
                Xác thực
            </Button>

            <Modal
                title="Scan QR CCCD"
                open={open}
                onOk={handleOK}
                onCancel={handleCancel}
                okText="Xác nhận"
                cancelText="Đóng"
            >
                <div className={styles.uploadContainer}>
                    <Image
                        src={preview ?? undefined}
                        alt="QR"
                        width={200}
                        height={200}
                        fallback="/img/default-image.jpg"
                    />

                    <Upload
                        accept="image/*"
                        beforeUpload={handleBeforeUpload}
                        showUploadList={false}
                    >
                        <Button
                            size="small"
                            icon={<UploadOutlined />}
                            className={styles.uploadButton}
                        >
                            Chọn ảnh từ máy
                        </Button>
                    </Upload>
                </div>
            </Modal>
        </div>
    );
};
export default ScanQRCCD;
