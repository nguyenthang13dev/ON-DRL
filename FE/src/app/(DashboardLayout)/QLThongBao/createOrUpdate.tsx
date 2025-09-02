import {
  Form,
  FormProps,
  Input,
  DatePicker,
  Modal,
  Radio,
  Card,
  Row,
  Col,
  Select,
  TreeSelect,
} from "antd";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  QLThongBaoCreateOrUpdateType,
  QLThongBaoType,
} from "@/types/QLThongBao/QLThongBao";
import QLThongBaoService from "@/services/QLThongBao/QLThongBaoService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  DropdownOption,
  DropdownTreeOptionAntd,
  ResponsePageInfo,
} from "@/types/general";
dayjs.locale("vi");
dayjs.extend(utc);
interface Props {
  item?: QLThongBaoType | null;
  onClose: () => void;
  onSuccess: () => void;
  typeNotifyDropdown: DropdownOption[];
}
const QLThongBaoCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<QLThongBaoCreateOrUpdateType>();

  useEffect(() => {
    if (props.item) {
      form.setFieldsValue({
        id: props.item.id,
        tieuDe: props.item.tieuDe,
        noiDung: props.item.noiDung,
        loaiThongBao: props.item.loaiThongBao,
      });
    } else {
      // Set default value when creating new
      form.setFieldsValue({
        loaiThongBao: props.typeNotifyDropdown[0]?.value,
      });
    }
  }, [props.item, form, props.typeNotifyDropdown]);

  const handleOnFinish: FormProps<QLThongBaoCreateOrUpdateType>["onFinish"] =
    async (formData: QLThongBaoCreateOrUpdateType) => {
      if (props.item) {
        console.log(props.item);
        console.log(formData);
        const response = await QLThongBaoService.Update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa thông tin thông báo thành công!");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await QLThongBaoService.Create(formData);
        if (response.status) {
          toast.success("Thêm mới thông tin thông báo thành công!");
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
  return (
    <Modal
      title={
        props.item != null
          ? "Chỉnh sửa thông tin thông báo"
          : "Thêm mới thông tin thông báo"
      }
      open={true}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      width="50%"
    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdate"
        onFinish={handleOnFinish}
        autoComplete="off"
        className="w-full"
      >
        {props.item && (
          <Form.Item<QLThongBaoCreateOrUpdateType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<QLThongBaoCreateOrUpdateType>
              label="Tiêu đề"
              name="tieuDe"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input placeholder="Tiêu đề" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<QLThongBaoCreateOrUpdateType>
              label="Nội dung"
              name="noiDung"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập nội dung thông báo!",
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<QLThongBaoCreateOrUpdateType>
              label="Loại thông báo"
              name="loaiThongBao"
              initialValue={props.typeNotifyDropdown[0]?.label}
            >
              <Select
                allowClear
                placeholder="Loại thông báo"
                fieldNames={{ label: "label", value: "value" }}
                options={props.typeNotifyDropdown}
              ></Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default QLThongBaoCreateOrUpdate;
