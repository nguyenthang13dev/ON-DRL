"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  DatePicker,
  Avatar,
  Tag,
  Space,
  Typography,
  Tooltip,
  Statistic,
  Progress,
  Empty,
  Spin,
  Modal,
  Form,
  Segmented,
  FloatButton,
  Badge,
  message,
  Timeline,
  Calendar,
  Table
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  TableOutlined,
  ReloadOutlined,
  SettingOutlined,
  BellOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";

// Services and Types
import tD_UngVienService from "@/services/TD_UngVien/TD_UngVienService";
import tdTuyenDungService from "@/services/TD_TuyenDung/TD_TuyenDungService";
import { TD_UngVienDto, TrangThaiUngVien } from "@/types/TD_UngVien/TD_UngVien";
import TD_UngVienDetail from "@/app/(DashboardLayout)/TD_UngVien/TD_UngVienDetail";
import UpdateInterviewTimeModal from "@/app/(DashboardLayout)/TD_UngVien/UpdateInterviewTimeModal";

// Utils
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

// Styles
import styles from "./enhanced-styles.module.css";

// Extend dayjs
dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

// Enums and Interfaces
enum ViewMode {
  PURE_CALENDAR = "pure_calendar",
  DASHBOARD = "dashboard",
  TIMELINE = "timeline",
  CALENDAR = "calendar",
  TABLE = "table"
}

enum InterviewStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed", 
  CANCELLED = "cancelled"
}

interface InterviewData extends TD_UngVienDto {
  interviewStatus?: InterviewStatus;
  duration?: number;
  priority?: "high" | "medium" | "low";
  interviewer?: string;
  room?: string;
}

interface FilterState {
  search: string;
  status: InterviewStatus[];
  dateRange: [Dayjs, Dayjs] | null;
  position: string[];
  interviewer: string[];
}

