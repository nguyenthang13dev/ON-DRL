import React, { useState } from "react";
import { Table, Button, Space, Dropdown, Typography, Tag, message } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DownOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { MenuProps } from "antd";
import { DataTableChamCongType } from "@/types/QLNhanSu/nS_ChamCong/nS_ChamCong";
import TrangThaiChamCongConstant from "@/constants/QLNhanSu/TrangThaiChamCongConstant";
import ChamCongDetailModal from "./ChamCongDetailModal";
import EditChamCongModal from "./EditChamCongModal";
import dayjs from "dayjs";
import { useSelector } from "@/store/hooks";
import { VaiTroConstant } from "@/constants/VaiTroConstant";
const { Text } = Typography;

interface Props {
  data: DataTableChamCongType[];
  onEdit?: (record: DataTableChamCongType) => void;
  onView?: (record: DataTableChamCongType) => void;
  onSaveEdit?: (data: any) => Promise<void>;
  startDate?: string;
  endDate?: string;
  currentUserData?: DataTableChamCongType | null; // Data của user hiện tại (cho nhân viên không phải HR)
}

const DataTable: React.FC<Props> = ({
  data,
  onEdit,
  onView,
  onSaveEdit,
  startDate = dayjs()
    .subtract(1, "month")
    .startOf("month")
    .format("DD/MM/YYYY"),
  endDate = dayjs().subtract(1, "month").endOf("month").format("DD/MM/YYYY"),
  currentUserData,
}) => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<DataTableChamCongType | null>(null);
  const user = useSelector((state) => state.auth.User);
  const listRoles = user?.listRole ?? [];
  const isHR =
    listRoles.includes(VaiTroConstant.HR) ||
    listRoles.includes(VaiTroConstant.Admin);

  // Nếu không phải HR/Admin và có data của user hiện tại, hiển thị modal toàn màn hình
  if (!isHR && currentUserData) {
    return (
      <ChamCongDetailModal
        open={true}
        onClose={() => {}} 
        employeeData={currentUserData}
        startDate={startDate}
        endDate={endDate}
        isFullScreen={true}
      />
    );
  }
  const handleViewDetail = (record: DataTableChamCongType) => {
    setSelectedEmployee(record);
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleEditChamCong = (record: DataTableChamCongType) => {
    setSelectedEmployee(record);
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSaveEditChamCong = async (data: any) => {
    try {
      if (onSaveEdit) {
        await onSaveEdit(data);
      }
      setEditModalOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      throw error;
    }
  };
  const generateDateColumns = (): ColumnsType<DataTableChamCongType> => {
    const dateColumns: ColumnsType<DataTableChamCongType> = [];

    const startDateParsed = dayjs(startDate, "DD/MM/YYYY");
    const daysInMonth = startDateParsed.isValid()
      ? startDateParsed.daysInMonth()
      : 31;

    for (let day = 1; day <= daysInMonth; day++) {
      dateColumns.push({
        title: day.toString(),
        dataIndex: ["dataOfDate", `day_${day}`],
        key: `day_${day}`,
        width: 80,
        align: "center",
        render: (value: any) => {
          // Kiểm tra nếu value không tồn tại hoặc không phải object
          if (!value || typeof value !== "object") return "";

          // Kiểm tra trangThai phải tồn tại (bao gồm cả 0)
          if (value.trangThai === undefined || value.trangThai === null)
            return "";

          const { trangThai, gioVao, gioRa } = value;
          if (trangThai === TrangThaiChamCongConstant.ChuaChamCong) {
            return gioVao ? (
              <Text style={{ fontSize: "10px", color: "#1890ff" }}>
                {gioVao}
              </Text>
            ) : (
              ""
            );
          }

          const getStatusTag = (status: number) => {
            const statusInfo = TrangThaiChamCongConstant.getDisplayName(status);
            let color = "default";

            switch (status) {
              case TrangThaiChamCongConstant.BinhThuong:
                color = "green";
                break;
              case TrangThaiChamCongConstant.DiMuon:
                color = "orange";
                break;
              case TrangThaiChamCongConstant.VeSom:
                color = "blue";
                break;
              case TrangThaiChamCongConstant.ChuaChamCong:
                color = "red";
                break;
              default:
                color = "default";
            }

            return (
              <Tag
                color={color}
                style={{ fontSize: "8px", padding: "1px 4px", margin: "1px 0" }}
              >
                {statusInfo}
              </Tag>
            );
          };

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}
            >
              {/* Hiển thị giờ vào (nếu có) */}
              {gioVao && gioVao !== "00:00" && (
                <Text style={{ fontSize: "10px", color: "#1890ff" }}>
                  {gioVao}
                </Text>
              )}

              {/* Hiển thị tag trạng thái */}
              {getStatusTag(trangThai)}
            </div>
          );
        },
      });
    }

    return dateColumns;
  };

  const columns: ColumnsType<DataTableChamCongType> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 50,
      align: "center",
      fixed: "left",
      render: (_, __, index) => (
        <Text strong style={{ color: "#1890ff" }}>
          {index + 1}
        </Text>
      ),
    },

    {
      title: "Mã NV",
      dataIndex: "maNV",
      key: "maNV",
      width: 80,
      fixed: "left",
      render: (text: string) => (
        <Text code style={{ fontSize: "14px" }}>
          {text}
        </Text>
      ),
    },

    {
      title: "Họ và tên",
      dataIndex: "hoTen",
      key: "hoTen",
      width: 150,
      fixed: "left",
      render: (text: string) => (
        <Text strong style={{ fontSize: "12px" }}>
          {text}
        </Text>
      ),
    },

    {
      title: "Chức vụ",
      dataIndex: "chucVu",
      key: "chucVu",
      width: 120,
      fixed: "left",
      render: (text: string) => (
        <Tag color="blue" style={{ fontSize: "10px", margin: 0 }}>
          {text}
        </Tag>
      ),
    },

    // Các cột ngày trong tháng
    ...generateDateColumns(),

    {
      title: "Thao tác",
      key: "action",
      width: 100,
      fixed: "right",
      align: "center",
      render: (_, record: DataTableChamCongType) => {
        const menuItems: MenuProps["items"] = [
          {
            key: "view",
            label: "Xem chi tiết",
            icon: <EyeOutlined />,
            onClick: () => handleViewDetail(record),
          },
          ...(!isHR
            ? []
            : [
                {
                  key: "edit",
                  label: "Chỉnh sửa",
                  icon: <EditOutlined />,
                  onClick: () => handleEditChamCong(record),
                },
              ]),
        ];

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
              }}
            />
          </Dropdown>
        );
      },
    },
  ];

  const tableProps: TableProps<DataTableChamCongType> = {
    columns,
    dataSource: data,
    size: "small",
    bordered: true,
    scroll: {
      x: 3000,
      y: 600,
    },
    pagination: {
      pageSize: 20,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) =>
        `${range[0]}-${range[1]} trong ${total} nhân viên`,
      size: "small",
    },
    sticky: true,
    rowClassName: (_, index) =>
      index % 2 === 0 ? "table-row-light" : "table-row-dark",
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "12px 16px",
          borderRadius: "8px 8px 0 0",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14px",
          marginBottom: "0",
        }}
      >
        BẢNG CHẤM CÔNG CHI TIẾT TỪ NGÀY {startDate} ĐẾN NGÀY {endDate}
      </div>

      <div
        style={{
          background: "#13c2c2",
          color: "white",
          padding: "8px 16px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "12px",
          marginBottom: "0",
        }}
      >
        NGÀY TRONG THÁNG
      </div>

      <Table
        {...tableProps}
        style={{
          border: "1px solid #d9d9d9",
          borderTop: "none",
        }}
      />

      <style jsx>{`
        :global(.table-row-light) {
          background-color: #fafafa;
        }
        :global(.table-row-dark) {
          background-color: #ffffff;
        }
        :global(.ant-table-thead > tr > th) {
          background: #f0f0f0 !important;
          font-weight: bold !important;
          font-size: 11px !important;
          padding: 4px 8px !important;
          text-align: center !important;
        }
        :global(.ant-table-tbody > tr > td) {
          padding: 2px 4px !important;
          font-size: 10px !important;
        }
        :global(.ant-table-cell-fix-left) {
          background: #f9f9f9 !important;
        }
        :global(.ant-table-cell-fix-right) {
          background: #f9f9f9 !important;
        }
      `}</style>

      {/* Detail Modal */}
      <ChamCongDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetail}
        employeeData={selectedEmployee}
        startDate={startDate}
        endDate={endDate}
      />

      {/* Edit Modal */}
      <EditChamCongModal
        open={editModalOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveEditChamCong}
        employeeData={selectedEmployee}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default DataTable;
