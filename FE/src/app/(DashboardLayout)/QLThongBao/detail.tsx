import { QLThongBaoType } from "@/types/QLThongBao/QLThongBao";
import
  {
    CalendarOutlined,
    CodeOutlined,
    InfoCircleOutlined,
    NumberOutlined,
    SnippetsOutlined,
  } from "@ant-design/icons";
import { Drawer } from "antd";
import dayjs from "dayjs";
import React from "react";

interface Props {
  item?: QLThongBaoType | null;
  onClose: () => void;
}

const QLThongBaoDetail: React.FC<Props> = ({ item, onClose }) => {
  return (
    <Drawer
      title={
        <div className="text-l font-bold text-gray-800 tracking-wide">
          Thông tin lãnh đạo
        </div>
      }
      width="380px"
      placement="right"
      onClose={onClose}
      closable={true}
      open={true}
      styles={{
        header: {
          borderBottom: "2px solid #e5e7eb",
          padding: "16px 24px",
        },
        body: {
          backgroundColor: "#fafafa",
          borderRadius: "8px",
          padding: "20px",
        },
      }}
    >
      <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
        {infoItem("Tiêu đề", item?.tieuDe, <NumberOutlined />, true)}
        {infoItem("Nội dung", item?.noiDung, <SnippetsOutlined />)}
        {infoItem("Loại thông báo", item?.loaiThongBao, <InfoCircleOutlined />)}
        {infoItem("Mã thông báo", item?.maThongBao, <CodeOutlined />)}
        {infoItem(
          "Ngày tạo",
          dayjs(item?.ngayTao).format("DD-MM-YYYY"),
          <CalendarOutlined />
        )}
      </div>
    </Drawer>
  );
};
const infoItem = (
  label: string,
  value: string | undefined,
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
        isHighlighted
          ? "text-black font-semibold text-lg"
          : "text-gray-700 font-medium"
      }`}
    >
      {value || "--"}
    </span>
  </div>
);
export default QLThongBaoDetail;