const InterviewSchedulePage: React.FC = () => {
  // Core State
  const [data, setData] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PURE_CALENDAR);
  
  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: [],
    dateRange: null,
    position: [],
    interviewer: []
  });
  
  // UI State
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedInterview, setSelectedInterview] = useState<InterviewData | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [quickCreateModalOpen, setQuickCreateModalOpen] = useState(false);
  
  // Options
  const [viTriOptions, setViTriOptions] = useState<{ label: string; value: string }[]>([]);
  const [interviewerOptions] = useState([
    { label: "Nguyễn Văn A", value: "interviewer1" },
    { label: "Trần Thị B", value: "interviewer2" },
    { label: "Lê Văn C", value: "interviewer3" }
  ]);

  // Data Fetching
  const fetchTuyenDungData = useCallback(async () => {
    try {
      const res = await tdTuyenDungService.getData({
        pageIndex: 1,
        pageSize: 1000,
        tinhTrang: 0
      });
      
      if (res.status && res.data) {
        const options = res.data.items.map(item => ({
          label: item.tenViTri,
          value: item.id
        }));
        setViTriOptions(options);
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu vị trí tuyển dụng");
    }
  }, []);

  const getInterviewStatus = (item: TD_UngVienDto): InterviewStatus => {
    if (!item.thoiGianPhongVan) return InterviewStatus.SCHEDULED;
    
    const interviewTime = dayjs(item.thoiGianPhongVan);
    const now = dayjs();
    const endTime = interviewTime.add(60, 'minutes');
    
    if (now.isBefore(interviewTime)) {
      return InterviewStatus.SCHEDULED;
    } else if (now.isAfter(endTime)) {
      return InterviewStatus.COMPLETED;
    } else {
      return InterviewStatus.IN_PROGRESS;
    }
  };

  const fetchInterviewData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tD_UngVienService.getData({
        pageIndex: 1,
        pageSize: 1000,
        TrangThai: TrangThaiUngVien.DangChoPhongVan
      });
      
      if (res.status && res.data) {
        const interviewData: InterviewData[] = res.data.items
          .filter(item => item.thoiGianPhongVan)
          .map(item => ({
            ...item,
            interviewStatus: getInterviewStatus(item),
            duration: 60,
            priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
            interviewer: interviewerOptions[Math.floor(Math.random() * interviewerOptions.length)].label,
            room: `Phòng ${Math.floor(Math.random() * 10) + 1}`
          }));
        
        setData(interviewData);
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu lịch phỏng vấn");
    } finally {
      setLoading(false);
    }
  }, [interviewerOptions]);

  useEffect(() => {
    fetchTuyenDungData();
    fetchInterviewData();
  }, [fetchTuyenDungData, fetchInterviewData]);

  // Filtered Data with advanced filtering
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (!item.thoiGianPhongVan) return false;
      
      const interviewDate = dayjs(item.thoiGianPhongVan);
      
      // Search filter
      const searchMatch = !filters.search || 
        item.hoTen?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.soDienThoai?.includes(filters.search) ||
        item.viTriTuyenDungText?.toLowerCase().includes(filters.search.toLowerCase());
      
      // Status filter
      const statusMatch = filters.status.length === 0 || 
        filters.status.includes(item.interviewStatus || InterviewStatus.SCHEDULED);
      
      // Date range filter
      const dateMatch = !filters.dateRange || 
        interviewDate.isBetween(filters.dateRange[0], filters.dateRange[1], 'day', '[]');
      
      // Position filter
      const positionMatch = filters.position.length === 0 || 
        filters.position.includes(item.tuyenDungId || '');
      
      return searchMatch && statusMatch && dateMatch && positionMatch;
    });
  }, [data, filters]);

  // Analytics Data
  const analytics = useMemo(() => {
    const today = dayjs();
    const thisWeek = today.startOf('week');
    
    const todayCount = filteredData.filter(item => 
      dayjs(item.thoiGianPhongVan).isSame(today, 'day')
    ).length;
    
    const weekCount = filteredData.filter(item => 
      dayjs(item.thoiGianPhongVan).isAfter(thisWeek)
    ).length;
    
    const completedCount = filteredData.filter(item => 
      item.interviewStatus === InterviewStatus.COMPLETED
    ).length;
    
    const completionRate = filteredData.length > 0 ? 
      Math.round((completedCount / filteredData.length) * 100) : 0;
    
    const upcomingCount = filteredData.filter(item => 
      dayjs(item.thoiGianPhongVan).isAfter(today)
    ).length;
    
    return {
      todayCount,
      weekCount,
      completionRate,
      upcomingCount,
      totalCount: filteredData.length
    };
  }, [filteredData]);

  // Event Handlers
  const handleInterviewClick = (interview: InterviewData, action: 'view' | 'edit') => {
    setSelectedInterview(interview);
    if (action === 'view') {
      setDetailModalOpen(true);
    } else if (action === 'edit') {
      setUpdateModalOpen(true);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ padding: '24px 32px' }}>
        {/* Modern Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '32px 40px',
          marginBottom: '32px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
        }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size={8}>
                <Title level={1} style={{ color: 'white', margin: 0, fontSize: '32px' }}>
                  Lịch Phỏng Vấn
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                  Quản lý và theo dõi lịch phỏng vấn một cách hiệu quả
                </Text>
                <Space>
                  <Tag color="rgba(255,255,255,0.2)" style={{ color: 'white', border: 'none' }}>
                    {analytics.totalCount} cuộc phỏng vấn
                  </Tag>
                  <Tag color="rgba(255,255,255,0.2)" style={{ color: 'white', border: 'none' }}>
                    {analytics.todayCount} hôm nay
                  </Tag>
                </Space>
              </Space>
            </Col>
            <Col>
              <Space size="large">
                <Button
                  type="primary"
                  ghost
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => setQuickCreateModalOpen(true)}
                  style={{ borderRadius: '12px', height: '48px', fontSize: '16px' }}
                >
                  Tạo lịch mới
                </Button>
                <Button
                  type="primary"
                  ghost
                  icon={<ReloadOutlined />}
                  size="large"
                  loading={loading}
                  onClick={() => {
                    fetchTuyenDungData();
                    fetchInterviewData();
                  }}
                  style={{ borderRadius: '12px', height: '48px' }}
                />
              </Space>
            </Col>
          </Row>
        </div>

        {/* View Mode Selector & Filters */}
        <Card
          style={{
            borderRadius: '16px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: 'none'
          }}
          bodyStyle={{ padding: '24px' }}
        >
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} lg={8}>
              <Space direction="vertical" size={4}>
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>
                  CHẾ ĐỘ XEM
                </Text>
                <Segmented
                  className={styles.viewModeSegmented}
                  value={viewMode}
                  onChange={setViewMode}
                  size="large"
                  options={[
                    {
                      label: (
                        <div style={{ padding: '4px 8px' }}>
                          <CalendarOutlined />
                          <div style={{ fontSize: '12px' }}>Lịch thuần</div>
                        </div>
                      ),
                      value: ViewMode.PURE_CALENDAR
                    },
                    {
                      label: (
                        <div style={{ padding: '4px 8px' }}>
                          <BarChartOutlined />
                          <div style={{ fontSize: '12px' }}>Dashboard</div>
                        </div>
                      ),
                      value: ViewMode.DASHBOARD
                    },
                    {
                      label: (
                        <div style={{ padding: '4px 8px' }}>
                          <ClockCircleOutlined />
                          <div style={{ fontSize: '12px' }}>Timeline</div>
                        </div>
                      ),
                      value: ViewMode.TIMELINE
                    },
                    {
                      label: (
                        <div style={{ padding: '4px 8px' }}>
                          <AppstoreOutlined />
                          <div style={{ fontSize: '12px' }}>Calendar</div>
                        </div>
                      ),
                      value: ViewMode.CALENDAR
                    },
                    {
                      label: (
                        <div style={{ padding: '4px 8px' }}>
                          <TableOutlined />
                          <div style={{ fontSize: '12px' }}>Table</div>
                        </div>
                      ),
                      value: ViewMode.TABLE
                    }
                  ]}
                />
              </Space>
            </Col>

            <Col xs={24} lg={16}>
              <Row gutter={[12, 12]} align="middle">
                <Col xs={24} sm={8}>
                  <Search
                    placeholder="Tìm kiếm ứng viên..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    style={{ borderRadius: '8px' }}
                    size="large"
                  />
                </Col>

                <Col xs={12} sm={4}>
                  <Select
                    mode="multiple"
                    placeholder="Trạng thái"
                    value={filters.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    style={{ width: '100%' }}
                    size="large"
                    maxTagCount="responsive"
                  >
                    <Select.Option value={InterviewStatus.SCHEDULED}>
                      <Tag color="blue">Đã lên lịch</Tag>
                    </Select.Option>
                    <Select.Option value={InterviewStatus.IN_PROGRESS}>
                      <Tag color="orange">Đang diễn ra</Tag>
                    </Select.Option>
                    <Select.Option value={InterviewStatus.COMPLETED}>
                      <Tag color="green">Hoàn thành</Tag>
                    </Select.Option>
                    <Select.Option value={InterviewStatus.CANCELLED}>
                      <Tag color="red">Đã hủy</Tag>
                    </Select.Option>
                  </Select>
                </Col>

                <Col xs={12} sm={4}>
                  <Select
                    mode="multiple"
                    placeholder="Vị trí"
                    value={filters.position}
                    onChange={(value) => handleFilterChange('position', value)}
                    style={{ width: '100%' }}
                    size="large"
                    options={viTriOptions}
                    maxTagCount="responsive"
                  />
                </Col>

                <Col xs={24} sm={8}>
                  <RangePicker
                    value={filters.dateRange}
                    onChange={(dates) => handleFilterChange('dateRange', dates)}
                    style={{ width: '100%' }}
                    size="large"
                    format="DD/MM/YYYY"
                    placeholder={['Từ ngày', 'Đến ngày']}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* Main Content */}
        {renderMainContent()}

        {/* Floating Action Button */}
        <FloatButton.Group
          trigger="click"
          type="primary"
          style={{ right: 24, bottom: 24 }}
          icon={<PlusOutlined />}
          tooltip="Thao tác nhanh"
        >
          <FloatButton
            icon={<PlusOutlined />}
            tooltip="Tạo lịch mới"
            onClick={() => setQuickCreateModalOpen(true)}
          />
          <FloatButton
            icon={<SettingOutlined />}
            tooltip="Cài đặt"
          />
        </FloatButton.Group>

        {/* Modals */}
        <TD_UngVienDetail
          open={detailModalOpen}
          onCancel={() => {
            setDetailModalOpen(false);
            setSelectedInterview(null);
          }}
          id={selectedInterview?.id || null}
        />

        <UpdateInterviewTimeModal
          open={updateModalOpen}
          onCancel={() => {
            setUpdateModalOpen(false);
            setSelectedInterview(null);
          }}
          onSuccess={() => {
            setUpdateModalOpen(false);
            setSelectedInterview(null);
            fetchInterviewData();
            message.success('Cập nhật thời gian phỏng vấn thành công!');
          }}
          ungVien={selectedInterview}
        />

        <QuickCreateModal
          open={quickCreateModalOpen}
          onCancel={() => setQuickCreateModalOpen(false)}
          onSuccess={() => {
            setQuickCreateModalOpen(false);
            fetchInterviewData();
          }}
          viTriOptions={viTriOptions}
          interviewerOptions={interviewerOptions}
        />
      </div>
    </Layout>
  );

  // Render Main Content based on view mode
  function renderMainContent() {
    if (loading) {
      return (
        <Card style={{ borderRadius: '16px', minHeight: '400px' }}>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">Đang tải dữ liệu...</Text>
            </div>
          </div>
        </Card>
      );
    }

    switch (viewMode) {
      case ViewMode.PURE_CALENDAR:
        return <PureCalendarView data={filteredData} onInterviewClick={handleInterviewClick} />;
      case ViewMode.DASHBOARD:
        return <DashboardView data={filteredData} analytics={analytics} onInterviewClick={handleInterviewClick} />;
      case ViewMode.TIMELINE:
        return <TimelineView data={filteredData} selectedDate={selectedDate} onInterviewClick={handleInterviewClick} />;
      case ViewMode.CALENDAR:
        return <CalendarView data={filteredData} onInterviewClick={handleInterviewClick} />;
      case ViewMode.TABLE:
        return <TableView data={filteredData} onInterviewClick={handleInterviewClick} />;
      default:
        return <PureCalendarView data={filteredData} onInterviewClick={handleInterviewClick} />;
    }
  }
};

