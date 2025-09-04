"use client";
import Flex from "@/components/shared-components/Flex";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import withAuthorization from "@/libs/authentication";
import { roleService } from "@/services/role/role.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import { ResponsePageInfo } from "@/types/general";
import { searchRole, tableRoleType } from "@/types/role/role";
import
  {
    CheckCircleOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
    PlusCircleOutlined,
    SearchOutlined,
    SettingOutlined
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
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CreateOrUpdate from "./createOrUpdate";
import EditRoleApiPermission from "./editRoleApiPermission";
import EditRoleOperation from "./editRoleOperation";
import classes from "./page.module.css";
import Search from "./search";

const QLRole: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [listModule, setListModule] = useState<tableRoleType[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<searchRole | null>(null);
  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [currentRole, setCurrentRole] = useState<tableRoleType | null>();
  const [currentDetailRole, setCurrentDetailRole] = useState<tableRoleType>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isEditRoleOperation, setIsEditRoleOperation] =
    useState<boolean>(false);

  const [itemRoleApiPermission, setItemRoleApiPermission] =
    useState<tableRoleType | null>(null);

  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);

  const tableColumns: TableProps<tableRoleType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã nhóm quyền",
      dataIndex: "code",
      render: (_: any, record: tableRoleType) => <span>{record.code}</span>,
    },
    {
      title: "Tên nhóm quyền",
      dataIndex: "code",
      render: (_: any, record: tableRoleType) => <span>{record.name}</span>,
    },
    {
      title: "Hiệu lực",
      dataIndex: "isActive",
      render: (_: any, record: tableRoleType) => (
        <span
          style={{
            fontSize: "25px",
            color: record.isActive ? "green" : "red",
          }}
        >
          {record.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      fixed: "right",
      render: (_: any, record: tableRoleType) => {
        const items: MenuProps["items"] = [
          {
            label: `${
              record.isActive ? "Khóa nhóm quyền" : "Mở khóa nhóm quyền"
            }`,
            key: "1",
            icon: <SettingOutlined />,
            onClick: () => {
              handleSwitchActiveRole(record.id);
            },
          },
          {
            label: "Thiết lập",
            key: "2",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurrentDetailRole(record);
              setIsEditRoleOperation(true);
            },
          },
          {
            label: "Thiết lập api",
            key: "3",
            icon: <EyeOutlined />,
            onClick: () => {
              setItemRoleApiPermission(record);
            },
          },
          // {
          //   label: "Danh sách quyền truy cập",
          //   key: "3",
          //   icon: <EyeOutlined />,
          //   onClick: () => {
          //     setCurrentDetailRole(record);
          //     setIsOpenDetail(true);
          //   },
          // },
          {
            label: "Chỉnh sửa",
            key: "4",
            icon: <EditOutlined />,
            onClick: () => {
              handleShowModal(true, record);
            },
          },
          {
            label: "Xóa",
            key: "5",
            danger: true,
            icon: <DeleteOutlined />,
            onClick: () => setOpenPopconfirmId(record.id ?? ""),
          },
          {
            type: "divider",
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
              description="Bạn có muốn xóa nhóm quyền này?"
              okText="Xóa"
              cancelText="Hủy"
              open={openPopconfirmId === record.id}
              onConfirm={() => {
                handleDeleteModule(record.id || "");
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
    handleGetListModule();
  };

  const handleDeleteModule = async (id: string) => {
    try {
      const response = await roleService.Delete(id);

      if (response.status) {
        toast.success("Xóa nhóm quyền thành công");
        handleGetListModule();
      } else {
        toast.error("Xóa nhóm quyền thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<searchRole>["onFinish"] = async (values) => {
    try {
      setSearchValues(values);
      await handleGetListModule(values);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleGetListModule = useCallback(
    async (searchDataOverride?: searchRole) => {
      dispatch(setIsLoading(true));
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          ...(searchValues || {}),
        };
        const response = await roleService.getDataByPage(searchData);

        if (response != null && response.data != null) {
          const data = response.data;
          const items = data.items;
          setListModule(items);
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
    [pageIndex, pageSize]
  );

  const handleShowModal = (isEdit?: boolean, module?: tableRoleType) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentRole(module);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentRole(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  const handleSwitchActiveRole = async (id: string) => {
    try {
      const response = await roleService.SwitchActiveRole(id);
      if (response.status) {
        toast.success(
          `${
            response.data?.isActive
              ? "Mở khóa nhóm quyền thành công"
              : "Khóa nhóm quyền thành công"
          } `
        );
        handleGetListModule();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  useEffect(() => {
    handleGetListModule();
  }, [handleGetListModule]);
  console.log("render QLRole");
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
          {/* <Link href="/QLModule/Import">
            <Button
              color="pink"
              variant="solid"
              icon={<VerticalAlignTopOutlined />}
              size="small"
              className={`${classes.mgright5} ${classes.colorKetXuat}`}
            >
              Import
            </Button>
          </Link> */}

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
            role={currentRole}
          />
        </div>
      </Flex>
      {isPanelVisible && <Search onFinish={onFinishSearch} />}
      {/* <QLModuleDetail
        user={currentDetailModule}
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
      /> */}
      {isEditRoleOperation && (
        <EditRoleOperation
          roleId={currentDetailRole?.id ?? ""}
          isOpen={isEditRoleOperation}
          onClose={() => setIsEditRoleOperation(false)}
        />
      )}
      {itemRoleApiPermission && (
        <EditRoleApiPermission
          roleId={itemRoleApiPermission?.id ?? ""}
          onClose={() => setItemRoleApiPermission(null)}
        />
      )}
      <Card style={{ padding: "0px" }} className={classes.customCardShadow}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={listModule}
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

export default withAuthorization(QLRole, "");
