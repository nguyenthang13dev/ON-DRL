import React from "react";
import {
  Form,
  Input,
  DatePicker,
  Modal,
  Checkbox,
  Row,
  Col,
  Select,
} from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  DA_DuAnCreateOrUpdateType,
} from "@/types/dA_DuAn/dA_DuAn";
import dA_DuAnService from "@/services/dA_DuAn/dA_DuAnService";
import { DropdownOption } from "@/types/general";

interface Props {
  item?: DA_DuAnCreateOrUpdateType | null; // Dữ liệu dự án nếu có, null nếu tạo mới
  itemId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DA_DuAnCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<DA_DuAnCreateOrUpdateType>();
  const [trangThaiOptions, setTrangThaiOptions] = React.useState<
    DropdownOption[]
  >([]);
  // Removed tab-related states since we only have one tab now

  React.useEffect(() => {
    // Gọi API lấy dropdown trạng thái dự án
    const fetchDropdowns = async () => {
      try {
        const res = await dA_DuAnService.getDropdowns();
        if (res.status && res.data?.SatusDuAn) {
          setTrangThaiOptions(res.data["SatusDuAn"]);
        }
      } catch (error) {
        toast.error("Không thể tải danh sách trạng thái dự án");
      }
    };
    fetchDropdowns();
  }, []);

  // Khi mở form sửa, convert ngày về dayjs, boolean về true/false
  React.useEffect(() => {
    console.log("=== DEBUG USEEFFECT ===");
    console.log("Props item:", props.item);
    
    if (props.item) {
      const formDataToSet = {
        id: props.item.id,
        tenDuAn: props.item.tenDuAn,
        moTaDuAn: props.item.moTaDuAn,
        yeuCauDuAn: props.item.yeuCauDuAn,
        linkDemo: props.item.linkDemo,
        linkThucTe: props.item.linkThucTe,
        trangThaiThucHien: props.item.trangThaiThucHien,
        ngayBatDau: props.item.ngayBatDau ? dayjs(props.item.ngayBatDau) : null,
        ngayKetThuc: props.item.ngayKetThuc
          ? dayjs(props.item.ngayKetThuc)
          : null,
        timeCaiDatMayChu: props.item.timeCaiDatMayChu
          ? dayjs(props.item.timeCaiDatMayChu)
          : null,
        ngayTiepNhan: props.item.ngayTiepNhan
          ? dayjs(props.item.ngayTiepNhan)
          : null,
        isBackupMayChu: !!props.item.isBackupMayChu,
      };
      
      console.log("Form data to set:", formDataToSet);
      form.setFieldsValue(formDataToSet);
      
      // Verify after setting
      setTimeout(() => {
        console.log("Form data after setting:", form.getFieldsValue());
      }, 100);
    } else {
      console.log("Resetting form for new item");
      form.resetFields();
    }
  }, [form, props.item]);

  // Helper function to check if a string is a valid GUID format
  const isValidGuid = (str: string | undefined | null): boolean => {
    if (!str || str.trim() === "") return false;
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(str);
  };

