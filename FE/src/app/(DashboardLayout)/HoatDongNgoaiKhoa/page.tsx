"use client";
import Flex from "@/components/shared-components/Flex";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import withAuthorization from "@/libs/authentication";
import { hoatDongNgoaiKhoaService } from "@/services/hoatDongNgoaiKhoa/hoatDongNgoaiKhoa.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import { Response, ResponsePageInfo, ResponsePageList } from "@/types/general";
import
  {
    SearchHoatDongNgoaiKhoaData,
    TableHoatDongNgoaiKhoaDataType,
  } from "@/types/hoatDongNgoaiKhoa/hoatDongNgoaiKhoa";
import
  {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
    PlusCircleOutlined,
    QrcodeOutlined,
    SearchOutlined,
    UserAddOutlined,
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
    QRCode,
    Space,
    Table,
    Tag,
  } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CreateOrUpdate from "./createOrUpdate";
import HoatDongNgoaiKhoaDetail from "./detail";
import classes from "./page.module.css";
import Search from "./search";



const handleGenerateQr = () =>
{
    
}

const HoatDongNgoaiKhoa: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listHoatDongNgoaiKhoa, setListHoatDongNgoaiKhoa] = useState<
    TableHoatDongNgoaiKhoaDataType[]
  >([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] =
    useState<SearchHoatDongNgoaiKhoaData | null>(null);
  const loading = useSelector((state) => state.general.isLoading);
  const [isShowAddOrUpdate, setIsShowAddOrUpdate] = useState<boolean>(false);
  const [currentHoatDong, setCurrentHoatDong] =
    useState<TableHoatDongNgoaiKhoaDataType | null>(null);
  const [currentDetailHoatDong, setCurrentDetailHoatDong] =
    useState<TableHoatDongNgoaiKhoaDataType>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);
    const [ isShowQRCode, setIsShowQRCode ] = useState<boolean>( false );
    


  const [selectedQRValue, setSelectedQRValue] = useState<string>("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "INACTIVE":
        return "red";
      case "PENDING":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang hoạt động";
      case "INACTIVE":
        return "Không hoạt động";
      case "PENDING":
        return "Chờ phê duyệt";
      default:
        return status;
    }
  };

  const tableColumns: ColumnsType<TableHoatDongNgoaiKhoaDataType> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 60,
      render: (_: any, __: any, index: number) =>
        (pageIndex - 1) * pageSize + index + 1,
    },
    {
      title: "Tên hoạt động",
      key: "tenHoatDong",
      width: 250,
      render: ( _: any, record: TableHoatDongNgoaiKhoaDataType ) =>
      (
        <span style={{ fontWeight: "500" }}>{record.tenHoatDong}</span>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (_: any, record: TableHoatDongNgoaiKhoaDataType) => (
        <Tag color={getStatusColor(record.status)}>{getStatusText(record.status)}</Tag>
      ),
    },
    {
      title: "QR Code",
      dataIndex: "qrValue",
      key: "qrValue",
      width: 100,
      align: "center",
      render: (_: any, record: TableHoatDongNgoaiKhoaDataType) => (
        <Button
          type="link"
          icon={<QrcodeOutlined />}
          onClick={() =>
          {
            debugger

            setSelectedQRValue(record.qrValue ?? "");
            setIsShowQRCode(true);
          }}
        >
          Xem QR
        </Button>
      ),
    },
    {
      title: "Số lượng đăng ký",
      dataIndex: "soLuongDangKy",
      key: "soLuongDangKy",
      width: 120,
      align: "center",
      render: (soLuong: number) => (
        <Tag color="blue">{soLuong || 0} người</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 120,
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "-",
    },

    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      align: "center",
      render: (_: any, record: TableHoatDongNgoaiKhoaDataType) => {
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
            key: "participants",
            label: "Danh sách đăng ký",
            icon: <UserAddOutlined />,
            onClick: () => handleViewParticipants(record),
          },
          {
            key: "qr",
            label: "Xem QR Code",
            icon: <QrcodeOutlined />,
            onClick: () => {
              setSelectedQRValue(record.qrValue);
              setIsShowQRCode(true);
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
        );
      },
    },
  ];

