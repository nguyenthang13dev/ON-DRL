import { hoatDongNgoaiKhoaService } from "@/services/hoatDongNgoaiKhoa/hoatDongNgoaiKhoa.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import
  {
    HoatDongNgoaiKhoaCreateEditType,
    TableHoatDongNgoaiKhoaDataType,
  } from "@/types/hoatDongNgoaiKhoa/hoatDongNgoaiKhoa";
import { SaveOutlined } from "@ant-design/icons";
import
  {
    Button,
    Col,
    Form,
    FormProps,
    Input,
    Modal,
    Row,
    Select,
    Space
  } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface CreateOrUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hoatDong?: TableHoatDongNgoaiKhoaDataType | null;
}

const CreateOrUpdate: React.FC<CreateOrUpdateProps> = ({
  isOpen,
  onClose,
  onSuccess,
  hoatDong,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state) => state.general.isLoading);
  const [form] = Form.useForm<HoatDongNgoaiKhoaCreateEditType>();

  const isEdit = !!hoatDong?.id;

  useEffect(() => {
    if (isOpen) {
      if (hoatDong) {
        // Populate form with existing data for edit
        form.setFieldsValue({
          id: hoatDong.id,
          tenHoatDong: hoatDong.tenHoatDong,
          status: hoatDong.status,
          qrValue: hoatDong.qrValue,
        });
      } else {
        // Reset form for new creation
        form.resetFields();
        // Generate default QR value for new activity
        const defaultQR = `HD_${Date.now()}`;
        form.setFieldValue("qrValue", defaultQR);
      }
    }
  }, [isOpen, hoatDong, form]);

  const handleFinish: FormProps<HoatDongNgoaiKhoaCreateEditType>["onFinish"] =
    async (values) => {
      try {
        dispatch(setIsLoading(true));
        let response;

        if (isEdit) {
          response = await hoatDongNgoaiKhoaService.update({
            ...values,
            id: hoatDong.id,
          });
        } else {
          response = await hoatDongNgoaiKhoaService.create(values);
        }

        if (response.status) {
          toast.success(
            `${isEdit ? "Cập nhật" : "Tạo"} hoạt động ngoại khóa thành công`
          );
          onSuccess();
          handleClose();
        } else {
          toast.error(
            response.message ||
              `Có lỗi xảy ra khi ${isEdit ? "cập nhật" : "tạo"} hoạt động ngoại khóa`
          );
        }
      } catch (error) {
        toast.error(
          `Có lỗi xảy ra khi ${isEdit ? "cập nhật" : "tạo"} hoạt động ngoại khóa`
        );
      } finally {
        dispatch(setIsLoading(false));
      }
    };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const generateQRCode = () => {
    const newQR = `HD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    form.setFieldValue("qrValue", newQR);
  };

  return (
    <Modal
      title={isEdit ? "Chỉnh sửa hoạt động ngoại khóa" : "Thêm hoạt động ngoại khóa"}
      open={isOpen}
      onCancel={handleClose}
      width={"60%"}
      destroyOnClose
      footer={
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={handleClose}>Hủy</Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={loading}
            >
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Space>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Tên hoạt động"
              name="tenHoatDong"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên hoạt động!",
                },
                {
                  min: 3,
                  message: "Tên hoạt động phải có ít nhất 3 ký tự!",
                },
                {
                  max: 255,
                  message: "Tên hoạt động không được quá 255 ký tự!",
                },
              ]}
            >
              <Input placeholder="Nhập tên hoạt động" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trạng thái!",
                },
              ]}
            >
              <Select placeholder="Chọn trạng thái">
                <Select.Option value="ACTIVE">Đang hoạt động</Select.Option>
                <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
                <Select.Option value="PENDING">Chờ phê duyệt</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Link QR"
              name="qrValue"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập link QR!",
                }
              ]}
            >
              <Input placeholder="Nhập link QR hoặc click 'Tạo link QR mới'" name="qrValue"/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdate;