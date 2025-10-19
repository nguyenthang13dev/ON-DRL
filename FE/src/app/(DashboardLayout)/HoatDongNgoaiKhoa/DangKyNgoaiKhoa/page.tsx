"use client";

import Flex from "@/components/shared-components/Flex";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import withAuthorization from "@/libs/authentication";
import { hoatDongNgoaiKhoaService } from "@/services/hoatDongNgoaiKhoa/hoatDongNgoaiKhoa.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import { Response, ResponsePageInfo, ResponsePageList } from "@/types/general";
import
  {
    HoatDongDangKyType,
    SearchHoatDongDangKyData,
  } from "@/types/hoatDongNgoaiKhoa/hoatDongNgoaiKhoa";
import
  {
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    FilterOutlined,
    QrcodeOutlined,
    TeamOutlined,
    UserAddOutlined,
    UserDeleteOutlined,
  } from "@ant-design/icons";
import
  {
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Pagination,
    Row,
    Select,
    Space,
    Tag,
    Tooltip,
    Typography,
  } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ActivityDetailModal from "./ActivityDetailModal";
import classes from "./page.module.css";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const DangKyNgoaiKhoa: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [hoatDongList, setHoatDongList] = useState<HoatDongDangKyType[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(12);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [searchValues, setSearchValues] = useState<SearchHoatDongDangKyData>({
    pageIndex: 1,
    pageSize: 12,
  });
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<HoatDongDangKyType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    activity: HoatDongDangKyType | null;
    action: 'register' | 'cancel';
  }>({
    open: false,
    activity: null,
    action: 'register',
  });

  const loading = useSelector((state) => state.general.isLoading);
  const [form] = Form.useForm();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "INACTIVE":
        return "red";
      case "PENDING":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang mở đăng ký";
      case "INACTIVE":
        return "Đã đóng đăng ký";
      case "PENDING":
        return "Chờ phê duyệt";
      default:
        return status;
    }
  };

  const fetchData = useCallback(
    async (searchData?: SearchHoatDongDangKyData) => {
      try {
        dispatch(setIsLoading(true));
        const params: SearchHoatDongDangKyData = {
          ...searchData,
          pageIndex: searchData?.pageIndex || pageIndex,
          pageSize,
        };

        const response: Response<ResponsePageList<HoatDongDangKyType[]>> =
          await hoatDongNgoaiKhoaService.getHoatDongDeDangKy(params);

        if (response.status) {
          const result = response.data;
          setHoatDongList(result.items || []);
          setDataPage(result);
        } else {
          toast.error(response.message || "Có lỗi xảy ra khi tải dữ liệu");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, pageIndex, pageSize]
  );

  useEffect(() => {
    fetchData(searchValues);
  }, [fetchData, searchValues]);

  const handleSearch = (values: SearchHoatDongDangKyData) => {
    const newSearchValues = {
      ...values,
      pageIndex: 1,
      pageSize,
    };
    setSearchValues(newSearchValues);
    setPageIndex(1);
  };

  const handleReset = () => {
    form.resetFields();
    const resetValues = {
      pageIndex: 1,
      pageSize,
    };
    setSearchValues(resetValues);
    setPageIndex(1);
  };

  const handlePageChange = (page: number, size?: number) => {
    setPageIndex(page);
    if (size) setPageSize(size);
    const newSearchValues = {
      ...searchValues,
      pageIndex: page,
      pageSize: size || pageSize,
    };
    setSearchValues(newSearchValues);
  };

  const handleViewDetail = (activity: HoatDongDangKyType) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  const handleRegister = (activity: HoatDongDangKyType) => {
    setConfirmModal({
      open: true,
      activity,
      action: 'register',
    });
  };

  const handleCancelRegistration = (activity: HoatDongDangKyType) => {
    setConfirmModal({
      open: true,
      activity,
      action: 'cancel',
    });
  };

  const confirmAction = async () => {
    if (!confirmModal.activity) return;

    try {
      dispatch(setIsLoading(true));
      let response;

      if (confirmModal.action === 'register') {
        response = await hoatDongNgoaiKhoaService.dangKyThamGia(
          confirmModal.activity.id!,
          "" // userId sẽ được lấy từ current user trên backend
        );
      } else {
        response = await hoatDongNgoaiKhoaService.huyDangKy(
          confirmModal.activity.id!,
          "" // userId sẽ được lấy từ current user trên backend
        );
      }

      if (response.status) {
        const actionText = confirmModal.action === 'register' ? 'đăng ký' : 'hủy đăng ký';
        toast.success(`${actionText.charAt(0).toUpperCase() + actionText.slice(1)} thành công`);
        fetchData(searchValues); // Refresh data
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý yêu cầu");
    } finally {
      dispatch(setIsLoading(false));
      setConfirmModal({ open: false, activity: null, action: 'register' });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Flex
      >
        <AutoBreadcrumb />
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? "Ẩn bộ lọc" : "Bộ lọc"}
        </Button>
      </Flex>

      {showSearch && (
        <Card className={`mb-3 ${classes.filterCard}`} size="small">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSearch}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col xs={24} sm={8} md={6}>
                <Form.Item label="Tên hoạt động" name="tenHoatDong">
                  <Input placeholder="Nhập tên hoạt động" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8} md={6}>
                <Form.Item label="Trạng thái" name="status">
                  <Select placeholder="Chọn trạng thái" allowClear>
                    <Select.Option value="ACTIVE">Đang mở đăng ký</Select.Option>
                    <Select.Option value="PENDING">Chờ phê duyệt</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8} md={6}>
                <Form.Item label="Trạng thái đăng ký" name="isRegistered">
                  <Select placeholder="Chọn trạng thái đăng ký" allowClear>
                    <Select.Option value={true}>Đã đăng ký</Select.Option>
                    <Select.Option value={false}>Chưa đăng ký</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={6}>
                <Form.Item label=" ">
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Tìm kiếm
                    </Button>
                    <Button onClick={handleReset}>Làm mới</Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )}

      <Row gutter={[16, 16]} className={classes.activityGrid}>
        {hoatDongList.map((activity, index) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={activity.id}>
            <Card
              className={`${classes.activityCard} ${loading ? classes.loading : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              cover={
                <div className={classes.cardCover}>
                  <div className={classes.statusTag}>
                    <Tag 
                      className={`status-${activity.status.toLowerCase()}`}
                      color={getStatusColor(activity.status)}
                    >
                      {getStatusText(activity.status)}
                    </Tag>
                  </div>
                  {activity.isRegistered && (
                    <div className={classes.registeredBadge}>
                      <CheckCircleOutlined />
                      <span>Đã đăng ký</span>
                    </div>
                  )}
                </div>
              }
              actions={[
                <Tooltip title="Xem chi tiết" key="detail">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(activity)}
                  />
                </Tooltip>,
                activity.qrValue && (
                  <Tooltip title="QR Code" key="qr">
                    <Button type="text" icon={<QrcodeOutlined />} />
                  </Tooltip>
                ),
                activity.isRegistered ? (
                  <Tooltip title="Hủy đăng ký" key="cancel">
                    <Button
                      type="text"
                      danger
                      icon={<UserDeleteOutlined />}
                      onClick={() => handleCancelRegistration(activity)}
                      disabled={activity.status !== "ACTIVE"}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Đăng ký tham gia" key="register">
                    <Button
                      type="text"
                      icon={<UserAddOutlined />}
                      onClick={() => handleRegister(activity)}
                      disabled={!activity.canRegister || activity.status !== "ACTIVE"}
                    />
                  </Tooltip>
                ),
              ].filter(Boolean)}
            >
              <Meta
                title={
                  <Tooltip title={activity.tenHoatDong}>
                    <div className={classes.activityTitle}>
                      {activity.tenHoatDong}
                    </div>
                  </Tooltip>
                }
                description={
                  <div className={classes.activityDescription}>
                    {activity.moTa && (
                      <Paragraph
                        ellipsis={{ rows: 2, tooltip: activity.moTa }}
                        style={{ marginBottom: 8 }}
                      >
                        {activity.moTa}
                      </Paragraph>
                    )}
                    
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      {activity.thoiGianBatDau && (
                        <Text type="secondary">
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {formatDate(activity.thoiGianBatDau)}
                        </Text>
                      )}
                      
                      {activity.diaDiem && (
                        <Text type="secondary">
                          <EnvironmentOutlined style={{ marginRight: 4 }} />
                          {activity.diaDiem}
                        </Text>
                      )}
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text type="secondary" className={classes.registrationCount}>
                          <TeamOutlined style={{ marginRight: 4 }} />
                          {activity.danhSachDangKy?.length || 0}
                          {activity.soLuongToiDa && `/${activity.soLuongToiDa}`} người
                        </Text>
                        
                        {activity.registrationDate && (
                          <span className={classes.registrationInfo}>
                            <CalendarOutlined style={{ marginRight: 2 }} />
                            {formatDate(activity.registrationDate)}
                          </span>
                        )}
                      </div>
                    </Space>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {hoatDongList.length === 0 && !loading && (
        <div className={classes.emptyState}>
          <CalendarOutlined style={{ fontSize: 48 }} />
          <Title level={4} type="secondary">
            Không có hoạt động nào
          </Title>
          <Text type="secondary">
            Hiện tại chưa có hoạt động ngoại khóa nào để đăng ký
          </Text>
        </div>
      )}

      <div className={classes.paginationContainer}>
        <Pagination
          current={pageIndex}
          pageSize={pageSize}
          total={dataPage?.totalCount || 0}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} trong ${total} hoạt động`
          }
          onChange={handlePageChange}
          pageSizeOptions={["8", "12", "24", "36"]}
        />
      </div>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        open={isDetailModalOpen}
        activity={selectedActivity}
        onClose={() => setIsDetailModalOpen(false)}
        onRegister={handleRegister}
        onCancelRegistration={handleCancelRegistration}
      />

      {/* Confirmation Modal */}
      <Modal
        title={`Xác nhận ${confirmModal.action === 'register' ? 'đăng ký' : 'hủy đăng ký'}`}
        open={confirmModal.open}
        onOk={confirmAction}
        onCancel={() => setConfirmModal({ open: false, activity: null, action: 'register' })}
        okText={confirmModal.action === 'register' ? 'Đăng ký' : 'Hủy đăng ký'}
        cancelText="Hủy"
        okButtonProps={{ 
          loading: loading,
          danger: confirmModal.action === 'cancel' 
        }}
      >
        <p>
          Bạn có chắc chắn muốn{' '}
          {confirmModal.action === 'register' ? 'đăng ký tham gia' : 'hủy đăng ký'}{' '}
          hoạt động <strong>&ldquo;{confirmModal.activity?.tenHoatDong}&rdquo;</strong> không?
        </p>
      </Modal>
    </>
  );
};

export default withAuthorization(DangKyNgoaiKhoa, "");