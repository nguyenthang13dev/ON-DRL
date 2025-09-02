import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  Table,
  Popconfirm,
  notification,
  Card,
  Divider,
  Typography,
  Badge,
  Progress,
  Tag,
  Descriptions,
  Alert,
  Row,
  Col,
  Tooltip
} from "antd";
import { UseCaseCreateAndEditType, UseCaseGroupType, UseCaseWithDetailsType } from "@/types/UseCase/UseCase";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useCaseService } from "@/services/UseCase/UseCase.service";
import { useCase_NhomService } from "@/services/UseCase_Nhom/UseCase_Nhom.service";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface TestCaseModalProps {
  visible: boolean;
  data: UseCaseGroupType | null;
  duAnId: string;
  onSave: (data: UseCaseGroupType) => void;
  onClose: () => void;
}

interface TestCaseFormData {
  hanhDong: string;
  moTaKiemThu?: string;
  tinhHuongKiemThu?: string;
  ketQuaMongDoi?: string;
  taiKhoan?: string;
  linkHeThong?: string;
  trangThai?: string;
  moTaLoi?: string;
  ghiChu?: string;
}

const TestCaseModal: React.FC<TestCaseModalProps> = ({ visible, data, duAnId, onSave, onClose }) => {
  const [form] = Form.useForm();
  const [testCases, setTestCases] = useState<UseCaseWithDetailsType[]>([]);
  const [editingTestCase, setEditingTestCase] = useState<UseCaseWithDetailsType | null>(null);
  const [testCaseModalVisible, setTestCaseModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const permissions = useRolePermissions();

  useEffect(() => {
    if (visible && data) {
      // Edit mode - populate form with existing data
      form.setFieldsValue({
        tenUseCase: data.tenUseCase,
        tacNhanChinh: data.tacNhanChinh,
        tacNhanPhu: data.tacNhanPhu,
        doCanThiet: data.doCanThiet,
        doPhucTap: data.doPhucTap,
        moTa: data.moTa,
      });
      // Handle null or non-array listUC_mota
      if (data.listUC_mota && Array.isArray(data.listUC_mota)) {
        setTestCases(data.listUC_mota.filter(tc => tc !== null));
      } else {
        setTestCases([]);
      }
    } else if (visible) {
      // Add mode - reset form
      form.resetFields();
      setTestCases([]);
    }
  }, [visible, data, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (data?.id) {
        // Update existing Use Case group
        const useCaseNhomData = {
          id: data.id,
          IdDuAn: duAnId,
          TenUseCase: values.tenUseCase,
          TacNhanChinh: values.tacNhanChinh,
          TacNhanPhu: values.tacNhanPhu,
          DoCanThiet: values.doCanThiet,
          ParentId: '',
          DoPhucTap: values.doPhucTap,
          MoTa: values.moTa,
        };

        const response = await useCase_NhomService.update(useCaseNhomData);
        
        if (response.status) {
          const savedUseCaseGroup: UseCaseGroupType = {
            id: response.data?.id || data.id,
            idDuAn: response.data?.IdDuAn || duAnId,
            tenUseCase: response.data?.TenUseCase || values.tenUseCase,
            tacNhanChinh: response.data?.TacNhanChinh || values.tacNhanChinh,
            tacNhanPhu: response.data?.TacNhanPhu || values.tacNhanPhu,
            doCanThiet: response.data?.DoCanThiet || values.doCanThiet,
            doPhucTap: response.data?.DoPhucTap || values.doPhucTap,
            moTa: response.data?.MoTa || values.moTa,
            listUC_mota: testCases,
          };
          onSave(savedUseCaseGroup);
          onClose();
          notification.success({
            message: 'Cập nhật thành công',
            description: `Use Case "${values.tenUseCase}" đã được cập nhật thành công`,
          });
        } else {
          notification.error({
            message: 'Cập nhật thất bại',
            description: response.message || 'Có lỗi xảy ra khi cập nhật Use Case',
          });
        }
      }
       else {
        // For new Use Case, just prepare data and let parent handle the API call
        const savedUseCaseGroup: UseCaseGroupType = {
          id: crypto.randomUUID(), // Will be set by createUseCaseAndTestCase API
          idDuAn: duAnId,
          tenUseCase: values.tenUseCase,
          tacNhanChinh: values.tacNhanChinh,
          tacNhanPhu: values.tacNhanPhu,
          doCanThiet: values.doCanThiet,
          doPhucTap: values.doPhucTap,
          moTa: values.moTa,
          listUC_mota: testCases, // Include test cases for createUseCaseAndTestCase API
        };
        onSave(savedUseCaseGroup);
        onClose();
        // Don't show success notification here, let parent component handle it
      }
    } catch (error) {
      console.error('Save error:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi lưu Use Case. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestCaseSave = async (testCaseData: TestCaseFormData) => {
    try {
      let updatedTestCase: UseCaseWithDetailsType;

      if (editingTestCase) {
        // Update existing test case
        const response = await useCaseService.update({
          id: editingTestCase.id, // Ensure ID is passed
          idUseCase: editingTestCase.idUseCase ?? '', // Use nullish coalescing for safety
          hanhDong: testCaseData.hanhDong,
          moTaKiemThu: testCaseData.moTaKiemThu,
          tinhHuongKiemThu: testCaseData.tinhHuongKiemThu,
          ketQuaMongDoi: testCaseData.ketQuaMongDoi,
          taiKhoan: testCaseData.taiKhoan,
          linkHeThong: testCaseData.linkHeThong,
          trangThai: testCaseData.trangThai,
          moTaLoi: testCaseData.moTaLoi,
          ghiChu: testCaseData.ghiChu,
        });
        if (response.status) {

          console.log("response.data",response.data);
          updatedTestCase = {
            id: response.data.id ?? '',
            idUseCase: response.data.idUseCase ?? '',
            hanhDong: response.data.hanhDong ?? '',
            moTaKiemThu: response.data.moTaKiemThu ?? '',
            tinhHuongKiemThu: response.data.tinhHuongKiemThu ?? '',
            ketQuaMongDoi: response.data.ketQuaMongDoi ?? '',
            taiKhoan: response.data.taiKhoan ?? '',
            linkHeThong: response.data.linkHeThong ?? '',
            trangThai: response.data.trangThai ?? '',
            moTaLoi: response.data.moTaLoi ?? '',
            ghiChu: response.data.ghiChu ?? '',
          };
          console.log("updatedTestCase",updatedTestCase);
          setTestCases(prev => 
            prev.map(tc => tc.id === updatedTestCase.id ? updatedTestCase : tc)
          );
          notification.success({
            message: 'Cập nhật Test Case thành công',
          });
        } else {
          notification.error({
            message: 'Cập nhật Test Case thất bại',
            description: response.message || 'Có lỗi xảy ra khi cập nhật Test Case',
          });
          return; // Stop if API call fails
        }
      } else {
        // Create new test case
        if (data?.id) {
          // If editing existing Use Case, call API to create test case
          const newTestCase: UseCaseCreateAndEditType = {
            id: '',
            idUseCase: data.id,
            hanhDong: testCaseData.hanhDong,
            moTaKiemThu: testCaseData.moTaKiemThu,
            tinhHuongKiemThu: testCaseData.tinhHuongKiemThu,
            ketQuaMongDoi: testCaseData.ketQuaMongDoi,
            taiKhoan: testCaseData.taiKhoan,
            linkHeThong: testCaseData.linkHeThong,
            trangThai: testCaseData.trangThai,
            moTaLoi: testCaseData.moTaLoi,
            ghiChu: testCaseData.ghiChu,
          };
          const response = await useCaseService.create(newTestCase);
          if (response.status) {
            updatedTestCase = {
              id: response.data.id ?? '',
              idUseCase: response.data.idUseCase ?? '',
              hanhDong: response.data.hanhDong ?? '',
              moTaKiemThu: response.data.moTaKiemThu ?? '',
              tinhHuongKiemThu: response.data.tinhHuongKiemThu ?? '',
              ketQuaMongDoi: response.data.ketQuaMongDoi ?? '',
              taiKhoan: response.data.taiKhoan ?? '',
              linkHeThong: response.data.linkHeThong ?? '',
              trangThai: response.data.trangThai ?? '',
              moTaLoi: response.data.moTaLoi ?? '',
              ghiChu: response.data.ghiChu ?? '',
            };
            setTestCases(prev => [...prev, updatedTestCase]);
            notification.success({
              message: 'Thêm Test Case mới thành công',
            });
          } else {
            notification.error({
              message: 'Thêm Test Case mới thất bại',
              description: response.message || 'Có lỗi xảy ra khi thêm Test Case mới',
            });
            return; // Stop if API call fails
          }
        } else {
          // If creating new Use Case, only add to local state
          // The API call will be made when the Use Case is saved via createUseCaseAndTestCase
          updatedTestCase = {
            id: crypto.randomUUID(), // Generate UUID for temporary ID
            idUseCase: '', // Will be set when Use Case is created
            hanhDong: testCaseData.hanhDong ?? '',
            moTaKiemThu: testCaseData.moTaKiemThu ?? '',
            tinhHuongKiemThu: testCaseData.tinhHuongKiemThu ?? '',
            ketQuaMongDoi: testCaseData.ketQuaMongDoi ?? '',
            taiKhoan: testCaseData.taiKhoan ?? '',
            linkHeThong: testCaseData.linkHeThong ?? '',
            trangThai: testCaseData.trangThai ?? '',
            moTaLoi: testCaseData.moTaLoi ?? '',
            ghiChu: testCaseData.ghiChu ?? '',
          };
          setTestCases(prev => [...prev, updatedTestCase]);
          notification.success({
            message: 'Thêm Test Case mới thành công',
            description: 'Test Case sẽ được lưu khi lưu Use Case',
          });
        }
      }
      setTestCaseModalVisible(false);
      setEditingTestCase(null);
    } catch (error) {
      console.error('Save test case error:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi lưu Test Case. Vui lòng thử lại.',
      });
    }
  };

  const handleAddTestCase = () => {
    setEditingTestCase(null);
    setTestCaseModalVisible(true);
  };

  const handleEditTestCase = (testCase: UseCaseWithDetailsType) => {
    setEditingTestCase(testCase);
    setTestCaseModalVisible(true);
  };

  const handleDeleteTestCase = async (testCaseId: string) => {
    try {
      setLoading(true);
      const response = await useCaseService.delete(testCaseId);
      if (response.status) {
        setTestCases(prev => prev.filter(tc => tc.id !== testCaseId));
        notification.success({
          message: 'Xóa Test Case thành công',
          description: 'Test case đã được xóa khỏi hệ thống.',
        });
      } else {
        notification.error({
          message: 'Xóa Test Case thất bại',
          description: response.message || 'Có lỗi xảy ra khi xóa Test Case',
        });
      }
    } catch (error) {
      console.error('Delete test case error:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi xóa Test Case. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Admin columns - Full control
  const getAdminColumns = () => [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_: any, record: any, index: number) => (
        <div className="text-center font-semibold text-blue-600">{index + 1}</div>
      ),
    },
    {
      title: 'Chi tiết Test Case',
      dataIndex: 'hanhDong',
      key: 'hanhDong',
      render: (text: string, record: UseCaseWithDetailsType) => (
        <div className="space-y-2">
          <div className="font-bold text-blue-700">{text}</div>
          {record.moTaKiemThu && (
            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400 whitespace-pre-wrap leading-relaxed">
              <Text strong className="text-blue-700">Mô tả kiểm thử:</Text>
              <Paragraph className="mt-1 mb-0 text-sm">{record.moTaKiemThu}</Paragraph>
            </div>
          )}
          {record.ketQuaMongDoi && (
            <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
              <Text strong className="text-green-700">Kết quả mong đợi:</Text>
              <Paragraph className="mt-1 mb-0 text-sm">{record.ketQuaMongDoi}</Paragraph>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái & Thông tin',
      dataIndex: 'trangThai',
      key: 'status',
      width: 150,
      render: (status: string, record: UseCaseWithDetailsType) => (
        <div className="space-y-2">
          <Badge 
            status={status === 'Pass' ? 'success' : status === 'Fail' ? 'error' : status === 'Đang test' ? 'processing' : 'default'} 
            text={status || 'Chưa test'} 
          />
          {record.taiKhoan && (
            <div className="text-xs bg-gray-100 p-1 rounded">
              {record.taiKhoan}
            </div>
          )}
          {record.ghiChu && (
            <Tooltip title={record.ghiChu}>
              <div className="text-xs text-blue-600">Có ghi chú</div>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      render: (_: any, record: UseCaseWithDetailsType) => (
        <Space size="small" direction="vertical">
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEditTestCase(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa Test Case này?"
            onConfirm={() => handleDeleteTestCase(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" icon={<DeleteOutlined />} size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Dev columns - Technical focus
  const getDevColumns = () => [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_: any, record: any, index: number) => (
        <div className="text-center font-semibold">{index + 1}</div>
      ),
    },
    {
      title: 'Nhiệm vụ triển khai',
      dataIndex: 'hanhDong',
      key: 'hanhDong',
      render: (text: string, record: UseCaseWithDetailsType) => (
        <div className="space-y-3">
          <div className="font-bold text-blue-600 text-base">{text}</div>
          
          {/* Technical Implementation Details */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            {record.moTaKiemThu && (
              <div className="mb-3">
                <div className="flex items-center mb-1">
                  <span className="text-blue-600 font-medium">Triển khai:</span>
                </div>
                <div className="text-sm text-gray-700 bg-white p-2 rounded border-l-4 border-blue-400">
                  {record.moTaKiemThu}
                </div>
              </div>
            )}
            
            {record.ketQuaMongDoi && (
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-green-600 font-medium">Kết quả mong đợi:</span>
                </div>
                <div className="text-sm text-gray-700 bg-white p-2 rounded border-l-4 border-green-400">
                  {record.ketQuaMongDoi}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (text: string, record: UseCaseWithDetailsType) => (
        <div className="text-center">
          <Badge 
            status={text === 'Pass' ? 'success' : text === 'Fail' ? 'error' : text === 'Đang test' ? 'processing' : 'default'} 
            text={text || 'Chưa bắt đầu'} 
          />
          {record.moTaLoi && (
            <div className="text-xs text-red-600 mt-1">Có lỗi</div>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 80,
      render: (_: any, record: UseCaseWithDetailsType) => (
        <Button type="link" size="small" onClick={() => handleEditTestCase(record)}>
          Cập nhật
        </Button>
      ),
    },
  ];

  // Tester columns - Testing workflow focused
  const getTesterColumns = () => [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_: any, record: any, index: number) => (
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {index + 1}
          </div>
        </div>
      ),
    },
    {
      title: 'Hướng dẫn Test',
      dataIndex: 'hanhDong',
      key: 'testInstructions',
      render: (text: string, record: UseCaseWithDetailsType) => (
        <div className="space-y-4">
          {/* Test Action Header */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="font-bold text-blue-800 text-base mb-2">
              {text}
            </div>
          </div>

          {/* Detailed Instructions */}
          {record.moTaKiemThu && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="font-medium text-yellow-800 mb-2">Hướng dẫn chi tiết:</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {record.moTaKiemThu}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expected Result */}
          {record.ketQuaMongDoi && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="font-medium text-green-800 mb-2">Kết quả cần đạt được:</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {record.ketQuaMongDoi}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Environment Info */}
          {(record.taiKhoan || record.linkHeThong) && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="font-medium text-purple-800 mb-2">Thông tin môi trường test:</div>
                  <div className="space-y-1 text-sm">
                    {record.taiKhoan && (
                      <div><strong>Tài khoản:</strong> {record.taiKhoan}</div>
                    )}
                    {record.linkHeThong && (
                      <div><strong>Link:</strong> 
                        <a href={record.linkHeThong} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-1">
                          {record.linkHeThong}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Kết quả Test',
      dataIndex: 'trangThai',
      key: 'testResult',
      width: 150,
      render: (text: string, record: UseCaseWithDetailsType) => (
        <div className="text-center space-y-3">
          <div>
            <Badge 
              status={text === 'Pass' ? 'success' : text === 'Fail' ? 'error' : text === 'Đang test' ? 'processing' : 'default'} 
              text={text || 'Chưa test'} 
              className="text-sm"
            />
          </div>
          
          {/* Test Notes */}
          {record.ghiChu && (
            <div className="bg-blue-50 p-2 rounded text-xs">
              <div className="font-medium text-blue-700">Ghi chú:</div>
              <div className="text-gray-600 mt-1">{record.ghiChu.substring(0, 50)}...</div>
            </div>
          )}
          
          {/* Error Description */}
          {record.moTaLoi && (
            <div className="bg-red-50 p-2 rounded text-xs">
              <div className="font-medium text-red-700">Lỗi:</div>
              <div className="text-gray-600 mt-1">{record.moTaLoi.substring(0, 50)}...</div>
            </div>
          )}
          
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleEditTestCase(record)}
            className="text-blue-600"
          >
            {text ? 'Cập nhật' : 'Ghi kết quả'}
          </Button>
        </div>
      ),
    },
  ];

  const getCurrentColumns = () => {
    if (permissions.canAccessAdminView) return getAdminColumns();
    if (permissions.canAccessDevView) return getDevColumns();
    return getTesterColumns();
  };

  const getModalTitle = () => {
    if (permissions.canAccessTesterView && data) {
      return 'Kiểm thử Use Case';
    }
    if (permissions.canAccessDevView) {
      return data ? 'Cập nhật Use Case' : 'Tạo Use Case mới';
    }
    return data ? 'Chỉnh sửa Use Case' : 'Thêm Use Case mới';
  };

  const getModalWidth = () => {
    if (permissions.canAccessTesterView) return 1600;
    if (permissions.canAccessDevView) return 1400;
    return 1200;
  };

  // Calculate test progress
  const testProgress = React.useMemo(() => {
    // Filter out null values and treat them as empty array
    const validTestCases = testCases.filter(tc => tc !== null) || [];
    const total = validTestCases.length;
    const passed = validTestCases.filter(tc => tc && tc.trangThai?.toLowerCase() === 'pass').length;
    const failed = validTestCases.filter(tc => tc && tc.trangThai?.toLowerCase() === 'fail').length;
    const pending = total - passed - failed;
    
    return { total, passed, failed, pending };
  }, [testCases]);

  return (
    <>
      <Modal
        title={
          <div className="flex items-center">
            <span className="text-lg font-bold">{getModalTitle()}</span>
            {testProgress.total > 0 && (
              <div className="ml-4 flex gap-2">
                <Tag color="blue">{testProgress.total} Test</Tag>
                <Tag color="green">{testProgress.passed} Pass</Tag>
                <Tag color="red">{testProgress.failed} Fail</Tag>
              </div>
            )}
          </div>
        }
        open={visible}
        onCancel={onClose}
        width={getModalWidth()}
        footer={[
          <Button key="cancel" onClick={onClose}>
            {permissions.canAccessTesterView ? 'Đóng' : 'Hủy'}
          </Button>,
          ...(permissions.canEditUseCase ? [
            <Button key="save" type="primary" loading={loading} onClick={handleSave}>
              {data ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          ] : []),
        ]}
      >
        <div className="space-y-6">
          {/* Use Case Information */}
          {permissions.canAccessTesterView && data ? (
            // Tester view - Read-only with enhanced information display
            <Card title="Thông tin Use Case" size="small" className="bg-blue-50">
              <Row gutter={16}>
                <Col span={24}>
                  <div className="bg-white p-4 rounded border border-blue-200">
                    <Title level={4} className="text-blue-700 mb-3">{data.tenUseCase}</Title>
                    <Descriptions column={2} size="small" bordered>
                      <Descriptions.Item label="Tác nhân chính" span={1}>
                        <Text strong>{data.tacNhanChinh}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Độ ưu tiên" span={1}>
                        <Badge 
                          status={data.doCanThiet === 'A' ? 'error' : data.doCanThiet === 'B' ? 'warning' : 'success'} 
                          text={data.doCanThiet === 'A' ? 'Cao' : data.doCanThiet === 'B' ? 'Trung bình' : 'Thấp'}
                        />
                      </Descriptions.Item>
                      <Descriptions.Item label="Mô tả" span={2}>
                        <div className="bg-gray-50 p-3 rounded">
                          {data.moTa || 'Không có mô tả chi tiết'}
                        </div>
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                </Col>
              </Row>
            </Card>
          ) : (
            // Admin/Dev view - Editable form
            <Form form={form} layout="vertical" disabled={!permissions.canEditUseCase}>
              <Card title="Thông tin Use Case">
                <Form.Item name="tenUseCase" label="Tên Use Case" rules={[{ required: true, message: 'Vui lòng nhập tên Use Case' }]}>
                  <Input placeholder="Nhập tên Use Case" size="large" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="tacNhanChinh" label="Tác nhân chính" rules={[{ required: true, message: 'Vui lòng nhập tác nhân chính' }]}>
                      <Input placeholder="Nhập tác nhân chính" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="tacNhanPhu" label="Tác nhân phụ">
                      <Input placeholder="Nhập tác nhân phụ" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="doCanThiet" label="Độ cần thiết" rules={[{ required: true, message: 'Vui lòng chọn độ cần thiết' }]}>
                      <Select placeholder="Chọn độ cần thiết" size="large">
                        <Select.Option value="A">A - Cao</Select.Option>
                        <Select.Option value="B">B - Trung bình</Select.Option>
                        <Select.Option value="C">C - Thấp</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="doPhucTap" label="Độ phức tạp">
                      <Select placeholder="Chọn độ phức tạp" size="large">
                        <Select.Option value="Đơn giản">Đơn giản</Select.Option>
                        <Select.Option value="Trung bình">Trung bình</Select.Option>
                        <Select.Option value="Phức tạp">Phức tạp</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="moTa" label="Mô tả chi tiết">
                  <TextArea rows={3} placeholder="Nhập mô tả chi tiết cho Use Case" />
                </Form.Item>
              </Card>
            </Form>
          )}

          {/* Test Cases Section */}
          <Divider>
            <div className="flex items-center gap-4">
              <Title level={4} className="mb-0">
                {permissions.canAccessTesterView ? 'Checklist kiểm thử' : 
                 permissions.canAccessDevView ? 'Test Cases cần implement' :
                 'Test Cases'} ({testCases.filter(tc => tc !== null).length})
              </Title>
              {testProgress.total > 0 && (
                <Progress 
                  percent={testProgress.total > 0 ? Math.round((testProgress.passed / testProgress.total) * 100) : 0}
                  size="small"
                  strokeColor="#52c41a"
                  className="min-w-[100px]"
                />
              )}
            </div>
          </Divider>

          {permissions.canAccessTesterView && testCases.filter(tc => tc !== null).length === 0 && (
            <Alert
              message="Chưa có test case nào"
              description="Use Case này chưa được thiết lập test case. Vui lòng liên hệ với Dev để bổ sung."
              type="warning"
              showIcon
              className="mb-4"
            />
          )}

          <Card size="small" className={permissions.canAccessTesterView ? "bg-gray-50" : ""}>
            {permissions.canCreateTestCase && (
              <div className="mb-4">
                <Button 
                  type="dashed" 
                  onClick={handleAddTestCase} 
                  block 
                  size="large"
                  className="h-12 border-2 border-dashed"
                >
                  {permissions.canAccessTesterView ? 'Thêm ghi chú test mới' : 
                   permissions.canAccessDevView ? 'Thêm Test Case mới' :
                   'Thêm Test Case'}
                </Button>
              </div>
            )}
            
            <Table
              columns={getCurrentColumns()}
              dataSource={testCases.filter(tc => tc !== null)}
              rowKey="id"
              size={permissions.canAccessTesterView ? "middle" : "small"}
              pagination={false}
              scroll={{ x: permissions.canAccessTesterView ? 1200 : 800 }}
              className={permissions.canAccessTesterView ? "tester-table" : ""}
            />
            
            {testCases.filter(tc => tc !== null).length === 0 && !permissions.canAccessTesterView && (
              <div className="text-center py-12 text-gray-500">

                <div className="text-lg font-medium mb-2">Chưa có test case nào</div>
                <div className="text-sm">Bấm nút Thêm Test Case để bắt đầu</div>
              </div>
            )}
          </Card>
        </div>
      </Modal>

      {/* Test Case Form Modal */}
      {testCaseModalVisible && (
        <Modal
          title={
            editingTestCase ? 
              (permissions.canAccessTesterView ? 'Cập nhật kết quả kiểm thử' : 'Chỉnh sửa Test Case') : 
              (permissions.canAccessTesterView ? 'Thêm ghi chú kiểm thử' : 'Thêm Test Case mới')
          }
          open={testCaseModalVisible}
          onCancel={() => {
            setTestCaseModalVisible(false);
            setEditingTestCase(null);
          }}
          width={permissions.canAccessTesterView ? 900 : 800}
          footer={null}
        >
          <TestCaseForm
            data={editingTestCase}
            onSave={handleTestCaseSave}
            onCancel={() => {
              setTestCaseModalVisible(false);
              setEditingTestCase(null);
            }}
            permissions={permissions}
          />
        </Modal>
      )}
    </>
  );
};

// Enhanced Test Case Form
interface TestCaseFormProps {
  data: UseCaseWithDetailsType | null;
  onSave: (data: TestCaseFormData) => void;
  onCancel: () => void;
  permissions: any;
}

const TestCaseForm: React.FC<TestCaseFormProps> = ({ data, onSave, onCancel, permissions }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  if (permissions.canAccessTesterView) {
    // Tester form - Focus on test results and detailed feedback
    return (
      <div className="space-y-6">
        <Form form={form} layout="vertical">
          <Card title="Thông tin Test Case" className="bg-blue-50">
            <Form.Item name="hanhDong" label="Hành động cần test" rules={data ? [] : [{ required: true, message: 'Vui lòng nhập hành động' }]}>
              <Input placeholder="Nhập hành động cần test" disabled={!!data} size="large" />
            </Form.Item>
          </Card>

          <Card title="Kết quả kiểm thử" className="bg-green-50">
            <Form.Item name="trangThai" label="Kết quả test" rules={[{ required: true, message: 'Vui lòng chọn kết quả' }]}>
              <Select placeholder="Chọn kết quả kiểm thử" size="large">
                <Select.Option value="Pass">Pass - Test thành công</Select.Option>
                <Select.Option value="Fail">Fail - Phát hiện lỗi</Select.Option>
                <Select.Option value="Đang test">Đang test - Chưa hoàn thành</Select.Option>
                <Select.Option value="Chưa test">Chưa test</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="ghiChu" label="Ghi chú chi tiết về quá trình kiểm thử">
              <TextArea 
                rows={4} 
                placeholder="Mô tả chi tiết quá trình test, những gì đã làm, kết quả quan sát được..." 
              />
            </Form.Item>

            <Form.Item name="moTaLoi" label="Mô tả lỗi (nếu có)">
              <TextArea 
                rows={4} 
                placeholder="Nếu test fail, hãy mô tả chi tiết lỗi: cách tái tạo, thông báo lỗi, ảnh hưởng..." 
              />
            </Form.Item>

            <Form.Item name="linkHeThong" label="Link hệ thống test">
              <Input placeholder="URL để test" />
            </Form.Item>
          </Card>

          <div className="flex justify-end gap-3">
            <Button onClick={onCancel} size="large">
              Hủy
            </Button>
            <Button type="primary" onClick={handleSave} size="large">
              {data ? 'Cập nhật kết quả' : 'Lưu kết quả test'}
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  // Admin/Dev form - Full detailed form (Dev can now edit status and notes too)
  return (
    <div className="space-y-4">
      <Form form={form} layout="vertical">
        <Card title="Chi tiết Test Case">
          <Form.Item name="hanhDong" label="Hành động" rules={[{ required: true, message: 'Vui lòng nhập hành động' }]}>
            <Input placeholder="Nhập hành động cần thực hiện" />
          </Form.Item>

          <Form.Item name="moTaKiemThu" label="Mô tả kiểm thử chi tiết" extra="Hướng dẫn chi tiết cách thực hiện kiểm thử">
            <TextArea 
              rows={4} 
              placeholder="Mô tả chi tiết từng bước cần thực hiện để kiểm thử..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item name="tinhHuongKiemThu" label="Tình huống kiểm thử" extra="Điều kiện, dữ liệu đầu vào">
            <TextArea 
              rows={3} 
              placeholder="Mô tả tình huống, điều kiện đầu vào để thực hiện test..."
              showCount
              maxLength={300}
            />
          </Form.Item>

          <Form.Item name="ketQuaMongDoi" label="Kết quả mong đợi" extra="Kết quả cụ thể sau khi thực hiện">
            <TextArea 
              rows={3} 
              placeholder="Mô tả kết quả cụ thể mong đợi sau khi thực hiện test..."
              showCount
              maxLength={300}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="taiKhoan" label="Tài khoản test">
                <Input placeholder="Tài khoản để test" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="trangThai" label="Trạng thái">
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="Chưa test">Chưa test</Select.Option>
                  <Select.Option value="Đang test">Đang test</Select.Option>
                  <Select.Option value="Pass">Pass</Select.Option>
                  <Select.Option value="Fail">Fail</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="linkHeThong" label="Link hệ thống test">
            <Input placeholder="URL để truy cập hệ thống test" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ghiChu" label="Ghi chú">
                <TextArea rows={3} placeholder="Ghi chú thêm về test case..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="moTaLoi" label="Mô tả lỗi">
                <TextArea rows={3} placeholder="Mô tả chi tiết lỗi (nếu có)..." />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" onClick={handleSave}>
            {data ? 'Cập nhật' : 'Thêm'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TestCaseModal;   