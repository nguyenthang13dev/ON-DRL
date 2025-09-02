
import {duLieuDanhMucService} from '@/services/duLieuDanhMuc/duLieuDanhMuc.service';
import {duLieuDanhMucType} from '@/types/duLieuDanhMuc/duLieuDanhMuc';
import {BookOutlined} from '@ant-design/icons'; 
import React, {useState} from 'react';

const NavHDSD = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;
    const [HDSD, setHDSD] = useState<duLieuDanhMucType | null>(null);

    const showModal = async () => {
        setOpen(true);
        if (!HDSD) {
            await getHDSD();
        }
    };

    const handleCancel = () => setOpen(false);

    const getHDSD = async () => {
        try {
            setLoading(true);
            const response = await duLieuDanhMucService.GetListDataByGroupCode("HUONGDANSUDUNG");
            setHDSD(response.data[0]);
        } catch (error) {
            console.error("Error loading HDSD:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="shrink-0">
            <div
                onClick={showModal}
                className="flex items-center gap-2 cursor-pointer !text-gray-600"
            >
                <BookOutlined/>
                <span>Hướng dẫn sử dụng</span>
            </div>

             
        </div>
    );
};

export default NavHDSD;