const handleSearch: FormProps<SearchHoatDongNgoaiKhoaData>["onFinish"] = (
    values
  ) => {
    setSearchValues(values);
    setPageIndex(1);
  };

  const handleAdd = () => {
    setCurrentHoatDong(null);
    setIsShowAddOrUpdate(true);
  };

  const handleEdit = (record: TableHoatDongNgoaiKhoaDataType) => {
    setCurrentHoatDong(record);
    setIsShowAddOrUpdate(true);
  };

  const handleDetail = (record: TableHoatDongNgoaiKhoaDataType) => {
    setCurrentDetailHoatDong(record);
    setIsOpenDetail(true);
  };

  const handleViewParticipants = (record: TableHoatDongNgoaiKhoaDataType) => {
    // TODO: Implement view participants functionality
    toast.info("Chức năng xem danh sách đăng ký đang được phát triển");
  };

  const handleDelete = async (id: string) => {
    try {
      dispatch(setIsLoading(true));
      const response = await hoatDongNgoaiKhoaService.delete(id);
      if (response.status) {
        toast.success("Xóa hoạt động ngoại khóa thành công");
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



  const fetchData = useCallback(
    async (searchData?: SearchHoatDongNgoaiKhoaData) => {
      try {
        dispatch(setIsLoading(true));
        const params: SearchHoatDongNgoaiKhoaData = {
          ...searchData,
          pageIndex: searchData?.pageIndex || pageIndex,
          pageSize,
        };

        const response: Response<
          ResponsePageList<TableHoatDongNgoaiKhoaDataType[]>
        > = await hoatDongNgoaiKhoaService.getDataByPage(params);
        
        if (response.status) {
          const result = response.data;
          setListHoatDongNgoaiKhoa( result.items || [] );
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
  }, [searchValues]);

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
            {isPanelVisible ? "Ẩn tìm kiếm" : "Tìm kiếm"}
          </Button>
          <Button
            type="primary"
            size="small"
            className="ml-2"
            icon={<PlusCircleOutlined />}
            onClick={handleAdd}
          >
            Thêm hoạt động
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
            dataSource={listHoatDongNgoaiKhoa}
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
            `${range[0]}-${range[1]} trong ${total} hoạt động`
          }
          onChange={handlePageChange}
          pageSizeOptions={["10", "20", "50", "100"]}
        />
      </Card>

      <CreateOrUpdate
        isOpen={isShowAddOrUpdate}
        onClose={() => setIsShowAddOrUpdate(false)}
        onSuccess={handleSuccess}
        hoatDong={currentHoatDong}
      />

      <HoatDongNgoaiKhoaDetail
        isOpen={isOpenDetail}
        onClose={() => setIsOpenDetail(false)}
        hoatDong={currentDetailHoatDong}
      />

      {/* QR Code Modal */}
      <Modal
        title="QR Code"
        open={isShowQRCode}
        onCancel={() => setIsShowQRCode(false)}
        footer={null}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          {selectedQRValue && (
            <QRCode value={selectedQRValue} size={200} />
          )}
          <p style={{ marginTop: "16px", wordBreak: "break-all" }}>
            {selectedQRValue}
          </p>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {openPopconfirmId && (
        <Modal
          title="Xác nhận xóa"
          open={true}
          onOk={() => handleDelete(openPopconfirmId!)}
          onCancel={() => setOpenPopconfirmId(null)}
          okText="Xóa"
          okButtonProps={{ danger: true }}
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn xóa hoạt động ngoại khóa này không?</p>
        </Modal>
      )}
    </>
  );
};

export default withAuthorization(HoatDongNgoaiKhoa, "");