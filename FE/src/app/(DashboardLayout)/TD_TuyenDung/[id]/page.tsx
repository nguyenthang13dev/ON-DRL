"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Card, Descriptions, Table, Tag, Button, Spin, Row, Col, Breadcrumb, Tooltip, Modal, Select, message, Tabs, Dropdown, Input, DatePicker } from "antd";
import { TD_TuyenDungType, getTinhTrangLabel, getLoaiLabel, getHinhThucLabel } from "@/types/TD_TuyenDung/TD_TuyenDung";
import TD_TuyenDungService from "@/services/TD_TuyenDung/TD_TuyenDungService";
import tD_UngVienService from "@/services/TD_UngVien/TD_UngVienService";
import { TD_UngVienDto, TD_UngVienSearch, TrangThaiUngVien } from "@/types/TD_UngVien/TD_UngVien";
import dayjs, { Dayjs } from "dayjs";
import { DownloadOutlined, UpOutlined, DownOutlined, AppstoreOutlined, CheckCircleOutlined, ClockCircleOutlined, PauseCircleOutlined, UserSwitchOutlined, StopOutlined, EyeOutlined, CalendarOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import Search from "@/app/(DashboardLayout)/TD_UngVien/search";
import Link from "next/link";
import UpdateInterviewTimeModal from "@/app/(DashboardLayout)/TD_UngVien/UpdateInterviewTimeModal";
import TD_UngVienDetail from "@/app/(DashboardLayout)/TD_UngVien/TD_UngVienDetail";
import TD_UngVienForm from "@/app/(DashboardLayout)/TD_UngVien/TD_UngVienForm";
import { toast } from "react-toastify";
import DOMPurify from 'dompurify';
import emailTemplateService from '@/services/emailTemplate/EmailTemplateService';
const PAGE_SIZE = 10;

const TuyenDungDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<TD_TuyenDungType | null>(null);
  const [loading, setLoading] = useState(true);
  const [ungVienList, setUngVienList] = useState<TD_UngVienDto[]>([]);
  const [uvLoading, setUvLoading] = useState(false);
  const [uvTotal, setUvTotal] = useState(0);
  const [uvSearch, setUvSearch] = useState<TD_UngVienSearch>({ pageIndex: 1, pageSize: PAGE_SIZE, TuyenDungId: id });
  const [showDetail, setShowDetail] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<TD_UngVienDto[]>([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateStatusMap, setUpdateStatusMap] = useState<{ [status: number]: number | undefined }>({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [statusCounts, setStatusCounts] = useState<{ [key: number]: number }>({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [totalAll, setTotalAll] = useState(0);
  const [isOpenUpdateInterview, setIsOpenUpdateInterview] = useState(false);
  const [currentUngVien, setCurrentUngVien] = useState<TD_UngVienDto | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [detailUngVienId, setDetailUngVienId] = useState<string | null>(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [currentUngVienEdit, setCurrentUngVienEdit] = useState<TD_UngVienDto | null>(null);
  // Biến tạm để lưu id ứng viên cần tick sau khi cập nhật TG phỏng vấn
  const [pendingSelectUngVienId, setPendingSelectUngVienId] = useState<string | null>(null);

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  // State để điều khiển hiển thị upload CV
  const [showUploadCV, setShowUploadCV] = useState(false);

  // State cho gửi email
  const [isOpenSendMailModal, setIsOpenSendMailModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);
  const [templateList, setTemplateList] = useState<any[]>([]);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [sendingMail, setSendingMail] = useState(false);
  const debounceTemplateRef = useRef<NodeJS.Timeout | null>(null);
  const [templateTypes, setTemplateTypes] = useState<{ label: string; value: string }[]>([]);
  const [selectedTemplateType, setSelectedTemplateType] = useState<string | undefined>(undefined);
  const [templateByStatus, setTemplateByStatus] = useState<{ [status: number]: string | undefined }>({});
  const [templateListByType, setTemplateListByType] = useState<any[]>([]);
  const [templateTypeLoading, setTemplateTypeLoading] = useState(false);

  // Lấy các trạng thái hiện tại trong danh sách chọn
  const selectedStatusSet: number[] = Array.from(new Set(selectedRows
    .filter(r => typeof r.trangThai === 'number')
    .map(r => r.trangThai as number)
  ));
  // Map trạng thái sang label
  const statusOptions = [
    { value: TrangThaiUngVien.ChuaXetDuyet, label: "Chưa xét duyệt" },
    { value: TrangThaiUngVien.DaXetDuyet, label: "Đã xét duyệt" },
    { value: TrangThaiUngVien.DangChoPhongVan, label: "Đang chờ phỏng vấn" },
    { value: TrangThaiUngVien.DaNhanViec, label: "Đã nhận việc" },
    { value: TrangThaiUngVien.DaTuChoi, label: "Đã từ chối" },
    { value: TrangThaiUngVien.DatPhongVan, label: "Đạt phỏng vấn" },
  ];

  const handleOpenUpdateModal = () => {
    // Khởi tạo map trạng thái mới cho từng nhóm trạng thái hiện tại
    const map: { [status: number]: number | undefined } = {};
    selectedStatusSet.forEach(st => {
      map[Number(st)] = undefined;
    });
    setUpdateStatusMap(map);
    setUpdateModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    setUpdateLoading(true);
    try {
      // Gửi cập nhật cho từng nhóm trạng thái
      let hasError = false;
      const errorMessages: string[] = [];
      for (const st of selectedStatusSet) {
        const ids = selectedRows.filter(r => r.trangThai === st).map(r => r.id);
        const newStatus = updateStatusMap[st];
        if (typeof newStatus === 'number' && !isNaN(newStatus) && ids.length > 0) {
          const res = await tD_UngVienService.updateStatus({ Ids: ids, TrangThai: newStatus });
          if (!res.status) {
            hasError = true;
            if (res.errors && Array.isArray(res.errors)) {
              errorMessages.push(...res.errors);
            } else if (res.message) {
              errorMessages.push(res.message);
            } else {
              errorMessages.push("Có lỗi không xác định khi cập nhật trạng thái.");
            }
          }
        }
      }
      if (hasError) {
        toast.error(
            <ul >
              {errorMessages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
        );
      } else {
        toast.success("Cập nhật trạng thái thành công!");
        setUpdateModalOpen(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
        fetchUngVien(uvSearch);
        fetchAllStatusCounts(); // Thêm dòng này để cập nhật lại số lượng tab
      }
    } catch (e) {
      toast.error("Cập nhật trạng thái thất bại!");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleOpenUpdateInterview = (data: TD_UngVienDto) => {
    setCurrentUngVien(data);
    setIsOpenUpdateInterview(true);
  };
  const handleCloseUpdateInterview = () => {
    setIsOpenUpdateInterview(false);
    setCurrentUngVien(null);
  };
  const handleSuccessUpdateInterview = () => {
    fetchUngVien(uvSearch);
    if (currentUngVien) {
      setPendingSelectUngVienId(currentUngVien.id);
    }
  };
  const handleViewDetail = (data: TD_UngVienDto) => {
    setDetailUngVienId(data.id);
    setIsOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setIsOpenDetail(false);
    setDetailUngVienId(null);
  };
  const handleDeleteUngVien = async (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa ứng viên này?",
      onOk: async () => {
        const res = await tD_UngVienService.delete(id);
        if (res.status) {
          toast.success("Xóa thành công");
          fetchUngVien(uvSearch);
        } else {
          toast.error(res.message || "Xóa thất bại");
        }
      },
    });
  };

  // Mở form cập nhật thông tin ứng viên
  const handleEditUngVien = (data: TD_UngVienDto) => {
    setCurrentUngVienEdit(data);
    setIsOpenForm(true);
  };

  // Đóng form
  const handleCloseForm = () => {
    setIsOpenForm(false);
    setCurrentUngVienEdit(null);
  };

  // Submit form
  const handleSubmitForm = async (formData: any) => {
    try {
      let res;
      if (formData.id) {
        res = await tD_UngVienService.update(formData);
      } else {
        res = await tD_UngVienService.create(formData);
      }
      if (res.status) {
        toast.success(formData.id ? "Cập nhật ứng viên thành công" : "Thêm mới ứng viên thành công");
        handleCloseForm();
        fetchUngVien(uvSearch);
      } else {
        toast.error(res.message || "Thao tác thất bại");
      }
    } catch (e) {
      toast.error("Thao tác thất bại");
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      TD_TuyenDungService.get(id)
        .then(res => {
          if (res.status && res.data) setData(res.data);
          else setData(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const fetchUngVien = useCallback((search: TD_UngVienSearch) => {
    setUvLoading(true);
    tD_UngVienService.getData({ ...search, TuyenDungId: id })
      .then(res => {
        if (res.status && res.data?.items) {
          setUngVienList(res.data.items);
          setUvTotal(res.data.totalCount || 0);
          // Nếu có pendingSelectUngVienId, set lại selectedRowKeys và selectedRows
          if (pendingSelectUngVienId) {
            const found = res.data.items.find(u => u.id === pendingSelectUngVienId);
            if (found) {
              setSelectedRowKeys([pendingSelectUngVienId]);
              setSelectedRows([found]);
            }
            setPendingSelectUngVienId(null);
          }
        } else {
          setUngVienList([]);
          setUvTotal(0);
        }
      })
      .finally(() => setUvLoading(false));
  }, [id, pendingSelectUngVienId]);

  useEffect(() => {
    if (id) fetchUngVien(uvSearch);
  }, [id, uvSearch, fetchUngVien]);

  const handleDownloadCV = async (ungVien: TD_UngVienDto) => {
    try {
      const blob = await tD_UngVienService.downloadCV(ungVien.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = ungVien.cvFile?.split("/").pop() || `CV_${ungVien.hoTen}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Tải file thất bại");
    }
  };

  const handleSearchUngVien = (values: any) => {
    setUvSearch({
      ...uvSearch,
      pageIndex: 1,
      HoTen: values.hoTenEmail || undefined,
      Email: values.hoTenEmail || undefined,
      sdt: values.soDienThoai || undefined,
      NgayUngTuyen: values.ngayUngTuyen ? values.ngayUngTuyen.format("YYYY-MM-DD") : undefined,
      TuyenDungId: id,
    });
  };

  // Hàm lấy số lượng từng trạng thái cho vị trí tuyển dụng này
  const fetchAllStatusCounts = useCallback(async () => {
    try {
      let total = 0;
      const counts: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (let i = 0; i <= 5; i++) {
        const res = await tD_UngVienService.getData({ pageIndex: 1, pageSize: 100, TrangThai: i, TuyenDungId: id });
        if (res.status && res.data) {
          counts[i] = res.data.items.length;
          total += counts[i];
        }
      }
      setStatusCounts(counts);
      setTotalAll(total);
    } catch (e) { }
  }, [id]);

  // Tabs UI
  const statusTabs = [
    {
      key: 'all',
      label: <span><AppstoreOutlined /> Tất cả <span style={{ marginLeft: 8, color: '#1890ff', fontWeight: 600 }}>{totalAll}</span></span>,
      value: null,
      color: '#1890ff',
    },
    {
      key: '0',
      label: <span><ClockCircleOutlined /> Chưa xét duyệt <span style={{ marginLeft: 8, color: '#faad14', fontWeight: 600 }}>{statusCounts[0]}</span></span>,
      value: 0,
      color: '#faad14',
    },
    {
      key: '1',
      label: <span><CheckCircleOutlined /> Đã xét duyệt <span style={{ marginLeft: 8, color: '#52c41a', fontWeight: 600 }}>{statusCounts[1]}</span></span>,
      value: 1,
      color: '#52c41a',
    },
    {
      key: '2',
      label: <span><PauseCircleOutlined /> Đang chờ phỏng vấn <span style={{ marginLeft: 8, color: '#1890ff', fontWeight: 600 }}>{statusCounts[2]}</span></span>,
      value: 2,
      color: '#1890ff',
    },
    {
      key: '5',
      label: <span><CheckCircleOutlined /> Đạt phỏng vấn <span style={{ marginLeft: 8, color: '#722ed1', fontWeight: 600 }}>{statusCounts[5]}</span></span>,
      value: 5,
      color: '#722ed1',
    },
    {
      key: '3',
      label: <span><UserSwitchOutlined /> Đã nhận việc <span style={{ marginLeft: 8, color: '#722ed1', fontWeight: 600 }}>{statusCounts[3]}</span></span>,
      value: 3,
      color: '#722ed1',
    },
    {
      key: '4',
      label: <span><StopOutlined /> Đã từ chối <span style={{ marginLeft: 8, color: '#f5222d', fontWeight: 600 }}>{statusCounts[4]}</span></span>,
      value: 4,
      color: '#f5222d',
    },
    
  ];

  // Khi đổi tab
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    let trangThai: number | undefined = undefined;
    if (key !== 'all') trangThai = Number(key);
    setUvSearch(prev => {
      const newSearch = { ...prev, pageIndex: 1 };
      if (trangThai === undefined) {
        delete newSearch.TrangThai;
      } else {
        newSearch.TrangThai = trangThai;
      }
      return newSearch;
    });
  };

  // Gọi fetchAllStatusCounts khi id thay đổi hoặc khi vào trang
  useEffect(() => {
    if (id) fetchAllStatusCounts();
  }, [id, fetchAllStatusCounts]);

  // Fetch templates
  const fetchTemplates = async (searchText = '') => {
    setTemplateLoading(true);
    try {
      const res = await emailTemplateService.getData({ Name: searchText, pageIndex: 1, pageSize: 20 });
      setTemplateList(res.data?.items || []);
    } catch (e) {
      setTemplateList([]);
    } finally {
      setTemplateLoading(false);
    }
  };
  // Debounce search for template
  const handleTemplateSearch = (value: string) => {
    if (debounceTemplateRef.current) clearTimeout(debounceTemplateRef.current);
    debounceTemplateRef.current = setTimeout(() => {
      fetchTemplates(value);
    }, 400);
  };
  useEffect(() => {
    if (isOpenSendMailModal) fetchTemplates('');
  }, [isOpenSendMailModal]);

  // Fetch loại template khi mở modal gửi mail
  useEffect(() => {
    if (isOpenSendMailModal) {
      setTemplateTypeLoading(true);
      emailTemplateService.getAllLoaiTemplate().then(res => {
        if (res.status && Array.isArray(res.data)) {
          setTemplateTypes(res.data.map((item: any) => ({ label: item.name || item.code, value: item.code })));
        } else {
          setTemplateTypes([]);
        }
        setTemplateTypeLoading(false);
      });
      setSelectedTemplateType(undefined);
      setTemplateListByType([]);
      setTemplateByStatus({});
    }
  }, [isOpenSendMailModal]);

  // Khi chọn loại template, fetch danh sách template theo loại
  const handleTemplateTypeChange = async (typeCode: string) => {
    setSelectedTemplateType(typeCode);
    setTemplateListByType([]);
    setTemplateByStatus({});
    setTemplateLoading(true);
    try {
      const res = await emailTemplateService.getData({ loaiTemPlate: typeCode, pageIndex: 1, pageSize: 50 });
      if (res.status && res.data?.items) {
        setTemplateListByType(res.data.items);
      } else {
        setTemplateListByType([]);
      }
    } finally {
      setTemplateLoading(false);
    }
  };

  // Khi chọn template cho từng trạng thái
  const handleStatusTemplateChange = (status: number, templateId: string) => {
    setTemplateByStatus(prev => ({ ...prev, [status]: templateId }));
  };

  // Gửi mail
  const handleSendMail = async () => {
    // Validate đủ template cho từng trạng thái
    if (!Object.values(templateByStatus).every(Boolean)) {
      toast.error('Chọn template cho tất cả trạng thái!');
      return;
    }
    setSendingMail(true);
    try {
      // Gom kết quả
      let allSuccess = true;
      const errorMessages: string[] = [];
      // Lặp qua từng trạng thái
      for (const st of selectedStatusSet) {
        const templateId = templateByStatus[st];
        // Lấy danh sách ứng viên thuộc trạng thái này
        const ungVienIds = selectedRows.filter(r => r.trangThai === st).map(r => r.id);
        if (ungVienIds.length && templateId) {
          const res = await tD_UngVienService.sendMailToUngViens({
            UngVienIds: ungVienIds,
            EmailTemplateId: templateId
          });
          if (!res.status) {
            allSuccess = false;
            errorMessages.push(res.message || `Gửi email thất bại cho trạng thái ${st}`);
          }
        }
      }
      if (allSuccess) {
        toast.success('Đã gửi email cho tất cả trạng thái!');
        setIsOpenSendMailModal(false);
      } else {
        toast.error(<ul>{errorMessages.map((msg, idx) => <li key={idx}>{msg}</li>)}</ul>);
      }
    } catch (e) {
      toast.error('Gửi email thất bại');
    } finally {
      setSendingMail(false);
    }
  };

  if (loading) return <Spin style={{ margin: 40 }} />;
  if (!data) return <div style={{ margin: 40 }}>Không tìm thấy vị trí tuyển dụng</div>;

  const handleUploadCVs = async () => {
    if (!uploadFiles.length) {
      message.warning("Vui lòng chọn ít nhất 1 file.");
      return;
    }
    setUploading(true);
    try {
      const msg = await tD_UngVienService.uploadCV({
        tuyenDungId: id,
        files: uploadFiles,
      });
      setUploadMessage(msg.message ? msg.message : "Không có message");
      message.success("Tải lên thành công");
      //  setUploadFiles([]); //  Reset file đã chọn
      fetchUngVien(uvSearch); // reload danh sách
    } catch (err) {
      message.error("Tải lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleViewCV = async (ungVien: TD_UngVienDto) => {
    try {
      const blob = await tD_UngVienService.viewCV(ungVien.id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Không revokeObjectURL ngay để tránh lỗi khi tab mới chưa kịp load
    } catch (error) {
      toast.error("Không xem được CV");
    }
  };

const handleDateChange = async (date: Dayjs | null) => {
  if (!currentUngVien) return;
  // setLoading(true);
  try {
    const res = await tD_UngVienService.updateInterviewTime({
      Id: currentUngVien.id,
      ThoiGianPhongVan: date ? date.format("YYYY-MM-DDTHH:mm") : null,
    });
    if (res.status) {
      toast.success("Cập nhật thời gian phỏng vấn thành công");
     
  // Cập nhật thời gian phỏng vấn vào danh sách ứng viên
setUngVienList((prev) => {
  return prev.map((uv) => {
    if (uv.id === currentUngVien.id) {
      const updatedUngVien: TD_UngVienDto = {
        ...uv,
        thoiGianPhongVan: date ? date.toISOString() : null,
      };
      return updatedUngVien;
    }
    return uv;
  });
});

    } else {
      toast.error(res.message || "Cập nhật thất bại");
    }
  } catch (e) {
    toast.error("Cập nhật thất bại");
  } finally {
    // setLoading(false);
  }
};



  return (
    <div style={{ width: '100%' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/TD_TuyenDung">Quản lý vị trí tuyển dụng</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {data?.tenViTri || "Chi tiết"}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={[24, 24]} style={{ margin: 0, gap: 0 }}>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 15 }}>
                <span>Chi tiết vị trí tuyển dụng</span>
                <Tooltip title={showDetail ? 'Thu gọn' : 'Mở rộng'}>
                  <Button
                    shape="circle"
                    type="default"
                    icon={showDetail ? <UpOutlined /> : <DownOutlined />}
                    onClick={() => setShowDetail(v => !v)}
                    style={{ marginLeft: 8 }}
                  />
                </Tooltip>
              </div>
            }
            bordered
            style={{ width: "100%" }}
            bodyStyle={{ display: showDetail ? undefined : 'none', padding: 24, paddingBottom: 24, minHeight: showDetail ? undefined : 32 }}
          >
            <Descriptions bordered column={2} size="middle" labelStyle={{ fontWeight: "bold", width: "30%" }}>
              <Descriptions.Item label="Tên vị trí" span={2}>
                <strong style={{ fontSize: "16px", color: "#1890ff" }}>{data.tenViTri}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Phòng ban">{data.tenPhongBan || "Không xác định"}</Descriptions.Item>
              <Descriptions.Item label="Số lượng cần tuyển">
                <Tag color="blue" style={{ fontSize: "14px", padding: "4px 8px" }}>{data.soLuongCanTuyen} người</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">{dayjs(data.ngayBatDau).format("DD/MM/YYYY")}</Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">{dayjs(data.ngayKetThuc).format("DD/MM/YYYY")}</Descriptions.Item>
              <Descriptions.Item label="Tình trạng" span={2}>
                <Tag color={data.tinhTrang === 0 ? "processing" : data.tinhTrang === 1 ? "error" : "warning"} style={{ fontSize: "14px", padding: "4px 12px" }}>{getTinhTrangLabel(data.tinhTrang)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                <div
                  style={{ maxHeight: "200px", overflowY: "auto", padding: "8px", backgroundColor: "#f5f5f5", borderRadius: "4px", whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{ __html: data.moTa ? DOMPurify.sanitize(data.moTa) : "<span>Không có mô tả</span>" }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Loại tuyển dụng">{getLoaiLabel(data.loai)}</Descriptions.Item>
              <Descriptions.Item label="Hình thức">{getHinhThucLabel(data.hinhThuc)}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{data.createdDate ? dayjs(data.createdDate).format("DD/MM/YYYY") : "Không xác định"}</Descriptions.Item>
              <Descriptions.Item label="Người tạo">{data.createdBy || "Không xác định"}</Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">{data.modifiedDate ? dayjs(data.modifiedDate).format("DD/MM/YYYY") : "Không xác định"}</Descriptions.Item>
              <Descriptions.Item label="Người cập nhật">{data.modifiedBy || "Không xác định"}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Danh sách ứng viên ứng tuyển</span>
                  <Tooltip title={showSearch ? 'Thu gọn tìm kiếm' : 'Mở rộng tìm kiếm'}>
                    <Button
                      shape="circle"
                      type="default"
                      icon={showSearch ? <UpOutlined /> : <DownOutlined />}
                      onClick={() => setShowSearch(v => !v)}
                      style={{ marginLeft: 8 }}
                    />
                  </Tooltip>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {selectedRowKeys.length > 0 && (
                    <Button type="primary" onClick={handleOpenUpdateModal}>Cập nhật trạng thái</Button>
                  )}
                  {selectedRowKeys.length > 0 && (
                    <Button type="primary" onClick={() => setIsOpenSendMailModal(true)}>
                      Gửi email
                    </Button>
                  )}
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => { setCurrentUngVienEdit(null); setIsOpenForm(true); }}
                  >
                    Thêm ứng viên
                  </Button>
                  <Button
                    type="default"
                    icon={<UploadOutlined />}
                    onClick={() => setShowUploadCV(v => !v)}
                  >
                    Thêm ứng viên bằng CV
                  </Button>
                </div>
              </div>
            }
            bordered
            style={{ width: "100%", marginTop: 24 }}
            bodyStyle={{ padding: 0 }}
          >
            {showSearch && (
              <div style={{ padding: 24, paddingBottom: 0 }}>
                <Search onFinish={handleSearchUngVien} />
              </div>
            )}

            {showUploadCV && (
              <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontWeight: 'bold' }}>Chọn file CV ứng viên:</label>
                  <br></br>
                  <div style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    padding: '12px',
                    backgroundColor: '#fafafa',
                    marginTop: 4,
                    marginRight: 8,
                    display: 'inline-block',
                    cursor: 'pointer',
                    width: 'calc(100% - 24px)',
                    maxWidth: 200,
                    position: 'relative',
                  }}>
                    <input
                      type="file"
                      multiple
                      title="Chọn file CV ứng viên"
                      onChange={(e) => {
                        if (e.target.files) {
                          setUploadFiles(Array.from(e.target.files));
                        }
                      }}
                      style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                    />
                  </div>
                  {uploadFiles.length > 0 && (
                    <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                      {uploadFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                  <Button
                    type="primary"
                    loading={uploading}
                    onClick={handleUploadCVs}
                    // disabled={!uploadFiles.length}
                    style={{ marginTop: 12 }}
                  >
                    Tải lên CV ứng viên
                  </Button>
                </div>

                <textarea
                  value={uploadMessage}
                  readOnly
                  rows={6}
                  style={{
                    width: '100%',
                    resize: 'vertical',
                    background: '#f9f9f9',
                    padding: '8px',
                    borderRadius: 4,
                    border: '1px solid #d9d9d9',
                  }}
                  placeholder="Thông báo kết quả sẽ hiển thị ở đây..."
                />
              </div>
            )}


            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              type="card"
              style={{ marginBottom: 16, marginTop: 8 }}
              items={statusTabs}
            />


            <Table
              dataSource={ungVienList}
              loading={uvLoading}
              rowKey="id"
              bordered
              size="middle"
              style={{ width: "100%" }}
              scroll={{ x: "max-content" }}
              rowSelection={{
                selectedRowKeys,
                onChange: (keys, rows) => {
                  setSelectedRowKeys(keys);
                  setSelectedRows(rows as TD_UngVienDto[]);
                },
                preserveSelectedRowKeys: true,
              }}
              pagination={{
                total: uvTotal,
                current: uvSearch.pageIndex,
                pageSize: uvSearch.pageSize,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} ứng viên`,
                onChange: (page, pageSize) => {
                  setUvSearch(prev => ({ ...prev, pageIndex: page, pageSize: pageSize || PAGE_SIZE }));
                },
              }}
              columns={[
                {
                  title: "Họ tên", dataIndex: "hoTen", key: "hoTen", render: (text: string, record: TD_UngVienDto) => (
                    <span
                      style={{ color: '#1890ff', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}
                      onClick={() => handleViewDetail(record)}
                      onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      {text}
                    </span>
                  )
                },
                { title: "Email", dataIndex: "email", key: "email" },
                {
                  title: "SĐT", dataIndex: "soDienThoai", key: "soDienThoai",
                  render: (value: string, record: TD_UngVienDto) => (
                    <span
                      style={{ color: '#1890ff', cursor: 'pointer', textDecoration: 'none', textUnderlineOffset: 2 }}
                      onClick={() => handleOpenUpdateInterview(record)}
                      onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      {value}
                    </span>
                  ),
                },
                { title: "Ngày sinh", dataIndex: "ngaySinh", key: "ngaySinh", render: (value: string) => value ? dayjs(value).format("DD/MM/YYYY") : "-" },
                { title: "Giới tính", dataIndex: "gioiTinh", key: "gioiTinh", render: (value: number) => value === 0 ? "Nam" : value === 1 ? "Nữ" : value === 2 ? "Khác" : "-" },
                { title: "Ngày ứng tuyển", dataIndex: "ngayUngTuyen", key: "ngayUngTuyen", render: (value: string) => value ? dayjs(value).format("DD/MM/YYYY") : "-" },

                // { title: "Thời gian phỏng vấn", dataIndex: "thoiGianPhongVan", key: "thoiGianPhongVan", render: (value: string) => value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-" },
                 { title: "Thời gian phỏng vấn", dataIndex: "thoiGianPhongVan", key: "thoiGianPhongVan", render: (value: string, record: TD_UngVienDto) => record.trangThai === TrangThaiUngVien.DaXetDuyet ?
                 (
                   <DatePicker
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    style={{ width: "100%" }}
                    placeholder="Chọn thời gian phỏng vấn"
                    onClick={() => setCurrentUngVien(record)}
                    onChange={handleDateChange}
                    value={record.thoiGianPhongVan ? dayjs(record.thoiGianPhongVan) : null}
                  />
                 ) : (
                  <span>{record.thoiGianPhongVan ? dayjs(record.thoiGianPhongVan).format("DD/MM/YYYY HH:mm") : "-"}</span>
                 ),
                  },
                { title: "Trạng thái", dataIndex: "trangThai", key: "trangThai", render: (value: number) => {
                  switch (value) {
                    case 0: return "Chưa xét duyệt";
                    case 1: return "Đã xét duyệt";
                    case 2: return "Đang chờ phỏng vấn";
                    case 3: return "Đã nhận việc";
                    case 4: return "Đã từ chối";
                    case 5: return "Đạt phỏng vấn";
                    default: return "-";

                  }
                },
              },
                { title: "Ghi chú", dataIndex: "ghiChuUngVien", key: "ghiChuUngVien", render: (value: string) => value || "-" },
                {
                  title: "CV", dataIndex: "cvFile", key: "cvFile",
                  render: (_: string, record: TD_UngVienDto) => record.cvFile ? (
                    <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewCV(record)} style={{ padding: 0, height: 'auto' }}>Xem CV</Button>
                  ) : <span style={{ color: '#999' }}>Chưa có</span>
                },
                {
                  title: "Thao tác",
                  key: "actions",
                  align: "center" as const,
                  render: (_: any, record: TD_UngVienDto) => {
                    return (
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: "view",
                              label: "Xem chi tiết",
                              icon: <EyeOutlined />, 
                              onClick: () => handleViewDetail(record),
                            },
                            {
                              key: "edit",
                              label: "Cập nhật thông tin",
                              icon: <EditOutlined />,
                              onClick: () => handleEditUngVien(record),
                            },
                            {
                              key: "updateInterviewTime",
                              label: "Cập nhật TG phỏng vấn",
                              icon: <CalendarOutlined />, 
                              onClick: () => handleOpenUpdateInterview(record),
                            },
                            {
                              key: "viewCV",
                              label: "Xem CV",
                              icon: <EyeOutlined />, 
                              onClick: () => handleViewCV(record),
                            },
                            {
                              type: "divider",
                            },
                            {
                              key: "delete",
                              label: "Xóa",
                              icon: <DeleteOutlined />, 
                              danger: true,
                              onClick: () => handleDeleteUngVien(record.id),
                            },
                          ],
                        }}
                        trigger={["click"]}
                      >
                        <Button size="small">Thao tác <DownOutlined style={{ marginLeft: 4 }} /></Button>
                      </Dropdown>
                    );
                  },
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
      {/* Modal cập nhật trạng thái */}
      <Modal
        open={updateModalOpen}
        onCancel={() => setUpdateModalOpen(false)}
        onOk={handleUpdateStatus}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={updateLoading}
        title="Cập nhật trạng thái ứng viên"
      >
        {selectedStatusSet.map(st => (
          <div key={st} style={{ marginBottom: 16 }}>
            <b>Nhóm trạng thái hiện tại: {statusOptions.find(o => o.value === st)?.label || st}</b>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Chọn trạng thái mới"
              options={statusOptions.filter(o => o.value !== st)}
              value={updateStatusMap[st]}
              onChange={val => setUpdateStatusMap(prev => ({ ...prev, [st]: val }))}
            />
          </div>
        ))}
        <div style={{ color: '#888', fontSize: 13 }}>
          * Chỉ các ứng viên thuộc nhóm trạng thái này sẽ được cập nhật sang trạng thái mới tương ứng.
        </div>
      </Modal>
      <UpdateInterviewTimeModal
        open={isOpenUpdateInterview}
        onCancel={handleCloseUpdateInterview}
        onSuccess={handleSuccessUpdateInterview}
        ungVien={currentUngVien}
      />
      <TD_UngVienDetail
        open={isOpenDetail}
        onCancel={handleCloseDetail}
        id={detailUngVienId}
      />
      {/* Form cập nhật/thêm ứng viên */}
      <TD_UngVienForm
        open={isOpenForm}
        onCancel={handleCloseForm}
        onSubmit={handleSubmitForm}
        loading={updateLoading}
        initialValues={currentUngVienEdit}
      />
      {/* Modal gửi email */}
      <Modal
        open={isOpenSendMailModal}
        onCancel={() => setIsOpenSendMailModal(false)}
        onOk={handleSendMail}
        okText="Gửi"
        cancelText="Hủy"
        title="Gửi email cho ứng viên"
        confirmLoading={sendingMail}
      >
        <div style={{ marginBottom: 12 }}>
          <b>Số lượng ứng viên:</b> {selectedRowKeys.length}
        </div>
        <div style={{ marginBottom: 16 }}>
          <b>Trạng thái ứng viên:</b>{' '}
          {Array.from(new Set(selectedRows.map(r => r.trangThai)))
            .map(st => statusOptions.find(o => o.value === st)?.label || st)
            .join(', ')}
        </div>
        <div style={{ marginBottom: 16 }}>
          <b>Chọn loại template:</b>
          <Select
            style={{ width: 240, marginLeft: 8 }}
            placeholder="Chọn loại template"
            loading={templateTypeLoading}
            options={templateTypes}
            value={selectedTemplateType}
            onChange={handleTemplateTypeChange}
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </div>
        {selectedTemplateType && (
          <>
            {selectedStatusSet.map(st => (
              <div key={st} style={{ marginBottom: 16 }}>
                <b>Trạng thái: {statusOptions.find(o => o.value === st)?.label || st}</b>
                <Select
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Chọn template email cho trạng thái này"
                  options={templateListByType.map(t => ({ value: t.id, label: t.name }))}
                  value={templateByStatus[st]}
                  onChange={val => handleStatusTemplateChange(st, val)}
                  loading={templateLoading}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                />
              </div>
            ))}
            <div style={{ color: '#888', fontSize: 13 }}>
              * Mỗi trạng thái ứng viên sẽ nhận email theo template tương ứng.
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TuyenDungDetailPage; 