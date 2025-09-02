import React, { useState, useEffect } from "react";
import { Checkbox, Button, Modal, Upload, message, Table } from "antd";
import { EditOutlined, FileExcelOutlined, CopyOutlined, ExclamationCircleOutlined, ImportOutlined, UploadOutlined, DownloadOutlined, FileWordOutlined } from "@ant-design/icons";
import styles from "./KeHoachTrienKhai.module.css";
import dayjs from "dayjs";
import { userService } from "@/services/user/user.service";
import dA_KeHoachThucHienService from "@/services/dA_KeHoachThucHien/dA_KeHoachThucHienService";
import { toast } from "react-toastify";
import KeHoachThucHienConstant from "@/constants/DuAn/KeHoachThucHienConstant";
import dA_NhatKyTrienKhaiService from "@/services/dA_DuAn/dA_NhatKyTrienKhaiService";
import { DA_NhatKyTrienKhaiTypeVM } from "@/types/dA_DuAn/dA_NhatKyTrienKhai";
import ModalExportWordNKTK from "./NhatKyTrienKhaiComponent/ModalExportWordNKTK";
import dA_DuAnService from "@/services/dA_DuAn/dA_DuAnService";
import NhatKyTrienKhaiModal from "./NhatKyTrienKhaiComponent/NhatKyTrienKhaiModal";
import { DA_KeHoachThucHienCreateOrUpdateType } from "@/types/dA_DuAn/dA_KeHoachThucHien";
import DetailKeHoachTrienKhaiNoiBo from "./KeHoachTrienKhaiNoiBo/DetailKeHoachTrienKhaiNoiBo";
import { useRolePermissions } from "@/hooks/useRolePermissions";

interface RowType {
  key: string;
  stt: number | string;
  group?: string;
  isGroup?: boolean;
  ngayBatDau?: string | null;
  ngayKetThuc?: string | null;
  canhBaoTruocNgay?: number | null;
  isKeHoachNoiBo?: boolean | null;
  isCanhBao?: boolean | null;
  noiDungCongViec?: string | null;
  phanCong?: string | null;
  phanCongKH?: string | null;
}

interface Props {
  idDuAn: string | null;
  iskeHoachNoiBo?: boolean | null;
  onClose?: () => void;
  onUpdate?: () => void; // Callback for the Update button
}

