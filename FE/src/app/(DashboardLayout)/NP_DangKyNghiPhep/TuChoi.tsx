import { HuyDangKyType } from "@/types/NP_DangKyNghiPhep/NP_DangKyNghiphep";
import { Form, FormProps, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { nP_DangKyNghiPhepService } from "@/services/NghiPhep/NP_DangKyNghiPhep/NP_DangKyNghiPhep.service";
import { toast } from "react-toastify";

const { TextArea } = Input;

interface Props {
  id: string;
  trangThai: number;
  isOpen: boolean;
  onClose: () => void; //function callback
  onSuccess: (trangThai: number) => void;
}

const TuChoi: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);

  const handleOnFinish: FormProps<HuyDangKyType>["onFinish"] = async (
    formData: HuyDangKyType
  ) => {
    try {
      if (props.id) {
        const response = await nP_DangKyNghiPhepService.TuChoi(
          props.id,
          formData
        );
        if (response.status) {
          toast.success("Từ chối đơn xin nghỉ phép thành công");
          form.resetFields();
          props.onSuccess(props.trangThai);
          props.onClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  return (
    <Modal
      title="Từ chối đơn đăng ký nghỉ phép"
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      width={600}
    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdate"
        style={{ maxWidth: 1000 }}
        onFinish={handleOnFinish}
        autoComplete="off"
      >
        <Form.Item<HuyDangKyType>
          label="Lý do từ chối"
          name="lyDoTuChoi"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <TextArea
            rows={4}
            showCount={true}
            placeholder="Giới hạn 255 ký tự"
            maxLength={255}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default TuChoi;
