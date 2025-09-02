import React, { useEffect, useState } from "react";
import { Form, FormProps, Input, Select, DatePicker, Modal, Col, Row } from "antd";
import { toast } from "react-toastify";
import {
  ArcPlanCreateOrUpdateType,
  ArcPlanType,
} from "@/types/arcPlan/arcPlan";
import * as extensions from "@/utils/extensions";
import arcPlanService from "@/services/arcPlan/arcPlanService";
import { DropdownOption } from "@/types/general";
import { removeAccents } from "@/libs/CommonFunction";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.locale("vi");
dayjs.extend(utc);

interface Props {
  item?: ArcPlanType | null;
  onClose: () => void;
  onSuccess: () => void;
  dropdownTTKH: DropdownOption[];
}

const ArcPlanCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<ArcPlanCreateOrUpdateType>();
  const handleOnFinish: FormProps<ArcPlanCreateOrUpdateType>["onFinish"] =
    async (formData: ArcPlanCreateOrUpdateType) => {
      if (props.item) {
        const response = await arcPlanService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa  thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await arcPlanService.create(formData);
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
        startDate: props.item.startDate ? dayjs.utc(props.item.startDate) : null,
        endDate: props.item.endDate ? dayjs.utc(props.item.endDate) : null,
      });
    }

  }, [form, props.item]);


  return (
    <Modal
      title={props.item != null ? "Chỉnh sửa " : "Thêm mới "}
      open={true}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      width={1000}
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
          <Form.Item<ArcPlanCreateOrUpdateType> name="id" hidden>
            <Input />
          </Form.Item>
        )}

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item<ArcPlanCreateOrUpdateType>
              label="Mã kế hoạch"
              name="planID"
              rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
            >
              <Input placeholder="Mã kế hoạch" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<ArcPlanCreateOrUpdateType>
              label="Tên kế hoạch"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
            >
              <Input placeholder="Tên kế hoạch" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item<ArcPlanCreateOrUpdateType>
              label="Thời gian bắt đầu"
              name="startDate"
              rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
            >
              <DatePicker format="DD/MM/YYYY" className="w-100" placeholder="Thời gian bắt đầu" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<ArcPlanCreateOrUpdateType>
              label="Thời gian kết thúc"
              name="endDate"
              rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
            >
              <DatePicker format="DD/MM/YYYY" className="w-100" placeholder="Thời gian kết thúc" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item<ArcPlanCreateOrUpdateType>
              label="Phương án thu thập"
              name="method"
              rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
            >
              <Input placeholder="Phương án thu thập" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<ArcPlanCreateOrUpdateType>
              label="Kết quả dự kiến"
              name="outcome"
              rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
            >
              <Input placeholder="Kết quả dự kiến" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item<ArcPlanCreateOrUpdateType>
              label="Trạng thái kế hoạch"
              name="status"
              rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
            >
              <Select
                placeholder="Thời hạn bảo quản"
                options={props.dropdownTTKH}
                allowClear
                showSearch
                filterOption={(input, option) => {
                  return removeAccents(option?.label ?? "")
                    .toLowerCase()
                    .includes(removeAccents(input).toLowerCase());
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<ArcPlanCreateOrUpdateType>
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
            >
              <Input placeholder="Mô tả" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={24}>
            <Form.Item<ArcPlanCreateOrUpdateType>
              label="Ghi chú"
              name="ghiChu"
              rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
            >
              <Input placeholder="Ghi chú" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>

  );
};
export default ArcPlanCreateOrUpdate;
