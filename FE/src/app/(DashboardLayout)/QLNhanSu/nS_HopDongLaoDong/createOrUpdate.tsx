import React from "react";
import { Form, FormProps, Input, Select, DatePicker, Modal } from "antd";
import { toast } from "react-toastify";
import {
  NS_HopDongLaoDongCreateOrUpdateType,
  NS_HopDongLaoDongType,
} from "@/types/QLNhanSu/nS_HopDongLaoDong/nS_HopDongLaoDong";
import * as extensions from "@/utils/extensions";
import nS_HopDongLaoDongService from "@/services/QLNhanSu/nS_HopDongLaoDong/nS_HopDongLaoDongService";
import dayjs from "dayjs";
import LoaiHopDongLaoDongConstant from "@/constants/QLNhanSu/LoaiHopDongLaoDongConstant";

interface Props {
  item?: NS_HopDongLaoDongType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const NS_HopDongLaoDongCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<NS_HopDongLaoDongCreateOrUpdateType>();

  const handleOnFinish: FormProps<NS_HopDongLaoDongCreateOrUpdateType>["onFinish"] =
    async (formData: NS_HopDongLaoDongCreateOrUpdateType) => {
      if (props.item) {
        console.log(props);
        const response = await nS_HopDongLaoDongService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa  thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        console.log(formData);
        const response = await nS_HopDongLaoDongService.create(formData);
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
        ngayKy: props.item.ngayKy ? dayjs(props.item.ngayKy) : null,
        ngayHetHan: props.item.ngayHetHan ? dayjs(props.item.ngayHetHan) : null,
      });
    }
  }, [form, props.item]);

  return (
    <Modal
      title={
        props.item != null
          ? "Chỉnh sửa hợp đồng lao động"
          : "Thêm mới hợp đồng lao động"
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
          <Form.Item<NS_HopDongLaoDongCreateOrUpdateType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        {
          <>
            <Form.Item<NS_HopDongLaoDongCreateOrUpdateType>
              label="Nhân sự"
              name="nhanSuId"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input placeholder="Nhân sự" />
            </Form.Item>
            <Form.Item<NS_HopDongLaoDongCreateOrUpdateType>
              label="Ngày ký"
              name="ngayKy"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                className="w-100"
                placeholder="Ngày ký"
              />
            </Form.Item>
            <Form.Item<NS_HopDongLaoDongCreateOrUpdateType>
              label="Ngày hết hạn"
              name="ngayHetHan"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                className="w-100"
                placeholder="Ngày hết hạn"
              />
            </Form.Item>
            <Form.Item<NS_HopDongLaoDongCreateOrUpdateType>
              label="Loại hợp đồng"
              name="loaiHopDong"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Select
                placeholder="Chọn loại hợp đồng"
                options={LoaiHopDongLaoDongConstant.getDropdownOption()}
                allowClear
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item<NS_HopDongLaoDongCreateOrUpdateType>
              label="Số hợp đồng"
              name="soHopDong"
            >
              <Input placeholder="Số hợp đồng" />
            </Form.Item>
            <Form.Item<NS_HopDongLaoDongCreateOrUpdateType>
              label="Ghi chú"
              name="ghiChu"
            >
              <Input placeholder="Ghi chú" />
            </Form.Item>
          </>
        }
      </Form>
    </Modal>
  );
};
export default NS_HopDongLaoDongCreateOrUpdate;
