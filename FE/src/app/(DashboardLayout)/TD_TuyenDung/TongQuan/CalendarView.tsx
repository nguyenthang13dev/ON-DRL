"use client";
import React, { useState, useCallback } from 'react';
import { Card, Button, Typography, Tooltip, Modal, message, Dropdown, Checkbox, Divider, DatePicker } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);
// Định nghĩa trực tiếp trong file này:
export interface CalendarView {
  mode: 'day' | 'week' | 'month';
  date: string;
}

import { TrangThaiUngVien } from '@/types/TD_UngVien/TD_UngVien';
import { MdOutlinePendingActions, MdCheckCircle, MdEventNote, MdWork, MdCancel, MdEmojiEvents } from 'react-icons/md';
import { AiOutlineHourglass } from 'react-icons/ai';
import styles from './InterviewSchedule.module.css';
import { TD_UngVienDto } from '@/types/TD_UngVien/TD_UngVien';
import { MdPerson } from 'react-icons/md';

export const STATUS_CONFIG: {
  [key in TrangThaiUngVien]: {
    color: string;
    bgColor: string;
    borderColor: string;
    text: string;
    icon: React.ReactNode;
  }
} = {
  [TrangThaiUngVien.ChuaXetDuyet]: {
    color: '#8c8c8c',
    bgColor: '#f5f5f5',
    borderColor: '#d9d9d9',
    text: 'Chưa xét duyệt',
    icon: <AiOutlineHourglass />
  },
  [TrangThaiUngVien.DaXetDuyet]: {
    color: '#389e0d',
    bgColor: '#f6ffed',
    borderColor: '#b7eb8f',
    text: 'Đã xét duyệt',
    icon: <MdCheckCircle />
  },
  [TrangThaiUngVien.DangChoPhongVan]: {
    color: '#096dd9',
    bgColor: '#e6f7ff',
    borderColor: '#91d5ff',
    text: 'Đang chờ phỏng vấn',
    icon: <MdEventNote />
  },
  [TrangThaiUngVien.DaNhanViec]: {
    color: '#d48806',
    bgColor: '#fffbe6',
    borderColor: '#ffe58f',
    text: 'Đã nhận việc',
    icon: <MdWork />
  },
  [TrangThaiUngVien.DaTuChoi]: {
    color: '#f5222d',
    bgColor: '#fff1f0',
    borderColor: '#ffa39e',
    text: 'Đã từ chối',
    icon: <MdCancel />
  },
  [TrangThaiUngVien.DatPhongVan]: {
    color: '#722ed1',
    bgColor: '#f9f0ff',
    borderColor: '#d3adf7',
    text: 'Đạt phỏng vấn',
    icon: <MdEmojiEvents />
  }
};

