"use client";
import { useCallback, useEffect, useState } from "react";
import Flex from "@/components/shared-components/Flex";
import { ResponsePageList } from "@/types/general";
import withAuthorization from "@/libs/authentication";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
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
  Tabs,
} from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Search from "./search";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import {
  DA_DuAnCreateOrUpdateType,
  DA_DuAnSearchType,
  DA_DuAnType,
} from "@/types/dA_DuAn/dA_DuAn";
import dA_DuAnService from "@/services/dA_DuAn/dA_DuAnService";
import DA_DuAnCreateOrUpdate from "./createOrUpdate";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { PermissionWrapper, useBuildMenuItems } from "@/components/shared-components/PermissionWrappers";
import { MODULE_QUANLYDUAN } from "@/constants/PermissionConstants";

// Function để lấy màu sắc theo trạng thái
const getStatusColor = (status?: number | null) => {
  switch (status) {
    case 0: // Chờ triển khai
      return {
        background: "#fff7e6",
        color: "#fa8c16",
        border: "#ffd591"
      };
    case 1: // Đang thực hiện
      return {
        background: "#e6f7ff",
        color: "#1890ff",
        border: "#91d5ff"
      };
    case 2: // Tạm dừng
      return {
        background: "#fff1f0",
        color: "#ff4d4f",
        border: "#ffccc7"
      };
    case 3: // Hoàn thành
      return {
        background: "#f6ffed",
        color: "#52c41a",
        border: "#b7eb8f"
      };
    default: // Mặc định
      return {
        background: "#fafafa",
        color: "#666",
        border: "#d9d9d9"
      };
  }
};

// Function để chuyển đổi số status thành text
const getStatusText = (status?: number | null) => {
  switch (status) {
    case 0: return "Chờ triển khai";
    case 1: return "Đang thực hiện";
    case 2: return "Tạm dừng";
    case 3: return "Hoàn thành";
    default: return "Không xác định";
  }
};

