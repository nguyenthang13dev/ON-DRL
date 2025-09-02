import React from "react";
import { Drawer, Divider } from "antd";
import { SystemLogsType } from "@/types/systemLogs/systemLogs";
import * as extensions from "@/utils/extensions";

interface Props {
  item?: SystemLogsType | null;
  onClose: () => void;
}

const SystemLogsDetail: React.FC<Props> = ({ item, onClose }) => {
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
						Id tài khoản: {item?.userId}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Tên tài khoản: {item?.userName}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Thời gian: {extensions.toDateString(item?.timestamp)}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Địa chỉ Ip: {item?.iPAddress}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Loại: {item?.level}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Nội dung: {item?.message}
					</span>
				</p>
				<p>
					<span className="ml-3 text-dark">
						Mã quản lý: {item?.maQuanLyId}
					</span>
				</p>
      </div>
    </Drawer>
  );
};

export default SystemLogsDetail;
