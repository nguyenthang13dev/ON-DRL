"use client";
import { useCallback, useEffect, useState } from "react";
import Flex from "@/components/shared-components/Flex";
import { ResponsePageList } from "@/types/general";
import withAuthorization from "@/libs/authentication";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import * as extensions from "@/utils/extensions";
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
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
  Divider,
  Avatar,
  Tag,
  Typography,
} from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Search from "./search";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import {
  NS_NhanSuSearchType,
  NS_NhanSuType,
} from "@/types/QLNhanSu/nS_NhanSu/nS_NhanSu";
import nS_NhanSuService from "@/services/QLNhanSu/nS_NhanSu/nS_NhanSuService";
import NS_NhanSuCreateOrUpdate from "./createOrUpdate";
import dayjs from "dayjs";
import GioiTinhConstant from "@/constants/QLNhanSu/GioiTinhConstant";
import NS_NhanSuDetailModern from "./detail/NS_NhanSuDetailModern";

const NS_NhanSuPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<ResponsePageList<NS_NhanSuType[]>>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<NS_NhanSuSearchType | null>(
    null
  );
  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentItem, setCurentItem] = useState<NS_NhanSuType | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Static file URL từ env
  const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

  const getAvatarColor = (name?: string | null) => {
    if (!name) return "#1890ff";
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#ff4d4f",
      "#52c41a",
      "#722ed1",
      "#eb2f96",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "N/A";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return words[0][0] + words[words.length - 1][0];
    }
    return name.substring(0, 2);
  };

  const tableColumns: TableProps<NS_NhanSuType>["columns"] = [
    {
      title: "Emp ID",
      dataIndex: "maNV",
      key: "maNV",
      width: 100,
      render: (_: any, record: NS_NhanSuType) => (
        <Typography.Text strong style={{ color: "#1890ff" }}>
          {record.maNV || "N/A"}
        </Typography.Text>
      ),
    },
    {
      title: "Name",
      dataIndex: "hoTen",
      key: "hoTen",
      width: 280,
      render: (_: any, record: NS_NhanSuType) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => {
            setCurentItem(record);
            setIsOpenDetail(true);
          }}
        >
          <Avatar
            size={40}
            src={
              record.hinhAnh
                ? `${StaticFileUrl}${record.hinhAnh}?v=${Date.now()}`
                : undefined
            }
            icon={!record.hinhAnh ? <UserOutlined /> : undefined}
            style={{
              backgroundColor: !record.hinhAnh
                ? getAvatarColor(record.hoTen)
                : undefined,
              fontSize: "14px",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {!record.hinhAnh ? getInitials(record.hoTen) : undefined}
          </Avatar>
          <div>
            <Typography.Text
              strong
              style={{
                display: "block",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#1890ff",
                transition: "color 0.2s",
              }}
            >
              {record.hoTen || "Chưa có tên"}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              style={{ fontSize: "12px", lineHeight: "16px" }}
            >
              {record.chucVu_txt || "Chưa có chức vụ"}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
      render: (_: any, record: NS_NhanSuType) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <MailOutlined style={{ color: "#8c8c8c", fontSize: "12px" }} />
          <Typography.Text style={{ fontSize: "13px" }}>
            {record.email || "Chưa có email"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "dienThoai",
      key: "dienThoai",
      width: 150,
      render: (_: any, record: NS_NhanSuType) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <PhoneOutlined style={{ color: "#8c8c8c", fontSize: "12px" }} />
          <Typography.Text style={{ fontSize: "13px" }}>
            {record.dienThoai || "Chưa có SĐT"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gioiTinh",
      render: (_: any, record: NS_NhanSuType) => (
        <span>{GioiTinhConstant.getDisplayName(record.gioiTinh ?? 0)}</span>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "ngaySinh",
      render: (_: any, record: NS_NhanSuType) => (
        <span>
          {record.ngaySinh
            ? dayjs(record.ngaySinh).format("DD/MM/YYYY")
            : "Chưa có"}
        </span>
      ),
    },
    {
      title: "Designation",
      dataIndex: "phongBan_txt",
      key: "phongBan_txt",
      width: 180,
      render: (_: any, record: NS_NhanSuType) => (
        <Tag
          color="blue"
          style={{
            borderRadius: "4px",
            fontSize: "12px",
            padding: "2px 8px",
            border: "1px solid #d9d9d9",
          }}
        >
          {record.phongBan_txt || "Chưa phân bổ"}
        </Tag>
      ),
    },

    {
      title: "Status",
      dataIndex: "trangThai",
      key: "trangThai",
      width: 100,
      render: (_: any, record: NS_NhanSuType) => (
        <Tag
          color={Number(record.trangThai) === 1 ? "success" : "error"}
          style={{
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: "500",
            padding: "4px 12px",
            border: "none",
          }}
        >
          ● {Number(record.trangThai) === 1 ? "Active" : "Inactive"}
        </Tag>
      ),
    },

    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      render: (_: any, record: NS_NhanSuType) => {
        const items: MenuProps["items"] = [
          {
            label: "Chi tiết",
            key: "2",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurentItem(record);
              setIsOpenDetail(true);
            },
          },
          {
            label: "Chỉnh sửa chi tiết",
            key: "3",
            icon: <EditOutlined />,
            onClick: () => {
              handleShowModal(true, record);
            },
          },
          {
            type: "divider",
          },
          {
            label: "Xóa",
            key: "4",
            danger: true,
            icon: <DeleteOutlined />,
            onClick: () => setConfirmDeleteId(record.id ?? ""),
          },
        ];
        return (
          <>
            <Dropdown menu={{ items }} trigger={["click"]}>
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
    const response = await nS_NhanSuService.delete(confirmDeleteId ?? "");
    if (response.status) {
      toast.success("Xóa thành công");
      handleLoadData();
    }
    setConfirmDeleteId(null);
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<NS_NhanSuSearchType>["onFinish"] = async (
    values
  ) => {
    try {
      setPageIndex(1);
      setSearchValues(values);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleLoadData = useCallback(
    async (searchDataOverride?: NS_NhanSuSearchType) => {
      dispatch(setIsLoading(true));

      const searchData = searchDataOverride || {
        pageIndex,
        pageSize,
        ...(searchValues || {}),
      };
      const response = await nS_NhanSuService.getData(searchData);
      if (response != null && response.data != null) {
        const data = response.data;
        setData(data);
      }
      dispatch(setIsLoading(false));
    },
    [dispatch, pageIndex, pageSize, searchValues]
  );

  const handleShowModal = (isEdit?: boolean, item?: NS_NhanSuType) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurentItem(item ?? null);
    } else {
      setCurentItem(null);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurentItem(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"
      >
        <AutoBreadcrumb />
        <div className="btn-group">
          <Divider type="vertical" />
          <Button
            onClick={() => toggleSearch()}
            type="primary"
            size="small"
            icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
          >
            {isPanelVisible ? "Ẩn tìm kiếm" : "Tìm kiếm"}
          </Button>

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
            <NS_NhanSuCreateOrUpdate
              onSuccess={hanleCreateEditSuccess}
              onClose={handleClose}
              item={currentItem}
            />
          )}
        </div>
      </Flex>
      {isPanelVisible && (
        <Search
          onFinish={onFinishSearch}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      )}
      {isOpenDetail && (
        <NS_NhanSuDetailModern item={currentItem} onClose={handleCloseDetail} />
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
        className={"customCardShadow"}
        style={{
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={data?.items}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={false}
            loading={loading}
            size="middle"
            style={{
              backgroundColor: "#fff",
            }}
            rowClassName={() => "employee-table-row"}
          />
        </div>

        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #f0f0f0",
            backgroundColor: "#fafafa",
            textAlign: "right",
          }}
        >
          <Pagination
            total={data?.totalCount}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} employees`
            }
            pageSize={pageSize}
            current={pageIndex}
            onChange={(e) => {
              setPageIndex(e);
            }}
            onShowSizeChange={(current, pageSize) => {
              setPageIndex(current);
              setPageSize(pageSize);
            }}
            size="default"
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      </Card>
    </>
  );
};

export default withAuthorization(NS_NhanSuPage, "");
