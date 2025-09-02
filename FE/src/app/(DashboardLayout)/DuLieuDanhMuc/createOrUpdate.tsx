import {
  createEditType,
  tableDuLieuDanhMucDataType,
} from "@/types/duLieuDanhMuc/duLieuDanhMuc";
import { Form, FormProps, Input, Modal, Row, Col, TreeSelect } from "antd";
import React, {
  useEffect,
  useState,
  ForwardedRef,
  useRef,
  useMemo,
} from "react";
import { duLieuDanhMucService } from "@/services/duLieuDanhMuc/duLieuDanhMuc.service";
import { toast } from "react-toastify";
import TextArea from "antd/es/input/TextArea";
import UploadFiler from "@/libs/UploadFilter";
import { UploadFile } from "antd/lib";
import { DropdownTreeOptionAntd } from "@/types/general";
import { removeAccents } from "@/libs/CommonFunction";
const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

interface Props {
  isOpen: boolean;
  groupId: string;
  DuLieuDanhMuc?: tableDuLieuDanhMucDataType | null;
  onClose: () => void;
  onSuccess: () => void;
  departmentDropdown: DropdownTreeOptionAntd[];
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

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
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
    try {
      if (props.DuLieuDanhMuc) {
        const response = await duLieuDanhMucService.Update(trimmedData);
        if (response.status) {
          toast.success("Chỉnh sửa danh mục thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await duLieuDanhMucService.Create(trimmedData);
        if (response.status) {
          toast.success("Thêm mới danh mục thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  const handleMapEdit = () => {
    form.setFieldsValue({
      id: props.DuLieuDanhMuc?.id,
      groupId: props.groupId,
      name: props.DuLieuDanhMuc?.name,
      code: props.DuLieuDanhMuc?.code,
      priority: props.DuLieuDanhMuc?.priority,
      note: props.DuLieuDanhMuc?.note,
      donViId: props.DuLieuDanhMuc?.donViId,
      duongDanFile: props.DuLieuDanhMuc?.duongDanFile,
      noiDung: props.DuLieuDanhMuc?.noiDung,
      fileDinhKem: props.DuLieuDanhMuc?.fileDinhKem,
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.DuLieuDanhMuc) {
      if (props.DuLieuDanhMuc?.duongDanFile) {
        setFileList([
          {
            uid: `${props.DuLieuDanhMuc.fileDinhKem}`,
            name: `${props.DuLieuDanhMuc.tenFileDinhKem}`,
            status: "done",
            url: `${StaticFileUrl}/${props.DuLieuDanhMuc.duongDanFile}`,
          },
        ]);
        setUploadedData([props.DuLieuDanhMuc?.fileDinhKem ?? ""]);
      }
      handleMapEdit();
    } else {
      setFileList([]);
      setUploadedData([]);
    }
  }, [props.isOpen]);

  return (
    <Modal
      title={
        props.DuLieuDanhMuc != null ? "Chỉnh sửa danh mục" : "Thêm mới danh mục"
      }
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
        {props.DuLieuDanhMuc && (
          <Form.Item<createEditType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        {props.groupId && (
          <Form.Item<createEditType>
            name="groupId"
            hidden
            initialValue={props.groupId}
          >
            <Input />
          </Form.Item>
        )}
        {
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<createEditType>
                  label="Mã danh mục"
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
                  label="Tên danh mục"
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
              <Col span={12}>
                <Form.Item<createEditType> label="Thứ tự" name="priority">
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<createEditType> label="Đơn vị" name="donViId">
                  {/* <Input placeholder="Phòng ban"/> */}
                  <TreeSelect
                    style={{ width: "100%" }}
                    value={props.DuLieuDanhMuc?.donViId}
                    dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                    placeholder="Chọn đơn vị"
                    allowClear
                    treeDefaultExpandAll
                    treeData={props.departmentDropdown}
                    showSearch
                    filterTreeNode={(input, option) => {
                      return removeAccents(option?.title?.toString() ?? "")
                        .toLowerCase()
                        .includes(removeAccents(input).toLowerCase());
                    }}
                  />
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
                <Form.Item<createEditType> label="Nội dung" name="noiDung">
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
          </>
        }
      </Form>
    </Modal>
  );
};
export default CreateOrUpdate;
