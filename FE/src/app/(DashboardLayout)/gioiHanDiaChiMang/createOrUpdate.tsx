import React from "react";
import { Form, FormProps, Input, Select, DatePicker, Modal, Checkbox } from "antd";
import { toast } from "react-toastify";
import {
  GioiHanDiaChiMangCreateOrUpdateType,
  GioiHanDiaChiMangType,
} from "@/types/gioiHanDiaChiMang/gioiHanDiaChiMang";
import * as extensions from "@/utils/extensions";
import gioiHanDiaChiMangService from "@/services/gioiHanDiaChiMang/gioiHanDiaChiMangService";
import { Dictionary, DropdownOption } from "@/types/general";
interface Props {
  item?: GioiHanDiaChiMangType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const GioiHanDiaChiMangCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<GioiHanDiaChiMangCreateOrUpdateType>();
  const [dropdowns, setDropdown] = React.useState<Dictionary<DropdownOption[]>>({});
  const handleOnFinish: FormProps<GioiHanDiaChiMangCreateOrUpdateType>["onFinish"] =
    async (formData: GioiHanDiaChiMangCreateOrUpdateType) => {
      if (props.item) {
        console.log(props);
        const response = await gioiHanDiaChiMangService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa  thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await gioiHanDiaChiMangService.create(formData);
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
          ? "Chỉnh sửa địa chỉ mạng"
          : "Thêm mới địa chỉ mạng"
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
          <Form.Item<GioiHanDiaChiMangCreateOrUpdateType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        {
          <>
            <Form.Item<GioiHanDiaChiMangCreateOrUpdateType>
              label="Địa chỉ mạng"
              name="ipAddress"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input placeholder="Địa chỉ mạng" />
            </Form.Item>
            <Form.Item
              name="allowed"
              valuePropName="checked"
              key="allowed">
              <Checkbox>Cho phép truy cập</Checkbox>
            </Form.Item>

          </>
        }
      </Form>
    </Modal>
  );
};
export default GioiHanDiaChiMangCreateOrUpdate;
