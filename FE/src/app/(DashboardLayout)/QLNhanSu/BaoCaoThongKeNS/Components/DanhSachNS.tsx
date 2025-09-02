"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Spin, Select, Card } from "antd";
import { BaoCaoTHongKeNS } from "@/types/QLNhanSu/thongKeBaoCao/thongKeBaoCao";
import thongKeBaoCaoService from "@/services/QLNhanSu/ThongKeBaoCao/thongKeBaoCaoService";
import FilterKeys from "@/constants/QLNhanSu/CommonNSConstant";

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const DanhSachNS: React.FC = () => {
  const [data, setData] = useState<BaoCaoTHongKeNS[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>(
    FilterKeys.Department
  );

  // Tạo options cho dropdown
  const filterOptions = [
    {
      value: FilterKeys.Department,
      label: FilterKeys.getDisplayName("Department"),
    },
    {
      value: FilterKeys.Gender,
      label: FilterKeys.getDisplayName("Gender"),
    },
    {
      value: FilterKeys.StatusWork,
      label: FilterKeys.getDisplayName("StatusWork"),
    },
  ];

  // Tạo màu sắc cho chart
  const generateColors = (count: number) => {
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#FF6384",
      "#C9CBCF",
      "#4BC0C0",
      "#FF6384",
    ];
    return colors.slice(0, count);
  };

  // Chuẩn bị dữ liệu cho Doughnut chart
  const chartData = {
    labels: data.map((item) => item.nameSearch || "Không xác định"),
    datasets: [
      {
        label: "Số lượng nhân viên",
        data: data.map((item) => item.total),
        backgroundColor: generateColors(data.length),
        borderColor: generateColors(data.length).map((color) => color),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  // Tùy chọn hiển thị cho chart
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = data.reduce((sum, item) => sum + item.total, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} người (${percentage}%)`;
          },
        },
      },
    },
  };

  // Gọi API để lấy dữ liệu
  const fetchData = async (searchKey?: string) => {
    try {
      setLoading(true);
      // Sử dụng searchKey hoặc selectedFilter hoặc mặc định là Department
      const searchValue = searchKey || selectedFilter || FilterKeys.Department;

      const response = await thongKeBaoCaoService.ThongKeNhanSu(searchValue);
      if (response.status && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API thống kê nhân sự:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi thay đổi filter
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    fetchData(value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          fontSize: "16px",
          color: "#999",
        }}
      >
        Không có dữ liệu để hiển thị
      </div>
    );
  }

  return (
    <Card
      title="Thống kê nhân sự theo:"
      style={{ height: "400px" }}
      bodyStyle={{ height: "calc(100% - 57px)" }}
    >
      <div style={{ height: "100%" }}>
        <div
          style={{
            height: "calc(100% - 40px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header với tiêu đề và dropdown */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <Select
              value={selectedFilter}
              onChange={handleFilterChange}
              options={filterOptions}
              style={{ minWidth: 200 }}
              placeholder="Chọn loại thống kê"
            />
          </div>

          {/* Chart */}
          <div style={{ flex: 1, minHeight: "250px" }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "16px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            Tổng số nhân viên: {data.reduce((sum, item) => sum + item.total, 0)}{" "}
            người
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DanhSachNS;
