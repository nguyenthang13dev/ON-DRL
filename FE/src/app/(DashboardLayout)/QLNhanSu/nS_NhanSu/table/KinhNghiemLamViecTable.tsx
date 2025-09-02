import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  MenuProps,
  Dropdown,
  Space,
  Modal,
  Pagination,
  TableProps,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { ResponsePageList } from "@/types/general";
import { setIsLoading } from "@/store/general/GeneralSlice";
import {
  NS_KNLamViecType,
  NS_KNLamViecCreateOrUpdateType,
} from "@/types/QLNhanSu/nS_KinhNghiemLamViec/nS_KNLamViec";
import nS_KNLamViecService from "@/services/QLNhanSu/nS_KinhNghiemLamViec/nS_KNLamViecService";
import dayjs from "dayjs";
import NS_KNLMCreateOrUpdateForNhanSu from "../../nS_KinhNghiemLamViec/createOrUpdate_KN_ForNhanSu";

interface KinhNghiemLamViecTableProps {
  nhanSuId?: string;
  maNV?: string;
  isDetail?: boolean;
}

const KinhNghiemLamViecTable: React.FC<KinhNghiemLamViecTableProps> = ({
  nhanSuId,
  maNV,
  isDetail = false,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [dataNameUser, setDataNameUser] = useState<string | null>(null);
  const [data, setData] = useState<ResponsePageList<NS_KNLamViecType[]>>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [searchValues, setSearchValues] = useState<any>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<NS_KNLamViecType | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleCreateEditSuccess = () => {
    handleLoadData();
    setCurrentItem(null);
  };

  const handleDelete = async () => {
    try {
      const response = await nS_KNLamViecService.delete(confirmDeleteId ?? "");
      if (response.status) {
        toast.success("Xóa thành công");
        handleLoadData();
      }
    } catch (error) {
      toast.error("Lỗi khi xóa dữ liệu");
    }
    setConfirmDeleteId(null);
  };

  const handleLoadData = useCallback(
    async (searchDataOverride?: any) => {
      if (nhanSuId) {
        dispatch(setIsLoading(true));
        try {
          const response = await nS_KNLamViecService.getListDto(nhanSuId);
          if (response != null && response.data != null) {
            setData(response.data);
          }
        } catch (error) {
          console.error("Error loading data:", error);
        }
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, nhanSuId]
  );

  const handleShowModal = (isEdit?: boolean, item?: NS_KNLamViecType) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentItem(item ?? null);
    } else {
      setCurrentItem(null);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentItem(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  const tableColumns: TableProps<NS_KNLamViecType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã nhân viên",
      dataIndex: "maNV",
      render: (_: any, record: NS_KNLamViecType) => <span>{record.maNV}</span>,
    },
    {
      title: "Nhân sự",
      dataIndex: "nhanSu",
      render: (_: any, record: NS_KNLamViecType) => (
        <span>{record.hoTenNhanSu}</span>
      ),
    },
    {
      title: "Tên công ty",
      dataIndex: "tenCongTy",
      render: (_: any, record: NS_KNLamViecType) => (
        <span>{record.tenCongTy}</span>
      ),
    },
    {
      title: "Từ ngày",
      dataIndex: "tuNgay",
      render: (_: any, record: NS_KNLamViecType) => (
        <span>
          {record.tuNgay ? dayjs(record.tuNgay).format("DD/MM/YYYY") : ""}
        </span>
      ),
    },
    {
      title: "Đến ngày",
      dataIndex: "denNgay",
      render: (_: any, record: NS_KNLamViecType) => (
        <span>
          {record.denNgay ? dayjs(record.denNgay).format("DD/MM/YYYY") : ""}
        </span>
      ),
    },
    {
      title: "Kinh nghiệm (tháng)",
      dataIndex: "totalMonth",
      render: (_: any, record: NS_KNLamViecType) => (
        <span>{record.totalMonth} tháng</span>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: NS_KNLamViecType) => {
        const items: MenuProps["items"] = isDetail
          ? []
          : [
              {
                label: "Chi tiết",
                key: "2",
                icon: <EyeOutlined />,
                onClick: () => {
                  setCurrentItem(record);
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
                key: "5",
                danger: true,
                icon: <DeleteOutlined />,
                onClick: () => setConfirmDeleteId(record.id ?? ""),
              },
            ];

        if (items.length === 0) {
          return <span>-</span>;
        }

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

  return (
    <div style={{ padding: 24 }}>
      {!isDetail && (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => {
            handleShowModal();
          }}
          style={{ marginBottom: 12 }}
          disabled={!nhanSuId}
        >
          Thêm kinh nghiệm làm việc
        </Button>
      )}
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

      {isOpenModal && (
        <NS_KNLMCreateOrUpdateForNhanSu
          item={currentItem}
          onClose={handleClose}
          onSuccess={handleCreateEditSuccess}
          nhanSuId={nhanSuId!}
          maNV={maNV}
        />
      )}

      {/* TODO: Add detail modal component */}
      {isOpenDetail && (
        <Modal
          title="Chi tiết kinh nghiệm làm việc"
          open={true}
          onCancel={handleCloseDetail}
          footer={null}
          width={800}
          centered
          destroyOnClose
        >
          {/* You'll need to create NS_KNLamViecDetail component */}
          <p>Chi tiết kinh nghiệm làm việc sẽ được thêm vào đây</p>
        </Modal>
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
          <p>Bạn có chắc chắn muốn xóa kinh nghiệm làm việc này?</p>
        </Modal>
      )}
    </div>
  );
};

export default KinhNghiemLamViecTable;
