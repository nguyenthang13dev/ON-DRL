"use client"

import { lopHanhChinhService } from "@/services/lopHanhChinh/lopHanhChinh.service";
import { StudentInforDto } from "@/types/sinhVien/sinhVien";
import { Table } from "antd";
import { TableProps } from "antd/lib/table";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ListStudents = () => {
    const params = useParams();
    const id = params.id as string;
    const [students, setStudents] = useState<StudentInforDto[]>([]);
    const [loading, setLoading] = useState(false);
    const handleGetListStudents = async () => {
        try {
            setLoading(true);
            const response = await lopHanhChinhService.GetListStudentByClass(id);
            setStudents(response.data || []);
        } catch (error) {
            toast.error("Không thể tải danh sách sinh viên");
            console.error(error); 
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            handleGetListStudents();
        }
    }, [id]);

    const columns: TableProps<StudentInforDto>["columns"] = [
        {
            title: "STT",
            key: "stt",
            width: 60,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Mã sinh viên",
            dataIndex: "maSinhVien",
            key: "maSinhVien",
            render: ( _: any, record: StudentInforDto ) =>
            {
                return record.maSV
            }
        },
        {
            title: "Họ và tên",
            dataIndex: "hoTen",
            key: "hoTen",
            width: 200,
        },
        {
            title: "Ngày sinh",
            dataIndex: "ngaySinh",
            key: "ngaySinh",
            width: 120,
            render: (date: string) => {
                return date ? new Date(date).toLocaleDateString("vi-VN") : "-";
            },
        },
        {
            title: "Giới tính",
            dataIndex: "gioiTinh",
            key: "gioiTinh",
            width: 100,
            align: "center",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 220,
        },
        {
            title: "Số điện thoại",
            dataIndex: "soDienThoai",
            key: "soDienThoai",
            width: 130,
        },
        {
            title: "Địa chỉ",
            dataIndex: "diaChi",
            key: "diaChi",
            ellipsis: true,
        },
    ];

    return (
       
        <>
            
            
         <Table
                columns={columns}
                dataSource={students}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} sinh viên`,
                }}
                bordered
            />
        
        </>

    );
}

export default ListStudents;