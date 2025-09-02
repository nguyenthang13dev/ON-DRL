import React from "react";
import { Drawer, Divider } from "antd";
import { ArcPlanType } from "@/types/arcPlan/arcPlan";
import * as extensions from "@/utils/extensions";

interface Props {
  item?: ArcPlanType | null;
  onClose: () => void;
}

const ArcPlanDetail: React.FC<Props> = ({ item, onClose }) => {
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
					<span className="ml-3 text-dark">
						Mô tả: {item?.description}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Ngày kết thúc: {extensions.toDateString(item?.endDate)}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Ghi chú: {item?.ghiChu}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Phương án thu thập: {item?.method}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tên kế hoạch: {item?.name}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Kết quả dự kiến: {item?.outcome}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Mã kế hoạch: {item?.planID}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Ngày bắt đầu: {extensions.toDateString(item?.startDate)}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Trạng thái kế hoạch: {item?.status}
					</span>
				</p>
      </div>
    </Drawer>
  );
};

export default ArcPlanDetail;