  // Xử lý submit - Sửa lại để luôn lấy được dữ liệu đầy đủ
  const handleSubmit = async () => {
    try {
      // Validate form trước để đảm bảo dữ liệu hợp lệ
      await form.validateFields();
      
      // Lấy dữ liệu từ form SAU KHI validate
      const formData = form.getFieldsValue();
      
      console.log("=== DEBUG SUBMIT ===");
      console.log("Form data:", formData);
      console.log("Props item:", props.item);
      console.log("Form fields value:", form.getFieldsValue(true)); // Get all fields including untouched ones
      
      // Debug: kiểm tra từng trường bắt buộc
      console.log("=== VALIDATION DEBUG ===");
      console.log("tenDuAn:", formData.tenDuAn, typeof formData.tenDuAn);
      console.log("ngayBatDau:", formData.ngayBatDau, typeof formData.ngayBatDau);
      console.log("ngayKetThuc:", formData.ngayKetThuc, typeof formData.ngayKetThuc);
      
      // Debug: kiểm tra dayjs objects
      if (formData.ngayBatDau) {
        console.log("ngayBatDau isValid:", dayjs(formData.ngayBatDau).isValid());
        console.log("ngayBatDau formatted:", dayjs(formData.ngayBatDau).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
      }
      if (formData.ngayKetThuc) {
        console.log("ngayKetThuc isValid:", dayjs(formData.ngayKetThuc).isValid());
        console.log("ngayKetThuc formatted:", dayjs(formData.ngayKetThuc).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
      }
      
      // Kiểm tra dữ liệu bắt buộc
      if (!formData.tenDuAn || !formData.ngayBatDau || !formData.ngayKetThuc) {
        const missingFields = [];
        if (!formData.tenDuAn) missingFields.push('Tên dự án');
        if (!formData.ngayBatDau) missingFields.push('Ngày bắt đầu');
        if (!formData.ngayKetThuc) missingFields.push('Ngày kết thúc');
        
        toast.error(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`);
        return;
      }
      
      // Map từng trường sang PascalCase - chỉ các trường có trong type definition
      const basePayload = {
        TenDuAn: formData.tenDuAn,
        NgayBatDau: formData.ngayBatDau
          ? dayjs(formData.ngayBatDau).format('YYYY-MM-DDTHH:mm:ss')
          : null,
        NgayKetThuc: formData.ngayKetThuc
          ? dayjs(formData.ngayKetThuc).format('YYYY-MM-DDTHH:mm:ss')
          : null,
        NgayTiepNhan: formData.ngayTiepNhan
          ? dayjs(formData.ngayTiepNhan).format('YYYY-MM-DDTHH:mm:ss')
          : null,
        TimeCaiDatMayChu: formData.timeCaiDatMayChu
          ? dayjs(formData.timeCaiDatMayChu).format('YYYY-MM-DDTHH:mm:ss')
          : null,
        IsBackupMayChu: !!formData.isBackupMayChu,
        TrangThaiThucHien: formData.trangThaiThucHien ? Number(formData.trangThaiThucHien) : null,
        LinkDemo: formData.linkDemo || null,
        LinkThucTe: formData.linkThucTe || null,
        MoTaDuAn: formData.moTaDuAn || null,
        YeuCauDuAn: formData.yeuCauDuAn || null,
      };

      console.log("Base payload:", basePayload);
      
      // Debug: kiểm tra từng field trong payload
      console.log("=== PAYLOAD VALIDATION ===");
      Object.entries(basePayload).forEach(([key, value]) => {
        console.log(`${key}:`, value, `(${typeof value})`);
        if (value === null || value === undefined || value === "") {
          console.warn(`⚠️  ${key} is empty!`);
        }
      });

      let response;
      const isUpdate = Boolean(props.item?.id);
      
      if (isUpdate) {
        // For update, add Id directly to basePayload
        const updatePayload = {
          ...basePayload,
          Id: props.item?.id,
        };
        console.log("=== UPDATE DEBUG ===");
        console.log("Update payload gửi lên:", JSON.stringify(updatePayload, null, 2));
        console.log("API endpoint: /dA_DuAn/update");
        console.log("HTTP method: PUT");
        
        response = await dA_DuAnService.update(updatePayload);
        console.log("Response từ API update:", response);
      } else {
        // For create, send basePayload directly (API model nhận trực tiếp)
        console.log("=== CREATE DEBUG ===");
        console.log("Create payload gửi lên:", JSON.stringify(basePayload, null, 2));
        console.log("API endpoint: /dA_DuAn/create");
        console.log("HTTP method: POST");
        
        response = await dA_DuAnService.create(basePayload);
        console.log("Response từ API create:", response);
      }

      if (response.status) {
        toast.success(
          isUpdate ? "Chỉnh sửa thành công" : "Thêm mới thành công"
        );
        form.resetFields();
        props.onSuccess();
        props.onClose();
      } else {
        console.error("=== API ERROR ===");
        console.error("Error message:", response.message);
        console.error("Full response:", response);
        toast.error(response.message || "Có lỗi xảy ra!");
      }
    } catch (error: any) {
      console.error("=== EXCEPTION ERROR ===");
      console.error("Exception:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
      console.error("Headers:", error.response?.headers);
      
      // Hiển thị lỗi chi tiết nếu có
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        toast.error(errorMessages.join(', '));
      } else {
        toast.error("Có lỗi xảy ra khi lưu dự án!");
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    props.onClose();
  };

  return (
    <Modal
      title={props.item ? "Chỉnh sửa dự án" : "Thêm mới dự án"}
      open={true}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      width="75%"
      style={{ top: 30 }}
    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdate"
        style={{ maxWidth: 1200 }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {props.item && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên dự án"
              name="tenDuAn"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <Input placeholder="Tên dự án" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Ngày bắt đầu"
              name="ngayBatDau"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                className="w-100"
                placeholder="Ngày bắt đầu"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Ngày kết thúc"
              name="ngayKetThuc"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                className="w-100"
                placeholder="Ngày kết thúc"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Ngày tiếp nhận" name="ngayTiepNhan">
              <DatePicker
                format="DD/MM/YYYY"
                className="w-100"
                placeholder="Ngày tiếp nhận"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái thực hiện" name="trangThaiThucHien">
              <Select
                placeholder="Chọn trạng thái"
                options={trangThaiOptions.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                allowClear
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Thời gian cài đặt máy chủ"
              name="timeCaiDatMayChu"
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                className="w-100"
                placeholder="Thời gian cài đặt máy chủ"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Backup dữ liệu?"
              name="isBackupMayChu"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Link demo" name="linkDemo">
              <Input placeholder="Link demo" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Link thực tế" name="linkThucTe">
              <Input placeholder="Link thực tế" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Mô tả dự án" name="moTaDuAn">
              <Input.TextArea rows={4} placeholder="Mô tả dự án" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Yêu cầu dự án" name="yeuCauDuAn">
              <Input.TextArea rows={4} placeholder="Yêu cầu dự án" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DA_DuAnCreateOrUpdate;
