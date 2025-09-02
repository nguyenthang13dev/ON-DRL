import React from "react";
import { Drawer, Divider } from "antd";
import { ArcFilePlanType } from "@/types/arcFilePlan/arcFilePlan";
import * as extensions from "@/utils/extensions";

interface Props {
  item?: ArcFilePlanType | null;
  onClose: () => void;
}

const ArcFilePlanDetail: React.FC<Props> = ({ item, onClose }) => {
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
						Mục lục hoặc số năm hình thành hồ sơ: {item?.fileCatalog}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Số và ký hiệu hồ sơ: {item?.fileNotaion}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tiêu đề hồ sơ: {item?.title}
					</span>
				</p>
      </div>
    </Drawer>
  );
};

export default ArcFilePlanDetail;
