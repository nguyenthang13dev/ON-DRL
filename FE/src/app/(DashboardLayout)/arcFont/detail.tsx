import React from "react";
import { Drawer, Divider } from "antd";
import { ArcFontType } from "@/types/arcFont/arcFont";
import * as extensions from "@/utils/extensions";

interface Props {
	item?: ArcFontType | null;
	onClose: () => void;
}

const ArcFontDetail: React.FC<Props> = ({ item, onClose }) => {
	return (
		<Drawer
			title={`Thông tin phông lưu trữ`}
			width="50%"
			placement="right"
			onClose={onClose}
			closable={true}
			open={true}
		>
			<Divider dashed />
			<div>
				<p>
					<span className="ml-3 text-dark">
						Mã cơ quan lưu trữ: {item?.identifier}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Mã phông lưu trữ: {item?.organId}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tên phông lưu trữ: {item?.fondName}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Lịch sử đơn vị hình thành: {item?.fondHistory}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Thời gian tài liệu: {item?.archivesTime}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Năm bắt đầu: {item?.archivesTimeStart}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Năm kết thúc: {item?.archivesTimeEnd}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tổng số tài liệu giấy: {item?.paperTotal}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Số lượng tài liệu giấy đã số hóa: {item?.paperDigital}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Nhóm tài liệu chù yếu: {item?.keyGroups}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Loại hình tài liệu khác: {item?.otherTypes}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Ngôn ngữ: {item?.language}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Công cụ tra cứu: {item?.lookupTools}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Số lượng tài liệu đã lập bản sao bảo hiểm: {item?.copyNumber}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Ghi chú: {item?.description}
					</span>
				</p>
			</div>
		</Drawer>
	);
};

export default ArcFontDetail;
