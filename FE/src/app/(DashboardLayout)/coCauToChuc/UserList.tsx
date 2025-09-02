import React, { useEffect, useState } from "react";
import { Drawer, List, Avatar, Image, TableColumnsType, Table } from "antd";
import { TreeItem } from "@nosferatu500/react-sortable-tree";

import { CanBoQuanLyByDept } from "@/types/canBoQuanLy/canBoQuanLy";
import formatDate from "@/utils/formatDate";
import { CloseOutlined } from "@ant-design/icons";

const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

const getSex = (sex: number) => {
  switch (sex) {
    case 0:
      return "Khác";
    case 1:
      return "Nam";
    case 2:
      return "Nữ";
  }
};
interface DepartmentModalProps {
  isOpen: boolean;
  department: TreeItem;
  onClose: () => void;
}

const UserList: React.FC<DepartmentModalProps> = ({
  isOpen,
  department,
  onClose,
}) => {
  const [dsCanBo, setDsCanBo] = useState<CanBoQuanLyByDept[]>([]);

  const tableColumns: TableColumnsType<CanBoQuanLyByDept> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
    },
    {
      title: "Ngày sinh",
      dataIndex: "ngaySinh",
      render: (_: any, record: CanBoQuanLyByDept) => (
        <span>
          {record.ngaySinh ? formatDate(new Date(record.ngaySinh), true) : ""}
        </span>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "GioiTinh",
      render: (_: any, record: CanBoQuanLyByDept) => (
        <span>{record.gioiTinh ? getSex(record.gioiTinh) : ""}</span>
      ),
    },
    {
      title: "Dân tộc",
      dataIndex: "tenDanToc",
    },
    {
      title: "Phòng ban",
      dataIndex: "tenPhongBan",
    },
    {
      title: "Cấp bậc",
      dataIndex: "tenCapBac",
    },
    {
      title: "Tình trạng làm việc",
      dataIndex: "tenTinhTrangLamViec",
    },
  ];

  // useEffect(() => {
  //   canBoQuanLyService
  //     .getByDeptId(department.id)
  //     .then((res) => {
  //       setDsCanBo(res.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, [department]);

  return (
    <Drawer
      title={
        <div style={{ textAlign: "center" }}>
          Dánh sách cán bộ thuộc {department.title}
        </div>
      }
      open={isOpen}
      onClose={onClose}
      width="55%"
      getContainer={false}
      mask={false}
      closeIcon={<CloseOutlined style={{ color: "#000", fontSize: 16 }} />}
    >
      <Table<CanBoQuanLyByDept>
        columns={tableColumns}
        bordered
        dataSource={dsCanBo}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={false}
        tableLayout="fixed"
      />
    </Drawer>
  );
};

export default UserList;
