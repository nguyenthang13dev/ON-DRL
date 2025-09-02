import React from "react";
import { Drawer, Divider } from "antd";
import { ArcDocumentType } from "@/types/arcDocument/arcDocument";
import * as extensions from "@/utils/extensions";

interface Props {
  item?: ArcDocumentType | null;
  onClose: () => void;
}

const ArcDocumentDetail: React.FC<Props> = ({ item, onClose }) => {
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
						Mã định danh văn bản: {item?.docCode}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Mã hồ sơ: {item?.fileCode}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Năm đưa vào hồ sơ: {item?.nam}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Số thứ tự văn bản trong hồ sơ: {item?.docOrdinal}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tên loại văn bản: {item?.typeName}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Số của văn bản: {item?.codeNumber}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Ký hiệu của văn bản: {item?.codeNotation}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Ngày, tháng, năm văn bản: {extensions.toDateString(item?.issuedDate)}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tên cơ quan, tổ chức ban hành văn bản: {item?.organName}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tên người ký văn bản: {item?.fullName}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Trích yếu nội dung: {item?.subject}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Độ mật của hồ sơ, văn bản: {item?.security}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Ngôn ngữ: {item?.language}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Số lượng trang của văn bản: {item?.pageAmount}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Ghi chú: {item?.description}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Từ khóa: {item?.keyword}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Chế độ sử dụng: {item?.mode}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Mức độ tin cậy: {item?.confidenceLevel}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Bút tích: {item?.autograph}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tình trạng vật lý: {item?.format}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tệp/tập tin đính kèm văn bản: {item?.attachmentName}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Chữ ký số: {item?.signature}
					</span>
				</p>
      </div>
    </Drawer>
  );
};

export default ArcDocumentDetail;
