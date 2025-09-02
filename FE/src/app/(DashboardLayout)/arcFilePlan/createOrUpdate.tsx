import React from "react";
import { Form, FormProps, Input, Select, DatePicker, Modal, InputNumber } from "antd";
import { toast } from "react-toastify";
import {
  ArcFilePlanCreateOrUpdateType,
  ArcFilePlanType,
} from "@/types/arcFilePlan/arcFilePlan";
import * as extensions from "@/utils/extensions";
import arcFilePlanService from "@/services/arcFilePlan/arcFilePlanService";

interface Props {
  item?: ArcFilePlanType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ArcFilePlanCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<ArcFilePlanCreateOrUpdateType>();

  const handleOnFinish: FormProps<ArcFilePlanCreateOrUpdateType>["onFinish"] =
    async (formData: ArcFilePlanCreateOrUpdateType) => {
      if (props.item) {
        console.log(props);
        const response = await arcFilePlanService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa  thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await arcFilePlanService.create(formData);
        if (response.status) {
          toast.success("Thêm mới  thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      }
    };

  const handleCancel = () => {
    form.resetFields();
    props.onClose();
  };

  React.useEffect(() => {

    if (props.item) {
      form.setFieldsValue({
        ...props.item,
      });
    }
  }, [form, props.item]);

  return (
    <Modal
      title={
        props.item != null
          ? "Chỉnh sửa "
          : "Thêm mới "
      }
      open={true}
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
        {props.item && (
          <Form.Item<ArcFilePlanCreateOrUpdateType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        {
          <>
            <Form.Item<ArcFilePlanCreateOrUpdateType>
              label="Mã hồ sơ"
              name="fileCode"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input placeholder="Mã hồ sơ" />
            </Form.Item>
            <Form.Item<ArcFilePlanCreateOrUpdateType>
              label="Mục lục hoặc số năm hình thành hồ sơ"
              name="fileCatalog"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <InputNumber
                min={0}
                placeholder="Mục lục hoặc số năm hình thành hồ sơ"
                style={{ width: "100%", borderRadius: "4px" }}
              />
            </Form.Item>
            <Form.Item<ArcFilePlanCreateOrUpdateType>
              label="Số và ký hiệu hồ sơ"
              name="fileNotaion"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input placeholder="Số và ký hiệu hồ sơ" />
            </Form.Item>
            <Form.Item<ArcFilePlanCreateOrUpdateType>
              label="Tiêu đề hồ sơ"
              name="title"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input placeholder="Tiêu đề hồ sơ" />
            </Form.Item>
          </>
        }
      </Form>
    </Modal>
  );
};
export default ArcFilePlanCreateOrUpdate;
