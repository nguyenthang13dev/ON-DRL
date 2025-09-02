"use client";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { lienHeService } from "@/services/LienHe/LienHe.service";
import { AppDispatch } from "@/store/store";
import LienHeView, { searchLienHe } from "@/types/LienHe/LienHe";
import { ResponsePageInfo } from "@/types/general";
import { useRouter } from "next/router";
import withAuthorization from "@/libs/authentication";
import CreateLienHeOrUpdate from "./CreateAndUpdate";
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Input,
  MenuProps,
  Modal,
  Pagination,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import { setIsLoading } from "@/store/general/GeneralSlice"; 
import { toast } from "react-toastify";
import { DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";

const LienHe: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listLienHes, setListLienHes] = useState<LienHeView[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [searchValues, setSearchValues] = useState<searchLienHe>({ NameFilter: null }); 
const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurentItem] = useState<LienHeView | null>(null);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Load data
  const fetchData = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await lienHeService.getDataByPage({
   ...(searchValues || null),
  pageIndex,
  pageSize,
});



      if (res.status) {
        setListLienHes(res.data?.items || []);
        setDataPage({
          pageIndex: res.data.pageIndex,
          pageSize: res.data.pageSize,
          totalCount: res.data.totalCount,
          totalPage: res.data.totalPage,
        });
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, searchValues, pageIndex, pageSize]);

  useEffect(() => {
    console.log({
  ...(searchValues || {}),
        pageIndex,
        pageSize,
});
    console.log("Fetching...")
    fetchData();
  }, [fetchData]);

  // Handle search
  const handleSearch = () => {
    setPageIndex(1);
    fetchData();
  };

  const handleShowModal = (isEdit?: boolean, item?: LienHeView) => {
    
    setIsOpenModal(true);
    if (isEdit) {
      setCurentItem(item ?? null);
    }
    console.log("Thông tin " + isEdit);
    console.log(item);
  }; 
  

  const handleDelete = async () => {
    const response = await lienHeService.Delete(confirmDeleteId ?? "");
    if (response.status) {
      toast.success("Xóa thành công"); 
      fetchData();
    }
    setConfirmDeleteId(null);
  };
  // Table columns
  const columns: TableColumnsType<LienHeView> = [
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      key: "hoTen",
    },
    {
      title: "Số điện thoại",
      dataIndex: "sdt",
      key: "sdt",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },{
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      render: (_: any, record: LienHeView) => {
        const items: MenuProps["items"] = [ 
          {
            label: "Chỉnh sửa",
            key: "actions",
            icon: <EditOutlined />,
            onClick: () => {
              handleShowModal(true,record);
            },
          },
          {
            type: "divider",
          },
          {
            label: "Xóa",
            key: "actionsDelete",
            danger: true,
            icon: <DeleteOutlined />,
            onClick: () => setConfirmDeleteId(record.id ?? ""),
          },
        ];
        return (
          <>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Button
                onClick={(e) => e.preventDefault()}
                color="primary"
                size="small"
              >
                <Space>
                  Thao tác
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </>
        );
      },
    },
  ];

  return (
    
    <Card title="Danh sách liên hệ">
       
    <Button onClick={() => handleShowModal()}>Thêm mới</Button>
      {/* TABLE */}
      <Table
        dataSource={listLienHes}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

      {/* PAGINATION */}
      <Flex justify="end" style={{ marginTop: 16 }}>
        <Pagination
          current={pageIndex}
          pageSize={pageSize}
          total={dataPage?.totalCount}
          onChange={(page, pageSize) => {
            setPageIndex(page);
            setPageSize(pageSize);
          }}
          showSizeChanger
        />
      </Flex>
      {/* MODAL THÊM MỚI/CHỈNH SỬA */}
    {isOpenModal && (
      <CreateLienHeOrUpdate
        item={currentItem}
        onClose={() => setIsOpenModal(false)}
        onSuccess={() => {
          setIsOpenModal(false);
          fetchData();
        }}
      />
    )}
      {confirmDeleteId && (
        <Modal
          title="Xác nhận xóa"
          open={true}
          onOk={handleDelete}
          onCancel={() => setConfirmDeleteId(null)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn xóa mục này?</p>
        </Modal>
      )}
    </Card>
  );
};

export default withAuthorization(LienHe, "QLLienHe")

