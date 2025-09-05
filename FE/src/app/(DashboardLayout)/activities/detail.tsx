import React from "react";
import { Drawer, Divider } from "antd";
import { ActivitiesType } from "@/types/activities/activities";
import * as extensions from "@/utils/extensions";

interface Props {
  item?: ActivitiesType | null;
  onClose: () => void;
}

const ActivitiesDetail: React.FC<Props> = ({ item, onClose }) => {
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
          <span className="ml-3 text-dark">Tên hoạt động: {item?.name}</span>
        </p>
        <p>
          <span className="ml-3 text-dark">Mô tả: {item?.description}</span>
        </p>
        <p>
          <span className="ml-3 text-dark">QR tham gia: {item?.qRPath}</span>
        </p>
      </div>
    </Drawer>
  );
};

export default ActivitiesDetail;