const KeHoachTrienKhaiDetailTable: React.FC<Props> = ({ idDuAn, iskeHoachNoiBo, onClose, onUpdate }) => {
  const [data, setData] = useState<RowType[]>([]);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [isTemplateData, setIsTemplateData] = useState(false);
  const [templateData, setTemplateData] = useState<any[]>([]);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [templateUsed, setTemplateUsed] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [exportWordLoading, setExportWordLoading] = useState(false);
  const [importedData, setImportedData] = useState<DA_KeHoachThucHienCreateOrUpdateType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const permissions = useRolePermissions();
  useEffect(() => {
    setLoadingUsers(true);
    userService.getDropdown().then((userRes) => {
      console.log('DetailKeHoachTrienKhai - Loaded user options:', userRes.data);
      setUserOptions(Array.isArray(userRes.data) ? userRes.data : []);
      setLoadingUsers(false);
    }).catch(err => {
      console.error('DetailKeHoachTrienKhai - Error loading users:', err);
      setLoadingUsers(false);
    });
  }, []);

  const handleExportExcel = async () => {
    if (!idDuAn) {
      toast.error("ID dự án không hợp lệ!");
      return;
    }

    setExportLoading(true);
    try {
      const result = await dA_KeHoachThucHienService.exportKeHoachThucHienDA(idDuAn, iskeHoachNoiBo || false);

      if (result.status) {
        // Create download link
        const downloadUrl = `${process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL}${result.data}`;

        // Create a temporary anchor element and trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `KeHoachThucHien_${new Date().toISOString().slice(0, 10)}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Xuất Excel thành công!");
      } else {
        toast.error(result.message || "Có lỗi xảy ra khi xuất Excel!");
      }
    } catch (error) {
      console.error("Export Excel error:", error);
      toast.error("Có lỗi xảy ra khi xuất Excel!");
    } finally {
      setExportLoading(false);
    }
  };

  // Function to load template data
  const loadTemplateData = async () => {
    setLoadingTemplate(true);
    try {
      const res = await dA_KeHoachThucHienService.getDropdownsTreeTemplate(
        idDuAn || "",
         false
      );
      console.log("res.data getDropdownsTreeTemplate", res.data);

      if (res.status && Array.isArray(res.data) && res.data.length > 0) {
        console.log("Template data loaded:", res.data);
        setTemplateData(res.data);
        const flatData = flattenTreeData(res.data);
        setData(flatData);
        setTemplateUsed(true);

      } else {
        toast.error("Không thể tải mẫu kế hoạch!");
      }
    } catch (error) {
      console.error("Error loading template data:", error);
      toast.error("Có lỗi khi tải mẫu kế hoạch!");
    } finally {
      setLoadingTemplate(false);
    }
  };

  // Handle the update button click
  const handleUpdateClick = () => {
   
    if (onUpdate) {
      // Don't set any localStorage flags if we already have data
      // This ensures we keep the existing data when updating
      if (!hasData) {
        // Only set the empty form flag if we don't have data and aren't using template
        localStorage.setItem('useEmptyForm', 'true');
        localStorage.removeItem('useTemplateData');
      }
      onUpdate();
    }
  };

  // Handle using template and updating
  const handleUseTemplateAndUpdate = () => {
    // If we already have data, show a confirmation dialog
    if (data.length > 0) {
      Modal.confirm({
        title: 'Xác nhận sử dụng mẫu',
        icon: <ExclamationCircleOutlined />,
        content: 'Dữ liệu hiện tại sẽ bị ghi đè bởi dữ liệu mẫu. Bạn có chắc chắn muốn tiếp tục?',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk: () => {
          // Proceed with loading template and updating
          loadAndUpdateTemplate();
        }
      });
    } else {
      // If no data, proceed directly
      loadAndUpdateTemplate();
    }
  };

  // Helper function to load template and update
  const loadAndUpdateTemplate = () => {
    loadTemplateData().then(() => {
      // After loading template data, set the flag and call update
      localStorage.setItem('useTemplateData', 'true');
      localStorage.removeItem('useEmptyForm');
      if (onUpdate) {
        onUpdate();
      }
    });
  };

  const handleExportWordSubmit = async (data: { tenGoiThau: string; diaDiemTrienKhai: string; chuDauTu: string, loai: boolean }) => {
    try {
      setExportWordLoading(true);
      // Close the modal immediately when starting export
      setExportModalVisible(false);

      // Prepare the update payload
      const updatePayload = {
        Id: idDuAn,
        TenGoiThau: data.tenGoiThau,
        DiaDiemTrienKhai: data.diaDiemTrienKhai,
        ChuDauTu: data.chuDauTu,

      };

      // Call the update API
      const response = await dA_DuAnService.update(updatePayload);

      if (response.status) {
        // Export to Word after successful update
        try {
          const wordResponse = await dA_NhatKyTrienKhaiService.ExportWordNhatKyTrienKhaiTuKeHoachThucHien(idDuAn || "", data.loai);

          if (wordResponse.status && wordResponse.data) {
            // downloadFileFromBase64(wordResponse.data, `NhatKyTrienKhai_${data.tenGoiThau}.docx`);

            const downloadUrl = `${process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL}/${wordResponse.data.urlFile}`;

            // Create a temporary anchor element and trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${wordResponse.data.tenFile}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            message.error(wordResponse.message || "Có lỗi xảy ra khi xuất file Word");
          }
        } catch (exportError) {
          console.error("Error exporting word file:", exportError);
          message.error("Đã xảy ra lỗi khi xuất file Word");
        }
      } else {
        message.error(response.message || "Có lỗi xảy ra khi cập nhật thông tin");
      }
    } catch (error) {
      console.error("Error exporting word:", error);
      message.error("Đã xảy ra lỗi khi xuất file Word");
    } finally {
      setExportWordLoading(false);
    }
  };

  // Helper function to flatten tree data
  const flattenTreeData = (treeData: any[]): RowType[] => {
    const result: RowType[] = [];
    let groupIndex = 0;

    treeData.forEach(node => {
      const groupKey = node.id || `G${Date.now()}_${groupIndex}`;
      groupIndex++;

      console.log("node", node);

      // Add parent node (group)
      result.push({
        key: groupKey,
        stt: node.stt || String.fromCharCode(65 + groupIndex - 1),
        group: groupKey,
        isGroup: true,
        ngayBatDau: node.ngayBatDau || null,
        ngayKetThuc: node.ngayKetThuc || null,
        canhBaoTruocNgay: node.canhBaoTruocNgay,
        isKeHoachNoiBo: node.isKeHoachNoiBo,
        isCanhBao: node.isCanhBao,
        noiDungCongViec: node.noiDungCongViec,
        phanCong: node.phanCong || null,
        phanCongKH: node.phanCongKH || null,
      });


      // Add child nodes
      if (node.listdA_KeHoachThucHienTrees && node.listdA_KeHoachThucHienTrees.length > 0) {
        node.listdA_KeHoachThucHienTrees.forEach((child: any, childIndex: number) => {
          const userFound = userOptions.find(u => u.value === child.phanCong);

          result.push({
            key: child.id || `${groupKey}_${Date.now()}_${childIndex}`,
            stt: child.stt || (childIndex + 1),
            group: groupKey,
            isGroup: false,
            ngayBatDau: child.ngayBatDau || null,
            ngayKetThuc: child.ngayKetThuc || null,
            canhBaoTruocNgay: child.canhBaoTruocNgay,
            isKeHoachNoiBo: child.isKeHoachNoiBo,
            isCanhBao: child.isCanhBao,
            noiDungCongViec: child.noiDungCongViec,
            phanCong: child.phanCong || null,
          });
        });
      }
    });
    console.log("result phan cong khach hang", result);

    return result;
  };
  const handleDownloadTemplate = () => {
    const downloadUrl = `${process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL}${KeHoachThucHienConstant.urlTemplateKeHoachTrienKhai}`;

    // Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `MauImportNhatKyTrienKhai.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch data from API
  useEffect(() => {
    if (!idDuAn || loadingUsers) return;

    setLoadingData(true);
    dA_KeHoachThucHienService.getDropdownsTree(idDuAn, iskeHoachNoiBo || false)
      .then(res => {
        console.log(`DetailKeHoachTrienKhai - Fetched tree data for ${iskeHoachNoiBo ? 'nội bộ' : 'khách hàng'}:`, res.data);

        if (res.status && Array.isArray(res.data) && res.data.length > 0) {
          // Check if this is template data
          const duAnId = res.data[0].duAnId;
          const templateId = KeHoachThucHienConstant.DuAnIdTemplate;

          // Check if this is template data
          const isTemplate = duAnId === templateId;

          console.log(`DetailKeHoachTrienKhai - Is template data: ${isTemplate}, duAnId: ${duAnId}, templateId: ${templateId}`);
          setIsTemplateData(isTemplate);

          // If this is template data, don't display data but store it for later use
          if (isTemplate) {
            console.log("DetailKeHoachTrienKhai - Template data - storing but not displaying");
            setTemplateData(res.data);
            setData([]);
            setHasData(false);
          } else {
            // If not template data, process normally
            const flatData = flattenTreeData(res.data);
            console.log(`DetailKeHoachTrienKhai - Processed ${flatData.length} items`);
            setData(flatData);
            setHasData(flatData.length > 0);
            console.log("DetailKeHoachTrienKhai - Data loaded, hasData:", flatData.length > 0);
          }
        } else {
          console.log("DetailKeHoachTrienKhai - No data or invalid response");
          setData([]);
          setHasData(false);
        }
      })
      .catch(error => {
        console.error('DetailKeHoachTrienKhai - Error fetching data:', error);
        setData([]);
        setHasData(false);
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [idDuAn, loadingUsers, userOptions, onUpdate, iskeHoachNoiBo, refreshKey]);

  // New function to copy data from khách hàng to nội bộ
  const handleCopyFromKhachHang = async () => {
    if (!idDuAn) {
      toast.error("ID dự án không hợp lệ!");
      return;
    }

    // If we already have data, show a confirmation dialog

    Modal.confirm({
      title: 'Xác nhận sao chép từ kế hoạch khách hàng',
      icon: <ExclamationCircleOutlined />,
      content: 'Dữ liệu hiện tại sẽ bị ghi đè bởi dữ liệu từ kế hoạch khách hàng. Bạn có chắc chắn muốn tiếp tục?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk: () => {
        copyFromKhachHang();
      },
    
    });

  };

 
  // Helper function to copy data from khách hàng to nội bộ
  const copyFromKhachHang = async () => {
    try {
      setLoadingData(true);

      if (!idDuAn) {
        toast.error("ID dự án không hợp lệ!");
        return;
      }

      // Fetch data from khách hàng kế hoạch
      const res = await dA_KeHoachThucHienService.getDropdownsTree(idDuAn, false); // false for khách hàng

      console.log("res.data getDropdownsTree khach hang", res.data);

      if (res.status && Array.isArray(res.data) && res.data.length > 0) {
        console.log("Khách hàng data loaded for copying:", res.data);

        // Set a flag to indicate we're copying from khách hàng
        localStorage.setItem('copyFromKhachHang', 'true');

        // Notify user that data has been loaded for editing
        toast.success("Đã tải dữ liệu từ kế hoạch khách hàng. Vui lòng kiểm tra và ấn 'Lưu' để hoàn tất!");

        // Switch to edit mode to show the copied data
        if (onUpdate) {
          onUpdate();
        }
      } else {
        toast.error("Không tìm thấy dữ liệu kế hoạch khách hàng!");
      }
    } catch (error) {
      console.error("Error copying from khách hàng:", error);
      toast.error("Có lỗi khi sao chép từ kế hoạch khách hàng!");
    } finally {
      setLoadingData(false);
    }
  };

  const columns = [
    // {
    //   title: '',
    //   dataIndex: 'empty',
    //   key: 'empty',
    //   width: 32,
    //   render: () => <></>
    // },
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: "5%",
      align: 'center' as const
    },
    {
      title: 'Hạng mục công việc',
      dataIndex: 'noiDungCongViec',
      key: 'noiDungCongViec',
      width: "35%",
      render: (text: string, record: RowType) => (
        <div style={{ fontWeight: record.isGroup ? 'bold' : 'normal' }}>{text}</div>
      )
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: 'thoiGian',
      key: 'thoiGian',
      width: "20%",
      render: (_: any, record: RowType) => {
        if (record.isGroup) {
          if (
            record.ngayBatDau &&
            record.ngayKetThuc &&
            dayjs(record.ngayBatDau, ["YYYY-MM-DD", "DD/MM/YYYY"]).isValid() &&
            dayjs(record.ngayKetThuc, ["YYYY-MM-DD", "DD/MM/YYYY"]).isValid()
          ) {
            return `${dayjs(record.ngayBatDau, ["YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY")} - ${dayjs(record.ngayKetThuc, ["YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY")}`;
          }
          const childDates = data.filter(r => r.group === record.group && !r.isGroup);
          if (childDates.length === 0) return "-";
          const validStarts = childDates
            .map(r => r.ngayBatDau)
            .filter(d => d && dayjs(d, ["YYYY-MM-DD", "DD/MM/YYYY"]).isValid())
            .map(d => dayjs(d, ["YYYY-MM-DD", "DD/MM/YYYY"]));
          const validEnds = childDates
            .map(r => r.ngayKetThuc)
            .filter(d => d && dayjs(d, ["YYYY-MM-DD", "DD/MM/YYYY"]).isValid())
            .map(d => dayjs(d, ["YYYY-MM-DD", "DD/MM/YYYY"]));
          if (validStarts.length === 0 && validEnds.length === 0) return "-";
          const minStart = validStarts.length > 0
            ? dayjs(validStarts.reduce((a, b) => (a.isBefore(b) ? a : b))).format("DD/MM/YYYY")
            : "";
          const maxEnd = validEnds.length > 0
            ? dayjs(validEnds.reduce((a, b) => (a.isAfter(b) ? a : b))).format("DD/MM/YYYY")
            : "";
          return `${minStart}${minStart && maxEnd ? " - " : ""}${maxEnd}`;
        } else {
          const start = record.ngayBatDau && dayjs(record.ngayBatDau, ["YYYY-MM-DD", "DD/MM/YYYY"]).isValid()
            ? dayjs(record.ngayBatDau, ["YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY")
            : "";
          const end = record.ngayKetThuc && dayjs(record.ngayKetThuc, ["YYYY-MM-DD", "DD/MM/YYYY"]).isValid()
            ? dayjs(record.ngayKetThuc, ["YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY")
            : "";
          return `${start}${start && end ? " - " : ""}${end}`;
        }
      }
    },
    {
      title: 'Phân Công',
      dataIndex: 'phanCong',
      key: 'phanCong',
      width: "30%",
      render: (text: string, record: RowType) => {
        if (record.isGroup) {
          return (
            <div style={{
              whiteSpace: "pre-wrap",
              maxHeight: "120px",
              overflowY: "auto",
              padding: "4px",
              border: "1px solid #f0f0f0",
              borderRadius: "4px",
              background: "#fafafa"
            }}>
              {record.phanCongKH}
            </div>
          );
        } else {
          let userLabels = "";
          if (text && typeof text === 'string') {
            const userIds = text.split(',').map(id => id.trim()).filter(id => id);
            const labels = userIds.map(userId => {
              const user = userOptions.find((u: any) => u.value === userId);
              return user?.label || userId;
            });
            userLabels = labels.join(', ');
          }
          return userLabels;
        }
      }
    },
    {
      title: 'Cảnh báo?',
      dataIndex: 'isCanhBao',
      key: 'isCanhBao',
      width: "10%",
      align: 'center' as const,
      render: (text: boolean) => <Checkbox checked={text} disabled />
    }
  ];

  // Show loading state while users are loading
  if (loadingUsers || loadingData) {
    return (
      <div style={{ background: "#fff", padding: 16, textAlign: "center" }}>
        Đang tải dữ liệu...
      </div>
    );
  }
  const handleFileUpload = async (file: File) => {
    if (!idDuAn) {
      message.error("Không có ID dự án");
      return false;
    }

    setImportLoading(true);
    try {
      // Use existing NhatKyTrienKhai service but map to KeHoachThucHien format
      const response = await dA_NhatKyTrienKhaiService.readImportExcelDA_NhatKyTrienKhai(file, idDuAn);
      console.log("API response:", response);

      if (response.status || response.success) {
        // Process data and map from NhatKyTrienKhai to KeHoachThucHien format
        const items: any[] = [];

        // Dựa vào cấu trúc API thực tế của NhatKyTrienKhai
        if (response.data.listDA_NhatKyTrienKhai && Array.isArray(response.data.listDA_NhatKyTrienKhai)) {
          response.data.listDA_NhatKyTrienKhai.forEach((item: any) => {

            console.log("item", item);
            if (item && item.data) {
              // Tạo ID duy nhất cho mỗi item nếu không có
              const id = item.data.id && item.data.id !== "00000000-0000-0000-0000-000000000000"
                ? item.data.id
                : `temp-${Math.random().toString(36).substring(2, 11)}`;

              // Map từ NhatKyTrienKhai sang KeHoachThucHien
              items.push({
                id: id,
                duAnId: idDuAn,
                // Map hangMucCongViec to noiDungCongViec
                noiDungCongViec: item.data.hangMucCongViec,
                phanCong: item.data.phanCong,
                ngayBatDau: item.data.ngayBatDau,
                ngayKetThuc: item.data.ngayKetThuc,
                isCanhBao: false,
                isKeHoachNoiBo: iskeHoachNoiBo || false,
                noiDungCongViecCon: item.data.noiDungThucHien,
                // Keep validation info
                isValid: item.isValid,
                errors: item.errors
              });
              console.log("items", items);
            }
          });
        }

        // Cast to the required type
        setImportedData(items as DA_KeHoachThucHienCreateOrUpdateType[]);
        setModalVisible(true);

        const totalValid = response.data.soLuongThanhCong || 0;
        const totalInvalid = response.data.soLuongThatBai || 0;
        message.success(`Đọc file thành công: ${totalValid} hợp lệ, ${totalInvalid} không hợp lệ`);
      } else {
        message.error(response.message || "Đọc file thất bại");
      }
    } catch (error) {
      console.error("Error importing file:", error);
      message.error("Đã xảy ra lỗi khi đọc file");
    } finally {
      setImportLoading(false);
    }
    return false; // Prevent default upload behavior
  };
  const handleSaveSuccess = () => {
    // Sau khi lưu thành công, đóng modal và refresh dữ liệu
    setModalVisible(false);
    toast.success("Lưu dữ liệu thành công");
    setRefreshKey(prev => prev + 1); // Trigger refresh of the table
  };
  const handleExportWord = () => {
    if (!idDuAn) {
      message.error("Không có ID dự án");
      return;
    }
    setExportModalVisible(true);
  };



  const handleModalClose = () => {
    setModalVisible(false);
  };

  // Always show the table structure with buttons
  return (
    <div style={{ background: "#fff", padding: 16 }}>
      <div className={styles.headerActions} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, gap: '8px' }}>
        {/* Separate Update button */}
        {permissions.canEditKeHoachTrienKhaiKH && (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={handleUpdateClick}
        >
          Cập nhật
        </Button>
        )}

        {/* Copy from Khách hàng button - always show for external plan view */}
        {iskeHoachNoiBo && permissions.canCreateKeHoachTrienKhaiNoiBo && (                     
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={handleCopyFromKhachHang}
            loading={loadingData}
          >
            Tạo từ kế hoạch khách hàng
          </Button>
        )}

        {!iskeHoachNoiBo && (
          <Button
            type="primary"
            icon={<FileWordOutlined />}
            onClick={handleExportWord}
            loading={exportWordLoading}
            disabled={exportWordLoading}
          >
            Export Nhật Kí Triển Khai
          </Button>
        )}

        {/* Use Template button - always show it */}
       {!iskeHoachNoiBo && permissions.canSuDungMauKeHoachTrienKhaiKH && (
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={handleUseTemplateAndUpdate}
            loading={loadingTemplate}
          >
            Sử dụng mẫu và cập nhật
          </Button>
        )}
        <div className={styles.leftActions}>
          {!iskeHoachNoiBo && permissions.canDowloadTemplateKeHoachTrienKhaiKH && (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadTemplate}
            >
              DowLoad Template
            </Button>
          )}

        </div>

        {!iskeHoachNoiBo && permissions.canImportExceltKeHoachTrienKhaiKH && (
          <Upload
            accept=".xlsx,.xls"
            showUploadList={false}
            beforeUpload={handleFileUpload}
            disabled={importLoading}
          >
            <Button
              type="primary"
              className={styles.importButton}
              loading={importLoading}
              icon={<UploadOutlined />}
            >
              Import Excel
            </Button>
          </Upload>
        )}

        {/* Export Excel button */}
        {!iskeHoachNoiBo && (
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExportExcel}
            loading={exportLoading}
          >
            Xuất Excel
          </Button>
        )}
      </div>

      {iskeHoachNoiBo ? (
        <DetailKeHoachTrienKhaiNoiBo
          idDuAn={idDuAn}
          onClose={onClose}
          onUpdate={onUpdate}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={(record) => record.isGroup ? 'ant-table-row-bold' : ''}
          locale={{
            emptyText: isTemplateData // Added this comment to force re-evaluation
              ? 'Nhấn "Sử dụng mẫu và cập nhật" để hiển thị dữ liệu mẫu'
              : 'Chưa có dữ liệu kế hoạch. Nhấn "Cập nhật" để tạo mới hoặc "Sử dụng mẫu và cập nhật" để sử dụng mẫu có sẵn.'
          }}
          bordered
          style={{ borderInlineStart: "1px solid #f0f0f0" }}
        />
      )}
      {!iskeHoachNoiBo && (
        <ModalExportWordNKTK
          isOpen={exportModalVisible}
          onClose={() => setExportModalVisible(false)}
          onExport={handleExportWordSubmit}
          duAnId={idDuAn || undefined}
          isExporting={exportWordLoading}
        />
      )}

      {!iskeHoachNoiBo && (
        <NhatKyTrienKhaiModal
          open={modalVisible}
          onClose={handleModalClose}
          importedData={importedData}
          duAnId={idDuAn}
          onSaveSuccess={handleSaveSuccess}
          dataType="keHoach"
          isKeHoachNoiBo={iskeHoachNoiBo || false}
        />
      )}
    </div>
  );
};


export default KeHoachTrienKhaiDetailTable;
