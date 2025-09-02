"use client";
import { useCallback, useEffect, useState } from "react";
import Flex from "@/components/shared-components/Flex";
import { ResponsePageList } from "@/types/general";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { AppDispatch } from "@/store/store";
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  FormProps,
  MenuProps,
  Modal,
  Pagination,
  Space,
  Table,
  TableProps,
  Tag,
  Tabs,
} from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import TD_TuyenDungDetail from "./detail";
import Search from "./search";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import {
  TD_TuyenDungSearchType,
  TD_TuyenDungType,
  getTinhTrangLabel,
} from "@/types/TD_TuyenDung/TD_TuyenDung";
import TD_TuyenDungService from "@/services/TD_TuyenDung/TD_TuyenDungService";
import TD_TuyenDungCreateOrUpdate from "./createOrUpdate";
import dayjs from "dayjs";
import classes from "./page.module.css";
import Link from "next/link";

const Page = () => {
  const [listData, setListData] = useState<TD_TuyenDungType[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageList<TD_TuyenDungType[]>>();
  const [loading, setLoading] = useState(false);
  const [searchValues, setSearchValues] = useState<TD_TuyenDungSearchType>({
    pageIndex: 1,
    pageSize: 10,
  });

  // Modal states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [currentData, setCurrentData] = useState<TD_TuyenDungType | null>(null);
  const [currentDetailData, setCurrentDetailData] = useState<TD_TuyenDungType | null>(null);

  const [statusFilter, setStatusFilter] = useState<number | null>(null); // null = tất cả
  const [statusCounts, setStatusCounts] = useState<{ [key: number]: number }>({
    0: 0, // Đang tuyển
    1: 0, // Đã đóng
    2: 0, // Hoãn
  });
  const [totalAll, setTotalAll] = useState(0);

  const dispatch = useDispatch<AppDispatch>();

  // Hàm lấy count của một trạng thái cụ thể
  const fetchStatusCount = useCallback(async (status: number) => {
    try {
      // Chỉ filter theo trạng thái, bỏ qua các filter khác
      const searchParams = {
        pageIndex: 1,
        pageSize: 100, // Lấy tất cả để đếm chính xác
        tinhTrang: status
      };
      
      const res = await TD_TuyenDungService.getData(searchParams);
      if (res.status && res.data) {
        const count = res.data.items ? res.data.items.length : 0;
        console.log(`Trạng thái ${status}: count = ${count}, totalCount = ${res.data.totalCount}`);
        return count;
      }
      return 0;
    } catch (e) {
      console.error(`Lỗi lấy count trạng thái ${status}:`, e);
      return 0;
    }
  }, []);

  // Hàm lấy count của tất cả trạng thái
  const fetchAllStatusCounts = useCallback(async () => {
    try {
      // Lấy tất cả dữ liệu và đếm trực tiếp
      const res = await TD_TuyenDungService.getData({
        pageIndex: 1,
        pageSize: 100 // Lấy tất cả
      });
      
      if (res.status && res.data) {
        const counts: { [key: number]: number } = {
          0: 0, // Đang tuyển
          1: 0, // Đã đóng
          2: 0, // Hoãn
        };
        
        // Đếm trực tiếp từ dữ liệu
        res.data.items.forEach((item: TD_TuyenDungType) => {
          counts[item.tinhTrang] = (counts[item.tinhTrang] || 0) + 1;
        });
        
        console.log("Kết quả count tất cả trạng thái:", counts);
        setStatusCounts(counts);
        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        setTotalAll(total);
        console.log("Tổng tất cả:", total);
      }
    } catch (e) {
      console.error("Lỗi lấy count trạng thái:", e);
    }
  }, []);

  const handleGetListData = useCallback(
    async (searchData?: TD_TuyenDungSearchType) => {
      try {
        setLoading(true);
        dispatch(setIsLoading(true));
        const searchParam = searchData || searchValues;
        const response = await TD_TuyenDungService.getData(searchParam);
        if (response.status && response.data) {
          setListData(response.data.items);
          setDataPage(response.data);
          
          // Chỉ đếm count khi load lần đầu (không có filter)
          if (!searchData || !searchData.tinhTrang) {
            // Debug: Đếm trực tiếp từ dữ liệu hiện tại
            const directCounts: { [key: number]: number } = { 0: 0, 1: 0, 2: 0 };
            response.data.items.forEach((item: TD_TuyenDungType) => {
              directCounts[item.tinhTrang] = (directCounts[item.tinhTrang] || 0) + 1;
            });
            console.log("Đếm trực tiếp từ dữ liệu:", directCounts);
            console.log("Dữ liệu items:", response.data.items);
            
            await fetchAllStatusCounts();
          }
          // Nếu có filter, không cập nhật count vì đã được xử lý trong handleStatusFilter
        } else {
          toast.error(response.message || "Lỗi lấy dữ liệu");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu");
      } finally {
        setLoading(false);
        dispatch(setIsLoading(false));
      }
    },
    [searchValues, dispatch, fetchAllStatusCounts]
  );

  useEffect(() => {
    handleGetListData();
  }, [handleGetListData]);

  const handleDelete = async (id: string) => {
    try {
      const response = await TD_TuyenDungService.delete(id);
      if (response.status) {
        toast.success("Xóa vị trí tuyển dụng thành công");
        handleGetListData();
        // Cập nhật lại count sau khi xóa
        await fetchAllStatusCounts();
      } else {
        toast.error(response.message || "Xóa vị trí tuyển dụng thất bại");
      }
    } catch (error) {
      toast.error("Xóa vị trí tuyển dụng thất bại");
    }
  };

  const handleCreateEditSuccess = async () => {
    handleGetListData();
    // Cập nhật lại count sau khi thêm/sửa
    await fetchAllStatusCounts();
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentData(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
    setCurrentDetailData(null);
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<TD_TuyenDungSearchType>["onFinish"] = async (
    values
  ) => {
    try {
      const searchData = {
        ...values,
        pageIndex: 1,
        pageSize: searchValues.pageSize,
      };
      // Thêm statusFilter vào payload nếu đang chọn
      if (statusFilter !== null) {
        searchData.tinhTrang = statusFilter;
      } else {
        delete searchData.tinhTrang;
      }
      setSearchValues(searchData);
      await handleGetListData(searchData);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  const statusTabs = [
    {
      key: 'all',
      label: <span><AppstoreOutlined /> Tất cả <span style={{ marginLeft: 8, color: '#1890ff', fontWeight: 600 }}>{totalAll}</span></span>,
      value: null,
      color: '#1890ff',
    },
    {
      key: '0',
      label: <span><ClockCircleOutlined /> Đang tuyển <span style={{ marginLeft: 8, color: '#1890ff', fontWeight: 600 }}>{statusCounts[0]}</span></span>,
      value: 0,
      color: '#1890ff',
    },
    {
      key: '1',
      label: <span><CheckCircleOutlined /> Đã đóng <span style={{ marginLeft: 8, color: '#52c41a', fontWeight: 600 }}>{statusCounts[1]}</span></span>,
      value: 1,
      color: '#52c41a',
    },
    {
      key: '2',
      label: <span><PauseCircleOutlined /> Hoãn <span style={{ marginLeft: 8, color: '#fa8c16', fontWeight: 600 }}>{statusCounts[2]}</span></span>,
      value: 2,
      color: '#fa8c16',
    },
  ];

  const [activeTab, setActiveTab] = useState('all');

  const handleTabChange = async (key: string) => {
    setActiveTab(key);
    let value: number | null = null;
    if (key !== 'all') value = Number(key);
    setStatusFilter(value);
    const newSearch = { ...searchValues, pageIndex: 1 };
    if (value === null) {
      delete newSearch.tinhTrang;
      await fetchAllStatusCounts();
    } else {
      newSearch.tinhTrang = value;
      const newCount = await fetchStatusCount(value);
      setStatusCounts(prev => ({ ...prev, [value]: newCount }));
    }
    setSearchValues(newSearch);
    handleGetListData(newSearch);
  };

  // Thao tác cập nhật tình trạng tuyển dụng
  const handleUpdateStatus = async (record: TD_TuyenDungType, newStatus: number) => {
    if (record.tinhTrang === newStatus) {
      toast.info("Vị trí đã ở đúng trạng thái này.");
      return;
    }
    Modal.confirm({
      title: "Xác nhận cập nhật tình trạng",
      content: `Bạn có chắc chắn muốn chuyển tình trạng vị trí "${record.tenViTri}" sang "${
        newStatus === 0 ? "Đang tuyển" : newStatus === 1 ? "Đã đóng" : "Hoãn"
      }"?`,
      okText: "Cập nhật",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        try {
          const res = await TD_TuyenDungService.updateStatus({ id: record.id, trangThai: newStatus });
          if (res.status) {
            toast.success("Cập nhật tình trạng thành công");
            handleGetListData();
            await fetchAllStatusCounts();
          } else {
            toast.error(res.message || "Cập nhật thất bại");
          }
        } catch (e) {
          toast.error("Có lỗi khi cập nhật tình trạng");
        }
      },
    });
  };

  const tableColumns: TableProps<TD_TuyenDungType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) =>
        (searchValues.pageIndex - 1) * searchValues.pageSize + index + 1,
    },
    {
      title: "Tên vị trí",
      dataIndex: "tenViTri",
      key: "tenViTri",
      width: 200,
      render: (text: string, record) => (
        <Link
          href={`/TD_TuyenDung/${record.id}`}
          style={{
            fontWeight: "500",
            color: "#1890ff",
            textDecoration: "none",
            transition: "text-decoration 0.2s"
          }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Phòng ban",
      dataIndex: "tenPhongBan",
      key: "tenPhongBan",
      width: 150,
      render: (text: string) => text || "Không xác định",
    },
    {
      title: "Số lượng cần tuyển",
      dataIndex: "soLuongCanTuyen",
      key: "soLuongCanTuyen",
      width: 120,
      align: "center",
      render: (value: number) => (
        <Tag color="blue" style={{ fontSize: "12px" }}>
          {value} người
        </Tag>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "ngayBatDau",
      key: "ngayBatDau",
      width: 120,
      align: "center",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngayKetThuc",
      key: "ngayKetThuc",
      width: 120,
      align: "center",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Tình trạng",
      dataIndex: "tinhTrang",
      key: "tinhTrang",
      width: 130,
      align: "center",
      render: (tinhTrang: number) => {
        let label = "";
        switch (tinhTrang) {
          case 0: label = "Đang tuyển"; break;
          case 1: label = "Đã đóng"; break;
          case 2: label = "Hoãn"; break;
          default: label = "Không xác định";
        }
        return <span>{label}</span>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => {
        const items: MenuProps["items"] = [
          {
            key: "view",
            label: "Xem chi tiết",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurrentDetailData(record);
              setIsOpenDetail(true);
            },
          },
          {
            key: "edit",
            label: "Chỉnh sửa",
            icon: <EditOutlined />,
            onClick: () => {
              setCurrentData(record);
              setIsOpenModal(true);
            },
          },
          {
            type: "divider",
          },
          {
            key: "status-dangtuyen",
            label: "Chuyển sang Đang tuyển",
            icon: <ClockCircleOutlined style={{ color: '#1890ff' }} />,
            onClick: () => handleUpdateStatus(record, 0),
          },
          {
            key: "status-dadong",
            label: "Chuyển sang Đã đóng",
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            onClick: () => handleUpdateStatus(record, 1),
          },
          {
            key: "status-hoan",
            label: "Chuyển sang Hoãn",
            icon: <PauseCircleOutlined style={{ color: '#fa8c16' }} />,
            onClick: () => handleUpdateStatus(record, 2),
          },
          {
            type: "divider",
          },
          {
            key: "delete",
            label: "Xóa",
            icon: <DeleteOutlined />, 
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: "Xác nhận xóa",
                content: `Bạn có chắc chắn muốn xóa vị trí "${record.tenViTri}"?`,
                okText: "Xóa",
                cancelText: "Hủy",
                okType: "danger",
                onOk: () => handleDelete(record.id),
              });
            },
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
        <h2 className="mb-1">Quản lý Vị trí tuyển dụng</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            onClick={toggleSearch}
            type="default"
            icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />} 
            size="small"
          >
            {isPanelVisible ? "Đóng tìm kiếm" : "Tìm kiếm"}
          </Button>
         
          <Button
            onClick={() => setIsOpenModal(true)}
            type="primary"
            icon={<PlusCircleOutlined />}
            size="small"
          >
            Thêm mới
          </Button>
          <TD_TuyenDungCreateOrUpdate
            isOpen={isOpenModal}
            onSuccess={handleCreateEditSuccess}
            onClose={handleClose}
            data={currentData}
          />
        </div>
      </Flex>
      <Card style={{ padding: "0px" }} className={classes.customCardShadow}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          items={statusTabs}
        />
        {isPanelVisible && <Search onFinish={onFinishSearch} />}
        <TD_TuyenDungDetail
          data={currentDetailData}
          isOpen={isOpenDetail}
          onClose={handleCloseDetail}
        />
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={listData}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={false}
            loading={loading}
          />
        </div>
        <Pagination
          className="mt-2"
          total={dataPage?.totalCount}
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
            handleGetListData(newSearchValues);
          }}
        />
      </Card>
    </>
  );
};

export default Page
