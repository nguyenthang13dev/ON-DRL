"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Table,
  Popconfirm,
  Space,
  Dropdown,
  Menu,
  Modal,
  message,
  Form,
  Input,
} from "antd";
import { tacNhan_UseCaseService } from "@/services/TacNhan_UseCase/TacNhan_UseCase.service";
import {
  TacNhan_UseCaseType,
  TacNhan_UseCaseSearchType,
} from "@/types/TacNhan_UseCase/TacNhan_UseCase";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface TacNhanListProps {
  idDuAn?: string;
}

const TacNhanList: React.FC<TacNhanListProps> = ({ idDuAn }) => {
  const [data, setData] = useState<TacNhan_UseCaseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<TacNhan_UseCaseType | null>(
    null
  );
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tacNhan_UseCaseService.getData({
        pageIndex: 1,
        pageSize: 1000, // Lấy tất cả
        idDuAn: idDuAn,
      });

      if (res && res.status && res.data) {
        const apiData = res.data;
        if (apiData && apiData.items) {
          const items = Array.isArray(apiData.items) ? apiData.items : [];
          setData(items);
        } else {
          setData([]);
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu tác nhân:", error);
      message.error("Lỗi khi tải dữ liệu tác nhân!");
    } finally {
      setLoading(false);
    }
  }, [idDuAn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setCurrentItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (item: TacNhan_UseCaseType) => {
    setCurrentItem(item);
    form.setFieldsValue({
      maTacNhan: item.maTacNhan,
      tenTacNhan: item.tenTacNhan,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: TacNhan_UseCaseType) => {
    try {
      const res = await tacNhan_UseCaseService.delete(item.id);
      if (res && res.status) {
        message.success("Xóa thành công");
        fetchData();
      } else {
        message.error(res?.message || "Xóa thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra: " + error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
    form.resetFields();
  };

  const handleModalSuccess = () => {
    fetchData();
    handleModalClose();
  };

  const handleSubmit = async (values: any) => {
    if (!idDuAn) {
      message.error("Không tìm thấy ID dự án!");
      return;
    }

    setSubmitting(true);
    try {
      if (currentItem) {
        // Cập nhật
        const res = await tacNhan_UseCaseService.update({
          id: currentItem.id,
          maTacNhan: values.maTacNhan,
          tenTacNhan: values.tenTacNhan,
          idDuAn: idDuAn,
        });
        if (res && res.status) {
          message.success("Cập nhật thành công");
          handleModalSuccess();
        } else {
          message.error(res?.message || "Cập nhật thất bại");
        }
      } else {
        // Thêm mới
        const res = await tacNhan_UseCaseService.create({
          maTacNhan: values.maTacNhan,
          tenTacNhan: values.tenTacNhan,
          idDuAn: idDuAn,
        });
        if (res && res.status) {
          message.success("Thêm mới thành công");
          handleModalSuccess();
        } else {
          message.error(res?.message || "Thêm mới thất bại");
        }
      }
    } catch (error) {
      console.error("Lỗi khi lưu tác nhân:", error);
      message.error("Có lỗi xảy ra khi lưu tác nhân!");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Mã tác nhân",
      dataIndex: "maTacNhan",
      key: "maTacNhan",
    },
    {
      title: "Tên tác nhân",
      dataIndex: "tenTacNhan",
      key: "tenTacNhan",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (value: string) => {
        if (!value) return "";
        const dateOnly = value.split("T")[0];
        return dateOnly;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: TacNhan_UseCaseType) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit" onClick={() => handleEdit(record)}>
              <EditOutlined style={{ marginRight: 4 }} /> Sửa
            </Menu.Item>
            <Menu.Item key="delete">
              <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => handleDelete(record)}
              >
                <span style={{ color: "red" }}>
                  <DeleteOutlined style={{ marginRight: 4 }} /> Xóa
                </span>
              </Popconfirm>
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button size="small">
              Thao tác <DownOutlined style={{ marginLeft: 4 }} />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h3 style={{ margin: 0 }}>Danh sách tác nhân</h3>
          {loading && (
            <span style={{ color: "#1890ff", fontSize: "14px" }}>
              (Đang tải...)
            </span>
          )}
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          disabled={loading}
        >
          Thêm tác nhân
        </Button>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        locale={{
          emptyText: loading ? "Đang tải dữ liệu..." : "Không có dữ liệu",
        }}
        style={{
          minHeight: loading ? "200px" : "auto",
        }}
        rowClassName={(record, index) => {
          if (loading) return "loading-row";
          return index % 2 === 0 ? "even-row" : "odd-row";
        }}
      />

      {/* Modal tạo/sửa tác nhân */}
      <Modal
        title={currentItem ? "Sửa tác nhân" : "Thêm tác nhân mới"}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            maTacNhan: "",
            tenTacNhan: "",
          }}
        >
          <Form.Item
            label="Mã tác nhân"
            name="maTacNhan"
            rules={[
              { max: 50, message: "Mã tác nhân không được quá 50 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập mã tác nhân" />
          </Form.Item>

          <Form.Item
            label="Tên tác nhân"
            name="tenTacNhan"
            rules={[
              { required: true, message: "Vui lòng nhập tên tác nhân!" },
              { max: 200, message: "Tên tác nhân không được quá 200 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên tác nhân" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={handleModalClose}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {currentItem ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .loading-row {
          opacity: 0.6;
        }
        .even-row {
          background-color: #fafafa;
        }
        .odd-row {
          background-color: #ffffff;
        }
        .ant-table-loading .ant-table-tbody > tr > td {
          padding: 16px 8px;
        }
      `}</style>
    </div>
  );
};

export default TacNhanList;
