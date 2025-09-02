"use client";

import React, { useState, useEffect } from 'react';
import FormApply from '../formApply';
import { TD_TuyenDungType } from '@/types/TD_TuyenDung/TD_TuyenDung';
import { useParams, useRouter } from 'next/navigation'
import tdTuyenDungService from '@/services/TD_TuyenDung/TD_TuyenDungService';
import { setIsLoading } from '@/store/general/GeneralSlice';



const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<TD_TuyenDungType | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const router = useRouter();

  // Giả sử bạn fetch dữ liệu từ API, thay thế bằng API thực tế của bạn
  useEffect(() => {
    // Ví dụ fetch dữ liệu công việc theo id
    const fetchJob = async() => {
      try {
        tdTuyenDungService.get(id).then((response) => {
          if (response.status && response.data) {
            setData(response.data);
          }});
      } catch (error) {
        console.error('Lỗi:', error);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id]);

  if (!data) return <div>Đang tải dữ liệu...</div>;

  const isHiring = data.tinhTrang === 0;

  const handleApplySuccess = () => {
    console.log('Ứng tuyển thành công!');
    setShowApplyForm(false);
  };

  const handleCloseApplyForm = () => {
    setShowApplyForm(false);
  };

  const getJobStatus = () => {
    switch (data.tinhTrang) {
      case 0: return <span className="text-green-600 font-bold">Đang tuyển</span>;
      case 1: return <span className="text-red-600 font-bold">Đã đóng</span>;
      case 2: return <span className="text-yellow-600 font-bold">Hoãn</span>;
      default: return <span className="text-gray-600">Không xác định</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{data.tenViTri}</h1>
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {getJobStatus()}
          </div>
          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Số lượng: {data.soLuongCanTuyen}
          </div>
          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {new Date(data.ngayBatDau.toString()).toLocaleDateString('vi-VN')} - {new Date(data.ngayKetThuc.toString()).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Mô tả công việc */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Mô tả công việc</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: data.moTa ?? "" }}
        />
      </div>

      {/* Thông tin bổ sung */}
      <div className="bg-gray-50 p-5 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Thông tin tuyển dụng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-600">Ngày bắt đầu:</h3>
            <p>{new Date(data.ngayBatDau.toString()).toLocaleDateString('vi-VN')}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Ngày kết thúc:</h3>
            <p>{new Date(data.ngayKetThuc.toString()).toLocaleDateString('vi-VN')}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Số lượng cần tuyển:</h3>
            <p>{data.soLuongCanTuyen}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-600">Trạng thái:</h3>
            <p>{getJobStatus()}</p>
          </div>
        </div>
      </div>

      {/* Nút ứng tuyển */}
      <div className="text-center mt-10">
        {isHiring ? (
          <button
            onClick={() => setShowApplyForm(true)}
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
          >
            Ứng tuyển ngay
          </button>
        ) : (
          <div className="bg-gray-200 text-gray-700 py-3 px-6 rounded-full inline-block">
            Đã kết thúc tuyển dụng
          </div>
        )}
      </div>

      {/* Form ứng tuyển */}
      {showApplyForm && (
        <FormApply
          onClose={handleCloseApplyForm}
          onSuccess={handleApplySuccess}
            donUngTuyen={{
              ViTriId: data.id,
                TrangThai: data.tinhTrang, // Mới
                GhiChu: 'null',
                NgayNopDon: new Date().toISOString().split('T')[0],
            }}
        />
      )}
    </div>
  );
};

export default JobDetail;