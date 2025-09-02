"use client";
import React from 'react';
import { Row, Col, Statistic, Progress, Typography, Tooltip } from 'antd';
import { 
  MdPerson, 
  MdOutlinePendingActions, 
  MdCheckCircle, 
  MdEventNote, 
  MdWork, 
  MdCancel, 
  MdEmojiEvents, 
  MdToday
} from 'react-icons/md';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { STATUS_CONFIG } from './CalendarView';
import { TD_UngVienTongQuanVM, TrangThaiUngVien } from '@/types/TD_UngVien/TD_UngVien';
import styles from './InterviewSchedule.module.css';

const { Title, Text } = Typography;

interface DashboardProps {
  stats: TD_UngVienTongQuanVM;
  loading?: boolean;
  onStatCardClick?: (status: number | null, isToday?: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, loading = false, onStatCardClick }) => {
  const statCards = [
    {
      title: 'Tổng ứng viên',
      value: stats.totalCandidates,
      icon: <MdPerson size={30} color="#1890ff" />,
      color: '#1890ff',
      suffix: 'ứng viên',
      status: null,
      isToday: false
    },
    {
      title: 'Chưa xét duyệt',
      value: stats.chuaXetDuyet,
      icon: <MdOutlinePendingActions size={30} color={STATUS_CONFIG[TrangThaiUngVien.ChuaXetDuyet as TrangThaiUngVien].color} />,
      color: STATUS_CONFIG[TrangThaiUngVien.ChuaXetDuyet as TrangThaiUngVien].color,
      suffix: 'ứng viên',
      status: 0,
      isToday: false
    },
    {
      title: 'Đã xét duyệt',
      value: stats.daXetDuyet,
      icon: <MdCheckCircle size={30} color={STATUS_CONFIG[TrangThaiUngVien.DaXetDuyet as TrangThaiUngVien].color} />,
      color: STATUS_CONFIG[TrangThaiUngVien.DaXetDuyet as TrangThaiUngVien].color,
      suffix: 'ứng viên',
      status: 1,
      isToday: false
    },
    {
      title: 'Chờ phỏng vấn',
      value: stats.dangChoPhongVan,
      icon: <MdEventNote size={30} color={STATUS_CONFIG[TrangThaiUngVien.DangChoPhongVan as TrangThaiUngVien].color} />,
      color: STATUS_CONFIG[TrangThaiUngVien.DangChoPhongVan as TrangThaiUngVien].color,
      suffix: 'ứng viên',
      status: 2,
      isToday: false
    },
    {
      title: 'Đã nhận việc',
      value: stats.daNhanViec,
      icon: <MdWork size={30} color={STATUS_CONFIG[TrangThaiUngVien.DaNhanViec as TrangThaiUngVien].color} />,
      color: STATUS_CONFIG[TrangThaiUngVien.DaNhanViec as TrangThaiUngVien].color,
      suffix: 'ứng viên',
      status: 3,
      isToday: false
    },
    {
      title: 'Đã từ chối',
      value: stats.daTuChoi ?? 0,
      icon: <MdCancel size={30} color={STATUS_CONFIG[TrangThaiUngVien.DaTuChoi as TrangThaiUngVien].color} />,
      color: STATUS_CONFIG[TrangThaiUngVien.DaTuChoi as TrangThaiUngVien].color,
      suffix: 'ứng viên',
      status: 4,
      isToday: false
    },
    {
      title: 'Đạt phỏng vấn',
      value: stats.datPhongVan ?? 0,
      icon: <MdEmojiEvents size={30} color={STATUS_CONFIG[TrangThaiUngVien.DatPhongVan as TrangThaiUngVien].color} />,
      color: STATUS_CONFIG[TrangThaiUngVien.DatPhongVan as TrangThaiUngVien].color,
      suffix: 'ứng viên',
      status: 5,
      isToday: false
    },
    {
      title: 'PV hôm nay',
      value: stats.interviewToday,
      icon: <MdToday size={30} color="#f5222d" />,
      color: '#f5222d',
      suffix: 'ứng viên',
      status: 2, // Đang chờ phỏng vấn
      isToday: true
    }
  ];

  const conversionRate = stats.totalCandidates > 0 
    ? Math.round((stats.daNhanViec / stats.totalCandidates) * 100)
    : 0;

  const interviewRate = stats.totalCandidates > 0
    ? Math.round((stats.dangChoPhongVan / stats.totalCandidates) * 100)
    : 0;

  return (
    <div className={styles.statsGridContainer}>
      {/* Stat Boxes */}
      <div className={styles.statsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
        {statCards.slice(0, 4).map((stat, index) => (
          <div
            key={index}
            className={styles.statBox}
            style={{ borderColor: stat.color, cursor: 'pointer' }}
            onClick={() => onStatCardClick && onStatCardClick(stat.status, stat.isToday)}
          >
            <div className={styles.statIcon} style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statTitle}>{stat.title}</div>
              <div className={styles.statValue} style={{ color: stat.color }}>
                {stat.value} <span className={styles.statSuffix}>{stat.suffix}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.statsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, marginTop: 0 }}>
        {statCards.slice(4, 8).map((stat, index) => (
          <div
            key={index + 4}
            className={styles.statBox}
            style={{ borderColor: stat.color, cursor: 'pointer' }}
            onClick={() => onStatCardClick && onStatCardClick(stat.status, stat.isToday)}
          >
            <div className={styles.statIcon} style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statTitle}>{stat.title}</div>
              <div className={styles.statValue} style={{ color: stat.color }}>
                {stat.value} <span className={styles.statSuffix}>{stat.suffix}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Row */}
      <div className={styles.analyticsRow}>
        <div className={styles.analyticsBox + ' ' + styles.hoverCard}>
          <Title level={5} className={styles.analyticsTitle}>
            Tỷ lệ chuyển đổi
            <span style={{ marginLeft: 6 }}>
              <Tooltip
                title={
                  <div style={{ maxWidth: 320 }}>
                      Đo lường hiệu quả tổng thể của quy trình tuyển dụng
                      Cho biết bao nhiêu % ứng viên nộp hồ sơ cuối cùng được nhận việc
                    <div style={{ marginTop: 6 }}><b>Ví dụ:</b> Có 100 ứng viên nộp hồ sơ, 15 người được nhận việc → Tỷ lệ chuyển đổi = 15%</div>
                  </div>
                }
              >
                <QuestionCircleOutlined style={{ color: '#1890ff' }} />
              </Tooltip>
            </span>
          </Title>
          <Progress
            type="circle"
            percent={conversionRate}
            format={percent => `${percent}%`}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            size={80}
          />
          <Text type="secondary" className={styles.analyticsDesc}>
            Từ ứng viên → Nhận việc
          </Text>
        </div>
        <div className={styles.analyticsBox + ' ' + styles.hoverCard}>
          <Title level={5} className={styles.analyticsTitle}>
            Tỷ lệ phỏng vấn
            <span style={{ marginLeft: 6 }}>
              <Tooltip
                title={
                  <div style={{ maxWidth: 320 }}>
                 
                      Đo lường tỷ lệ ứng viên được mời phỏng vấn
                      Cho biết bao nhiêu % ứng viên vượt qua vòng sơ tuyển
                    
                    <div style={{ marginTop: 6 }}><b>Ví dụ:</b> Có 100 ứng viên nộp hồ sơ, 25 người được mời phỏng vấn → Tỷ lệ phỏng vấn = 25%</div>
                  </div>
                }
              >
                <QuestionCircleOutlined style={{ color: '#1890ff' }} />
              </Tooltip>
            </span>
          </Title>
          <Progress
            type="circle"
            percent={interviewRate}
            format={percent => `${percent}%`}
            strokeColor={{
              '0%': '#722ed1',
              '100%': '#eb2f96',
            }}
            size={80}
          />
          <Text type="secondary" className={styles.analyticsDesc}>
            Từ ứng viên → Phỏng vấn
          </Text>
        </div>
        <div className={styles.analyticsBox + ' ' + styles.hoverCard} style={{ flex: 2 }}>
          <Title level={5} className={styles.analyticsTitle}>Tổng quan tháng này</Title>
          <div className={styles.weeklyStatsGrid}>
            <div className={styles.weeklyStatItem}>
              <Statistic
                title="Phỏng vấn tuần này"
                value={stats.interviewThisWeek}
                prefix={<MdPerson />}
                valueStyle={{ color: '#1890ff' }}
              />
            </div>
            <div className={styles.weeklyStatItem}>
              <Statistic
                title="Phỏng vấn tháng này"
                value={stats.interviewThisMonth}
                prefix={<MdPerson />}
                valueStyle={{ color: '#722ed1' }}
              />
            </div>
            <div className={styles.weeklyStatItem}>
              <Statistic
                title="Trung bình/ngày"
                value={Math.round(stats.interviewThisMonth / 30)}
                suffix="ứng viên"
                valueStyle={{ color: '#52c41a' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className={styles.statusDistributionBox}>
        <Title level={5} className={styles.analyticsTitle}>Phân bố trạng thái ứng viên</Title>
        <div className={styles.statusDistributionGrid}>
          <div className={styles.statusItem + ' ' + styles.hoverCard}>
            <Progress
              type="dashboard"
              percent={stats.totalCandidates > 0 ? Math.round((stats.chuaXetDuyet / stats.totalCandidates) * 100) : 0}
              strokeColor={STATUS_CONFIG[TrangThaiUngVien.ChuaXetDuyet as TrangThaiUngVien].color}
              size={100}
              format={() => stats.chuaXetDuyet}
            />
            <Text className={styles.statusLabel} style={{ color: STATUS_CONFIG[TrangThaiUngVien.ChuaXetDuyet as TrangThaiUngVien].color }}>
              Chưa xét duyệt
            </Text>
          </div>
          <div className={styles.statusItem + ' ' + styles.hoverCard}>
            <Progress
              type="dashboard"
              percent={stats.totalCandidates > 0 ? Math.round((stats.daXetDuyet / stats.totalCandidates) * 100) : 0}
              strokeColor={STATUS_CONFIG[TrangThaiUngVien.DaXetDuyet as TrangThaiUngVien].color}
              size={100}
              format={() => stats.daXetDuyet}
            />
            <Text className={styles.statusLabel} style={{ color: STATUS_CONFIG[TrangThaiUngVien.DaXetDuyet as TrangThaiUngVien].color }}>
              Đã xét duyệt
            </Text>
          </div>
          <div className={styles.statusItem + ' ' + styles.hoverCard}>
            <Progress
              type="dashboard"
              percent={stats.totalCandidates > 0 ? Math.round((stats.dangChoPhongVan / stats.totalCandidates) * 100) : 0}
              strokeColor={STATUS_CONFIG[TrangThaiUngVien.DangChoPhongVan as TrangThaiUngVien].color}
              size={100}
              format={() => stats.dangChoPhongVan}
            />
            <Text className={styles.statusLabel} style={{ color: STATUS_CONFIG[TrangThaiUngVien.DangChoPhongVan as TrangThaiUngVien].color }}>
              Chờ phỏng vấn
            </Text>
          </div>
          <div className={styles.statusItem + ' ' + styles.hoverCard}>
            <Progress
              type="dashboard"
              percent={stats.totalCandidates > 0 ? Math.round((stats.daNhanViec / stats.totalCandidates) * 100) : 0}
              strokeColor={STATUS_CONFIG[TrangThaiUngVien.DaNhanViec as TrangThaiUngVien].color}
              size={100}
              format={() => stats.daNhanViec}
            />
            <Text className={styles.statusLabel} style={{ color: STATUS_CONFIG[TrangThaiUngVien.DaNhanViec as TrangThaiUngVien].color }}>
              Đã nhận việc
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
