"use client";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, Dropdown, MenuProps, Modal, Pagination, Space, Table, TableProps, Input, Select } from "antd";
import { DownOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Search from "./search";
import EditDialog from "./EditDialog";
import AddManyDialog from "./AddManyDialog";
import nS_NgayLeService from "@/services/nS_NgayLe/nS_NgayLeService";
import { NS_NgayLeDto, NS_NgayLeSearchType, NS_NgayLeCreateUpdateType, PagedList } from "@/types/nS_NgayLe/NS_NgayLe";
import KeThuaNgayLe from "./KeThuaNgayLe";
import { useRef } from "react";

const PAGE_SIZE = 20;

const NS_NgayLePage: React.FC = () => {
  const [data, setData] = useState<NS_NgayLeDto[]>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchValues, setSearchValues] = useState<NS_NgayLeSearchType>({});
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<NS_NgayLeDto | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [openMultiDialog, setOpenMultiDialog] = useState(false);
  const [openKeThua, setOpenKeThua] = useState(false);
  const [importYear, setImportYear] = useState<number>(new Date().getFullYear());
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importLoaiNLCode, setImportLoaiNLCode] = useState<string>("");
  const [loaiNgayLeOptions, setLoaiNgayLeOptions] = useState<{ code: string; name: string }[]>([]);

  // Lấy loại ngày lễ khi mở modal import
  useEffect(() => {
    if (importModalOpen) {
      nS_NgayLeService.getLoaiNgayLe().then(resLoai => {
        if (resLoai.data?.status && Array.isArray(resLoai.data.data)) {
          const opts = resLoai.data.data.map((item: any) => ({
            code: item.code || item.Code,
            name: item.name || item.Name,
          }));
          setLoaiNgayLeOptions(opts);
          setImportLoaiNLCode(opts[0]?.code || "");
        } else {
          setLoaiNgayLeOptions([]);
        }
      });
    }
  }, [importModalOpen]);

  const fetchData = useCallback(async (params?: NS_NgayLeSearchType) => {
    setLoading(true);
    try {
      const res = await nS_NgayLeService.getData({
        pageIndex,
        pageSize: PAGE_SIZE,
        sortColumn: "CreatedDate",
        sortOrder: "desc",
        ...params,
      });
      if (res.data?.status) {
        setData(res.data.data?.items || []);
        setTotal(res.data.data?.totalCount || 0);
      } else {
        toast.error(res.data?.message || "Lấy dữ liệu thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [pageIndex]);

  useEffect(() => {
    fetchData(searchValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const handleSearch = (values: NS_NgayLeSearchType) => {
    setSearchValues(values);
    setPageIndex(1);
    fetchData({ ...values, pageIndex: 1 });
  };

  const handleShowModal = (item?: NS_NgayLeDto) => {
    setCurrentItem(item || null);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setCurrentItem(null);
    setIsOpenModal(false);
  };

  const handleCreateOrUpdate = async (values: NS_NgayLeCreateUpdateType) => {
    fetchData(searchValues);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setLoading(true);
    try {
      const res = await nS_NgayLeService.delete(confirmDeleteId);
      if (res.data?.status) {
        toast.success("Xóa thành công!");
        fetchData(searchValues);
      } else {
        toast.error(res.data?.message || "Xóa thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi xóa dữ liệu");
    } finally {
      setConfirmDeleteId(null);
      setLoading(false);
    }
  };

  // Hàm lấy danh sách ngày lễ theo năm
  const fetchNgayLeByNam = async (nam: number) => {
    const res = await nS_NgayLeService.getData({ pageIndex: 1, pageSize: 100, nam: String(nam) });
    if (res.data?.status) {
      return (res.data.data?.items || []).map(item => ({
        id: Number(item.id),
        tenNgayLe: item.tenNgayLe,
        ngayBatDau: item.ngayBatDau,
        ngayKetThuc: item.ngayKetThuc,
        tenLoaiNL: item.tenLoaiNL,
      }));
    }
    return [];
  };

  // Hàm kế thừa dữ liệu năm cũ sang năm mới
  const handleKeThua = async (namMoi: number, namCu: number) => {
    await nS_NgayLeService.keThuaDuLieuNamCu({ namKeThua: String(namCu), namDuocKeThua: String(namMoi) });
    fetchData(searchValues);
    setOpenKeThua(false);
  };

  const tableColumns: TableProps<NS_NgayLeDto>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) => (pageIndex - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: "Tên ngày lễ",
      dataIndex: "tenNgayLe",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "ngayBatDau",
      render: (val: string) => dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngayKetThuc",
      render: (val: string) => dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "Loại",
      dataIndex: "tenLoaiNL",
      render: (val: string) => val || "-",
    },
    {
      title: "Mô tả",
      dataIndex: "moTa",
    },
    {
      title: "Năm",
      dataIndex: "nam",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (val: string) => (val === "HoatDong" ? "Hoạt động" : "Không hoạt động"),
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      render: (_: any, record: NS_NgayLeDto) => {
        const items: MenuProps["items"] = [
          {
            label: "Chỉnh sửa",
            key: "edit",
            icon: <EditOutlined />,
            onClick: () => handleShowModal(record),
          },
          {
            type: "divider",
          },
          {
            label: "Xóa",
            key: "delete",
            danger: true,
            icon: <DeleteOutlined />,
            onClick: () => setConfirmDeleteId(record.id),
          },
        ];
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button onClick={e => e.preventDefault()} size="small">
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

  return (
    <Card title="Quản lý ngày nghỉ lễ" extra={
      <div >
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => setImportModalOpen(true)}>
          Import Chủ nhật
        </Button>
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => setOpenKeThua(true)}>Kế thừa</Button>
        <Button type="primary" onClick={() => setOpenMultiDialog(true)}>Thêm nhiều ngày lễ theo năm</Button>
      </div>
    }>
      <Search onSearch={handleSearch} />
      <Table
        columns={tableColumns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
      />
      <Pagination
        style={{ marginTop: 16, textAlign: "right" }}
        total={total}
        pageSize={PAGE_SIZE}
        current={pageIndex}
        onChange={setPageIndex}
        showSizeChanger={false}
      />
      <EditDialog 
        open={isOpenModal} 
        onClose={handleCloseModal} 
        onSuccess={handleCreateOrUpdate} 
        item={currentItem} 
      />
      <Modal
        open={!!confirmDeleteId}
        onCancel={() => setConfirmDeleteId(null)}
        onOk={handleDelete}
        title="Xác nhận xóa"
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        Bạn có chắc chắn muốn xóa ngày lễ này?
      </Modal>
      <AddManyDialog open={openMultiDialog} onClose={() => setOpenMultiDialog(false)} onSuccess={() => fetchData(searchValues)} />
      <Modal
        open={openKeThua}
        onCancel={() => setOpenKeThua(false)}
        footer={null}
        title="Kế thừa ngày nghỉ lễ theo năm"
        width={1500}
        destroyOnClose
      >
        <KeThuaNgayLe fetchNgayLeByNam={fetchNgayLeByNam} onKeThua={handleKeThua} />
      </Modal>
      {/* Modal import Chủ nhật */}
      <Modal
        open={importModalOpen}
        onCancel={() => setImportModalOpen(false)}
        onOk={async () => {
          setImportLoading(true);
          try {
            if (!importLoaiNLCode) {
              toast.error("Vui lòng chọn loại ngày lễ!");
              setImportLoading(false);
              return;
            }
            const resImport = await nS_NgayLeService.importAllSundays(importYear, importLoaiNLCode);
            if (resImport.data?.status) {
              toast.success("Import Chủ nhật thành công!");
              fetchData(searchValues);
              setImportModalOpen(false);
            } else {
              toast.error(resImport.data?.message || "Import thất bại");
            }
          } catch {
            toast.error("Import thất bại");
          } finally {
            setImportLoading(false);
          }
        }}
        okText="Import"
        cancelText="Hủy"
        confirmLoading={importLoading}
        title="Import tất cả Chủ nhật trong năm"
      >
        <div style={{ marginBottom: 12 }}>
          <b>Năm:</b>{" "}
          <Input
            type="number"
            min={2000}
            max={2200}
            value={importYear}
            onChange={e => setImportYear(Number(e.target.value))}
            style={{ width: 120 }}
          />
        </div>
        <div>
          <b>Loại ngày lễ:</b>{" "}
          <Select
            value={importLoaiNLCode}
            onChange={setImportLoaiNLCode}
            style={{ width: 200 }}
            placeholder="Chọn loại ngày lễ"
          >
            {loaiNgayLeOptions.map(opt => (
              <Select.Option key={opt.code} value={opt.code}>{opt.name}</Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
    </Card>
  );
};

export default NS_NgayLePage; 