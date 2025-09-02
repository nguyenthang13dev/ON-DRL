import { Form, Input, Modal, Row, Col, Select, Checkbox } from "antd";
import React, {
  ForwardedRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import Notification from "@/types/notification/notification";
import { notificationService } from "@/services/notification/notification.service";
import { UploadFile } from "antd/lib";
import { DropdownOption } from "@/types/general";
import UploadFiler from "@/libs/UploadFilter";
const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

const defaultData = {
  message: "",
  link: "",
  isRead: "",
  type: "",
  itemName: "",
  itemType: "",
  createdDate: "",
  toUser: "",
};

interface Props {
  isOpen: boolean;
  data?: Notification;
  dropdownUser?: DropdownOption[];
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
const CreateUpdateForm: React.FC<Props> = ({
  isOpen,
  data,
  dropdownUser,
  onClose,
  onSuccess,
}: Props) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedData, setUploadedData] = useState<string[]>([]);
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

  const handleFinish = async () => {
    const param = await form.validateFields();
    if (uploadedData.length > 0) {
      param.fileDinhKem = uploadedData[0];
    }
    try {
      if (data) {
        const response = await notificationService.Update({
          ...param,
          id: data.id,
          link: data.link || "",
          type: data.type || ".",
          itemName: data.itemName || ".",
          message: data.message || "",
          loaiThongBao: "Website",
          isXuatBan: data.isXuatBan || false,
        });
        if (response.status) {
          toast.success("Cập nhật thông báo thành công");
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await notificationService.Create({
          ...param,
          link: "#",
          type: ".",
          itemName: ".",
          message: ".",
          loaiThongBao: "Website",
        });
        if (response.status) {
          toast.success("Thêm mới thông báo thành công");
        } else {
          toast.error(response.message);
        }
      }
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
      });
      if (data?.fileDinhKem) {
        setFileList([
          {
            uid: "-1",
            name: "File đính kèm",
            url: `${StaticFileUrl}/${data.fileDinhKem}`,
          },
        ]);
      }
    } else {
      setFileList([]);
      setUploadedData([]);
      form.setFieldsValue(defaultData);
    }
  }, [data]);

  return (
    <Modal
      title={
        <div style={{ textAlign: "center" }}>
          {data ? "Chỉnh sửa thông báo" : "Thêm mới thông báo"}
        </div>
      }
      open={isOpen}
      onOk={() => handleFinish()}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Đóng"
      width={"60%"}
    >
      <Form layout="vertical" form={form} autoComplete="off">
        <Row gutter={16}>
          {/* <Col span={12}>
            <Form.Item
              label={<strong>Người gửi</strong>}
              name="fromUser"
              rules={[
                { required: true, message: 'Vui lòng nhập thông tin này!' },
              ]}
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="Chọn người gửi"
              >
                {dropdownUser &&
                  dropdownUser.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col> */}
          {/* <Col span={12}>
            <Form.Item
              label={<strong>Người nhận</strong>}
              name="toUser"
              rules={[
                { required: true, message: 'Vui lòng nhập thông tin này!' },
              ]}
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="Chọn người nhận"
              >
                {dropdownUser &&
                  dropdownUser.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col> */}
        </Row>
        {/* <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<strong>Email người nhận</strong>}
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'Vui lòng nhập đúng định dạng email',
                }
              ]}
            >
              <Input placeholder="Nhập email người nhận" />
            </Form.Item>
          </Col>
        </Row> */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={<strong>Tiêu đề</strong>}
              name="tieuDe"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thông tin này!",
                },
              ]}
            >
              <Input placeholder="Nhập tiêu đề" />
            </Form.Item>
          </Col>
          {/* <Col span={24}>
            <Form.Item
              label={<strong>Thông báo</strong>}
              name="message"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập thông tin này!',
                },
              ]}
            >
              <Input placeholder="Nhập thông báo tiêu đề" />
            </Form.Item>
          </Col> */}
          {/* <Col span={24}>
            <Form.Item
              label={<strong>Xuất bản</strong>}
              name="isXuatBan"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <Form.Item
              label={<strong>Nội dung</strong>}
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
        <Row>
          <Form.Item label={<strong>File đính kèm</strong>}>
            <UploadFiler
              maxFiles={1}
              fileList={fileList}
              setFileList={setFileList}
              type="FileNotification"
              setUploadedData={setUploadedData}
            />
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
};
export default CreateUpdateForm;
