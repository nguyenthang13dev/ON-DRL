"use client";
import { useCallback, useEffect, useState } from "react";
import Flex from "@/components/shared-components/Flex";
import { DropdownOption, ResponsePageList } from "@/types/general";
import withAuthorization from "@/libs/authentication";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import * as extensions from "@/utils/extensions";
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
    FormProps,
    MenuProps,
    Modal,
    Pagination,
    Space,
    Table,
    TableProps,
} from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ArcDocumentDetail from "./detail";
import Search from "./search";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import {
    ArcDocumentSearchType,
    ArcDocumentType,
} from "@/types/arcDocument/arcDocument";
import arcDocumentService from "@/services/arcDocument/arcDocumentService";
import ArcDocumentCreateOrUpdate from "./createOrUpdate";


const TabArcDocumentPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [data, setData] = useState<ResponsePageList<ArcDocumentType[]>>();
    const [pageSize, setPageSize] = useState<number>(20);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
    const [searchValues, setSearchValues] = useState<ArcDocumentSearchType | null>(
        null
    );
    const loading = useSelector((state) => state.general.isLoading);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [currentItem, setCurentItem] = useState<ArcDocumentType | null>(null);
    const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const [dropdownSecurity, setDropdownSecurity] = useState<DropdownOption[]>();
    const [dropdownLang, setDropdownLang] = useState<DropdownOption[]>();
    const [dropdownConfidentLevel, setDropdownConfidentLevel] = useState<DropdownOption[]>();
    const [dropdownFormat, setDropdownFormat] = useState<DropdownOption[]>();


    const tableColumns: TableProps<ArcDocumentType>["columns"] = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: "Mã định danh văn bản",
            dataIndex: "docCode",
            render: (_: any, record: ArcDocumentType) => (
                <span>{record.docCode}</span>
            ),
        },
        {
            title: "Mã hồ sơ",
            dataIndex: "fileCode",
            render: (_: any, record: ArcDocumentType) => (
                <span>{record.fileCode}</span>
            ),
        },

        {
            title: "Tên loại văn bản",
            dataIndex: "typeName",
            render: (_: any, record: ArcDocumentType) => (
                <span>{record.typeName}</span>
            ),
        },
        {
            title: "Số của văn bản",
            dataIndex: "codeNumber",
            render: (_: any, record: ArcDocumentType) => (
                <span>{record.codeNumber}</span>
            ),
        },
        {
            title: "Ký hiệu của văn bản",
            dataIndex: "codeNotation",
            render: (_: any, record: ArcDocumentType) => (
                <span>{record.codeNotation}</span>
            ),
        },
        {
            title: "Ngày, tháng, năm văn bản",
            dataIndex: "issuedDate",
            render: (_: any, record: ArcDocumentType) => (
                <span>{extensions.toDateString(record.issuedDate)}</span>
            ),
        },
        {
            title: "Tên cơ quan, tổ chức ban hành văn bản",
            dataIndex: "organName",
            render: (_: any, record: ArcDocumentType) => (
                <span>{record.organName}</span>
            ),
        },
        {
            title: "Trích yếu nội dung",
            dataIndex: "subject",
            render: (_: any, record: ArcDocumentType) => (
                <span>{record.subject}</span>
            ),
        },
        {
            title: "Độ mật của hồ sơ, văn bản",
            dataIndex: "securityName",
            render: (_: any, record: ArcDocumentType) => (
                <span>{record.securityName}</span>
            ),
        },
        {
            title: "Từ khóa",
            dataIndex: "keyword",
            render: (_: any, record: ArcDocumentType) => (
                <span>{record.keyword}</span>
            ),
        },

        {
            title: "Thao tác",
            dataIndex: "actions",
            fixed: "right",
            align: "center",
            render: (_: any, record: ArcDocumentType) => {
                const items: MenuProps["items"] = [
                    {
                        label: "Chi tiết",
                        key: "2",
                        icon: <EyeOutlined />,
                        onClick: () => {
                            setCurentItem(record);
                            setIsOpenDetail(true);
                        },
                    },
                    {
                        label: "Chỉnh sửa",
                        key: "3",
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
                        key: "4",
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

    const handleGetDropdown = async () => {
        const rs = await arcDocumentService.getDropdowns();
        if (rs.status) {
            const data = rs.data;
            setDropdownSecurity(data.dropdownSecurity);
            setDropdownLang(data.dropdownLang);
            setDropdownConfidentLevel(data.dropdownConfidentLevel);
            setDropdownFormat(data.dropdownFormat);

        }
    }

    const hanleCreateEditSuccess = () => {
        handleLoadData();
        setCurentItem(null);
    };

    const handleDelete = async () => {
        const response = await arcDocumentService.delete(confirmDeleteId ?? "");
        if (response.status) {
            toast.success("Xóa thành công");
            handleLoadData();
        }
        setConfirmDeleteId(null);
    };

    const toggleSearch = () => {
        setIsPanelVisible(!isPanelVisible);
    };

    const onFinishSearch: FormProps<ArcDocumentSearchType>["onFinish"] = async (
        values
    ) => {
        try {
            setSearchValues(values);
            await handleLoadData(values);
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
        }
    };

    const handleLoadData = useCallback(
        async (searchDataOverride?: ArcDocumentSearchType) => {
            dispatch(setIsLoading(true));

            const searchData = searchDataOverride || {
                pageIndex,
                pageSize,
                ...(searchValues || {}),
            };
            const response = await arcDocumentService.getData(searchData);
            if (response != null && response.data != null) {
                const data = response.data;
                setData(data);
            }
            dispatch(setIsLoading(false));
        },
        [dispatch, pageIndex, pageSize, searchValues]
    );

    const handleShowModal = (isEdit?: boolean, item?: ArcDocumentType) => {
        setIsOpenModal(true);
        if (isEdit) {
            setCurentItem(item ?? null);
        }
    };

    const handleClose = () => {
        setIsOpenModal(false);
        setCurentItem(null);
    };

    const handleCloseDetail = () => {
        setIsOpenDetail(false);
    };

    useEffect(() => {
        handleLoadData();
    }, [handleLoadData]);

    useEffect(() => {
        handleGetDropdown();
    }, [])


    return (
        <>
            <Flex
                alignItems="center"
                justifyContent="space-between"
                className="mb-2 flex-wrap justify-content-end"

            >
                <div className="btn-group">
                    <Button
                        onClick={() => toggleSearch()}
                        type="primary"
                        size="small"
                        icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
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
                        Thêm mới
                    </Button>
                    {isOpenModal && (
                        <ArcDocumentCreateOrUpdate
                            onSuccess={hanleCreateEditSuccess}
                            onClose={handleClose}
                            item={currentItem}
                            dropdownSecurity={dropdownSecurity ?? []}
                            dropdownLang={dropdownLang ?? []}
                            dropdownConfidentLevel={dropdownConfidentLevel ?? []}
                            dropdownFormat={dropdownFormat ?? []}
                        />
                    )}
                </div>
            </Flex>
            {isPanelVisible && (
                <Search
                    onFinish={onFinishSearch}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    dropdownSecurity={dropdownSecurity ?? []}
                />
            )}
            {isOpenDetail && (
                <ArcDocumentDetail item={currentItem} onClose={handleCloseDetail} />
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
            <Card className={"customCardShadow"}>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        bordered
                        dataSource={data?.items}
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                        pagination={false}
                        loading={loading}
                    />
                </div>
                <Pagination
                    className="mt-2"
                    total={data?.totalCount}
                    showTotal={(total, range) =>
                        `${range[0]}-${range[1]} trong ${total} dữ liệu`
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

export default TabArcDocumentPage;
