"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Segmented,
  Button,
  Typography,
  Space,
  Modal,
  Spin,
  Select
} from "antd";
import { toast } from "react-toastify";
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  PlusOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

// Import services
import tD_UngVienService from "@/services/TD_UngVien/TD_UngVienService";
import tdTuyenDungService from '@/services/TD_TuyenDung/TD_TuyenDungService';
import { TD_UngVienDto, TrangThaiUngVien, TD_UngVienTongQuanVM } from "@/types/TD_UngVien/TD_UngVien";

// Import components
import Dashboard from "./Dashboard";
import CalendarView from "./CalendarView";
import CandidateList from "./CandidateList";

// Import types and styles
// (Đã loại bỏ ScheduleFormData)
import styles from "./InterviewSchedule.module.css";
import TD_UngVienDetail from "@/app/(DashboardLayout)/TD_UngVien/TD_UngVienDetail";

const { Title } = Typography;

// View modes
enum ViewMode {
  DASHBOARD = "dashboard",
  CALENDAR = "calendar",
  CANDIDATES = "candidates"
}

export default function InterviewSchedulePage() {
  // State management
  const [loading, setLoading] = useState(true);
  const [pageViewMode, setPageViewMode] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs());
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [candidates, setCandidates] = useState<TD_UngVienDto[]>([]);
  const [dashboardStats, setDashboardStats] = useState<TD_UngVienTongQuanVM>({
    totalCandidates: 0,
    daNhanViec: 0,
    dangChoPhongVan: 0,
    daXetDuyet: 0,
    daTuChoi: 0,
    chuaXetDuyet: 0,
    datPhongVan: 0,
    interviewToday: 0,
    interviewThisWeek: 0,
    interviewThisMonth: 0,
    avgInterviewPerDay: 0,
    conversionRate: 0,
    interviewRate: 0
  });

  // Modal states
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<TD_UngVienDto | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(undefined);

  const [positionOptions, setPositionOptions] = useState<{ label: string; value: string }[]>([]);
  const [positionSearch, setPositionSearch] = useState('');
  const positionSearchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const [candidateListModalOpen, setCandidateListModalOpen] = useState(false);
  const [candidateListStatus, setCandidateListStatus] = useState<number | null>(null);
  const [candidateListDateToday, setCandidateListDateToday] = useState(false);
  const [candidateListInitialFilters, setCandidateListInitialFilters] = useState<Partial<any>>({});
  const [candidateListHideStatusFilter, setCandidateListHideStatusFilter] = useState(false);
  const [candidateListHideDateFilter, setCandidateListHideDateFilter] = useState(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailCandidateId, setDetailCandidateId] = useState<string | null>(null);

  // Lấy danh sách vị trí tuyển dụng từ candidates
  const positionOptionsMemo = React.useMemo(() => {
    const positions = candidates
      .filter(c => c.tuyenDungId && c.viTriTuyenDungText)
      .map(c => ({ label: c.viTriTuyenDungText, value: c.tuyenDungId }));
    // Loại bỏ trùng lặp theo value (id)
    return Array.from(new Map(positions.map(p => [p.value, p])).values());
  }, [candidates]);

  // Lọc candidates theo vị trí nếu có chọn
  const filteredCandidates = React.useMemo(() => {
    if (!selectedPosition) return candidates;
    return candidates.filter(c => c.tuyenDungId === selectedPosition);
  }, [candidates, selectedPosition]);

  // Fetch vị trí tuyển dụng theo tên
  const fetchPositionOptions = async (searchText: string) => {
    try {
      const res = await tdTuyenDungService.getData({ pageIndex: 1, pageSize: 20, tenViTri: searchText });
      if (res.status && res.data) {
        const options = res.data.items.map((item: any) => ({ label: item.tenViTri, value: item.id }));
        setPositionOptions(options);
      }
    } catch {
      setPositionOptions([]);
    }
  };

  // Khi gõ vào input vị trí tuyển dụng
  const handlePositionSearch = (value: string) => {
    setPositionSearch(value);
    if (positionSearchTimeout.current) clearTimeout(positionSearchTimeout.current);
    positionSearchTimeout.current = setTimeout(() => {
      fetchPositionOptions(value);
    }, 400);
  };

  // Khi mở tab calendar, load options mặc định
  React.useEffect(() => {
    if (pageViewMode === ViewMode.CALENDAR) {
      fetchPositionOptions('');
    }
  }, [pageViewMode]);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const response = await tD_UngVienService.getOverview();
      if (response.status && response.data) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải thống kê tổng quan');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    if (pageViewMode === ViewMode.DASHBOARD) {
      fetchOverview();
    } else {
      fetchData();
    }
  }, [pageViewMode]);

  useEffect(() => {
    if (pageViewMode === ViewMode.CALENDAR) {
      fetchData();
    }
  }, [calendarDate, calendarViewMode, pageViewMode]);

  // Gọi fetchData khi vào tab danh sách ứng viên
  useEffect(() => {
    if (pageViewMode === ViewMode.CANDIDATES) {
      fetchData();
    }
  }, [pageViewMode]);

  // Fetch candidates data
  const fetchData = useCallback(async () => {
    setLoading(true);
    let start: string, end: string;
    let pageSize = 300;
    if (pageViewMode === ViewMode.CALENDAR) {
      if (calendarViewMode === 'month') {
        start = calendarDate.startOf('month').format('YYYY-MM-DD');
        end = calendarDate.endOf('month').format('YYYY-MM-DD');
      } else if (calendarViewMode === 'week') {
        start = calendarDate.startOf('week').format('YYYY-MM-DD');
        end = calendarDate.endOf('week').format('YYYY-MM-DD');
      } else {
        start = calendarDate.format('YYYY-MM-DD');
        end = calendarDate.format('YYYY-MM-DD');
      }
    } else if (pageViewMode === ViewMode.CANDIDATES) {
      // Lấy đúng 100 ứng viên đầu tiên
      start = '';
      end = '';
      pageSize = 100;
    } else {
      start = '';
      end = '';
    }
    try {
      const params: any = {
        pageIndex: 1,
        pageSize,
      };
      if (start) params.ThoiGianPhongVan_Start = start;
      if (end) params.ThoiGianPhongVan_End = end;
      const response = await tD_UngVienService.getData(params);

      if (response.status && response.data) {
        let limitedData: TD_UngVienDto[] = response.data.items;
        if (pageViewMode !== ViewMode.CANDIDATES) {
          limitedData = response.data.items.slice(0, 100);
        }
        setCandidates(limitedData);
        // Không cần calculateDashboardStats nữa, đã lấy từ API
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [calendarDate, calendarViewMode, pageViewMode]);

  // Map status from API to enum
  const mapStatusToEnum = useCallback((status: number): TrangThaiUngVien => {
    switch (status) {
      case 0: return TrangThaiUngVien.ChuaXetDuyet;
      case 1: return TrangThaiUngVien.DaXetDuyet;
      case 2: return TrangThaiUngVien.DangChoPhongVan;
      case 3: return TrangThaiUngVien.DaNhanViec;
      case 4: return TrangThaiUngVien.DaTuChoi;
      case 5: return TrangThaiUngVien.DatPhongVan;
      default: return TrangThaiUngVien.ChuaXetDuyet;
    }
  }, []);

  // Calculate dashboard statistics
  // Không cần calculateDashboardStats nữa, đã lấy từ API

  // Event handlers
  const handleCandidateClick = (candidate: TD_UngVienDto) => {
    setSelectedCandidate(candidate);
    // Could open a detail modal here
  };

  const handleScheduleInterview = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setScheduleModalOpen(true);
    }
  };

  const handleUpdateStatus = useCallback(async (candidateId: string, status: TrangThaiUngVien) => {
    if (!candidateId) {
      toast.error('ID ứng viên không hợp lệ');
      return;
    }

    try {
      const apiStatus =
  status === TrangThaiUngVien.ChuaXetDuyet ? 0 :
  status === TrangThaiUngVien.DaXetDuyet ? 1 :
  status === TrangThaiUngVien.DangChoPhongVan ? 2 :
  status === TrangThaiUngVien.DaNhanViec ? 3 :
  status === TrangThaiUngVien.DaTuChoi ? 4 :
  status === TrangThaiUngVien.DatPhongVan ? 5 :
  0;

      const response = await tD_UngVienService.updateStatus({
        Ids: [candidateId],
        TrangThai: apiStatus
      });

      if (response.status) {
        toast.success('Cập nhật trạng thái thành công');
        await fetchData(); // Refresh data
      } else {
        toast.error(response.message || 'Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  }, [fetchData]);

  const handleEventClick = (candidate: TD_UngVienDto) => {
    setSelectedCandidate(candidate);
  };

  const handleCalendarEventClick = (candidate: TD_UngVienDto) => {
    setDetailCandidateId(candidate.id);
    setDetailModalOpen(true);
  };

  const handleEventMove = useCallback(async (eventId: string, newDate: string, newTime: string) => {
    try {
      // TODO: Implement API call to update interview time
      console.log('Moving event:', { eventId, newDate, newTime });
      toast.success('Di chuyển lịch phỏng vấn thành công');
      await fetchData();
    } catch (error) {
      console.error('Error moving event:', error);
      toast.error('Có lỗi xảy ra khi di chuyển lịch phỏng vấn');
    }
  }, [fetchData]);

  const handleDateClick = (date: string) => {
    // Could open a quick schedule modal for this date
    console.log('Date clicked:', date);
  };

  const handleCalendarDateClick = (date: string) => {
    setCandidateListStatus(2); // Đang chờ phỏng vấn
    setCandidateListDateToday(false);
    setCandidateListInitialFilters({ status: [2], dateRange: [date, date] });
    setCandidateListModalOpen(true);
    setCandidateListHideStatusFilter(true);
    setCandidateListHideDateFilter(true);
  };


  // Khi chọn vị trí tuyển dụng ở tab lịch phỏng vấn
  const handlePositionChange = async (value: string | undefined) => {
    setSelectedPosition(value);
    setLoading(true);
    try {
      let start: string, end: string;
      const pageSize = 300;
      if (calendarViewMode === 'month') {
        start = calendarDate.startOf('month').format('YYYY-MM-DD');
        end = calendarDate.endOf('month').format('YYYY-MM-DD');
      } else if (calendarViewMode === 'week') {
        start = calendarDate.startOf('week').format('YYYY-MM-DD');
        end = calendarDate.endOf('week').format('YYYY-MM-DD');
      } else {
        start = calendarDate.format('YYYY-MM-DD');
        end = calendarDate.format('YYYY-MM-DD');
      }
      const params: any = {
        pageIndex: 1,
        pageSize,
      };
      if (start) params.ThoiGianPhongVan_Start = start;
      if (end) params.ThoiGianPhongVan_End = end;
      if (value) params.TuyenDungId = value;
      const response = await tD_UngVienService.getData(params);
      if (response.status && response.data) {
        let limitedData: TD_UngVienDto[] = response.data.items;
        limitedData = limitedData.slice(0, 100);
        setCandidates(limitedData);
      }
    } catch (error) {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm mở modal danh sách ứng viên
  const handleOpenCandidateListModal = (status: number | null, isToday: boolean = false) => {
    setCandidateListStatus(status);
    setCandidateListDateToday(isToday);
    // Map filter cho UI
    if (isToday) {
      const today = dayjs().format('YYYY-MM-DD');
      setCandidateListInitialFilters({ status: [2], dateRange: [today, today] });
    } else if (typeof status === 'number') {
      setCandidateListInitialFilters({ status: [status] });
    } else {
      setCandidateListInitialFilters({});
    }
    setCandidateListModalOpen(true);
    setCandidateListHideStatusFilter(false);
    setCandidateListHideDateFilter(false);
  };


  // Render main content based on view mode
  const renderMainContent = () => {
    switch (pageViewMode) {
      case ViewMode.DASHBOARD:
        return <Dashboard stats={dashboardStats} loading={loading} onStatCardClick={(status, isToday) => handleOpenCandidateListModal(status, isToday)} />;

      case ViewMode.CALENDAR:
        return (
          <CalendarView
            events={candidates}
            onEventClick={handleCalendarEventClick}
            onEventMove={handleEventMove}
            onDateClick={handleCalendarDateClick}
            loading={loading}
            currentDate={calendarDate}
            setCurrentDate={setCalendarDate}
            viewMode={calendarViewMode}
            setViewMode={setCalendarViewMode}
            positionSelect={
              <Select
                showSearch
                allowClear
                placeholder="Chọn vị trí tuyển dụng"
                value={selectedPosition}
                onChange={handlePositionChange}
                options={positionOptions}
                style={{ width: 220, marginRight: 12 }}
                filterOption={false}
                onSearch={handlePositionSearch}
                notFoundContent={positionSearch ? 'Không tìm thấy vị trí' : 'Đang tải...'}
              />
            }
          />
        );

      case ViewMode.CANDIDATES:
        return (
          <CandidateList
            candidates={candidates as any}
            onCandidateClick={handleCandidateClick as any}
            onScheduleInterview={handleScheduleInterview}
            onUpdateStatus={handleUpdateStatus as any}
            loading={loading}
          />
        );

      default:
        return <Dashboard stats={dashboardStats} loading={loading} />;
    }
  };

  return (
    <div className={styles.interviewScheduleContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <Title level={1} className={styles.pageTitle}>
          Quản lý lịch phỏng vấn tuyển dụng
        </Title>
        <p className={styles.pageSubtitle}>
          Theo dõi và quản lý toàn bộ quy trình phỏng vấn ứng viên
        </p>
      </div>

      {/* View Toggle */}
      <div className={styles.viewToggle}>
        <div >
          <Segmented
            value={pageViewMode}
            onChange={setPageViewMode}
            size="large"
            options={[
              {
                label: (
                  <Space>
                    <DashboardOutlined />
                    <span>Tổng quan</span>
                  </Space>
                ),
                value: ViewMode.DASHBOARD
              },
              {
                label: (
                  <Space>
                    <CalendarOutlined />
                    <span>Lịch phỏng vấn</span>
                  </Space>
                ),
                value: ViewMode.CALENDAR
              },
              {
                label: (
                  <Space>
                    <TeamOutlined />
                    <span>Danh sách ứng viên</span>
                  </Space>
                ),
                value: ViewMode.CANDIDATES
              }
            ]}
          />
        </div>

       
      </div>

      {/* Main Content */}
      {renderMainContent()}

      {/* Đã thay thế bằng UpdateInterviewTimeModal */}
      <Modal
        open={candidateListModalOpen}
        onCancel={() => setCandidateListModalOpen(false)}
        footer={null}
        width={1500}
        title="Danh sách ứng viên"
        destroyOnClose
      >
        <CandidateList
          statusFilter={candidateListStatus}
          pageSize={10}
          dateFilterToday={candidateListDateToday}
          initialFilters={candidateListInitialFilters}
          hideStatusFilter={candidateListHideStatusFilter}
          hideDateFilter={candidateListHideDateFilter}
        />
      </Modal>
      <TD_UngVienDetail
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        id={detailCandidateId}
      />
    </div>
  );
}