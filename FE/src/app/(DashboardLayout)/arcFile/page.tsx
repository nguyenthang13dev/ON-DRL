"use client";
import { useCallback, useEffect, useState } from "react";
import Flex from "@/components/shared-components/Flex";
import { DropdownOption, ResponsePageList } from "@/types/general";
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
} from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ArcFileDetail from "./detail";
import Search from "./search";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import {
  ArcFileSearchType,
  ArcFileType,
} from "@/types/arcFile/arcFile";
import arcFileService from "@/services/arcFile/arcFileService";
import ArcFileCreateOrUpdate from "./createOrUpdate";


const ArcFilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<ResponsePageList<ArcFileType[]>>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<ArcFileSearchType | null>(
    null
  );
  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentItem, setCurentItem] = useState<ArcFileType | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [dropdownMaintence, setDropdownMaintence] = useState<DropdownOption[]>();
  const [dropdownOrgan, setDropdownOrgan] = useState<DropdownOption[]>();
  const [dropdownLang, setDropdownLang] = useState<DropdownOption[]>();
  const [dropdownFormat, setDropdownFormat] = useState<DropdownOption[]>();


  const tableColumns: TableProps<ArcFileType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã hồ sơ",
      dataIndex: "fileCode",
      render: (_: any, record: ArcFileType) => (
        <span>{record.fileCode}</span>
      ),
    },
    {
      title: "Mã phông lưu trữ",
      dataIndex: "organName",
      render: (_: any, record: ArcFileType) => (
        <span>{record.organName}</span>
      ),
    },
    {
      title: "Số và ký hiệu hồ sơ",
      dataIndex: "fileNotation",
      render: (_: any, record: ArcFileType) => (
        <span>{record.fileNotation}</span>
      ),
    },
    {
      title: "Tiêu đề hồ sơ",
      dataIndex: "title",
      render: (_: any, record: ArcFileType) => (
        <span>{record.title}</span>
      ),
    },
    {
      title: "Thời hạn bảo quản",
      dataIndex: "maintenceName",
      render: (_: any, record: ArcFileType) => (
        <span>{record.maintenceName}</span>
      ),
    },
    {
      title: "Chế độ sử dụng",
      dataIndex: "rights",
      render: (_: any, record: ArcFileType) => (
        <span>{(record.rights == true ? "Hạn chế" : "")}</span>
      ),
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "langName",
      render: (_: any, record: ArcFileType) => (
        <span>{record.langName}</span>
      ),
    },
    {
      title: "Tổng số văn bản trong hồ sơ",
      dataIndex: "totalDoc",
      render: (_: any, record: ArcFileType) => (
        <span>{record.totalDoc}</span>
      ),
    },




    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      render: (_: any, record: ArcFileType) => {
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
            label: "Chỉnh sửa",
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


  const handleGetDropdown = async () => {
    const rs = await arcFileService.getDropdowns();
    if (rs.status) {
      const data = rs.data;
      setDropdownMaintence(data.dropdownMaintence);
      setDropdownOrgan(data.dropdownOrgan);
      setDropdownLang(data.dropdownLang);
      setDropdownFormat(data.dropdownFormat);
    }
  }


  const hanleCreateEditSuccess = () => {
    handleLoadData();
    setCurentItem(null);
  };

  const handleDelete = async () => {
    const response = await arcFileService.delete(confirmDeleteId ?? "");
    if (response.status) {
      toast.success("Xóa thành công");
      handleLoadData();
    }
    setConfirmDeleteId(null);
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<ArcFileSearchType>["onFinish"] = async (
    values
  ) => {
    try {
      setSearchValues(values);
      await handleLoadData(values);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleLoadData = useCallback(
    async (searchDataOverride?: ArcFileSearchType) => {
      dispatch(setIsLoading(true));

      const searchData = searchDataOverride || {
        pageIndex,
        pageSize,
        ...(searchValues || {}),
      };
      const response = await arcFileService.getData(searchData);
      if (response != null && response.data != null) {
        const data = response.data;
        setData(data);
      }
      dispatch(setIsLoading(false));
    },
    [dispatch, pageIndex, pageSize, searchValues]
  );

  const handleShowModal = (isEdit?: boolean, item?: ArcFileType) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurentItem(item ?? null);
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


  useEffect(() => {
    handleGetDropdown();
  }, []);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"
      >
        <AutoBreadcrumb />
        <div className="btn-group">
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
            <ArcFileCreateOrUpdate
              onSuccess={hanleCreateEditSuccess}
              onClose={handleClose}
              item={currentItem}
              dropdownFormat={dropdownFormat ?? []}
              dropdownLang={dropdownLang ?? []}
              dropdownMaintence={dropdownMaintence ?? []}
              dropdownOrgan={dropdownOrgan ?? []}
            />
          )}
        </div>
      </Flex>
      {isPanelVisible && (
        <Search
          onFinish={onFinishSearch}
          pageIndex={pageIndex}
          pageSize={pageSize}
          dropdownLang={dropdownLang ?? []}
          dropdownOrgan={dropdownOrgan ?? []}
        />
      )}
      {isOpenDetail && (
        <ArcFileDetail item={currentItem} onClose={handleCloseDetail} />
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
      <Card className={"customCardShadow"}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={data?.items}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={false}
            loading={loading}
          />
        </div>
        <Pagination
          className="mt-2"
          total={data?.totalCount}
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

export default withAuthorization(ArcFilePage, "");
