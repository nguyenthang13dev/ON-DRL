"use client";
import Flex from "@/components/shared-components/Flex";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import withAuthorization from "@/libs/authentication";
import { configFormService } from "@/services/ConfigForm/ConfigForm.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import
  {
    SearchConfigFormData,
    TableConfigFormDataType,
  } from "@/types/ConfigForm/ConfigForm";
import { Response, ResponsePageInfo, ResponsePageList } from "@/types/general";
import
  {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
    PlusCircleOutlined,
    SearchOutlined,
    SettingFilled
  } from "@ant-design/icons";
import
  {
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
    Tag
  } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CreateOrUpdate from "./createOrUpdate";
import ConfigFormDetail from "./detail";
import classes from "./page.module.css";
import Search from "./search";


const ConfigForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listConfigForms, setListConfigForms] = useState<TableConfigFormDataType[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<SearchConfigFormData | null>(
    null
  );
  const loading = useSelector((state) => state.general.isLoading);
  const [isShowAddOrUpdate, setIsShowAddOrUpdate] = useState<boolean>(false);
  const [currentConfigForm, setCurrentConfigForm] =
    useState<TableConfigFormDataType | null>(null);
  const [currentDetailConfigForm, setCurrentDetailConfigForm] =
    useState<TableConfigFormDataType>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const router = useRouter();

  const tableColumns: TableProps<TableConfigFormDataType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tên cấu hình",
      dataIndex: "name",
      width: 250,
      render: (_: any, record: TableConfigFormDataType) => (
        <span style={{ fontWeight: "500" }}>{record.name}</span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 300,
      ellipsis: true,
      render: (description: string) => description || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      width: 120,
      align: "center",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "File đính kèm",
      dataIndex: "fileDinhKems",
      width: 200,
      align: "center",
      render: (fileDinhKems: string) => {
        if (!fileDinhKems) {
          return <Tag color="default">Không có file</Tag>;
        }
        return (
          <Space direction="vertical" size="small">
            <Tag color="blue">Có file đính kèm</Tag>
            <Button 
              size="small" 
              type="link"
              onClick={() => window.open(`${process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL}/${fileDinhKems}`, '_blank')}
            >
              Tải xuống
            </Button>
          </Space>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      width: 120,
      render: (date: string) => 
        date ? new Date(date).toLocaleDateString("vi-VN") : "-",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      align: "center",
      render: (_: any, record: TableConfigFormDataType) => {
        const items: MenuProps["items"] = [
          {
            key: "detail",
            label: "Xem chi tiết",
            icon: <EyeOutlined />,
            onClick: () => handleDetail(record),
          },
          {
            key: "edit",
            label: "Chỉnh sửa",
            icon: <EditOutlined />,
            onClick: () => handleEdit(record),
          },
          {
            key: "config",
            label: "Cấu hình biểu mẫu",
            icon: <SettingFilled />,
            onClick: () => {
              if (record.fileDinhKems) {
                router.push(`/ConfigForm/preview?Id=${record.id}`);
              } else {
                toast.warning("Không có file đính kèm để cấu hình");
              }
            },
          },
          {
            key: "delete",
            label: "Xóa",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => setOpenPopconfirmId(record.id!),
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

  const fetchData = useCallback(
    async (searchData?: SearchConfigFormData) => {
      try {
        dispatch(setIsLoading(true));
        const params: SearchConfigFormData = {
          ...searchData,
          pageIndex: searchData?.pageIndex || pageIndex,
          pageSize,
        };

        const response: Response = await configFormService.getDataByPage(params);
        if (response.status) {
          const result = response.data as ResponsePageList<TableConfigFormDataType[]>;
          setListConfigForms(result.items || []);
          setDataPage(result);
        } else {
          toast.error(response.message || "Có lỗi xảy ra khi tải dữ liệu");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, pageIndex, pageSize]
  );

  useEffect(() => {
    fetchData(searchValues || undefined);
  }, [fetchData, searchValues]);

  const handleSearch: FormProps<SearchConfigFormData>["onFinish"] = (values) => {
    setSearchValues(values);
    setPageIndex(1);
  };

  const handleAdd = () => {
    setCurrentConfigForm(null);
    setIsShowAddOrUpdate(true);
  };

  const handleEdit = (record: TableConfigFormDataType) => {
    setCurrentConfigForm(record);
    setIsShowAddOrUpdate(true);
  };

  const handleDetail = (record: TableConfigFormDataType) => {
    setCurrentDetailConfigForm(record);
    setIsOpenDetail(true);
  };

  const handleDelete = async (id: string) => {
    try {
      dispatch(setIsLoading(true));
      const response = await configFormService.delete(id);
      if (response.status) {
        toast.success("Xóa cấu hình biểu mẫu thành công");
        fetchData(searchValues || undefined);
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi xóa");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa");
    } finally {
      dispatch(setIsLoading(false));
      setOpenPopconfirmId(null);
    }
  };

  const handlePageChange = (page: number, size?: number) => {
    setPageIndex(page);
    if (size) setPageSize(size);
  };

  const handleSuccess = () => {
    fetchData(searchValues || undefined);
    setIsShowAddOrUpdate(false);
  };

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
            type="primary"
            size="small"
            icon={<SearchOutlined />}
            onClick={() => setIsPanelVisible(!isPanelVisible)}
            className={classes.mgright5}
            >
            {isPanelVisible ? 'Ẩn tìm kiếm' : 'Tìm kiếm'}
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<PlusCircleOutlined />}
            onClick={handleAdd}
          >
            Thêm cấu hình
          </Button>
        </div>
      </Flex>

      {isPanelVisible && (
        <div style={{ marginBottom: 16 }}>
          <Search
            onFinish={handleSearch}
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        </div>
      )}
 <Card style={{ padding: "0px" }} className={classes.customCardShadow}>
              <div className="table-responsive">
                  <Table
                columns={tableColumns}
                dataSource={listConfigForms}
                rowKey="id"
                loading={loading}
                pagination={false}
                scroll={{ x: 1200 }}
                size="middle"
      />
              </div>
              <Pagination
          current={pageIndex}
          pageSize={pageSize}
          total={dataPage?.totalCount || 0}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} trong ${total} cấu hình`
          }
          onChange={handlePageChange}
          pageSizeOptions={["10", "20", "50", "100"]}
        />

              </Card>
      

      <CreateOrUpdate
        isOpen={isShowAddOrUpdate}
        onClose={() => setIsShowAddOrUpdate(false)}
        onSuccess={handleSuccess}
        ConfigForm={currentConfigForm}
      />

      <ConfigFormDetail
        isOpen={isOpenDetail}
        onClose={() => setIsOpenDetail(false)}
        configForm={currentDetailConfigForm}
      />



      {
        openPopconfirmId && (
        <Modal
          title="Xác nhận xóa"
            open={true} 
            onOk={() => handleDelete( openPopconfirmId! )}
            onCancel={() => setOpenPopconfirmId( null )}
            okText="Xóa"
            okButtonProps={{ danger: true }}
            cancelText="Hủy"
          >
          <p>Bạn có chắc chắn muốn xóa cấu hình biểu mẫu này không?</p>
          </Modal>
    )      }
    </>
  );
};

export default withAuthorization(ConfigForm, "");
