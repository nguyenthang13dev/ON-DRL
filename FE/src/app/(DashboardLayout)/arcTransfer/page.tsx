"use client";
import React, {useCallback, useEffect, useState} from 'react';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Dropdown,
    Form,
    Input,
    MenuProps,
    Modal,
    Row,
    Select,
    Space,
    Table,
    Tooltip
} from 'antd';
import {
    CloseOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
    PlusCircleOutlined,
    PrinterOutlined,
    ReloadOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {useRouter} from 'next/navigation';
import Flex from '@/components/shared-components/Flex';
import AutoBreadcrumb from '@/components/util-compenents/Breadcrumb';
import withAuthorization from '@/libs/authentication';
import arcTransferService from '@/services/arcTransfer/arcTransferService';
import ArcTransferModal from '@/app/(DashboardLayout)/arcTransfer/createOrUpdate';
import {ArcTransferSearch, ArcTransferType} from '@/types/arcTransfer/arcTransfer';
import ArcTransferDetail from './detail';
import "./page.css";
import {userService} from "@/services/user/user.service";
import {departmentService} from "@/services/department/department.service";
import PreviewPdfModal from './PreviewPdfModal';

const {RangePicker} = DatePicker;

const DocumentTransferListPage: React.FC = () => {
    useRouter();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ArcTransferType[]>([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState<ArcTransferSearch>({
        pageNumber: 1,
        pageSize: 10,
        searchText: '',
        sortColumn: 'ngayGiaoNhan',
        sortOrder: 'desc',
    });
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [form] = Form.useForm();

    // States for dropdown data
    const [userOptions, setUserOptions] = useState<{ value: string, label: string }[]>([]);
    const [sourceOptions, setSourceOptions] = useState<{ value: string, label: string }[]>([]);

    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<ArcTransferType | null>(null);

    const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
// Add state for PDF preview modal
    const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
    const [pdfRecord, setPdfRecord] = useState<ArcTransferType | null>(null);
    const [pdfUserGiaoName, setPdfUserGiaoName] = useState('');
    const [pdfUserNhanName, setPdfUserNhanName] = useState('');
    const [pdfDepartmentName, setPdfDepartmentName] = useState('');
    const [searchInput, setSearchInput] = useState('');

// Add the handler function
    const handlePreviewPDF = async (record: ArcTransferType) => {
        try {
            // Fetch full record details if needed
            const response = await arcTransferService.getArcTransferById(record.id!);
            if (response.status) {
                const fullRecord = response.data;

                // Find names for the preview
                const userGiao = userOptions.find(user => user.value === fullRecord.userIDGiao);
                const userNhan = userOptions.find(user => user.value === fullRecord.userIDNhan);
                const department = sourceOptions.find(dept => dept.value === fullRecord.nguonGiaoNhan);

                setPdfUserGiaoName(userGiao?.label || fullRecord.tenUserGiao || '');
                setPdfUserNhanName(userNhan?.label || fullRecord.tenUserNhan || '');
                setPdfDepartmentName(department?.label || fullRecord.tenNguonGiaoNhan || '');

                setPdfRecord(fullRecord);
                setPdfPreviewVisible(true);
            }
        } catch (error) {
            console.error('Failed to fetch record details for PDF preview:', error);
        }
    };
// Fetch dropdown data
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                // Get user dropdown data - already in proper dropdown format
                const userResponse = await userService.getDropdown();
                if (userResponse.status) {
                    setUserOptions(userResponse.data); // Data already in dropdown format
                }

                // Get source dropdown data from appropriate service
                const sourceResponse = await departmentService.getDropDown('');
                if (sourceResponse.status) {
                    setSourceOptions(sourceResponse.data); // Data already in dropdown format
                }
            } catch (error) {
                console.error("Failed to load dropdown data", error);
            }
        };

        fetchDropdownData();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            // Compare with current search state's tenKhoiTaiLieu to avoid redundant calls
            setSearch(prev => ({
                ...prev,
                pageNumber: 1, // Reset to first page for new search text
                tenKhoiTaiLieu: searchInput.trim() || undefined, // Use undefined if empty
            }));

        }, 500); // 2000ms = 2 seconds delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchInput, setSearch]); // Ensure all dependencies are listed

    const handleOpenDrawer = async (record: ArcTransferType) => {
        setLoading(true);
        try {
            const response = await arcTransferService.getArcTransferById(record.id!);
            if (response.status) {
                setCurrentRecord(response.data);
                setViewDrawerVisible(true);
            }
        } catch (err) {
            console.error('Failed to load detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await arcTransferService.getArcTransferData(search);
            if (response.status) {
                setData(response.data.items);
                setTotal(response.data.totalCount);
            }
        } catch {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleSearch = () => {
        setIsPanelVisible(!isPanelVisible);
    };

    const handleFormSearch = (values: any) => {
        const searchParams = {
            ...search,
            pageNumber: 1,
            userIDGiao: values.userIDGiao,
            userIDNhan: values.userIDNhan,
            nguonGiaoNhan: values.nguonGiaoNhan,
            tenKhoiTaiLieu: values.tenKhoiTaiLieu ? values.tenKhoiTaiLieu.trim() : undefined,
            ngayGiaoNhanFrom: values.ngayGiaoNhan?.[0] ? values.ngayGiaoNhan[0].format('YYYY-MM-DD') : undefined,
            ngayGiaoNhanTo: values.ngayGiaoNhan?.[1] ? values.ngayGiaoNhan[1].format('YYYY-MM-DD') : undefined,
        };
        setSearch(searchParams);
    };

    const handleResetForm = () => {
        form.resetFields();
        setSearchInput('');
        setSearch({
            pageNumber: 1,
            pageSize: 10,
            searchText: '',
            sortColumn: 'ngayGiaoNhan',
            sortOrder: 'desc',
        });
        // Submit the form to refresh the data
        form.submit();
    };

    const handleTableChange = (pagination: any, _filters: any, sorter: any) => {

        // Handle different sorter structures (could be empty when clearing sort)
        let sortColumn = 'ngayGiaoNhan';
        let sortOrder = 'desc';

        if (sorter && Object.keys(sorter).length > 0) {
            // Check if sorter is an array (multi-column sorting)
            if (Array.isArray(sorter)) {
                if (sorter.length > 0) {
                    sortColumn = sorter[0].field;
                    sortOrder = sorter[0].order === 'ascend' ? 'asc' : 'desc';
                }
            } else {
                // Single column sorting
                sortColumn = sorter.field || sortColumn;
                sortOrder = sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : sortOrder;
            }
        }

        setSearch((prev) => ({
            ...prev,
            pageNumber: pagination.current,
            pageSize: pagination.pageSize,
            sortColumn: sortColumn,
            sortOrder: sortOrder,
        }));
    };

    const handleAddNew = () => setCreateModalVisible(true);

    const handleShowEdit = async (record: ArcTransferType) => {
        setLoading(true);
        try {
            const response = await arcTransferService.getArcTransferById(record.id!);
            if (response.status) {
                setCurrentRecord(response.data);
                setEditModalVisible(true);
            }
        } catch (err) {
            console.error('Failed to load detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await arcTransferService.deleteArcTransfer(id);
            fetchData();
        } catch {
            console.error('Delete failed');
        }
    };

    const columns = [
        {
            title: 'Tên khối tài liệu',
            dataIndex: 'tenKhoiTaiLieu',
            key: 'tenKhoiTaiLieu',
            sorter: true,
            ellipsis: true,
            width: 200
        },
        {
            title: 'Người giao',
            dataIndex: 'tenUserGiao',
            key: 'tenUserGiao',
            width: 150,
            render: (_: any, record: ArcTransferType) => record.userIDGiao ? record.tenUserGiao : '',
        },
        {
            title: 'Người nhận',
            dataIndex: 'tenUserNhan',
            key: 'tenUserNhan',
            width: 150,
            render: (_: any, record: ArcTransferType) => record.userIDNhan ? record.tenUserNhan : '',
        },
        {
            title: 'Tổng số hộp',
            dataIndex: 'tongSoHop',
            key: 'tongSoHop',
            sorter: true,
            align: 'center' as const,
            width: 120
        },
        {
            title: 'Tổng số hồ sơ',
            dataIndex: 'tongSoHoSo',
            key: 'tongSoHoSo',
            sorter: true,
            align: 'center' as const,
            width: 100
        },
        {
            title: 'Ngày giao nhận',
            dataIndex: 'ngayGiaoNhan',
            key: 'ngayGiaoNhan',
            sorter: true,
            width: 150,
            render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY') : ''),
        },
        {
            title: 'Thời gian hồ sơ',
            dataIndex: 'thoiGianHoSo',
            key: 'thoiGianHoSo',
            width: 80
        },
        {
            title: 'Nguồn giao nhận',
            dataIndex: 'tenNguonGiaoNhan',
            key: 'tenNguonGiaoNhan',
            width: 150
        },
        {
            title: 'Tình trạng',
            dataIndex: 'tinhTrangTaiLieu',
            key: 'tinhTrangTaiLieu',
            ellipsis: true,
            width: 150,
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="truncate max-w-[150px] inline-block">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right' as const,
            width: 120,
            render: (_: any, record: ArcTransferType) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'view',
                        icon: <EyeOutlined/>,
                        label: 'Chi tiết',
                        onClick: () => handleOpenDrawer(record),
                    },
                    {
                        key: 'edit',
                        icon: <EditOutlined/>,
                        label: 'Chỉnh sửa',
                        onClick: () => handleShowEdit(record),
                    },
                    {
                        key: 'pdf',
                        icon: <PrinterOutlined/>,
                        label: 'In',
                        onClick: () => handlePreviewPDF(record),
                    },
                    {
                        key: 'delete',
                        icon: <DeleteOutlined/>,
                        label: 'Xóa',
                        onClick: (e) => {
                            e.domEvent.stopPropagation();
                            Modal.confirm({
                                title: 'Xác nhận xóa?',
                                content: 'Bạn có chắc chắn muốn xóa biên bản này?',
                                okText: 'Xóa',
                                cancelText: 'Hủy',
                                okButtonProps: {danger: true},
                                onOk: () => handleDelete(record.id!)
                            });
                        },
                        danger: true
                    }
                ];

                return (
                    <Dropdown menu={{items}} trigger={['click']}>
                        <Button className="action-button" onClick={(e) => e.preventDefault()}>
                            <Space>
                                Thao tác
                                <DownOutlined/>
                            </Space>
                        </Button>
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <>
            <Flex
                alignItems="center"
                justifyContent="space-between"
                className="mb-2 flex-wrap justify-content-end"
            >
                <AutoBreadcrumb/>
                <div className="flex gap-2">
                    <Button
                        onClick={handleAddNew}
                        icon={<PlusCircleOutlined/>}
                        size="small"
                        color="cyan"
                        variant="solid"
                    >
                        Thêm mới
                    </Button>
                </div>
            </Flex>

            <ArcTransferModal
                visible={createModalVisible || editModalVisible}
                initialValues={editModalVisible ? currentRecord || {} : {}}
                isEdit={editModalVisible}
                onCancel={() => {
                    if (editModalVisible) {
                        setEditModalVisible(false);
                    } else {
                        setCreateModalVisible(false);
                    }
                    setCurrentRecord(null);
                }}
                onSuccess={() => {
                    if (editModalVisible) {
                        setEditModalVisible(false);
                    } else {
                        setCreateModalVisible(false);
                    }
                    setCurrentRecord(null);
                    fetchData();
                }}
                key={editModalVisible ? `edit-${currentRecord?.id}` : 'create-new'}
            />

            <ArcTransferDetail
                record={currentRecord}
                visible={viewDrawerVisible}
                onClose={() => {
                    setViewDrawerVisible(false);
                    setCurrentRecord(null);
                }}
            />

            {pdfRecord && (
                <PreviewPdfModal
                    visible={pdfPreviewVisible}
                    onCancel={() => setPdfPreviewVisible(false)}
                    data={pdfRecord}
                    userGiaoName={pdfUserGiaoName}
                    userNhanName={pdfUserNhanName}
                    departmentName={pdfDepartmentName}
                />
            )}
            <Card bordered={false}>
                <div className="mb-6 flex items-center justify-between">
                    <h4 className="card-title">Danh sách biên bản bàn giao tài liệu</h4>
                    <div className="search-container flex items-center gap-2">
                        <Input.Search
                            placeholder="Tìm kiếm tên khối tài liệu ..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)} // This triggers the debounced search via useEffect
                            onSearch={(value) => { // Called on Enter or search icon click
                                const trimmedValue = value.trim();
                                setSearch(prev => ({
                                    ...prev,
                                    pageNumber: 1,
                                    tenKhoiTaiLieu: trimmedValue || undefined,
                                }));
                                // Toggle the advanced search panel
                                toggleSearch();
                            }}
                            style={{width: 350}}
                            allowClear
                            size="small"
                            className="custom-search-input"
                            enterButton={
                                <div style={{
                                    width: '90px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Tooltip
                                        title={isPanelVisible ? "Ẩn bộ lọc tìm kiếm nâng cao" : "Hiển thị bộ lọc tìm kiếm nâng cao"}>
                                        {isPanelVisible ? (
                                            <Space size="small">
                                                <CloseOutlined/>
                                                Thu gọn
                                            </Space>
                                        ) : (
                                            <Space size="small">
                                                <SearchOutlined/>
                                                Nâng cao
                                            </Space>
                                        )}
                                    </Tooltip>
                                </div>
                            }
                        />
                    </div>
                </div>

                {isPanelVisible && (
                    <Card
                        className="search-panel-card mb-4 advanced-search-panel"> {/* Added advanced-search-panel class */}
                        <div className="search-panel">
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={(values) => {
                                    values.tenKhoiTaiLieu = searchInput.trim();
                                    handleFormSearch(values);
                                }}
                            >
                                <Form.Item name="tenKhoiTaiLieu" style={{display: 'none'}}>
                                    <Input/>
                                </Form.Item>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={8} lg={6}>
                                        <Form.Item label="Người giao" name="userIDGiao">
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder="Chọn người giao"
                                                filterOption={(input, option) =>
                                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={userOptions}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={8} lg={6}>
                                        <Form.Item label="Người nhận" name="userIDNhan">
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder="Chọn người nhận"
                                                filterOption={(input, option) =>
                                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={userOptions}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={8} lg={6}>
                                        <Form.Item label="Nguồn giao nhận" name="nguonGiaoNhan">
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder="Chọn nguồn giao nhận"
                                                filterOption={(input, option) =>
                                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={sourceOptions}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={8} lg={6}>
                                        <Form.Item label="Ngày giao nhận" name="ngayGiaoNhan">
                                            <RangePicker
                                                style={{width: '100%'}}
                                                format="DD/MM/YYYY"
                                                placeholder={['Từ ngày', 'Đến ngày']}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <div className="text-center mt-3">
                                    <Space>
                                        <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                                            Tìm kiếm
                                        </Button>
                                        <Button onClick={handleResetForm} icon={<ReloadOutlined/>} danger>
                                            Xóa bộ lọc
                                        </Button>
                                    </Space>
                                </div>
                            </Form>
                        </div>
                    </Card>
                )}

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: search.pageNumber,
                        pageSize: search.pageSize,
                        total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (t) => `Tổng số ${t} bản ghi`,
                    }}
                    onChange={handleTableChange}
                    scroll={{x: 1200}}
                    className="custom-table"
                    rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
                />
            </Card>
        </>
    );
};

export default withAuthorization(DocumentTransferListPage, 'DocumentTransferListPage');