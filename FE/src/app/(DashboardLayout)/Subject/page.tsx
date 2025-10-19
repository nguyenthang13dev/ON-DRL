"use client";
import Flex from "@/components/shared-components/Flex";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import withAuthorization from "@/libs/authentication";
import { subjectService } from "@/services/Subject/Subject.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import
  {
    SearchSubjectData,
    TableSubjectDataType,
  } from "@/types/Subject/Subject";
import { Response, ResponsePageInfo, ResponsePageList } from "@/types/general";
import
  {
    CloseOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
    PlusCircleOutlined,
    SearchOutlined,
  } from "@ant-design/icons";
import
  {
    Button,
    Card,
    Dropdown,
    FormProps,
    MenuProps,
    Pagination,
    Popconfirm,
    Space,
    Table,
    TableProps,
    Tag,
  } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CreateOrUpdate from "./createOrUpdate";
import SubjectDetail from "./detail";
import classes from "./page.module.css";
import Search from "./search";

const Subject: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listSubjects, setListSubjects] = useState<TableSubjectDataType[]>([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<SearchSubjectData | null>(
    null
  );
  const loading = useSelector((state) => state.general.isLoading);
  const [isShowAddOrUpdate, setIsShowAddOrUpdate] = useState<boolean>(false);
  const [currentSubject, setCurrentSubject] =
    useState<TableSubjectDataType | null>(null);
  const [currentDetailSubject, setCurrentDetailSubject] =
    useState<TableSubjectDataType>();
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null);

  const departmentOptions = useMemo(() => [
    { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Khoa Kỹ thuật Xây dựng" },
    { id: "b2c3d4e5-f6g7-8901-bcde-f23456789012", name: "Khoa Kỹ thuật Thủy lợi" },
    { id: "c3d4e5f6-g7h8-9012-cdef-345678901234", name: "Khoa Môi trường" },
    { id: "d4e5f6g7-h8i9-0123-def0-456789012345", name: "Khoa Kinh tế" },
    { id: "e5f6g7h8-i9j0-1234-ef01-567890123456", name: "Khoa Cơ khí" },
    { id: "f6g7h8i9-j0k1-2345-f012-678901234567", name: "Khoa Điện - Điện tử" },
    { id: "g7h8i9j0-k1l2-3456-0123-789012345678", name: "Khoa Công nghệ thông tin" },
    { id: "h8i9j0k1-l2m3-4567-1234-890123456789", name: "Khoa Ngoại ngữ" },
    { id: "i9j0k1l2-m3n4-5678-2345-901234567890", name: "Khoa Khoa học cơ bản" },
    { id: "j0k1l2m3-n4o5-6789-3456-012345678901", name: "Khoa Giáo dục thể chất" },
  ], []);

  // Helper function to get department name by GUID
  const getDepartmentName = useCallback((departmentId: string | null): string => {
    if (!departmentId) return "-";
    const dept = departmentOptions.find(d => d.id === departmentId);
    return dept ? dept.name : departmentId; // Fallback to ID if not found
  }, [departmentOptions]);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const tableColumns: TableProps<TableSubjectDataType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã môn học",
      dataIndex: "code",
      width: 120,
      render: (_: any, record: TableSubjectDataType) => (
        <span style={{ fontWeight: "bold", color: "#1890ff" }}>
          {record.code}
        </span>
      ),
    },
    {
      title: "Tên môn học",
      dataIndex: "name",
      width: 250,
      render: (_: any, record: TableSubjectDataType) => (
        <span style={{ fontWeight: "500" }}>{record.name}</span>
      ),
    },
    {
      title: "Số tín chỉ",
      dataIndex: "credits",
      width: 100,
      align: "center",
      render: (credits: number) => <Tag color="blue">{credits} TC</Tag>,
    },
    {
      title: "Khoa/Bộ môn",
      dataIndex: "departmentName",
      width: 200,
      ellipsis: true,
      render: (departmentName: string | null) => <Tag>{departmentName}</Tag>,
    },
    {
      title: "Học kỳ",
      dataIndex: "semester",
      width: 80,
      align: "center",
      render: (semester: number) => (semester ? `HK${semester}` : "-"),
    },
    {
      title: "Lý thuyết (tiết)",
      dataIndex: "theoryHours",
      width: 90,
      align: "center",
      render: (hours: number) => (hours ? `${hours}` : "-"),
    },
    {
      title: "Thực hành (tiết)",
      dataIndex: "practiceHours",
      width: 90,
      align: "center",
      render: (hours: number) => (hours ? `${hours}` : "-"),
    },
    {
      title: "Loại môn",
      dataIndex: "isElective",
      width: 100,
      align: "center",
      render: (isElective: boolean) => (
        <Tag color={isElective ? "orange" : "green"}>
          {isElective ? "Tự chọn" : "Bắt buộc"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      render: (_: any, record: TableSubjectDataType) => {
        const items: MenuProps["items"] = [
          {
            label: "Chi tiết",
            key: "1",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurrentDetailSubject(record);
              setIsOpenDetail(true);
            },
          },
          {
            label: "Chỉnh sửa",
            key: "2",
            icon: <EditOutlined />,
            onClick: () => {
              handleShowModal(true, record);
            },
          },
          {
            type: "divider",
          },
          {
            label: "Xóa",
            key: "3",
            danger: true,
            icon: <DeleteOutlined />,
            onClick: () => setOpenPopconfirmId(record.id ?? ""),
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
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa môn học này?"
              okText="Xóa"
              cancelText="Hủy"
              open={openPopconfirmId === record.id}
              onConfirm={() => {
                handleDeleteSubject(record.id || "");
                setOpenPopconfirmId(null);
              }}
              onCancel={() => setOpenPopconfirmId(null)}
            ></Popconfirm>
          </>
        );
      },
    },
  ];

  const hanleCreateEditSuccess = () => {
    handleGetListSubjects();
    setCurrentSubject(null);
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      const response = await subjectService.delete(id);
      if (response.status) {
        toast.success("Xóa môn học thành công");
        handleGetListSubjects();
      } else {
        toast.error("Xóa môn học thất bại");
      }
    } catch (error) {
      toast.error("Xóa môn học thất bại");
    }
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<SearchSubjectData>["onFinish"] = async (
    values
  ) => {
    try {
      setSearchValues(values);
      await handleGetListSubjects(values);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  const handleGetListSubjects = useCallback(
    async (searchDataOverride?: SearchSubjectData) => {
      dispatch(setIsLoading(true));
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          ...(searchValues || {}),
        };
        const response: Response = await subjectService.getDataByPage(
          searchData
        );
        if (response != null && response.data != null) {
          const data: ResponsePageList = response.data;
          const items: TableSubjectDataType[] = data.items;
          setListSubjects(items);
          setDataPage({
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPage: data.totalPage,
          });
        }
        dispatch(setIsLoading(false));
      } catch (error) {
        dispatch(setIsLoading(false));
      }
    },
    [pageIndex, pageSize, searchValues, dispatch]
  );

  const handleShowModal = (
    isEdit?: boolean,
    subject?: TableSubjectDataType
  ) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentSubject(subject ?? null);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentSubject(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  useEffect(() => {
    handleGetListSubjects();
  }, [handleGetListSubjects]);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"
      >
        <AutoBreadcrumb />
        <div>
          <Button
            onClick={() => toggleSearch()}
            type="primary"
            size="small"
            icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
            className={classes.mgright5}
          >
            {isPanelVisible ? "Ẩn tìm kiếm" : "Tìm kiếm"}
          </Button>
          <Button
            onClick={() => {
              handleShowModal();
            }}
            type="primary"
            icon={<PlusCircleOutlined />}
            size="small"
          >
            Thêm môn học
          </Button>
          <CreateOrUpdate
            isOpen={isOpenModal}
            onSuccess={hanleCreateEditSuccess}
            onClose={handleClose}
            Subject={currentSubject}
          />
        </div>
      </Flex>
      {isPanelVisible && (
        <Search
          onFinish={onFinishSearch}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      )}
      <SubjectDetail
        Subject={currentDetailSubject}
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
      />
      <Card style={{ padding: "0px" }} className={classes.customCardShadow}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={listSubjects}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={false}
            loading={loading}
          />
        </div>
        <Pagination
          className="mt-2"
          total={dataPage?.totalCount}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} trong ${total} môn học`
          }
          pageSize={pageSize}
          defaultCurrent={1}
          onChange={(e) => {
            setPageIndex(e);
          }}
          onShowSizeChange={(current, pageSize) => {
            setPageIndex(current);
            setPageSize(pageSize);
          }}
          size="small"
          align="end"
        />
      </Card>
    </>
  );
};

export default withAuthorization(Subject, "");