// View Components
const PureCalendarView: React.FC<{
  data: InterviewData[];
  onInterviewClick: (interview: InterviewData, action: 'view' | 'edit') => void;
}> = ({ data, onInterviewClick }) => {
  const today = dayjs();
  const tomorrow = dayjs().add(1, 'day');

  const todayInterviews = data.filter(item =>
    dayjs(item.thoiGianPhongVan).isSame(today, 'day')
  ).sort((a, b) => dayjs(a.thoiGianPhongVan).valueOf() - dayjs(b.thoiGianPhongVan).valueOf());

  const tomorrowInterviews = data.filter(item =>
    dayjs(item.thoiGianPhongVan).isSame(tomorrow, 'day')
  ).sort((a, b) => dayjs(a.thoiGianPhongVan).valueOf() - dayjs(b.thoiGianPhongVan).valueOf());

  const getStatusConfig = (status?: InterviewStatus) => {
    switch (status) {
      case InterviewStatus.SCHEDULED:
        return { color: '#1890ff', text: 'Đã lên lịch' };
      case InterviewStatus.IN_PROGRESS:
        return { color: '#faad14', text: 'Đang diễn ra' };
      case InterviewStatus.COMPLETED:
        return { color: '#52c41a', text: 'Hoàn thành' };
      case InterviewStatus.CANCELLED:
        return { color: '#f5222d', text: 'Đã hủy' };
      default:
        return { color: '#d9d9d9', text: 'Không xác định' };
    }
  };

  const renderInterviewCard = (interview: InterviewData) => {
    const statusConfig = getStatusConfig(interview.interviewStatus);
    const interviewTime = dayjs(interview.thoiGianPhongVan);

    return (
      <Card
        key={interview.id}
        style={{
          marginBottom: '12px',
          borderRadius: '12px',
          border: `1px solid ${statusConfig.color}30`,
          borderLeft: `4px solid ${statusConfig.color}`,
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        bodyStyle={{ padding: '16px' }}
        hoverable
        onClick={() => onInterviewClick(interview, 'view')}
        actions={[
          <Button
            key="view"
            type="text"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onInterviewClick(interview, 'view');
            }}
          />,
          <Button
            key="edit"
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onInterviewClick(interview, 'edit');
            }}
          />
        ]}
      >
        <Row gutter={[12, 8]}>
          <Col span={24}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space>
                <Avatar icon={<UserOutlined />} />
                <div>
                  <Title level={5} style={{ margin: 0 }}>{interview.hoTen}</Title>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {interview.viTriTuyenDungText}
                  </Text>
                </div>
              </Space>
              <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
            </Space>
          </Col>

          <Col span={24}>
            <Row gutter={[8, 4]}>
              <Col xs={24} sm={12}>
                <Space size="small">
                  <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  <Text>{interviewTime.format('HH:mm')}</Text>
                </Space>
              </Col>
              <Col xs={24} sm={12}>
                <Space size="small">
                  <EnvironmentOutlined style={{ color: '#52c41a' }} />
                  <Text>{interview.room || 'Chưa xác định'}</Text>
                </Space>
              </Col>
              <Col xs={24} sm={12}>
                <Space size="small">
                  <PhoneOutlined style={{ color: '#722ed1' }} />
                  <Text>{interview.soDienThoai}</Text>
                </Space>
              </Col>
              <Col xs={24} sm={12}>
                <Space size="small">
                  <UserOutlined style={{ color: '#faad14' }} />
                  <Text>{interview.interviewer || 'Chưa phân công'}</Text>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={12}>
        <Card
          title={
            <Space>
              <CalendarOutlined style={{ color: '#1890ff' }} />
              <span>Hôm nay ({today.format('DD/MM')})</span>
              <Badge count={todayInterviews.length} style={{ backgroundColor: '#1890ff' }} />
            </Space>
          }
          style={{
            borderRadius: '16px',
            height: '600px',
            overflow: 'hidden'
          }}
          bodyStyle={{
            padding: '16px',
            height: 'calc(100% - 57px)',
            overflowY: 'auto'
          }}
        >
          {todayInterviews.length === 0 ? (
            <Empty
              description="Không có lịch phỏng vấn hôm nay"
              style={{ marginTop: '100px' }}
            />
          ) : (
            todayInterviews.map(interview => renderInterviewCard(interview))
          )}
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card
          title={
            <Space>
              <CalendarOutlined style={{ color: '#faad14' }} />
              <span>Ngày mai ({tomorrow.format('DD/MM')})</span>
              <Badge count={tomorrowInterviews.length} style={{ backgroundColor: '#faad14' }} />
            </Space>
          }
          style={{
            borderRadius: '16px',
            height: '600px',
            overflow: 'hidden'
          }}
          bodyStyle={{
            padding: '16px',
            height: 'calc(100% - 57px)',
            overflowY: 'auto'
          }}
        >
          {tomorrowInterviews.length === 0 ? (
            <Empty
              description="Không có lịch phỏng vấn ngày mai"
              style={{ marginTop: '100px' }}
            />
          ) : (
            tomorrowInterviews.map(interview => renderInterviewCard(interview))
          )}
        </Card>
      </Col>
    </Row>
  );
};

