"use client";
import React from "react";
import {
  Row,
  Col,
  Card,
  Descriptions,
  Button,
  Drawer,
  Table,
  Modal,
  Dropdown,
  Menu,
  Tabs,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import {
  EditOutlined,
  DownOutlined,
  UploadOutlined,
  SaveOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  ProjectOutlined,
  BugOutlined,
  HistoryOutlined,
  HomeOutlined,
  FolderOutlined,
  TeamOutlined,
  BulbOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { DA_DuAnType } from "@/types/dA_DuAn/dA_DuAn.d";
import dA_KeHoachThucHienService from "@/services/dA_KeHoachThucHien/dA_KeHoachThucHienService";
import KeHoachTrienKhaiCustomTable from "./KeHoachTrienKhai";
import { useRouter } from "next/navigation";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import CustomBreadcrumb from "@/components/util-compenents/CustomBreadcrumb";
import DetailKeHoachTrienKhai from "./DetailKeHoachTrienKhai";
import CommonUpload from "@/components/shared-components/CommonUpload";
import { toast } from "react-toastify";
import TaiLieuDinhKemService from "@/services/taiLieuDinhKem/taiLieuDinhKem.service";
import FileTypeConstant from "@/constants/FileTypeConstant";
import UploadedFilesModal from "@/components/shared-components/UploadedFilesModal";
import { TaiLieuDinhKem } from "@/types/taiLieuDinhKem/taiLieuDinhKem";
import PhanCongTable from "./PhanCongTable";
import { DropdownOption } from "@/types/general";
import { userService } from "@/services/user/user.service";
import { roleService } from "@/services/role/role.service";
import dA_DuAnService from "@/services/dA_DuAn/dA_DuAnService";
import dA_PhanCongService from "@/services/dA_DuAn/dA_PhanCongService";
import { DA_PhanCongCreateOrUpdateType } from "@/types/dA_DuAn/dA_PhanCong";
import { duLieuDanhMucService } from "@/services/duLieuDanhMuc/duLieuDanhMuc.service";
import { LoadingWrapper } from "@/components/shared-components/Loading";
import useLoading from "@/hooks/useLoading";
import DA_NoiDungCuocHopPage from "../dA_NoiDungCuocHop/DA_NoiDungCuocHopPage";
import { DA_KeHoachThucHienCreateOrUpdateType } from "@/types/dA_DuAn/dA_KeHoachThucHien";
import NhatKyTrienKhai from "./NhatKyTrienKhaiComponent/NhatKyTrienKhai";
import TestCaseContent from "./TestCase/TestCaseContent";

import GenerateUserCase from "./GenerateUserCase";
import TacNhanList from "./TacNhanList";
import { useRolePermissions } from "@/hooks/useRolePermissions";
interface Props {
  item: DA_DuAnType;
  itemId: string | null;
  onClose?: () => void;
  onRefresh?: () => void; // Callback để refresh dữ liệu từ component cha
}

const formatDate = (date: any) =>
  date ? dayjs(date).format("DD/MM/YYYY") : "";

// Function để lấy màu sắc theo trạng thái
const getStatusColor = (status?: number | null) => {
  switch (status) {
    case 0: // Chờ triển khai
      return {
        background: "#fff7e6",
        color: "#fa8c16",
        border: "#ffd591",
      };
    case 1: // Đang thực hiện
      return {
        background: "#e6f7ff",
        color: "#1890ff",
        border: "#91d5ff",
      };
    case 2: // Tạm dừng
      return {
        background: "#fff1f0",
        color: "#ff4d4f",
        border: "#ffccc7",
      };
    case 3: // Hoàn thành
      return {
        background: "#f6ffed",
        color: "#52c41a",
        border: "#b7eb8f",
      };
    default: // Mặc định (null, undefined hoặc giá trị khác)
      return {
        background: "#fafafa",
        color: "#666",
        border: "#d9d9d9",
      };
  }
};

// Function để chuyển đổi số status thành text
const getStatusText = (status?: number | null) => {
  switch (status) {
    case 0:
      return "Chờ triển khai";
    case 1:
      return "Đang thực hiện";
    case 2:
      return "Tạm dừng";
    case 3:
      return "Hoàn thành";
    default:
      return "Không xác định";
  }
};

const DA_DuAnDetailView: React.FC<Props> = ({ item, onRefresh }) => {
  const router = useRouter();
  const [isKeHoachNoiBoMode, setIsKeHoachNoiBoMode] = React.useState(true); // true: nội bộ, false: khách hàng
  // Sử dụng useLoading hook thay vì các state loading riêng lẻ
  const { isLoading, withLoading } = useLoading();
  const [currentItemKeHoach, setCurrentItemKeHoach] = React.useState<
    DA_KeHoachThucHienCreateOrUpdateType[] | null
  >(null);
  const [refreshKeHoachData, setRefreshKeHoachData] = React.useState<number>(0); // Counter to trigger data refresh

  // State để kiểm soát việc hiển thị component chỉnh sửa
  const [showEditNoiBo, setShowEditNoiBo] = React.useState<boolean>(false);
  const [showEditKhachHang, setShowEditKhachHang] =
    React.useState<boolean>(false);

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDetailKeHoachModalOpen, SetDetailKeHoachModalOpen] =
    React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = React.useState(false);
  const [isUploadedFilesModalOpen, setIsUploadedFilesModalOpen] =
    React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<TaiLieuDinhKem[]>(
    []
  );
  const [currentFileType, setCurrentFileType] = React.useState<string>(
    FileTypeConstant.DA_KeHoachNoiBo
  );
  const [hasFiles, setHasFiles] = React.useState<{ [key: string]: boolean }>(
    {}
  );
  // State để track dữ liệu kế hoạch từ API
  const [hasKeHoachData, setHasKeHoachData] = React.useState<{
    noiBo: boolean;
    khachHang: boolean;
  }>({
    noiBo: false,
    khachHang: false,
  });
  const [isPhanCongModalOpen, setIsPhanCongModalOpen] = React.useState(false);
  const [userOptions, setUserOptions] = React.useState<DropdownOption[]>([]);
  const [roleOptions, setRoleOptions] = React.useState<DropdownOption[]>([]);
  const [phanCongList, setPhanCongList] = React.useState<
    DA_PhanCongCreateOrUpdateType[]
  >([]);
  const permissions = useRolePermissions();
  // State riêng cho hiển thị danh sách phân công trên chi tiết dự án
  const [phanCongDisplayList, setPhanCongDisplayList] = React.useState<any[]>(
    []
  );
  const [isEditKHKHModalOpen, setIsEditKHKHModalOpen] = React.useState(false);
  const [isDetailKeHoachKHModalOpen, SetDetailKeHoachKHModalOpen] =
    React.useState(false);
  const [currentKeHoachType, setCurrentKeHoachType] =
    React.useState<boolean>(true); // true: nội bộ, false: khách hàng
  const [activeTab, setActiveTab] = React.useState<string>("thong-tin-chung");

  // Function đóng modal phân công
  const handleClosePhanCongModal = () => {
    setIsPhanCongModalOpen(false);
    // Reset lại state để đảm bảo dữ liệu fresh khi mở lại
    setPhanCongList([]);
    setUserOptions([]);
    setRoleOptions([]);
  };

  // Function mở modal phân công
  const handleOpenPhanCongModal = async () => {
    if (!permissions.canCreatePhanCongDuAn) {
      toast.error("Bạn không có quyền tạo phân công dự án!");
      return;
    }
    setIsPhanCongModalOpen(true);
    // Reset data trước khi load mới
    setPhanCongList([]);

    await withLoading("modal", async () => {
      // Load data mới khi mở modal
      const [userRes, roleRes, phanCongRes] = await Promise.all([
        userService.getDropdown(),
        duLieuDanhMucService.GetDropdownByGroupCode("VTDA"),
        dA_PhanCongService.GetListByDuAnId(item.id, []),
      ]);

      if (userRes?.status && userRes.data) {
        setUserOptions(userRes.data);
      }
      if (roleRes?.status && roleRes.data) {
        setRoleOptions(roleRes.data);
      }
      if (phanCongRes?.status && phanCongRes.data) {
        const convertedList: DA_PhanCongCreateOrUpdateType[] =
          phanCongRes.data.map((pc: any) => ({
            userId: pc.UserId || pc.userId || "",
            vaiTroId: pc.VaiTroId || pc.vaiTroId || "",
            tenVaiTro: pc.TenVaiTro || pc.tenVaiTro || "",
            tenNguoiDung: pc.TenNguoiDung || pc.tenNguoiDung || "",
            ghiChu: pc.GhiChu || pc.ghiChu || "",
          }));
        setPhanCongList(convertedList);
      }
    }).catch((error) => {
      console.error("Error loading data for modal:", error);
      toast.error("Có lỗi khi tải dữ liệu!");
    });
  };

  // Function load danh sách phân công hiển thị trên chi tiết dự án
  const loadPhanCongDisplayList = async () => {
    if (!item?.id) return;

    await withLoading("phanCong", async () => {
      const response = await dA_PhanCongService.GetListByDuAnIdDto(item.id, []);
      if (response?.status && response.data) {
        setPhanCongDisplayList(response.data);
      } else {
        setPhanCongDisplayList([]);
      }
    }).catch((error) => {
      console.error("Error loading phân công display list:", error);
      setPhanCongDisplayList([]);
    });
  };

  // Function load trạng thái dữ liệu kế hoạch cho cả nội bộ và khách hàng
  const loadKeHoachDataStatus = async () => {
    if (!item?.id) return;

    try {
      // Load dữ liệu kế hoạch nội bộ
      const resNoiBo = await dA_KeHoachThucHienService.getFormByDuAn(
        item.id,
        true
      );
      const listNoiBo = Array.isArray(resNoiBo.data?.keHoachThucHienList)
        ? resNoiBo.data.keHoachThucHienList
        : [];

      // Load dữ liệu kế hoạch khách hàng
      const resKhachHang = await dA_KeHoachThucHienService.getFormByDuAn(
        item.id,
        false
      );
      const listKhachHang = Array.isArray(
        resKhachHang.data?.keHoachThucHienList
      )
        ? resKhachHang.data.keHoachThucHienList
        : [];

      // Cập nhật state
      setHasKeHoachData({
        noiBo: listNoiBo && listNoiBo.length > 0,
        khachHang: listKhachHang && listKhachHang.length > 0,
      });

      console.log("Loaded kế hoạch data status:", {
        noiBo: listNoiBo && listNoiBo.length > 0,
        khachHang: listKhachHang && listKhachHang.length > 0,
      });
    } catch (error) {
      console.error("Error loading kế hoạch data status:", error);
      setHasKeHoachData({
        noiBo: false,
        khachHang: false,
      });
    }
  };

  React.useEffect(() => {
    // Gọi API lấy chi tiết kế hoạch nội bộ khi vào trang detail
    const fetchData = async () => {
      if (item?.id) {
        await withLoading("keHoach", async () => {
          const res = await dA_KeHoachThucHienService.getFormByDuAn(
            item.id,
            isKeHoachNoiBoMode
          );
          const list = Array.isArray(res.data?.keHoachThucHienList)
            ? res.data.keHoachThucHienList
            : [];
          setCurrentItemKeHoach(list);

          // Cập nhật state hasKeHoachData dựa trên dữ liệu trả về
          const hasData = list && list.length > 0;
          setHasKeHoachData((prev) => ({
            ...prev,
            [isKeHoachNoiBoMode ? "noiBo" : "khachHang"]: hasData,
          }));
        }).catch((error) => {
          console.error("Error loading kế hoạch:", error);
          setCurrentItemKeHoach([]);
          // Cập nhật state khi có lỗi
          setHasKeHoachData((prev) => ({
            ...prev,
            [isKeHoachNoiBoMode ? "noiBo" : "khachHang"]: false,
          }));
        });
      }
    };
    fetchData();

    // Load trạng thái dữ liệu kế hoạch cho cả nội bộ và khách hàng khi component khởi tạo
    loadKeHoachDataStatus();

    // Load danh sách phân công hiển thị khi component khởi tạo
    loadPhanCongDisplayList();
  }, [item?.id, isKeHoachNoiBoMode]);

  const checkHasFiles = React.useCallback(
    async (itemId: string, fileType: string): Promise<boolean> => {
      try {
        const res = await TaiLieuDinhKemService.getByItemIdAndLoaiTaiLieu(
          itemId,
          fileType
        );
        return !!(
          res?.status &&
          Array.isArray(res.data) &&
          res.data.length > 0
        );
      } catch (error) {
        console.error("Error checking files:", error);
        return false;
      }
    },
    []
  );

  React.useEffect(() => {
    if (!item.id) return;

    const loadFileStatus = async () => {
      await withLoading("files", async () => {
        const status = {
          [FileTypeConstant.DA_PhieuKhaoSat]: await checkHasFiles(
            item.id,
            FileTypeConstant.DA_PhieuKhaoSat
          ),
          [FileTypeConstant.DA_NoiDungKhaoSat]: await checkHasFiles(
            item.id,
            FileTypeConstant.DA_NoiDungKhaoSat
          ),
          [FileTypeConstant.DA_KeHoachNoiBo]: await checkHasFiles(
            item.id,
            FileTypeConstant.DA_KeHoachNoiBo
          ),
          [FileTypeConstant.DA_CheckListNghiemThu]: await checkHasFiles(
            item.id,
            FileTypeConstant.DA_CheckListNghiemThu
          ),
          [FileTypeConstant.DA_HoSoNghiemThuKyThuat]: await checkHasFiles(
            item.id,
            FileTypeConstant.DA_HoSoNghiemThuKyThuat
          ),
          [FileTypeConstant.DA_TaiLieuDuAn]: await checkHasFiles(
            item.id,
            FileTypeConstant.DA_TaiLieuDuAn
          ),
        };
        setHasFiles(status);
      }).catch((error) => {
        console.error("Error loading file status:", error);
      });
    };

    loadFileStatus();
  }, [item.id, checkHasFiles]);

  // Menu thao tác riêng cho từng loại file
  const menuKhaoSat = (
    <Menu>
      <Menu.Item
        key="upload"
        icon={<UploadOutlined />}
        onClick={() => {
          setCurrentFileType(FileTypeConstant.DA_PhieuKhaoSat);
          setIsUploadModalOpen(true);
        }}
      >
        Tải lên
      </Menu.Item>
      <Menu.Item
        key="view"
        disabled={!hasFiles[FileTypeConstant.DA_PhieuKhaoSat]}
        icon={<ExclamationCircleOutlined />}
        onClick={() => setIsUploadedFilesModalOpen(true)}
      >
        Xem
      </Menu.Item>
    </Menu>
  );
  const menuNoiDungKhaoSat = (
    <Menu>
      {permissions.canUploadTaiLieuDuAn && (
        <Menu.Item
          key="upload"
          icon={<UploadOutlined />}
          onClick={() => {
            setCurrentFileType(FileTypeConstant.DA_NoiDungKhaoSat);
            setIsUploadModalOpen(true);
          }}
        >
          Tải lên
        </Menu.Item>
      )}
      {permissions.canViewTaiLieuDuAn && (
        <Menu.Item
          key="view"
          disabled={!hasFiles[FileTypeConstant.DA_NoiDungKhaoSat]}
          icon={<ExclamationCircleOutlined />}
          onClick={() => setIsUploadedFilesModalOpen(true)}
        >
          Xem
        </Menu.Item>
      )}
      {permissions.canDeleteTaiLieuDuAn && (
        <Menu.Item key="delete" danger>
          Xóa
        </Menu.Item>
      )}
    </Menu>
  );
  const createKeHoachTrienKhaiMenu = (isNoiBo: boolean) => (
    <Menu>
      <Menu.Item
        key="upload"
        icon={<UploadOutlined />}
        onClick={() => {
          setCurrentFileType(
            isNoiBo
              ? FileTypeConstant.DA_KeHoachNoiBo
              : FileTypeConstant.DA_KeHoachTrienKhai
          );
          setIsUploadModalOpen(true);
        }}
      >
        Tải lên
      </Menu.Item>
      {permissions.canEditKeHoachTrienKhaiKH && (
        <Menu.Item
          key="edit"
          onClick={() => {
            setIsKeHoachNoiBoMode(isNoiBo); // Đánh dấu là kế hoạch nội bộ (true) hoặc khách hàng (false)

            // Activate edit mode in the appropriate tab instead of opening a modal
            if (isNoiBo) {
              setShowEditNoiBo(true);
              // Switch to the nội bộ tab if not already there
              if (activeTab !== "ke-hoach-trien-khai-noi-bo") {
                setActiveTab("ke-hoach-trien-khai-noi-bo");
              }
            } else {
              setShowEditKhachHang(true);
              // Switch to the khách hàng tab if not already there
              if (activeTab !== "ke-hoach-trien-khai-khach-hang") {
                setActiveTab("ke-hoach-trien-khai-khach-hang");
              }
            }
          }}
          icon={<EditOutlined />}
        >
          Cập nhật
        </Menu.Item>
      )}
      {permissions.canViewKeHoachTrienKhaiKH && (
        <Menu.Item
          key="view"
          icon={<ExclamationCircleOutlined />}
          onClick={() => {
            setIsKeHoachNoiBoMode(isNoiBo); // Đánh dấu là kế hoạch nội bộ (true) hoặc khách hàng (false)

            // Switch to the appropriate tab instead of opening a drawer
            if (isNoiBo) {
              // Switch to the nội bộ tab
              setActiveTab("ke-hoach-trien-khai-noi-bo");
              // Ensure we're in view mode
              setShowEditNoiBo(false);
            } else {
              // Switch to the khách hàng tab
              setActiveTab("ke-hoach-trien-khai-khach-hang");
              // Ensure we're in view mode
              setShowEditKhachHang(false);
            }
          }}
        >
          Xem kế hoạch
        </Menu.Item>
      )}

      <Menu.Divider />
      {permissions.canDeleteKeHoachTrienKhaiKH && (
        <Menu.Item
          key="Delete"
          onClick={() => deleteKeHoachTrienKhai(item?.id, isNoiBo)}
          icon={<DeleteOutlined />}
          danger
        >
          Xoá
        </Menu.Item>
      )}
    </Menu>
  );

  // Tạo các menu với hàm tạo menu
  const menuKeHoachTrienKhaiKH = createKeHoachTrienKhaiMenu(false);
  const menuKeHoachTrienKhaiNoiBo = createKeHoachTrienKhaiMenu(true);
  const menuTestCase = (
    <Menu>
      <Menu.Item key="upload">Tải lên</Menu.Item>
      <Menu.Item key="view">Xem</Menu.Item>
    </Menu>
  );
  const menuChecklist = (
    <Menu>
      {permissions.canUploadTaiLieuDuAn && (
        <Menu.Item
          key="upload"
          icon={<UploadOutlined />}
          onClick={() => {
            setCurrentFileType(FileTypeConstant.DA_CheckListNghiemThu);
            setIsUploadModalOpen(true);
          }}
        >
          Tải lên
        </Menu.Item>
      )}
      {permissions.canViewTaiLieuDuAn && (
        <Menu.Item
          key="view"
          disabled={!hasFiles[FileTypeConstant.DA_CheckListNghiemThu]}
          icon={<ExclamationCircleOutlined />}
          onClick={() => setIsUploadedFilesModalOpen(true)}
        >
          Xem
        </Menu.Item>
      )}
    </Menu>
  );
  const menuNghiemThu = (
    <Menu>
      <Menu.Item
        key="upload"
        icon={<UploadOutlined />}
        onClick={() => {
          setCurrentFileType(FileTypeConstant.DA_HoSoNghiemThuKyThuat);
          setIsUploadModalOpen(true);
        }}
      >
        Tải lên
      </Menu.Item>
      <Menu.Item
        key="view"
        disabled={!hasFiles[FileTypeConstant.DA_HoSoNghiemThuKyThuat]}
        icon={<ExclamationCircleOutlined />}
        onClick={() => setIsUploadedFilesModalOpen(true)}
      >
        Xem
      </Menu.Item>
    </Menu>
  );
  const menuTaiLieuDuAn = (
    <Menu>
      <Menu.Item
        key="upload"
        icon={<UploadOutlined />}
        onClick={() => {
          setCurrentFileType(FileTypeConstant.DA_TaiLieuDuAn);
          setIsUploadModalOpen(true);
        }}
      >
        Tải lên
      </Menu.Item>
      <Menu.Item
        key="view"
        disabled={!hasFiles[FileTypeConstant.DA_TaiLieuDuAn]}
        icon={<ExclamationCircleOutlined />}
        onClick={() => {
          setCurrentFileType(FileTypeConstant.DA_TaiLieuDuAn);
          setIsUploadedFilesModalOpen(true);
        }}
      >
        Xem
      </Menu.Item>
    </Menu>
  );

  const deleteKeHoachTrienKhai = async (id: string, isNoiBo: boolean) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá kế hoạch này?",
      content: "Thao tác này không thể hoàn tác.",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          const res = await dA_KeHoachThucHienService.deleteByDuAnNew(
            id,
            isNoiBo
          );
          if (res.status) {
            toast.success("Xoá kế hoạch triển khai thành công!");
            // Refresh data after delete
            setRefreshKeHoachData((prev) => prev + 1); // Increment to trigger refresh
            await loadPhanCongDisplayList();
          } else {
            toast.error(res.message || "Xoá thất bại!");
          }
        } catch (err) {
          toast.error("Xoá thất bại!");
        }
      },
    });
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;
    setUploadingFile(true);
    try {
      // TODO: Gọi API upload file ở đây
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // await api.uploadFile(formData);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      // Hiển thị thông báo thành công nếu cần
    } catch (err) {
      // Hiển thị thông báo lỗi nếu cần
    } finally {
      setUploadingFile(false);
    }
  };

  const handleUpload = async (
    files: File[],
    extraData?: Record<string, any>
  ) => {
    if (!files || files.length === 0) return;
    setUploadingFile(true);
    try {
      // Gọi API upload với list file và extraData
      const response = await TaiLieuDinhKemService.uploadMulti(
        files,
        extraData ?? { LoaiTaiLieu: currentFileType, ItemId: item.id }
      );
      if (response.status) {
        toast.success("Tải lên thành công!");
        // Refresh file status
        if (item.id) {
          const newStatus = await checkHasFiles(item.id, currentFileType);
          setHasFiles((prev) => ({ ...prev, [currentFileType]: newStatus }));
        }
      } else {
        toast.error("Tải lên thất bại!");
      }
      setIsUploadModalOpen(false);
      setSelectedFile(null);
    } catch (err) {
      toast.error("Tải lên thất bại!");
    } finally {
      setUploadingFile(false);
    }
  };

  const fetchUploadedFiles = React.useCallback(async () => {
    if (!item.id) return;
    const res = await TaiLieuDinhKemService.getByItemIdAndLoaiTaiLieu(
      item.id,
      currentFileType
    );
    if (res?.status && Array.isArray(res.data)) {
      setUploadedFiles(res.data);
      // Cập nhật trạng thái hasFiles khi fetch files
      setHasFiles((prev) => ({
        ...prev,
        [currentFileType]: !!res.data.length,
      }));
    } else {
      setUploadedFiles([]);
      setHasFiles((prev) => ({ ...prev, [currentFileType]: false }));
    }
  }, [item.id, currentFileType]);

  React.useEffect(() => {
    if (isUploadedFilesModalOpen) {
      fetchUploadedFiles();
    }
  }, [isUploadedFilesModalOpen, fetchUploadedFiles]);

  const handleDeleteFile = async (fileId: string) => {
    try {
      await TaiLieuDinhKemService.delete(fileId);
      // Fetch lại danh sách file sau khi xóa
      const res = await TaiLieuDinhKemService.getByItemIdAndLoaiTaiLieu(
        item.id,
        currentFileType
      );
      // Cập nhật danh sách file hiển thị trong modal
      setUploadedFiles(res?.data || []);
      // Cập nhật trạng thái hasFiles dựa trên số lượng file còn lại
      setHasFiles((prev) => ({
        ...prev,
        [currentFileType]: !!res?.data?.length,
      }));
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Xóa file thất bại!");
    }
  };

  const getUploadModalTitle = () => {
    switch (currentFileType) {
      case FileTypeConstant.DA_PhieuKhaoSat:
        return "Tải lên file khảo sát";
      case FileTypeConstant.DA_NoiDungKhaoSat:
        return "Tải lên file nội dung khảo sát";
      case FileTypeConstant.DA_KeHoachNoiBo:
        return "Tải lên file kế hoạch triển khai nội bộ";
      case FileTypeConstant.DA_CheckListNghiemThu:
        return "Tải lên file checklist nghiệm thu";
      case FileTypeConstant.DA_HoSoNghiemThuKyThuat:
        return "Tải lên file nghiệm thu kỹ thuật";
      case FileTypeConstant.DA_TaiLieuDuAn:
        return "Tải lên file thông tin dự án";
      default:
        return "Tải lên file";
    }
  };

  // Handlers cho PhanCongTable
  const handleAddPhanCong = () => {
    setPhanCongList([
      ...phanCongList,
      {
        duAnId: item.id,
        userId: "",
        vaiTroId: null,
      },
    ]);
  };

  const handlePhanCongChange = (
    index: number,
    key: "userId" | "vaiTroId",
    value: string
  ) => {
    const newList = [...phanCongList];
    newList[index] = { ...newList[index], [key]: value };
    setPhanCongList(newList);
  };

  const handleDeletePhanCong = (index: number) => {
    const newList = phanCongList.filter((_, i) => i !== index);
    setPhanCongList(newList);
  };

  const handleSavePhanCong = async () => {
    try {
      // Tạo payload với type DA_PhanCongCreateOrUpdateType[]
      const payload: DA_PhanCongCreateOrUpdateType[] = phanCongList
        .filter((pc) => pc.userId) // Chỉ lấy những item có userId
        .map((pc) => ({
          duAnId: item.id,
          userId: pc.userId,
          vaiTroId: pc.vaiTroId || null,
        }));

      // Gọi API để lưu phân công với duAnId và list
      const response = await dA_PhanCongService.saveValidList(item.id, payload);

      if (response.status) {
        toast.success("Lưu phân công thành công!");
        handleClosePhanCongModal();

        // Load lại danh sách phân công hiển thị trên chi tiết dự án
        await loadPhanCongDisplayList();

        // Gọi callback để refresh dữ liệu từ component cha nếu có
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.error(response.message || "Lưu phân công thất bại!");
      }
    } catch (error) {
      console.error("Error saving phan cong:", error);
      toast.error("Có lỗi xảy ra khi lưu phân công!");
    }
  };

  // Define a function to trigger refresh
  const triggerRefresh = React.useCallback(() => {
    // Reload trạng thái dữ liệu kế hoạch
    loadKeHoachDataStatus();

    // Reset edit mode after saving
    setShowEditNoiBo(false);
    setShowEditKhachHang(false);
  }, []);

  // Cấu hình items cho tabs
  const tabItems = [
    {
      key: "thong-tin-chung",
      label: "Thông tin chung",
      icon: <InfoCircleOutlined />,
      children: (
        <div>
          <Card
            bordered={false}
            className="tab-content-card"
            title="Thông tin chung dự án"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "12px 24px",
            }}
            bodyStyle={{
              padding: "16px 24px",
            }}
          >
            <LoadingWrapper spinning={isLoading("info")} size="large">
              <Descriptions
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
                size="small"
                bordered={false}
                labelStyle={{ fontWeight: 500 }}
                contentStyle={{ alignItems: "center" }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <Descriptions.Item label="Tên dự án">
                  {item.tenDuAn}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {getStatusText(item.trangThaiThucHien)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian thực hiện">
                  {item.ngayBatDau && item.ngayKetThuc
                    ? `${formatDate(item.ngayBatDau)} - ${formatDate(
                        item.ngayKetThuc
                      )}`
                    : ""}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tiếp nhận">
                  {formatDate(item.ngayTiepNhan)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian cài đặt máy chủ">
                  {formatDate(item.timeCaiDatMayChu)}
                </Descriptions.Item>
                <Descriptions.Item label="Backup máy chủ">
                  {item.isBackupMayChu ? (
                    <span style={{ color: "#52c41a", fontWeight: 600 }}>
                      ✔️
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "#ff4d4f",
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        type="default"
                        style={{
                          marginRight: 6,
                          padding: "0 6px",
                          fontSize: 13,
                          height: 22,
                          borderColor: "#d9d9d9",
                          background: "#fff",
                          lineHeight: "20px",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        Chưa có
                      </Button>
                    </span>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Link demo">
                  {item.linkDemo}
                </Descriptions.Item>
                <Descriptions.Item label="Link thực tế">
                  {item.linkThucTe}
                </Descriptions.Item>
                <Descriptions.Item label="Yêu cầu dự án">
                  <span
                    style={{
                      minHeight: 24,
                      display: "inline-block",
                      maxWidth: 350,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    dangerouslySetInnerHTML={{ __html: item.yeuCauDuAn || "" }}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả dự án">
                  <span
                    style={{
                      minHeight: 24,
                      display: "inline-block",
                      maxWidth: 350,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    dangerouslySetInnerHTML={{ __html: item.moTaDuAn || "" }}
                  />
                </Descriptions.Item>
              </Descriptions>
            </LoadingWrapper>
          </Card>

          <Card
            bordered={false}
            className="tab-content-card"
            title="Tài liệu dự án"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "12px 24px",
            }}
            bodyStyle={{
              padding: "16px 24px",
            }}
            style={{ marginTop: 24 }}
          >
            <LoadingWrapper spinning={isLoading("files")} size="large">
              {permissions.canViewTaiLieuDuAn && (
                <Descriptions
                  column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
                  size="small"
                  bordered={false}
                  labelStyle={{ fontWeight: 500 }}
                  contentStyle={{ alignItems: "center" }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <Descriptions.Item label="File thông tin dự án">
                    {hasFiles[FileTypeConstant.DA_TaiLieuDuAn] ? (
                      <span
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <Button
                          size="small"
                          type="default"
                          icon={
                            <ExclamationCircleOutlined
                              style={{ color: "#52c41a", fontSize: 16 }}
                            />
                          }
                          style={{
                            width: 32,
                            height: 22,
                            padding: 0,
                            minWidth: 0,
                            background: "#f6ffed",
                            borderColor: "#b7eb8f",
                            color: "#52c41a",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 4,
                          }}
                          onClick={() => {
                            setCurrentFileType(FileTypeConstant.DA_TaiLieuDuAn);
                            setIsUploadedFilesModalOpen(true);
                          }}
                        />
                        <Dropdown overlay={menuTaiLieuDuAn} trigger={["click"]}>
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#ff4d4f",
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          type="default"
                          style={{
                            marginRight: 6,
                            padding: "0 6px",
                            fontSize: 13,
                            height: 22,
                            borderColor: "#ff4d4f",
                            color: "#ff4d4f",
                            background: "#fff0f0",
                            lineHeight: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            setCurrentFileType(FileTypeConstant.DA_TaiLieuDuAn);
                            setIsUploadModalOpen(true);
                          }}
                        >
                          Chưa có
                        </Button>
                        <Dropdown overlay={menuTaiLieuDuAn} trigger={["click"]}>
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              marginLeft: 4,
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Kế hoạch triển khai khách hàng">
                    {hasKeHoachData.khachHang ? (
                      <span
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <Button
                          size="small"
                          type="default"
                          icon={
                            <ExclamationCircleOutlined
                              style={{ color: "#52c41a", fontSize: 16 }}
                            />
                          }
                          style={{
                            width: 32,
                            height: 22,
                            padding: 0,
                            minWidth: 0,
                            background: "#f6ffed",
                            borderColor: "#b7eb8f",
                            color: "#52c41a",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 4,
                          }}
                          onClick={() => {
                            setActiveTab("ke-hoach-trien-khai-khach-hang");
                          }}
                        />
                        <span
                          style={{
                            color: "#52c41a",
                            fontWeight: 500,
                            marginRight: 6,
                          }}
                        >
                          Có
                        </span>
                        <Dropdown
                          overlay={menuKeHoachTrienKhaiKH}
                          trigger={["click"]}
                        >
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#ff4d4f",
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          type="default"
                          style={{
                            marginRight: 6,
                            padding: "0 6px",
                            fontSize: 13,
                            height: 22,
                            borderColor: "#ff4d4f",
                            color: "#ff4d4f",
                            background: "#fff0f0",
                            lineHeight: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            setActiveTab("ke-hoach-trien-khai-khach-hang");
                          }}
                        >
                          Chưa có
                        </Button>
                        <Dropdown
                          overlay={menuKeHoachTrienKhaiKH}
                          trigger={["click"]}
                        >
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              marginLeft: 4,
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Kế hoạch triển khai nội bộ">
                    {hasKeHoachData.noiBo ? (
                      <span
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <Button
                          size="small"
                          type="default"
                          icon={
                            <ExclamationCircleOutlined
                              style={{ color: "#52c41a", fontSize: 16 }}
                            />
                          }
                          style={{
                            width: 32,
                            height: 22,
                            padding: 0,
                            minWidth: 0,
                            background: "#f6ffed",
                            borderColor: "#b7eb8f",
                            color: "#52c41a",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 4,
                          }}
                          onClick={() => {
                            setActiveTab("ke-hoach-trien-khai-noi-bo");
                          }}
                        />
                        <span
                          style={{
                            color: "#52c41a",
                            fontWeight: 500,
                            marginRight: 6,
                          }}
                        >
                          Có
                        </span>
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#ff4d4f",
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          type="default"
                          style={{
                            marginRight: 6,
                            padding: "0 6px",
                            fontSize: 13,
                            height: 22,
                            borderColor: "#ff4d4f",
                            color: "#ff4d4f",
                            background: "#fff0f0",
                            lineHeight: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            setCurrentFileType(
                              FileTypeConstant.DA_KeHoachNoiBo
                            );
                            setIsUploadModalOpen(true);
                          }}
                        >
                          Chưa có
                        </Button>
                      </span>
                    )}
                    <Dropdown
                      overlay={menuKeHoachTrienKhaiNoiBo}
                      trigger={["click"]}
                    >
                      <Button
                        size="small"
                        style={{
                          height: 22,
                          fontSize: 13,
                          padding: "0 6px",
                          marginLeft: 4,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        Thao tác{" "}
                        <DownOutlined style={{ fontSize: 13, marginLeft: 4 }} />
                      </Button>
                    </Dropdown>
                  </Descriptions.Item>
                  <Descriptions.Item label="File câu hỏi khảo sát">
                    {hasFiles[FileTypeConstant.DA_PhieuKhaoSat] ? (
                      <span
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <Button
                          size="small"
                          type="default"
                          icon={
                            <ExclamationCircleOutlined
                              style={{ color: "#52c41a", fontSize: 16 }}
                            />
                          }
                          style={{
                            width: 32,
                            height: 22,
                            padding: 0,
                            minWidth: 0,
                            background: "#f6ffed",
                            borderColor: "#b7eb8f",
                            color: "#52c41a",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 4,
                          }}
                          onClick={() => {
                            setCurrentFileType(
                              FileTypeConstant.DA_PhieuKhaoSat
                            );
                            setIsUploadedFilesModalOpen(true);
                          }}
                        />
                        <Dropdown overlay={menuKhaoSat} trigger={["click"]}>
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#ff4d4f",
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          type="default"
                          style={{
                            marginRight: 6,
                            padding: "0 6px",
                            fontSize: 13,
                            height: 22,
                            borderColor: "#ff4d4f",
                            color: "#ff4d4f",
                            background: "#fff0f0",
                            lineHeight: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            console.log(
                              "Button Chưa có clicked - DA_PhieuKhaoSat"
                            );
                            setCurrentFileType(
                              FileTypeConstant.DA_PhieuKhaoSat
                            );
                            setIsUploadModalOpen(true);
                          }}
                        >
                          Chưa có
                        </Button>
                        <Dropdown overlay={menuKhaoSat} trigger={["click"]}>
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              marginLeft: 4,
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="File nội dung khảo sát">
                    {hasFiles[FileTypeConstant.DA_NoiDungKhaoSat] ? (
                      <span
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <Button
                          size="small"
                          type="default"
                          icon={
                            <ExclamationCircleOutlined
                              style={{ color: "#52c41a", fontSize: 16 }}
                            />
                          }
                          style={{
                            width: 32,
                            height: 22,
                            padding: 0,
                            minWidth: 0,
                            background: "#f6ffed",
                            borderColor: "#b7eb8f",
                            color: "#52c41a",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 4,
                          }}
                          onClick={() => {
                            setCurrentFileType(
                              FileTypeConstant.DA_NoiDungKhaoSat
                            );
                            setIsUploadedFilesModalOpen(true);
                          }}
                        />
                        <Dropdown
                          overlay={menuNoiDungKhaoSat}
                          trigger={["click"]}
                        >
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#ff4d4f",
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          type="default"
                          style={{
                            marginRight: 6,
                            padding: "0 6px",
                            fontSize: 13,
                            height: 22,
                            borderColor: "#ff4d4f",
                            color: "#ff4d4f",
                            background: "#fff0f0",
                            lineHeight: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            console.log(
                              "Button Chưa có clicked - DA_NoiDungKhaoSat"
                            );
                            setCurrentFileType(
                              FileTypeConstant.DA_NoiDungKhaoSat
                            );
                            setIsUploadModalOpen(true);
                          }}
                        >
                          Chưa có
                        </Button>
                        <Dropdown
                          overlay={menuNoiDungKhaoSat}
                          trigger={["click"]}
                        >
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              marginLeft: 4,
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="Test case">
                    {item.hasFileTestCase ? (
                      <Button
                        size="small"
                        type="default"
                        icon={
                          <ExclamationCircleOutlined
                            style={{ color: "#52c41a", fontSize: 16 }}
                          />
                        }
                        style={{
                          width: 32,
                          height: 22,
                          padding: 0,
                          minWidth: 0,
                          background: "#f6ffed",
                          borderColor: "#b7eb8f",
                          color: "#52c41a",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          color: "#ff4d4f",
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          type="default"
                          style={{
                            marginRight: 6,
                            padding: "0 6px",
                            fontSize: 13,
                            height: 22,
                            borderColor: "#ff4d4f",
                            color: "#ff4d4f",
                            background: "#fff0f0",
                            lineHeight: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            // Handle test case upload - có thể cần thêm file type cho test case
                            // setCurrentFileType(FileTypeConstant.DA_TestCase);
                            // setIsUploadModalOpen(true);
                          }}
                        >
                          Chưa có
                        </Button>
                        <Dropdown overlay={menuTestCase} trigger={["click"]}>
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              marginLeft: 4,
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Checklist nghiệm thu kỹ thuật">
                    {hasFiles[FileTypeConstant.DA_CheckListNghiemThu] ? (
                      <span
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <Button
                          size="small"
                          type="default"
                          icon={
                            <ExclamationCircleOutlined
                              style={{ color: "#52c41a", fontSize: 16 }}
                            />
                          }
                          style={{
                            width: 32,
                            height: 22,
                            padding: 0,
                            minWidth: 0,
                            background: "#f6ffed",
                            borderColor: "#b7eb8f",
                            color: "#52c41a",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 4,
                          }}
                          onClick={() => {
                            setCurrentFileType(
                              FileTypeConstant.DA_CheckListNghiemThu
                            );
                            setIsUploadedFilesModalOpen(true);
                          }}
                        />
                        <Dropdown overlay={menuChecklist} trigger={["click"]}>
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#ff4d4f",
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          type="default"
                          style={{
                            marginRight: 6,
                            padding: "0 6px",
                            fontSize: 13,
                            height: 22,
                            borderColor: "#ff4d4f",
                            color: "#ff4d4f",
                            background: "#fff0f0",
                            lineHeight: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            setCurrentFileType(
                              FileTypeConstant.DA_CheckListNghiemThu
                            );
                            setIsUploadModalOpen(true);
                          }}
                        >
                          Chưa có
                        </Button>
                        <Dropdown overlay={menuChecklist} trigger={["click"]}>
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              marginLeft: 4,
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="File nghiệm thu kỹ thuật">
                    {hasFiles[FileTypeConstant.DA_HoSoNghiemThuKyThuat] ? (
                      <span
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <Button
                          size="small"
                          type="default"
                          icon={
                            <ExclamationCircleOutlined
                              style={{ color: "#52c41a", fontSize: 16 }}
                            />
                          }
                          style={{
                            width: 32,
                            height: 22,
                            padding: 0,
                            minWidth: 0,
                            background: "#f6ffed",
                            borderColor: "#b7eb8f",
                            color: "#52c41a",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 4,
                          }}
                          onClick={() => {
                            setCurrentFileType(
                              FileTypeConstant.DA_HoSoNghiemThuKyThuat
                            );
                            setIsUploadedFilesModalOpen(true);
                          }}
                        />
                        <Dropdown overlay={menuNghiemThu} trigger={["click"]}>
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#ff4d4f",
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          type="default"
                          style={{
                            marginRight: 6,
                            padding: "0 6px",
                            fontSize: 13,
                            height: 22,
                            borderColor: "#ff4d4f",
                            color: "#ff4d4f",
                            background: "#fff0f0",
                            lineHeight: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            setCurrentFileType(
                              FileTypeConstant.DA_HoSoNghiemThuKyThuat
                            );
                            setIsUploadModalOpen(true);
                          }}
                        >
                          Chưa có
                        </Button>
                        <Dropdown overlay={menuNghiemThu} trigger={["click"]}>
                          <Button
                            size="small"
                            style={{
                              height: 22,
                              fontSize: 13,
                              padding: "0 6px",
                              marginLeft: 4,
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Thao tác{" "}
                            <DownOutlined
                              style={{ fontSize: 13, marginLeft: 4 }}
                            />
                          </Button>
                        </Dropdown>
                      </span>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </LoadingWrapper>
          </Card>

          <Card
            title="Thành viên dự án"
            bordered={false}
            className="tab-content-card"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "12px 24px",
            }}
            bodyStyle={{
              padding: "16px 24px",
            }}
            style={{ marginTop: 24 }}
            extra={
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleOpenPhanCongModal}
              >
                Phân công
              </Button>
            }
          >
            <LoadingWrapper spinning={isLoading("phanCong")} size="large">
              {phanCongDisplayList && phanCongDisplayList.length > 0 ? (
                <Table
                  style={{ marginTop: 24 }}
                  size="small"
                  bordered
                  pagination={false}
                  dataSource={phanCongDisplayList.map((pc, idx) => ({
                    ...pc,
                    key: idx,
                  }))}
                  columns={[
                    {
                      title: "STT",
                      dataIndex: "stt",
                      key: "stt",
                      width: 60,
                      render: (_: any, __: any, i: number) => i + 1,
                    },
                    {
                      title: "Thành viên",
                      dataIndex: "tenUser",
                      key: "tenUser",
                    },
                    {
                      title: "Vai trò",
                      dataIndex: "tenVaiTro",
                      key: "tenVaiTro",
                    },
                  ]}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "#999",
                  }}
                >
                  Chưa có thành viên nào được phân công
                </div>
              )}
            </LoadingWrapper>
          </Card>
        </div>
      ),
    },
    {
      key: "ke-hoach-trien-khai-khach-hang",
      label: "Kế hoạch triển khai khách hàng",
      icon: <ProjectOutlined />,
      children: (
        <div>
          <Card
            bordered={false}
            className="tab-content-card"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "12px 24px",
            }}
            bodyStyle={{
              padding: "16px 24px",
            }}
          >
            <LoadingWrapper spinning={isLoading("keHoach")} size="large">
              {showEditKhachHang ? (
                <KeHoachTrienKhaiCustomTable
                  idDuAn={item.id}
                  iskeHoachNoiBo={false}
                  onRefresh={triggerRefresh}
                  onClose={() => {
                    setShowEditKhachHang(false);
                    // Clear any localStorage flags
                    localStorage.removeItem("useTemplateData");
                    localStorage.removeItem("useEmptyForm");
                  }}
                />
              ) : (
                <DetailKeHoachTrienKhai
                  idDuAn={item.id}
                  iskeHoachNoiBo={false}
                  onUpdate={() => {
                    setShowEditKhachHang(true);
                  }}
                />
              )}
            </LoadingWrapper>
          </Card>
        </div>
      ),
    },
    {
      key: "ke-hoach-trien-khai-noi-bo",
      label: "Kế hoạch triển khai nội bộ",
      icon: <ProjectOutlined />,
      children: (
        <div>
          <Card
            bordered={false}
            className="tab-content-card"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "12px 24px",
            }}
            bodyStyle={{
              padding: "16px 24px",
            }}
          >
            <LoadingWrapper spinning={isLoading("keHoach")} size="large">
              {showEditNoiBo ? (
                <KeHoachTrienKhaiCustomTable
                  idDuAn={item.id}
                  iskeHoachNoiBo={true}
                  onRefresh={triggerRefresh}
                  onClose={() => {
                    setShowEditNoiBo(false);
                    // Clear any localStorage flags
                    localStorage.removeItem("useTemplateData");
                    localStorage.removeItem("useEmptyForm");
                  }}
                />
              ) : (
                <DetailKeHoachTrienKhai
                  idDuAn={item.id}
                  iskeHoachNoiBo={true}
                  onUpdate={() => {
                    setShowEditNoiBo(true);
                  }}
                />
              )}
            </LoadingWrapper>
          </Card>
        </div>
      ),
    },

    {
      key: "usecase",
      label: "Kế hoạch UseCase",
      icon: <BulbOutlined />,
      children: (
        <div>
          <Card
            bordered={false}
            className="tab-content-card"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "12px 24px",
            }}
            bodyStyle={{
              padding: "16px 24px",
            }}
          >
            <Tabs
              type="card"
              items={[
                {
                  key: "danh-sach-usecase",
                  label: "Danh sách UseCase",
                  children: <GenerateUserCase idDuAn={item.id} />,
                },
                {
                  key: "tac-nhan",
                  label: "Tác nhân",
                  children: <TacNhanList idDuAn={item.id} />,
                },
              ]}
            />
          </Card>
        </div>
      ),
    },
    {
      key: "test-case",
      label: "Test case",
      icon: <BugOutlined />,
      children: (
        <div>
          <Card
            bordered={false}
            className="tab-content-card"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "12px 24px",
            }}
            bodyStyle={{
              padding: "16px 24px",
            }}
          >
            <TestCaseContent />
          </Card>
        </div>
      ),
    },
    {
      key: "noi-dung-hop",
      label: "Nội dung họp",
      icon: <TeamOutlined />,
      children: (
        <div>
          <Card
            bordered={false}
            className="tab-content-card"
            title="Quản lý nội dung cuộc họp"
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              padding: "12px 24px",
            }}
            bodyStyle={{
              padding: "16px 24px",
            }}
          >
            <DA_NoiDungCuocHopPage
              duAnId={item.id}
              tenDuAn={item.tenDuAn}
              embeddedMode={true}
            />
          </Card>
        </div>
      ),
    },
  ];

  // Function để tạo breadcrumb items dựa trên active tab
  const getBreadcrumbItems = () => {
    const baseItems = [
      { label: "Trang chủ", href: "/" },
      { label: "Quản lý dự án", href: "/DuAn" },
      { label: item.tenDuAn || "Chi tiết dự án" },
    ];

    const tabLabels: { [key: string]: string } = {
      "thong-tin-chung": "Thông tin chung",
      "ke-hoach-trien-khai-noi-bo": "Kế hoạch triển khai nội bộ",
      "ke-hoach-trien-khai-khach-hang": "Kế hoạch triển khai khách hàng",
      usecase: "Kế hoạch UseCase",
      "test-case": "Test case",
      "noi-dung-hop": "Nội dung họp",
      "nhat-ky-trien-khai": "Nhật ký triển khai",
    };

    if (activeTab !== "thong-tin-chung" && activeTab && tabLabels[activeTab]) {
      baseItems.push({
        label: tabLabels[activeTab],
      });
    }

    return baseItems;
  };

  return (
    <div>
      <CustomBreadcrumb items={getBreadcrumbItems()} className="mb-4" />

      {/* Header thông tin dự án */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: "16px 24px" }}>
        <div
          className="project-header-content"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ flex: 1, minWidth: 300 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <ProjectOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#1890ff",
                }}
              >
                {item.tenDuAn}
              </h2>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 500,
                  backgroundColor: getStatusColor(item.trangThaiThucHien)
                    .background,
                  color: getStatusColor(item.trangThaiThucHien).color,
                  border: `1px solid ${
                    getStatusColor(item.trangThaiThucHien).border
                  }`,
                }}
              >
                {getStatusText(item.trangThaiThucHien)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                fontSize: "14px",
                color: "#666",
              }}
            >
              {item.ngayBatDau && item.ngayKetThuc && (
                <span>
                  <strong>Thời gian:</strong> {formatDate(item.ngayBatDau)} -{" "}
                  {formatDate(item.ngayKetThuc)}
                </span>
              )}
              {item.ngayTiepNhan && (
                <span>
                  <strong>Ngày tiếp nhận:</strong>{" "}
                  {formatDate(item.ngayTiepNhan)}
                </span>
              )}
            </div>
          </div>
          <div
            className="project-header-actions"
            style={{
              display: "flex",
              gap: 8,
              flexShrink: 0,
              alignItems: "center",
            }}
          >
            {/* Nút chuyển đến tab UseCase */}
            <Button type="primary" onClick={() => setActiveTab("usecase")}>
              Quản lý UseCase
            </Button>
            {item.linkDemo && (
              <Button
                type="link"
                href={item.linkDemo}
                target="_blank"
                size="small"
                style={{ padding: "4px 8px" }}
              >
                Demo
              </Button>
            )}
            {item.linkThucTe && (
              <Button
                type="link"
                href={item.linkThucTe}
                target="_blank"
                size="small"
                style={{ padding: "4px 8px" }}
              >
                Link thực tế
              </Button>
            )}
          </div>
        </div>
      </Card>
      <style>
        {`
					.ant-tabs-tab .anticon {
						margin-inline-end: 5px !important;
					}
					
					/* Tab content card styling */
					.tab-content-card {
						box-shadow: 0 1px 2px rgba(0,0,0,0.03);
						border-radius: 6px;
						transition: all 0.3s;
					}
					
					.tab-content-card .ant-card-head-title {
						font-weight: 600;
						font-size: 16px;
						color: #333;
					}
					
					.tab-content-card:hover {
						box-shadow: 0 3px 6px rgba(0,0,0,0.05);
					}
					
					/* Responsive cho header card */
					@media (max-width: 768px) {
						.project-header-content {
							flex-direction: column !important;
							align-items: flex-start !important;
						}
						
						.project-header-actions {
							width: 100%;
							justify-content: flex-start !important;
						}
						
						.tab-content-card .ant-card-head-title {
							font-size: 15px;
						}
					}
				`}
      </style>

      {/* Remove these modal components as they're now embedded in the tabs */}
      <div
        style={{
          background: "#fff",
          padding: "16px 0 0 0",
          borderRadius: "8px",
          marginBottom: "16px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          border: "1px solid #f0f0f0",
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            // Reset edit mode when changing tabs
            setShowEditNoiBo(false);
            setShowEditKhachHang(false);
          }}
          items={tabItems}
          type="card"
        />
      </div>

      {/* Các Modal */}
      {isUploadModalOpen && (
        <Modal
          title={getUploadModalTitle()}
          open={isUploadModalOpen}
          onCancel={() => {
            setIsUploadModalOpen(false);
            setSelectedFile(null);
          }}
          footer={null}
          width={420}
          bodyStyle={{ padding: 32, paddingTop: 16 }}
          destroyOnClose
        >
          <CommonUpload
            multiple
            maxCount={10}
            extraData={{ LoaiTaiLieu: currentFileType, ItemId: item.id }}
            onUpload={async (files, extraData) => {
              handleUpload(files, extraData);
            }}
            buttonText="Chọn file"
          />
        </Modal>
      )}
      {isUploadedFilesModalOpen && (
        <UploadedFilesModal
          open={isUploadedFilesModalOpen}
          onClose={() => {
            setIsUploadedFilesModalOpen(false);
            setSelectedFile(null);
          }}
          onAfterClose={async () => {
            if (item.id) {
              const res = await TaiLieuDinhKemService.getByItemIdAndLoaiTaiLieu(
                item.id,
                currentFileType
              );
              setHasFiles((prev) => ({
                ...prev,
                [currentFileType]: !!res?.data?.length,
              }));
            }
          }}
          files={uploadedFiles}
          onDelete={handleDeleteFile}
          title={getUploadModalTitle().replace("Tải lên", "Danh sách")}
        />
      )}

      {isPhanCongModalOpen && (
        <Modal
          title="Quản lý phân công thành viên"
          open={isPhanCongModalOpen}
          onCancel={handleClosePhanCongModal}
          onOk={handleSavePhanCong}
          okText="Lưu"
          cancelText="Đóng"
          width={800}
          destroyOnClose
        >
          <LoadingWrapper spinning={isLoading("modal")} size="large">
            <PhanCongTable
              phanCongList={phanCongList}
              userOptions={userOptions}
              roleOptions={roleOptions}
              onAdd={handleAddPhanCong}
              onChange={handlePhanCongChange}
              onDelete={handleDeletePhanCong}
            />
          </LoadingWrapper>
        </Modal>
      )}
    </div>
  );
};

export default DA_DuAnDetailView;
