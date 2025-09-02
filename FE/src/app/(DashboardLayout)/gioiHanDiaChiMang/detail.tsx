import React from 'react';
import { Drawer, Divider } from 'antd';
import { GioiHanDiaChiMangType } from '@/types/gioiHanDiaChiMang/gioiHanDiaChiMang';
import * as extensions from '@/utils/extensions';

interface Props {
  item?: GioiHanDiaChiMangType | null;
  onClose: () => void;
}

const GioiHanDiaChiMangDetail: React.FC<Props> = ({ item, onClose }) => {
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
            Địa chỉ mạng: {item?.ipAddress}
          </span>
        </p>
        <p>
          <span className="ml-3 text-dark">
            Cho phép truy cập: {item?.allowed}
          </span>
        </p>
      </div>
    </Drawer>
  );
};

export default GioiHanDiaChiMangDetail;
