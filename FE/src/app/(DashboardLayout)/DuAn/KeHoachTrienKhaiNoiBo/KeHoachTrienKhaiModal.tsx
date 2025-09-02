import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Select, Checkbox, Row, Col, Alert } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import dA_KeHoachThucHienService from '@/services/dA_KeHoachThucHien/dA_KeHoachThucHienService';
import { toast } from 'react-toastify';
import { useRolePermissions } from '@/hooks/useRolePermissions';

dayjs.locale('vi');

const { TextArea } = Input;
const { Option } = Select;

interface MyTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  type: 'project' | 'task' | 'milestone';
  project?: string;
  hideChildren?: boolean;
  duAnId?: string;
  phanCong?: string;
  phanCongId?: string;
  level?: number;
  phanCongKH?: string;
  noiDungCongViec?: string;
  groupNoiDungId?: string;

}

interface KeHoachTrienKhaiModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  task?: MyTask | null;
  parentTask?: MyTask | null;
  userOptions: Array<{ value: string; label: string }>;
  mode: 'edit' | 'add' | 'addSub';
  title?: string;
  duAnId?: string;
  initialNoiDungCongViec?: string; // Thêm prop này
}

const KeHoachTrienKhaiModal: React.FC<KeHoachTrienKhaiModalProps> = ({
  visible,
  onClose,
  onSave,
  task,
  parentTask,
  userOptions,
  mode,
  title,
  duAnId,
  initialNoiDungCongViec
}) => {
  const [form] = Form.useForm();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUsersId, setSelectedUsersId] = useState<string[]>([]);
  const [hangMucOptions, setHangMucOptions] = useState<{ label: string; value: string }[]>([]);
  const [hangMucLoading, setHangMucLoading] = useState(false);
  const permissions = useRolePermissions();
  // Function to get task status based on due date and progress
  const getTaskStatus = (task: MyTask): 'normal' | 'dueSoon' | 'overdueModerate' | 'overdueSevere' => {
    const today = new Date();
    const taskEndDate = new Date(task.end);
    // Reset time part to compare only dates
    today.setHours(0, 0, 0, 0);
    taskEndDate.setHours(0, 0, 0, 0);
    
    // If task is completed, it's normal
    if (task.progress >= 100) {
      return 'normal';
    }
    
    const daysDiff = Math.floor((taskEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Due soon (1-2 days before deadline)
    if (daysDiff >= 0 && daysDiff <= 2) {
      return 'dueSoon';
    }
    
    // Overdue
    if (daysDiff < 0) {
      const daysOverdue = Math.abs(daysDiff);
      if (daysOverdue <= 7) {
        return 'overdueModerate';
      } else {
        return 'overdueSevere';
      }
    }
    
    return 'normal';
  };

  // Function to check if task is overdue (legacy function for backward compatibility)
  const isTaskOverdue = (task: MyTask): boolean => {
    const status = getTaskStatus(task);
    return status === 'overdueModerate' || status === 'overdueSevere';
  };

  const currentTaskStatus = mode === 'edit' && task ? getTaskStatus(task) : 'normal';
  const isCurrentTaskOverdue = currentTaskStatus === 'overdueModerate' || currentTaskStatus === 'overdueSevere';

  useEffect(() => {
    if (visible) {
      // Lấy danh sách hạng mục công việc
      if (duAnId) {
        setHangMucLoading(true);
        dA_KeHoachThucHienService.GetDropdownsHangMucCongViec(duAnId, true).then(res => {
          if (res.status && Array.isArray(res.data)) {
            setHangMucOptions(res.data.map((item: any) => ({ label: item.noiDungCongViec , value: item.id })));
          } else {
            setHangMucOptions([]);
          }
          setHangMucLoading(false);
        });
      } else {
        setHangMucOptions([]);
      }
      if (mode === 'edit' && task) {
        // Edit mode - populate existing task data
        const selectedUsersList = task.phanCong ? task.phanCong.split(', ') : [];
        const selectedUsersIdList = task.phanCongId ? task.phanCongId.split(', ') : [];
        setSelectedUsers(selectedUsersList);
        setSelectedUsersId(selectedUsersIdList);
        console.log("selectedUsersList",selectedUsersList);
        
        form.setFieldsValue({
          id: task.id,
          name: task.name,
          dateRange: [dayjs(task.start), dayjs(task.end)],

          progress: task.progress,
          phanCong: selectedUsersIdList,
          phanCongKH: task.phanCongKH || '',
          groupNoiDungId: task.noiDungCongViec,

        });
      } else if (mode === 'addSub' && parentTask) {
        // Add sub task mode - use parent task dates as default
        setSelectedUsers([]);
        setSelectedUsersId([]);
        
        
        form.setFieldsValue({
          name: '',
          dateRange: [dayjs(parentTask.start), dayjs(parentTask.end)],
          progress: 0,
          noiDungCongViec: task?.name,
          duAnId: duAnId,
          groupNoidungId: parentTask.id,
          isKeHoachNoiBo: true,
          phanCong: [],
          phanCongKH: '',
        });
      } else if (mode === 'add') {
        // Add new task mode
        setSelectedUsers([]);
        setSelectedUsersId([]);
        form.setFieldsValue({
          name: initialNoiDungCongViec || '',
          dateRange: [dayjs(), dayjs().add(1, 'week')],
          progress: 0,
          phanCong: [],
          phanCongKH: '',
        });
      }
    }
  }, [visible, task, parentTask, mode, form, duAnId, initialNoiDungCongViec]);

  const handleUserChange = (values: string[]) => {
    setSelectedUsersId(values);
    // Cập nhật selectedUsers để hiển thị tên
    const selectedNames = values.map(userId => {
      const user = userOptions.find(u => u.value === userId);
      return user ? user.label : userId;
    });
    setSelectedUsers(selectedNames);
  };

  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      const [startDate, endDate] = values.dateRange || [];
      
      console.log("Form values:", values);
      
      let formData = {
        ...values,
        ngayBatDau: startDate?.toDate(),
        ngayKetThuc: endDate?.toDate(),
        phanCong: selectedUsersId.join(', '),
        phanCongKH: values.phanCongKH,
        noiDungCongViec: values.name, // Map field name to noiDungCongViec
        progress: values.progress,
        type: mode === 'addSub' ? 'task' : (task?.type || 'task'),
        level: mode === 'addSub' ? ((parentTask?.level || 0) + 1) : (task?.level || 0),
        project: mode === 'addSub' ? parentTask?.id : task?.project,
        duAnId: mode === 'add' ? duAnId : (mode === 'addSub' ? duAnId : task?.duAnId),
        groupNoidungId: mode === 'addSub' ? parentTask?.id : values.groupNoidungId,
        isKeHoachNoiBo: true,
      };
      // Nếu có giá trị hạng mục công việc thì gán cho groupNoidungId
      if (values.hangMucCongViec) {
        formData.groupNoidungId = values.hangMucCongViec;
      }

      let res;
      if (mode === 'edit') {
        res = await dA_KeHoachThucHienService.updateKHTrienKhai(formData);
        console.log("Update API Response:", res);
      } else { // mode === 'add' or 'addSub'
        // For creation, ensure ID is not sent as it will be generated by backend
        const { id, ...createFormData } = formData;
        

        
        res = await dA_KeHoachThucHienService.create(createFormData);
        console.log("Create API Response:", res);
        if (res.status && res.data && res.data.id) { // Assuming backend returns the new ID
          formData = { ...formData, id: res.data.id }; // Update formData with the real ID
        }
      }

      if(res.status){
        const updatedTask: MyTask = {
          id: formData.id || `temp-${Math.random().toString(36).substring(2, 11)}`, // Ensure ID for new tasks
          name: formData.name,
          start: startDate?.toDate(),
          end: endDate?.toDate(),
          progress: formData.progress,
          noiDungCongViec: formData.noiDungCongViec,
          type: formData.type,
          project: formData.project,
          hideChildren: (mode === 'add' || mode === 'addSub') ? false : task?.hideChildren, // Explicitly set hideChildren for new tasks
          phanCong: selectedUsers.join(', '), // Use selectedUsers (labels)
          phanCongId: selectedUsersId.join(', '),
          level: formData.level,
          phanCongKH: formData.phanCongKH,
          groupNoiDungId: values.hangMucCongViec, // Add hangMucCongViec to the constructed MyTask
        };
        onSave(updatedTask); // Pass the constructed MyTask object
        toast.success(res.message);
      }
      else{
        toast.error(res.message);
      }
      // handleCancel(); // Xóa khỏi đây
    }).catch((info) => {
      console.log('Validate Failed:', info);
      if (info.errorFields && info.errorFields.length > 0) {
        info.errorFields.forEach((field: any) => {
          if (field.errors && field.errors.length > 0) {
            toast.error(field.errors[0]);
          }
        });
      }
      else {
        toast.error("Vui lòng kiểm tra lại thông tin!");
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedUsers([]);
    setSelectedUsersId([]);
    onClose();
  };

  const getModalTitle = () => {
    if (title) return title;
    
    switch (mode) {
      case 'edit':
        return 'Cập nhật thông tin công việc';
      case 'add':
        return 'Thêm công việc mới';
      case 'addSub':
        return 'Thêm công việc con';
      default:
        return 'Quản lý công việc';
    }
  };

  // Determine if we should show phanCongKH field
  const shouldShowPhanCongKH = () => {
    if (mode === 'edit' && task) {
      return task.type === 'project';
    }
    if (mode === 'addSub') {
      return false; // Sub tasks don't have phanCongKH
    }
    return true; // Default for new tasks
  };

  // Determine if we should show phanCong field
  const shouldShowPhanCong = () => {
    if (mode === 'edit' && task) {
      return task.type !== 'project'; // Ẩn phân công khi edit group/project
    }
    return true; // Hiển thị cho tất cả các trường hợp khác
  };

  return (
    <Modal
      title={getModalTitle()}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={700}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      {initialNoiDungCongViec && (
        <div style={{ background: '#fffbe6', padding: 8, borderRadius: 4, marginBottom: 12, color: '#ad6800' }}>
          <b>Nội dung vừa chọn:</b> {initialNoiDungCongViec}
        </div>
      )}
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        {/* Show warning for edit mode based on task status */}
        {currentTaskStatus === 'dueSoon' && (
          <Alert
            message=" Công việc sắp hết hạn!"
            description={`Công việc này sẽ hết hạn trong ${dayjs(task?.end).diff(dayjs(), 'day')} ngày với tiến độ hiện tại ${task?.progress}%. Vui lòng theo dõi và cập nhật tiến độ.`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        {currentTaskStatus === 'overdueModerate' && (
          <Alert
            message=" Công việc đã quá hạn!"
            description={`Công việc này đã quá hạn ${dayjs().diff(dayjs(task?.end), 'day')} ngày và chưa hoàn thành (${task?.progress}%). Vui lòng cập nhật tiến độ hoặc điều chỉnh thời gian.`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        {currentTaskStatus === 'overdueSevere' && (
          <Alert
            message=" Công việc quá hạn nghiêm trọng!"
            description={`Công việc này đã quá hạn ${dayjs().diff(dayjs(task?.end), 'day')} ngày và chưa hoàn thành (${task?.progress}%). Cần xử lý ngay lập tức!`}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Show ID only in edit mode */}
        {mode === 'edit' && (
          <Form.Item
            label="ID"
            name="id"
            hidden={true}
          >
            <Input disabled />
          </Form.Item>
        )}

        {/* Hidden fields for addSub mode */}
        {mode === 'addSub' && (
          <>
            <Form.Item name="duAnId" hidden={true}>
              <Input />
            </Form.Item>
            <Form.Item name="groupNoidungId" hidden={true}>
              <Input />
            </Form.Item>
            <Form.Item name="isKeHoachNoiBo" hidden={true}>
              <Input />
            </Form.Item>
          </>
        )}

        {/* Show parent task info for sub task mode */}
        {mode === 'addSub' && parentTask && (
          <Form.Item label="Công việc cha">
            <Input value={parentTask.name} disabled />
          </Form.Item>
        )}

        <Form.Item
          label={mode === 'addSub' ? 'Nội dung công việc con' : 'Nội dung công việc'}
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung công việc!' }]}
        >
          <TextArea 
            rows={3} 
            placeholder={mode === 'addSub' ? 'Nhập nội dung công việc con...' : 'Nhập nội dung công việc...'} 
            disabled={!permissions.canEditNoiDungCongViec}
          />
        </Form.Item>
        <Form.Item
          label="Hạng mục công việc"
          name="hangMucCongViec"
          style={{ display: initialNoiDungCongViec ? undefined : 'none' }}
      
        >
          <Select
            placeholder="Chọn hạng mục công việc"
            loading={hangMucLoading}
            options={hangMucOptions}
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Thời gian thực hiện"
              name="dateRange"
              rules={[ 
                { required: true, message: 'Vui lòng chọn thời gian!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    // Áp dụng cho cả addSub và edit nếu có parentTask
                    if ((mode === 'addSub' && parentTask) || (mode === 'edit' && parentTask)) {
                      if (!value || value.length !== 2) {
                        return Promise.reject('Vui lòng chọn thời gian!');
                      }
                      const [start, end] = value;
                      const parentStart = dayjs(parentTask.start);
                      const parentEnd = dayjs(parentTask.end);
                      if (start.isBefore(parentStart, 'day') || end.isAfter(parentEnd, 'day')) {
                        return Promise.reject(
                          `Ngày bắt đầu và kết thúc phải nằm trong khoảng từ ${parentStart.format('DD/MM/YYYY')} đến ${parentEnd.format('DD/MM/YYYY')}`
                        );
                      }
                    }
                    return Promise.resolve();
                  },
                })
              ]}
            >
              <DatePicker.RangePicker 
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tiến độ (%)"
              name="progress"
              rules={[{ required: true, message: 'Vui lòng nhập tiến độ!' }]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: '100%' }}
                placeholder="Nhập tiến độ"
              />
            </Form.Item>
          </Col>
        </Row>
       
        {/* Only show phanCong for non-project types when editing */}
        {shouldShowPhanCong() && (
          <Form.Item
            label="Phân công"
            name="phanCong"     
          >
            <Select
              mode="multiple"
              placeholder="Chọn người thực hiện"
              value={selectedUsersId}
              onChange={handleUserChange}
              style={{ width: '100%' }}
              showSearch
              disabled={!permissions.canEditPhanCongKeHoachTrienKhaiNoiBo}
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
              }
            >
              {userOptions.map(user => (

                <Option key={user.value} value={user.value}>
                  {user.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Only show phanCongKH for project type or when adding new tasks */}
        {shouldShowPhanCongKH() && mode !== 'add' && (
          <Form.Item
            label="Phân công kế hoạch"
            name="phanCongKH"
          >
            <TextArea  placeholder="Nhập phân công kế hoạch" 
            rows={3}
            disabled={!permissions.canEditPhanCongKHKeHoachTrienKhaiNoiBo}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default KeHoachTrienKhaiModal;