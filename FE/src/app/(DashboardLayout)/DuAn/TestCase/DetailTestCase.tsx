import React, { useState } from "react";
import { Modal, Descriptions, Table, Tag, Card, Typography, Divider, Empty, Progress, Badge, Row, Col, Statistic, Button, Space } from "antd";
import { UseCaseGroupType, UseCaseWithDetailsType } from "@/types/UseCase/UseCase";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const { Title, Text, Paragraph } = Typography;

interface DetailTestCaseProps {
  visible: boolean;
  data: UseCaseGroupType | null;
  onClose: () => void;
}

const DetailTestCase: React.FC<DetailTestCaseProps> = ({ visible, data, onClose }) => {
  const permissions = useRolePermissions();
  const [viewingTestCase, setViewingTestCase] = useState<UseCaseWithDetailsType | null>(null);

  // Calculate test statistics
  const testStats = React.useMemo(() => {
    if (!data?.listUC_mota || !Array.isArray(data.listUC_mota)) {
      return { total: 0, passed: 0, failed: 0, pending: 0, completionRate: 0 };
    }
    
    // Filter out null values and treat them as empty array
    const testCases = data.listUC_mota.filter(tc => tc !== null) || [];
    const total = testCases.length;
    const passed = testCases.filter(tc => tc && tc.trangThai?.toLowerCase() === 'pass').length;
    const failed = testCases.filter(tc => tc && tc.trangThai?.toLowerCase() === 'fail').length;
    const pending = total - passed - failed;
    const completionRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    return { total, passed, failed, pending, completionRate };
  }, [data]);

  const handleViewTestCaseDetail = (testCase: UseCaseWithDetailsType) => {
    setViewingTestCase(testCase);
  };

  // Admin columns - Comprehensive management view
  const getAdminColumns = () => [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_: any, record: any, index: number) => (
        <div className="text-center font-bold text-blue-600">{index + 1}</div>
      ),
    },
    {
      title: 'Tổng quan Test Case',
      dataIndex: 'hanhDong',
      key: 'hanhDong',
      render: (text: string, record: UseCaseWithDetailsType) => (
        <div className="space-y-2">
          <Text strong className="text-blue-600 text-base ">{text}</Text>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {record.moTaKiemThu && (
              <div className="bg-blue-50 p-2 rounded text-sm border-l-4 border-blue-400">
         
                <div className="whitespace-pre-wrap leading-relaxed">{record.moTaKiemThu}...</div>
              </div>
            )}
            {record.ketQuaMongDoi && (
              <div className="bg-green-50 p-2 rounded text-sm border-l-4 border-green-400">
                <Text strong className="text-green-700">Kết quả mong đợi:</Text>
                <div className="mt-1">{record.ketQuaMongDoi.substring(0, 100)}...</div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái & Chi tiết',
      dataIndex: 'trangThai',
      key: 'statusDetails',
      width: 150,
      render: (text: string, record: UseCaseWithDetailsType) => (
        <div className="space-y-2">
          <Badge 
            status={text === 'Pass' ? 'success' : text === 'Fail' ? 'error' : text === 'Đang test' ? 'processing' : 'default'} 
            text={text || 'Chưa test'} 
          />
          {record.taiKhoan && (
            <div className="text-xs bg-purple-100 p-1 rounded">{record.taiKhoan}</div>
          )}
          {record.ghiChu && (
            <div className="text-xs text-blue-600">Có ghi chú</div>
          )}
          {record.moTaLoi && (
            <div className="text-xs text-red-600">Có lỗi</div>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 80,
      render: (_: any, record: UseCaseWithDetailsType) => (
        <Button 
          type="link" 
          size="small" 
          onClick={() => handleViewTestCaseDetail(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // Dev columns - Technical implementation focus
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
      title: 'Implementation Task',
      dataIndex: 'hanhDong',
      key: 'implementation',
      render: (text: string, record: UseCaseWithDetailsType) => (
        <div className="space-y-3">
          <div className="font-bold text-blue-600 text-base">{text}</div>
          
          {/* Technical Requirements */}
          <div className="bg-gray-50 p-3 rounded border">
            {record.moTaKiemThu && (
              <div className="mb-2">
                <div className="font-medium text-blue-600 mb-1">Chi tiết thực hiện:</div>
                <div className="text-sm text-gray-700 bg-white p-2 rounded border-l-4 border-blue-400">
                  {record.moTaKiemThu}
                </div>
              </div>
            )}
            
            {record.ketQuaMongDoi && (
              <div>
                <div className="font-medium text-green-600 mb-1">Tiêu chí thành công:</div>
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
      title: 'Trạng thái Dev',
      dataIndex: 'trangThai',
      key: 'devStatus',
      width: 120,
      render: (text: string, record: UseCaseWithDetailsType) => (
        <div className="text-center space-y-2">
          <Badge 
            status={text === 'Pass' ? 'success' : text === 'Fail' ? 'error' : text === 'Đang test' ? 'processing' : 'default'} 
            text={text || 'Chưa bắt đầu'} 
          />
          {record.moTaLoi && (
            <div className="text-xs text-red-600 bg-red-50 p-1 rounded">
              Tìm thấy lỗi
            </div>
          )}
        </div>
      ),
    },
  ];

  // Tester columns - Testing workflow optimized
  const getTesterColumns = () => [
    {
      title: 'Test #',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_: any, record: any, index: number) => (
        <div className="text-center">
          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
            {index + 1}
          </div>
        </div>
      ),
    },
    {
      title: 'Test Instructions & Expected Results',
      dataIndex: 'hanhDong',
      key: 'testInstructions',
      render: (text: string, record: UseCaseWithDetailsType) => (
        <div className="space-y-4">
          {/* Main Test Action */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="font-bold text-blue-800 text-lg mb-2">
              {text}
            </div>
          </div>

          {/* Detailed Test Instructions */}
          {record.moTaKiemThu && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="font-semibold text-yellow-800 mb-2">Hướng dẫn từng bước:</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded border">
                    {record.moTaKiemThu}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expected Results */}
          {record.ketQuaMongDoi && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="font-semibold text-green-800 mb-2">Kết quả mong đợi:</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded border">
                    {record.ketQuaMongDoi}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Test Context */}
          {record.tinhHuongKiemThu && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="font-semibold text-purple-800 mb-2">Kịch bản test:</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded border">
                    {record.tinhHuongKiemThu}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Environment */}
          {(record.taiKhoan || record.linkHeThong) && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="font-semibold text-gray-800 mb-2">Môi trường test:</div>
              <div className="space-y-1 text-sm">
                {record.taiKhoan && (
                  <div className="bg-white p-2 rounded border">
                    <strong>Tài khoản Test:</strong> {record.taiKhoan}
                  </div>
                )}
                {record.linkHeThong && (
                  <div className="bg-white p-2 rounded border">
                    <strong>URL test:</strong> 
                    <a href={record.linkHeThong} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2">
                      {record.linkHeThong}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái test & Ghi chú',
      dataIndex: 'trangThai',
      key: 'testStatus',
      width: 200,
      render: (text: string, record: UseCaseWithDetailsType) => (
        <div className="space-y-4">
          {/* Test Status */}
          <div className="text-center">
            <div className="mb-2">
              <Badge 
                status={text === 'Pass' ? 'success' : text === 'Fail' ? 'error' : text === 'Đang test' ? 'processing' : 'default'} 
                text={text || 'Chưa test'} 
                className="text-base font-medium"
              />
            </div>
            
            {/* Status-based action button */}
            <Button 
              type="primary" 
              size="small" 
              onClick={() => handleViewTestCaseDetail(record)}
              className={
                text === 'Pass' ? 'bg-green-500 border-green-500' :
                text === 'Fail' ? 'bg-red-500 border-red-500' :
                text === 'Đang test' ? 'bg-orange-500 border-orange-500' :
                'bg-gray-500 border-gray-500'
              }
            >
              {text ? 'Xem chi tiết' : 'Bắt đầu test'}
            </Button>
          </div>

          {/* Test Notes */}
          {record.ghiChu && (
            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400 whitespace-pre-wrap leading-relaxed">
              <div className="font-medium text-blue-700 mb-1">Ghi chú test:</div>
              <div className="text-xs text-gray-600">{record.ghiChu}</div>
            </div>
          )}
          
          {/* Error Information */}
          {record.moTaLoi && (
            <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
              <div className="font-medium text-red-700 mb-1">Lỗi tìm thấy:</div>
              <div className="text-xs text-gray-600">{record.moTaLoi}</div>
          </div>
          )}
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
    if (permissions.canAccessTesterView) return 'Bảng điều khiển thực hiện Test';
    if (permissions.canAccessDevView) return 'Tổng quan phát triển';
    return 'Quản lý Use Case';
  };

  const getModalWidth = () => {
    if (permissions.canAccessTesterView) return 1600;
    if (permissions.canAccessDevView) return 1400;
    return 1200;
  };

  return (
    <>
    <Modal
      title={
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">{getModalTitle()}</span>
          
        </div>
      }
      open={visible}
      onCancel={onClose}
        width={getModalWidth()}
        footer={[
          <Button key="close" onClick={onClose} size="large">
            {permissions.canAccessTesterView ? 'Đóng Bảng điều khiển' : 'Đóng'}
          </Button>
        ]}
    >
      {data ? (
          <div className="space-y-6">
            {/* Statistics Dashboard for Admin */}
            {permissions.canViewSystemMetrics && testStats.total > 0 && (
              <Row gutter={16} className="mb-6">
                <Col span={6}>
                  <Card size="small" className="text-center">
                    <Statistic
                      title="Tổng số Test"
                      value={testStats.total}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" className="text-center">
                    <Statistic
                      title="Passed"
                      value={testStats.passed}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" className="text-center">
                    <Statistic
                      title="Failed"
                      value={testStats.failed}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" className="text-center">
                    <Statistic
                      title="Tỷ lệ hoàn thành"
                      value={testStats.completionRate}
                      precision={0}
                      suffix="%"
                      valueStyle={{ color: testStats.completionRate > 80 ? '#52c41a' : testStats.completionRate > 50 ? '#faad14' : '#ff4d4f' }}
                    />
                  </Card>
                </Col>
              </Row>
            )}

            {/* Progress Overview for Dev */}
            {permissions.canAccessDevView && testStats.total > 0 && (
              <Card className="mb-6" size="small">
                <div className="flex justify-between items-center mb-4">
                  <Title level={5} className="mb-0">Tiến độ phát triển</Title>
                  <div className="text-sm text-gray-500">{testStats.passed}/{testStats.total} test đã pass</div>
                </div>
                <Progress 
                  percent={testStats.completionRate} 
                  strokeColor={testStats.completionRate === 100 ? '#52c41a' : testStats.completionRate > 50 ? '#faad14' : '#f5222d'}
                  trailColor="#f0f0f0"
                  className="mb-3"
                />
                <div className="flex justify-between text-sm">
                  <Space>
                    <span className="text-green-600">Pass: {testStats.passed}</span>
                    <span className="text-red-600">Fail: {testStats.failed}</span>
                    <span className="text-gray-600">Pending: {testStats.pending}</span>
                  </Space>
                  <div className="text-gray-500">
                    {testStats.completionRate === 100 ? 'Tất cả test đã pass!' : 
                     testStats.completionRate > 80 ? 'Gần xong!' :
                     testStats.completionRate > 50 ? 'Tiến độ tốt!' : 'Mới bắt đầu'}
                  </div>
                </div>
              </Card>
            )}

            {/* Use Case Information */}
            <Card className="mb-6" title={
              <div className="flex items-center">
                <span>Thông tin Use Case</span>
                {permissions.canAccessTesterView && (
                  <Badge 
                    className="ml-3" 
                    status={data.doCanThiet === 'A' ? 'error' : data.doCanThiet === 'B' ? 'warning' : 'success'} 
                    text={`Độ ưu tiên ${data.doCanThiet}`}
                  />
                )}
              </div>
            }>
              <Descriptions bordered column={permissions.canAccessTesterView ? 1 : 2} size={permissions.canAccessTesterView ? 'default' : 'small'}>
                <Descriptions.Item label="Tên Use Case" span={permissions.canAccessTesterView ? 1 : 2}>
                <Text strong className="text-lg text-blue-600">{data.tenUseCase}</Text>
              </Descriptions.Item>
                <Descriptions.Item label="Tác nhân chính">
                  <Text strong>{data.tacNhanChinh || 'Chưa xác định'}</Text>
              </Descriptions.Item>
                {!permissions.canAccessTesterView && (
                  <Descriptions.Item label="Tác nhân phụ">
                    {data.tacNhanPhu || <Text type="secondary">Không có</Text>}
              </Descriptions.Item>
                )}
                <Descriptions.Item label="Độ ưu tiên">
                <Tag color={
                  data.doCanThiet === 'A' ? 'red' :
                  data.doCanThiet === 'B' ? 'orange' : 'green'
                }>
                    {data.doCanThiet === 'A' ? 'Cao' : data.doCanThiet === 'B' ? 'Trung bình' : 'Thấp'}
                </Tag>
              </Descriptions.Item>
                {!permissions.canAccessTesterView && (
                  <Descriptions.Item label="Độ phức tạp">
                <Tag color={
                  data.doPhucTap === 'Phức tạp' ? 'red' :
                  data.doPhucTap === 'Trung bình' ? 'orange' : 'green'
                }>
                  {data.doPhucTap}
                </Tag>
              </Descriptions.Item>
                )}
                <Descriptions.Item label="Mô tả" span={permissions.canAccessTesterView ? 1 : 2}>
                  <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                    {data.moTa || <Text type="secondary">Không có mô tả chi tiết</Text>}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

            <Divider>
              <Title level={3} className="mb-0">
                {permissions.canAccessTesterView ? `Danh sách kiểm thử (${data.listUC_mota && Array.isArray(data.listUC_mota) ? data.listUC_mota.filter(tc => tc !== null).length : 0} test)` :
                 permissions.canAccessDevView ? `Các tác vụ triển khai (${data.listUC_mota && Array.isArray(data.listUC_mota) ? data.listUC_mota.filter(tc => tc !== null).length : 0} mục)` :
                 `Test Cases (${data.listUC_mota && Array.isArray(data.listUC_mota) ? data.listUC_mota.filter(tc => tc !== null).length : 0} tổng cộng)`
                }
              </Title>
          </Divider>

          {data.listUC_mota && Array.isArray(data.listUC_mota) && data.listUC_mota.length > 0 ? (
            <Table
                columns={getCurrentColumns()}
              dataSource={data.listUC_mota.filter(tc => tc !== null)}
              rowKey="id"
              pagination={{
                  pageSize: permissions.canAccessTesterView ? 3 : permissions.canAccessDevView ? 5 : 8,
                showSizeChanger: false,
                showQuickJumper: false,
                  showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} mục`,
              }}
                scroll={{ x: permissions.canAccessTesterView ? 1400 : 1000 }}
                size={permissions.canAccessTesterView ? 'middle' : 'small'}
                className={permissions.canAccessTesterView ? 'tester-detailed-table' : ''}
            />
          ) : (
            <Empty 
                description={
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">
                      {permissions.canAccessTesterView ? '' : permissions.canAccessDevView ? '💻' : '📝'}
                    </div>
                    <div className="text-lg font-medium mb-2">
                      {permissions.canAccessTesterView ? 'Không có test nào để thực hiện' :
                       permissions.canAccessDevView ? 'Không có tác vụ triển khai' :
                       'Chưa có test cases nào'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {permissions.canAccessTesterView ? 'Liên hệ nhóm phát triển để thiết lập test cases' :
                       permissions.canAccessDevView ? 'Thêm test cases để bắt đầu phát triển' :
                       'Tạo test cases để bắt đầu kiểm thử'}
                    </div>
                  </div>
                }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      ) : (
          <Empty description="Không có dữ liệu" />
        )}
      </Modal>

      {/* Individual Test Case Detail Modal */}
      {viewingTestCase && (
        <Modal
          title={`Chi tiết Test Case: ${viewingTestCase.hanhDong}`}
          open={!!viewingTestCase}
          onCancel={() => setViewingTestCase(null)}
          width={1000}
          footer={[
            <Button key="close" onClick={() => setViewingTestCase(null)}>
              Đóng
            </Button>
          ]}
        >
          <div className="space-y-4">
            {/* Test Case Status */}
            <Card className="text-center">
              <Badge 
                status={viewingTestCase.trangThai === 'Pass' ? 'success' : 
                       viewingTestCase.trangThai === 'Fail' ? 'error' : 
                       viewingTestCase.trangThai === 'Đang test' ? 'processing' : 'default'} 
                text={viewingTestCase.trangThai || 'Chưa test'} 
                className="text-lg"
              />
            </Card>

            {/* Test Details */}
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mô tả test">
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded border">
                  {viewingTestCase.moTaKiemThu || 'Không có hướng dẫn chi tiết nào được cung cấp'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Kịch bản test">
                <div className="bg-yellow-50 p-3 rounded">
                  {viewingTestCase.tinhHuongKiemThu || 'Không có kịch bản cụ thể nào được định nghĩa'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Kết quả mong đợi">
                <div className="bg-green-50 p-3 rounded">
                  {viewingTestCase.ketQuaMongDoi || 'Không có kết quả mong đợi nào được chỉ định'}
                </div>
              </Descriptions.Item>
              {viewingTestCase.taiKhoan && (
                <Descriptions.Item label="Tài khoản test">
                  {viewingTestCase.taiKhoan}
                </Descriptions.Item>
              )}
              {viewingTestCase.linkHeThong && (
                <Descriptions.Item label="Link hệ thống">
                  <a href={viewingTestCase.linkHeThong} target="_blank" rel="noopener noreferrer">
                    {viewingTestCase.linkHeThong}
                  </a>
                </Descriptions.Item>
              )}
              {viewingTestCase.ghiChu && (
                <Descriptions.Item label="Ghi chú test">
                  <div className="bg-blue-50 p-3 rounded">
                    {viewingTestCase.ghiChu}
                  </div>
                </Descriptions.Item>
              )}
              {viewingTestCase.moTaLoi && (
                <Descriptions.Item label="Lỗi tìm thấy">
                  <div className="bg-red-50 p-3 rounded">
                    {viewingTestCase.moTaLoi}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DetailTestCase;  