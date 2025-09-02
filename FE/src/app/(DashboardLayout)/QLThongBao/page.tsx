"use client";
import Flex from "@/components/shared-components/Flex";
import {
  DropdownOption,
  DropdownTreeOptionAntd,
  ResponsePageList,
} from "@/types/general";
import withAuthorization from "@/libs/authentication";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import * as extensions from "@/utils/extensions";
import classes from "./page.module.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
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
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import {
  QLThongBaoSearchType,
  QLThongBaoType,
} from "@/types/QLThongBao/QLThongBao";
import QLThongBaoService from "@/services/QLThongBao/QLThongBaoService";
import Search from "./search";
import QLThongBaoCreateOrUpdate from "./createOrUpdate";
import TypeNotifyConstant from "@/constants/TypeNotify";
import QLThongBaoDetail from "./detail";
dayjs.locale("vi");
dayjs.extend(utc);

const QLThongBaoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<ResponsePageList<QLThongBaoType[]>>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<QLThongBaoSearchType | null>(
    null
  );
  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentItem, setCurentItem] = useState<QLThongBaoType | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [typeNotifyDropdown, setTypeNotifyDropdown] = useState<
    DropdownOption[]
  >([]);

  const tableColumns: TableProps<QLThongBaoType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: "tieuDe",
      render: (_: any, record: QLThongBaoType) => <span>{record.tieuDe}</span>,
    },
    {
      title: "Nội dung",
      dataIndex: "noiDung",
      render: (_: any, record: QLThongBaoType) => <span>{record.noiDung}</span>,
    },
    {
      title: "Loại thông báo",
      dataIndex: "loaiThongBao",
      render: (_: any, record: QLThongBaoType) => (
        <span>{record.loaiThongBao}</span>
      ),
    },
    {
      title: "Mã thông báo",
      dataIndex: "maThongBao",
      render: (_: any, record: QLThongBaoType) => (
        <span>{record.maThongBao}</span>
      ),
    },

    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      render: (_: any, record: QLThongBaoType) => {
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

  const hanleCreateEditSuccess = () => {
    handleLoadData();
    setCurentItem(null);
  };
  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };
  const handleClose = () => {
    setIsOpenModal(false);
    setCurentItem(null);
  };
  const handleDelete = async () => {
    const response = await QLThongBaoService.Delete(confirmDeleteId ?? "");
    if (response.status) {
      toast.success("Xóa thành công");
      handleLoadData();
    }
    setConfirmDeleteId(null);
  };
  const handleShowModal = (isEdit?: boolean, item?: QLThongBaoType) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurentItem(item ?? null);
    }
  };
  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };
  const onFinishSearch: FormProps<QLThongBaoSearchType>["onFinish"] = async (
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
    async (searchDataOverride?: QLThongBaoSearchType) => {
      dispatch(setIsLoading(true));
      const searchData = searchDataOverride || {
        pageIndex,
        pageSize,
        ...(searchValues || {}),
      };
      const response = await QLThongBaoService.getData(searchData);
      if (response != null && response.data != null) {
        const data = response.data;
        setData(data);
      }
      dispatch(setIsLoading(false));
    },
    [dispatch, pageIndex, pageSize, searchValues]
  );
  useEffect(() => {
    const data: DropdownOption[] = TypeNotifyConstant.getDropdownList().map(
      (item) => ({
        label: item.label,
        value: String(item.value),
      })
    );
    setTypeNotifyDropdown(data);
  }, []);
  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

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
          {isOpenModal && (
            <QLThongBaoCreateOrUpdate
              onSuccess={hanleCreateEditSuccess}
              onClose={handleClose}
              item={currentItem}
              typeNotifyDropdown={typeNotifyDropdown}
            />
          )}
        </div>
      </Flex>
      {isPanelVisible && (
        <Search
          onFinish={onFinishSearch}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      )}
      {isOpenDetail && (
        <QLThongBaoDetail item={currentItem} onClose={handleCloseDetail} />
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

export default withAuthorization(QLThongBaoPage, "");
