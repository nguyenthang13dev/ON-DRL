import { Button, Form, FormProps, Input, Modal, Switch, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    FormTemplate,
    FormTemplateCreateUpdate,
} from "@/types/formTemplate/formTemplate";
import { formTemplateService } from "@/services/formTemplate/formTemplate.service";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";

interface Props {
    isOpen: boolean;
    currentFormTemplate?: FormTemplate | null;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
    const [form] = Form.useForm();
    const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);

    const handleAfterSuccess = () => {
        toast.success(
            props.currentFormTemplate != null
                ? "Chỉnh sửa biểu mẫu thành công"
                : "Thêm mới biểu mẫu thành công",
        );
        form.resetFields();
        props.onSuccess();
        props.onClose();
    };

    const ConvertToFormData = (
        formValues: FormTemplateCreateUpdate,
    ): FormData => {
        const formData = new FormData();
        if (!!formValues.id) {
            formData.append("id", formValues.id);
        }
        formData.append("name", formValues.name);
        formData.append("description", formValues.description ?? "");
        formData.append(
            "isClassMonitorHandled",
            formValues?.isClassMonitorHandled?.toString() ?? "false",
        );
        if (
            formValues.originalFile &&
            (formValues.originalFile as any).length > 0
        ) {
            formData.append(
                "originalFile",
                (formValues.originalFile as any)[0].originFileObj,
            );
        }
        return formData;
    };

    const handleOnFinish: FormProps<FormTemplateCreateUpdate>["onFinish"] =
        async (formValues: FormTemplateCreateUpdate) => {
            console.log("formData:", formValues);
            const formData = ConvertToFormData(formValues);
            try {
                const response = await formTemplateService.CreatOrUpdate(
                    formData,
                );
                if (response.status) {
                    handleAfterSuccess();
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                toast.error("Có lỗi xảy ra: " + error);
            }
        };

    const onSwitchChange = (checked: boolean) => {
        form.setFieldsValue({ isClassMonitorHandled: checked });
    };
    const handleMapEdit = () => {
        form.setFieldsValue({
            id: props.currentFormTemplate?.id,
            name: props.currentFormTemplate?.name,
            description: props.currentFormTemplate?.description,
            isClassMonitorHandled:
                !!props.currentFormTemplate?.isClassMonitorHandled,
            originalFile: props.currentFormTemplate?.originalFilePath
                ? [
                      {
                          uid: "-1", // unique id
                          name: props.currentFormTemplate.originalFilePath
                              .split("\\")
                              .pop(),
                          status: "done",
                          url: `${
                              process.env.NEXT_PUBLIC_API_URL
                          }/${props.currentFormTemplate.originalFilePath.replace(
                              "\\",
                              "/",
                          )}`,
                      },
                  ]
                : [],
        });
    };

    const handleCancel = () => {
        setIsOpen(false);
        form.resetFields();
        props.onClose();
    };

    useEffect(() => {
        setIsOpen(props.isOpen);
        if (props.currentFormTemplate) {
            handleMapEdit();
        }
    }, [props.isOpen]);

    return (
        <Modal
            title={
                props.currentFormTemplate != null
                    ? "Chỉnh sửa biểu mẫu"
                    : "Thêm mới biểu mẫu"
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
                {props.currentFormTemplate && (
                    <Form.Item<FormTemplateCreateUpdate> name="id" hidden>
                        <Input />
                    </Form.Item>
                )}
                {
                    <>
                        <Form.Item<FormTemplateCreateUpdate>
                            label="Tên biểu mẫu"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập thông tin này!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FormTemplateCreateUpdate>
                            label="Mô tả"
                            name="description"
                        >
                            <TextArea />
                        </Form.Item>
                        <Form.Item<FormTemplateCreateUpdate>
                            label="Lớp trưởng xử lý"
                            name="isClassMonitorHandled"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                        <Form.Item
                            label="Tệp đính kèm"
                            name="originalFile"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) return e;
                                return e?.fileList;
                            }}
                        >
                            <Upload
                                name="file"
                                maxCount={1}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Chọn tệp
                                </Button>
                            </Upload>
                        </Form.Item>
                    </>
                }
            </Form>
        </Modal>
    );
};
export default CreateOrUpdate;
