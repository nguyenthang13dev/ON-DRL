"use client";
import Flex from "@/components/shared-components/Flex";
import withAuthorization from "@/libs/authentication";
import { nP_DangKyNghiPhepService } from "@/services/NghiPhep/NP_DangKyNghiPhep/NP_DangKyNghiPhep.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useDispatch, useSelector } from "@/store/hooks";
import {
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  TeamOutlined,
  UploadOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  FormProps,
  MenuProps,
  Popconfirm,
  Space,
  TableProps,
  Tabs,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import Search from "./search";
import CreateOrUpdate from "./createOrUpdate";
import { toast } from "react-toastify";
import NP_DangKyNghiPhepDetail from "./detail";
import {
  searchNP_DangKyNghiPhepDataType,
  tableNP_DangKyNghiPhepDataType,
  ThongKeNghiPhepResponse,
  ThongTinNghiPhepType,
} from "@/types/NP_DangKyNghiPhep/NP_DangKyNghiphep";
import { nP_LoaiNghiPhepService } from "@/services/NghiPhep/NP_LoaiNghiPhep/NP_LoaiNghiPhep.service";
import dayjs from "dayjs";
import TrangThaiNghiPhepConstant from "@/constants/NghiPhep/TrangThaiNghiPhepConstant";
import UploadModal from "./UploadModal";
import { PermissionType } from "@/types/role/role";
import { hasMultiPermission } from "@/libs/Permission";
import TuChoi from "./TuChoi";
import { tableNP_LoaiNghiPhepDataType } from "@/types/NP_LoaiNghiPhep/np_LoaiNghiPhep";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import TableStatus from "./TableStatus";
import LeaveDashboard from "./LeaveDashboard";
import TrangThaiNghiPhepTBConstant from "@/constants/NghiPhep/TrangThaiNghiPhepTBConstant";
import TrangThaiNghiPhepTGDConstant from "@/constants/NghiPhep/TrangThaiNghiPhepTGDConstant";
import DetailNhanSuDrawer from "../QLNhanSu/nS_NhanSu/detail/DetailNhanSuDrawer";

const NP_DangKyNghiPhep: React.FC = () => {
  const dispatch = useDispatch();
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] =
    useState<searchNP_DangKyNghiPhepDataType | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentNP_DangKyNghiPhep, setCurrentNP_DangKyNghiPhep] =
    useState<tableNP_DangKyNghiPhepDataType>();
  const [currentDetailNP_DangKyNghiPhep, setCurrentDetailNP_DangKyNghiPhep] =
    useState<tableNP_DangKyNghiPhepDataType>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [danhSachLoaiNghiPhep, setDanhSachLoaiNghiPhep] = useState<
    tableNP_LoaiNghiPhepDataType[]
  >([]);
  const [currentId, setCurrentId] = useState<string>("");
  const [isOpenTuChoi, setIsOpenTuChoi] = useState<boolean>(false);
  const [thongKe, setThongKe] = useState<ThongKeNghiPhepResponse>();
  const [thongTinNghiPhep, setThongTinNghiPhep] =
    useState<ThongTinNghiPhepType>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  //state để mở popconfirm
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);

  const [openPopconfirmPheDuyetId, setOpenPopconfirmPheDuyetId] = useState<
    string | null
  >(null);

  const [openPopconfirmXoaId, setOpenPopconfirmXoaId] = useState<string | null>(
    null
  );

  const [isOpenDetailNS, setIsOpenDetailNS] = useState<boolean>();
  const [currentIdDetail, setCurrentIdDetail] = useState<string>("");

  //lấy quyền người dùng
  const permissions: PermissionType[] | null = useSelector(
    (state) => state.permission.permissions
  );

  const modulePermission = hasMultiPermission(
    permissions ?? [],
    "QUANLYNGHIPHEP"
  );

  const tableColumns: TableProps<tableNP_DangKyNghiPhepDataType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "nhanSu_Id",
      render: (_: any, record: tableNP_DangKyNghiPhepDataType) => (
        <span onClick={() => handleShowDetailNS(record.idNhanSu ?? "")} style={{cursor: "pointer"}}>{record.hoVaTen}</span>
      ),
    },
    {
      title: "Loại phép",
      dataIndex: "loaiPhep_Id",
      render: (_: any, record: tableNP_DangKyNghiPhepDataType) => (
        <span>{record.tenLoaiPhep}</span>
      ),
    },
    {
      title: "Ngày nghỉ",
      dataIndex: "tuNgay",
      render: (_: any, record: tableNP_DangKyNghiPhepDataType) => (
        <span>
          {dayjs(record.tuNgay).format("DD/MM/YYYY") +
            " - " +
            dayjs(record.denNgay).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "lyDo",
      render: (_: any, record: tableNP_DangKyNghiPhepDataType) => (
        <span>{record.lyDo}</span>
      ),
    },
    {
      title: "Số ngày nghỉ",
      dataIndex: "soNgayNghi",
      render: (_: any, record: tableNP_DangKyNghiPhepDataType) => (
        <span>{record.soNgayNghi}</span>
      ),
    },
    {
      title: "Ngày xin nghỉ",
      dataIndex: "ngayDangKy",
      render: (_: any, record: tableNP_DangKyNghiPhepDataType) => (
        <span>{dayjs(record.ngayDangKy).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      title: "Ngày được duyệt",
      dataIndex: "ngayDuyet",
      render: (_: any, record: tableNP_DangKyNghiPhepDataType) => (
        <span>
          {record.ngayDuyet != null
            ? dayjs(record.ngayDuyet).format("DD/MM/YYYY")
            : ""}
        </span>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      render: (_: any, record: tableNP_DangKyNghiPhepDataType) => {
        const items: MenuProps["items"] = [
          ...(modulePermission.canNPDangKyNghiPhepView
            ? [
                {
                  label: "Chi tiết",
                  key: "1",
                  icon: <EyeOutlined />,
                  onClick: () => {
                    setCurrentDetailNP_DangKyNghiPhep(record);
                    setIsOpenDetail(true);
                  },
                },
              ]
            : []),
          ...(record.trangThai === TrangThaiNghiPhepConstant.TaoMoi &&
          modulePermission.canNPDangKyNghiPhepEdit
            ? [
                {
                  label: "Chỉnh sửa",
                  key: "2",
                  icon: <EditOutlined />,
                  onClick: () => {
                    handleShowModal(true, record);
                  },
                },
              ]
            : []),
          ...((record.trangThai === TrangThaiNghiPhepConstant.TaoMoi &&
            modulePermission.canNPDangKyNghiPhepCreate) ||
          (record.soNgayNghi > 1 &&
            record.trangThai === TrangThaiNghiPhepConstant.TruongBanDuyet &&
            modulePermission.canPHEDUYETNGHIPHEPphong)
            ? [
                {
                  label: "Trình đơn",
                  key: "5",
                  icon: <VerticalAlignTopOutlined />,
                  onClick: () => {
                    setOpenPopconfirmId(record.id ?? "");
                  },
                },
              ]
            : []),
          ...((modulePermission.canPHEDUYETNGHIPHEPphong &&
            record.trangThai === TrangThaiNghiPhepConstant.DaGuiTruongBan) ||
          (modulePermission.canPHEDUYETNGHIPHEPAll &&
            record.trangThai === TrangThaiNghiPhepConstant.GuiTongGiamDoc)
            ? [
                {
                  key: "3",
                  label: "Phê duyệt",
                  icon: <CheckCircleOutlined />,
                  onClick: () => {
                    setOpenPopconfirmPheDuyetId(record.id ?? "");
                  },
                },
              ]
            : []),
          {
            type: "divider",
          },
          ...((modulePermission.canTUCHOINGHIPHEPphong &&
            record.trangThai === TrangThaiNghiPhepConstant.DaGuiTruongBan) ||
          (modulePermission.canTUCHOINGHIPHEPAll &&
            record.trangThai === TrangThaiNghiPhepConstant.GuiTongGiamDoc)
            ? [
                {
                  key: "5",
                  danger: true,
                  onClick: () => {
                    handleShowFormHuy(record.id || "");
                  },
                  label: "Từ chối",
                  icon: <CheckCircleOutlined />,
                },
              ]
            : []),

          ...(modulePermission.canNPDangKyNghiPhepDelete &&
          record.trangThai === TrangThaiNghiPhepConstant.TaoMoi
            ? [
                {
                  label: "Xóa",
                  key: "4",
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => {
                    setOpenPopconfirmXoaId(record.id ?? "");
                  },
                },
              ]
            : []),
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
              key={"Trinh" + record.id}
              open={openPopconfirmId === record.id}
              title="Xác nhận trình đơn đăng ký nghỉ phép"
              description="Bạn có muốn trình đơn đăng ký nghỉ phép này cho lãnh đạo không?"
              okText="Trình ngay"
              cancelText="Hủy"
              onConfirm={() => {
                handleTrinhNghiPhep(record.id || "", record.trangThai);
                setOpenPopconfirmId(null);
              }}
              onCancel={() => setOpenPopconfirmId(null)}
              trigger="click"
              forceRender
            />

            <Popconfirm
              key={"PheDuyet" + record.id}
              title="Xác nhận phê duyệt"
              description="Bạn có muốn phê duyệt đơn đăng ký nghỉ phép này không?"
              okText="Phê duyệt"
              cancelText="Hủy"
              open={openPopconfirmPheDuyetId === record.id}
              onConfirm={() => {
                handlePheDuyetNghiPhep(record.id || "", record.trangThai);
                setOpenPopconfirmPheDuyetId(null);
              }}
              onCancel={() => setOpenPopconfirmPheDuyetId(null)}
              trigger="click"
              forceRender
            />
            <Popconfirm
              key={"Delete" + record.id}
              title="Xác nhận xóa"
              description={
                <span>
                  Bạn có muốn xóa dữ liệu này không? <br /> Sau khi xóa sẽ không
                  thể khôi phục.
                </span>
              }
              open={openPopconfirmXoaId === record.id}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => {
                handleDeleteNP_DangKyNghiPhep(record.id || "");
                setOpenPopconfirmXoaId(null);
              }}
              onCancel={() => setOpenPopconfirmXoaId(null)}
              trigger="click"
              forceRender
            />
          </>
        );
      },
    },
  ];

  const [activeTab, setActiveTab] = useState(
    !modulePermission.canPHEDUYETNGHIPHEPphong
      ? modulePermission.canPHEDUYETNGHIPHEPAll
        ? "3"
        : "0"
      : "1"
  );

  const isTongGiamDoc = modulePermission.canPHEDUYETNGHIPHEPAll;
  const tabStates = isTongGiamDoc
    ? [
        TrangThaiNghiPhepConstant.GuiTongGiamDoc,
        TrangThaiNghiPhepConstant.TongGiamDocPheDuyet,
        TrangThaiNghiPhepConstant.TongGiamDocTuChoi,
      ]
    : [
        TrangThaiNghiPhepConstant.TaoMoi,
        TrangThaiNghiPhepConstant.DaGuiTruongBan,
        TrangThaiNghiPhepConstant.TruongBanDuyet,
        TrangThaiNghiPhepConstant.TruongBanTuChoi,
        TrangThaiNghiPhepConstant.GuiTongGiamDoc,
        TrangThaiNghiPhepConstant.TongGiamDocPheDuyet,
        TrangThaiNghiPhepConstant.TongGiamDocTuChoi,
      ];

  const tabKeys = tabStates.map((st) => st.toString());
  const createTabMap = <T,>(defaultValue: T): Record<string, T> =>
    tabKeys.reduce((acc, key) => {
      acc[key] = defaultValue;
      return acc;
    }, {} as Record<string, T>);

  const [dataByTab, setDataByTab] = useState<Record<string, any[]>>(
    createTabMap([])
  );

  const [loadingByTab, setLoadingByTab] = useState<Record<string, boolean>>(
    createTabMap(false)
  );

  const [totalByTab, setTotalByTab] = useState<Record<string, number>>(
    createTabMap(0)
  );

  const [paginationStates, setPaginationStates] = useState<
    Record<string, { pageIndex: number; pageSize: number }>
  >(
    createTabMap({
      pageIndex: 1,
      pageSize: 20,
    })
  );

  const handleShowDetailNS = async (id: string) => {
    setIsOpenDetailNS(true);
    setCurrentIdDetail(id);
  }

  const handleCloseDetailNS = async () => {
    setIsOpenDetailNS(false);
    setCurrentIdDetail("");
  }

  const handleTrinhNghiPhep = async (id: string, trangThai: number) => {
    try {
      const response = await nP_DangKyNghiPhepService.Trinh(id);
      if (response.status) {
        toast.success("Trình đơn xin nghỉ phép thành công");
        setActiveTab(trangThai.toString());
        handleGetList();
        handleGetThongKe();
      } else {
        toast.error(response.message || "Trình đơn xin nghỉ phép thất bại");
      }
    } catch (error) {
      toast.error("Phê duyệt đơn xin nghỉ phép thất bại");
    }
  };

  const handlePheDuyetNghiPhep = async (id: string, trangThai: number) => {
    try {
      const response = await nP_DangKyNghiPhepService.PheDuyet(id);
      if (response.status) {
        toast.success("Phê duyệt đơn xin nghỉ phép thành công");
        setActiveTab(trangThai.toString());
        handleGetList();
        handleGetThongKe();
      } else {
        toast.error(response.message || "Phê duyệt đơn xin nghỉ phép thất bại");
      }
    } catch (error) {
      toast.error("Phê duyệt đơn xin nghỉ phép thất bại");
    }
  };

  const handleShowFormHuy = async (id: string) => {
    setCurrentId(id);
    setIsOpenTuChoi(true);
  };

  const handleShowFormHuySuccess = (trangThai: number) => {
    setActiveTab(trangThai.toString());
    handleGetList();
    setCurrentId("");
    setIsOpenTuChoi(false);
    handleGetThongKe();
  };

  const hanleCreateEditSuccess = () => {
    setActiveTab("0");
    handleGetList();
    setIsOpenModal(false);
    setCurrentNP_DangKyNghiPhep(undefined);
  };

  const handleDeleteNP_DangKyNghiPhep = async (id: string) => {
    try {
      const response = await nP_DangKyNghiPhepService.Delete(id);
      if (response.status) {
        toast.success("Xóa đơn xin nghỉ phép thành công");
        setActiveTab("0");
        handleGetList();
      } else {
        toast.error("Xóa đơn xin nghỉ phép thất bại");
      }
    } catch (error) {
      toast.error("Xóa đơn xin nghỉ phép thất bại");
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<searchNP_DangKyNghiPhepDataType>["onFinish"] =
    async (values) => {
      try {
        setSearchValues(values);
        await handleGetList(values);
      } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
      }
    };

  const handleGetList = async (
    searchDataOverride?: searchNP_DangKyNghiPhepDataType
  ) => {
    const tabKey = parseInt(activeTab, 10);
    setLoadingByTab((prev) => ({ ...prev, [tabKey]: true }));
    try {
      const { pageIndex, pageSize } = paginationStates[activeTab];
      const searchData: searchNP_DangKyNghiPhepDataType = {
        pageIndex,
        pageSize,
        ...(searchValues || {}),
        ...(searchDataOverride || {}),
        trangThaiFilter: tabKey,
      };

      const response = await nP_DangKyNghiPhepService.getDataByPage(searchData);

      if (response != null && response.data != null) {
        const data = response.data;
        const items = data.items;

        setDataByTab((prev) => ({
          ...prev,
          [tabKey]: items || [],
        }));

        setTotalByTab((prev) => ({
          ...prev,
          [tabKey]: data.totalCount || 0,
        }));
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đăng ký nghỉ phép:", error);
    } finally {
      setLoadingByTab((prev) => ({ ...prev, [tabKey]: false }));
    }
  };

  const handleShowModal = (
    isEdit?: boolean,
    NP_DangKyNghiPhep?: tableNP_DangKyNghiPhepDataType
  ) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentNP_DangKyNghiPhep(NP_DangKyNghiPhep);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentNP_DangKyNghiPhep(undefined);
  };

  const handleCloseTuChoi = () => {
    setCurrentId("");
    setIsOpenTuChoi(false);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  const handleGetThongKe = async () => {
    try {
      const res = await nP_DangKyNghiPhepService.GetThongKe();
      const thongTinNghiPhep: ThongKeNghiPhepResponse = res.data;
      if (thongTinNghiPhep) {
        const newData: ThongKeNghiPhepResponse = res.data;
        if (JSON.stringify(newData) !== JSON.stringify(thongKe)) {
          setThongKe(newData);
        }
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi lấy thông tin thống kê");
    }
  };

  const handleGetDanhSach = useCallback(async () => {
    try {
      const res = await nP_LoaiNghiPhepService.GetDanhSach();
      setDanhSachLoaiNghiPhep(res.data);
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    }
  }, []);

  const handleGetSoNgayPhep = async () => {
    try {
      const res = await nP_DangKyNghiPhepService.GetSoNgayPhep();
      setThongTinNghiPhep(res.data);
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    handleGetDanhSach();
  }, [handleGetDanhSach]);

  useEffect(() => {
    if(!modulePermission.canTUCHOINGHIPHEPAll) handleGetSoNgayPhep();
  }, []);

  useEffect(() => {
    const tabKey = activeTab.toString();
    const pagination = paginationStates[tabKey];

    const trangThai = parseInt(activeTab, 10);

    const searchData: searchNP_DangKyNghiPhepDataType = {
      pageIndex: pagination ? pagination.pageIndex : 1,
      pageSize: pagination ? pagination.pageSize : 20,
      trangThaiFilter: trangThai,
    };

    handleGetList(searchData);
    handleGetThongKe();
  }, [activeTab, paginationStates]);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"
      >
        <AutoBreadcrumb />
        <div className="btn-group">
          {modulePermission.canNPDangKyNghiPhepView && (
            <Button
              onClick={() => toggleSearch()}
              type="primary"
              size="small"
              icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
            >
              {isPanelVisible ? "Ẩn tìm kiếm" : "Tìm kiếm"}
            </Button>
          )}

          {modulePermission.canNPDangKyNghiPhepconfigupload && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<UploadOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                Upload mẫu đơn
              </Button>

              <UploadModal
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
              />
            </>
          )}

          {(modulePermission.canTUCHOINGHIPHEPphong ||
            modulePermission.canTUCHOINGHIPHEPAll) && (
            <>
              <TuChoi
                id={currentId}
                trangThai={parseInt(activeTab, 10)}
                isOpen={isOpenTuChoi}
                onSuccess={handleShowFormHuySuccess}
                onClose={handleCloseTuChoi}
              />
            </>
          )}

          {modulePermission.canNPDangKyNghiPhepCreate && (
            <>
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
                listLoaiNghiPhep={danhSachLoaiNghiPhep}
                onSuccess={hanleCreateEditSuccess}
                onClose={handleClose}
                NP_DangKyNghiPhep={currentNP_DangKyNghiPhep}
              />
            </>
          )}
        </div>
      </Flex>

      {modulePermission.canNPDangKyNghiPhepView && (
        <>
          <DetailNhanSuDrawer 
            isOpen={isOpenDetailNS ?? false}
            id={currentIdDetail}
            onClose={handleCloseDetailNS}
          />
          {isPanelVisible && <Search onFinish={onFinishSearch} />}
          <NP_DangKyNghiPhepDetail
            nP_DangKyNghiPhep={currentDetailNP_DangKyNghiPhep}
            isOpen={isOpenDetail}
            onClose={handleCloseDetail}
          />

          <Card style={{ padding: "0px" }}>
            {!modulePermission.canTUCHOINGHIPHEPAll ? (
              <LeaveDashboard {...(thongTinNghiPhep ?? {})} />
            ) : (
              <></>
            )}

            <Tabs
              type="card"
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key.toString())}
              items={tabStates.map((trangThai) => {
                const tabKey = trangThai.toString();
                const thongKeKeyMap: Record<
                  number,
                  keyof ThongKeNghiPhepResponse
                > = {
                  [TrangThaiNghiPhepConstant.TaoMoi]: "taoMoi",
                  [TrangThaiNghiPhepConstant.DaGuiTruongBan]: "daGuiTruongBan",
                  [TrangThaiNghiPhepConstant.TruongBanDuyet]:
                    "truongBanPheDuyet",
                  [TrangThaiNghiPhepConstant.TruongBanTuChoi]:
                    "truongBanTuChoi",
                  [TrangThaiNghiPhepConstant.GuiTongGiamDoc]: "guiTongGiamDoc",
                  [TrangThaiNghiPhepConstant.TongGiamDocPheDuyet]:
                    "tongGiamDocPheDuyet",
                  [TrangThaiNghiPhepConstant.TongGiamDocTuChoi]:
                    "tongGiamDocTuChoi",
                };
                const thongKeValue =
                  thongKe && thongKeKeyMap[trangThai]
                    ? thongKe[thongKeKeyMap[trangThai]] ?? 0
                    : 0;

                // Tùy chỉnh màu cho từng trạng thái
                const statusColors: Record<number, string> = {
                  [TrangThaiNghiPhepConstant.TaoMoi]: "#1890ff",
                  [TrangThaiNghiPhepConstant.DaGuiTruongBan]: "#faad14",
                  [TrangThaiNghiPhepConstant.TruongBanDuyet]: "#52c41a",
                  [TrangThaiNghiPhepConstant.TruongBanTuChoi]: "#f5222d",
                  [TrangThaiNghiPhepConstant.GuiTongGiamDoc]: "#13c2c2",
                  [TrangThaiNghiPhepConstant.TongGiamDocPheDuyet]: "#722ed1",
                  [TrangThaiNghiPhepConstant.TongGiamDocTuChoi]: "#eb2f96",
                };

                return {
                  key: tabKey,
                  label: (
                    <span>
                      {!modulePermission.canPHEDUYETNGHIPHEPAll
                        ? modulePermission.canPHEDUYETNGHIPHEPphong
                          ? TrangThaiNghiPhepTBConstant.getDisplayName(
                              trangThai
                            )
                          : TrangThaiNghiPhepConstant.getDisplayName(trangThai)
                        : TrangThaiNghiPhepTGDConstant.getDisplayName(
                            trangThai
                          )}
                      <span
                        style={{
                          marginLeft: 8,
                          color: statusColors[trangThai] || "#333",
                          fontWeight: 600,
                        }}
                      >
                        {thongKeValue}
                      </span>
                    </span>
                  ),
                  children: (
                    <TableStatus
                      key={tabKey}
                      rowKey="id"
                      columns={tableColumns}
                      dataSource={dataByTab[tabKey] || []}
                      loading={loadingByTab[tabKey]}
                      total={totalByTab[tabKey]}
                      pageIndex={paginationStates[tabKey].pageIndex}
                      pageSize={paginationStates[tabKey].pageSize}
                      onPageChange={(page) =>
                        setPaginationStates((prev) => ({
                          ...prev,
                          [tabKey]: { ...prev[tabKey], pageIndex: page },
                        }))
                      }
                      onPageSizeChange={(current, size) =>
                        setPaginationStates((prev) => ({
                          ...prev,
                          [tabKey]: { pageIndex: current, pageSize: size },
                        }))
                      }
                    />
                  ),
                };
              })}
            />
          </Card>
        </>
      )}
    </>
  );
};

export default withAuthorization(NP_DangKyNghiPhep, "NP_DangKyNghiPhep_index");
