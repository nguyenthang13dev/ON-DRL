import { Button, Form, FormProps, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  TacNhan_UseCaseType,
  TacNhan_UseCaseCreateType,
  TacNhan_UseCaseEditType,
} from "@/types/TacNhan_UseCase/TacNhan_UseCase";
import { tacNhan_UseCaseService } from "@/services/TacNhan_UseCase/TacNhan_UseCase.service";

interface Props {
  isOpen: boolean;
  tacNhanUseCase?: TacNhan_UseCaseType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);

  const handleOnFinish: FormProps<TacNhan_UseCaseCreateType>["onFinish"] =
    async (formData) => {
      try {
        let response;
        if (props.tacNhanUseCase) {
          response = await tacNhan_UseCaseService.update({
            ...formData,
            id: props.tacNhanUseCase.id,
          });
        } else {
          response = await tacNhan_UseCaseService.create(formData);
          console.log("Response:", response);
        }

        if (response && response.status) {
          toast.success(
            props.tacNhanUseCase ? "Cập nhật thành công" : "Tạo mới thành công"
          );
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          // Hiển thị lỗi chi tiết từ API
          const errorMessage = response?.message || "Có lỗi xảy ra";
          toast.error(errorMessage);

          // Nếu có lỗi validation cụ thể, hiển thị thêm thông tin
          if (response?.errors) {
            console.error("Validation errors:", response.errors);
            // Có thể hiển thị thêm thông tin lỗi validation nếu cần
          }
        }
      } catch (error: any) {
        // Xử lý lỗi network hoặc lỗi khác
        let errorMessage = "Có lỗi xảy ra";

        if (error.response) {
          // Lỗi từ server với response
          const responseData = error.response.data;
          errorMessage =
            responseData?.message || responseData?.error || errorMessage;

          // Xử lý lỗi 400 Bad Request cụ thể
          if (error.response.status === 400) {
            if (responseData?.message) {
              errorMessage = responseData.message;
            }
            // Log chi tiết lỗi để debug
            console.error("400 Bad Request Error:", {
              status: error.response.status,
              data: responseData,
              message: responseData?.message,
            });
          }

          if (responseData?.errors) {
            console.error("Server validation errors:", responseData.errors);
          }
        } else if (error.request) {
          // Lỗi network
          errorMessage =
            "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
        } else {
          // Lỗi khác
          errorMessage = error.message || errorMessage;
        }

        toast.error(errorMessage);
        console.error("Error details:", error);
      }
    };

  const handleMapEdit = () => {
    form.setFieldsValue(props.tacNhanUseCase);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.tacNhanUseCase) {
      handleMapEdit();
    }
  }, [props.isOpen]);

  return (
    <Modal
      title={
        props.tacNhanUseCase
          ? "Chỉnh sửa Tác Nhân UseCase"
          : "Thêm mới Tác Nhân UseCase"
      }
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      width={500}
    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdate"
        style={{ maxWidth: 500 }}
        onFinish={handleOnFinish}
        autoComplete="off"
      >
        {props.tacNhanUseCase && (
          <Form.Item<TacNhan_UseCaseEditType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item<TacNhan_UseCaseCreateType>
          label="Mã tác nhân"
          name="maTacNhan"
          rules={[
            {
              required: false, // Không bắt buộc nhập mã
              message: "Vui lòng nhập mã tác nhân!",
            },
          ]}
        >
          <Input
            disabled={!!props.tacNhanUseCase}
            placeholder={
              props.tacNhanUseCase
                ? "Không thể sửa mã tác nhân"
                : "Nhập mã tác nhân (không bắt buộc)"
            }
          />
        </Form.Item>
        <Form.Item<TacNhan_UseCaseCreateType>
          label="Tên tác nhân"
          name="tenTacNhan"
          rules={[{ required: true, message: "Vui lòng nhập tên tác nhân!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateOrUpdate;
