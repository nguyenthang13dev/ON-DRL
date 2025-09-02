import React from "react";
import { Drawer, Divider } from "antd";
import { ArcFileType } from "@/types/arcFile/arcFile";
import * as extensions from "@/utils/extensions";

interface Props {
  item?: ArcFileType | null;
  onClose: () => void;
}

const ArcFileDetail: React.FC<Props> = ({ item, onClose }) => {
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
						Mã hồ sơ: {item?.fileCode}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Mã phông lưu trữ: {item?.organId}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Mục lục số hoặc năm hình thành hồ sơ: {item?.fileCataLog}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Số và ký hiệu hồ sơ: {item?.fileNotation}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tiêu đề hồ sơ: {item?.title}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Thời hạn bảo quản: {item?.maintenance}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Chế độ sử dụng: {item?.rights}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Ngôn ngữ: {item?.language}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Thời gian bắt đầu: {extensions.toDateString(item?.startDate)}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Thời gian kết thúc: {extensions.toDateString(item?.endDate)}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tổng số văn bản trong hồ sơ: {item?.totalDoc}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Mô tả: {item?.description}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Từ khóa: {item?.keyWord}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Số lượng tờ: {item?.sheetNumber}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Số lượng trang: {item?.pageNumber}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tình trạng vật lý: {item?.format}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Năm: {item?.nam}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Ký hiệu thông tin: {item?.inforSign}
					</span>
				</p>
      </div>
    </Drawer>
  );
};

export default ArcFileDetail;
