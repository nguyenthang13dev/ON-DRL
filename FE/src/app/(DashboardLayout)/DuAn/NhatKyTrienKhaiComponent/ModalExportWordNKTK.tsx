import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Select } from "antd";
import dA_DuAnService from "@/services/dA_DuAn/dA_DuAnService";

interface ModalExportWordNKTKProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: { tenGoiThau: string; diaDiemTrienKhai: string; chuDauTu: string ,loai: boolean}) => void;
  duAnId?: string;
  isExporting?: boolean;
}

const ModalExportWordNKTK = ({ isOpen, onClose, onExport, duAnId, isExporting = false }: ModalExportWordNKTKProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);
  
  // Fetch project data when modal opens
  useEffect(() => {
    if (isOpen && duAnId) {
      fetchProjectData();
    }
  }, [isOpen, duAnId]);

  const fetchProjectData = async () => {
    if (!duAnId) return;
    
    setLoading(true);
    try {
      const response = await dA_DuAnService.get(duAnId);
      if (response && response.data) {
        // Cast to any since these fields might be added dynamically
        const data = response.data as any;
        
        console.log("Response from get:", data);
        
        // Pre-populate form with existing values if they exist
        const formValues = {
          tenGoiThau: data.tenGoiThau || '',
          diaDiemTrienKhai: data.diaDiemTrienKhai || '',
          chuDauTu: data.chuDauTu || ''
        };
        
        console.log("Setting form values:", formValues);
        form.setFieldsValue(formValues);
        
        // Check if any of the fields have data
        const hasData = formValues.tenGoiThau || formValues.diaDiemTrienKhai || formValues.chuDauTu;
        if (!hasData) {
          message.info("Không tìm thấy dữ liệu có sẵn. Vui lòng điền thông tin.");
        }
      } else {
        message.info("Không tìm thấy dữ liệu dự án. Vui lòng điền thông tin.");
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
      message.error("Có lỗi khi tải dữ liệu dự án");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    if (isExporting) return; // Don't close if exporting
    form.resetFields();
    onClose();
  };
  
  const handleSubmit = () => {
    if (isExporting) return; // Don't submit if already exporting
    form.validateFields().then((values) => {
      onExport(values);
    }).catch(err => {
      console.error("Form validation error:", err);
    });
  };

  return (
    <Modal
      title="Xuất file Word"
      open={isOpen}
      onCancel={handleCancel}
      maskClosable={!isExporting}
      closable={!isExporting}
      confirmLoading={loading || isExporting}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading || isExporting}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading || isExporting}>
          Xuất
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" disabled={loading || isExporting}>
        <Form.Item
          name="tenGoiThau"
          label="Tên gói thầu"
          rules={[{ required: true, message: "Vui lòng nhập tên gói thầu" }]}
        >
          <Input placeholder="Nhập tên gói thầu" />
        </Form.Item>
        <Form.Item
          name="diaDiemTrienKhai"
          label="Địa điểm triển khai"
          rules={[{ required: true, message: "Vui lòng nhập địa điểm triển khai" }]}
        >
          <Input placeholder="Nhập địa điểm triển khai" />
        </Form.Item>
        <Form.Item
          name="chuDauTu"
          label="Chủ đầu tư"
          rules={[{ required: true, message: "Vui lòng nhập chủ đầu tư" }]}
        >
          <Input placeholder="Nhập chủ đầu tư" />
        </Form.Item>
        <Form.Item
          name="loai"
          label="Loại"
          rules={[{ required: true, message: "Vui lòng chọn loại" }]}
        >
          <Select placeholder="Chọn loại" > 
            <Select.Option key="true" value="true">Ngày</Select.Option>
            <Select.Option key="false" value="false">Tuần</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalExportWordNKTK; 