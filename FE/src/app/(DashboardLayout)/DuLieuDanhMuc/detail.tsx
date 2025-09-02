import React from 'react';
import { Drawer } from 'antd';
import { tableDuLieuDanhMucDataType } from '@/types/duLieuDanhMuc/duLieuDanhMuc';
import dynamic from 'next/dynamic';
import {
  CodeOutlined,
  FontSizeOutlined,
  OrderedListOutlined,
  BankOutlined,
  FileTextOutlined,
  PaperClipOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

interface DuLieuDanhMucViewProps {
  DuLieuDanhMuc?: tableDuLieuDanhMucDataType | null;
  isOpen: boolean;
  onClose: () => void;
}

const DuLieuDanhMucDetail: React.FC<DuLieuDanhMucViewProps> = ({
  DuLieuDanhMuc,
  isOpen,
  onClose,
}) => {
  return (
    <Drawer
      title={
        <div className="text-lg font-bold text-gray-800 tracking-wide">
          Thông tin danh mục
        </div>
      }
      width="50%"
      placement="right"
      onClose={onClose}
      closable={true}
      open={isOpen}
      styles={{
        header: {
          borderBottom: '2px solid #e5e7eb',
          padding: '16px 24px',
        },
        body: {
          backgroundColor: '#fafafa',
          padding: '20px',
        },
      }}
    >
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        {infoItem(
          'Mã danh mục',
          DuLieuDanhMuc?.code || 'Chưa có',
          <CodeOutlined />,
          true
        )}
        {infoItem(
          'Tên danh mục',
          DuLieuDanhMuc?.name || 'Chưa có',
          <FontSizeOutlined />,
          true
        )}
        {infoItem(
          'Thứ tự hiển thị',
          DuLieuDanhMuc?.priority || 'Chưa có',
          <OrderedListOutlined />
        )}
        {infoItem(
          'Đơn vị',
          DuLieuDanhMuc?.tenDonVi || 'Chưa có',
          <BankOutlined />
        )}
        {infoItem(
          'Ghi chú',
          DuLieuDanhMuc?.note || 'Chưa có',
          <InfoCircleOutlined />
        )}

        {infoItem(
          'Tài liệu đính kèm',
          DuLieuDanhMuc?.duongDanFile ? (
            <a
              href={`${StaticFileUrl}${DuLieuDanhMuc?.duongDanFile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <PaperClipOutlined /> {DuLieuDanhMuc.tenFileDinhKem}
            </a>
          ) : (
            'Không có tài liệu'
          ),
          <PaperClipOutlined />
        )}

        <div className="mb-6 pb-3 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
          <span className="text-gray-600 text-sm font-medium block mb-2 flex items-center gap-2">
            <span className="text-gray-500">
              <FileTextOutlined />
            </span>
            Nội dung:
          </span>
          <style jsx global>{`
            .ql-toolbar.ql-snow {
              display: none;
            }
          `}</style>
          <div className="bg-white rounded border border-gray-200">
            <ReactQuill
              readOnly
              value={DuLieuDanhMuc?.noiDung ?? ''}
              theme="snow"
              modules={{ toolbar: false }}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

// Helper function to render each info item with improved styling
const infoItem = (
  label: string,
  value: any,
  icon?: React.ReactNode,
  isHighlighted: boolean = false
) => (
  <div
    className={`mb-4 pb-3 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0
               transition-all duration-200 hover:bg-gray-50 hover:pl-2 rounded-md`}
  >
    <span className="text-gray-600 text-sm font-medium block mb-1.5 flex items-center gap-2">
      {icon && <span className="text-gray-500">{icon}</span>}
      {label}:
    </span>
    <span
      className={`${
        isHighlighted ? 'text-black font-semibold' : 'text-gray-700 font-medium'
      }`}
    >
      {value || '--'}
    </span>
  </div>
);

export default DuLieuDanhMucDetail;
