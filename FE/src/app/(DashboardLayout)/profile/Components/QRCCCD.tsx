import { userService } from "@/services/user/user.service";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Image, Modal, Upload } from "antd";
import { useState } from "react";
import styles from "./avatar.module.css";

const ChangeQRCCCD = ({
    onClose,
    onSuccess,
}: {
    onClose: () => void;
    onSuccess: () => void;
}) => {
    const handleCancel = () => {
        onClose();
    };
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

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
            const response = await userService.UpdateQRCCD(file);
            if (response.status) {
                onSuccess();
            }
        }
    };
    return (
        <div className={styles.modalWrapper}>
            <Modal
                title="Thay đổi QR CCCD"
                open={true}
                onOk={handleOK}
                onCancel={handleCancel}
                okText="Xác nhận"
                cancelText="Đóng"
            >
                <div className={styles.uploadContainer}>
                    <div className={styles.previewImage}>
                        <Image
                            src={preview ?? undefined}
                            alt="Ảnh đại diện mới"
                            width={200}
                            height={200}
                            fallback="/img/default-image.jpg"
                        />
                    </div>
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
export default ChangeQRCCCD;
