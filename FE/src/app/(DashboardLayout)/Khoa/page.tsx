"use client";
import Flex from "@/components/shared-components/Flex";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import withAuthorization from "@/libs/authentication";
import { khoaService } from "@/services/khoa/khoa.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import { ResponsePageInfo } from "@/types/general";
import { Khoa, searchKhoa } from "@/types/khoa/khoa";
import
  {
    CloseOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
    PlusCircleOutlined,
    SearchOutlined,
  } from "@ant-design/icons";
import
  {
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
  } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CreateOrUpdate from "./createOrUpdate";
import KhoaDetail from "./detail";
import classes from "./page.module.css";
import Search from "./search";

const QLKhoa: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listKhoa, setListKhoa] = useState<Khoa[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<searchKhoa | null>(null);
  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [currentKhoa, setCurrentKhoa] = useState<Khoa | null>();
  const [currentDetailKhoa, setCurrentDetailKhoa] = useState<Khoa>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);

  const tableColumns: TableProps<Khoa>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã khoa",
      dataIndex: "maKhoa",
      render: (_: any, record: Khoa) => <span>{record.maKhoa}</span>,
    },
    {
      title: "Tên khoa",
      dataIndex: "tenKhoa",
      render: (_: any, record: Khoa) => <span>{record.tenKhoa}</span>,
    },
    {
      title: "",
      dataIndex: "actions",
      fixed: "right",
      render: (_: any, record: Khoa) => {
        const items: MenuProps["items"] = [
          {
            label: "Chi tiết",
            key: "1",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurrentDetailKhoa(record);
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
              description="Bạn có muốn xóa khoa này?"
              okText="Xóa"
              cancelText="Hủy"
              open={openPopconfirmId === record.id}
              onConfirm={() => {
                handleDeleteKhoa(record.id || "");
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
    handleGetListKhoa();
  };

  const handleDeleteKhoa = async (id: string) => {
    try {
      const response = await khoaService.Delete(id);
      if (response.status) {
        toast.success("Xóa khoa thành công");
        handleGetListKhoa();
      } else {
        toast.error("Xóa khoa thất bại");
      }
    } catch (error) {
      toast.error("Xóa khoa thất bại");
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<searchKhoa>["onFinish"] = async (values) => {
    try {
      setSearchValues(values);
      await handleGetListKhoa(values);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleGetListKhoa = useCallback(
    async (searchDataOverride?: searchKhoa) => {
      dispatch(setIsLoading(true));
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          ...(searchValues || {}),
        };
        const response = await khoaService.getDataByPage(searchData);
        if (response != null && response.data != null) {
          const data = response.data;
          const items = data.items;
          setListKhoa(items);
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

  const handleShowModal = (isEdit?: boolean, khoa?: Khoa) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentKhoa(khoa);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentKhoa(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  useEffect(() => {
    handleGetListKhoa();
  }, [handleGetListKhoa]);

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
            khoa={currentKhoa}
          />
        </div>
      </Flex>
      {isPanelVisible && <Search onFinish={onFinishSearch} />}
      <KhoaDetail
        khoa={currentDetailKhoa}
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
      />
      <Card style={{ padding: "0px" }} className={classes.customCardShadow}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={listKhoa}
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

export default withAuthorization(QLKhoa, "");
