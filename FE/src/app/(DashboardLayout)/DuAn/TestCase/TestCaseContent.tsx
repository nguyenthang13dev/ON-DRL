import { Button, Upload, notification, Table, Card, Space, Popconfirm, Tooltip, Badge, Progress, Statistic, Row, Col, Modal, Dropdown, Menu } from "antd";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useCaseService } from "@/services/UseCase/UseCase.service";
import { UseCaseImportResponseType, UseCaseGroupType, UseCaseWithDetailsType } from "@/types/UseCase/UseCase";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import ImportResultModal from "./ImportResultModal";
import DetailTestCase from "./DetailTestCase";
import TestCaseModal from "./TestCaseModal";
import TestCaseDetailView from "./TestCaseDetailView";
import { useCase_NhomService } from "@/services/UseCase_Nhom/UseCase_Nhom.service";
import { 
  DeleteOutlined, 
  EditOutlined, 
  EyeOutlined, 
  SettingOutlined,
  ProjectOutlined,
  BugOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import styles from "./TestCaseContent.module.css";

const TestCaseContent = () => {
  const [importLoading, setImportLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const duAnId = useParams().id as string;  
  const [modalVisible, setModalVisible] = useState(false);
  const [importResult, setImportResult] = useState<UseCaseImportResponseType | null>(null);
  const [savedUseCases, setSavedUseCases] = useState<UseCaseGroupType[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseGroupType | null>(null);
  
  // New states for detailed view
  const [testCaseDetailVisible, setTestCaseDetailVisible] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<UseCaseWithDetailsType | null>(null);
  
  // New states for custom delete confirmation modal
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<UseCaseGroupType | null>(null);
  
  // Filter state for dashboard cards
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const permissions = useRolePermissions();

  const loadUseCaseData = useCallback(async () => {
    if (!duAnId) return;
    
    setDataLoading(true);
    try {
      const result = await useCaseService.getDataintoUseCaseMota(duAnId);
      
      if (result.status && result.data) {
        setSavedUseCases(result.data);
      } else {
        notification.error({
          message: 'Lỗi tải dữ liệu',
          description: result.message || 'Không thể tải danh sách Use Case',
        });
      }
    } catch (error) {
      console.error('Load data error:', error);
      notification.error({
        message: 'Lỗi tải dữ liệu',
        description: 'Có lỗi xảy ra khi tải danh sách Use Case',
      });
    } finally {
      setDataLoading(false);
    }
  }, [duAnId]);

  // Load existing data when component mounts
  useEffect(() => {
    loadUseCaseData();
  }, [loadUseCaseData]);

  const handleFileUpload = async (file: File) => {
    setImportLoading(true);
    try {
      const result = await useCaseService.readExcel(file, duAnId);
      
      if (result.status) {
        setImportResult(result);
        setModalVisible(true);
        
        const validCount = result.data?.data?.filter(item => item.isValid === true).length || 0;
        const invalidCount = result.data?.data?.filter(item => item.isValid === false).length || 0;
        
        if (invalidCount > 0) {
          notification.warning({
            message: 'Import hoàn tất với cảnh báo',
            description: (
              <div>
                <div><strong>{validCount}</strong> Use Case hợp lệ</div>
                <div> <strong>{invalidCount}</strong> Use Case có lỗi (không thể lưu)</div>
                <div className="text-blue-600 mt-1">Vui lòng kiểm tra tab Dữ liệu có lỗi để xem chi tiết</div>
              </div>
            ),
            duration: 6,
          });
        } else {
          notification.success({
            message: 'Import thành công',
            description: `Đã import ${validCount} Use Case thành công! Tất cả dữ liệu đều hợp lệ.`, 
          });
        }
      } else {
        notification.error({
          message: 'Import thất bại',
          description: result.message || 'Có lỗi xảy ra trong quá trình import',
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      notification.error({
        message: 'Import thất bại',
        description: 'Có lỗi xảy ra trong quá trình import file Excel',
      });
    } finally {
      setImportLoading(false);
    }
    
    // Prevent auto upload
    return false;
  };

  const exportExcelUseCaseAndTestCase = async () => {
    try {
      const result = await useCaseService.ExportExcelUseCaseAndTestCase(duAnId);
      if (result.status) {
        //xlsx
        const downloadUrl = `${process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL}/${result.data}`;
        
        // Create a temporary anchor element and trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `UseCaseAndTestCase_${new Date().toISOString().slice(0, 10)}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Xuất Excel thành công!");
      } else {
        toast.error(result.message || 'Có lỗi xảy ra trong quá trình export');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export thất bại');
    }
  };

  const handleSaveSelected = async (savedData: UseCaseGroupType[]) => {
    // Reload data from server to get the most up-to-date information
    await loadUseCaseData();
    
    notification.success({
      message: 'Đã lưu thành công',
      description: `${savedData.length} Use Case đã được lưu vào hệ thống`,
    });
  };

  const handleViewDetail = (record: UseCaseGroupType) => {
    setSelectedUseCase(record);
    setDetailModalVisible(true);
  };

  const handleEdit = (record: UseCaseGroupType) => {
    setSelectedUseCase(record);
    setEditModalVisible(true);
  };

  const handleDelete = async (record: UseCaseGroupType) => {
    try {
      const response = await useCase_NhomService.delete(record.id);
      if (response.status) {
        setSavedUseCases(prev => prev.filter(item => item.id !== record.id));
        notification.success({
          message: 'Xóa Use Case thành công',
          description: 'Use Case đã được xóa khỏi hệ thống. Các Test Case liên quan (nếu có) cũng đã được xóa.',
        });
      } else {
        notification.error({
          message: 'Xóa Use Case thất bại',
          description: response.message || 'Có lỗi xảy ra trong quá trình xóa Use Case',
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      notification.error({
        message: 'Xóa Use Case thất bại',
        description: 'Có lỗi xảy ra trong quá trình xóa Use Case',
      });
    }
  };

  const handleAddNew = () => {
    setSelectedUseCase(null);
    setEditModalVisible(true);
  };

  const handleRefresh = () => {
    loadUseCaseData();
  };

  // New handlers for detailed test case view
  const handleViewTestCaseDetail = (testCase: UseCaseWithDetailsType, useCase: UseCaseGroupType) => {
    setSelectedTestCase(testCase);
    setSelectedUseCase(useCase);
    setTestCaseDetailVisible(true);
  };

  // Handler to open TestCaseDetailView for a UseCaseGroup
  const handleManageTestCases = (record: UseCaseGroupType) => {
    if (record.listUC_mota && record.listUC_mota.length > 0) {
      setSelectedTestCase(record.listUC_mota[0]); // Select the first test case
      setSelectedUseCase(record); // Keep track of the parent use case
      setTestCaseDetailVisible(true); // Open the detailed view modal
    } else {
      notification.info({
        message: 'Không có Test Case',
        description: 'Use Case này chưa có Test Case nào để quản lý.',
      });
    }
  };

  const handleUpdateTestCase = (updatedTestCase: UseCaseWithDetailsType) => {
    if (!selectedUseCase) return;
    
    // Update the test case in the use case
    const updatedUseCase = {
      ...selectedUseCase,
      listUC_mota: selectedUseCase.listUC_mota?.map(tc => 
        tc.id === updatedTestCase.id ? updatedTestCase : tc
      ) || []
    };
    
    // Update in the main list
    setSavedUseCases(prev => prev.map(uc => 
      uc.id === selectedUseCase.id ? updatedUseCase : uc
    ));
    
    setSelectedTestCase(updatedTestCase);
    
    notification.success({
      message: 'Cập nhật thành công',
      description: 'Test case đã được cập nhật',
    });
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUseCases = savedUseCases.length;
    let totalTestCases = 0;
    let passedTestCases = 0;
    let failedTestCases = 0;
    let pendingTestCases = 0;

    savedUseCases.forEach(useCase => {
      const testCases = useCase.listUC_mota || [];
      totalTestCases += testCases.length;
      
      testCases.forEach(testCase => {
          if (!testCase || testCase.trangThai === null) return;
        const status = testCase.trangThai?.toLowerCase();
        
        if (status === 'pass' || status === 'passed') {
          passedTestCases++;
        } else if (status === 'fail' || status === 'failed') {
          failedTestCases++;
        } else {
          pendingTestCases++;
        }
      });
    });

    const completionRate = totalTestCases > 0 ? (Math.round((passedTestCases / totalTestCases) * 100)) : 0;

    return {
      totalUseCases,
      totalTestCases,
      passedTestCases,
      failedTestCases,
      pendingTestCases,
      completionRate,
    };
  }, [savedUseCases]);

  // Filter data based on active filter
  const filteredUseCases = useMemo(() => {
    if (activeFilter === 'all') return savedUseCases;
    
    return savedUseCases.filter(useCase => {
      const testCases = useCase.listUC_mota !=null ? useCase.listUC_mota : [];
      const total = Array.isArray(testCases) ? testCases.filter(x => x != null).length : 0;

      const passed = testCases.filter(t => t && t.trangThai?.toLowerCase() === 'pass').length;
      const failed = testCases.filter(t => t && t.trangThai?.toLowerCase() === 'fail').length;
      
      switch (activeFilter) {
        case 'usecases':
          return true; // All use cases
        case 'testcases':
          return total > 0; // Use cases with test cases
        case 'passed':
          return passed > 0; // Use cases with passed tests
        case 'completion':
          return total > 0; // Use cases for completion rate calculation
        default:
          return true;
      }
    });
  }, [savedUseCases, activeFilter]);

  // Handle card click for filtering
  const handleCardClick = (filterType: string) => {
    setActiveFilter(filterType);
  };

  // Admin view - Full access with statistics
  const getAdminColumns = () => [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      align: 'center' as const,
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: 'Use Case',
      dataIndex: 'tenUseCase',
      key: 'tenUseCase',
      width: '30%',
      render: (text: string, record: UseCaseGroupType) => (
        <div 
          className="font-semibold text-blue-600 cursor-pointer" 
          onClick={() => handleViewDetail(record)}
          style={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          <Tooltip title={text}>
            {text}
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Tác nhân',
      dataIndex: 'tacNhanChinh',
      key: 'tacNhanChinh',
      width: '20%',
      render: (text: string, record: UseCaseGroupType) => (
        <div>
          <div className="font-medium" style={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <Tooltip title={text}>
              {text}
            </Tooltip>
          </div>
          {record.tacNhanPhu && (
            <div className="text-sm text-gray-500" style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              <Tooltip title={record.tacNhanPhu}>
                {record.tacNhanPhu}
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'doCanThiet',
      key: 'doCanThiet',
      width: '8%',
      align: 'center' as const,
      render: (text: string) => (
        <Badge 
          status={text === 'A' ? 'error' : text === 'B' ? 'warning' : 'success'} 
          text={text}
        />
      ),
    },
    {
      title: 'Test Cases',
      dataIndex: 'listUC_mota',
      key: 'testCaseProgress',
      width: '15%',
      align: 'center' as const,
      render: (list: UseCaseWithDetailsType[]) => {
        const total = Array.isArray(list) ? list.filter(x => x != null).length : 0;

    
        const passed = list?.filter(t => t && t.trangThai?.toLowerCase() === 'pass').length || 0;
        const progress = total > 0 ? (passed / total) * 100 : 0;
        
        return (
          <div>
            <div className="text-sm mb-1">{passed}/{total}</div>
            <Progress 
              percent={total > 0 ? Math.round(progress) : 0} 
              size="small" 
              showInfo={false} 
            />
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '12%',
      align: 'center' as const,
      render: (_: any, record: UseCaseGroupType) => {
        const menu = (
          <Menu
            onClick={({ key }) => {
              if (key === 'view') handleViewDetail(record);
              else if (key === 'edit') handleEdit(record);
              else if (key === 'delete') {
                setDeletingRecord(record);
                setConfirmDeleteModalVisible(true);
              }
            }}
          >
            <Menu.Item key="view" icon={<EyeOutlined />}>
              Xem tổng quan
            </Menu.Item>
            {permissions.canEditUseCase && (
              <Menu.Item key="edit" icon={<EditOutlined />}>
                Sửa
              </Menu.Item>
            )}
            {permissions.canDeleteUseCase && (
              <Menu.Item key="delete" icon={<DeleteOutlined />}>
                Xóa
              </Menu.Item>
            )}
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button size="small">
              Thao tác
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  // Dev view - Focus on development and testing
  const getDevColumns = () => [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: 'Use Case',
      dataIndex: 'tenUseCase',
      key: 'tenUseCase',
      render: (text: string, record: UseCaseGroupType) => (
        <div>
          <div className="font-semibold text-blue-600 mb-1">{text}</div>
          <div className="text-sm text-gray-600">{record.moTa}</div>
        </div>
      ),
    },
    {
      title: 'Độ phức tạp',
      dataIndex: 'doPhucTap',
      key: 'doPhucTap',
      width: 120,
      render: (text: string) => (
        <Badge 
          color={text === 'Phức tạp' ? 'red' : text === 'Trung bình' ? 'orange' : 'green'}
          text={text}
        />
      ),
    },
    {
      title: 'Tiến độ Test',
      dataIndex: 'listUC_mota',
      key: 'testProgress',
      width: 200,
      render: (list: UseCaseWithDetailsType[]) => {
        const total = Array.isArray(list) ? list.filter(x => x != null).length : 0;
        const passed = list?.filter(t => t && t.trangThai?.toLowerCase() === 'pass').length || 0;
        const failed = list?.filter(t => t && t.trangThai?.toLowerCase() === 'fail').length || 0;
        const pending = total - passed - failed;
        
        return (
          <div>
            <div className="flex gap-2 text-sm mb-1">
              <span className="text-green-600">Pass: {passed}</span>
              <span className="text-red-600">Fail: {failed}</span>
              <span className="text-gray-600">Pending: {pending}</span>
            </div>
            <Progress 
              percent={total > 0 ? Math.round((passed / total) * 100) : 0} 
              size="small" 
              strokeColor="#52c41a"
            />
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: any, record: UseCaseGroupType) => {
        const menu = (
          <Menu
            onClick={({ key }) => {
              if (key === 'detail') handleViewDetail(record);
              else if (key === 'manage') handleManageTestCases(record);
            }}
          >
            <Menu.Item key="detail">
              Chi tiết
            </Menu.Item>
            {(permissions.canEditTestCase || permissions.canUpdateTestStatus) && (
              <Menu.Item key="manage">
                Quản lý Test Cases
              </Menu.Item>
            )}
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button size="small">
              Thao tác
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  // Tester view - Focus on testing status and workflow
  const getTesterColumns = () => [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: 'Use Case cần test',
      dataIndex: 'tenUseCase',
      key: 'tenUseCase',
      render: (text: string, record: UseCaseGroupType) => (
        <div>
          <div className="font-semibold text-blue-600 text-base">{text}</div>
          <div className="text-sm text-gray-600 mt-1">{record.tacNhanChinh}</div>
          <div className="text-xs text-gray-500 mt-1">Mức độ cần thiết: {record.doCanThiet}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái Test',
      dataIndex: 'listUC_mota',
      key: 'testStatus',
      width: 150,
      render: (list: UseCaseWithDetailsType[]) => {
        const total = Array.isArray(list) ? list.filter(x => x != null).length : 0;
        const passed = list?.filter(t => t && t.trangThai?.toLowerCase() === 'pass').length || 0;
        const failed = list?.filter(t => t && t.trangThai?.toLowerCase() === 'fail').length || 0;
        const pending = total - passed - failed;
        
        if (total === 0) return <Badge status="default" text="Chưa có test" />;
        if (passed === total) return <Badge status="success" text="Hoàn thành" />;
        if (failed > 0) return <Badge status="error" text="Có lỗi" />;
        return <Badge status="processing" text="Đang test" />;
      },
    },
    {
      title: 'Tiến độ',
      dataIndex: 'listUC_mota',
      key: 'progress',
      width: 120,
      render: (list: UseCaseWithDetailsType[]) => {
        const total = list?.length || 0;
        const completed = list?.filter(t => t && (
          t.trangThai?.toLowerCase() === 'pass' || t.trangThai?.toLowerCase() === 'fail'
        )).length || 0;
        
        return (
          <div>
            <div className="text-sm text-center font-medium">{completed}/{total}</div>
            <Progress 
              percent={total > 0 ? Math.round((completed / total) * 100) : 0} 
              size="small"
              strokeColor="#1890ff"
            />
          </div>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      render: (_: any, record: UseCaseGroupType) => {
        const menu = (
          <Menu
            onClick={({ key }) => {
              if (key === 'check') handleViewDetail(record);
              else if (key === 'manage') handleManageTestCases(record);
            }}
          >
            <Menu.Item key="check">
              Kiểm tra
            </Menu.Item>
            {permissions.canUpdateTestStatus && (
              <Menu.Item key="manage">
                Quản lý Test Cases
              </Menu.Item>
            )}
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button size="small" block>
              Thao tác
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const getCurrentColumns = () => {
    if (permissions.canAccessAdminView) return getAdminColumns();
    if (permissions.canAccessDevView) return getDevColumns();
    return getTesterColumns();
  };

  const getPageTitle = () => {
    if (permissions.canAccessAdminView) return 'Quản lý Test Case';
    if (permissions.canAccessDevView) return 'Phát triển & Test Case';
    return 'Kiểm thử Use Case';
  };

  const getPageDescription = () => {
    const totalCount = savedUseCases.length;
    const filteredCount = filteredUseCases.length;
    const filterText = activeFilter !== 'all' ? ` (hiển thị ${filteredCount} mục đã lọc)` : '';
    
    if (permissions.canAccessAdminView) return `Quản lý toàn bộ ${totalCount} Use Case trong dự án${filterText}`;
    if (permissions.canAccessDevView) return `${totalCount} Use Case cần phát triển và kiểm thử${filterText}`;
    return `${totalCount} Use Case cần kiểm thử và đánh giá chất lượng${filterText}`;
  };

  return (
    <>
      {/* Modern Test Case Dashboard */}
      {permissions.canViewSystemMetrics && (
        <div className={styles.dashboard}>
          {/* Header Section */}
        

          {/* Interactive Stats Grid */}
          <Row gutter={[16, 16]}>
            {/* Total Use Cases */}
            <Col xs={12} sm={6}>
              <div 
                className={`${styles.statCard} ${activeFilter === 'usecases' ? styles.active : ''}`}
                onClick={() => handleCardClick('usecases')}
              >
                <div className={`${styles.iconContainer} ${styles.iconContainerBlue}`}>
                  <ProjectOutlined className={styles.iconStyle} />
                </div>
                <div>
                  <div className={styles.statValue}>{stats.totalUseCases}</div>
                  <div className={styles.statLabel}>Use Cases</div>
                </div>
              </div>
            </Col>

            {/* Total Test Cases */}
            <Col xs={12} sm={6}>
              <div 
                className={`${styles.statCard} ${activeFilter === 'testcases' ? styles.active : ''}`}
                onClick={() => handleCardClick('testcases')}
              >
                <div className={`${styles.iconContainer} ${styles.iconContainerPurple}`}>
                  <BugOutlined className={styles.iconStyle} />
                </div>
                <div>
                  <div className={styles.statValue}>{stats.totalTestCases}</div>
                  <div className={styles.statLabel}>Test Cases</div>
                </div>
              </div>
            </Col>

            {/* Passed Tests */}
            <Col xs={12} sm={6}>
              <div 
                className={`${styles.statCard} ${activeFilter === 'passed' ? styles.active : ''}`}
                onClick={() => handleCardClick('passed')}
              >
                <div className={`${styles.iconContainer} ${styles.iconContainerGreen}`}>
                  <CheckCircleOutlined className={styles.iconStyle} />
                </div>
                <div>
                  <div className={styles.statValue}>{stats.passedTestCases}</div>
                  <div className={styles.statLabel}>Passed Tests</div>
                 
                </div>
              </div>
            </Col>

            {/* Completion Rate with Progress */}
            <Col xs={12} sm={6}>
              <div 
                className={`${styles.statCard} ${activeFilter === 'completion' ? styles.active : ''}`}
                onClick={() => handleCardClick('completion')}
              >
                <div className={`${styles.iconContainer} ${styles.iconContainerTeal}`}>
                  <TrophyOutlined className={styles.iconStyle} />
                </div>
                <div>
                  <div className={styles.statValue}>{stats.completionRate}%</div>
                  <div className={styles.statLabelWithProgress}>Completion</div>
                  <div className={styles.progressBar}>
                    <div 
                      className={`${styles.progressFill} ${stats.completionRate > 80 ? styles.progressFillHigh : stats.completionRate > 50 ? styles.progressFillMedium : styles.progressFillLow}`}
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Additional Stats Row - Failed & Pending */}
          <Row gutter={[24, 16]} className={styles.additionalStatsRow}>
            <Col xs={24} sm={8}>
              <div className={`${styles.smallStatCard} ${styles.smallStatCardRed}`}>
                <div className={`${styles.smallIconContainer} ${styles.smallIconContainerRed}`}>
                  <ExclamationCircleOutlined className={styles.smallIconStyle} />
                </div>
                <div>
                  <div className={`${styles.smallStatValue} ${styles.smallStatValueRed}`}>
                    {stats.failedTestCases}
                  </div>
                  <div className={styles.smallStatLabel}>Failed Tests</div>
                </div>
              </div>
            </Col>
            
            <Col xs={24} sm={8}>
              <div className={`${styles.smallStatCard} ${styles.smallStatCardYellow}`}>
                <div className={`${styles.smallIconContainer} ${styles.smallIconContainerYellow}`}>
                  <ClockCircleOutlined className={styles.smallIconStyle} />
                </div>
                <div>
                  <div className={`${styles.smallStatValue} ${styles.smallStatValueYellow}`}>
                    {stats.pendingTestCases}
                  </div>
                  <div className={styles.smallStatLabel}>Pending Tests</div>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={8}>
              <div className={`${styles.smallStatCard} ${styles.smallStatCardGray}`}>
                <div className={`${styles.smallIconContainer} ${styles.smallIconContainerGray}`}>
                  <SettingOutlined className={styles.smallIconStyle} />
                </div>
                <div>
                  <div className={`${styles.smallStatValue} ${styles.smallStatValueGray}`}>
                    {stats.totalTestCases > 0 ? Math.round(((stats.passedTestCases + stats.failedTestCases) / stats.totalTestCases) * 100) : 0}%
                  </div>
                  <div className={styles.smallStatLabel}>Tested</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}

      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">{getPageTitle()}</h3>
            <p className="text-gray-600 text-base">{getPageDescription()}</p>
          </div>
          <Space>
            {activeFilter !== 'all' && (
              <Button 
                onClick={() => handleCardClick('all')}
                type="default"
                size="small"
              >
                Hiển thị tất cả
              </Button>
            )}
            <Button onClick={handleRefresh} loading={dataLoading}>
              Làm mới
            </Button>
            {permissions.canCreateUseCase && (
              <Button type="default" onClick={handleAddNew}>
                Thêm mới
              </Button>
            )}
            {permissions.canImportExcel && (
              <Upload
                accept=".xlsx,.xls"
                showUploadList={false}
                beforeUpload={handleFileUpload}
                disabled={importLoading}
              >
                <Button type="primary" loading={importLoading}>
                  Import Excel
                </Button>
              </Upload>
            )}
            <Button type="primary" onClick={exportExcelUseCaseAndTestCase}>
              Export Excel
            </Button>
          </Space>
        </div>

        <Table
          columns={getCurrentColumns()}
          dataSource={filteredUseCases}
          rowKey="id"
          bordered
          loading={dataLoading}
          pagination={{
            pageSize: permissions.canAccessAdminView ? 10 : permissions.canAccessDevView ? 12 : 8,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Hiển thị ${total} mục ${activeFilter !== 'all' ? '(đã lọc)' : ''}`,
            pageSizeOptions: ['5', '10', '15', '20'],
          }}
          scroll={{ x: 800 }}
          size={permissions.canAccessTesterView ? "middle" : "small"}
          className={styles.cleanTable}
        />
      </Card>

      {/* Import Result Modal */}
      <ImportResultModal
        visible={modalVisible}
        data={importResult}
        duAnId={duAnId}
        onSave={handleSaveSelected}
        onClose={() => {
          setModalVisible(false);
          setImportResult(null);
        }}
      />

      {/* Original Detail Modal */}
      <DetailTestCase
        visible={detailModalVisible}
        data={selectedUseCase}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedUseCase(null);
        }}
      />

      {/* Edit/Create Modal */}
      <TestCaseModal
        visible={editModalVisible}
        data={selectedUseCase}
        duAnId={duAnId}
        onSave={async (savedData) => {
          // Check if it's a new Use Case (no existing id or selectedUseCase is null)
          const isNewUseCase = !selectedUseCase?.id;
          
          if (isNewUseCase) {
            // For new Use Case, call createUseCaseAndTestCase API
            try {
              //temp Id uuid
              savedData.id = crypto.randomUUID();
              const result = await useCaseService.createUseCaseAndTestCase(savedData);
              if (result.status) {
                notification.success({
                  message: 'Thêm mới Use Case thành công',
                  description: 'Use Case và các Test Case liên quan đã được tạo.',
                });
                // Reload data to reflect the newly created Use Case and its Test Cases
                await loadUseCaseData();
              } else {
                notification.error({
                  message: 'Thêm mới Use Case thất bại',
                  description: result.message || 'Có lỗi xảy ra khi tạo Use Case và Test Case.',
                });
              }
            } catch (error) {
              console.error('Create Use Case and Test Case error:', error);
              notification.error({
                message: 'Thêm mới Use Case thất bại',
                description: 'Có lỗi xảy ra trong quá trình tạo Use Case và Test Case.',
              });
            }
          } else {
            // For existing Use Case, just update the local state
            setSavedUseCases(prev => {
              const existingIndex = prev.findIndex(uc => uc.id === savedData.id);
              if (existingIndex > -1) {
                const newArr = [...prev];
                newArr[existingIndex] = savedData;
                return newArr;
              }
              return prev;
            });
          }
          setEditModalVisible(false);
          setSelectedUseCase(null);
        }}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedUseCase(null);
        }}
      />

      {/* New Detailed Test Case View Modal */}
      <Modal
        title="Chi tiết Test Case"
        open={testCaseDetailVisible}
        onCancel={() => {
          setTestCaseDetailVisible(false);
          setSelectedTestCase(null);
        }}
        width={1400}
        footer={null}
        className="test-case-detail-modal"
      >
        {selectedTestCase && selectedUseCase && (
          <TestCaseDetailView
            testCase={selectedTestCase}
            useCaseName={selectedUseCase.tenUseCase || 'Use Case không tên'}
            onUpdate={handleUpdateTestCase}
            onClose={() => {
              setTestCaseDetailVisible(false);
              setSelectedTestCase(null);
            }}
            mode="view"
          />
        )}
      </Modal>

      {/* Custom Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa Use Case"
        open={confirmDeleteModalVisible}
        onOk={async () => {
          if (deletingRecord) {
            await handleDelete(deletingRecord);
            setConfirmDeleteModalVisible(false);
            setDeletingRecord(null);
          }
        }}
        onCancel={() => {
          setConfirmDeleteModalVisible(false);
          setDeletingRecord(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa Use Case <strong>{deletingRecord?.tenUseCase}</strong> không?</p>
        <p>Hành động này sẽ xóa tất cả các Test Case liên quan thuộc Use Case này.</p>
      </Modal>
    </>
  );
};

export default TestCaseContent;   