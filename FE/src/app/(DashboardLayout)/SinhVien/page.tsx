"use client";
import Flex from "@/components/shared-components/Flex";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import withAuthorization from "@/libs/authentication";
import { sinhVienService } from "@/services/sinhVien/sinhVien.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import { ResponsePageInfo } from "@/types/general";
import { searchSinhVien, SinhVien } from "@/types/sinhVien/sinhVien";
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
import SinhVienDetail from "./detail";
import classes from "./page.module.css";
import Search from "./search";

const QLSinhVien: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listSinhVien, setListSinhVien] = useState<SinhVien[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<searchSinhVien | null>(null);
  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [currentSinhVien, setCurrentSinhVien] = useState<SinhVien | null>();
  const [currentDetailSinhVien, setCurrentDetailSinhVien] =
    useState<SinhVien>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);

  const tableColumns: TableProps<SinhVien>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã sinh viên",
      dataIndex: "maSV",
      render: (_: any, record: SinhVien) => <span>{record.maSV}</span>,
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      render: (_: any, record: SinhVien) => <span>{record.hoTen}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (_: any, record: SinhVien) => <span>{record.email}</span>,
    },
    {
      title: "Giới tính",
      dataIndex: "gioiTinh",
      render: (_: any, record: SinhVien) => (
        <Tag
          bordered={false}
          color={record.gioiTinh ? "blue" : "pink"}
          style={{ fontSize: "12px" }}
        >
          {record.gioiTinh ? "Nam" : "Nữ"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (_: any, record: SinhVien) => (
        <Tag
          bordered={false}
          color={record.trangThai === "active" ? "green" : "red"}
          style={{ fontSize: "12px" }}
        >
          {record.trangThai === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      fixed: "right",
      render: (_: any, record: SinhVien) => {
        const items: MenuProps["items"] = [
          {
            label: "Chi tiết",
            key: "1",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurrentDetailSinhVien(record);
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
              description="Bạn có muốn xóa sinh viên này?"
              okText="Xóa"
              cancelText="Hủy"
              open={openPopconfirmId === record.id}
              onConfirm={() => {
                handleDeleteSinhVien(record.id || "");
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
    handleGetListSinhVien();
  };

  const handleDeleteSinhVien = async (id: string) => {
    try {
      const response = await sinhVienService.Delete(id);
      if (response.status) {
        toast.success("Xóa sinh viên thành công");
        handleGetListSinhVien();
      } else {
        toast.error("Xóa sinh viên thất bại");
      }
    } catch (error) {
      toast.error("Xóa sinh viên thất bại");
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<searchSinhVien>["onFinish"] = async (
    values
  ) => {
    try {
      setSearchValues(values);
      await handleGetListSinhVien(values);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleGetListSinhVien = useCallback(
    async (searchDataOverride?: searchSinhVien) => {
      dispatch(setIsLoading(true));
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          ...(searchValues || {}),
        };
        const response = await sinhVienService.getDataByPage(searchData);
        if (response != null && response.data != null) {
          const data = response.data;
          const items = data.items;
          setListSinhVien(items);
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

  const handleShowModal = (isEdit?: boolean, sinhVien?: SinhVien) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentSinhVien(sinhVien);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentSinhVien(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  useEffect(() => {
    handleGetListSinhVien();
  }, [handleGetListSinhVien]);

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
            sinhVien={currentSinhVien}
          />
        </div>
      </Flex>
      {isPanelVisible && <Search onFinish={onFinishSearch} />}
      <SinhVienDetail
        sinhVien={currentDetailSinhVien}
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
      />
      <Card style={{ padding: "0px" }} className={classes.customCardShadow}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={listSinhVien}
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

export default withAuthorization(QLSinhVien, "");
