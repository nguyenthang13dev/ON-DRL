'use client';

import { subjectService } from "@/services/Subject/Subject.service";
import { DropdownOption } from "@/types/general";
import { SubjectCreateVM, TableSubjectDataType } from "@/types/Subject/Subject";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import
  {
    Button,
    Col,
    Form,
    FormProps,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Switch
  } from "antd";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CreateOrUpdateProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  Subject: TableSubjectDataType | null;
}

const { Option } = Select;
const { TextArea } = Input;

const CreateOrUpdate: React.FC<CreateOrUpdateProps> = ({
  isOpen,
  onSuccess,
  onClose,
  Subject,
}) => {
  const [form] = Form.useForm<SubjectCreateVM>();


  const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>([]);

  // Load fake department data
  useEffect(() => {
    const fakeDepartments: DropdownOption[] = [
      { label: "Khoa Công nghệ Thông tin", value: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6" },
      { label: "Khoa Kỹ thuật Thủy lợi", value: "b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7" },
      { label: "Khoa Môi trường", value: "c3d4e5f6-g7h8-9i0j-1k2l-m3n4o5p6q7r8" },
      { label: "Khoa Kinh tế", value: "d4e5f6g7-h8i9-0j1k-2l3m-n4o5p6q7r8s9" },
      { label: "Khoa Cơ khí", value: "e5f6g7h8-i9j0-1k2l-3m4n-o5p6q7r8s9t0" }
    ];
    setDepartmentOptions(fakeDepartments);
  }, []);

  // Helper function to find department ID by name (for backward compatibility)
  const findDepartmentId = useCallback((departmentName: string | null): string | null => {
    if (!departmentName) return null;
    const dept = departmentOptions.find(d => d.label === departmentName);
    return dept ? dept.value : null;
  }, [departmentOptions]);

  useEffect(() => {
    if (isOpen) {
      if (Subject) {
        // Convert null values to undefined for form compatibility
        // Handle department conversion from name to GUID if needed
        let departmentValue = Subject.department;
        if (Subject.department && !departmentOptions.find(d => d.value === Subject.department)) {
          // If department is a name instead of GUID, convert it
          departmentValue = findDepartmentId(Subject.department);
        }

        const formValues = {
          ...Subject,
          code: Subject.code || undefined,
          name: Subject.name || undefined,
          description: Subject.description || undefined,
          department: departmentValue || undefined,
          prerequisites: Subject.prerequisites || undefined,
          corequisites: Subject.corequisites || undefined,
          assessmentMethod: Subject.assessmentMethod || undefined,
          credits: Subject.credits ?? undefined,
          semester: Subject.semester ?? undefined,
          theoryHours: Subject.theoryHours ?? undefined,
          practiceHours: Subject.practiceHours ?? undefined,
        };
        form.setFieldsValue(formValues);
      } else {
        form.resetFields();
        form.setFieldsValue({
          isElective: false,
          credits: 3,
          semester: 1,
        });
      }
    }
  }, [isOpen, Subject, form, departmentOptions, findDepartmentId]);

  const onFinish: FormProps<SubjectCreateVM>["onFinish"] = async (values) => {
    try {
      let response;
      if (Subject) {
        response = await subjectService.update({ ...values, id: Subject.id });
      } else {
        response = await subjectService.create(values);
      }

      if (response.status) {
        toast.success(
          Subject ? "Cập nhật môn học thành công" : "Thêm môn học thành công"
        );
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu dữ liệu");
    }
  };

  const assessmentMethods = [
    "Thi viết",
    "Thi vấn đáp",
    "Bài tập lớn",
    "Thực hành",
    "Tiểu luận",
    "Thi kết hợp",
    "Đồ án",
    "Thực tập",
  ];

  return (
    <Modal
      title={Subject ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
      width={800}
      onCancel={onClose}
      open={isOpen}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      footer={
        <div>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            <CloseOutlined /> Hủy
          </Button>
          <Button
            onClick={() => form.submit()}
            type="primary"
            icon={<SaveOutlined />}
          >
            Lưu
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isElective: false,
          credits: 3,
          semester: 1,
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Mã môn học"
              name="code"
              rules={[
                { required: true, message: "Vui lòng nhập mã môn học!" },
                {
                  pattern: /^[A-Z]{2,4}[0-9]{3,4}$/,
                  message: "Mã môn học không đúng định dạng (VD: CS101, MATH1001)!",
                },
              ]}
            >
              <Input
                placeholder="VD: CS101, MATH1001"
                style={{ textTransform: "uppercase" }}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              label="Tên môn học"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên môn học!" }]}
            >
              <Input placeholder="Nhập tên môn học" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Mô tả môn học" name="description">
              <TextArea
                rows={3}
                placeholder="Nhập mô tả chi tiết về môn học, nội dung, mục tiêu..."
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Số tín chỉ"
              name="credits"
              rules={[
                { required: true, message: "Vui lòng nhập số tín chỉ!" },
                {
                  type: "number",
                  min: 1,
                  max: 10,
                  message: "Số tín chỉ từ 1-10!",
                },
              ]}
            >
              <InputNumber min={1} max={10} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Học kỳ khuyến nghị" name="semester">
              <Select placeholder="Chọn học kỳ" allowClear>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <Option key={sem} value={sem}>
                    Học kỳ {sem}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Số tiết lý thuyết" name="theoryHours">
              <InputNumber
                min={0}
                max={200}
                style={{ width: "100%" }}
                placeholder="Số tiết"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Số tiết thực hành" name="practiceHours">
              <InputNumber
                min={0}
                max={200}
                style={{ width: "100%" }}
                placeholder="Số tiết"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Khoa/Bộ môn phụ trách"
              name="department"
              rules={[{ required: true, message: "Vui lòng chọn khoa/bộ môn!" }]}
            >
              <Select placeholder="Chọn khoa/bộ môn" showSearch>
                {departmentOptions.map((dept) => (
                  <Option key={dept.value} value={dept.value}>
                    {dept.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Hình thức đánh giá" name="assessmentMethod">
              <Select placeholder="Chọn hình thức đánh giá" allowClear>
                {assessmentMethods.map((method) => (
                  <Option key={method} value={method}>
                    {method}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Môn học tiên quyết" name="prerequisites">
              <Input
                placeholder="Mã môn học tiên quyết (VD: MATH101)"
                style={{ textTransform: "uppercase" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Môn học song hành" name="corequisites">
              <Input
                placeholder="Mã môn học song hành (VD: LAB101)"
                style={{ textTransform: "uppercase" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Loại môn học"
              name="isElective"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Tự chọn"
                unCheckedChildren="Bắt buộc"
                style={{ width: 120 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdate;
