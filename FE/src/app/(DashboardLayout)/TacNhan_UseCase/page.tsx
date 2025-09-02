"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Modal,
  Pagination,
  Table,
  Popconfirm,
  Space,
  Dropdown,
  Menu,
} from "antd";
import { tacNhan_UseCaseService } from "@/services/TacNhan_UseCase/TacNhan_UseCase.service";
import {
  TacNhan_UseCaseType,
  TacNhan_UseCaseSearchType,
} from "@/types/TacNhan_UseCase/TacNhan_UseCase";
import CreateOrUpdate from "./createOrUpdate";
import TacNhanUseCaseDetail from "./detail";
import Search from "./search";
import { toast } from "react-toastify";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import CustomBreadcrumb from "@/components/util-compenents/CustomBreadcrumb";

const PAGE_SIZE = 20;

const TacNhanUseCasePage: React.FC = () => {
  const [data, setData] = useState<TacNhan_UseCaseType[]>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchValues, setSearchValues] = useState<TacNhan_UseCaseSearchType>(
    {}
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<TacNhan_UseCaseType | null>(
    null
  );
  const [isOpenDetail, setIsOpenDetail] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await tacNhan_UseCaseService.getData({
      ...searchValues,
      pageIndex,
      pageSize: PAGE_SIZE,
    });

    console.log("API Response:", res);
    console.log("Response status:", res?.status);
    console.log("Response data:", res?.data);

    // Kiểm tra cấu trúc response và lấy dữ liệu đúng cách
    if (res && res.status && res.data) {
      const apiData = res.data;
      console.log("API Data:", apiData);
      console.log("API Data items:", apiData?.items);
      console.log("API Data totalCount:", apiData?.totalCount);

    if (apiData && apiData.items) {
        const items = Array.isArray(apiData.items) ? apiData.items : [];
        console.log("Setting data:", items);
        setData(items);
      setTotal(Number(apiData.totalCount) || 0);
      } else {
        console.log("No items found in apiData");
        setData([]);
        setTotal(0);
      }
    } else if (res && (res as any).items) {
      // Fallback: nếu response có items trực tiếp
      const fallbackData = res as any;
      console.log("Using fallback data:", fallbackData);
      setData(Array.isArray(fallbackData.items) ? fallbackData.items : []);
      setTotal(Number(fallbackData.totalCount) || 0);
    } else {
      console.log("No valid data structure found");
      setData([]);
      setTotal(0);
    }
    setLoading(false);
  }, [searchValues, pageIndex]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debug: Log data changes
  useEffect(() => {
    console.log("Current data state:", data);
    console.log("Current total state:", total);
  }, [data, total]);

  const handleSearch = (values: TacNhan_UseCaseSearchType) => {
    setSearchValues(values);
    setPageIndex(1);
  };

  const handleAdd = () => {
    setCurrentItem(null);
    setIsOpenModal(true);
  };

  const handleEdit = (item: TacNhan_UseCaseType) => {
    setCurrentItem(item);
    setIsOpenModal(true);
  };

  const handleDetail = (item: TacNhan_UseCaseType) => {
    setCurrentItem(item);
    setIsOpenDetail(true);
  };

  const handleDelete = async (item: TacNhan_UseCaseType) => {
    try {
      const res = await tacNhan_UseCaseService.delete(item.id);
      if (res && res.status) {
        toast.success("Xóa thành công");
        fetchData();
      } else {
        toast.error(res?.message || "Xóa thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  // ...existing code...
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/dashboard" },
          { label: "Quản lý Tác Nhân UseCase" },
        ]}
        className="mb-4"
      />
      <Card
        title="Quản lý Tác Nhân UseCase"
        extra={
          <Button type="primary" onClick={handleAdd}>
            Thêm mới
          </Button>
        }
      >
        <Search onFinish={handleSearch} />
        <Table
          dataSource={Array.isArray(data) ? data : []}
          rowKey={(record) => {
            return record.id;
          }}
          loading={loading}
          pagination={false}
          style={{ marginTop: 16 }}
          locale={{
            emptyText: loading ? "Đang tải dữ liệu..." : "Không có dữ liệu",
          }}
          onRow={(record) => {
            console.log("Table row record:", record);
            return {};
          }}
          columns={[
            { title: "Mã tác nhân", dataIndex: "maTacNhan" },
            { title: "Tên tác nhân", dataIndex: "tenTacNhan" },
            {
              title: "Ngày tạo",
              dataIndex: "createdDate",
              render: (value: string) => {
                if (!value) return "";
                // Nếu là dạng ISO, lấy phần YYYY-MM-DD
                const dateOnly = value.split("T")[0];
                return dateOnly;
              },
            },
            {
              title: "Thao tác",
              key: "action",
              render: (_, record) => {
                const menu = (
                  <Menu>
                    <Menu.Item key="view" onClick={() => handleDetail(record)}>
                      <EyeOutlined style={{ marginRight: 4 }} /> Xem
                    </Menu.Item>
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
          ]}
        />
        <Pagination
          current={pageIndex}
          pageSize={PAGE_SIZE}
          total={total}
          onChange={setPageIndex}
          style={{ marginTop: 16, textAlign: "right" }}
        />
        {isOpenModal && (
          <CreateOrUpdate
            isOpen={isOpenModal}
            tacNhanUseCase={currentItem}
            onClose={() => setIsOpenModal(false)}
            onSuccess={fetchData}
          />
        )}
        {isOpenDetail && (
          <TacNhanUseCaseDetail
            isOpen={isOpenDetail}
            tacNhanUseCase={currentItem}
            onClose={() => setIsOpenDetail(false)}
          />
        )}
      </Card>
    </>
  );
};

export default TacNhanUseCasePage;
