"use client";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Modal, Pagination, Table, Tag, Dropdown, MenuProps, Form, Input, Row, Col, DatePicker, Space, Tabs } from "antd";
import { PlusCircleOutlined, EyeOutlined, EditOutlined, DeleteOutlined, DownOutlined, DownloadOutlined, SearchOutlined, CloseOutlined, AppstoreOutlined, CheckCircleOutlined, ClockCircleOutlined, PauseCircleOutlined, UserSwitchOutlined, StopOutlined, CalendarOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { TD_UngVienDto, TD_UngVienSearch, GioiTinhUngVien } from "@/types/TD_UngVien/TD_UngVien";
import tD_UngVienService from "@/services/TD_UngVien/TD_UngVienService";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import TD_UngVienDetail from "./TD_UngVienDetail";
import dayjs from "dayjs";
import TD_UngVienForm from "./TD_UngVienForm";
import Flex from "@/components/shared-components/Flex";
import Search from "./search";
import UpdateInterviewTimeModal from "./UpdateInterviewTimeModal";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [listData, setListData] = useState<TD_UngVienDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValues, setSearchValues] = useState<TD_UngVienSearch>({ pageIndex: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [currentData, setCurrentData] = useState<TD_UngVienDto | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isOpenUpdateInterview, setIsOpenUpdateInterview] = useState(false);

  // --- Thêm các state và hàm tab filter ở đây ---
  const [activeTab, setActiveTab] = useState('all');
  const [statusCounts, setStatusCounts] = useState<{ [key: number]: number }>({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 });
  const [totalAll, setTotalAll] = useState(0);

  // Hàm lấy số lượng từng trạng thái
  const fetchAllStatusCounts = useCallback(async () => {
    try {
      let total = 0;
      const counts: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
      for (let i = 0; i <= 4; i++) {
        const res = await tD_UngVienService.getData({ pageIndex: 1, pageSize: 100, TrangThai: i });
        if (res.status && res.data) {
          counts[i] = res.data.items.length;
          total += counts[i];
        }
      }
      setStatusCounts(counts);
      setTotalAll(total);
    } catch (e) {}
  }, []);

  // Hàm lấy số lượng cho 1 trạng thái (chỉ cập nhật trạng thái đó)
  const fetchStatusCount = useCallback(async (status: number) => {
    try {
      const res = await tD_UngVienService.getData({ pageIndex: 1, pageSize: 1000, TrangThai: status });
      if (res.status && res.data) {
        setStatusCounts(prev => ({ ...prev, [status]: res.data.items.length }));
      }
    } catch (e) {}
  }, []);

  // Tabs UI giống trang tuyển dụng
  const statusTabs = [
    {
      key: 'all',
      label: <span><AppstoreOutlined /> Tất cả <span style={{ marginLeft: 8, color: '#1890ff', fontWeight: 600 }}>{totalAll}</span></span>,
      value: null,
      color: '#1890ff',
    },
    {
      key: '0',
      label: <span><ClockCircleOutlined /> Chưa xét duyệt <span style={{ marginLeft: 8, color: '#faad14', fontWeight: 600 }}>{statusCounts[0]}</span></span>,
      value: 0,
      color: '#faad14',
    },
    {
      key: '1',
      label: <span><CheckCircleOutlined /> Đã xét duyệt <span style={{ marginLeft: 8, color: '#52c41a', fontWeight: 600 }}>{statusCounts[1]}</span></span>,
      value: 1,
      color: '#52c41a',
    },
    {
      key: '2',
      label: <span><PauseCircleOutlined /> Đang chờ phỏng vấn <span style={{ marginLeft: 8, color: '#1890ff', fontWeight: 600 }}>{statusCounts[2]}</span></span>,
      value: 2,
      color: '#1890ff',
    },
    {
      key: '5',
      label: <span><CheckCircleOutlined /> Đạt phỏng vấn <span style={{ marginLeft: 8, color: '#722ed1', fontWeight: 600 }}>{statusCounts[5]}</span></span>,
      value: 5,
      color: '#722ed1',
    },
    {
      key: '3',
      label: <span><UserSwitchOutlined /> Đã nhận việc <span style={{ marginLeft: 8, color: '#722ed1', fontWeight: 600 }}>{statusCounts[3]}</span></span>,
      value: 3,
      color: '#722ed1',
    },
    {
      key: '4',
      label: <span><StopOutlined /> Đã từ chối <span style={{ marginLeft: 8, color: '#f5222d', fontWeight: 600 }}>{statusCounts[4]}</span></span>,
      value: 4,
      color: '#f5222d',
    },
  ];

  // Khi đổi tab
  const handleTabChange = async (key: string) => {
    setActiveTab(key);
    let trangThai: number | null = null;
    if (key !== 'all') trangThai = Number(key);
    const newSearch = { ...searchValues, pageIndex: 1 };
    if (trangThai === null) {
      delete newSearch.TrangThai;
      await fetchAllStatusCounts(); // cập nhật lại tất cả số lượng
    } else {
      newSearch.TrangThai = trangThai;
      await fetchStatusCount(trangThai); // chỉ cập nhật số lượng trạng thái đó
    }
    setSearchValues(newSearch);
    fetchData(newSearch);
  };
  // --- Kết thúc block tab filter ---

  const fetchData = useCallback(async (search?: TD_UngVienSearch) => {
    setLoading(true);
    try {
      const res = await tD_UngVienService.getData(search || searchValues);
      if (res.status && res.data) {
        setListData(res.data.items);
        setTotal(res.data.totalCount || 0);
      } else {
        toast.error(res.message || "Lỗi lấy dữ liệu");
      }
    } catch (e) {
      toast.error("Lỗi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [searchValues]);

  useEffect(() => {
    fetchData();
    fetchAllStatusCounts();
  }, [fetchData, fetchAllStatusCounts]);

  // Xử lý tìm kiếm
  const onFinishSearch = async (values: any) => {
    try {
      const searchData = {
        ...searchValues,
        pageIndex: 1,
        pageSize: searchValues.pageSize,
        HoTen: values.hoTenEmail || undefined,
        Email: values.hoTenEmail || undefined,
        sdt: values.soDienThoai || undefined,
        NgayUngTuyen: values.ngayUngTuyen ? values.ngayUngTuyen.format("YYYY-MM-DD") : undefined,
      };
      setSearchValues(searchData);
      await fetchData(searchData);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  // Toggle search panel
  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  
  // Sửa
  const handleEdit = (data: TD_UngVienDto) => {
    setCurrentData(data);
    setIsOpenForm(true);
  };
  // Xem chi tiết
  const handleView = (data: TD_UngVienDto) => {
    setCurrentData(data);
    setIsOpenDetail(true);
  };

  // Đóng detail
  const handleCloseDetail = () => {
    setIsOpenDetail(false);
    setCurrentData(null);
  };

  // Thêm mới
  const handleAdd = () => {
    setIsOpenForm(true);
  };
  
  const handleCloseForm = () => {
    setIsOpenForm(false);
  };
  
  const handleSubmitForm = async (data: any) => {
    try {
      let res;
      if (data.id) {
        res = await tD_UngVienService.update(data);
      } else {
        res = await tD_UngVienService.create(data);
      }
      if (res.status) {
        toast.success(data.id ? "Cập nhật ứng viên thành công" : "Thêm mới ứng viên thành công");
        setIsOpenForm(false);
        setCurrentData(null);
        fetchData();
      } else {
        toast.error(res.message || "Thao tác thất bại");
      }
    } catch (e) {
      toast.error("Thao tác thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa ứng viên này?",
      onOk: async () => {
        const res = await tD_UngVienService.delete(id);
        if (res.status) {
          toast.success("Xóa thành công");
          fetchData();
        } else {
          toast.error(res.message || "Xóa thất bại");
        }
      },
    });
  };

  // Xem CV
  const handleViewCV = async (ungVien: TD_UngVienDto) => {
    try {
      const blob = await tD_UngVienService.viewCV(ungVien.id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Không revokeObjectURL ngay để tránh lỗi khi tab mới chưa kịp load
    } catch (error) {
      console.error('Lỗi xem CV:', error);
      toast.error("Không xem được CV");
    }
  };

  const handleOpenUpdateInterview = (data: TD_UngVienDto) => {
    setCurrentData(data);
    setIsOpenUpdateInterview(true);
  };
  const handleCloseUpdateInterview = () => {
    setIsOpenUpdateInterview(false);
    setCurrentData(null);
  };
  const handleSuccessUpdateInterview = () => {
    fetchData();
  };

  // Map trạng thái số sang tiếng Việt
  const getTrangThaiText = (trangThai?: number) => {
    switch (trangThai) {
      case 0: return "Chưa xét duyệt";
      case 1: return "Đã xét duyệt";
      case 2: return "Đang chờ phỏng vấn";
      case 3: return "Đã nhận việc";
      case 4: return "Đã từ chối";
      case 5: return "Đạt phỏng vấn";
      default: return "-";
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (_: any, __: any, idx: number) => (searchValues.pageIndex - 1) * searchValues.pageSize + idx + 1,
      width: 60,
      align: "center" as const,
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      width: 180,
      render: (text: string, record: TD_UngVienDto) => (
        <span
          style={{ color: '#1890ff', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}
          onClick={() => handleView(record)}
          onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Vị trí tuyển dụng",
      dataIndex: "viTriTuyenDungText",
      width: 180,
      render: (value: string, record: TD_UngVienDto) => {
        if (!value) return "-";
        if (!record.tuyenDungId) return value;
        return (
          <span
            style={{ color: '#1890ff', fontWeight: 500, cursor: 'pointer', textDecoration: 'none', transition: 'color 0.2s, text-decoration 0.2s, transform 0.2s', display: 'inline-block' }}
            onClick={() => router.push(`/TD_TuyenDung/${record.tuyenDungId}`)}
            onMouseOver={e => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseOut={e => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {value}
          </span>
        );
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "ngaySinh",
      width: 100,
      render: (value: string) => value ? dayjs(value).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Giới tính",
      dataIndex: "gioiTinh",
      width: 80,
      render: (value: number) => {
        switch (value) {
          case GioiTinhUngVien.Nam: return "Nam";
          case GioiTinhUngVien.Nu: return "Nữ";
          case GioiTinhUngVien.Khac: return "Khác";
          default: return "-";
        }
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 180,
    },
    {
      title: "SĐT",
      dataIndex: "soDienThoai",
      width: 120,
      render: (value: string, record: TD_UngVienDto) => (
        <span
          style={{ color: '#1890ff', cursor: 'pointer', textDecoration: 'none', textUnderlineOffset: 2 }}
          onClick={() => handleOpenUpdateInterview(record)}
          onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          {value}
        </span>
      ),
    },
    {
      title: "Ngày ứng tuyển",
      dataIndex: "ngayUngTuyen",
      width: 120,
      render: (value: string) => value ? dayjs(value).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Thời gian phỏng vấn",
      dataIndex: "thoiGianPhongVan",
      width: 160,
      render: (value: string) => value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-",
    },
    {
      title: "CV",
      dataIndex: "cvFile",
      width: 100,
      align: "center" as const,
      render: (value: string, record: TD_UngVienDto) => {
        if (!value) return <span style={{ color: '#999' }}>Chưa có</span>;
        return (
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewCV(record)}
            style={{ padding: 0, height: 'auto' }}
          >
            Xem CV
          </Button>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      width: 120,
      render: (value?: number) => getTrangThaiText(value),
    },
    
    {
      title: "Thao tác",
      dataIndex: "actions",
      width: 120,
      align: "center" as const,
      render: (_: any, record: TD_UngVienDto) => {
        const items: MenuProps["items"] = [
          {
            key: "view",
            label: "Xem chi tiết",
            icon: <EyeOutlined />,
            onClick: () => handleView(record),
          },
          {
            key: "edit",
            label: "Cập nhật thông tin",
            icon: <EditOutlined />,
            onClick: () => handleEdit(record),
          },
          {
            key: "updateInterviewTime",
            label: "Cập nhật TG phỏng vấn",
            icon: <CalendarOutlined />,
            onClick: () => handleOpenUpdateInterview(record),
          },
          {
            type: "divider",
          },
          {
            key: "delete",
            label: "Xóa",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record.id),
          },
        ];
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button size="small">Thao tác <DownOutlined style={{ marginLeft: 4 }} /></Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <AutoBreadcrumb />
      <Flex alignItems="center" justifyContent="between">
        <h2 className="mb-1">Quản lý Ứng viên</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button
            onClick={toggleSearch}
            type="default"
            className="mr-2"
            icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
          >
            {isPanelVisible ? "Đóng tìm kiếm" : "Tìm kiếm"}
          </Button>
          <Button
            onClick={handleAdd}
            type="primary"
            icon={<PlusCircleOutlined />}
            size="small"
          >
            Thêm ứng viên
          </Button>
        </div>
      </Flex>
      
      {isPanelVisible && <Search onFinish={onFinishSearch} />}
      <Card style={{ padding: "0px" }}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          items={statusTabs}
        />
        <div className="table-responsive">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={listData}
            loading={loading}
            pagination={false}
            bordered
            size="middle"
            scroll={{ x: "max-content" }}
          />
        </div>
        <Pagination
          className="mt-2"
          total={total}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} trong ${total} dữ liệu`
          }
          current={searchValues.pageIndex}
          pageSize={searchValues.pageSize}
          showSizeChanger
          onChange={(page, pageSize) => {
            const newSearchValues = {
              ...searchValues,
              pageIndex: page,
              pageSize: pageSize || 10,
            };
            setSearchValues(newSearchValues);
            fetchData(newSearchValues);
          }}
        />
      </Card>
      
      <TD_UngVienDetail
        open={isOpenDetail}
        onCancel={handleCloseDetail}
        id={currentData?.id || null}
      />
    
      <TD_UngVienForm
        open={isOpenForm}
        onCancel={() => { setIsOpenForm(false); setCurrentData(null); }}
        onSubmit={handleSubmitForm}
        loading={loading}
        initialValues={currentData}
      />
   
      <UpdateInterviewTimeModal
        open={isOpenUpdateInterview}
        onCancel={handleCloseUpdateInterview}
        onSuccess={handleSuccessUpdateInterview}
        ungVien={currentData}
      />
    </>
  );
};

export default Page; 