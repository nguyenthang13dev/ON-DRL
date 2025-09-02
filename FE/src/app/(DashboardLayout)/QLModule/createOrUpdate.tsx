import {
  Button,
  DatePicker,
  Form,
  FormProps,
  Image,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { tableModuleType, createEditType } from "@/types/menu/menu";
import { moduleService } from "@/services/module/module.service";
import { UploadOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib";
dayjs.locale("vi");

interface Props {
  isOpen: boolean;
  module?: tableModuleType | null;
  onClose: () => void; //function callback
  onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleOnFinish: FormProps<createEditType>["onFinish"] = async (
    formData: createEditType
  ) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("code", formData.code ?? "");
      formDataToSend.append("name", formData.name ?? "");
      formDataToSend.append("order", formData.order?.toString() ?? "");
      formDataToSend.append("isShow", formData.isShow?.toString() ?? "");
      formDataToSend.append("classCss", formData.classCss ?? "");
      formDataToSend.append("styleCss", formData.styleCss ?? "");

      let fileToUpload = null;

      // Nếu đã có file trong fileList thì ưu tiên dùng
      if (fileList.length > 0 && fileList[0].originFileObj) {
        fileToUpload = fileList[0].originFileObj;
      }
      // Nếu không có file sẵn thì lấy file mới được upload từ formData
      else if (formData.fileIcon?.fileList?.length > 0) {
        fileToUpload = formData.fileIcon.fileList[0].originFileObj;
      }

      if (fileToUpload) {
        formDataToSend.append("fileIcon", fileToUpload);
      }

      let response;
      if (props.module) {
        formDataToSend.append("id", formData.id ?? "");

        response = await moduleService.Update(formDataToSend);
      } else {
        response = await moduleService.Create(formDataToSend);
      }

      if (response.status) {
        toast.success(
          props.module
            ? "Chỉnh sửa chức năng thành công"
            : "Tạo chức năng thành công"
        );
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

  const handleMapEdit = () => {
    form.setFieldsValue(props.module);

    if (props.module?.duongDanIcon) {
      setFileList([
        {
          uid: "-1",
          name: "icon.png",
          status: "done",
          url: `${process.env.NEXT_PUBLIC_API_URL}/Uploads/${props.module.duongDanIcon}`,
        },
      ]);
    } else {
      setFileList([]);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.module) {
      handleMapEdit();
    }
  }, [props.isOpen]);

  return (
    <Modal
      title={
        props.module != null ? "Chỉnh sửa chức năng" : "Thêm mới chức năng"
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
        {props.module && (
          <Form.Item<createEditType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item<createEditType>
          label="Mã chức năng"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<createEditType>
          label="Tên chức năng"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<createEditType>
          label="Thứ tự"
          name="order"
          rules={[
            {
              type: "number",
              min: 0,
              message: "Giá trị phải lớn hơn hoặc bằng 0",
            },
          ]}
        >
          <InputNumber
            name="order"
            style={{ width: "100%" }}
            defaultValue={0}
            min={0}
          />
        </Form.Item>

        <Form.Item<createEditType>
          label="Trạng thái"
          name="isShow"
          initialValue={true}
        >
          <Radio.Group>
            <Radio value={true}> Hiển thị </Radio>
            <Radio value={false}> Không hiển thị </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<createEditType> label="Icon" name="fileIcon">
          <Upload
            name="fileIcon"
            listType="picture"
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        </Form.Item>

        <Form.Item<createEditType> label="Class Css" name="classCss">
          <Input />
        </Form.Item>
        <Form.Item<createEditType> label="Style Css" name="styleCss">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateOrUpdate;
