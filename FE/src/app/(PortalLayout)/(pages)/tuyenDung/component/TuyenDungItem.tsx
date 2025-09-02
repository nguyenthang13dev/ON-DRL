"use client";

import Link from 'next/link';
import React from 'react';

interface TDItemProps {
  TenViTri: string;
  TenCongTy: string;
  DiaDiem: string;
  MucLuong: string;
  SoLuong: number;
  NgayBatDau: Date;
  href: string;
}

const TDItem: React.FC<TDItemProps> = ({
  TenViTri,
  TenCongTy,
  DiaDiem,
  MucLuong,
  NgayBatDau,
  href
}) => {
  const tinhSoNgayTruoc = (ngayBatDau: Date): string => {
    const homNay = new Date();
    const ngayTruoc = new Date(ngayBatDau);
    const soNgay = Math.floor((homNay.getTime() - ngayTruoc.getTime()) / (1000 * 3600 * 24));
    
    if (soNgay === 0) return 'Hôm nay';
    if (soNgay === 1) return '1 ngày trước';
    return `${soNgay} ngày trước`;
  };

  return (
    // BỎ class "block group" ở thẻ Link
    <Link href={href}>
      {/* THÊM class "block group" vào thẻ div bên trong */}
      <div className="block group bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all duration-300 
                      hover:shadow-lg hover:bg-sky-50"> {/* 👈 Sửa tại đây */}
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg truncate mr-2 text-[#3e79f7] group-hover:text-black transition-colors">
                {TenViTri}
              </h3>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                Đăng tuyển: {tinhSoNgayTruoc(NgayBatDau)}
              </span>
            </div>
            
            <p className="text-gray-600 mt-1">{TenCongTy}</p>
            
            <div className="flex flex-wrap items-center mt-3 gap-x-4 gap-y-1">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">{DiaDiem}</span>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-800 font-medium">{MucLuong}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TDItem;