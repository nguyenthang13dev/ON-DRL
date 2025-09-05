import React, { ForwardedRef, useMemo, useRef, useState } from "react";
import {
  Form,
  FormProps,
  Input,
  Select,
  DatePicker,
  Modal,
  UploadFile,
} from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  ActivitiesCreateOrUpdateType,
  ActivitiesType,
} from "@/types/activities/activities";
import * as extensions from "@/utils/extensions";
import activitiesService from "@/services/activities/activitiesService";
import dynamic from "next/dynamic";
import type { ReactQuillProps } from "react-quill";
import { uploadFileService } from "@/services/File/uploadFile.service";
import UploadFiler from "@/libs/UploadFilter";
const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

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

interface Props {
  item?: ActivitiesType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ActivitiesCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<ActivitiesCreateOrUpdateType>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedData, setUploadedData] = useState<string[]>([]);
  const quillRef = useRef<any>();
  const [editorValue, setEditorValue] = useState<string>("");
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
  const handleOnFinish: FormProps<ActivitiesCreateOrUpdateType>["onFinish"] =
    async (formData: ActivitiesCreateOrUpdateType) => {
      if (uploadedData && uploadedData.length > 0) {
        formData.image = uploadedData[0];
      }

      if (props.item) {
        console.log(props);
        const response = await activitiesService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa  thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await activitiesService.create(formData);
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
        startDate: props.item.startDate
          ? dayjs(props.item.startDate)
          : undefined,
        endDate: props.item.endDate ? dayjs(props.item.endDate) : undefined,
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
      style={{ minWidth: "70%" }}
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
          <Form.Item<ActivitiesCreateOrUpdateType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        {
          <>
            <Form.Item<ActivitiesCreateOrUpdateType>
              label="Tên hoạt động"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input placeholder="Tên hoạt động" />
            </Form.Item>

            <Form.Item<ActivitiesCreateOrUpdateType>
              label="Thời gian"
              name="startDate"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                className="w-100"
                placeholder="Thời gian"
              />
            </Form.Item>
            <Form.Item<ActivitiesCreateOrUpdateType> label="File đính kèm">
              <UploadFiler
                maxFiles={1}
                fileList={fileList}
                setFileList={setFileList}
                type="ImageActivities"
                setUploadedData={setUploadedData}
              />
            </Form.Item>
            <Form.Item<ActivitiesCreateOrUpdateType>
              label="Mô tả"
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
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
          </>
        }
      </Form>
    </Modal>
  );
};
export default ActivitiesCreateOrUpdate;
