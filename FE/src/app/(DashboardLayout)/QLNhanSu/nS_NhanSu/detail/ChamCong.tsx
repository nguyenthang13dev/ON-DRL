import TrangThaiChamCongConstant from "@/constants/QLNhanSu/TrangThaiChamCongConstant";
import nS_ChamCongService from "@/services/QLNhanSu/nS_ChamCong/nS_ChamCongService";
import {
  DataChamCongDto,
  DataTableSearch,
} from "@/types/QLNhanSu/nS_ChamCong/nS_ChamCong";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  GiftOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  RestOutlined,
} from "@ant-design/icons";
import { Calendar, Select, Space, Spin, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const statusMap: Record<
  number,
  { color: string; text: string; icon?: React.ReactNode }
> = {
  0: {
    color: "#52c41a",
    text: "Đúng giờ",
    icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  },
  1: {
    color: "#faad14",
    text: "Đi muộn",
    icon: <ClockCircleOutlined style={{ color: "#faad14" }} />,
  },
  3: {
    color: "#1890ff",
    text: "Chưa điểm danh",
    icon: <QuestionCircleOutlined style={{ color: "#1890ff" }} />,
  },
};

interface Props {
  maNV: string;
}

const ChamCong: React.FC<Props> = ({ maNV }) => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [data, setData] = useState<DataChamCongDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (date: Dayjs) => {
    setLoading(true);
    try {
      const searchData: DataTableSearch = {
        month: date.month() + 1,
        year: date.year(),
        maNV: maNV,
      };

      const res = await nS_ChamCongService.getDataChamCong(searchData);
      if (res.status) {
        setData(res.data);
      } else {
        setData([]);
        toast.error("Không tìm thấy dữ liệu");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Không tìm thấy dữ liệu");
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (maNV != "") {
      fetchData(currentDate);
    }
  }, [currentDate, maNV]);

  const dateCellRender = (value: Dayjs) => {
    const dayISO = value.startOf("day").toISOString();

    const record = data.find((item) => {
      if (!item.ngayDiemDanh) return false;
      const itemDate = dayjs(item.ngayDiemDanh).startOf("day").toISOString();
      return itemDate === dayISO;
    });

    if (!record) return null;

    let status = statusMap[record.trangThai ?? 0];
    if (record.isNghiPhep) {
      status = {
        color: "#fa541c",
        text: "Nghỉ phép",
        icon: <RestOutlined />,
      };
    } else if (record.isNgayLe) {
      status = {
        color: "#722ed1",
        text: record.note ?? "Nghỉ lễ",
        icon: <GiftOutlined />,
      };
    }

    const showStatus =
      record.isNgayLe ||
      dayjs(record.ngayDiemDanh).day() !== 0 ||
      record.trangThai === TrangThaiChamCongConstant.BinhThuong ||
      record.trangThai === TrangThaiChamCongConstant.DiMuon;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 4,
          padding: "0 2px",
        }}
      >
        {showStatus && (
          <Typography.Text
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: status.color,
              lineHeight: 1.2,
              textAlign: "center",
              paddingBottom: "10px",
            }}
            ellipsis
          >
            {status.text}
          </Typography.Text>
        )}

        {dayjs(record.ngayDiemDanh).day() === 0 && (
          <Typography.Text
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#ff0000",
              lineHeight: 1.2,
              textAlign: "center",
              paddingBottom: "10px",
            }}
            ellipsis
          >
            Chủ nhật
          </Typography.Text>
        )}

        {record.gioVao &&
          record.trangThai !== TrangThaiChamCongConstant.ChuaChamCong &&
          !record.isNgayLe && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {record.gioVao}
            </Typography.Text>
          )}
      </div>
    );
  };

  const headerRender = ({ value }: any) => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      label: `Tháng ${i + 1}`,
      value: i,
    }));

    const years = Array.from({ length: 10 }, (_, i) => {
      const year = dayjs().year() - 5 + i;
      return { label: year, value: year };
    });

    return (
      <Space style={{ padding: "8px 16px" }}>
        <Select
          value={value.month()}
          onChange={(month) => {
            const newDate = value.month(month);
            setCurrentDate(newDate);
          }}
          options={months}
          style={{ width: 120 }}
        />
        <Select
          value={value.year()}
          onChange={(year) => {
            const newDate = value.year(year);
            setCurrentDate(newDate);
          }}
          options={years}
          style={{ width: 120 }}
        />
      </Space>
    );
  };

  return (
    <Spin spinning={loading}>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Calendar
          value={currentDate}
          onPanelChange={(date) => setCurrentDate(date)}
          dateCellRender={dateCellRender}
          headerRender={headerRender}
          fullscreen
        />
      </div>
    </Spin>
  );
};

export default ChamCong;
