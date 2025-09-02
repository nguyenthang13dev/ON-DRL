"use client";
import React, { useState, useMemo, useRef } from 'react';
import { 
  Card, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Tag, 
  Avatar, 
  Typography, 
  Space,
  Tooltip,
  Dropdown,
  Menu,
  Badge,
  Empty,
  Modal,
  Pagination,
} from 'antd';
import { toast } from "react-toastify";
import {
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { TD_UngVienDto, TrangThaiUngVien } from '@/types/TD_UngVien/TD_UngVien';
import { STATUS_CONFIG } from './CalendarView';
import styles from './InterviewSchedule.module.css';
import TD_UngVienDetail from '@/app/(DashboardLayout)/TD_UngVien/TD_UngVienDetail';
import UpdateInterviewTimeModal from '@/app/(DashboardLayout)/TD_UngVien/UpdateInterviewTimeModal';
import { MdEventNote } from 'react-icons/md';
import tD_UngVienService from '@/services/TD_UngVien/TD_UngVienService';
import TD_TuyenDungService from '@/services/TD_TuyenDung/TD_TuyenDungService';
import { TD_UngVienSearch } from '@/types/TD_UngVien/TD_UngVien';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface CandidateListProps {
  candidates?: TD_UngVienDto[]; // Không bắt buộc, sẽ fetch từ API
  statusFilter?: number | null; // Trạng thái filter truyền từ dashboard
  pageSize?: number;
  dateFilterToday?: boolean;
  initialFilters?: Partial<FilterOptions>;
  hideStatusFilter?: boolean;
  hideDateFilter?: boolean;
  onCandidateClick?: (candidate: TD_UngVienDto) => void;
  onScheduleInterview?: (candidateId: string) => void;
  onUpdateStatus?: (candidateId: string, status: TrangThaiUngVien) => Promise<void>;
  loading?: boolean;
  onReload?: () => void; // Thêm prop reload
}

interface FilterOptions {
  searchNameOrEmail: string;
  searchPhone: string;
  status: number[];
  position: string[];
  dateRange: [string, string] | undefined;
}

const CandidateList: React.FC<CandidateListProps> = ({
  candidates: initialCandidates = [],
  statusFilter = null,
  pageSize = 10,
  dateFilterToday = false,
  initialFilters = {},
  hideStatusFilter = false,
  hideDateFilter = false,
  onCandidateClick,
  onScheduleInterview,
  onUpdateStatus,
  loading = false,
  onReload
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchNameOrEmail: '',
    searchPhone: '',
    status: [],
    position: [],
    dateRange: undefined
  });
  const [searchNameOrEmail, setSearchNameOrEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const debounceNameOrEmailRef = useRef<NodeJS.Timeout | null>(null);
  const debouncePhoneRef = useRef<NodeJS.Timeout | null>(null);

  const [candidates, setCandidates] = useState<TD_UngVienDto[]>(initialCandidates || []);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<TD_UngVienDto | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ x: number; y: number } | null>(null);
  const [filtersReady, setFiltersReady] = useState(false);
  const [filtersJustInitialized, setFiltersJustInitialized] = useState(false);
  const [positionOptions, setPositionOptions] = useState<{ label: string; value: string }[]>([]);
  const [positionSearch, setPositionSearch] = useState('');
  const positionSearchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch candidates data theo filter và phân trang
  const fetchFilteredCandidates = async () => {
    const search: TD_UngVienSearch = {
      pageIndex,
      pageSize,
    };
    // Map input tìm kiếm
    if (filters.searchNameOrEmail) {
      if (filters.searchNameOrEmail.includes('@')) {
        search.Email = filters.searchNameOrEmail;
      } else {
        search.HoTen = filters.searchNameOrEmail;
      }
    }
    if (filters.searchPhone) {
      search.sdt = filters.searchPhone;
    }
    // Map trạng thái: LUÔN lấy từ filters.status (không lấy từ statusFilter)
    if (filters.status && filters.status.length > 0) {
      search.TrangThai = filters.status[0];
    }
    // Map vị trí
    if (filters.position && filters.position.length > 0) {
      search.TuyenDungId = filters.position[0];
    }
    // Map khoảng ngày
    if (dateFilterToday) {
      const today = dayjs().format('YYYY-MM-DD');
      search.ThoiGianPhongVan_Start = today;
      search.ThoiGianPhongVan_End = today;
    } else if (filters.dateRange) {
      search.ThoiGianPhongVan_Start = filters.dateRange[0];
      search.ThoiGianPhongVan_End = filters.dateRange[1];
    }
    try {
      const response = await tD_UngVienService.getData(search);
      if (response.status && response.data) {
        setCandidates(response.data.items);
        setTotal(response.data.totalCount || 0);
      } else {
        setCandidates([]);
        setTotal(0);
      }
    } catch (error) {
      setCandidates([]);
      setTotal(0);
    }
  };

  // Gọi API khi filtersJustInitialized=true (mở modal hoặc user thao tác filter)
  React.useEffect(() => {
    if (filtersJustInitialized) {
    fetchFilteredCandidates();
      setFiltersJustInitialized(false);
    }
  }, [filtersJustInitialized]);

  // Khi user thao tác filter, set filtersJustInitialized=true để gọi API
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters((prev: FilterOptions) => ({ ...prev, [key]: value }));
    setFiltersJustInitialized(true);
  };

  // Đồng bộ lại input khi filters thay đổi (ví dụ khi clear filter)
  React.useEffect(() => {
    setSearchNameOrEmail(filters.searchNameOrEmail);
    setSearchPhone(filters.searchPhone);
  }, [filters.searchNameOrEmail, filters.searchPhone]);

  // Khi initialFilters thay đổi (hoặc mount), set lại filters state và set filtersReady=true sau khi set xong
  React.useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      let dateRange: [string, string] | undefined = undefined;
      if (Array.isArray(initialFilters.dateRange) && initialFilters.dateRange.length === 2) {
        dateRange = [initialFilters.dateRange[0], initialFilters.dateRange[1]];
      }
      setFilters({
        searchNameOrEmail: initialFilters.searchNameOrEmail || '',
        searchPhone: initialFilters.searchPhone || '',
        status: initialFilters.status ? [...initialFilters.status] : [],
        position: initialFilters.position ? [...initialFilters.position] : [],
        dateRange,
      });
      setFiltersJustInitialized(true);
    } else {
      setFilters({
        searchNameOrEmail: '',
        searchPhone: '',
        status: [],
        position: [],
        dateRange: undefined
      });
      setFiltersJustInitialized(true);
    }
  }, [JSON.stringify(initialFilters)]);

  // Reset filtersReady về false khi initialFilters thay đổi để tránh fetch thừa
  React.useEffect(() => {
    setFiltersReady(false);
  }, [JSON.stringify(initialFilters)]);

  // Khi đổi pageIndex, pageSize, dateFilterToday do user thao tác, luôn set filtersJustInitialized=true
  React.useEffect(() => {
    setFiltersJustInitialized(true);
  }, [pageIndex, pageSize, dateFilterToday]);

  // Không cần filteredCandidates, dùng luôn candidates

  // Fetch vị trí tuyển dụng theo tên
  const fetchPositionOptions = async (searchText: string) => {
    try {
      const res = await TD_TuyenDungService.getData({ pageIndex: 1, pageSize: 20, tenViTri: searchText });
      if (res.status && res.data) {
        const options = res.data.items.map((item: any) => ({ label: item.tenViTri, value: item.id }));
        setPositionOptions(options);
      }
    } catch {
      setPositionOptions([]);
    }
  };

  const handlePositionSearch = (value: string) => {
    setPositionSearch(value);
    if (positionSearchTimeout.current) clearTimeout(positionSearchTimeout.current);
    positionSearchTimeout.current = setTimeout(() => {
      fetchPositionOptions(value);
    }, 400);
  };

  // Khi mount, load options mặc định
  React.useEffect(() => {
    fetchPositionOptions('');
  }, []);

  // Get unique positions for filter (dùng id và text)
  const positionOptionsForFilter = useMemo(() => {
    const positions = candidates
      .filter(c => c.tuyenDungId && c.viTriTuyenDungText)
      .map(c => ({ label: c.viTriTuyenDungText, value: c.tuyenDungId }));
    // Loại bỏ trùng lặp theo value (id)
    const unique = Array.from(new Map(positions.map(p => [p.value, p])).values());
    return unique;
  }, [candidates]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchNameOrEmail: '',
      searchPhone: '',
      status: [],
      position: [],
      dateRange: undefined
    });
  };

  const handleViewDetail = (candidate: TD_UngVienDto) => {
    setSelectedCandidateId(candidate.id);
    setDetailModalOpen(true);
  };

  const handleScheduleInterview = (candidate: TD_UngVienDto) => {
    setSelectedCandidate(candidate);
    setScheduleModalOpen(true);
  };

  const handleCardClick = (candidate: TD_UngVienDto, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.candidateDetails')) {
      return; 
    }
    setDropdownPosition({ x: e.clientX, y: e.clientY });
    
    if (dropdownOpen === candidate.id) {
      setDropdownOpen(null);
      setDropdownPosition(null);
    } else {
      setDropdownOpen(candidate.id);
    }
  };

  const handleDropdownVisibleChange = (visible: boolean, candidateId: string) => {
    if (!visible) {
      setDropdownOpen(null);
      setDropdownPosition(null);
    }
  };

  // Render candidate actions menu
  const renderActionsMenu = (candidate: TD_UngVienDto) => (
    <div 
      style={{ 
        position: 'fixed',
        left: dropdownPosition?.x || 0,
        top: dropdownPosition?.y || 0,
        zIndex: 1000,
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        minWidth: '160px',
        opacity: dropdownOpen === candidate.id ? 1 : 0,
        transform: dropdownOpen === candidate.id ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: dropdownOpen === candidate.id ? 'auto' : 'none'
      }}
    >
    <Menu>
      <Menu.Item
        key="view"
        icon={<EyeOutlined />}
          onClick={() => handleViewDetail(candidate)}
      >
        Xem chi tiết
      </Menu.Item>
      
      {candidate.trangThai === TrangThaiUngVien.DaXetDuyet && (
        <Menu.Item
          key="schedule"
          icon={<CalendarOutlined />}
            onClick={() => handleScheduleInterview(candidate)}
        >
          Lên lịch phỏng vấn
        </Menu.Item>
      )}
        
        {candidate.trangThai === TrangThaiUngVien.DaXetDuyet && (
          <Menu.Item
            key="to_waiting_interview"
            icon={<MdEventNote />}
            onClick={() => {
              if (!candidate.thoiGianPhongVan) {
                toast.error('Ứng viên chưa có thời gian phỏng vấn', { autoClose: 5000 });
                return;
              }
              Modal.confirm({
                title: 'Xác nhận chuyển trạng thái',
                content: `Bạn có chắc chắn muốn chuyển ứng viên "${candidate.hoTen}" sang trạng thái "Chờ phỏng vấn"?`,
                okText: 'Xác nhận',
                cancelText: 'Hủy',
                onOk: async () => {
                  try {
                    onUpdateStatus && await onUpdateStatus(candidate.id, TrangThaiUngVien.DangChoPhongVan);
                    if (typeof onReload === 'function') onReload();
                  } catch (error: any) {
                    toast.error(
                      error?.errors?.length
                        ? error.errors.join(', ')
                        : error?.message || 'Có lỗi xảy ra khi cập nhật trạng thái',
                      { autoClose: 5000 }
                    );
                  }
                }
              });
            }}
          >
            Chuyển sang chờ phỏng vấn
          </Menu.Item>
        )}
      
      <Menu.Divider />
      
      {candidate.trangThai === TrangThaiUngVien.ChuaXetDuyet && (
        <>
          <Menu.Item
            key="approve"
            icon={<CheckCircleOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: 'Xác nhận xét duyệt',
                  content: `Bạn có chắc chắn muốn xét duyệt ứng viên "${candidate.hoTen}"?`,
                  okText: 'Xét duyệt',
                  cancelText: 'Hủy',
                  onOk: () => onUpdateStatus && onUpdateStatus(candidate.id, TrangThaiUngVien.DaXetDuyet)
                });
              }}
          >
            Xét duyệt
          </Menu.Item>
          <Menu.Item
            key="reject"
            icon={<CloseCircleOutlined />}
            danger
              onClick={() => {
                Modal.confirm({
                  title: 'Xác nhận từ chối',
                  content: `Bạn có chắc chắn muốn từ chối ứng viên "${candidate.hoTen}"?`,
                  okText: 'Từ chối',
                  cancelText: 'Hủy',
                  onOk: () => onUpdateStatus && onUpdateStatus(candidate.id, TrangThaiUngVien.DaTuChoi)
                });
              }}
          >
            Từ chối
          </Menu.Item>
        </>
      )}
      
      {candidate.trangThai === TrangThaiUngVien.DangChoPhongVan && (
          <>
          
        <Menu.Item
              key="pass"
          icon={<CheckCircleOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: 'Xác nhận đạt phỏng vấn',
                  content: `Bạn có chắc chắn muốn đánh dấu ứng viên "${candidate.hoTen}" ĐẠT phỏng vấn?`,
                  okText: 'Đạt phỏng vấn',
                  cancelText: 'Hủy',
                  onOk: () => onUpdateStatus && onUpdateStatus(candidate.id, TrangThaiUngVien.DatPhongVan)
                });
              }}
        >
              Đạt phỏng vấn
            </Menu.Item>
            <Menu.Item
              key="reject_waiting"
              icon={<CloseCircleOutlined />}
              danger
              onClick={() => {
                Modal.confirm({
                  title: 'Xác nhận từ chối',
                  content: `Bạn có chắc chắn muốn từ chối ứng viên "${candidate.hoTen}"?`,
                  okText: 'Từ chối',
                  cancelText: 'Hủy',
                  onOk: () => onUpdateStatus && onUpdateStatus(candidate.id, TrangThaiUngVien.DaTuChoi)
                });
              }}
            >
              Từ chối
        </Menu.Item>
          </>
      )}
      {candidate.trangThai === TrangThaiUngVien.DatPhongVan && (
        <Menu.Item
          key="accept_job"
          icon={<CheckCircleOutlined />}
          onClick={() => {
            Modal.confirm({
              title: 'Xác nhận nhận việc',
              content: `Bạn có chắc chắn muốn chuyển ứng viên "${candidate.hoTen}" sang trạng thái "Đã nhận việc"?`,
              okText: 'Nhận việc',
              cancelText: 'Hủy',
              onOk: () => onUpdateStatus && onUpdateStatus(candidate.id, TrangThaiUngVien.DaNhanViec)
            });
          }}
        >
          Nhận việc
        </Menu.Item>
      )}
    </Menu>
    </div>
  );

  // Render candidate card
  const renderCandidateCard = (candidate: TD_UngVienDto) => {
    const statusConfig = STATUS_CONFIG[candidate.trangThai as TrangThaiUngVien];
    
    return (
      <div
        key={candidate.id}
        className={styles.candidateCard}
        onClick={(e) => handleCardClick(candidate, e)}
      >
        <div className={styles.candidateHeader}>
          <div className={styles.candidateInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar 
                size={48}
                icon={<UserOutlined />}
                style={{ backgroundColor: statusConfig.color }}
              />
              <div>
                <Title level={5} className={styles.candidateName}>
                  {candidate.hoTen}
                </Title>
                <Text className={styles.candidatePosition}>
                  {candidate.viTriTuyenDungText}
                </Text>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag
              className={styles.candidateStatus}
              style={{
                color: statusConfig.color,
                backgroundColor: statusConfig.bgColor,
                borderColor: statusConfig.borderColor
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{statusConfig.icon}</span>
                <span>{statusConfig.text}</span>
              </span>
            </Tag>
            
            <Dropdown
              overlay={renderActionsMenu(candidate)}
              trigger={['click']}
              placement="bottomRight"
              open={dropdownOpen === candidate.id}
              onOpenChange={(visible) => handleDropdownVisibleChange(visible, candidate.id)}
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </div>
        </div>

        <div className={`${styles.candidateDetails} candidateDetails`}>
          <div className={styles.candidateDetail}>
            <MailOutlined style={{ color: '#1890ff' }} />
            <Text>{candidate.email}</Text>
          </div>
          
          <div className={styles.candidateDetail}>
            <PhoneOutlined style={{ color: '#52c41a' }} />
            <Text>{candidate.soDienThoai}</Text>
          </div>
          
          <div className={styles.candidateDetail}>
            <CalendarOutlined style={{ color: '#faad14' }} />
            <Text>Nộp hồ sơ: {dayjs(candidate.ngayUngTuyen).format('DD/MM/YYYY')}</Text>
          </div>
          
          {candidate.thoiGianPhongVan && (
            <div className={styles.candidateDetail}>
              <CalendarOutlined style={{ color: '#722ed1' }} />
              <Text>PV: {dayjs(candidate.thoiGianPhongVan).format('DD/MM/YYYY HH:mm')}</Text>
            </div>
          )}
          
          {/* Không có trường mucLuongMongMuon trong TD_UngVienDto */}
          
          {candidate.kinhNghiem && (
            <div className={styles.candidateDetail}>
              <Text>Kinh nghiệm: {candidate.kinhNghiem}</Text>
            </div>
          )}
        </div>
      </div>
    );
  };

  const activeFiltersCount = [
    filters.searchNameOrEmail,
    filters.searchPhone,
    filters.status?.length,
    filters.position?.length,
    filters.dateRange
  ].filter(Boolean).length;

  return (
    <Card className={styles.candidateListContainer} loading={loading}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>
            Danh sách ứng viên
            <Badge count={candidates.length} style={{ marginLeft: 8 }} />
          </Title>
          
     
        </div>

        {/* Filters */}
        <div className={styles.filtersContainer}>
          <div className={styles.filtersRow}>
            <div className={styles.filterItem}>
              <Input
                placeholder="Tìm theo tên hoặc email..."
                value={searchNameOrEmail}
                onChange={(e) => {
                  setSearchNameOrEmail(e.target.value);
                  if (debounceNameOrEmailRef.current) clearTimeout(debounceNameOrEmailRef.current);
                  debounceNameOrEmailRef.current = setTimeout(() => {
                    handleFilterChange('searchNameOrEmail', e.target.value);
                  }, 400);
                }}
                allowClear
              />
            </div>
            <div className={styles.filterItem}>
              <Input
                placeholder="Tìm theo số điện thoại..."
                value={searchPhone}
                onChange={(e) => {
                  setSearchPhone(e.target.value);
                  if (debouncePhoneRef.current) clearTimeout(debouncePhoneRef.current);
                  debouncePhoneRef.current = setTimeout(() => {
                    handleFilterChange('searchPhone', e.target.value);
                  }, 400);
                }}
                allowClear
              />
            </div>
            
            {!hideStatusFilter && (
            <div className={styles.filterItem}>
              <Select
                placeholder="Lọc theo trạng thái"
                  value={filters.status[0] ?? undefined}
                  onChange={(value) => handleFilterChange('status', value !== undefined && value !== null ? [value] : [])}
                style={{ width: '100%' }}
                allowClear
              >
                {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                  <Select.Option key={status} value={Number(status)}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, verticalAlign: 'middle' }}>
                      <span style={{ fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.color }}>{config.icon}</span>
                      <span style={{ color: config.color }}>{config.text}</span>
                    </span>
                  </Select.Option>
                ))}
              </Select>
            </div>
            )}
            
            <div className={styles.filterItem}>
              <Select
                showSearch
                placeholder="Lọc theo vị trí"
                value={filters.position[0] || undefined}
                onChange={(value) => handleFilterChange('position', value ? [value] : [])}
                options={positionOptions}
                style={{ width: '100%' }}
                allowClear
                filterOption={false}
                onSearch={handlePositionSearch}
                notFoundContent={positionSearch ? 'Không tìm thấy vị trí' : 'Đang tải...'}
              >
                {positionOptions.map(option => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            
            {!hideDateFilter && (
            <div className={styles.filterItem}>
              <RangePicker
                placeholder={['Từ ngày', 'Đến ngày']}
                value={filters.dateRange ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])] : null}
                onChange={(dates) => {
                  if (dates) {
                    handleFilterChange('dateRange', [
                      dates[0]?.format('YYYY-MM-DD'),
                      dates[1]?.format('YYYY-MM-DD')
                    ]);
                  } else {
                    handleFilterChange('dateRange', undefined);
                  }
                }}
                style={{ width: '100%' }}
              />
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Candidate List */}
      <div>
        {candidates.length === 0 ? (
          <Empty
            description="Không tìm thấy ứng viên nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          candidates.map(renderCandidateCard)
        )}
      </div>
      {/* Pagination */}
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={pageIndex}
          pageSize={pageSize}
          total={total}
          showSizeChanger={false}
          onChange={page => setPageIndex(page)}
        />
      </div>
      {/* Modal xem chi tiết ứng viên */}
      <TD_UngVienDetail
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        id={selectedCandidateId}
      />
      {/* Modal lên lịch phỏng vấn */}
      <UpdateInterviewTimeModal
        open={scheduleModalOpen}
        onCancel={() => setScheduleModalOpen(false)}
        onSuccess={() => {
          setScheduleModalOpen(false);
          if (typeof onReload === 'function') onReload();
        }}
        ungVien={selectedCandidate}
      />
    </Card>
  );
};

export default CandidateList;