const DA_DuAnPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [data, setData] = useState<ResponsePageList<DA_DuAnType[]>>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<DA_DuAnSearchType | null>(
    null
  );
  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentItem, setCurentItem] =
    useState<DA_DuAnCreateOrUpdateType | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Function tính toán thống kê dự án theo trạng thái
  const getProjectStats = () => {
    if (!data?.items) {
      return {
        total: 0,
        choTrienKhai: 0,
        dangThucHien: 0,
        tamDung: 0,
        hoanThanh: 0
      };
    }

    const stats = data.items.reduce(
      (acc, item) => {
        acc.total++;
        switch (item.trangThaiThucHien) {
          case 0:
            acc.choTrienKhai++;
            break;
          case 1:
            acc.dangThucHien++;
            break;
          case 2:
            acc.tamDung++;
            break;
          case 3:
            acc.hoanThanh++;
            break;
        }
        return acc;
      },
      { total: 0, choTrienKhai: 0, dangThucHien: 0, tamDung: 0, hoanThanh: 0 }
    );

    return stats;
  };

  // Tính toán projectStats 
  const projectStats = getProjectStats();

  // Tính tổng số dự án cho tab "Tất cả"
  const totalAll = data?.totalCount || 0;

  // Tạo status tabs giống như TD_TuyenDung
  const statusTabs = [
    {
      key: 'all',
      label: <span><AppstoreOutlined /> Tất cả <span style={{ marginLeft: 8, color: '#1890ff', fontWeight: 600 }}>{totalAll}</span></span>,
      value: null,
      color: '#1890ff',
    },
    {
      key: '0',
      label: <span><ClockCircleOutlined /> Chờ triển khai <span style={{ marginLeft: 8, color: '#fa8c16', fontWeight: 600 }}>{projectStats.choTrienKhai}</span></span>,
      value: 0,
      color: '#fa8c16',
    },
    {
      key: '1',
      label: <span><PlayCircleOutlined /> Đang thực hiện <span style={{ marginLeft: 8, color: '#1890ff', fontWeight: 600 }}>{projectStats.dangThucHien}</span></span>,
      value: 1,
      color: '#1890ff',
    },
    {
      key: '2',
      label: <span><PauseCircleOutlined /> Tạm dừng <span style={{ marginLeft: 8, color: '#ff4d4f', fontWeight: 600 }}>{projectStats.tamDung}</span></span>,
      value: 2,
      color: '#ff4d4f',
    },
    {
      key: '3',
      label: <span><CheckCircleOutlined /> Hoàn thành <span style={{ marginLeft: 8, color: '#52c41a', fontWeight: 600 }}>{projectStats.hoanThanh}</span></span>,
      value: 3,
      color: '#52c41a',
    },
  ];

  // Filter dữ liệu theo tab đang active
  const filteredData = data?.items?.filter(item => {
    if (activeTab === 'all') return true;
    return item.trangThaiThucHien === parseInt(activeTab);
  });

  // Cập nhật filtered data cho table và pagination
  const displayData = {
    ...data,
    items: filteredData,
    totalCount: activeTab === 'all' ? data?.totalCount : filteredData?.length
  };

  // Function to create menu items for each row
  const createMenuItemsForRow = (record: DA_DuAnType): MenuProps["items"] => {
    return [
      {
        
        key: "view",
        label: "Chi tiết",
        icon: <EyeOutlined />,
        onClick: () => {
      
          handleShowDetailPage(record.id ?? "");
        },
      },
      {
        
        key: "edit",
        label: "Chỉnh sửa",
        icon: <EditOutlined />,
        onClick: () => {
          handleShowModal(true, record);
        },
      },
      {
        key: "delete",
        label: "Xóa",
        danger: true,
        icon: <DeleteOutlined />,
        onClick: () => {
  
          handleDeleteDuAn(record.id ?? "");
        },
      },
    ];
  };

  const handleDeleteDuAn =  (id: string) => {
    console.log("id", id);
    const confirm = Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa dự án này?",
      onOk: async () => {
         const reponse = await dA_DuAnService.delete(id);
         if (reponse.status) {
          toast.success("Xóa thành công");
          handleLoadData();
         }
      },
    });
  };

  const tableColumns: TableProps<DA_DuAnType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tên dự án",
      dataIndex: "tenDuAn",
      render: (_: any, record: DA_DuAnType) => (
        <span
          style={{
            color: '#1890ff',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          onClick={() => handleShowDetailPage(record.id)}
        >
          {record.tenDuAn}
        </span>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "ngayBatDau",
      render: (_: any, record: DA_DuAnType) => (
        <span>
          {record.ngayBatDau
            ? dayjs(record.ngayBatDau).format("DD/MM/YYYY")
            : ""}
        </span>
      ),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngayKetThuc",
      render: (_: any, record: DA_DuAnType) => (
        <span>
          {record.ngayKetThuc
            ? dayjs(record.ngayKetThuc).format("DD/MM/YYYY")
            : ""}
        </span>
      ),
    },

    {
      title: "Ngày tiếp nhận",
      dataIndex: "ngayTiepNhan",
      render: (_: any, record: DA_DuAnType) => (
        <span>
          {record.ngayTiepNhan
            ? dayjs(record.ngayTiepNhan).format("DD/MM/YYYY")
            : ""}
        </span>
      ),
    },
    {
      title: "Trạng thái thực hiện",
      dataIndex: "trangThaiThucHien",
      render: (_: any, record: DA_DuAnType) => {
        const statusColor = getStatusColor(record.trangThaiThucHien);
        const statusText = getStatusText(record.trangThaiThucHien);

        return (
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: statusColor.background,
              color: statusColor.color,
              border: `1px solid ${statusColor.border}`,
              display: 'inline-block'
            }}
          >
            {statusText}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      render: (_: any, record: DA_DuAnType) => {
        const menuItems = createMenuItemsForRow(record);
        return (
          <>
            <Dropdown menu={{ items: menuItems || [] }} trigger={["click"]}>
              <Button
                onClick={(e) => e.preventDefault()}
                color="primary"
                size="small"
              >
                <Space>
                  Thao tác
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </>
        );
      },
    },
  ];

  const hanleCreateEditSuccess = () => {
    handleLoadData();
    setCurentItem(null);
  };

  const handleDelete = async () => {
    dispatch(setIsLoading(true));
    try {
      const response = await dA_DuAnService.delete(confirmDeleteId ?? "");
      if (response.status) {
        toast.success("Xóa thành công");
        await handleLoadData(); // Reload lại data sau khi xóa
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<DA_DuAnSearchType>["onFinish"] = async (
    values
  ) => {
    try {
      setSearchValues(values);
      setPageIndex(1); // Reset về trang đầu khi tìm kiếm
      await handleLoadData(values);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  const handleLoadData = useCallback(
    async (searchDataOverride?: DA_DuAnSearchType) => {
      dispatch(setIsLoading(true));
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          ...(searchValues || {}),
        };
        const response = await dA_DuAnService.getData(searchData);
        if (response != null && response.data != null) {
          const data = response.data;
          setData(data);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, pageIndex, pageSize, searchValues]
  );

  const handleShowDetailPage = (id?: string) => {
    if (id) {
      router.push(`/DuAn/detail/${id}`);
    }
  };

  const handleShowModal = async (isEdit?: boolean, item?: DA_DuAnType) => {
    setIsOpenModal(true);
    if (isEdit && item?.id) {
      dispatch(setIsLoading(true));
      try {
        // Gọi API lấy chi tiết dự án
        const res = await dA_DuAnService.getFormById(item.id);
        console.log("res.data", res.data);
        setCurentItem(res.data); // res.data phải có phanCongList
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết dự án:", error);
      } finally {
        dispatch(setIsLoading(false));
      }
    } else {
      setCurentItem(null);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurentItem(null);
  };

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  // useEffect riêng để reload data khi pageIndex hoặc pageSize thay đổi
  useEffect(() => {
    if (pageIndex > 1 || pageSize !== 20) { // Chỉ reload nếu không phải lần đầu
      handleLoadData();
    }
  }, [pageIndex, pageSize]);


  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"
      >
        <AutoBreadcrumb />
        <div className="btn-group">
          <Button
            onClick={() => toggleSearch()}
            type="primary"
            size="small"
            icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
          >
            {isPanelVisible ? "Ẩn tìm kiếm" : "Tìm kiếm"}
          </Button>
          <PermissionWrapper
            moduleCode={MODULE_QUANLYDUAN.code}
            operation={MODULE_QUANLYDUAN.actions.create}>
            <Button
              onClick={() => {
                handleShowModal();
              }}
              type="primary"
              icon={<PlusCircleOutlined />}
              size="small"
            >
              Thêm mới
            </Button>
            {isOpenModal && (
              <DA_DuAnCreateOrUpdate
                onSuccess={hanleCreateEditSuccess}
                onClose={handleClose}
                itemId={currentItem?.id ? currentItem.id : null}
                item={currentItem}
              />
            )}
          </PermissionWrapper>
        </div>
      </Flex>
      {isPanelVisible && (
        <Search
          onFinish={onFinishSearch}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      )}

      {confirmDeleteId && (
        <Modal
          title="Xác nhận xóa"
          open={true}
          onOk={handleDelete}
          onCancel={() => setConfirmDeleteId(null)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn xóa mục này?</p>
        </Modal>
      )}
      <Card
        style={{ padding: "0px" }}
        className={"customCardShadow"}
      >
        {/* Status Tabs theo style TD_TuyenDung */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={statusTabs.map(tab => ({
            key: tab.key,
            label: tab.label,
          }))}
        />

        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={displayData?.items}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={false}
            loading={loading}
          />
        </div>

        <Pagination
          className="mt-2"
          total={displayData?.totalCount}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} trong ${total} dữ liệu`
          }
          current={pageIndex}
          pageSize={pageSize}
          showSizeChanger
          onChange={(page, pageSize) => {
            const newPageIndex = page;
            const newPageSize = pageSize || 20;
            setPageIndex(newPageIndex);
            setPageSize(newPageSize);
          }}
        />
      </Card>
    </>
  );
};

export default withAuthorization(DA_DuAnPage, "");
