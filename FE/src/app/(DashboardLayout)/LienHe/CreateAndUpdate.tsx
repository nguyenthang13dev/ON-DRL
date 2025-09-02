
import { CreateLienHeType } from "@/types/LienHe/LienHe";
import { lienHeService } from "@/services/LienHe/LienHe.service";
import { useRouter } from "next/router";
import withAuthorization from "@/libs/authentication";
import LienHeView, { searchLienHe } from "@/types/LienHe/LienHe";
import { NextPage } from "next";
import { Form, FormProps, Input, Modal } from "antd";
import { toast } from "react-toastify";
import React from "react";
interface Props {
  item?: LienHeView | null;
  onClose: () => void;
  onSuccess: () => void;
}
const CreateLienHeOrUpdate: NextPage<Props> = (props: Props) => {
    const [form] = Form.useForm<CreateLienHeType>();
    const handleOnFinish: FormProps<CreateLienHeType>["onFinish"] =
    async (formData: CreateLienHeType) => {
      if (props.item) {
        console.log(props);
        const response = await lienHeService.Create(formData);
        if (response.status) {
          toast.success(response.message);
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
      title={
        props.item != null
          ? "Chỉnh sửa địa chỉ mạng"
          : "Thêm mới địa chỉ mạng"
      }
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
          <Form.Item<CreateLienHeType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        {
          <>
            <Form.Item<CreateLienHeType>
              label="Họ tên"
              name="hoten"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input placeholder="Họ tên" />
            </Form.Item>
            <Form.Item<CreateLienHeType>
              name="sdt" 
              label="SDT"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}>
              <Input placeholder="SDT" />
            </Form.Item>

            <Form.Item<CreateLienHeType>
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}>
              <Input placeholder="SDT" />
            </Form.Item>

          </>
        }
      </Form>
    </Modal>
  ); 
}


export default withAuthorization(CreateLienHeOrUpdate,"")