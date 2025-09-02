import React, { useCallback, useEffect, useState } from 'react';
import {
    Button, Checkbox, Col, Collapse, Drawer, Row, Space, Tooltip, Input
} from 'antd';
import { CheckCircleFilled, CloseCircleFilled, MinusCircleFilled, RightOutlined, SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { tableModuleGroupData, TableRowHeader } from '@/types/module/module';
import { tableOperationType } from '@/types/opearation/operation';
import { createEditType, operationIdCreateData } from '@/types/roleOperation/roleOperation';
import { moduleService } from '@/services/module/module.service';
import { roleOperationService } from '@/services/roleOperation/roleOperation.service';
import classes from './page.module.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    roleId: string;
}

const EditRoleOperation: React.FC<Props> = (props: Props) => {
    const [lstModuleGroup, setModuleGroup] = useState<tableModuleGroupData[]>();
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]); // Track expanded Collapse panels
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredModuleGroups = React.useMemo(() => {
        if (!lstModuleGroup || !searchTerm.trim()) return lstModuleGroup || [];

        const searchLower = searchTerm.toLowerCase();

        return lstModuleGroup.filter(moduleGroup => {
            // Check if module code matches search term
            const moduleCodeMatches = moduleGroup.moduleCode?.toLowerCase().includes(searchLower);

            // Filter operations based on search criteria
            const filteredOperations = moduleGroup.operations?.filter(op => {
                const codeMatches = op.code?.toLowerCase().includes(searchLower);
                const nameMatches = op.name?.toLowerCase().includes(searchLower);
                return codeMatches || nameMatches;
            });

            // Show module if its code matches or if it has matching operations
            return moduleCodeMatches || (filteredOperations && filteredOperations.length > 0);
        }).map(moduleGroup => {
            if (!searchTerm.trim()) return moduleGroup;

            // Return module with only matching operations
            return {
                ...moduleGroup,
                operations: moduleGroup.operations?.filter(op => {
                    const codeMatches = op.code?.toLowerCase().includes(searchLower);
                    const nameMatches = op.name?.toLowerCase().includes(searchLower);
                    return codeMatches || nameMatches;
                })
            };
        });
    }, [lstModuleGroup, searchTerm]);


    const handleCheckboxChange = useCallback(
        (moduleCode: string, id: string, checked: boolean) => {
            setModuleGroup((prevGroups) => {
                if (!prevGroups) return prevGroups;

                return prevGroups.map((group) => {
                    if (group.moduleCode === moduleCode) {
                        return {
                            ...group,
                            operations: group.operations?.map((op) => {
                                if (op.id === id) {
                                    return {
                                        ...op,
                                        isAccess: checked,
                                    };
                                }
                                return op;
                            }),
                        };
                    }
                    return group;
                });
            });
        },
        []
    );

    const handleSelectAll = useCallback(
        (moduleCode: string, checked: boolean) => {
            setModuleGroup((prevGroups) => {
                if (!prevGroups) return prevGroups;

                return prevGroups.map((group) => {
                    if (group.moduleCode === moduleCode) {
                        return {
                            ...group,
                            operations: group.operations?.map((op) => {
                                return {
                                    ...op,
                                    isAccess: checked,
                                };
                            }),
                        };
                    }
                    return group;
                });
            });
        },
        []
    );

    const TableRow = React.memo(function tableRow({
                                                      moduleCode,
                                                      operation,
                                                      idx,
                                                  }: {
        operation: tableOperationType;
        idx: number;
        moduleCode: string;
    }) {
        return (
            <tr key={uuidv4()}>
                <td className={`${classes.cssTHead}`}>{idx}</td>
                <td className={`${classes.cssTHead} ${classes.cssChuTrongTable}`}>
                    {operation.code}
                </td>
                <td className={`${classes.cssTHead} ${classes.cssChuTrongTable}`}>
                    {operation.name}
                </td>
                <td className={`${classes.cssTHead} text-center`}>
                    <Checkbox
                        checked={operation.isAccess}
                        onChange={(e) =>
                            handleCheckboxChange(
                                moduleCode,
                                operation.id ?? '',
                                e.target.checked
                            )
                        }
                    />
                </td>
            </tr>
        );
    });

    const TableHeader = React.memo(function tableHeader({
                                                            moduleCode,
                                                            isAllChecked,
                                                            isIndeterminate,
                                                        }: TableRowHeader) {
        return (
            <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left', position: 'sticky', top: 0, zIndex: 1 }}>
                <th className={`${classes.cssTHead}`}>STT</th>
                <th className={`${classes.cssTHead} ${classes.cssTheadWidth}`}>Mã</th>
                <th className={`${classes.cssTHead} ${classes.cssTheadWidth}`}>
                    Thao tác
                </th>
                <th className={`${classes.cssTHead} text-center`}>
                    <Checkbox
                        checked={isAllChecked}
                        indeterminate={isIndeterminate}
                        onChange={(e) => handleSelectAll(moduleCode, e.target.checked)}
                    />
                </th>
            </tr>
        );
    });

    const handleGetModuleGroupData = async (roleId: string) => {
        try {
            const response = await moduleService.getModuleGroupData(roleId);
            if (response.status && response.data) {
                setModuleGroup(response.data);

                // Auto-expand all panels by setting all module codes as expanded keys
                const allKeys = response.data.map((group: tableModuleGroupData) => group.moduleCode);
                setExpandedKeys(allKeys);
            } else {
                toast.error('Có lỗi xảy ra');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra: ' + error);
        }
    };

    const onCollapseChange = (keys: string[] | string) => {
        setExpandedKeys(Array.isArray(keys) ? keys : [keys].filter(key => key));
    };

    const handleAddRoleOperation = async () => {
        try {
            const listOperaion: operationIdCreateData[] = [];
            lstModuleGroup?.forEach((item) => {
                if (item.operations) {
                    item.operations.forEach((op) => {
                        listOperaion.push({
                            operationId: op.id ? op.id : '',
                            isAccess: op.isAccess ? 1 : 0,
                        });
                    });
                }
            });

            const createRoleOperation: createEditType = {
                roleId: props.roleId,
                listOperationCreateVM: listOperaion,
            };
            const response = await roleOperationService.Create(createRoleOperation);
            if (response.status) {
                toast.success('Cập nhật dữ liệu thành công');
            }
        } catch (ex) {
            toast.error('Có lỗi xảy ra: ' + ex);
        }
    };

    useEffect(() => {
        if (props.roleId !== '' && props.isOpen) {
            handleGetModuleGroupData(props.roleId);
        }

        if (!props.isOpen) {
            setExpandedKeys([]);
            setSearchTerm('');
        }
    }, [props.isOpen, props.roleId]);

    return (
        <>
            <Drawer
                title={`Chọn quyền`}
                width="95%"
                closable={true}
                open={props.isOpen}
                onClose={props.onClose}
                style={{ position: 'relative' }}
                bodyStyle={{ height: 'calc(100% - 55px)', padding: '16px', overflow: 'hidden' }}
                extra={
                    <Space>
                        <Button
                            onClick={() => {
                                handleAddRoleOperation();
                            }}
                            variant="solid"
                            color="primary"
                            size="small"
                        >
                            Lưu lại
                        </Button>
                        <Button
                            onClick={props.onClose}
                            size="small"
                            variant="outlined"
                            color="primary"
                        >
                            Hủy
                        </Button>
                    </Space>
                }
            >
                <div style={{ marginBottom: '16px' }}>
                    <Input
                        placeholder="Tìm theo mã hoặc tên thao tác"
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                    />
                </div>
                <Row
                    gutter={[20, 20]}
                    style={{
                        height: "calc(100% - 40px)",
                        overflow: "auto",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-start"
                    }}
                >
                    {filteredModuleGroups &&
                        filteredModuleGroups.length > 0 &&
                        filteredModuleGroups.map((moduleGroup) => {
                            if (!moduleGroup) return null;

                            const isAllChecked =
                                moduleGroup.operations &&
                                moduleGroup.operations.length > 0 &&
                                moduleGroup.operations.every((op) => op.isAccess);

                            const isIndeterminate =
                                moduleGroup.operations &&
                                moduleGroup.operations.length > 0 &&
                                moduleGroup.operations.some((op) => op.isAccess) &&
                                !moduleGroup.operations.every((op) => op.isAccess);

                            const getStatusIndicator = () => {
                                if (isAllChecked) {
                                    return (
                                        <Tooltip title="Đã chọn tất cả">
                                            <CheckCircleFilled style={{color: '#52c41a', marginRight: 8}}/>
                                        </Tooltip>
                                    );
                                } else if (isIndeterminate) {
                                    return (
                                        <Tooltip title="Chọn một phần">
                                            <MinusCircleFilled style={{color: '#faad14', marginRight: 8}}/>
                                        </Tooltip>
                                    );
                                } else {
                                    return (
                                        <Tooltip title="Chưa chọn">
                                            <CloseCircleFilled style={{color: '#ff4d4f', marginRight: 8}}/>
                                        </Tooltip>
                                    );
                                }
                            };

                            return (
                                <Col
                                    className="gutter-row"
                                    span={6}
                                    key={uuidv4()}
                                    style={{ display: 'flex', alignItems: 'stretch', marginBottom: '20px' }}
                                >
                                    <Collapse
                                        size="small"
                                        activeKey={expandedKeys}
                                        onChange={onCollapseChange}
                                        style={{ width: '100%' }}
                                        className={classes.fullHeightCollapse}
                                        items={[
                                            {
                                                key: `${moduleGroup?.moduleCode}`,
                                                label: (
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        {getStatusIndicator()}
                                                        <span>{moduleGroup?.moduleName}</span>
                                                    </div>
                                                ),
                                                children: (
                                                    <div style={{ height: '300px', overflowY: 'auto' }}>
                                                        <table
                                                            style={{
                                                                width: '100%',
                                                                borderCollapse: 'collapse',
                                                            }}
                                                            className={`${classes.cssTable}`}
                                                        >
                                                            <thead>
                                                            <TableHeader
                                                                moduleCode={moduleGroup.moduleCode}
                                                                isAllChecked={isAllChecked ?? false}
                                                                isIndeterminate={isIndeterminate ?? false}
                                                            />
                                                            </thead>
                                                            <tbody>
                                                            {moduleGroup.operations &&
                                                                moduleGroup.operations.map((op, idx) => (
                                                                    <TableRow
                                                                        key={uuidv4()}
                                                                        operation={op}
                                                                        idx={idx + 1}
                                                                        moduleCode={moduleGroup.moduleCode}
                                                                    />
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ),
                                                className: isAllChecked
                                                    ? classes.collapseAllSelected
                                                    : isIndeterminate
                                                        ? classes.collapsePartialSelected
                                                        : classes.collapseNoneSelected,
                                            },
                                        ]}
                                        expandIcon={({isActive}) => (
                                            <RightOutlined
                                                style={{
                                                    transform: isActive
                                                        ? 'rotate(90deg)'
                                                        : 'rotate(0deg)',
                                                    transition: 'transform 0.2s ease',
                                                }}
                                            />
                                        )}
                                    />
                                </Col>
                            );
                        })}
                </Row>
            </Drawer>
        </>
    );
};

export default EditRoleOperation;