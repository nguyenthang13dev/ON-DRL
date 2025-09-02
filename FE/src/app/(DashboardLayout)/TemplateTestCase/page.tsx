"use client";
import { useCallback, useEffect, useState } from "react";
import Flex from "@/components/shared-components/Flex";
import { ResponsePageList } from "@/types/general";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { AppDispatch } from "@/store/store";
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Modal,
  Pagination,
  Space,
  Table,
  TableProps,
  Tag,
  Tooltip,
  MenuProps,
} from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import { TemplateTestCase, TemplateTestCaseSearch } from "@/types/templateTestCase/templateTestCase";
import templateTestCaseService from "@/services/templateTestCase/templateTestCaseService";
import classes from "./page.module.css";
import TemplateTestCaseCreateOrUpdate from "./createOrUpdate";
import TemplateTestCaseDetail from "./detail";
import Search from "./search";

const Page = () => {
  const [listData, setListData] = useState<TemplateTestCase[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageList<TemplateTestCase[]>>();
  const [loading, setLoading] = useState(false);
  const [searchValues, setSearchValues] = useState<TemplateTestCaseSearch>({
    pageIndex: 1,
    pageSize: 10,
  });

  // Modal states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [currentData, setCurrentData] = useState<TemplateTestCase | null>(null);
  const [currentDetailData, setCurrentDetailData] = useState<TemplateTestCase | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const handleGetListData = useCallback(
    async (searchData?: TemplateTestCaseSearch) => {
      try {
        setLoading(true);
        dispatch(setIsLoading(true));
        const searchParam = searchData || searchValues;
        const response = await templateTestCaseService.getData(searchParam);
        if (response.status && response.data) {
            console.log("response.data templateTestCaseService", response.data);
          setListData(response.data.items);
          setDataPage(response.data);
        } else {
          toast.error(response.message || "Lỗi lấy dữ liệu");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu");
      } finally {
        setLoading(false);
        dispatch(setIsLoading(false));
      }
    },
    [searchValues, dispatch]
  );

  useEffect(() => {
    handleGetListData();
  }, [handleGetListData]);

  const handleDelete = async (id: string) => {
    try {
      const response = await templateTestCaseService.delete(id);
      if (response.status) {
        toast.success("Xóa template test case thành công");
        handleGetListData();
      } else {
        toast.error(response.message || "Xóa template test case thất bại");
      }
    } catch (error) {
      toast.error("Xóa template test case thất bại");
    }
  };

  const handleCreateEditSuccess = async () => {
    handleGetListData();
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentData(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
    setCurrentDetailData(null);
  };

  const handlePagination = (page: number, pageSize: number) => {
    const newSearchValues = { ...searchValues, pageIndex: page, pageSize };
    setSearchValues(newSearchValues);
    handleGetListData(newSearchValues);
  };

  const handleSearch = (values: TemplateTestCaseSearch) => {
    const newSearchValues = { ...values, pageIndex: 1, pageSize: 10 };
    setSearchValues(newSearchValues);
    handleGetListData(newSearchValues);
  };

  const showDeleteConfirm = (record: TemplateTestCase) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa template "${record.templateName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        handleDelete(record.id);
      },
    });
  };

  const columns: TableProps<TemplateTestCase>["columns"] = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => (
        <span>
          {(searchValues.pageIndex - 1) * searchValues.pageSize + index + 1}
        </span>
      ),
    },
    {
      title: "Tên Template",
      dataIndex: "templateName",
      key: "templateName",
      render: (text: string) => (
        <strong style={{ color: "#1890ff" }}>{text}</strong>
      ),
    },
    {
      title: "Từ khóa",
      dataIndex: "keyWord",
      key: "keyWord",
      width: 200,
      render: (text: string) => {
        const keywords = text?.split(',').map(k => k.trim()).filter(k => k);
        return (
          <div>
            {keywords?.map((keyword, index) => (
              <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                {keyword}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Nội dung Template",
      dataIndex: "templateContent",
      key: "templateContent",
      render: (text: string) => (
        <Tooltip title={text}>
          <div
            style={{
              maxWidth: 700,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.4",
              fontSize: "13px",
              maxHeight: "calc(1.4em * 3)", // 3 dòng * line-height
              whiteSpace: "pre-wrap", // Giữ nguyên xuống dòng và wrap text
              wordBreak: "break-word", // Ngắt từ khi cần thiết
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => {
        const items: MenuProps['items'] = [
          {
            key: 'detail',
            label: 'Chi tiết',
            icon: <EyeOutlined />,
            onClick: () => {
              setCurrentDetailData(record);
              setIsOpenDetail(true);
            },
          },
          {
            key: 'edit',
            label: 'Chỉnh sửa',
            icon: <EditOutlined />,
            onClick: () => {
              setCurrentData(record);
              setIsOpenModal(true);
            },
          },
          {
            type: 'divider',
          },
          {
            key: 'delete',
            label: 'Xóa',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => showDeleteConfirm(record),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button>
              Thao tác <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <AutoBreadcrumb />
      <div className={classes.mg5}>
        <Card className={classes.customCardShadow}>
                     <Flex alignItems="center" justifyContent="space-between">
            <div>
              <h4 className="mb-1">Quản lý Template Test Case</h4>
              <p>Danh sách template test case trong hệ thống</p>
            </div>
            <div>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setCurrentData(null);
                  setIsOpenModal(true);
                }}
              >
                Thêm mới
              </Button>
            </div>
          </Flex>
        </Card>
      </div>

      <div className={classes.mg5}>
        <Card className={classes.customCardShadow}>
          <Search onFinish={handleSearch} />
        </Card>
      </div>

      <div className={classes.mg5}>
        <Card className={classes.customCardShadow}>
          <Table
            columns={columns}
            dataSource={listData}
            loading={loading}
            pagination={false}
            rowKey="id"
            scroll={{ x: 800 }}
            bordered
            size="middle"
          />
          <div className="mt-3 text-right">
            <Pagination
              current={searchValues.pageIndex}
              pageSize={searchValues.pageSize}
              total={dataPage?.totalCount || 0}
              onChange={handlePagination}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} của ${total} mục`
              }
            />
          </div>
        </Card>
      </div>

      <TemplateTestCaseCreateOrUpdate
        isOpen={isOpenModal}
        onClose={handleClose}
        onSuccess={handleCreateEditSuccess}
        data={currentData}
      />

      <TemplateTestCaseDetail
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
        data={currentDetailData}
      />
    </div>
  );
};

export default Page;    