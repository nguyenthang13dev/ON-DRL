import { userService } from '@/services/user/user.service';
import { createEditType, tableUserDataType } from '@/types/auth/User';
import { QL_LanhDaoCreateOrUpdateType } from '@/types/qL_LanhDao/qL_LanhDao';
import { Col, DatePicker, Form, FormProps, Input, Modal, Radio, Row, TreeSelect } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
const UpdateProfile = ({
  item,
  onClose,
  onSuccess
}: {
  item?: tableUserDataType | null;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [form] = Form.useForm<createEditType>();
  const handleOnFinish: FormProps<createEditType>['onFinish'] =
    async (formData: createEditType) => {
      if (formData.ngaySinh) {
        formData.ngaySinh = formData.ngaySinh.format('YYYY-MM-DD');
      }
      const response = await userService.Update(formData);
      if (response.status) {
        toast.success('Cập nhật thông tin cá nhân thành công');
        form.resetFields();
        onSuccess();
      } else {
        toast.error(response.message);
      }

    };
  const handleCancel = () => {
    form.resetFields();
    onClose()
  };
  useEffect(() => {
    if (item) {
      // const formattedNgaySinh = item.ngaySinh
      //   ? dayjs.utc(item.ngaySinh)
      //   : null;
      const gender_txt = item.gender?.toString();
      form.setFieldsValue({
        ...item,
        gender: gender_txt,
        ngaySinh: item.ngaySinh ? dayjs.utc(item.ngaySinh) : null,
      });
    }
  }, [form, item]);
  return (
    <Modal
      title='Chỉnh sửa thông tin cá nhân'
      open={true}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"

    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdate"
        onFinish={handleOnFinish}
        autoComplete="off"
        className="w-full"
      >

        <Form.Item<createEditType> name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item<createEditType> name="departmentId" initialValue={item?.donViId} hidden>
          <Input />
        </Form.Item>
        <Form.Item<createEditType> name="donViId" hidden>
          <Input />
        </Form.Item>
        <Form.Item<createEditType>
          label="Họ tên"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập thông tin này!' },
          ]}
        >
          <Input placeholder="Họ tên" />
        </Form.Item>
        <Form.Item<createEditType>
          label="Ngày sinh"
          name="ngaySinh"
        >
          <DatePicker
            style={{ width: "100%" }}
            format={{
              format: "DD-MM-YYYY",
              type: "mask",
            }}
          />
        </Form.Item>
        <Form.Item<createEditType>
          label="Email"
          name="email"
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item<createEditType>
          label="Điện thoại"
          name="phoneNumber"
        >
          <Input placeholder="Điện thoại" />
        </Form.Item>
        <Form.Item<createEditType>
          label="Giới tính"
          name="gender"
          initialValue={1}
        >
          <Radio.Group>
            <Radio value={'1'}> Nam </Radio> {/* Chú ý: value là số */}
            <Radio value={'0'}> Nữ </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item<createEditType>
          label="Điạ chỉ"
          name="diaChi"
        >
          <Input placeholder="Điạ chỉ" />
        </Form.Item>

      </Form>
    </Modal>
  )
}

export default UpdateProfile;
