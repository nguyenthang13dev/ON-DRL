'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DA_DuAnDetail from '../../detail';
import dA_DuAnService from '@/services/dA_DuAn/dA_DuAnService';
import { DA_DuAnType } from '@/types/dA_DuAn/dA_DuAn';

export default function Page() {
  const params = useParams();
  const id = params?.id?.toString() ?? '';
  const [data, setData] = useState<DA_DuAnType | null>(null);

  useEffect(() => {
    if (id) {
      console.log("=== DETAIL PAGE DEBUG ===");
      console.log("Fetching data for id:", id);
      dA_DuAnService.get(id).then(res => {
        console.log("API response:", res);
        console.log("Data received:", res?.data);
        if (res?.data) {
          console.log("trangThaiThucHien:", res.data.trangThaiThucHien, typeof res.data.trangThaiThucHien);
        }
        setData(res?.data ?? null);
      }).catch(error => {
        console.error("Error loading project detail:", error);
        setData(null);
      });
    }
  }, [id]);

  if (!data) return <div>Không tìm thấy dữ liệu</div>;
  return <DA_DuAnDetail item={data} itemId={id} />;
}
