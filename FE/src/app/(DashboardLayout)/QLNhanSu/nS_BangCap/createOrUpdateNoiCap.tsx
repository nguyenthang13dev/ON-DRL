import React, { useEffect, useState } from "react";
import { Form, FormProps, Input, Modal, Row, Col, TreeSelect } from "antd";
import { toast } from "react-toastify";
import TextArea from "antd/es/input/TextArea";
import UploadFiler from "@/libs/UploadFilter";
import { UploadFile } from "antd/lib";
import { duLieuDanhMucService } from "@/services/duLieuDanhMuc/duLieuDanhMuc.service";
import {
  createEditType,
  tableDuLieuDanhMucDataType,
} from "@/types/duLieuDanhMuc/duLieuDanhMuc";
import { trimEnd } from "lodash";

const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

interface Props {
  isOpen: boolean;
  groupId: string;
  trinhDoId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateOrUpdateNoiCap: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedData, setUploadedData] = useState<string[]>([]);

  const handleOnFinish: FormProps<createEditType>["onFinish"] = async (
    formData: createEditType
  ) => {
    const trimmedData: tableDuLieuDanhMucDataType = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    ) as tableDuLieuDanhMucDataType;

    if (uploadedData.length > 0) {
      trimmedData.fileDinhKem = uploadedData[0];
    }

    // Thêm groupId và donViId vào payload
    trimmedData.groupId = props.groupId;
    trimmedData.parentId = props.trinhDoId;
    trimmedData.donViId = props.trinhDoId;

    try {
      const response = await duLieuDanhMucService.Create(trimmedData);
      if (response.status) {
        toast.success("Thêm mới nơi cấp thành công");
        form.resetFields();
        props.onSuccess();
        props.onClose();
      } else {
        toast.error(response.message);
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
      title="Thêm mới nơi cấp"
      open={isOpen}
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
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<createEditType>
              label="Mã nơi cấp"
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
                { max: 255, message: "Không được nhập quá 255 ký tự!" },
                {
                  pattern: /^[a-zA-Z0-9_-]+$/,
                  message: "Mã chỉ được chứa chữ cái, số, dấu - và _",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<createEditType>
              label="Tên nơi cấp"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
                { max: 255, message: "Không được nhập quá 255 ký tự!" },
                {
                  pattern: /^[\p{L}0-9 _:,;()\/\-"]+$/u,
                  message:
                    'Chỉ được chứa chữ cái, số, dấu cách và các ký tự - _ : , ; ( ) / "',
                },
                {
                  validator: (_, value) => {
                    if (value && value.trim() === "") {
                      return Promise.reject(
                        "Không được chỉ nhập khoảng trắng!"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item<createEditType>
              label="Ghi chú"
              name="note"
              rules={[
                {
                  pattern: /^[\p{L}0-9 _:,;()\/\-"]+$/u,
                  message:
                    'Chỉ được chứa chữ cái, số, dấu cách và các ký tự - _ : , ; ( ) / "',
                },
                {
                  validator: (_, value) => {
                    if (value && value.trim() === "") {
                      return Promise.reject(
                        "Không được chỉ nhập khoảng trắng!"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item<createEditType> label="File đính kèm">
              <UploadFiler
                maxFiles={1}
                fileList={fileList}
                setFileList={setFileList}
                type="FileDuLieuDanhMuc"
                setUploadedData={setUploadedData}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdateNoiCap;
