"use client";
import Flex from "@/components/shared-components/Flex";
import { ResponsePageInfo } from "@/types/general";
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
  InsertRowRightOutlined,
  LockOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UnlockOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  MenuProps,
  Pagination,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import classes from "./page.module.css";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Department, DepartmentSearch } from "@/types/department/department";
import { departmentService } from "@/services/department/department.service";
import CreateUpdateForm from "./CreateUpdateForm";
import Detail from "./Detail";
import Search from "./Search";

const Page: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  //3 thằng chuyển trang
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  //3 thằng xử lý hiện modal
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);

  const [searchValues, setSearchValues] = useState<DepartmentSearch | null>(
    null
  );
  const loading = useSelector((state) => state.general.isLoading);
  const [currentDepartment, setCurrentDepartment] = useState<
    Department | undefined
  >();

  const tableColumns: TableColumnsType<Department> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: "1%",
      render: (_: any, __: Department, index: number) =>
        pageSize * (pageIndex - 1) + index + 1,
    },
    {
      title: "Tên tổ chức",
      dataIndex: "name",
      align: "center",
      render: (_: any, record: Department) => <span>{record.name}</span>,
    },
    {
      title: "Mã",
      dataIndex: "code",
      align: "center",
      render: (_: any, record: Department) => <span>{record.code}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      align: "center",
      render: (_: any, record: Department) => (
        <Button
          size="small"
          color={record.isActive ? "cyan" : "danger"}
          variant="filled"
        >
          {record.isActive ? "Hoạt động" : "Khoá"}
        </Button>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      align: "center",
      width: "10%",
      render: (_: any, record: Department) => {
        const items: MenuProps["items"] = [
          {
            label: "Chi tiết",
            key: "1",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurrentDepartment(record);
              setIsOpenDetail(true);
            },
          },
          {
            label: "Xem phòng ban",
            key: "2",
            icon: <InsertRowRightOutlined />,
            onClick: () => {
              router.push(`/department/${record.id}`);
            },
          },
          {
            label: "Chỉnh sửa",
            key: "3",
            icon: <EditOutlined />,
            onClick: () => {
              handleShowModal(record);
            },
          },
          {
            label: (
              <Popconfirm
                key={`Lock${record.id}`}
                title={record.isActive ? "Xác nhận khóa" : "Xác nhận mở khóa"}
                description={
                  <span>
                    Bạn có muốn {record.isActive ? "khóa" : "mở khóa"} tổ chức
                    này không?
                  </span>
                }
                okText={`Xác nhận`}
                cancelText="Hủy"
                onConfirm={() => {
                  toggleLockDepartment(record);
                }}
                trigger="click"
                forceRender
              >
                <span>{record.isActive ? "Khóa" : "Mở khóa"}</span>
              </Popconfirm>
            ),
            key: "4",
            icon: record.isActive ? <UnlockOutlined /> : <LockOutlined />,
            danger: true,
          },
          {
            label: (
              <Popconfirm
                key={`Delete${record.id}`}
                title="Xác nhận xóa"
                description={
                  <span>
                    Bạn có muốn xóa tổ chức này không? <br /> Sau khi xóa sẽ
                    không thể khôi phục.
                  </span>
                }
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() => {
                  handleDeleteDepartment(record.id);
                }}
                trigger="click"
                forceRender
              >
                <span>Xóa</span>
              </Popconfirm>
            ),
            key: "5",
            icon: <DeleteOutlined />,
            danger: true,
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

  const toggleLockDepartment = async (department: Department) => {
    const action = department.isActive ? "Khoá tổ chức" : "Mở khoá tổ chức";
    try {
      const response = await departmentService.Deactive(department.id);
      if (response.status) {
        toast.success(`${action} thành công`);
        handleFetchDepartment();
      } else {
        toast.error(`${action} thất bại`);
      }
    } catch (error) {
      toast.error(`Có lỗi xảy ra`);
    }
  };

  const handleCreateEditSuccess = () => {
    handleFetchDepartment();
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      const response = await departmentService.Delete(id);
      if (response.status) {
        toast.success("Xóa tài khoản thành công");
        handleFetchDepartment();
      } else {
        toast.error("Xóa tài khoản thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const handleSearch = async (values: DepartmentSearch) => {
    try {
      setSearchValues(values);
      await handleFetchDepartment(values);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleFetchDepartment = useCallback(
    async (searchData?: DepartmentSearch) => {
      dispatch(setIsLoading(true));
      try {
        const param = searchData || {
          pageIndex,
          pageSize,
          level: 1,
          ...searchValues,
        };
        const response = await departmentService.getDataByPage(param);
        if (response != null && response.data != null) {
          const data = response.data;
          setDepartmentList(data.items);
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
    [pageIndex, pageSize]
  );

  const handleShowModal = (department: Department | undefined = undefined) => {
    setCurrentDepartment(department);
    setIsOpenModal(true);
  };

  const handleClose = () => {
    setIsOpenModal(false);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  useEffect(() => {
    handleFetchDepartment();
  }, []);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="end"
        className={classes.mgButton10}
      >
        <Button
          onClick={() => toggleSearch()}
          type="primary"
          size="small"
          icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
          className={classes.mgright5}
        >
          {isPanelVisible ? "Ẩn tìm kiếm" : "Tìm kiếm"}
        </Button>

        <Link href="/QLNguoiDung/Import">
          <Button
            color="pink"
            variant="solid"
            icon={<VerticalAlignTopOutlined />}
            size="small"
            className={`${classes.mgright5} ${classes.colorKetXuat}`}
          >
            Import
          </Button>
        </Link>

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
      </Flex>
      {isPanelVisible && <Search handleSearch={handleSearch} />}

      <Card style={{ padding: "0px" }} className={classes.customCardShadow}>
        <div className="table-responsive">
          <Table<Department>
            columns={tableColumns}
            bordered
            dataSource={departmentList}
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
      <Detail
        visible={isOpenDetail}
        department={currentDepartment!}
        onClose={handleCloseDetail}
      />
      <CreateUpdateForm
        isOpen={isOpenModal}
        onSuccess={handleCreateEditSuccess}
        onClose={handleClose}
        data={currentDepartment}
      />
    </>
  );
};

export default withAuthorization(Page, "");
