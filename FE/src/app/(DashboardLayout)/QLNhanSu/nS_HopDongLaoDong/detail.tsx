import React from "react";
import { Drawer, Divider, message } from "antd";
import { NS_HopDongLaoDongType } from "@/types/QLNhanSu/nS_HopDongLaoDong/nS_HopDongLaoDong";
import * as extensions from "@/utils/extensions";
import da from "../../../../../public/goJs/go";
import dayjs from "dayjs";
import LoaiHopDongLaoDongConstant from "@/constants/QLNhanSu/LoaiHopDongLaoDongConstant";
import nS_NhanSuService from "@/services/QLNhanSu/nS_NhanSu/nS_NhanSuService";

interface Props {
  item?: NS_HopDongLaoDongType | null;
  onClose: () => void;
}

const NS_HopDongLaoDongDetail: React.FC<Props> = ({ item, onClose }) => {
  const [userName, setUserName] = React.useState<string | null>("");

  React.useEffect(() => {
    const fetchNameUser = async () => {
      try {
        const response = await nS_NhanSuService.getDetail(item?.nhanSuId ?? "");
        if (response.status) {
          setUserName(response.data.hoTen);
        } else {
          message.error("Không tìm thấy nhân sự");
        }
      } catch (error) {
        message.error("Lỗi khi lấy dữ liệu: " + error);
      }
    };
    fetchNameUser();
  }, [userName]);
  return (
    <Drawer
      title={`Thông tin nhóm danh mục`}
      width="20%"
      placement="right"
      onClose={onClose}
      closable={true}
      open={true}
    >
      <Divider dashed />
      <div>
        <p>
          <span className="ml-3 text-dark">Nhân sự: {userName}</span>
        </p>
        <p>
          <span className="ml-3 text-dark">
            Ngày ký:
            {item?.ngayKy
              ? dayjs(item.ngayKy).format("DD/MM/YYYY")
              : "Chưa có ngày ký"}
          </span>
        </p>
        <p>
          <span className="ml-3 text-dark">
            Ngày hết hạn:
            {item?.ngayHetHan
              ? dayjs(item.ngayHetHan).format("DD/MM/YYYY")
              : "Chưa có ngày hết hạn"}
          </span>
        </p>
        <p>
          <span className="ml-3 text-dark">
            Loại hợp đồng:{" "}
            {LoaiHopDongLaoDongConstant.getDisplayName(item?.loaiHopDong ?? 6)}
          </span>
        </p>
        <p>
          <span className="ml-3 text-dark">Số hợp đồng: {item?.soHopDong}</span>
        </p>
        <p>
          <span className="ml-3 text-dark">Ghi chú: {item?.ghiChu}</span>
        </p>
      </div>
    </Drawer>
  );
};

export default NS_HopDongLaoDongDetail;