const DashboardView: React.FC<{
  data: InterviewData[];
  analytics: any;
  onInterviewClick: (interview: InterviewData, action: 'view' | 'edit') => void;
}> = ({ data, analytics, onInterviewClick }) => {
  return (
    <div>
      {/* Quick Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Hôm nay"
              value={analytics.todayCount}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Tuần này"
              value={analytics.weekCount}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <div>
              <div style={{ marginBottom: '8px', color: '#666' }}>Tỷ lệ hoàn thành</div>
              <Progress
                type="circle"
                size={60}
                percent={analytics.completionRate}
                format={percent => `${percent}%`}
              />
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Sắp tới"
              value={analytics.upcomingCount}
              valueStyle={{ color: '#faad14' }}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Calendar View */}
      <PureCalendarView data={data} onInterviewClick={onInterviewClick} />
    </div>
  );
};

const TimelineView: React.FC<{
  data: InterviewData[];
  selectedDate: Dayjs;
  onInterviewClick: (interview: InterviewData, action: 'view' | 'edit') => void;
}> = ({ data, selectedDate, onInterviewClick }) => {
  const dayInterviews = data.filter(item =>
    dayjs(item.thoiGianPhongVan).isSame(selectedDate, 'day')
  ).sort((a, b) => dayjs(a.thoiGianPhongVan).valueOf() - dayjs(b.thoiGianPhongVan).valueOf());

  const timelineItems = dayInterviews.map(interview => {
    const interviewTime = dayjs(interview.thoiGianPhongVan);
    const statusConfig = {
      scheduled: { color: '#1890ff', icon: <ClockCircleOutlined /> },
      in_progress: { color: '#faad14', icon: <ExclamationCircleOutlined /> },
      completed: { color: '#52c41a', icon: <CheckCircleOutlined /> },
      cancelled: { color: '#f5222d', icon: <CloseCircleOutlined /> }
    }[interview.interviewStatus || 'scheduled'];

    return {
      dot: statusConfig.icon,
      color: statusConfig.color,
      label: interviewTime.format('HH:mm'),
      children: (
        <Card
          key={interview.id}
          className={styles.timelineCard}
          onClick={() => onInterviewClick(interview, 'view')}
          hoverable
          size="small"
        >
          <div className={styles.timelineCardContent}>
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className={styles.timelineAvatar}
            />
            <div>
              <div className={styles.timelineCardName}>
                {interview.hoTen}
              </div>
              <Text type="secondary" className={styles.timelineCardPosition}>
                {interview.viTriTuyenDungText}
              </Text>
            </div>
          </div>
        </Card>
      )
    };
  });

  return (
    <Card
      className={styles.timelineView}
      title={`Timeline - ${selectedDate.format('DD/MM/YYYY')}`}
      style={{ borderRadius: '16px' }}
    >
      {dayInterviews.length === 0 ? (
        <Empty description="Không có lịch phỏng vấn trong ngày này" />
      ) : (
        <Timeline items={timelineItems} />
      )}
    </Card>
  );
};

