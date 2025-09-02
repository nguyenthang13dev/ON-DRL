import React, { useState, useEffect } from "react";
import {
  Modal,
  Tree,
  notification,
  Typography,
  Statistic,
  Row,
  Col,
  Card,
  Button,
  Checkbox,
  Space,
  Popconfirm,
  Input,
  Form,
  Select,
  Tabs,
  Alert,
  List,
  Tooltip,
  Collapse
} from "antd";
import { UseCaseImportResponseType, UseCaseGroupType, UseCaseWithDetailsType } from "@/types/UseCase/UseCase";
import { useCaseService } from "@/services/UseCase/UseCase.service";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import type { DataNode } from "antd/es/tree";
import { EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

interface ImportResultModalProps {
  visible: boolean;
  data: UseCaseImportResponseType | null;
  duAnId: string;
  onClose: () => void;
  onSave: (savedData: UseCaseGroupType[]) => Promise<void>;
}

interface EditModalProps {
  visible: boolean;
  type: 'group' | 'usecase';
  data: UseCaseGroupType | UseCaseWithDetailsType | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ visible, type, data, onSave, onClose }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && data) {
      if (type === 'group') {
        const groupData = data as UseCaseGroupType;
        form.setFieldsValue({
          tenUseCase: groupData.tenUseCase,
          tacNhanChinh: groupData.tacNhanChinh,
          tacNhanPhu: groupData.tacNhanPhu,
          doCanThiet: groupData.doCanThiet,
          doPhucTap: groupData.doPhucTap,
          moTa: groupData.moTa,
        });
      } else {
        const useCaseData = data as UseCaseWithDetailsType;
        form.setFieldsValue({
          hanhDong: useCaseData.hanhDong,
          moTaKiemThu: useCaseData.moTaKiemThu,
          tinhHuongKiemThu: useCaseData.tinhHuongKiemThu,
          ketQuaMongDoi: useCaseData.ketQuaMongDoi,
          ghiChu: useCaseData.ghiChu,
        });
      }
    }
  }, [visible, data, type, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave({ ...data, ...values });
      onClose();
      notification.success({
        message: 'Cập nhật thành công!',
        description: 'Dữ liệu đã được cập nhật thành công.'
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={type === 'group' ? 'Chỉnh sửa nhóm Use Case' : 'Chỉnh sửa Test Case'}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {type === 'group' ? (
          <>
            <Form.Item name="tenUseCase" label="Tên Use Case" rules={[{ required: true, message: 'Vui lòng nhập tên Use Case' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tacNhanChinh" label="Tác nhân chính" rules={[{ required: true, message: 'Vui lòng nhập tác nhân chính' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tacNhanPhu" label="Tác nhân phụ">
              <Input />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="doCanThiet" label="Độ cần thiết" rules={[{ required: true, message: 'Vui lòng chọn độ cần thiết' }]}>
                  <Select>
                    <Select.Option value="A">A - Cao</Select.Option>
                    <Select.Option value="B">B - Trung bình</Select.Option>
                    <Select.Option value="C">C - Thấp</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="doPhucTap" label="Độ phức tạp" rules={[{ required: true, message: 'Vui lòng chọn độ phức tạp' }]}>
                  <Select>
                    <Select.Option value="Đơn giản">Đơn giản</Select.Option>
                    <Select.Option value="Trung bình">Trung bình</Select.Option>
                    <Select.Option value="Phức tạp">Phức tạp</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="moTa" label="Mô tả">
              <TextArea rows={4} />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item name="hanhDong" label="Hành động" rules={[{ required: true, message: 'Vui lòng nhập hành động' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="moTaKiemThu" label="Mô tả kiểm thử">
              <TextArea rows={8} />
            </Form.Item>
            <Form.Item name="tinhHuongKiemThu" label="Tình huống kiểm thử">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="ketQuaMongDoi" label="Kết quả mong đợi">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="ghiChu" label="Ghi chú">
              <TextArea rows={3} />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

const ImportResultModal: React.FC<ImportResultModalProps> = ({ visible, data, duAnId, onClose, onSave }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editType, setEditType] = useState<'group' | 'usecase'>('group');
  const [editData, setEditData] = useState<any>(null);
  const [modifiedData, setModifiedData] = useState<UseCaseGroupType[]>([]);
  const [saving, setSaving] = useState(false);
  const [validData, setValidData] = useState<UseCaseGroupType[]>([]);
  const [invalidData, setInvalidData] = useState<UseCaseGroupType[]>([]);
  const permissions = useRolePermissions();

  useEffect(() => {
    if (data?.data?.data) {
      const allData = [...data.data.data];
      setModifiedData(allData);
      
      // Separate valid and invalid data
      const valid = allData.filter(item => item.isValid === true);
      const invalid = allData.filter(item => item.isValid === false);
      
      setValidData(valid);
      setInvalidData(invalid);
    }
  }, [data]);

  // Convert all data to tree structure, showing both valid and invalid
  const convertToTreeData = (groups: UseCaseGroupType[]): DataNode[] => {
    return groups.map((group, groupIndex) => {
      // Find original index in modifiedData
      const originalIndex = modifiedData.findIndex(item => item.id === group.id);
      
              return {
          title: (
            <div className="flex justify-between items-start">
              <div className="flex flex-col flex-1">
                <div className="font-semibold text-blue-600 flex items-center">
                  {group.tenUseCase}
                  {group.isValid === false && (
                    <Tooltip title={`Dữ liệu có lỗi - Dòng ${group.rowIndex}${group.errors?.length ? ': ' + group.errors.join(', ') : ''}`}>
                      <span className="ml-2 text-red-500">⚠</span>
                    </Tooltip>
                  )}
                </div>
              <div className="text-sm text-gray-500 mt-1">
                <span className="mr-4">Tác nhân chính: {group.tacNhanChinh || <Text type="secondary">Trống</Text>}</span>
                <span className="mr-4">Độ cần thiết: {group.doCanThiet}</span>
                <span>Độ phức tạp: {group.doPhucTap}</span>
              </div>
              {group.moTa && (
                <div className="text-xs text-gray-400 mt-1 max-w-md truncate">
                  {group.moTa}
                </div>
              )}
                              {group.isValid === false && group.errors && group.errors.length > 0 && (
                  <div className="text-xs text-red-500 mt-1 bg-red-50 p-1 rounded">
                    ⚠ {group.errors[0]} {group.errors.length > 1 && `+${group.errors.length - 1} lỗi khác`}
                  </div>
                )}
              </div>
{permissions.canImportExcel && (
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit('group', group, originalIndex);
                  }}
                >
                  Sửa
                </Button>
              )}
          </div>
        ),
        key: `group-${originalIndex}`,
        children: group.listUC_mota?.map((useCase, useCaseIndex) => ({
          title: (
            <div className="flex justify-between items-start">
              <div className="flex flex-col py-2 flex-1">
                <div className="font-medium text-green-600">
                  {useCase.hanhDong}
                </div>
                {useCase.moTaKiemThu && (
                  <div className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                    <Text strong>Mô tả kiểm thử:</Text>
                    <div className="whitespace-pre-wrap">{useCase.moTaKiemThu}</div>
                  </div>
                )}
                {useCase.ghiChu && (
                  <div className="text-sm text-gray-500 mt-1 bg-yellow-50 p-2 rounded">
                    <Text strong>Ghi chú:</Text>
                    <div className="whitespace-pre-wrap">{useCase.ghiChu}</div>
                  </div>
                )}
              </div>
{permissions.canImportExcel && (
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit('usecase', useCase, originalIndex, useCaseIndex);
                  }}
                >
                  Sửa
                </Button>
              )}
            </div>
          ),
          key: `usecase-${originalIndex}-${useCaseIndex}`,
          isLeaf: true,
        })) || [],
      };
    });
  };

  const handleEdit = (type: 'group' | 'usecase', data: any, groupIndex: number, useCaseIndex?: number) => {
    setEditType(type);
    setEditData({ ...data, groupIndex, useCaseIndex });
    setEditModalVisible(true);
  };

  const validateGroup = (group: UseCaseGroupType): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!group.tenUseCase || group.tenUseCase.trim() === '') {
      errors.push('Tên Use Case không được để trống');
    }
    if (!group.tacNhanChinh || group.tacNhanChinh.trim() === '') {
      errors.push('Tác nhân chính không được để trống');
    }
    if (!group.doCanThiet || group.doCanThiet.trim() === '') {
      errors.push('Độ cần thiết không được để trống');
    }
    if (!group.doPhucTap || group.doPhucTap.trim() === '') {
      errors.push('Độ phức tạp không được để trống');
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const handleEditSave = (updatedData: any) => {
    const newData = [...modifiedData];
    const { groupIndex, useCaseIndex, ...dataToSave } = updatedData;

    if (editType === 'group') {
      const updatedGroup = { ...newData[groupIndex], ...dataToSave };
      const validation = validateGroup(updatedGroup);
      updatedGroup.isValid = validation.isValid;
      updatedGroup.errors = validation.errors;
      newData[groupIndex] = updatedGroup;
    } else if (useCaseIndex !== undefined) {
      if (newData[groupIndex].listUC_mota) {
        newData[groupIndex].listUC_mota![useCaseIndex] = { 
          ...newData[groupIndex].listUC_mota![useCaseIndex], 
          ...dataToSave 
        };
      }
    }

    setModifiedData(newData);
    
    // Update valid and invalid data after editing
    const valid = newData.filter(item => item.isValid === true);
    const invalid = newData.filter(item => item.isValid === false);
    setValidData(valid);
    setInvalidData(invalid);
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      // Select all keys from all data, but only valid ones will be saved
      const allKeys: React.Key[] = [];
      modifiedData.forEach((group, groupIndex) => {
        if (group.isValid === true) { // Only select valid groups
          allKeys.push(`group-${groupIndex}`);
          group.listUC_mota?.forEach((_, useCaseIndex) => {
            allKeys.push(`usecase-${groupIndex}-${useCaseIndex}`);
          });
        }
      });
      setSelectedKeys(allKeys);
    } else {
      setSelectedKeys([]);
    }
  };

  const handleTreeSelect = (keys: React.Key[]) => {
    // Filter out selections of invalid groups
    const validKeys = keys.filter(key => {
      const keyStr = key.toString();
      if (keyStr.startsWith('group-')) {
        const groupIndex = parseInt(keyStr.replace('group-', ''));
        return modifiedData[groupIndex]?.isValid === true;
      } else if (keyStr.startsWith('usecase-')) {
        const parts = keyStr.replace('usecase-', '').split('-');
        const groupIndex = parseInt(parts[0]);
        return modifiedData[groupIndex]?.isValid === true;
      }
      return false;
    });
    
    setSelectedKeys(validKeys);
    
    // Update selectAll checkbox based on selection
    const allValidKeys: React.Key[] = [];
    modifiedData.forEach((group, groupIndex) => {
      if (group.isValid === true) {
        allValidKeys.push(`group-${groupIndex}`);
        group.listUC_mota?.forEach((_, useCaseIndex) => {
          allValidKeys.push(`usecase-${groupIndex}-${useCaseIndex}`);
        });
      }
    });
    setSelectAll(validKeys.length === allValidKeys.length && allValidKeys.length > 0);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare data for API call from valid selected data only
      const dataToSave: UseCaseGroupType[] = [];
      const groupsToSave = new Set<number>();
      
      // First, collect selected groups and their selected use cases from valid data only
      selectedKeys.forEach(key => {
        const keyStr = key.toString();
        if (keyStr.startsWith('group-')) {
          const groupIndex = parseInt(keyStr.replace('group-', ''));
          const group = modifiedData[groupIndex];
          if (group && group.isValid === true) {
            groupsToSave.add(groupIndex);
          }
        } else if (keyStr.startsWith('usecase-')) {
          const parts = keyStr.replace('usecase-', '').split('-');
          const groupIndex = parseInt(parts[0]);
          const group = modifiedData[groupIndex];
          if (group && group.isValid === true) {
            groupsToSave.add(groupIndex);
          }
        }
      });

      // Build the data structure for each group
      Array.from(groupsToSave).forEach(groupIndex => {
        const originalGroup = modifiedData[groupIndex];
        if (!originalGroup || originalGroup.isValid !== true) return;

        // Check if the entire group is selected
        const isFullGroupSelected = selectedKeys.includes(`group-${groupIndex}`);
        
        let selectedUseCases: UseCaseWithDetailsType[] = [];
        
        if (isFullGroupSelected) {
          // If group is selected, include all use cases
          selectedUseCases = originalGroup.listUC_mota || [];
        } else {
          // Otherwise, only include specifically selected use cases
          selectedUseCases = (originalGroup.listUC_mota || []).filter((_, useCaseIndex) => 
            selectedKeys.includes(`usecase-${groupIndex}-${useCaseIndex}`)
          );
        }

        if (selectedUseCases.length > 0) {
          dataToSave.push({
            ...originalGroup,
            listUC_mota: selectedUseCases
          });
        }
      });

      // Call the API
      const result = await useCaseService.importExcelSaveRange(dataToSave, duAnId);
      
      if (result.status) {
     
        
        // Return the saved data to parent component
        await onSave(result.data || []);
        onClose();
      } else {
        notification.error({
          message: 'Lưu thất bại',
          description: result.message || 'Có lỗi xảy ra trong quá trình lưu dữ liệu',
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      notification.error({
        message: 'Lưu thất bại',
        description: 'Có lỗi xảy ra trong quá trình lưu dữ liệu',
      });
    } finally {
      setSaving(false);
    }
  };

  const treeData = modifiedData ? convertToTreeData(modifiedData) : [];
  const validCount = modifiedData.filter(item => item.isValid === true).length;
  const invalidCount = modifiedData.filter(item => item.isValid === false).length;

  return (
    <>
      <Modal
        title={
          <div className="flex items-center">
            Kết quả Import Excel
          </div>
        }
        open={visible}
        onCancel={onClose}
        width={1400}
        footer={[
          <Button key="close" onClick={onClose}>
            {permissions.canImportExcel ? 'Hủy' : 'Đóng'}
          </Button>,
          ...(permissions.canImportExcel ? [
            <Button 
              key="save" 
              type="primary" 
              loading={saving}
              onClick={handleSave}
              disabled={selectedKeys.length === 0}
            >
              Lưu đã chọn ({selectedKeys.length})
            </Button>
          ] : [])
        ]}
      >
        <div className="mb-4">
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Số lượng hợp lệ"
                  value={validCount}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Số lượng có lỗi"
                  value={invalidCount}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng số nhóm Use Case"
                  value={modifiedData.length}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đã chọn để lưu"
                  value={selectedKeys.length}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <Tabs defaultActiveKey="valid" size="large">
          <TabPane 
            tab={
              <span>
                Danh sách Use Case ({modifiedData.length})
              </span>
            } 
            key="valid"
          >
            <div className="mb-4">
              <Space>
                <Checkbox checked={selectAll} onChange={(e) => handleSelectAllChange(e.target.checked)}>
                  Chọn tất cả các mục hợp lệ
                </Checkbox>
                <Text type="secondary">
                  Chỉ các mục hợp lệ có thể được chọn và lưu. Hãy sửa các mục có lỗi trước khi lưu.
                </Text>
              </Space>
            </div>

            <div className="mb-2">
              <Title level={5}>
                Danh sách Use Case: 
                <span className="text-green-600 ml-2">{validCount} mục hợp lệ</span>
                <span className="text-red-600 ml-2">{invalidCount} mục có lỗi</span>
              </Title>
            </div>
            
            <div style={{ maxHeight: '500px', overflow: 'auto' }}>
              <Tree
                treeData={treeData}
                defaultExpandAll
                showLine
                showIcon={false}
                checkable
                checkedKeys={selectedKeys}
                onCheck={(keys) => handleTreeSelect(Array.isArray(keys) ? keys : keys.checked)}
                checkStrictly={true}
              />
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span>
                Chi tiết lỗi ({invalidCount})
              </span>
            } 
            key="invalid"
          >
            {invalidCount > 0 ? (
              <div>
                <Alert
                  message="Lưu ý quan trọng"
                  description="Những dữ liệu dưới đây có lỗi và sẽ không được lưu. Bạn có thể chỉnh sửa chúng trực tiếp trong bảng ở tab 'Danh sách Use Case' để khắc phục lỗi trước khi lưu."
                  type="warning"
                  showIcon
                  className="mb-4"
                />
                
                <Collapse>
                  {invalidData.map((item, index) => (
                    <Panel 
                      header={
                        <div className="flex items-center">
                          <span className="text-red-500 mr-2">⚠</span>
                          <span className="font-medium">
                            {item.tenUseCase || `Use Case ${index + 1}`}
                          </span>
                          <span className="ml-2 text-gray-500">
                            (Dòng {item.rowIndex})
                          </span>
                          <span className="ml-auto text-red-500">
                            {item.errors?.length || 0} lỗi
                          </span>
                        </div>
                      }
                      key={index}
                    >
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><strong>Tác nhân chính:</strong> {item.tacNhanChinh || <Text type="secondary">Trống</Text>}</div>
                          <div><strong>Tác nhân phụ:</strong> {item.tacNhanPhu || <Text type="secondary">Trống</Text>}</div>
                          <div><strong>Độ cần thiết:</strong> {item.doCanThiet}</div>
                          <div><strong>Độ phức tạp:</strong> {item.doPhucTap}</div>
                        </div>
                        
                        <div>
                          <strong>Danh sách lỗi chi tiết:</strong>
                          <List
                            size="small"
                            dataSource={item.errors || []}
                            renderItem={(error) => (
                              <List.Item>
                                <Text type="danger">
                                  ⚠ {error}
                                </Text>
                              </List.Item>
                            )}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </Panel>
                  ))}
                </Collapse>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-green-500 text-4xl mb-4">✓</div>
                <Title level={4}>Không có lỗi nào!</Title>
                <Text type="secondary">Tất cả dữ liệu đã được kiểm tra và hợp lệ.</Text>
              </div>
            )}
          </TabPane>
        </Tabs>
      </Modal>

      <EditModal
        visible={editModalVisible}
        type={editType}
        data={editData}
        onSave={handleEditSave}
        onClose={() => {
          setEditModalVisible(false);
          setEditData(null);
        }}
      />
    </>
  );
};

export default ImportResultModal; 