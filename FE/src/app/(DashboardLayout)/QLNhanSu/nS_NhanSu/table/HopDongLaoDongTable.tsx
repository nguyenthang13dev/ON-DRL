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
  DownloadOutlined,
} from "@ant-design/icons";
import nS_BangCapService from "@/services/QLNhanSu/nS_BangCap/nS_BangCapService";
import { toast } from "react-toastify";
import { AppDispatch } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { ResponsePageList } from "@/types/general";
import { setIsLoading } from "@/store/general/GeneralSlice";
import {
  NS_HopDongLaoDongSearchType,
  NS_HopDongLaoDongType,
} from "@/types/QLNhanSu/nS_HopDongLaoDong/nS_HopDongLaoDong";
import nS_HopDongLaoDongService from "@/services/QLNhanSu/nS_HopDongLaoDong/nS_HopDongLaoDongService";
import dayjs from "dayjs";
import NS_HopDongLaoDongCreateOrUpdateForNhanSu from "@/app/(DashboardLayout)/QLNhanSu/nS_HopDongLaoDong/createOrUpdateForNhanSu";
import NS_HopDongLaoDongDetail from "@/app/(DashboardLayout)/QLNhanSu/nS_HopDongLaoDong/detail";
import LoaiHopDongLaoDongConstant from "@/constants/QLNhanSu/LoaiHopDongLaoDongConstant";
import nS_NhanSuService from "@/services/QLNhanSu/nS_NhanSu/nS_NhanSuService";

interface HopDongLaoDongTableProps {
  nhanSuId?: string;
  isDetail?: boolean;
}
const StaticFileUrl = process.env.NEXT_PUBLIC_API_URL;
const HopDongLaoDongTable: React.FC<HopDongLaoDongTableProps> = ({
  nhanSuId,
  isDetail = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [trinhDoNames, setTrinhDoNames] = useState<{ [id: string]: string }>(
    {}
  );
  const dispatch = useDispatch<AppDispatch>();
  const [dataNameUser, setDataNameUser] = useState<string | null>(null);
  const [data, setData] = useState<ResponsePageList<NS_HopDongLaoDongType[]>>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] =
    useState<NS_HopDongLaoDongSearchType | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<NS_HopDongLaoDongType | null>(
    null
  );
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const hanleCreateEditSuccess = () => {
    handleLoadData();
    setCurrentItem(null);
  };

  const handleDelete = async () => {
    const response = await nS_HopDongLaoDongService.delete(
      confirmDeleteId ?? ""
    );
    if (response.status) {
      toast.success("Xóa thành công");
      handleLoadData();
    }
    setConfirmDeleteId(null);
  };

  const handleLoadData = useCallback(
    async (searchDataOverride?: NS_HopDongLaoDongSearchType) => {
      if (nhanSuId) {
        dispatch(setIsLoading(true));
        const searchData = searchDataOverride || {
          nhanSuId,
          pageIndex,
          pageSize: 5,
          ...(searchValues || {}),
        };
        const response = await nS_HopDongLaoDongService.getData(
          searchData as NS_HopDongLaoDongSearchType
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
    if (nhanSuId) {
      const fetchNameUser = async () => {
        try {
          const response = await nS_NhanSuService.getDetail(nhanSuId!);
          if (response.status) {
            setDataNameUser(response.data.hoTen);
          } else {
            message.error("Không tìm thấy nhân sự");
          }
        } catch (error) {
          message.error("Lỗi khi lấy dữ liệu: " + error);
        }
      };
      fetchNameUser();
    }
  }, [dataNameUser]);

  const handleShowModal = (isEdit?: boolean, item?: NS_HopDongLaoDongType) => {
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
  const handleDocx = useCallback(
    async (id: string) => {
      try {
        const res = await nS_HopDongLaoDongService.getDocx("MHDLD", id);
        if (res?.data) {
          window.open(`${StaticFileUrl}/${res?.data ?? ""}`, "_blank");
        }
      } catch (e) {
        console.error(e);
      }
    },
    ["MHDLD"]
  );
  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  const tableColumns: TableProps<NS_HopDongLaoDongType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Nhân sự",
      dataIndex: "nhanSuId",
      render: (_: any, record: NS_HopDongLaoDongType) => (
        <span>{dataNameUser}</span>
      ),
    },
    {
      title: "Ngày ký",
      dataIndex: "ngayKy",
      render: (_: any, record: NS_HopDongLaoDongType) => (
        <span>
          {record.ngayKy ? dayjs(record.ngayKy).format("DD/MM/YYYY") : ""}
        </span>
      ),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "ngayHetHan",
      render: (_: any, record: NS_HopDongLaoDongType) => {
        if (record.loaiHopDong === LoaiHopDongLaoDongConstant.VoThoiHan) {
          return (
            <span style={{ fontStyle: "italic", color: "#52c41a" }}>
              Vô thời hạn
            </span>
          );
        }

        return (
          <span>
            {record.ngayHetHan
              ? dayjs(record.ngayHetHan).format("DD/MM/YYYY")
              : ""}
          </span>
        );
      },
    },
    {
      title: "Loại hợp đồng",
      dataIndex: "loaiHopDong",
      render: (_: any, record: NS_HopDongLaoDongType) => (
        <span>
          {LoaiHopDongLaoDongConstant.getDisplayName(record.loaiHopDong)}
        </span>
      ),
    },
    {
      title: "Số hợp đồng",
      dataIndex: "soHopDong",
      render: (_: any, record: NS_HopDongLaoDongType) => (
        <span>{record.soHopDong}</span>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: NS_HopDongLaoDongType) => {
        const items: MenuProps["items"] = isDetail
          ? [
              {
                label: "Kết xuất",
                key: "4",
                icon: <DownloadOutlined />,
                onClick: () => {
                  handleDocx(record.id ?? "");
                },
              },
            ]
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
                label: "Kết xuất",
                key: "4",
                icon: <DownloadOutlined />,
                onClick: () => {
                  handleDocx(record.id ?? "");
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
          Thêm hợp đồng lao động
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
        <NS_HopDongLaoDongCreateOrUpdateForNhanSu
          item={currentItem}
          onClose={handleClose}
          onSuccess={hanleCreateEditSuccess}
          nhanSuId={nhanSuId!}
        />
      )}
      {isOpenDetail && (
        <NS_HopDongLaoDongDetail
          item={currentItem}
          onClose={handleCloseDetail}
        />
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

export default HopDongLaoDongTable;
