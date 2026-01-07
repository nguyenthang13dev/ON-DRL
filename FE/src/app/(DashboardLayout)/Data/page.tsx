'use client';

import { duLieuDanhMucService } from '@/services/duLieuDanhMuc/duLieuDanhMuc.service';
import { Button, message } from 'antd';
import danTocVietNam from './datajson/dantocVietNam';
import quocTinh from './datajson/quocTich';

const Data = () => {
  const handleThemDanToc = async () => {
    try {
      for (const item of danTocVietNam) {
        const danToc = {
          groupId: '3d6a1c1c-4d48-4973-8ae8-9d491363a642',
          name: item.dan_toc,
          code: item.ma.toString(),
        };

        await duLieuDanhMucService.Create(danToc);
      }

      message.success('Thêm toàn bộ dân tộc thành công!');
    } catch (error) { 
      console.error(error);
      message.error('Có lỗi xảy ra khi thêm dân tộc!');
    }
  };

  const handleThemQuocTich = async () => {
    try {
      for (const item of quocTinh) {
        const quocTich = {
          groupId: '2c7fe62f-1fed-43fe-8b5d-a315968f1eb6',
          name: item.name,
          code: item.code,
        };

        await duLieuDanhMucService.Create(quocTich);
      }

      message.success('Thêm toàn bộ quốc tịch thành công!');
    } catch (error) {
      console.error(error);
      message.error('Có lỗi xảy ra khi thêm quốc tịch!');
    }
  };

  return (
    <div>
      <Button onClick={handleThemDanToc} disabled>
        Thêm dân tộc
      </Button>
      <Button onClick={handleThemQuocTich} disabled>
        Thêm quốc tịch
      </Button>
    </div>
  );
};

export default Data;
