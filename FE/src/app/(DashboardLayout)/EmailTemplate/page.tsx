"use client";
import { useEffect, useState } from "react";
import { Button, Card, Modal, Pagination, Table, Input, Space, Switch, Dropdown, Menu } from "antd";
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import { EmailTemplateType, EmailTemplateSearchType } from "@/types/emailTemplate/EmailTemplate";
import emailTemplateService from "@/services/emailTemplate/EmailTemplateService";
import { toast } from "react-toastify";
import CreateOrUpdate from "./createOrUpdate";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";

const Page = () => {
  const [data, setData] = useState<EmailTemplateType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState<EmailTemplateSearchType>({ pageIndex: 1, pageSize: 10 });
  const [keyword, setKeyword] = useState("");
  const [editingItem, setEditingItem] = useState<EmailTemplateType | null>(null);
  const [showCreateOrUpdate, setShowCreateOrUpdate] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await emailTemplateService.getData({ ...search, code: keyword });
    if (res.status && res.data) {
      setData(res.data.items);
      setTotal(res.data.totalCount);
    } else {
      toast.error(res.message || "Lỗi lấy dữ liệu");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [pageIndex, pageSize, search]);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa template này?",
      onOk: async () => {
        const res = await emailTemplateService.delete(id);
        if (res.status) {
          toast.success("Xóa thành công");
          fetchData();
        } else {
          toast.error(res.message || "Xóa thất bại");
        }
      },
    });
  };

  const handleShowModal = async (id: string) => {
    const res = await emailTemplateService.get(id);
    if (res.status && res.data) {
      setEditingItem(res.data);
      setShowCreateOrUpdate(true);
    } else {
      toast.error(res.message || "Không lấy được dữ liệu chi tiết");
    }
  };

  const columns = [
    { title: "STT", render: (_: any, __: any, i: number) => (pageIndex - 1) * pageSize + i + 1 },
    { title: "Mã", dataIndex: "code" },
    { title: "Tên", dataIndex: "name" },
    { title: "Loại", dataIndex: "tenLoaiEmailTemPlate" },
    { title: "Mô tả", dataIndex: "description" },
    {
      title: "Thao tác",
      dataIndex: undefined,
      render: (_: any, record: EmailTemplateType) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleShowModal(record.id)}>
              Xem
            </Menu.Item>
            <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleShowModal(record.id)}>
              Sửa
            </Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger>
              Xóa
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button size="small">Thao tác <DownOutlined style={{ marginLeft: 4 }} /></Button>
          </Dropdown>
        );
      }
    }
  ];

  return (
    <>
      <AutoBreadcrumb />
      <Card>
        <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
          <Input.Search
            placeholder="Tìm kiếm mã template"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onSearch={val => setSearch({ ...search, code: val, pageIndex: 1 })}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setShowCreateOrUpdate(true)}>
            Thêm mới
          </Button>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          bordered
        />
        <Pagination
          className="mt-3"
          current={pageIndex}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} trong ${total} dữ liệu`
          }
          onChange={(page, size) => {
            setPageIndex(page);
            setPageSize(size || 10);
          }}
        />
        {showCreateOrUpdate && (
          <CreateOrUpdate
            item={editingItem}
            onClose={() => { setShowCreateOrUpdate(false); setEditingItem(null); }}
            onSuccess={fetchData}
          />
        )}
      </Card>
    </>
  );
};

export default Page; 