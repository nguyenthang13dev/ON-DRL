"use client";
import Flex from "@/components/shared-components/Flex";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import withAuthorization from "@/libs/authentication";
import { typeDanhMucService } from "@/services/TypeDanhMuc/TypeDanhMuc.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import
    {
        SearchTypeDanhMucData,
        TableTypeDanhMucDataType,
    } from "@/types/TypeDanhMuc/TypeDanhMuc";
import { Response, ResponsePageInfo, ResponsePageList } from "@/types/general";
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
import TypeDanhMucDetail from "./detail";
import classes from "./page.module.css";
import Search from "./search";

const TypeDanhMuc: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listTypeDanhMucs, setListTypeDanhMucs] = useState<
    TableTypeDanhMucDataType[]
  >([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] =
    useState<SearchTypeDanhMucData | null>(null);
  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentTypeDanhMuc, setCurrentTypeDanhMuc] =
    useState<TableTypeDanhMucDataType | null>(null);
  const [currentDetailTypeDanhMuc, setCurrentDetailTypeDanhMuc] =
    useState<TableTypeDanhMucDataType>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);

  const tableColumns: TableProps<TableTypeDanhMucDataType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      render: (_: any, record: TableTypeDanhMucDataType) => (
        <span>{record.name}</span>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      render: (_: any, record: TableTypeDanhMucDataType) => (
        <span>{record.type}</span>
      ),
    },
    {
      title: "Mã DM",
      dataIndex: "codeDm",
      render: (_: any, record: TableTypeDanhMucDataType) => (
        <span>{record.codeDm}</span>
      ),
    },
    {
      title: "Min",
      dataIndex: "min",
      align: "center",
      render: (_: any, record: TableTypeDanhMucDataType) => (
        <span>{record.min}</span>
      ),
    },
    {
      title: "Max",
      dataIndex: "max",
      align: "center",
      render: (_: any, record: TableTypeDanhMucDataType) => (
        <span>{record.max}</span>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      render: (_: any, record: TableTypeDanhMucDataType) => {
        const items: MenuProps["items"] = [
          {
            label: "Chi tiết",
            key: "1",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurrentDetailTypeDanhMuc(record);
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
              description="Bạn có chắc chắn muốn xóa?"
              okText="Xóa"
              cancelText="Hủy"
              open={openPopconfirmId === record.id}
              onConfirm={() => {
                handleDeleteTypeDanhMuc(record.id || "");
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
    handleGetListTypeDanhMuc();
    setCurrentTypeDanhMuc(null);
  };

  const handleDeleteTypeDanhMuc = async (id: string) => {
    try {
      const response = await typeDanhMucService.delete(id);
      if (response.status) {
        toast.success("Xóa thành công");
        handleGetListTypeDanhMuc();
      } else {
        toast.error("Xóa thất bại");
      }
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<SearchTypeDanhMucData>["onFinish"] = async (
    values
  ) => {
    try {
      setSearchValues(values);
      await handleGetListTypeDanhMuc(values);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleGetListTypeDanhMuc = useCallback(
    async (searchDataOverride?: SearchTypeDanhMucData) => {
      dispatch(setIsLoading(true));
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          ...(searchValues || {}),
        };
        const response: Response = await typeDanhMucService.getDataByPage(
          searchData
        );
        if (response != null && response.data != null) {
          const data: ResponsePageList = response.data;
          const items: TableTypeDanhMucDataType[] = data.items;
          setListTypeDanhMucs(items);
          setDataPage({
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPage: data.totalPage,
          });
        }
        dispatch(setIsLoading(false));
      } catch (error) {
        dispatch(setIsLoading(false));
      }
    },
    [pageIndex, pageSize, dispatch, searchValues]
  );

  const handleShowModal = (
    isEdit?: boolean,
    TypeDanhMuc?: TableTypeDanhMucDataType
  ) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentTypeDanhMuc(TypeDanhMuc ?? null);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentTypeDanhMuc(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  useEffect(() => {
    handleGetListTypeDanhMuc();
  }, [handleGetListTypeDanhMuc]);

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
            TypeDanhMuc={currentTypeDanhMuc}
          />
        </div>
      </Flex>
      {isPanelVisible && (
        <Search
          onFinish={onFinishSearch}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      )}
      <TypeDanhMucDetail
        TypeDanhMuc={currentDetailTypeDanhMuc}
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
      />
      <Card style={{ padding: "0px" }} className={classes.customCardShadow}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={listTypeDanhMucs}
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

export default withAuthorization(TypeDanhMuc, "");
