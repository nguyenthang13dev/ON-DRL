import React from "react";
import { Drawer, Divider } from "antd";
import { NS_BangCapType } from "@/types/QLNhanSu/nS_BangCap/nS_BangCap";
import dayjs from "dayjs";
import nS_NhanSuService from "@/services/QLNhanSu/nS_NhanSu/nS_NhanSuService";
import { toast } from "react-toastify";
import { nhomDanhMucService } from "@/services/nhomDanhMuc/nhomDanhMuc.service";
import { duLieuDanhMucService } from "@/services/duLieuDanhMuc/duLieuDanhMuc.service";

interface Props {
  item?: NS_BangCapType | null;
  onClose: () => void;
}

const NS_BangCapDetail: React.FC<Props> = ({ item, onClose }) => {
  const [nhanSu, setNhanSu] = React.useState<string>("");
  const [trinhDo, setTrinhDo] = React.useState<string>("");

  React.useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        if (item) {
          if (item.nhanSuId) {
            const chucVuData = await nS_NhanSuService.getDetail(item.nhanSuId);
            setNhanSu(chucVuData?.data.hoTen ?? "");
          }

          if (item.trinhDoId) {
            const phongBanData = await duLieuDanhMucService.GetById(
              item.trinhDoId
            );
            setTrinhDo(phongBanData?.data.name ?? "");
          }
        }
      } catch (error) {
        toast.error(`Lỗi khi tải dữ liệu: ${error}`);
      }
    };
    fetchDropdowns();
  }, [item?.nhanSuId, item?.trinhDoId]);

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
          <span className="ml-3 text-dark">Nhân sự: {nhanSu}</span>
        </p>
        <p>
          <span className="ml-3 text-dark">Trình độ: {trinhDo}</span>
        </p>
        <p>
          <span className="ml-3 text-dark">
            Ngày cấp:{" "}
            {item?.ngayCap ? dayjs(item.ngayCap).format("DD/MM/YYYY") : ""}
          </span>
        </p>
        <p>
          <span className="ml-3 text-dark">Nơi cấp: {item?.noiCap}</span>
        </p>
        <p>
          <span className="ml-3 text-dark">Ghi chú: {item?.ghiChu}</span>
        </p>
      </div>
    </Drawer>
  );
};

export default NS_BangCapDetail;
