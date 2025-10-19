"use client";

import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import { StatusConstant } from "@/constants/StatusConstant";
import withAuthorization from "@/libs/authentication";
import { configFormService } from "@/services/ConfigForm/ConfigForm.service";
import { AppDispatch } from "@/store/store";
import { FormAssignByUser, SearchConfigFormDataByUser } from "@/types/ConfigForm/ConfigForm";
import
  {
    CheckCircleOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    FileTextOutlined,
    FormOutlined
  } from "@ant-design/icons";
import
  {
    Button,
    Card,
    message,
    Pagination,
    Progress,
    Tag,
    Tooltip
  } from "antd";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import classes from "./page.module.css";



const KeKhaiDanhGia: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);

  const [ListFormKeKhai, setListFormKeKhai] = useState<FormAssignByUser[]>([])



  const handleGetListFormAssign = async () =>
  {
    try
    {
      setLoading( true );
      const response = await configFormService.GetFormByUser( {
        userId: null,
        formId: null
      }  as SearchConfigFormDataByUser);
      if ( response.status )
      {
        setListFormKeKhai( response.data );
      }
    } catch ( error )
    {
      message.error( "Lỗi khi tải danh sách biểu mẫu kê khai" );  
      setLoading( false );
    } finally
    {
      setLoading( false );
    }

  }

  // Load mock data
  useEffect( () =>
  {
    handleGetListFormAssign()
  }, []);

  const handleKeKhai = useCallback((record: FormAssignByUser) => {
    // Navigate to evaluation form
    router.push(`/KeKhaiDanhGia/evaluation/${record.formId}`);
  }, [router]);

  const handleView = useCallback((record: FormAssignByUser) => {
    // Navigate to view evaluation
    router.push(`/KeKhaiDanhGia/view/${record.formId}`);
  }, [router]);

  const getStatusTag = (status: number) => {
    if (status == StatusConstant.GUIGIAOVIEN || status == StatusConstant.GUILOPTRUONG) {
      return <Tag color="success" icon={<CheckCircleOutlined />}>Đã hoàn thành</Tag>;
    } else if (status == StatusConstant.DANGKEKHAI) {
      return <Tag color="processing" icon={<ClockCircleOutlined />}>Đang thực hiện</Tag>;
    }
    else if (status == StatusConstant.TRAVESINHVIEN) {
      return <Tag color="error" icon={<ClockCircleOutlined />}>Yêu cầu chỉnh sửa</Tag>;
    } else
    {
      return <Tag color="default" icon={<FileTextOutlined />}>Chưa bắt đầu</Tag>;
    }
  };

 

  const handlePageChange = (page: number, size?: number) => {
    setPageIndex(page);
    if (size) setPageSize(size);
  };

  // Filter evaluations that need declaration (not submitted or partially completed)
  const pendingEvaluations = ListFormKeKhai.filter(
    (item) => item.status == StatusConstant.DANGKEKHAI || item.status == StatusConstant.CHUAKEKHAI
  );
  // Calculate statistics
  const totalEvaluations = ListFormKeKhai.length;
  const completedEvaluations = ListFormKeKhai.filter(item => item.status == StatusConstant.GUIGIAOVIEN || item.status == StatusConstant.GUILOPTRUONG).length;
  const inProgressEvaluations =  ListFormKeKhai.filter(item => item.status == StatusConstant.DANGKEKHAI).length;
  const notStartedEvaluations = ListFormKeKhai.filter(item => item.status == StatusConstant.CHUAKEKHAI).length;

  return (
    <>
      <AutoBreadcrumb />
      
      {/* Header with Statistics */}
      <div className={classes.headerSection}>
        <div className={classes.titleSection}>
          <h1 className={classes.pageTitle}>
            <FileTextOutlined className={classes.titleIcon} />
            Kê khai Đánh giá
          </h1>
          <p className={classes.pageDescription}>
            Quản lý và thực hiện kê khai đánh giá học sinh
          </p>
        </div>
        
        <div className={classes.statsGrid}>
          <div className={classes.statCard}>
            <div className={classes.statIcon} style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
              <FileTextOutlined />
            </div>
            <div className={classes.statContent}>
              <div className={classes.statNumber}>{totalEvaluations}</div>
              <div className={classes.statLabel}>Tổng số</div>
            </div>
          </div>
          
          <div className={classes.statCard}>
            <div className={classes.statIcon} style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
              <CheckCircleOutlined />
            </div>
            <div className={classes.statContent}>
              <div className={classes.statNumber}>{completedEvaluations}</div>
              <div className={classes.statLabel}>Đã hoàn thành</div>
            </div>
          </div>
          
          <div className={classes.statCard}>
            <div className={classes.statIcon} style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }}>
              <ClockCircleOutlined />
            </div>
            <div className={classes.statContent}>
              <div className={classes.statNumber}>{inProgressEvaluations}</div>
              <div className={classes.statLabel}>Đang thực hiện</div>
            </div>
          </div>
          
          <div className={classes.statCard}>
            <div className={classes.statIcon} style={{ backgroundColor: '#fafafa', color: '#8c8c8c' }}>
              <FormOutlined />
            </div>
            <div className={classes.statContent}>
              <div className={classes.statNumber}>{pendingEvaluations.length}</div>
              <div className={classes.statLabel}>Cần kê khai</div>
            </div>
          </div>
        </div>
      </div>

      <Card 
        title={
          <div className="flex items-center justify-between">
            <span>Danh sách cần kê khai ({pendingEvaluations.length})</span>
            <div className="text-sm text-gray-600">
              {pendingEvaluations.length > 0 
                ? `Hiển thị ${Math.min((pageIndex - 1) * pageSize + 1, pendingEvaluations.length)}-${Math.min(pageIndex * pageSize, pendingEvaluations.length)} của ${pendingEvaluations.length}`
                : "Không có dữ liệu"
              }
            </div>
          </div>
        }
        className={classes.customCardShadow}
        style={{ padding: "0px" }}
      >
        <div className={classes.cardGrid}>
          {loading ? (
            // Loading skeleton cards
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className={classes.evaluationCard} loading />
            ))
          ) : (
            pendingEvaluations
              .slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
              .map((evaluation) => (
                <Card
                  key={evaluation.id}
                  className={classes.evaluationCard}
                  hoverable
                  actions={[
                    <Tooltip title="Xem chi tiết" key="view">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(evaluation)}
                        className={classes.viewButton}
                      >
                      Xem chi tiết
                    </Button>
                    </Tooltip>,
                    <Tooltip title="Kê khai đánh giá" key="declare">
                        <Button
                          type="primary"
                          icon={<FormOutlined />}
                          onClick={() => handleKeKhai(evaluation)}
                          size="small"
                          className={classes.declareButton}
                        >
                          Kê khai
                        </Button>
                    </Tooltip>,
                     <Tooltip title="Gửi lớp trưởng" key="update">
                        <Button
                          type="primary"
                          icon={<FormOutlined />}
                          onClick={() => handleKeKhai(evaluation)}
                          size="small"
                          className={classes.declareButton}
                        >
                          Kê khai
                        </Button>
                      </Tooltip>
                  ]}
                >
                  <div className={classes.cardContent}>
                    {/* Student Info Header */}
                    <div className={classes.studentHeader}>
                      <div className={classes.studentInfo}>
                        <h3 className={classes.studentName}>
                          {evaluation.name}
                        </h3>
                      </div>
                      <div className={classes.statusWrapper}>
                        {getStatusTag(evaluation.status)}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className={classes.detailsGrid}>
                      <div className={classes.detailItem}>
                        <span className={classes.detailLabel}>Môn học:</span>
                        <span className={classes.detailValue}>{evaluation.name}</span>
                      </div>
                      <div className={classes.detailItem}>
                        <span className={classes.detailLabel}>Lớp:</span>
                        <span className={classes.detailValue}>{evaluation.description}</span>
                      </div>
                      <div className={classes.detailItem}>
                        <span className={classes.detailLabel}>Ngày nộp:</span>
                        <span className={classes.detailValue}>
                          {evaluation.createDate
                            ? new Date(evaluation.createDate).toLocaleDateString("vi-VN")
                            : "Chưa nộp"
                          }
                        </span>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className={classes.progressSection}>
                      <div className={classes.progressHeader}>
                        <span className={classes.progressLabel}>Tiến độ hoàn thành</span>
                        <span className={classes.progressPercent}>
                          {evaluation.processs}%
                        </span>
                      </div>
                      <Progress
                        percent={evaluation.processs}
                        size="small"
                        status={evaluation.processs === 100 ? "success" : "active"}
                        strokeColor={evaluation.processs === 100 ? "#52c41a" : "#1890ff"}
                        className={classes.progressBar}
                      />
                    </div>
                  </div>
                </Card>
              ))
          )}
        </div>

        {/* Empty State */}
        {!loading && pendingEvaluations.length === 0 && (
          <div className={classes.emptyState}>
            <FileTextOutlined className={classes.emptyIcon} />
            <h3 className={classes.emptyTitle}>Không có đánh giá nào cần kê khai</h3>
            <p className={classes.emptyDescription}>
              Tất cả đánh giá đã được hoàn thành.
            </p>
          </div>
        )}
        
        <div className="px-4 py-3 border-t">
          <Pagination
            current={pageIndex}
            pageSize={pageSize}
            total={pendingEvaluations.length}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} mục`
            }
            onChange={handlePageChange}
            className="text-right"
          />
        </div>
      </Card>
    </>
  );
};

export default withAuthorization(KeKhaiDanhGia, "");
