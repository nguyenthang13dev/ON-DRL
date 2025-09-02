"use client";
import Flex from "@/components/shared-components/Flex";
import { ResponsePageInfo } from "@/types/general";
import withAuthorization from "@/libs/authentication";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  UserAddOutlined,
  VerticalAlignTopOutlined,
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
import classes from "./page.module.css";
import Search from "./search";
import CreateOrUpdate from "./createOrUpdate";
import { toast } from "react-toastify";
import { tableGroupUserDataType, searchGroupUserData } from "@/types/groupUser/groupUser";
import { GroupUserService } from "@/services/groupUser/groupUser.service";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import EditUserGroupRole from "./editUserGroupRole";
import { useBuildMenuItems, PermissionWrapper } from "@/components/shared-components/PermissionWrappers"
import ErrorBoundary from "@/components/shared-components/ErrorBoundary";
import { Console } from "console";
import { MODULE_QUANTRIHETHONG } from "@/constants/PermissionConstants";
import { usePermissionHelper } from "@/components/shared-components/PermissionHelper";
// import SafeTable from "@/components/shared-components/SafeTable";
// import DebugStoreState from "@/components/shared-components/DebugStoreState";

const QLGroupUser: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listModule, setListModule] = useState<tableGroupUserDataType[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<searchGroupUserData | null>(null);
  const loading = useSelector((state) => state?.general?.isLoading ?? false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [currentGroupUser, setCurrentGroupUser] = useState<tableGroupUserDataType | null>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isEditGroupUserRole, setIsEditGroupUserRole] =
    useState<boolean>(false);
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);
  const{getUserInfo}=usePermissionHelper();
  // Build menu items function
  const getMenuItems = useBuildMenuItems({
    moduleCode: "QUANTRIHETHONG",
    actionItems: [
      {
        operation: MODULE_QUANTRIHETHONG.actions.setting,
        label: "Phân nhóm quyền",
        key: "setting",
        icon: <UserAddOutlined />,
        func: (record) => {
          setCurrentGroupUser(record);
          setIsEditGroupUserRole(true);
        },
      },
      {
        operation: MODULE_QUANTRIHETHONG.actions.edit,
        label: "Chỉnh sửa",
        key: "edit",
        icon: <EditOutlined />,
        // businessRule: (record) =>{ console.log("cc: ",getUserInfo.name); return getUserInfo.name == record.createdBy}, // Chỉ cho phép chỉnh sửa nếu có quyền
        func: (record) => {
          handleShowModal(true, record);
        },
      },
      {
        operation: MODULE_QUANTRIHETHONG.actions.delete,
        label: "Xóa",
        key: "delete",
        danger: true,
        icon: <DeleteOutlined />,
        // businessRule: (record) => getUserInfo.name == record.createdBy, // Chỉ cho phép xóa nếu có quyền
        func: (record) => setOpenPopconfirmId(record.id ?? ""),
      },
    ],
  });


  const tableColumns: TableProps<tableGroupUserDataType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: "1%",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã nhóm người sử dụng",
      dataIndex: "code",
      render: (_: any, record: tableGroupUserDataType) => <span>{record.code}</span>,
    },
    {
      title: "Tên nhóm người sử dụng",
      dataIndex: "code",
      render: (_: any, record: tableGroupUserDataType) => <span>{record.name}</span>,
    },
    {
      title: "Nhóm quyền",
      dataIndex: "roleNames",
      width: "100px",
      render: (_: any, record: tableGroupUserDataType) => {
        return (
          <>
            {record.roleNames != null &&
              record.roleNames.length > 0 &&
              record.roleNames.map((e, index) => (
                <Tag className="mb-1" color="cyan" key={index}>
                  {e}
                </Tag>
              ))}
          </>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      render: (_: any, record: tableGroupUserDataType) => {
        const items = getMenuItems;
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
      const response = await GroupUserService.Delete(id);

      if (response.status) {
        toast.success("Xóa nhóm người sử dụng thành công");
        handleGetListModule();
      } else {
        toast.error("Xóa nhóm người sử dụng thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<searchGroupUserData>["onFinish"] = async (values) => {
    try {
      setSearchValues(values);
      await handleGetListModule(values);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleGetListModule = useCallback(
    async (searchDataOverride?: searchGroupUserData) => {
      dispatch(setIsLoading(true));
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          ...(searchValues || {}),
        };
        const response = await GroupUserService.getDataByPage(searchData);

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

  const handleShowModal = (isEdit?: boolean, module?: tableGroupUserDataType) => {
    console.log("handleShowModal", isEdit, module);
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentGroupUser(module);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentGroupUser(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };


  useEffect(() => {
    handleGetListModule();
  }, [handleGetListModule]);

  return (
    <ErrorBoundary>
      {/* Debug component tạm thời bị comment */}
      {/* <DebugStoreState /> */}
      
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
          <PermissionWrapper moduleCode="QUANTRIHETHONG" operation="canGroupUserCreate">
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
              GroupUser={currentGroupUser}
            />
          </PermissionWrapper>
        </div>
      </Flex>
      {isPanelVisible && <Search onFinish={onFinishSearch} />}
      {/* <QLModuleDetail
        user={currentDetailModule}
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
      /> */}

      <EditUserGroupRole
        groupUser={currentGroupUser}
        isOpen={isEditGroupUserRole}
        onClose={() => setIsEditGroupUserRole(false)}
        onSuccess={hanleCreateEditSuccess}
      />

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
            // fallback={<div>Không thể hiển thị bảng dữ liệu</div>}
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
    </ErrorBoundary>
  );
};

export default withAuthorization(QLGroupUser, "QLGroupUser");
