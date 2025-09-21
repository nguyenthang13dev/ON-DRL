"use client";
import Flex from "@/components/shared-components/Flex";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import withAuthorization from "@/libs/authentication";
import { giaoVienService } from "@/services/giaoVien/giaoVien.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import { ResponsePageInfo } from "@/types/general";
import { searchGiaoVien, GiaoVien } from "@/types/giaoVien/giaoVien";
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  FormProps,
  MenuProps,
  Pagination,
  Popconfirm,
  Space,
  Table,
  TableProps,
  Tag,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CreateOrUpdate from "./createOrUpdate";
import GiaoVienDetail from "./detail";
import classes from "./page.module.css";
import Search from "./search";

const QLGiaoVien: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listGiaoVien, setListGiaoVien] = useState<GiaoVien[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<searchGiaoVien | null>(null);
  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [currentGiaoVien, setCurrentGiaoVien] = useState<GiaoVien | null>();
  const [currentDetailGiaoVien, setCurrentDetailGiaoVien] =
    useState<GiaoVien>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);

  const tableColumns: TableProps<GiaoVien>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Khoa",
      dataIndex: "tenKhoa",
      render: (_: any, record: GiaoVien) => <span>{record.tenKhoa || ""}</span>,
    },
    {
      title: "Mã giáo viên",
      dataIndex: "maGiaoVien",
      render: (_: any, record: GiaoVien) => <span>{record.maGiaoVien}</span>,
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      render: (_: any, record: GiaoVien) => <span>{record.hoTen}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (_: any, record: GiaoVien) => <span>{record.email}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "soDienThoai",
      render: (_: any, record: GiaoVien) => (
        <span>{record.soDienThoai || "-"}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (_: any, record: GiaoVien) => {
        const getColor = (status: string) => {
          switch (status) {
            case "DangLam":
              return "green";
            case "NghiViec":
              return "red";
            default:
              return "default";
          }
        };
        return (
          <Tag color={getColor(record.trangThai)}>{record.tenTrangThai}</Tag>
        );
      },
    },
    {
      title: "",
      dataIndex: "actions",
      fixed: "right",
      render: (_: any, record: GiaoVien) => {
        const items: MenuProps["items"] = [
          {
            label: "Chi tiết",
            key: "1",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurrentDetailGiaoVien(record);
              setIsOpenDetail(true);
            },
          },
          {
            label: "Chỉnh sửa",
            key: "2",
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
            key: "3",
            danger: true,
            icon: <DeleteOutlined />,
            onClick: () => setOpenPopconfirmId(record.id ?? ""),
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
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có muốn xóa giáo viên này?"
              okText="Xóa"
              cancelText="Hủy"
              open={openPopconfirmId === record.id}
              onConfirm={() => {
                handleDeleteGiaoVien(record.id || "");
                setOpenPopconfirmId(null);
              }}
              onCancel={() => setOpenPopconfirmId(null)}
            ></Popconfirm>
          </>
        );
      },
    },
  ];

  const hanleCreateEditSuccess = () => {
    handleGetListGiaoVien();
  };

  const handleDeleteGiaoVien = async (id: string) => {
    try {
      const response = await giaoVienService.Delete(id);
      if (response.status) {
        toast.success("Xóa giáo viên thành công");
        handleGetListGiaoVien();
      } else {
        toast.error("Xóa giáo viên thất bại");
      }
    } catch (error) {
      toast.error("Xóa giáo viên thất bại");
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<searchGiaoVien>["onFinish"] = async (
    values
  ) => {
    try {
      setSearchValues(values);
      await handleGetListGiaoVien(values);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleGetListGiaoVien = useCallback(
    async (searchDataOverride?: searchGiaoVien) => {
      dispatch(setIsLoading(true));
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          ...(searchValues || {}),
        };
        const response = await giaoVienService.getDataByPage(searchData);
        if (response != null && response.data != null) {
          const data = response.data;
          const items = data.items;
          setListGiaoVien(items);
          setDataPage({
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPage: data.totalPage,
          });
          dispatch(setIsLoading(false));
        }
      } catch (error) {
        dispatch(setIsLoading(false));
      }
    },
    [pageIndex, pageSize, searchValues, dispatch]
  );

  const handleShowModal = (isEdit?: boolean, giaoVien?: GiaoVien) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentGiaoVien(giaoVien);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentGiaoVien(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  useEffect(() => {
    handleGetListGiaoVien();
  }, [handleGetListGiaoVien]);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"
      >
        <AutoBreadcrumb />
        <div>
          <Button
            onClick={() => toggleSearch()}
            type="primary"
            size="small"
            icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
            className={classes.mgright5}
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
          <CreateOrUpdate
            isOpen={isOpenModal}
            onSuccess={hanleCreateEditSuccess}
            onClose={handleClose}
            giaoVien={currentGiaoVien}
          />
        </div>
      </Flex>
      {isPanelVisible && <Search onFinish={onFinishSearch} />}
      <GiaoVienDetail
        giaoVien={currentDetailGiaoVien}
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
      />
      <Card style={{ padding: "0px" }} className={classes.customCardShadow}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={listGiaoVien}
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
          pageSize={pageSize}
          defaultCurrent={1}
          onChange={(e) => {
            setPageIndex(e);
          }}
          onShowSizeChange={(current, pageSize) => {
            setPageIndex(current);
            setPageSize(pageSize);
          }}
          size="small"
          align="end"
        />
      </Card>
    </>
  );
};

export default withAuthorization(QLGiaoVien, "");