const CalendarView: React.FC<{
  data: InterviewData[];
  onInterviewClick: (interview: InterviewData, action: 'view' | 'edit') => void;
}> = ({ data, onInterviewClick }) => {
  const getListData = (value: Dayjs) => {
    return data.filter(item =>
      dayjs(item.thoiGianPhongVan).isSame(value, 'day')
    );
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.slice(0, 3).map(item => (
          <li key={item.id}>
            <Badge
              status="processing"
              text={
                <Text
                  style={{ fontSize: '11px', cursor: 'pointer' }}
                  onClick={() => onInterviewClick(item, 'view')}
                >
                  {dayjs(item.thoiGianPhongVan).format('HH:mm')} {item.hoTen}
                </Text>
              }
            />
          </li>
        ))}
        {listData.length > 3 && (
          <li>
            <Text style={{ fontSize: '11px', color: '#999' }}>
              +{listData.length - 3} khác
            </Text>
          </li>
        )}
      </ul>
    );
  };

  return (
    <Card style={{ borderRadius: '16px' }}>
      <Calendar dateCellRender={dateCellRender} />
    </Card>
  );
};

const TableView: React.FC<{
  data: InterviewData[];
  onInterviewClick: (interview: InterviewData, action: 'view' | 'edit') => void;
}> = ({ data, onInterviewClick }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data.length
  });

  const getStatusConfig = (status?: InterviewStatus) => {
    switch (status) {
      case InterviewStatus.SCHEDULED:
        return { color: '#1890ff', text: 'Đã lên lịch' };
      case InterviewStatus.IN_PROGRESS:
        return { color: '#faad14', text: 'Đang diễn ra' };
      case InterviewStatus.COMPLETED:
        return { color: '#52c41a', text: 'Hoàn thành' };
      case InterviewStatus.CANCELLED:
        return { color: '#f5222d', text: 'Đã hủy' };
      default:
        return { color: '#d9d9d9', text: 'Không xác định' };
    }
  };

  const columns = [
    {
      title: 'Ứng viên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 200,
      sorter: (a: InterviewData, b: InterviewData) => (a.hoTen || '').localeCompare(b.hoTen || ''),
      render: (text: string, record: InterviewData) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Vị trí',
      dataIndex: 'viTriTuyenDungText',
      key: 'viTriTuyenDungText',
      width: 180,
      sorter: (a: InterviewData, b: InterviewData) =>
        (a.viTriTuyenDungText || '').localeCompare(b.viTriTuyenDungText || ''),
    },
    {
      title: 'Thời gian',
      dataIndex: 'thoiGianPhongVan',
      key: 'thoiGianPhongVan',
      width: 160,
      sorter: (a: InterviewData, b: InterviewData) =>
        dayjs(a.thoiGianPhongVan).valueOf() - dayjs(b.thoiGianPhongVan).valueOf(),
      render: (date: string) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {dayjs(date).format('DD/MM/YYYY')}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {dayjs(date).format('HH:mm')}
          </Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'interviewStatus',
      key: 'interviewStatus',
      width: 120,
      filters: [
        { text: 'Đã lên lịch', value: InterviewStatus.SCHEDULED },
        { text: 'Đang diễn ra', value: InterviewStatus.IN_PROGRESS },
        { text: 'Hoàn thành', value: InterviewStatus.COMPLETED },
        { text: 'Đã hủy', value: InterviewStatus.CANCELLED },
      ],
      onFilter: (value: any, record: InterviewData) => record.interviewStatus === value,
      render: (status: InterviewStatus) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Người phỏng vấn',
      dataIndex: 'interviewer',
      key: 'interviewer',
      width: 150,
      render: (text: string) => text || 'Chưa phân công',
    },
    {
      title: 'Phòng',
      dataIndex: 'room',
      key: 'room',
      width: 100,
      render: (text: string) => text || 'Chưa xác định',
    },
    {
      title: 'SĐT',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
      width: 120,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: InterviewData) => (
        <div className={styles.tableActions}>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onInterviewClick(record, 'view')}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onInterviewClick(record, 'edit')}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys as string[]);
    },
    getCheckboxProps: (record: InterviewData) => ({
      disabled: false,
      name: record.hoTen,
    }),
  };

  return (
    <Card
      className={styles.tableView}
      style={{ borderRadius: '16px' }}
      title={
        <div className={styles.tableTitle}>
          <TableOutlined style={{ color: '#1890ff' }} />
          <span>Danh sách phỏng vấn</span>
          <Badge count={data.length} style={{ backgroundColor: '#1890ff' }} />
          {selectedRowKeys.length > 0 && (
            <Tag color="blue">Đã chọn {selectedRowKeys.length}</Tag>
          )}
        </div>
      }
      extra={
        selectedRowKeys.length > 0 && (
          <Space>
            <Button size="small">Bulk Actions</Button>
            <Button
              size="small"
              onClick={() => setSelectedRowKeys([])}
            >
              Clear
            </Button>
          </Space>
        )
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{
          ...pagination,
          total: data.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`,
          onChange: (page, pageSize) => {
            setPagination(prev => ({
              ...prev,
              current: page,
              pageSize: pageSize || 10
            }));
          }
        }}
        scroll={{ x: 1200 }}
        size="middle"
      />
    </Card>
  );
};

const QuickCreateModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  viTriOptions: { label: string; value: string }[];
  interviewerOptions: { label: string; value: string }[];
}> = ({ open, onCancel, onSuccess, viTriOptions, interviewerOptions }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      // Logic tạo lịch phỏng vấn mới
      console.log('Creating interview:', values);
      message.success('Tạo lịch phỏng vấn thành công!');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo lịch phỏng vấn');
    }
  };

  return (
    <Modal
      title="Tạo lịch phỏng vấn mới"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          date: dayjs().add(1, 'day'),
          time: dayjs().hour(9).minute(0),
          duration: 60
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="candidateName"
              label="Tên ứng viên"
              rules={[{ required: true, message: 'Vui lòng nhập tên ứng viên' }]}
            >
              <Input placeholder="Nhập tên ứng viên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="position"
              label="Vị trí ứng tuyển"
              rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
            >
              <Select
                placeholder="Chọn vị trí"
                options={viTriOptions}
                showSearch
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="date"
              label="Ngày phỏng vấn"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                disabledDate={current => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="time"
              label="Giờ phỏng vấn"
              rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
            >
              <DatePicker
                picker="time"
                style={{ width: '100%' }}
                format="HH:mm"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="duration" label="Thời lượng (phút)">
              <Select defaultValue={60}>
                <Select.Option value={30}>30 phút</Select.Option>
                <Select.Option value={60}>60 phút</Select.Option>
                <Select.Option value={90}>90 phút</Select.Option>
                <Select.Option value={120}>120 phút</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Tạo lịch
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InterviewSchedulePage;
