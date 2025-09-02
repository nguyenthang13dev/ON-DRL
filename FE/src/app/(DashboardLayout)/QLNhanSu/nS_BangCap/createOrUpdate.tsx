import React from "react";
import { Form, FormProps, Input, Select, DatePicker, Modal } from "antd";
import { toast } from "react-toastify";
import {
  NS_BangCapCreateOrUpdateType,
  NS_BangCapType,
} from "@/types/QLNhanSu/nS_BangCap/nS_BangCap";
import * as extensions from "@/utils/extensions";
import nS_BangCapService from "@/services/QLNhanSu/nS_BangCap/nS_BangCapService";
import dayjs from "dayjs";
import { DropdownOption } from "@/types/general";
import { duLieuDanhMucService } from "@/services/duLieuDanhMuc/duLieuDanhMuc.service";
import NhomDanhMucConstant from "@/constants/NhomDanhMucConstant";

interface Props {
  item?: NS_BangCapType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const NS_BangCapCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<NS_BangCapCreateOrUpdateType>();
  const [nhanSuList, setNhanSuList] = React.useState<DropdownOption[]>([]);
  const [trinhDoOptions, setTrinhDoOptions] = React.useState<DropdownOption[]>(
    []
  );
  const handleOnFinish: FormProps<NS_BangCapCreateOrUpdateType>["onFinish"] =
    async (formData: NS_BangCapCreateOrUpdateType) => {
      if (props.item) {
        console.log(props);
        const response = await nS_BangCapService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa  thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await nS_BangCapService.create(formData);
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
        ngayCap: props.item.ngayCap ? dayjs(props.item.ngayCap) : null,
      });
    }
  }, [form, props.item]);
  React.useEffect(() => {
    const fetchTrinhDo = async () => {
      try {
        const response = await duLieuDanhMucService.GetDropdown(
          NhomDanhMucConstant.TrinhDoHocVan
        );
        if (response.status) {
          setTrinhDoOptions(
            response.data.map((item: any) => ({
              value: item.value,
              label: item.label,
            }))
          );
        }
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu trình độ");
      }
    };
    fetchTrinhDo();
  }, []);
  return (
    <Modal
      title={props.item != null ? "Chỉnh sửa bằng cấp" : "Thêm mới bằng cấp"}
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
          <Form.Item<NS_BangCapCreateOrUpdateType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        {
          <>
            <Form.Item<NS_BangCapCreateOrUpdateType>
              label="Nhân sự"
              name="nhanSuId"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item<NS_BangCapCreateOrUpdateType>
              label="Trình độ"
              name="trinhDoId"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Select
                placeholder="Chọn trình độ"
                options={trinhDoOptions.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                allowClear
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item<NS_BangCapCreateOrUpdateType>
              label="Ngày cấp"
              name="ngayCap"
            >
              <DatePicker
                format="DD/MM/YYYY"
                className="w-100"
                placeholder="Ngày sinh"
              />
            </Form.Item>
            <Form.Item<NS_BangCapCreateOrUpdateType>
              label="Nơi cấp"
              name="noiCap"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item<NS_BangCapCreateOrUpdateType>
              label="Ghi chú"
              name="ghiChu"
            >
              <Input placeholder="" />
            </Form.Item>
          </>
        }
      </Form>
    </Modal>
  );
};
export default NS_BangCapCreateOrUpdate;
