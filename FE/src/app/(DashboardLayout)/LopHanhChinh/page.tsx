"use client";
import Flex from "@/components/shared-components/Flex";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import withAuthorization from "@/libs/authentication";
import { lopHanhChinhService } from "@/services/lopHanhChinh/lopHanhChinh.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import { ResponsePageInfo } from "@/types/general";
import
  {
    LopHanhChinh,
    searchLopHanhChinh,
  } from "@/types/lopHanhChinh/lopHanhChinh";
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
import LopHanhChinhDetail from "./detail";
import classes from "./page.module.css";
import Search from "./search";

import { useRouter } from "next/navigation";


const QLLopHanhChinh: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listLopHanhChinh, setListLopHanhChinh] = useState<LopHanhChinh[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<searchLopHanhChinh | null>(
    null
  );

  const router = useRouter();


  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [currentLopHanhChinh, setCurrentLopHanhChinh] =
    useState<LopHanhChinh | null>();
  const [currentDetailLopHanhChinh, setCurrentDetailLopHanhChinh] =
    useState<LopHanhChinh>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);

  const tableColumns: TableProps<LopHanhChinh>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tên lớp",
      dataIndex: "tenLop",
      render: (_: any, record: LopHanhChinh) => <span>{record.tenLop}</span>,
    },
    {
      title: "Khoa",
      dataIndex: "tenKhoa",
      render: (_: any, record: LopHanhChinh) => <span>{record.tenKhoa}</span>,
    },
    {
      title: "Giáo viên cố vấn",
      dataIndex: "tenGiaoVienCoVan",
      render: (_: any, record: LopHanhChinh) => (
        <span>{record.tenGiaoVienCoVan || ""}</span>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      fixed: "right",
      render: (_: any, record: LopHanhChinh) => {
        const items: MenuProps["items"] = [
          {
            label: "Chi tiết",
            key: "1",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurrentDetailLopHanhChinh(record);
              setIsOpenDetail(true);
            },
          },
          {
            label: "Danh sách sinh viên",
            key: "1",
            icon: <EyeOutlined />,
            onClick: () => {
              router.push(`/LopHanhChinh/${record.id}`);
            },
          }
,          {
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
              description="Bạn có muốn xóa lớp hành chính này?"
              okText="Xóa"
              cancelText="Hủy"
              open={openPopconfirmId === record.id}
              onConfirm={() => {
                handleDeleteLopHanhChinh(record.id || "");
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
    handleGetListLopHanhChinh();
  };

  const handleDeleteLopHanhChinh = async (id: string) => {
    try {
      const response = await lopHanhChinhService.Delete(id);
      if (response.status) {
        toast.success("Xóa lớp hành chính thành công");
        handleGetListLopHanhChinh();
      } else {
        toast.error("Xóa lớp hành chính thất bại");
      }
    } catch (error) {
      toast.error("Xóa lớp hành chính thất bại");
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<searchLopHanhChinh>["onFinish"] = async (
    values
  ) => {
    try {
      setSearchValues(values);
      await handleGetListLopHanhChinh(values);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleGetListLopHanhChinh = useCallback(
    async (searchDataOverride?: searchLopHanhChinh) => {
      dispatch(setIsLoading(true));
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          ...(searchValues || {}),
        };
        const response = await lopHanhChinhService.getDataByPage(searchData);
        if (response != null && response.data != null) {
          const data = response.data;
          const items = data.items;
          setListLopHanhChinh(items);
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

  const handleShowModal = (isEdit?: boolean, lopHanhChinh?: LopHanhChinh) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentLopHanhChinh(lopHanhChinh);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentLopHanhChinh(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  useEffect(() => {
    handleGetListLopHanhChinh();
  }, [handleGetListLopHanhChinh]);

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
            lopHanhChinh={currentLopHanhChinh}
          />
        </div>
      </Flex>
      {isPanelVisible && <Search onFinish={onFinishSearch} />}
      <LopHanhChinhDetail
        lopHanhChinh={currentDetailLopHanhChinh}
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
      />
      <Card style={{ padding: "0px" }} className={classes.customCardShadow}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={listLopHanhChinh}
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

export default withAuthorization(QLLopHanhChinh, "");