const { Title, Text } = Typography;
interface CalendarViewProps {
  events: TD_UngVienDto[];
  onEventClick: (event: TD_UngVienDto) => void;
  onEventMove: (eventId: string, newDate: string, newTime: string) => void;
  onDateClick: (date: string) => void;
  loading?: boolean;
  currentDate: dayjs.Dayjs;
  setCurrentDate: (date: dayjs.Dayjs) => void;
  viewMode: 'month' | 'week' | 'day';
  setViewMode: (mode: 'month' | 'week' | 'day') => void;
  positionSelect?: React.ReactNode;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventClick,
  onEventMove,
  onDateClick,
  loading = false,
  currentDate,
  setCurrentDate,
  viewMode,
  setViewMode,
  positionSelect
}) => {
  const [draggedEvent, setDraggedEvent] = useState<TD_UngVienDto | null>(null);
  // State cho filter popup
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([TrangThaiUngVien.DangChoPhongVan]);

  const handleStatusToggle = (status: number) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Generate calendar days for month view
  const generateCalendarDays = useCallback(() => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startOfCalendar = startOfMonth.startOf('week');
    const endOfCalendar = endOfMonth.endOf('week');

    const days = [];
    let current = startOfCalendar;

    while (current.isBefore(endOfCalendar) || current.isSame(endOfCalendar, 'day')) {
      days.push(current);
      current = current.add(1, 'day');
    }

    return days;
  }, [currentDate]);

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Dayjs) => {
    return events
      .filter(event =>
        event.thoiGianPhongVan &&
        dayjs(event.thoiGianPhongVan).local().isSame(date, 'day') &&
        selectedStatuses.includes(typeof event.trangThai === 'number' ? event.trangThai : 0)
      )
      .sort((a, b) =>
        dayjs(a.thoiGianPhongVan).valueOf() - dayjs(b.thoiGianPhongVan).valueOf()
      );
  }, [events, selectedStatuses]);

  // Handle navigation
  const navigateCalendar = (direction: 'prev' | 'next') => {
    const unit = viewMode === 'day' ? 'day' : viewMode === 'week' ? 'week' : 'month';
    setCurrentDate(
      direction === 'next' ? currentDate.add(1, unit) : currentDate.subtract(1, unit)
    );
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, event: TD_UngVienDto) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', event.id);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetDate: Dayjs) => {
    e.preventDefault();
    
    if (!draggedEvent) return;

    const newDate = targetDate.format('YYYY-MM-DD');
    const currentTime = dayjs(draggedEvent.thoiGianPhongVan).format('HH:mm');
    
    // Show confirmation modal
    Modal.confirm({
      title: 'Xác nhận di chuyển lịch phỏng vấn',
      content: (
        <div>
          <p><strong>Ứng viên:</strong> {draggedEvent.hoTen}</p>
          <p><strong>Từ:</strong> {dayjs(draggedEvent.thoiGianPhongVan).format('DD/MM/YYYY HH:mm')}</p>
          <p><strong>Đến:</strong> {targetDate.format('DD/MM/YYYY')} {currentTime}</p>
        </div>
      ),
      onOk: () => {
        onEventMove(draggedEvent.id, newDate, currentTime);
        message.success('Đã di chuyển lịch phỏng vấn thành công');
      },
      onCancel: () => {
        setDraggedEvent(null);
      }
    });
  };

  // Render event icon (grid 2 rows, max 5 per row, highlight style)
  const renderEventIcon = (event: TD_UngVienDto, idx: number, row: number, col: number, isWeekView?: boolean) => {
    let statusKey = typeof event.trangThai === 'number' ? event.trangThai : 0;
    if (![0, 1, 2, 3, 4, 5].includes(statusKey)) statusKey = 0;
    const statusConfig = STATUS_CONFIG[statusKey as TrangThaiUngVien];
    const size = 28;
    const gap = 8;
    const style: React.CSSProperties = {};
    if (isWeekView) {
      style.position = 'absolute';
      style.top = '50%';
      style.left = '50%';
      style.transform = 'translate(-50%, -50%)';
      style.fontSize = size;
      style.color = statusConfig.borderColor;
      style.background = '#fff';
      style.borderRadius = '50%';
      style.boxShadow = '0 2px 5px #b3d8ff';
      style.border = `3px solid ${statusConfig.borderColor}`;
      style.zIndex = 2 + idx;
      style.cursor = 'pointer';
      style.display = 'flex';
      style.alignItems = 'center';
      style.justifyContent = 'center';
      style.width = size;
      style.height = size;
      style.transition = 'box-shadow 0.15s, border 0.15s, transform 0.18s';
    } else {
    const left = `calc(50% - ${(5 * size + 4 * gap) / 2}px + ${(size + gap) * col}px)`;
    const top = `calc(50% - ${(2 * size + gap) / 2}px + ${(size + gap) * row}px)`;
      style.position = 'absolute';
      style.top = top;
      style.left = left;
      style.fontSize = size;
      style.color = statusConfig.borderColor;
      style.background = '#fff';
      style.borderRadius = '50%';
      style.boxShadow = '0 2px 5px #b3d8ff';
      style.border = `3px solid ${statusConfig.borderColor}`;
      style.zIndex = 2 + idx;
      style.cursor = 'pointer';
      style.display = 'flex';
      style.alignItems = 'center';
      style.justifyContent = 'center';
      style.width = size;
      style.height = size;
      style.transition = 'box-shadow 0.15s, border 0.15s, transform 0.18s';
    }
    return (
      <Tooltip
        key={event.id}
        title={
          <div style={{ minWidth: 180 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{event.hoTen}</div>
            <div style={{ color: '#888', marginBottom: 2 }}>{event.viTriTuyenDungText}</div>
            <div><ClockCircleOutlined /> {event.thoiGianPhongVan ? dayjs(event.thoiGianPhongVan).format('HH:mm') : ''}</div>
            {/* <div><EnvironmentOutlined /> {event.room}</div>
            <div><UserOutlined /> {event.interviewer}</div> */}
          </div>
        }
      >
        <div
          className={styles.avatarIcon}
          style={style}
          onClick={e => { e.stopPropagation(); onEventClick(event); }}
          draggable
          onDragStart={(e) => handleDragStart(e, event)}
        >
          <MdPerson />
        </div>
      </Tooltip>
    );
  };

  // Popup filter trạng thái UI hiện đại
  const filterContent = (
    <div style={{ minWidth: 220, padding: 12, background: '#fff', borderRadius: 14, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: '#222', letterSpacing: 0.2 }}>Chọn trạng thái muốn xem</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Object.entries(STATUS_CONFIG).map(([status, config]) => {
        const statusNum = Number(status);
          const isActive = selectedStatuses.includes(statusNum);
        return (
            <div
            key={status}
              onClick={() => handleStatusToggle(statusNum)}
            style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '3px 5px',
                borderRadius: 10,
                cursor: 'pointer',
                background: isActive ? config.bgColor : '#f7f8fa',
              color: config.color,
                border: isActive ? `1px solid ${config.borderColor}` : '1px solid #2a5da30d',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.06)' : undefined,
              transition: 'all 0.18s',
            }}
              className={isActive ? styles.statusActive : ''}
          >
              <span style={{ fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{config.icon}</span>
              <span>{config.text}</span>
            </div>
        );
      })}
      </div>
      <div style={{ marginTop: 14, textAlign: 'right' }}>
        <Button
          size="small"
          style={{ borderRadius: 8, fontWeight: 500 }}
          onClick={() => setSelectedStatuses(Object.keys(STATUS_CONFIG).map(Number))}
        >
          Hiện tất cả
        </Button>
      </div>
    </div>
  );

  // Render calendar day (2 rows, 5 icons per row, '+N' if more)
  const renderCalendarDay = (date: Dayjs) => {
    const isToday = date.isSame(dayjs(), 'day');
    const isCurrentMonth = date.isSame(currentDate, 'month');
    const dayEvents = getEventsForDate(date);
    const maxIcons = 10;
    const iconsToShow = dayEvents.slice(0, maxIcons);
    // Tooltip message text
    const messageText = dayEvents.length > 0 ? `Có ${dayEvents.length} ứng viên phỏng vấn ngày này` : '';
    // Badge số lượng ứng viên
    const badge = dayEvents.length > 0 && (
      <div
        className={styles.candidateBadge}
        // Không dùng style inline nữa để CSS hover hoạt động
      >
        {dayEvents.length}
      </div>
    );
    const hasEvent = dayEvents.length > 0;
    const dayContent = (
      <div
        key={date.format('YYYY-MM-DD')}
        className={[
          styles.calendarDay,
          isToday ? styles.today : '',
          !isCurrentMonth ? styles.otherMonth : '',
          hasEvent ? styles.hasEvent : ''
        ].join(' ')}
        style={{ position: 'relative', overflow: 'visible' }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, date)}
        onClick={() => onDateClick(date.format('YYYY-MM-DD'))}
      >
        <div className={styles.dayNumber}>
          {date.format('D')}
        </div>
        {badge}
        {/* Grid icons */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
          {iconsToShow.map((ev, idx) => {
            const row = Math.floor(idx / 5);
            const col = idx % 5;
            return renderEventIcon(ev, idx, row, col);
          })}
          {dayEvents.length > maxIcons && (
            <Tooltip
              title={
                <div style={{ minWidth: 180 }}>
                  {dayEvents.slice(maxIcons).map(ev => (
                    <div key={ev.id} style={{ marginBottom: 4 }}>
                      <b>{ev.hoTen}</b> <span style={{ color: '#888', fontSize: 12 }}>({dayjs(ev.thoiGianPhongVan).format('HH:mm')})</span>
                    </div>
                  ))}
                </div>
              }
            >
              <div style={{
                position: 'absolute',
                top: `calc(50% - ${(2 * 28 + 8) / 2}px + ${(28 + 8) * 1}px)`,
                left: `calc(50% - ${(5 * 28 + 4 * 8) / 2}px + ${(28 + 8) * 4}px)`,
                fontSize: 18, color: '#1890ff', background: '#e6f7ff', borderRadius: '50%',
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '3px solid #1890ff', zIndex: 20, cursor: 'pointer', fontWeight: 700,
                boxShadow: '0 2px 10px #b3d8ff',
              }}>
                +{dayEvents.length - maxIcons}
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    );
    // Nếu có ứng viên, bọc Tooltip message quanh dayContent
    return dayEvents.length > 0 ? (
      <Tooltip title={messageText} placement="top" color="#fff" overlayInnerStyle={{ color: '#222', fontWeight: 600, fontSize: 14, boxShadow: '0 2px 12px #b3d8ff', borderRadius: 10, padding: 10 }}>
        {dayContent}
      </Tooltip>
    ) : dayContent;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Generate week days for week view
  const generateWeekDays = useCallback(() => {
    const startOfWeek = currentDate.startOf('week');
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, 'day'));
    }
    return days;
  }, [currentDate]);

  // Generate time slots for full 24h
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  // Render Week View
  const renderWeekView = () => {
    const weekDaysData = generateWeekDays();

    return (
      <div className={styles.weekViewContainer}>
        {/* Week header */}
        <div className={styles.weekHeader}>
          <div className={styles.timeColumn}>Giờ</div>
          {weekDaysData.map(day => (
            <div key={day.format('YYYY-MM-DD')} className={styles.dayColumn}>
              <div className={styles.dayHeaderDate}>
                {day.format('DD/MM')}
              </div>
              <div className={styles.dayHeaderName}>
                {weekDays[day.day()]}
              </div>
            </div>
          ))}
        </div>

        {/* Week body */}
        <div className={styles.weekBody}>
          {timeSlots.map(time => (
            <div key={time} className={styles.timeRow}>
              <div className={styles.timeSlot}>{time}</div>
              {weekDaysData.map(day => {
                const eventsOfDay = getEventsForDate(day);
              
                // Chỉ hiển thị event đúng slot giờ
                const dayEvents = eventsOfDay.filter(event => {
                  if (!event.thoiGianPhongVan) return false;
                  const eventDate = dayjs(event.thoiGianPhongVan).local();
                  const slotDate = day.hour(Number(time.split(':')[0])).minute(0).second(0);
                  // So sánh cùng ngày và cùng giờ
                  return eventDate.isSame(slotDate, 'hour');
                });

                return (
                  <div
                    key={`${day.format('YYYY-MM-DD')}-${time}`}
                    className={[
                      styles.weekCell,
                      dayEvents.length > 0 ? styles.weekCellHasEvent : ''
                    ].join(' ')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day)}
                    onClick={() => onDateClick(day.format('YYYY-MM-DD'))}
                  >
                    {dayEvents.map((event, idx) => renderEventIcon(event, idx, 0, 0, true))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Day View
  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);

    return (
      <div className={styles.dayViewContainer}>
        {/* Day header */}
        <div className={styles.dayHeader}>
          <Title level={4} style={{ margin: 0 }}>
            {currentDate.format('dddd, DD/MM/YYYY')}
          </Title>
          <Text type="secondary">
            {dayEvents.length} cuộc phỏng vấn
          </Text>
        </div>

        {/* Day timeline */}
        <div className={styles.dayTimeline}>
          {timeSlots.map(time => {
            const timeEvents = dayEvents.filter(event => {
              if (!event.thoiGianPhongVan) return false;
              const eventTime = dayjs(event.thoiGianPhongVan).format('HH:00');
              return eventTime === time;
            });

            return (
              <div key={time} className={styles.dayTimeSlot}>
                <div className={styles.dayTime}>{time}</div>
                <div
                  className={styles.dayTimeContent}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, currentDate)}
                  onClick={() => onDateClick(currentDate.format('YYYY-MM-DD'))}
                >
                  {timeEvents.length === 0 ? (
                    <div className={styles.emptyTimeSlot}>
                      <Text type="secondary">Trống</Text>
                    </div>
                  ) : (
                    timeEvents.map(event => (
                      <div
                        key={event.id}
                        className={styles.dayEvent}
                        style={{
                          '--event-bg': STATUS_CONFIG[event.trangThai as TrangThaiUngVien].bgColor,
                          '--event-border': STATUS_CONFIG[event.trangThai as TrangThaiUngVien].borderColor,
                          color: STATUS_CONFIG[event.trangThai as TrangThaiUngVien].color
                        } as React.CSSProperties}
                        draggable
                        onDragStart={(e) => handleDragStart(e, event)}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        <div className={styles.dayEventHeader}>
                          <div className={styles.dayEventTime}>
                            {event.thoiGianPhongVan ? dayjs(event.thoiGianPhongVan).format('HH:mm') : ''}
                          </div>
                          <div className={styles.dayEventStatus}>
                            {STATUS_CONFIG[event.trangThai as TrangThaiUngVien].icon}
                          </div>
                        </div>
                        <div className={styles.dayEventTitle}>
                          <strong>{event.hoTen}</strong>
                        </div>
                        <div className={styles.dayEventDetails}>
                          <div><UserOutlined /> {event.viTriTuyenDungText}</div>
                          {/* <div><EnvironmentOutlined /> {event.room}</div>
                          <div><UserOutlined /> {event.interviewer}</div> */}
                        </div>
                        {event.ghiChuUngVien && (
                          <div className={styles.dayEventNotes}>
                            <Text type="secondary">{event.ghiChuUngVien}</Text>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Day summary */}
        <div className={styles.daySummary}>
          <div className={styles.summaryItem}>
            <Text strong>Tổng số cuộc phỏng vấn: </Text>
            <Text>{dayEvents.length}</Text>
          </div>
          <div className={styles.summaryItem}>
            <Text strong>Trạng thái: </Text>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const count = dayEvents.filter(e => e.trangThai === Number(status)).length;
              return count > 0 ? (
                <span key={status} style={{ marginRight: 16 }}>
                  <span style={{ color: config.color }}>
                    {config.icon} {config.text}: {count}
                  </span>
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>
    );
  };

  // Label linh hoạt cho nút hôm nay
  let todayLabel = 'Hôm nay';
  if (viewMode === 'month') {
    todayLabel = `Tháng ${currentDate.month() + 1}`;
  } else if (viewMode === 'week') {
    todayLabel = `Tuần ${currentDate.week()}`;
  } else if (viewMode === 'day') {
    todayLabel = `Ngày ${currentDate.format('DD/MM/YYYY')}`;
  }

  return (
    <Card className={styles.calendarContainer} loading={loading}>
      {/* Dòng tiêu đề tháng/năm có filter trạng thái */}
      <div className={styles.calendarHeader}>
        <Dropdown
          open={filterOpen}
          onOpenChange={setFilterOpen}
          dropdownRender={() => filterContent}
          trigger={['click']}
        >
          <span>
            <Title
              level={3}
              className={styles.calendarTitle}
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 0 }}
              onClick={() => setFilterOpen((open) => !open)}
            >
              <CalendarOutlined style={{ marginRight: 8 }} />
              {viewMode === 'month' && currentDate.format('MMMM YYYY')}
              {viewMode === 'week' && `Tuần ${Math.ceil(currentDate.date() / 7)} - ${currentDate.format('MMMM YYYY')}`}
              {viewMode === 'day' && currentDate.format('DD MMMM YYYY')}
              <span style={{ fontSize: 16, color: '#1890ff', marginLeft: 8 }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="#1890ff" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
            </Title>
          </span>
        </Dropdown>
        <div className={styles.calendarControls}>
          {positionSelect}
          <Button.Group>
            <Button
              type={viewMode === 'month' ? 'primary' : 'default'}
              onClick={() => setViewMode('month')}
            >
              Tháng
            </Button>
            <Button
              type={viewMode === 'week' ? 'primary' : 'default'}
              onClick={() => setViewMode('week')}
            >
              Tuần
            </Button>
            <Button
              type={viewMode === 'day' ? 'primary' : 'default'}
              onClick={() => setViewMode('day')}
            >
              Ngày
            </Button>
          </Button.Group>
          
          <Button.Group>
            <Button
              icon={<LeftOutlined />}
              onClick={() => navigateCalendar('prev')}
            />
            {viewMode === 'month' && (
              <DatePicker
                picker="month"
                value={currentDate}
                onChange={date => date && setCurrentDate(date)}
                allowClear={false}
                format="MMMM YYYY"
                style={{ minWidth: 120 }}
              />
            )}
            {viewMode === 'week' && (
              <DatePicker
                picker="week"
                value={currentDate}
                onChange={date => date && setCurrentDate(date)}
                allowClear={false}
                format="[Tuần] wo, YYYY"
                style={{ minWidth: 120 }}
              />
            )}
            {viewMode === 'day' && (
              <DatePicker
                value={currentDate}
                onChange={date => date && setCurrentDate(date)}
                allowClear={false}
                format="DD/MM/YYYY"
                style={{ minWidth: 120 }}
              />
            )}
            <Button
              icon={<RightOutlined />}
              onClick={() => navigateCalendar('next')}
            />
          </Button.Group>
        </div>
      </div>

      {viewMode === 'month' && (
        <>
          {/* Week day headers */}
          <div className={styles.calendarGrid} style={{ marginBottom: 1 }}>
            {weekDays.map(day => (
              <div
                key={day}
                style={{
                  background: '#fafafa',
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#666'
                }}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className={styles.calendarGrid}>
            {calendarDays.map(renderCalendarDay)}
          </div>
        </>
      )}

      {viewMode === 'week' && (
        <div className={styles.weekView}>
          {renderWeekView()}
        </div>
      )}

      {viewMode === 'day' && (
        <div className={styles.dayView}>
          {renderDayView()}
        </div>
      )}
    </Card>
  );
};

export default CalendarView;
