"use client";
import React from "react";
import { useParams } from "next/navigation";
import { DA_DuAnType } from "@/types/dA_DuAn/dA_DuAn";
import dA_DuAnService from "@/services/dA_DuAn/dA_DuAnService";
import DA_DuAnDetailView from "../detail";
import { toast } from "react-toastify";
import { Spin } from "antd";

const DA_DuAnDetailPage: React.FC = () => {
  const params = useParams();
  const [item, setItem] = React.useState<DA_DuAnType | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    if (params.id) {
      try {
        setLoading(true);
        const response = await dA_DuAnService.get(params.id as string);
        if (response?.status && response.data) {
          setItem(response.data);
        } else {
          toast.error("Không thể tải thông tin dự án");
        }
      } catch (error) {
        console.error("Error fetching project detail:", error);
        toast.error("Có lỗi xảy ra khi tải thông tin dự án");
      } finally {
        setLoading(false);
      }
    }
  }, [params.id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Không tìm thấy thông tin dự án
      </div>
    );
  }

  return (
    <DA_DuAnDetailView 
      item={item} 
      itemId={params.id as string} 
      onRefresh={handleRefresh}
    />
  );
};

export default DA_DuAnDetailPage;