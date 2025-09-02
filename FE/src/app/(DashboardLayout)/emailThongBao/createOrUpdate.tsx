import React, { ForwardedRef, useState, useRef, useMemo } from "react";
import {
  Form,
  FormProps,
  Input,
  Select,
  DatePicker,
  Modal,
  Row,
  Col,
} from "antd";
import { toast } from "react-toastify";
import {
  EmailThongBaoCreateOrUpdateType,
  EmailThongBaoType,
} from "@/types/emailThongBao/emailThongBao";
import * as extensions from "@/utils/extensions";
import emailThongBaoService from "@/services/emailThongBao/emailThongBaoService";
const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

interface Props {
  item?: EmailThongBaoType | null;
  onClose: () => void;
  onSuccess: () => void;
}

import dynamic from "next/dynamic";
import type { ReactQuillProps } from "react-quill";
import { uploadFileService } from "@/services/File/uploadFile.service";
const QuillEditor = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    const QuillComponent = ({
      forwardedRef,
      ...props
    }: ReactQuillProps & { forwardedRef?: ForwardedRef<any> }) => (
      <RQ ref={forwardedRef} {...props} />
    );

    QuillComponent.displayName = "QuillComponent"; // Đặt displayName để tránh lỗi

    return QuillComponent;
  },
  {
    ssr: false,
  }
);

const EmailThongBaoCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<EmailThongBaoCreateOrUpdateType>();

  const [editorValue, setEditorValue] = useState<string>("");
  const quillRef = useRef<any>();
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];
  const imageHandler = () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (!input.files) return;
      const file = input.files[0];
      const formData = new FormData();
      formData.append("Files", file);
      formData.append("FileType", "QuillImage");
      try {
        const response = await uploadFileService.upload(formData);
        if (response.status) {
          const imageUrl = `${StaticFileUrl}${response.data[0].duongDanFile}`;
          const editor = quillRef.current.editor;
          const range = quillRef.current.selection;
          if (editor) {
            if (range) {
              editor.insertEmbed(range.index, "image", imageUrl);
            }
          }
        } else {
          toast.error("Lỗi khi upload file");
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: imageHandler, // Gán hàm xử lý ảnh
        },
      },
    }),
    []
  );
  const handleChangeEditor = (value: string) => {
    setEditorValue(value); // Update editor value on change
  };

  const handleOnFinish: FormProps<EmailThongBaoCreateOrUpdateType>["onFinish"] =
    async (formData: EmailThongBaoCreateOrUpdateType) => {
      const trimmedData: EmailThongBaoCreateOrUpdateType = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      ) as EmailThongBaoCreateOrUpdateType;
      if (props.item) {
        console.log(props);
        const response = await emailThongBaoService.update(trimmedData);
        if (response.status) {
          toast.success("Chỉnh sửa thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await emailThongBaoService.create(trimmedData);
        if (response.status) {
          toast.success("Thêm mới thành công");
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
      title={props.item != null ? "Chỉnh sửa " : "Thêm mới "}
      open={true}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      width="60%"
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
          <Form.Item<EmailThongBaoCreateOrUpdateType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        {
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<EmailThongBaoCreateOrUpdateType>
                  label="Mã"
                  name="ma"
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin này!" },
                    { max: 255, message: "Không được nhập quá 255 ký tự!" },
                    {
                      pattern: /^[a-zA-Z0-9_-]+$/,
                      message: "Mã chỉ được chứa chữ cái, số, dấu - và _",
                    },
                  ]}
                >
                  <Input placeholder="Mã" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<EmailThongBaoCreateOrUpdateType>
                  label="Nội dung"
                  name="noiDung"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập thông tin này!",
                    },
                  ]}
                >
                  <QuillEditor
                    forwardedRef={quillRef}
                    modules={modules}
                    value={editorValue}
                    onChange={handleChangeEditor}
                    theme="snow"
                    placeholder="Nhập nội dung..."
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        }
        <Form.Item style={{ display: "none" }}>
          <button type="submit" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EmailThongBaoCreateOrUpdate;
