import React, { useState, useEffect } from "react";
import NhatKyTrienKhaiModal from "./NhatKyTrienKhaiModal";
import NhatKyTrienKhaiTable from "./NhatKyTrienKhaiTable";
import NhatKyTrienKhaiSearch from "./NhatKyTrienKhaiSearch";
import styles from "./NhatKyTrienKhai.module.css";
import { Button, Upload, message, Card, Spin } from "antd";
import { FileExcelOutlined, FileWordOutlined, UploadOutlined, SearchOutlined, ClearOutlined, DownloadOutlined } from "@ant-design/icons";
import dA_NhatKyTrienKhaiService from "@/services/dA_DuAn/dA_NhatKyTrienKhaiService";
import { DA_NhatKyTrienKhaiTypeVM, DA_NhatKyTrienKhaiSearchType } from "@/types/dA_DuAn/dA_NhatKyTrienKhai";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import ModalExportWordNKTK from "./ModalExportWordNKTK";
import dA_DuAnService from "@/services/dA_DuAn/dA_DuAnService";

interface Props {
  duAnId?: string | null;
}

const NhatKyTrienKhai: React.FC<Props> = ({ duAnId: propDuAnId }) => {
  const params = useParams();
  const duAnId = propDuAnId || (params?.id as string);
  
  const [importedData, setImportedData] = useState<DA_NhatKyTrienKhaiTypeVM[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [exportWordLoading, setExportWordLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchParams, setSearchParams] = useState<DA_NhatKyTrienKhaiSearchType>({
    duAnId: duAnId || undefined,
    pageIndex: 1,
    pageSize: 10
  });
  const [showSearch, setShowSearch] = useState(false);

  // Ghi log khi component mount để debug
  useEffect(() => {
    console.log("duAnId from props or params:", duAnId);
  }, [duAnId]);

  // Đảm bảo Modal hiển thị khi có dữ liệu
  useEffect(() => {
    if (importedData.length > 0) {
      setModalVisible(true);
    }
  }, [importedData]);

  const handleFileUpload = async (file: File) => {
    if (!duAnId) {
      message.error("Không có ID dự án");
      return false;
    }

    setImportLoading(true);
    try {
      const response = await dA_NhatKyTrienKhaiService.readImportExcelDA_NhatKyTrienKhai(file, duAnId);
      console.log("API response:", response);
      
      if (response.status || response.success) {
        // Xử lý dữ liệu từ API
        const items: DA_NhatKyTrienKhaiTypeVM[] = [];
        
        // Dựa vào cấu trúc API thực tế
        if (response.data.listDA_NhatKyTrienKhai && Array.isArray(response.data.listDA_NhatKyTrienKhai)) {
          response.data.listDA_NhatKyTrienKhai.forEach((item: any) => {
            if (item && item.data) {
              // Tạo ID duy nhất cho mỗi item nếu không có
              const id = item.data.id && item.data.id !== "00000000-0000-0000-0000-000000000000" 
                ? item.data.id 
                : `temp-${Math.random().toString(36).substring(2, 11)}`;
              
              // Chuyển đổi dữ liệu theo cấu trúc mong muốn
              items.push({
                id: id,
                duAnId: item.data.duAnId,
                phanCong: item.data.phanCong,
                ngayBatDau: item.data.ngayBatDau,
                ngayKetThuc: item.data.ngayKetThuc,
                hangMucCongViec: item.data.hangMucCongViec,
                noiDungThucHien: item.data.noiDungThucHien,
                ketQuaThucHien: item.data.ketQuaThucHien,
                ghiChu: item.data.ghiChu,
                khoKhan: item.data.khoKhan,
                kienNghi: item.data.kienNghi,
                isValid: item.isValid,
                errors: item.errors
              });
            }
          });
        }
        
        setImportedData(items);
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

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSaveSuccess = () => {
    // Sau khi lưu thành công, đóng modal và refresh dữ liệu
    setModalVisible(false);
    toast.success("Lưu dữ liệu thành công");
    setRefreshKey(prev => prev + 1); // Trigger refresh of the table
  };

  const handleSearch = (values: DA_NhatKyTrienKhaiSearchType) => {
    // values already has duAnId from the search component
    const newParams = {
      ...values,
      pageIndex: 1, // Reset to first page on new search
      pageSize
    };
    setSearchParams(newParams);
    setPageIndex(1);
    setRefreshKey(prev => prev + 1);
    setShowSearch(true); // Hide search after submitting
  };

  const handlePageChange = (page: number, size?: number) => {
    setPageIndex(page);
    if (size) {
      setPageSize(size);
    }
    
    setSearchParams(prev => ({
      ...prev,
      pageIndex: page,
      pageSize: size || pageSize
    }));
    
    setRefreshKey(prev => prev + 1);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleDownloadTemplate = () => {
     
    const downloadUrl = `${process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL}/DA_NhatKyTrienKhai/Template/MauImportNhatKyTrienKhai.xlsx`;
        
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `MauImportNhatKyTrienKhai.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    

  };

  const handleExportWord = () => {
    if (!duAnId) {
      message.error("Không có ID dự án");
      return;
    }
    setExportModalVisible(true);
  };

  const handleExportWordSubmit = async (data: { tenGoiThau: string; diaDiemTrienKhai: string; chuDauTu: string ,loai: boolean}) => {
    try {
      setExportWordLoading(true);
      // Close the modal immediately when starting export
      setExportModalVisible(false);
      
      // Prepare the update payload
      const updatePayload = {
        Id: duAnId,
        TenGoiThau: data.tenGoiThau,
        DiaDiemTrienKhai: data.diaDiemTrienKhai,
        ChuDauTu: data.chuDauTu,
        
      };

      // Call the update API
      const response = await dA_DuAnService.update(updatePayload);
      
      if (response.status) {
        // Export to Word after successful update
        try {
          const wordResponse = await dA_NhatKyTrienKhaiService.ExportWordNhatKyTrienKhaiTuKeHoachThucHien(duAnId,data.loai);
          
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

  const handleResetSearch = () => {
    setSearchParams({
      duAnId: duAnId || undefined,
      pageIndex: 1,
      pageSize: 10
    });
    setPageIndex(1);
    setRefreshKey(prev => prev + 1);
    setShowSearch(false); // Hide search after reset
  };

  return (
    <Card >
      <div className={styles.headerActions}>
        <div className={styles.leftActions}>
          <Button
            type={showSearch ? "primary" : "default"}
            icon={<SearchOutlined />}
            onClick={toggleSearch}
          >
            Tìm kiếm
          </Button>
   
        </div>
        <div className={styles.leftActions}>
          <Button
  
            icon={<DownloadOutlined />}
            onClick={handleDownloadTemplate}
          >
            DowLoad Template 
          </Button>
   
        </div>
        <div className={styles.leftActions}>
          <Button
            icon={<FileWordOutlined />}
            onClick={handleExportWord}
            loading={exportWordLoading}
            disabled={exportWordLoading}
          >
            Export Word  từ Kế Hoạch
          </Button>
   
        </div>
        <div className={styles.rightActions}>
          <Upload
            accept=".xlsx,.xls"
            showUploadList={false}
            beforeUpload={handleFileUpload}
            disabled={importLoading}
          >
            <Button 
              className={styles.importButton}
              loading={importLoading}
              icon={<UploadOutlined />}
            >
              Import Excel từ
            </Button>
          </Upload>
        </div>
      </div>

      {/* Search Component - only show when active */}
      {showSearch && (
        <NhatKyTrienKhaiSearch 
          onFinish={handleSearch}
          pageIndex={pageIndex}
          pageSize={pageSize}
          duAnId={duAnId}
          onCancel={() => setShowSearch(false)}
        />
      )}

      {/* Table component */}
      <NhatKyTrienKhaiTable 
        duAnId={duAnId} 
        key={refreshKey}
        onRefresh={() => setRefreshKey(prev => prev + 1)}
        searchParams={searchParams}
        onPageChange={handlePageChange}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />

      {/* Modal for imported data */}
      <NhatKyTrienKhaiModal
        open={modalVisible}
        onClose={handleModalClose}
        importedData={importedData}
        duAnId={duAnId}
        onSaveSuccess={handleSaveSuccess}
      />

      {/* Modal for exporting Word */}
      <ModalExportWordNKTK
        isOpen={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        onExport={handleExportWordSubmit}
        duAnId={duAnId}
        isExporting={exportWordLoading}
      />

      {exportWordLoading && (
        <div className="global-loading-container">
          <Spin size="large" tip="Đang xuất file Word..." />
        </div>
      )}
    </Card>
  );
};

export default NhatKyTrienKhai;