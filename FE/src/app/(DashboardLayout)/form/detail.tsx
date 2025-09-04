import React from "react";
import { Drawer, Divider } from "antd";
import { tableNhomDanhMucDataType } from "@/types/nhomDanhMuc/nhomDanhMuc";
import { IdcardOutlined, CodeOutlined, TagsOutlined } from '@ant-design/icons';

interface NhomDanhMucViewProps {
  NhomDanhMuc?: tableNhomDanhMucDataType | null;
  isOpen: boolean;
  onClose: () => void;
}

const NhomDanhMucDetail: React.FC<NhomDanhMucViewProps> = ({
                                                             NhomDanhMuc,
                                                             isOpen,
                                                             onClose,
                                                           }) => {
  return (
      <Drawer
          title={
            <div className="text-lg font-bold text-gray-800 tracking-wide">
              Thông tin nhóm danh mục
            </div>
          }
          width="30%"
          placement="right"
          onClose={onClose}
          closable={true}
          open={isOpen}
          styles={{
            header: {
              borderBottom: "2px solid #e5e7eb",
              padding: "16px 24px",
            },
            body: {
              backgroundColor: "#fafafa",
              padding: "20px",
            }
          }}
      >
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          {infoItem("ID", NhomDanhMuc?.id, <IdcardOutlined />)}
          {infoItem("Mã nhóm danh mục", NhomDanhMuc?.groupCode || "Chưa có", <CodeOutlined />, true)}
          {infoItem("Tên nhóm danh mục", NhomDanhMuc?.groupName || "Chưa có", <TagsOutlined />, true)}
        </div>
      </Drawer>
  );
};

// Helper function to render each info item with improved styling
const infoItem = (label: string, value: any, icon?: React.ReactNode, isHighlighted: boolean = false) => (
    <div className={`mb-4 pb-3 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0
                 transition-all duration-200 hover:bg-gray-50 hover:pl-2 rounded-md`}>
    <span className="text-gray-600 text-sm font-medium block mb-1.5 flex items-center gap-2">
      {icon && <span className="text-gray-500">{icon}</span>}
      {label}:
    </span>
      <span className={`${isHighlighted ? 'text-black font-semibold' : 'text-gray-700 font-medium'}`}>
      {value || "--"}
    </span>
    </div>
);

export default NhomDanhMucDetail;