import { 
  Card, 
  Descriptions, 
  Typography, 
  Badge, 
  Button, 
  Space, 
  Form, 
  Input, 
  Select, 
  notification,
  Steps,
  Row,
  Col,
  Statistic
} from "antd";
import { UseCaseWithDetailsType } from "@/types/UseCase/UseCase";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;

interface TestCaseDetailViewProps {
  testCase: UseCaseWithDetailsType;
  useCaseName: string;
  onUpdate: (updatedTestCase: UseCaseWithDetailsType) => void;
  onClose: () => void;
  mode: 'view' | 'edit';
}

const TestCaseDetailView: React.FC<TestCaseDetailViewProps> = ({
  testCase,
  useCaseName,
  onUpdate,
  onClose,
  mode: initialMode
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const permissions = useRolePermissions();

   useEffect(() => {
    if (testCase) {
      form.setFieldsValue(testCase);
    }
  }, [testCase, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const updatedTestCase = { ...testCase, ...values };
      onUpdate(updatedTestCase);
      setMode('view');
      notification.success({
        message: 'Cập nhật thành công',
        description: 'Test case đã được cập nhật',
      });
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pass': return 'success';
      case 'fail': return 'error';
      case 'đang test': return 'processing';
      case 'chưa test': return 'default';
      default: return 'default';
    }
  };

  const getTestSteps = () => {
    const steps = [];
    if (testCase.moTaKiemThu) steps.push({ title: 'Mô tả kiểm thử', content: testCase.moTaKiemThu });
    if (testCase.tinhHuongKiemThu) steps.push({ title: 'Tình huống test', content: testCase.tinhHuongKiemThu });
    if (testCase.ketQuaMongDoi) steps.push({ title: 'Kết quả mong đợi', content: testCase.ketQuaMongDoi });
    return steps;
  };

  // Admin View - Complete technical details
  const renderAdminView = () => (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <Title level={3} className="mb-2">{testCase.hanhDong}</Title>
            <Text type="secondary" className="text-base">Use Case: {useCaseName}</Text>
          </div>
          <div className="text-right">
            <Badge status={getStatusColor(testCase.trangThai || '')} text={testCase.trangThai || 'Chưa test'} className="text-lg" />
            <div className="mt-2">
              {mode === 'view' ? (
                <Button type="primary" onClick={() => setMode('edit')}>
                  Chỉnh sửa
                </Button>
              ) : (
                <Space>
                  <Button onClick={() => setMode('view')}>Hủy</Button>
                  <Button type="primary" loading={loading} onClick={handleSave}>
                    Lưu
                  </Button>
                </Space>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Row gutter={24}>
        <Col span={16}>
          {mode === 'view' ? (
            <Card title="Chi tiết Test Case" className="h-full">
              <Descriptions column={1} size="default">
                <Descriptions.Item label="Mô tả kiểm thử">
                  <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                    <Paragraph>{testCase.moTaKiemThu || 'Không có mô tả'}</Paragraph>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Tình huống kiểm thử">
                  <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
                    <Paragraph>{testCase.tinhHuongKiemThu || 'Không có tình huống'}</Paragraph>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Kết quả mong đợi">
                  <div className="bg-green-50 p-4 rounded border-l-4 border-green-400">
                    <Paragraph>{testCase.ketQuaMongDoi || 'Không có kết quả mong đợi'}</Paragraph>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ) : (
            <Card title="Chỉnh sửa Test Case">
              <Form form={form} layout="vertical">
                <Form.Item name="hanhDong" label="Hành động" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="moTaKiemThu" label="Mô tả kiểm thử">
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="tinhHuongKiemThu" label="Tình huống kiểm thử">
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="ketQuaMongDoi" label="Kết quả mong đợi">
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
            </Card>
          )}
        </Col>

        <Col span={8}>
          <Card title="Thông tin Test" className="mb-4">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Trạng thái">
                <Badge status={getStatusColor(testCase.trangThai || '')} text={testCase.trangThai || 'Chưa test'} />
              </Descriptions.Item>
              <Descriptions.Item label="Tài khoản test">
                {testCase.taiKhoan || 'Không có'}
              </Descriptions.Item>
              <Descriptions.Item label="Link hệ thống">
                {testCase.linkHeThong ? (
                  <a href={testCase.linkHeThong} target="_blank" rel="noopener noreferrer">
                    {testCase.linkHeThong}
                  </a>
                ) : 'Không có'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {(testCase.moTaLoi || testCase.ghiChu) && (
            <Card title="Ghi chú & Lỗi">
              {testCase.ghiChu && (
                <div className="mb-3">
                  <Text strong className="text-green-600">Ghi chú:</Text>
                  <div className="bg-green-50 p-3 rounded mt-1">
                    {testCase.ghiChu}
                  </div>
                </div>
              )}
              {testCase.moTaLoi && (
                <div>
                  <Text strong className="text-red-600">Lỗi:</Text>
                  <div className="bg-red-50 p-3 rounded mt-1">
                    {testCase.moTaLoi}
                  </div>
                </div>
              )}
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );

  // Dev View - Development focused
  const renderDevView = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <Title level={3}>{testCase.hanhDong}</Title>
            <Badge status={getStatusColor(testCase.trangThai || '')} text={testCase.trangThai || 'Chưa test'} className="text-lg" />
          </div>
          <Space>
            {mode === 'view' && (permissions.canEditTestCase || permissions.canUpdateTestStatus) && (
              <Button type="primary" onClick={() => setMode('edit')}>
                Cập nhật
              </Button>
            )}
            {mode === 'edit' && (
              <>
                <Button onClick={() => setMode('view')}>Hủy</Button>
                <Button type="primary" loading={loading} onClick={handleSave}>
                  Lưu
                </Button>
              </>
            )}
          </Space>
        </div>
      </Card>

      {mode === 'view' ? (
        <Row gutter={24}>
          <Col span={24}>
            <Card title="Hướng dẫn triển khai">
              <Steps direction="vertical" current={-1}>
                {getTestSteps().map((step, index) => (
                  <Step
                    key={index}
                    title={step.title}
                    description={
                      <div className="bg-gray-50 p-4 rounded mt-2">
                        <Text>{step.content}</Text>
                      </div>
                    }
                  />
                ))}
              </Steps>
            </Card>
          </Col>
        </Row>
      ) : (
        <Card title="Chỉnh sửa Test Case">
          <Form form={form} layout="vertical">
            <Form.Item name="hanhDong" label="Hành động" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="moTaKiemThu" label="Mô tả kiểm thử">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="ketQuaMongDoi" label="Kết quả mong đợi">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item name="trangThai" label="Trạng thái">
              <Select>
                <Select.Option value="Chưa test">Chưa bắt đầu</Select.Option>
                <Select.Option value="Đang test">Đang tiến hành</Select.Option>
                <Select.Option value="Pass">Pass</Select.Option>
                <Select.Option value="Fail">Fail</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="ghiChu" label="Ghi chú">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="moTaLoi" label="Mô tả lỗi">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="linkHeThong" label="Link test">
              <Input />
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );

  // Tester View - Testing workflow optimized
  const renderTesterView = () => (
    <div className="space-y-6">
      {/* Test Case Header với Status lớn */}
      <Card className="border-2" style={{ borderColor: getStatusColor(testCase.trangThai || '') === 'success' ? '#52c41a' : getStatusColor(testCase.trangThai || '') === 'error' ? '#ff4d4f' : '#d9d9d9' }}>
        <div className="text-center">
          <Title level={2} className="mb-4">{testCase.hanhDong}</Title>
          <Badge 
            status={getStatusColor(testCase.trangThai || '')} 
            text={testCase.trangThai || 'Chưa test'} 
            className="text-xl"
            style={{ fontSize: '18px' }}
          />
          <div className="mt-4">
            <Text type="secondary" className="text-base">Test Case thuộc: {useCaseName}</Text>
          </div>
        </div>
      </Card>

      {/* Checklist-style Testing Steps */}
      <Card title="Hướng dẫn kiểm thử chi tiết">
        <div className="space-y-6">
          {/* Step 1: Test Description */}
          <div className="border-l-4 border-blue-400 bg-blue-50 p-6 rounded-r">
            <div className="flex items-start">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 font-bold">1</div>
              <div className="flex-1">
                <Title level={4} className="text-blue-700 mb-3">Cách thực hiện kiểm thử</Title>
                <div className="bg-white p-4 rounded border border-blue-200">
                  <Paragraph className="text-base leading-relaxed mb-0">
                    {testCase.moTaKiemThu || 'Không có hướng dẫn cụ thể - Vui lòng liên hệ Dev để bổ sung'}
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Test Scenario */}
          {testCase.tinhHuongKiemThu && (
            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-6 rounded-r">
              <div className="flex items-start">
                <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 font-bold">2</div>
                <div className="flex-1">
                  <Title level={4} className="text-yellow-700 mb-3">Tình huống cần test</Title>
                  <div className="bg-white p-4 rounded border border-yellow-200">
                    <Paragraph className="text-base leading-relaxed mb-0">
                      {testCase.tinhHuongKiemThu}
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Expected Result */}
          <div className="border-l-4 border-green-400 bg-green-50 p-6 rounded-r">
            <div className="flex items-start">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 font-bold">3</div>
              <div className="flex-1">
                <Title level={4} className="text-green-700 mb-3">Kết quả mong đợi</Title>
                <div className="bg-white p-4 rounded border border-green-200">
                  <Paragraph className="text-base leading-relaxed mb-0">
                    {testCase.ketQuaMongDoi || 'Không có mô tả kết quả mong đợi - Vui lòng liên hệ Dev'}
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Test Information Panel */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Thông tin test" size="small">
            <div className="space-y-3">
              <div>
                <Text strong>Tài khoản test:</Text>
                <div className="bg-gray-100 p-2 rounded mt-1">
                  {testCase.taiKhoan || 'Chưa có tài khoản test'}
                </div>
              </div>
              <div>
                <Text strong>Link hệ thống:</Text>
                <div className="bg-gray-100 p-2 rounded mt-1">
                  {testCase.linkHeThong ? (
                    <a href={testCase.linkHeThong} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                      {testCase.linkHeThong}
                    </a>
                  ) : 'Chưa có link test'}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card 
            title="Cập nhật kết quả test" 
            size="small"
            extra={
              mode === 'view' && permissions.canUpdateTestStatus ? (
                <Button size="small" type="primary" onClick={() => setMode('edit')}>
                  Cập nhật
                </Button>
              ) : null
            }
          >
            {mode === 'edit' ? (
              <Form form={form} layout="vertical" className="mb-0">
                <Form.Item name="trangThai" label="Kết quả test" className="mb-3">
                  <Select size="large">
                    <Select.Option value="Pass">Pass - Thành công</Select.Option>
                    <Select.Option value="Fail">Fail - Có lỗi</Select.Option>
                    <Select.Option value="Đang test">Đang test</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="moTaKiemThu" label="Mô tả kiểm thử" className="mb-3">
                  <TextArea rows={3} placeholder="Mô tả chi tiết cách kiểm thử..." />
                </Form.Item>
                <Form.Item name="tinhHuongKiemThu" label="Tình huống kiểm thử" className="mb-3">
                  <TextArea rows={3} placeholder="Mô tả các tình huống cần test..." />
                </Form.Item>
                <Form.Item name="ketQuaMongDoi" label="Kết quả mong đợi" className="mb-3">
                  <TextArea rows={3} placeholder="Kết quả mong đợi từ việc kiểm thử..." />
                </Form.Item>
                <Form.Item name="ghiChu" label="Ghi chú" className="mb-3">
                  <TextArea rows={3} placeholder="Ghi chú về quá trình test..." />
                </Form.Item>
                <Form.Item name="moTaLoi" label="Mô tả lỗi (nếu có)" className="mb-3">
                  <TextArea rows={3} placeholder="Mô tả chi tiết lỗi..." />
                </Form.Item>
                <Form.Item name="linkHeThong" label="Link test" className="mb-3">
                  <Input placeholder="URL để test..." />
                </Form.Item>
                <div className="text-right">
                  <Space>
                    <Button onClick={() => setMode('view')}>Hủy</Button>
                    <Button type="primary" loading={loading} onClick={handleSave}>
                      Lưu kết quả
                    </Button>
                  </Space>
                </div>
              </Form>
            ) : (
              <div className="space-y-3">
                {testCase.ghiChu && (
                  <div>
                    <Text strong className="text-green-600">Ghi chú:</Text>
                    <div className="bg-green-50 p-3 rounded mt-1 border-l-4 border-green-400">
                      {testCase.ghiChu}
                    </div>
                  </div>
                )}
                {testCase.moTaLoi && (
                  <div>
                    <Text strong className="text-red-600">Lỗi phát hiện:</Text>
                    <div className="bg-red-50 p-3 rounded mt-1 border-l-4 border-red-400">
                      {testCase.moTaLoi}
                    </div>
                  </div>
                )}
                {!testCase.ghiChu && !testCase.moTaLoi && (
                  <Text type="secondary">Chưa có ghi chú nào</Text>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Render based on role
  const renderContent = () => {
    if (permissions.canAccessAdminView) return renderAdminView();
    if (permissions.canAccessDevView) return renderDevView();
    return renderTesterView();
  };

  return (
    <div className="test-case-detail-view">
      {renderContent()}
    </div>
  );
};

export default TestCaseDetailView; 