'use client';

import { khoaService } from "@/services/khoa/khoa.service";
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


  const [ departmentOptions, setDepartmentOptions ] = useState<DropdownOption[]>( [] );

  const [ subjectOptions, setSubjectOptions ] = useState<DropdownOption[]>( [] );
  const [ subjectMaster, setSubjectMasters ] = useState<DropdownOption[]>( [] );


  // Helper function to find department ID by name (for backward compatibility)
  const findDepartmentId = useCallback((departmentName: string | null): string | null => {
    if (!departmentName) return null;
    const dept = departmentOptions.find(d => d.label === departmentName);
    return dept ? dept.value : null;
  }, [departmentOptions]);



  const handleGetDropDownSubject = useCallback( async () =>
  {
    const response = await subjectService.GetDropDownSubject( "" );
    if ( response.status )
    {
      setSubjectOptions( response.data );
      setSubjectMasters( response.data );
    }

  }, []);

  const handleGetDropDownData = useCallback( async () =>
  {
    const response = await khoaService.GetDropKhoa( "" );
    if ( response.status )
    {
      setDepartmentOptions( response.data );
    } else
    {
      toast.error( "Lỗi khi tải danh sách khoa/bộ môn" );
    }
  }, [] );


  useEffect( () => {
    handleGetDropDownData();
    handleGetDropDownSubject();
  }, [handleGetDropDownData, handleGetDropDownSubject] );

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
    { label: "Thi viết", value: "thiviet" },
    { label: "Thi vấn đáp", value: "thivandap" },
    { label: "Bài tập lớn", value: "baitaplon" },
    { label: "Thực hành", value: "thuchanh" },
    { label: "Tiểu luận", value: "tieuluan" },
    { label: "Thi kết hợp", value: "thikethop" },
    { label: "Đồ án", value: "doan" },
    { label: "Thực tập", value: "thuctap" },
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
                  <Option key={method.value} value={method.value}>
                    {method.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Môn học tiên quyết" name="prerequisites">
                <Select
                  placeholder="Chọn môn học tiên quyết"
                  allowClear
                  showSearch
                  options={subjectOptions}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Môn học song hành" name="corequisites">
              <Select
                  placeholder="Chọn môn học song hành"
                  allowClear
                  showSearch
                  options={subjectMaster}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
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
