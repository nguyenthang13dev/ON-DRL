"use client";

import React, { useCallback, useEffect, useState } from 'react';
import FormApply from './formApply';
import JobDetail from './[id]/page';
import { TD_TuyenDungSearchType, TD_TuyenDungType } from '@/types/TD_TuyenDung/TD_TuyenDung';
import { ResponsePageList } from '@/types/general';
import { Input, Spin, Select, Pagination, Breadcrumb, Card, Tag, Button } from 'antd';
import { SearchOutlined, HomeOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setIsLoading } from '@/store/general/GeneralSlice';
import tdTuyenDungService from '@/services/TD_TuyenDung/TD_TuyenDungService';
import { toast } from 'react-toastify';
import TDItem from './component/TuyenDungItem';

const TD_UngVien = () => {

  const [listData, setListData] = useState<TD_TuyenDungType[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageList<TD_TuyenDungType[]>>();
  const [loading, setLoading] = useState(false);
  const [searchValues, setSearchValues] = useState<TD_TuyenDungSearchType>({
    pageIndex: 1,
    pageSize: 10,
    tenViTri: '',
    tinhTrang: 0,
  });
    const dispatch = useDispatch<AppDispatch>();
      const handleGetListData = useCallback(
    async (searchData?: TD_TuyenDungSearchType) => {
      try {
        setLoading(true);
        dispatch(setIsLoading(true));
        const searchParam = searchData || searchValues;
        const response = await tdTuyenDungService.getData(searchParam);
        if (response.status && response.data) {
          setListData(response.data.items);
          setDataPage(response.data);
          
        } else {
          toast.error(response.message || "Lỗi lấy dữ liệu");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu");
      } finally {
        setLoading(false);
        dispatch(setIsLoading(false));
      }
    },
    [searchValues, dispatch]
  );

  useEffect(() => {
    handleGetListData();
  }, [handleGetListData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValues((prev) => ({
      ...prev,
      tenViTri: e.target.value,
      pageIndex: 1,
    }));
  };

  useEffect(() => {
    handleGetListData();
  }, [searchValues.tinhTrang, searchValues.tenViTri]);

  const handleSuggestionClick = (text: string) => {
    setSearchValues(prev => ({
      ...prev,
      tenViTri: text,
      pageIndex: 1,
    }));
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setSearchValues(prev => ({
      ...prev,
      pageIndex: page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setSearchValues(prev => ({
      ...prev,
      pageIndex: 1,
      pageSize: size,
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <Breadcrumb
          className="mb-6 text-sm"
          items={[
            {
              href: '/',
              title: <HomeOutlined />,
            },
            {
              title: 'Danh sách việc làm',
            },
          ]}
        />
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800">DANH SÁCH VIỆC LÀM</h1>
        
        {/* Search */}
        <Card className="mb-6 rounded-lg shadow-sm">
          <Input
            allowClear
            placeholder="Nhập tiêu đề việc làm, tên công ty..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchValues.tenViTri}
            onChange={handleSearchChange}
            className="rounded-lg h-12 text-base"
            size="large"
          />
          
         
        </Card>

        {/* Tổng số việc làm và bộ lọc */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-gray-600 mb-6 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm flex-1">
            <span className="font-medium">Tổng: </span>
            <span className="font-semibold text-blue-600">{listData.length || 0}</span> việc làm
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2">
            <span className="text-gray-700">Hiển thị:</span>
            <Select
              value={searchValues.pageSize}
              onChange={size => handlePageSizeChange(1, size)}
              style={{ width: 80 }}
              options={[
                { value: 10, label: '10' },
                { value: 20, label: '20' },
                { value: 50, label: '50' },
              ]}
              size="middle"
            />
          </div>
        </div>

        {/* VIỆC LÀM NỔI BẬT */}
        {/* {highlightedJobs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-red-500 w-1 h-6 mr-2"></span>
              VIỆC LÀM NỔI BẬT
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {highlightedJobs.map((item) => (
                <Card key={item.id} className="rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <Tag color="red" className="font-semibold">Nổi bật</Tag>
                    <span className="text-gray-500 text-sm">Tổng tuyển 2 tuần trước</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{item.tenViTri}</h3>
                  <p className="text-gray-600 mb-2">Công ty Cổ phần Công nghệ HiNET Việt Nam</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="text-gray-700 font-medium">Đã Nắng</span>
                      <span className="text-blue-600 font-bold ml-2">8Tr ~ 12Tr VND</span>
                    </div>
                    <Button 
                      type="primary" 
                      className="bg-blue-600 hover:bg-blue-700"
                      href={`/tuyenDung/${item.id}`}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )} */}

        {/* Danh sách công việc chính */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : listData && listData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {listData.map((item) => (
                  <TDItem
                    key={item.id}
                    TenViTri={item.tenViTri}
                    TenCongTy="Công ty Cổ phần Công nghệ HiNET Việt Nam" // Thay bằng dữ liệu thực tế
                    DiaDiem="Ha Noi" // Thay bằng dữ liệu thực tế
                    MucLuong="---" // Thay bằng dữ liệu thực tế
                    SoLuong={item.soLuongCanTuyen}
                    NgayBatDau={new Date(item.ngayBatDau.toString())}
                    href={`/tuyenDung/${item.id}`}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Pagination
                current={searchValues.pageIndex}
                pageSize={searchValues.pageSize}
                total={dataPage?.totalCount || 0}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="pagination-custom"
              />
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 py-10 bg-white rounded-lg shadow-sm">
            <p className="text-lg">Không có công việc nào được đăng tuyển.</p>
          </div>
        )}

        {/* Footer quảng cáo */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p className="mb-2">Nền tảng kết nối tuyển dụng thông minh i-Job.vn</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span>Bảo mật</span>
            <span>Điều khoản</span>
            <span>Liên hệ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TD_UngVien;