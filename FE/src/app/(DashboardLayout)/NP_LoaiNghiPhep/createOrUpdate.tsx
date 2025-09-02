import { Form, FormProps, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { nP_LoaiNghiPhepService } from "@/services/NghiPhep/NP_LoaiNghiPhep/NP_LoaiNghiPhep.service";
import { toast } from "react-toastify";
import {
  createEditType,
  tableNP_LoaiNghiPhepDataType,
} from "@/types/NP_LoaiNghiPhep/np_LoaiNghiPhep";

interface Props {
  isOpen: boolean;
  NP_LoaiNghiPhep?: tableNP_LoaiNghiPhepDataType | null;
  onClose: () => void; //function callback
  onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const handleOnFinish: FormProps<createEditType>["onFinish"] = async (
    formData: createEditType
  ) => {
    try {
      if (props.NP_LoaiNghiPhep) {
        const response = await nP_LoaiNghiPhepService.Update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await nP_LoaiNghiPhepService.Create(formData);
        if (response.status) {
          toast.success("Thêm mới thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
          
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  const handleMapEdit = () => {
    form.setFieldsValue(props.NP_LoaiNghiPhep);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.NP_LoaiNghiPhep) {
      handleMapEdit();
    }
  }, [props.isOpen]);

  return (
    <Modal
      title={
        props.NP_LoaiNghiPhep != null
          ? "Chỉnh sửa loại nghỉ phép"
          : "Thêm mới loại nghỉ phép"
      }
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
        {props.NP_LoaiNghiPhep && (
          <Form.Item<createEditType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item<createEditType>
          label="Tên loại phép"
          name="tenLoaiPhep"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<createEditType>
          label="Mã loại phép"
          name="maLoaiPhep"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<createEditType>
          label="Số ngày phép mặc định"
          name="soNgayMacDinh"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateOrUpdate;
