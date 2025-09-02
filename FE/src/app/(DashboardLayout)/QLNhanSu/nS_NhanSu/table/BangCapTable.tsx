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
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  DownOutlined,
} from "@ant-design/icons";
import nS_BangCapService from "@/services/QLNhanSu/nS_BangCap/nS_BangCapService";
import { duLieuDanhMucService } from "@/services/duLieuDanhMuc/duLieuDanhMuc.service";
import NS_BangCapCreateOrUpdateForNhanSu from "@/app/(DashboardLayout)/QLNhanSu/nS_BangCap/createOrUpdate_BC_ForNhanSu";
import {
  NS_BangCapSearchType,
  NS_BangCapType,
} from "@/types/QLNhanSu/nS_BangCap/nS_BangCap";
import { toast } from "react-toastify";
import { AppDispatch } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { ResponsePageList } from "@/types/general";
import { setIsLoading } from "@/store/general/GeneralSlice";
import NS_BangCapDetail from "@/app/(DashboardLayout)/QLNhanSu/nS_BangCap/detail";

interface BangCapTableProps {
  nhanSuId?: string;
  isDetail?: boolean;
}

const BangCapTable: React.FC<BangCapTableProps> = ({
  nhanSuId,
  isDetail = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [trinhDoNames, setTrinhDoNames] = useState<{ [id: string]: string }>(
    {}
  );
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<ResponsePageList<NS_BangCapType[]>>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<NS_BangCapSearchType | null>(
    null
  );
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<NS_BangCapType | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const hanleCreateEditSuccess = () => {
    handleLoadData();
    setCurrentItem(null);
  };

  const handleDelete = async () => {
    const response = await nS_BangCapService.delete(confirmDeleteId ?? "");
    if (response.status) {
      toast.success("Xóa thành công");
      handleLoadData();
    }
    setConfirmDeleteId(null);
  };

  const handleLoadData = useCallback(
    async (searchDataOverride?: NS_BangCapSearchType) => {
      if (nhanSuId) {
        dispatch(setIsLoading(true));
        const searchData = searchDataOverride || {
          nhanSuId,
          pageIndex,
          pageSize: 5,
          ...(searchValues || {}),
        };
        const response = await nS_BangCapService.getData(
          searchData as NS_BangCapSearchType
        );
        if (response != null && response.data != null) {
          const data = response.data;
          setData(data);
        }
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, pageIndex, pageSize, searchValues]
  );
  useEffect(() => {
    const listId = data?.items.map((bc) => bc.trinhDoId).filter(Boolean);
    if (listId) {
      listId.forEach((id) => {
        if (id && !trinhDoNames[id]) {
          getTrinhDoName(id);
        }
      });
    }
  }, [data]);

  const handleShowModal = (isEdit?: boolean, item?: NS_BangCapType) => {
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

  const getTrinhDoName = async (id: string) => {
    if (!id) return "";
    if (trinhDoNames[id]) return trinhDoNames[id];
    try {
      const res = await duLieuDanhMucService.GetById(id);
      const name = res?.data?.name || id;
      setTrinhDoNames((prev) => ({ ...prev, [id]: name }));
      return name;
    } catch {
      return id;
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, idx: number) => idx + 1,
    },
    {
      title: "Trình độ",
      dataIndex: "trinhDoId",
      render: (_: any, record: NS_BangCapType) => (
        <span>
          {record.trinhDoId
            ? trinhDoNames[record.trinhDoId] || record.trinhDoId
            : ""}
        </span>
      ),
    },
    {
      title: "Nơi cấp",
      dataIndex: "noiCap",
      render: (_: any, record: NS_BangCapType) => <span>{record.noiCap}</span>,
    },
    // Chỉ hiển thị cột thao tác khi không phải chế độ xem chi tiết
    ...(!isDetail
      ? [
          {
            title: "Thao tác",
            dataIndex: "actions",
            fixed: "right" as const,
            align: "center" as const,
            render: (_: any, record: NS_BangCapType) => {
              const items: MenuProps["items"] = [
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
        ]
      : []),
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Chỉ hiển thị nút thêm khi không phải chế độ xem chi tiết */}
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
          Thêm bằng cấp
        </Button>
      )}
      <Table
        columns={columns}
        dataSource={data?.items || []}
        rowKey={(_, idx) => String(idx)}
        pagination={false}
        bordered
        size="small"
        loading={loading}
      />
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
        <NS_BangCapCreateOrUpdateForNhanSu
          item={currentItem}
          onClose={handleClose}
          onSuccess={hanleCreateEditSuccess}
          nhanSuId={nhanSuId!}
        />
      )}
      {isOpenDetail && (
        <NS_BangCapDetail item={currentItem} onClose={handleCloseDetail} />
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
    </div>
  );
};

export default BangCapTable;
