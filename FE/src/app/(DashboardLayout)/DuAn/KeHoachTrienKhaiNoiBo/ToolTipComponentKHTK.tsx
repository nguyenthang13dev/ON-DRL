"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';

// Types
interface MyTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  phanCong?: string;
  phanCongId?: string;
  status?: TaskStatus;
  [key: string]: any;
}

type TaskStatus = 'normal' | 'dueSoon' | 'overdueModerate' | 'overdueSevere';

interface CustomTooltipState {
  visible: boolean;
  x: number;
  y: number;
  task: MyTask | null;
}

interface ToolTipComponentKHTKProps {
  tooltip: CustomTooltipState;
}

// Helper function to get task status text
const getTaskStatus = (task: MyTask): TaskStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endDate = new Date(task.end);
  endDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 0) {
    const overdueDays = Math.abs(daysDiff);
    if (overdueDays > 7) {
      return 'overdueSevere';
    } else {
      return 'overdueModerate';
    }
  } else if (daysDiff <= 2) {
    return 'dueSoon';
  }
  
  return 'normal';
};

const ToolTipComponentKHTK: React.FC<ToolTipComponentKHTKProps> = ({ tooltip }) => {
  if (!tooltip.visible || !tooltip.task) return null;
  
  const task = tooltip.task;
  const taskStatus = task.status || getTaskStatus(task);
  const isOverdue = taskStatus === 'overdueModerate' || taskStatus === 'overdueSevere';
  const daysDiff = Math.floor((new Date(task.end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const getStatusText = () => {
    switch (taskStatus) {
      case 'dueSoon':
        return `Sắp hết hạn trong ${daysDiff} ngày`;
      case 'overdueModerate':
        return `Quá hạn ${Math.abs(daysDiff)} ngày`;
      case 'overdueSevere':
        return `Quá hạn nghiêm trọng ${Math.abs(daysDiff)} ngày`;
      default:
        return 'Đúng tiến độ';
    }
  };
  
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: tooltip.x,
    top: tooltip.y,
    transform: 'translateX(-50%) translateY(-100%)',
    zIndex: 9999,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
    color: '#374151',
    fontSize: '13px',
    fontWeight: '400',
    padding: '16px',
    maxWidth: '280px',
    lineHeight: '1.5',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    pointerEvents: 'none',
    visibility: 'visible',
    opacity: 1,
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s ease-in-out'
  };
  
  return createPortal(
    <div style={tooltipStyle}>
      {/* Task Title */}
      <div style={{ 
        fontWeight: '600', 
        marginBottom: '12px',
        color: '#1f2937',
        fontSize: '14px',
        borderBottom: '1px solid #f3f4f6',
        paddingBottom: '8px'
      }}>
        {task.name}
      </div>
      
      {/* Duration */}
      <div style={{ 
        marginBottom: '8px',
        color: '#6b7280',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ 
          color: '#3b82f6', 
          fontWeight: '500',
          minWidth: '60px'
        }}>
          Thời gian:
        </span>
        <span>{dayjs(task.start).format('DD/MM/YYYY')} - {dayjs(task.end).format('DD/MM/YYYY')}</span>
      </div>
      
      {/* Progress */}
      <div style={{ 
        marginBottom: '8px',
        color: '#6b7280',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ 
          color: '#10b981', 
          fontWeight: '500',
          minWidth: '60px'
        }}>
          Tiến độ:
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '60px',
            height: '4px',
            background: '#e5e7eb',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${task.progress}%`,
              height: '100%',
              background: task.progress > 75 ? '#10b981' : task.progress > 50 ? '#3b82f6' : task.progress > 25 ? '#f59e0b' : '#ef4444',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <span style={{ fontWeight: '500' }}>{task.progress}%</span>
        </div>
      </div>
      
      {/* Assignment */}
      {task.phanCong && (
        <div style={{ 
          marginBottom: '8px',
          color: '#6b7280',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ 
            color: '#8b5cf6', 
            fontWeight: '500',
            minWidth: '60px'
          }}>
            Phân công:
          </span>
          <span>{task.phanCong}</span>
        </div>
      )}
      
      {/* Status */}
      <div style={{ 
        marginTop: '12px',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        textAlign: 'center',
        background: isOverdue ? '#fef2f2' : taskStatus === 'dueSoon' ? '#fffbeb' : '#f0fdf4',
        color: isOverdue ? '#dc2626' : taskStatus === 'dueSoon' ? '#d97706' : '#16a34a',
        border: `1px solid ${isOverdue ? '#fecaca' : taskStatus === 'dueSoon' ? '#fed7aa' : '#bbf7d0'}`
      }}>
        {getStatusText()}
      </div>
    </div>,
    document.body
  );
};

export default ToolTipComponentKHTK;
