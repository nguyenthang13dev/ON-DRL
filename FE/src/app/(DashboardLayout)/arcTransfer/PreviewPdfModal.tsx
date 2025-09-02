// src/app/(DashboardLayout)/arcTransfer/PreviewPdfModal.tsx
import React, {useEffect, useState} from 'react';
import {Button, Modal,Space} from 'antd';
import {ArcTransferType} from '@/types/arcTransfer/arcTransfer';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs'; // Import ExcelJS
import {DownloadOutlined, FileExcelOutlined,FilePdfOutlined} from '@ant-design/icons';

interface PreviewModalProps {
    visible: boolean;
    onCancel: () => void;
    data: ArcTransferType;
    userGiaoName: string;
    userNhanName: string;
    departmentName: string;
}

const PreviewPdfModal: React.FC<PreviewModalProps> = ({
                                                          visible,
                                                          onCancel,
                                                          data,
                                                          userGiaoName,
                                                          userNhanName,
                                                          departmentName,
                                                      }) => {

    const exportToPDF = () => {
        const element = document.getElementById('pdf-content');
        if (!element) return;

        // Sao chép nội dung để xử lý riêng biệt
        const clonedElement = element.cloneNode(true) as HTMLElement;

        // Xử lý màu sắc và style
        const elementsWithBg = clonedElement.querySelectorAll('[class*="bg-"]');
        elementsWithBg.forEach(el => {
            (el as HTMLElement).style.backgroundColor = '#FFFF00'; // Màu vàng
            // Xóa các class bg- để tránh xung đột oklch
            const classList = (el as HTMLElement).className.split(' ').filter(cls => !cls.startsWith('bg-'));
            (el as HTMLElement).className = classList.join(' ');
        });

        // Tạo container đúng kích thước A4
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '794px'; // A4 width ở 96 DPI
        container.style.padding = '40px';
        container.style.backgroundColor = '#ffffff';
        container.appendChild(clonedElement);
        document.body.appendChild(container);

        // Đặt style cho phần tử được sao chép
        clonedElement.style.padding = '0';
        clonedElement.style.margin = '0';
        clonedElement.style.width = '100%';
        clonedElement.style.backgroundColor = '#ffffff';
        clonedElement.style.fontFamily = 'Times New Roman, serif';

        // Đảm bảo các table có đúng chiều rộng
        const tables = clonedElement.querySelectorAll('table');
        tables.forEach(table => {
            table.style.width = '100%';
            table.style.pageBreakInside = 'avoid'; // Tránh ngắt bảng giữa các trang
        });

        // Chuyển đổi HTML thành canvas
        html2canvas(clonedElement, {
            scale: 2, // Tăng độ phân giải
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            allowTaint: true,
            windowWidth: 794,
        }).then(canvas => {
            // Tạo PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Tính toán kích thước phù hợp với trang A4
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Tách thành nhiều trang nếu cần
            const pageHeight = pdf.internal.pageSize.getHeight();
            let heightLeft = imgHeight;
            let position = 0;
            let pageNumber = 1;

            // Trang đầu tiên
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Thêm các trang tiếp theo nếu cần
            while (heightLeft >= 0) {
                position = -pageHeight * pageNumber;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                pageNumber++;
            }

            pdf.save('bien-ban-giao-nhan.pdf');

            // Dọn dẹp
            document.body.removeChild(container);
        }).catch(error => {
            console.error('Lỗi khi xuất PDF:', error);
            document.body.removeChild(container);
        });
    };
    data.ngayGiaoNhan ? dayjs(data.ngayGiaoNhan).format('DD/MM/YYYY') : '';
    const day = data.ngayGiaoNhan ? dayjs(data.ngayGiaoNhan).format('DD') : '...';
    const month = data.ngayGiaoNhan ? dayjs(data.ngayGiaoNhan).format('MM') : '...';
    const year = data.ngayGiaoNhan ? dayjs(data.ngayGiaoNhan).format('YYYY') : '...';

    const exportToExcel = async () => {
        const templatePath = '/templates/QLSoBanGiao/BienBanGiaoNhanHoSo.xlsx';

        try {
            const response = await fetch(templatePath);
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && (contentType.indexOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") === -1 && contentType.indexOf("application/octet-stream") === -1)) {
                    throw new Error(`Failed to fetch template: Server returned status ${response.status} with content type ${contentType}. Expected an Excel file.`);
                }
                throw new Error(`Failed to fetch template: ${response.statusText} (status: ${response.status})`);
            }
            const arrayBuffer = await response.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            // Giả sử sheet đầu tiên là sheet mục tiêu (index 1) hoặc theo tên
            const worksheet = workbook.getWorksheet(1); // Hoặc workbook.getWorksheet("Tên Sheet")

            if (!worksheet) {
                throw new Error('Template sheet not found in the workbook.');
            }

            const replacements = {
                '{{DEPARTMENT_NAME}}': (departmentName || 'TÊN CƠ QUAN, TỔ CHỨC').toUpperCase(),
                '{{DAY}}': day,
                '{{MONTH}}': month,
                '{{YEAR}}': year,
                '{{CAN_CU_DATA}}': data.canCu || '...........',
                '{{USER_GIAO_NAME}}': userGiaoName || '...........',
                '{{CHUC_VU_GIAO}}': data.chucVuGiao || '...........',
                '{{USER_NHAN_NAME}}': userNhanName || '...........',
                '{{CHUC_VU_NHAN}}': data.chucVuNhan || '...........',
                '{{TEN_KHOI_TAI_LIEU}}': data.tenKhoiTaiLieu || '...........',
                '{{THOI_GIAN_HO_SO}}': data.thoiGianHoSo || '...........',
                '{{TONG_SO_HOP}}': data.tongSoHop || '0',
                '{{TONG_SO_HO_SO_GIAY}}': data.tongSoHoSo || '0',
                '{{SO_MET_HO_SO}}': data.soMetHoSo || '0',
                '{{TONG_SO_HO_SO_DIEN_TU}}': data.tongSoHoSoDienTu || '0',
                '{{TONG_SO_TEP_TIN}}': data.tongSoTepTin || '0',
                '{{TINH_TRANG_TAI_LIEU}}': data.tinhTrangTaiLieu || '...........',
                '{{SIGNATURE_USER_GIAO_NAME}}': userGiaoName || ' ',
                '{{SIGNATURE_USER_NHAN_NAME}}': userNhanName || ' ',
            };

            for (const placeholder in replacements) {
                if (Object.prototype.hasOwnProperty.call(replacements, placeholder)) {
                    const valueToReplace = (replacements as any)[placeholder];
                    // Escape special characters in placeholder for RegExp
                    const escapedPlaceholder = placeholder.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
                    const placeholderRegex = new RegExp(escapedPlaceholder, 'g');
                    const replacementString = String(valueToReplace ?? '');

                    worksheet.eachRow({ includeEmpty: true }, (row) => {
                        row.eachCell({ includeEmpty: true }, (cell) => {
                            if (cell.value) {
                                if (typeof cell.value === 'string') {
                                    if (cell.value.includes(placeholder)) { // Check the raw placeholder string first for performance
                                        cell.value = cell.value.replace(placeholderRegex, replacementString);
                                    }
                                } else if (typeof cell.value === 'object' && (cell.value as any).richText && Array.isArray((cell.value as any).richText)) {
                                    // Handle rich text
                                    let richTextModified = false;
                                    const newRichText = (cell.value as any).richText.map((rtSegment: any) => {
                                        if (rtSegment && typeof rtSegment.text === 'string' && rtSegment.text.includes(placeholder)) {
                                            richTextModified = true;
                                            return { ...rtSegment, text: rtSegment.text.replace(placeholderRegex, replacementString) };
                                        }
                                        return rtSegment;
                                    });
                                    if (richTextModified) {
                                        cell.value = { richText: newRichText };
                                    }
                                }
                            }
                        });
                    });
                }
            }

            worksheet.pageSetup = {
                paperSize: 9,
                orientation: 'portrait'
            };

            for (let i = 6; i <= 33; i++) {
                const row = worksheet.getRow(i);
                // Ensure wrapText is true for cells in this row to help autofit
                row.eachCell({ includeEmpty: true }, (cell) => {
                    // Preserve existing alignment properties if any
                    const existingAlignment = cell.alignment || {};
                    cell.alignment = { ...existingAlignment, wrapText: true };
                });
                // Set height to undefined to enable autofitting by Excel
                (row as any).height = undefined;
            }

            const fileName = `BienBan_GiaoNhan_${(data.tenKhoiTaiLieu || 'TaiLieu').replace(/[^a-zA-Z0-9_\\s-]/g, '_')}_${dayjs().format('YYYYMMDD')}.xlsx`;

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

        } catch (error) {
            console.error("Error exporting to Excel with ExcelJS:", error);
            alert(`Lỗi khi xuất file Excel: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <Modal
            title={<div className="text-xl font-semibold text-center">Xem trước biên bản giao nhận hồ sơ</div>}
            open={visible}
            width={800}
            onCancel={onCancel}
            style={{top: 20}}
            footer={
                <div style={{textAlign: 'center', justifyItems: 'center'}}>
                    <Space> {/* Space component handles spacing between buttons */}
                        <Button
                            key="excel"
                            type="primary"
                            icon={<FileExcelOutlined />}
                            onClick={exportToExcel}
                        >
                            Xuất Excel
                        </Button>
                        <Button
                            key="download"
                            type="primary"
                            icon={<FilePdfOutlined />}
                            onClick={exportToPDF}
                        >
                            Xuất PDF
                        </Button>
                        <Button type="primary" key="back" onClick={onCancel}>
                            Đóng
                        </Button>
                    </Space>
                </div>
            }
            modalRender={modal => (
                <div style={{maxHeight: 'none', overflow: 'visible'}}>
                    {modal}
                </div>
            )}
        >
            <div id="pdf-content" className="p-4 bg-white">
                <div className="max-w-[800px] mx-auto text-[14px] leading-[1.3] text-black"
                     style={{fontFamily: 'Times New Roman, serif'}}>
                    <table className="w-full border border-black border-dashed text-center mb-2">
                        <tbody>
                        <tr>
                            <td className="border-r border-black border-dashed font-bold py-1 px-2 align-top text-[13px] leading-[1.1]">
                                TÊN CQ, TC CHỦ QUẢN<br/>
                                <span className="underline block">TÊN CƠ QUAN, TỔ CHỨC</span>
                                <span className="text-center font-semibold py-1 px-2 text-[13px] block">
                                    {departmentName || 'Tên cơ quan, tổ chức'}
                                </span>
                            </td>
                            <td className="font-bold py-1 px-2 align-top text-[13px]">
                                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br/>
                                <span className="underline font-semibold">Độc lập - Tự do - Hạnh phúc</span><br/>
                                <span className="italic text-[12px]">..., ngày {day} tháng {month} năm {year}</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <p className="mb-1 text-[14px] font-bold px-1 text-center w-full">BIÊN BẢN</p>
                    <p className="mb-3 font-bold underline text-[14px] text-center w-full">Giao nhận hồ sơ, tài liệu</p>
                    <div className="ml-12 space-y-3">
                        <p className="mb-0">
                            Căn cứ Nghị định số 30/2020/NĐ-CP ngày 05 tháng 3 năm 2020 của Chính phủ về công tác văn
                            thư;
                        </p>
                        <p className="mb-0">
                            Căn cứ {data.canCu || '...........'}
                        </p>
                        <p className="mb-0">
                            Chúng tôi gồm:
                        </p>
                        <p className="mb-0">
                            <span className="font-bold">BÊN GIAO:</span> <span className="italic">(tên cá nhân, đơn vị giao nộp hồ sơ, tài liệu)</span><br/>
                            Ông (bà): {userGiaoName || '...........'}<br/>
                            Chức vụ công tác: {data.chucVuGiao || '...........'}
                        </p>
                        <p className="mb-0">
                            <span className="font-bold">BÊN NHẬN:</span> <span
                            className="italic">(Lưu trữ cơ quan)</span><br/>
                            Ông (bà): {userNhanName || '...........'}<br/>
                            Chức vụ công tác: {data.chucVuNhan || '...........'}
                        </p>
                        <p className="mb-0">
                            Thống nhất lập <span>biên bản</span> giao nhận tài liệu với những nội dung như sau:
                        </p>
                        <ol className="list-decimal list-inside mb-2 space-y-1">
                            <li>Tên khối tài liệu giao nộp: {data.tenKhoiTaiLieu || '...........'}</li>
                            <li>Thời gian của hồ sơ, tài liệu: {data.thoiGianHoSo || '...........'}</li>
                            <li>
                                Số lượng tài liệu:
                                <ol className="list-decimal list-inside ml-5 space-y-1">
                                    <li>Đối với hồ sơ, tài liệu giấy</li>
                                </ol>
                                <div className="mb-1">
                                    <span>- Tổng số hộp (cặp): {data.tongSoHop || '...........'}</span>
                                </div>
                                <div className="flex">
                                    <span
                                        className="w-1/2">- Tổng số hồ sơ (đơn vị bảo quản): {data.tongSoHoSo || '...........'}</span>
                                    <span
                                        className="w-1/2 text-left">Quy ra mét giá: {data.soMetHoSo || '...........'} mét.</span>
                                </div>
                            </li>
                            <li>
                                b) Đối với hồ sơ, tài liệu điện tử<br/>
                                - Tổng số hồ sơ: {data.tongSoHoSoDienTu || '...........'}<br/>
                                - Tổng số tệp tin trong hồ sơ: {data.tongSoTepTin || '...........'}
                            </li>
                            <li>Tình trạng tài liệu giao nộp: {data.tinhTrangTaiLieu || '...........'}</li>
                            <li>Mục lục hồ sơ, tài liệu nộp lưu kèm theo.</li>
                        </ol>
                        <p className="mb-0">
                            <span className="font-bold">Biên bản</span> này được lập thành hai bản; bên giao giữ một
                            bản, bên nhận giữ một bản./.
                        </p>
                    </div>

                    <table className="w-full border border-black border-dashed text-center text-[13px]">
                        <tbody>
                        <tr>
                            <td className="border-r border-black border-dashed py-2 px-2 font-bold">
                                ĐẠI DIỆN BÊN GIAO<br/>
                                <span className="italic">(Ký và ghi rõ họ và tên)</span>
                                <div className="h-[60px]"></div>
                                <span>{userGiaoName}</span>
                            </td>
                            <td className="py-2 px-2 font-bold">
                                ĐẠI DIỆN BÊN NHẬN<br/>
                                <span className="italic">(Ký và ghi rõ họ và tên)</span>
                                <div className="h-[60px]"></div>
                                <span>{userNhanName}</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
};

export default PreviewPdfModal;