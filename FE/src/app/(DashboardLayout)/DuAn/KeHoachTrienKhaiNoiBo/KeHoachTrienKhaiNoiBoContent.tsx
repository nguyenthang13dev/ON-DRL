"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Input, InputNumber } from 'antd';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { userService } from "@/services/user/user.service";
import dA_KeHoachThucHienService from "@/services/dA_KeHoachThucHien/dA_KeHoachThucHienService";
import { DA_KeHoachThucHienType, DA_KeHoachThucHienTreeType, DA_KeHoachThucHienCreateOrUpdateType } from "@/types/dA_DuAn/dA_KeHoachThucHien";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import Vietnamese locale for dayjs
import { toast } from "react-toastify";
import styles from './KeHoachTrienKhaiNoiBoContent.module.css';
import KeHoachTrienKhaiModal from './KeHoachTrienKhaiModal';
import ToolTipComponentKHTK from './ToolTipComponentKHTK';

dayjs.locale('vi'); // Set dayjs locale to Vietnamese

interface KeHoachTrienKhaiNoiBoContentProps {
  idDuAn: string | null;
  onClose?: () => void;
  onUpdate?: () => void; // Callback for the Update button
  onRefreshNeeded?: () => void; // Callback when manual refresh is needed
}

interface MyTask extends Task {
  phanCong?: string;
  phanCongId?: string;
  level?: number;
  phanCongKH?: string;
  status?: TaskStatus; // Add status to track task condition
  duAnId?: string;
  groupNoidungId?: string;
  noiDungCongViec?: string;
}

interface TaskStatistics {
  total: number;
  dueSoon: number;
  overdueModerate: number;
  overdueSevere: number;
  percentage: number;
}

interface NotificationItem {
  id: string;
  type: 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
}

type TaskStatus = 'normal' | 'dueSoon' | 'overdueModerate' | 'overdueSevere';
type FilterType = 'all' | 'overdue' | 'dueSoon' | 'overdueModerate' | 'overdueSevere';
type SortType = 'default' | 'overdueFirst';


const KeHoachTrienKhaiNoiBoContent: React.FC<KeHoachTrienKhaiNoiBoContentProps> = ({ idDuAn, onClose, onUpdate, onRefreshNeeded }) => {
  const [tasks, setTasks] = useState<MyTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<MyTask[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  
  // Add state for double-click detection
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // State for sticky timeline header
  const [stickyTimelineHeader, setStickyTimelineHeader] = useState<string>('');
  
  // Filter and sort states
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('default');
  const [statistics, setStatistics] = useState<TaskStatistics>({
    total: 0,
    dueSoon: 0,
    overdueModerate: 0,
    overdueSevere: 0,
    percentage: 0
  });
  
  // Notification states
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  // Custom tooltip states
  const [customTooltip, setCustomTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    task: MyTask | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    task: null
  });
  
  // Modal states for KeHoachTrienKhaiModal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<MyTask | null>(null);
  const [parentTask, setParentTask] = useState<MyTask | null>(null);
  const [modalMode, setModalMode] = useState<'edit' | 'add' | 'addSub'>('edit');
  const [editingProgress, setEditingProgress] = useState<{ taskId: string, value: number } | null>(null);
  const [optimisticDraggedTask, setOptimisticDraggedTask] = useState<MyTask | null>(null);

  // Helper function to find timeline scrollable container
  const findTimelineScrollContainer = (ganttContainer: HTMLElement): HTMLElement => {
    // Method 1: Find div that contains SVG timeline
    const timelineContainer = ganttContainer.querySelector('div[style*="width"] svg')?.parentElement as HTMLElement;
    
    if (timelineContainer) {

      // Find the scrollable parent
      let scrollableParent = timelineContainer.parentElement as HTMLElement;
      while (scrollableParent && scrollableParent !== ganttContainer) {
        const style = window.getComputedStyle(scrollableParent);
        if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
      
          return scrollableParent;
        }
        scrollableParent = scrollableParent.parentElement as HTMLElement;
      }
      return timelineContainer.parentElement || timelineContainer;
    }
    
    // Method 2: Find by SVG directly
    const svg = ganttContainer.querySelector('svg[width][height]') as SVGElement;
    if (svg) {

      let svgParent = svg.parentElement as HTMLElement;
      while (svgParent && svgParent !== ganttContainer) {
        const style = window.getComputedStyle(svgParent);
        if (style.overflowX === 'auto' || style.overflowX === 'scroll') {

          return svgParent;
        }
        svgParent = svgParent.parentElement as HTMLElement;
      }
      return svg.parentElement || ganttContainer;
    }
    
    // Method 3: Find by overflow-x style
    const potentialScrollers = ganttContainer.querySelectorAll('div');
    for (let i = 0; i < potentialScrollers.length; i++) {
      const element = potentialScrollers[i] as HTMLElement;
      const style = window.getComputedStyle(element);
      if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
    
        return element;
      }
    }
    
    // Fallback

    return ganttContainer;
  };

  // Function to scroll to task in timeline
  const scrollToTask = (task: MyTask) => {
  
    
    // Find the gantt container
    const ganttContainer = document.querySelector(`.${styles.ganttContainer}`) as HTMLElement;
    
    if (!ganttContainer) {
      console.warn("Gantt container not found");
      return;
    }

    // Find the timeline scrollable container using helper function
    const scrollableElement = findTimelineScrollContainer(ganttContainer);

    // Calculate task position based on start and end date for center positioning
    const taskStartDate = new Date(task.start);
    const taskEndDate = new Date(task.end);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    taskStartDate.setHours(0, 0, 0, 0);
    taskEndDate.setHours(0, 0, 0, 0);
    
    // Calculate days from today to task start and end
    const startDaysDiff = Math.floor((taskStartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const endDaysDiff = Math.floor((taskEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get actual column width from Gantt props
    const actualColumnWidth = viewMode === ViewMode.Hour ? 60 : 
                             viewMode === ViewMode.Day ? 80 : 
                             viewMode === ViewMode.Week ? 100 : 120;
    
    // Calculate task bar center position in the SVG
    const preSteps = 2; // matches preStepsCount prop
    const taskStartX = (startDaysDiff + preSteps) * actualColumnWidth;
    const taskEndX = (endDaysDiff + preSteps) * actualColumnWidth;
    const taskCenterX = (taskStartX + taskEndX) / 2;
    
    // Get timeline container width to calculate center offset
    const timelineWidth = scrollableElement.clientWidth;
    const centerOffset = timelineWidth / 2;
    
    // Calculate scroll position to center the task bar in timeline
    const scrollLeft = Math.max(0, taskCenterX - centerOffset);
    
 
    
    // Smooth scroll only the timeline to center position
    scrollableElement.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });

    // Sync with sticky timeline header after scroll
    setTimeout(() => {
      const stickyTimelineWrapper = document.querySelector(`.${styles.timelineHeaderSticky}`) as HTMLElement;
      if (stickyTimelineWrapper) {
        stickyTimelineWrapper.scrollLeft = scrollLeft;
      }
    }, 50); // Wait for smooth scroll to start

    // Highlight timeline row and task bar
    setTimeout(() => {
      const taskIndex = filteredTasks.findIndex(t => t.id === task.id);
      
      // Remove previous highlights
      document.querySelectorAll('[data-task-selected="true"]').forEach(el => {
        el.removeAttribute('data-task-selected');
        el.classList.remove('row-selected', 'gantt-grid-row-highlighted');
      });

      // Highlight timeline grid row
      const gridRows = document.querySelectorAll('.gantt-grid-row, [class*="gantt-grid-row"]');
      if (gridRows[taskIndex]) {
        gridRows[taskIndex].classList.add('row-selected', 'gantt-grid-row-highlighted');
        gridRows[taskIndex].setAttribute('data-task-selected', 'true');
      }

      // Highlight task bar
      const taskBars = document.querySelectorAll('[class*="gantt-task-bar"], [class*="gantt-task-item"], [class*="gantt-bar"], .gantt-task-bar, .gantt-task-item');
      if (taskBars[taskIndex]) {
        const taskBar = taskBars[taskIndex] as HTMLElement;
        taskBar.setAttribute('data-task-selected', 'true');
        
        // Apply additional visual effects
        taskBar.style.filter = 'brightness(1.3) drop-shadow(0 0 12px #3b82f6)';
        taskBar.style.transform = 'scale(1.05)';
        taskBar.style.transition = 'all 0.3s ease';
        taskBar.style.zIndex = '100';
        
        // Remove additional effects after highlighting period
        setTimeout(() => {
          taskBar.style.filter = '';
          taskBar.style.transform = '';
          taskBar.style.transition = '';
          taskBar.style.zIndex = '';
        }, 2000);
      }

    
    }, 300); // Reduced delay for better UX
  };

  // Handle single click - scroll to task
  const handleTaskSingleClick = (task: MyTask) => {

    setSelectedTaskId(task.id);
    scrollToTask(task);
  };

  // Handle double click - open modal (renamed from handleTaskClick)
  const handleTaskDoubleClick = (task: MyTask) => {
 
    setSelectedTask(task);
    setModalMode('edit');
    // Nếu task có project (tức là task con), tìm parentTask để truyền vào modal
    if (task.project) {
      const foundParentTask = tasks.find(t => t.id === task.project);
      setParentTask(foundParentTask || null);
    } else {
      setParentTask(null); // Đảm bảo parentTask là null nếu không phải task con
    }
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    if (!idDuAn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Fetch user data
      const userRes = await userService.getDropdown();
      setUserOptions(Array.isArray(userRes.data) ? userRes.data : []);

      // Fetch KeHoachThucHien data
      const keHoachRes = await dA_KeHoachThucHienService.getDropdownsTree(idDuAn, true); // true for internal plan

      if (keHoachRes.status && Array.isArray(keHoachRes.data) && keHoachRes.data.length > 0) {
       
        const processedTasks = transformDataToGanttTasks(keHoachRes.data, userRes.data);
        const sortedTasks = sortTasksHierarchically(processedTasks);
        setTasks(sortedTasks);
        
        // Calculate statistics
        const stats = calculateStatistics(processedTasks);
        setStatistics(stats);
   
        // Check for overdue tasks and send notifications
        checkForOverdueTasks(processedTasks);
 
      } else {
       
        setTasks([]);
        setStatistics({
          total: 0,
          dueSoon: 0,
          overdueModerate: 0,
          overdueSevere: 0,
          percentage: 0
        });
      }
    } catch (error) {
      console.error("Error loading data for Gantt chart:", error);
      toast.error("Lỗi khi tải dữ liệu kế hoạch triển khai.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function if needed
  const refreshData = () => {
    fetchData();
    onRefreshNeeded?.(); // Notify parent component if needed
  };

    // Utility function to get task status (can be used outside component)
  const getTaskStatusUtil = (task: { end: Date; progress: number }): TaskStatus => {
    const today = new Date();
    const taskEndDate = new Date(task.end);
    // Reset time part to compare only dates
    today.setHours(0, 0, 0, 0);
    taskEndDate.setHours(0, 0, 0, 0);
    
    // If task is completed, it's normal
    if (task.progress >= 100) {
      return 'normal';
    }
    
    const daysDiff = Math.floor((taskEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Due soon (1-2 days before deadline)
    if (daysDiff >= 0 && daysDiff <= 2) {
      return 'dueSoon';
    }
    
    // Overdue
    if (daysDiff < 0) {
      const daysOverdue = Math.abs(daysDiff);
      if (daysOverdue <= 7) {
        return 'overdueModerate';
      } else {
        return 'overdueSevere';
      }
    }
    
    return 'normal';
  };

  // Function to get task status based on due date and progress
  const getTaskStatus = (task: MyTask): TaskStatus => {
    return getTaskStatusUtil(task);
  };

  // Function to check if task is overdue (legacy function for backward compatibility)
  const isTaskOverdue = (task: MyTask): boolean => {
    const status = getTaskStatus(task);
    return status === 'overdueModerate' || status === 'overdueSevere';
  };

  // Function to calculate task statistics
  const calculateStatistics = (tasks: MyTask[]): TaskStatistics => {
    const stats = {
      total: tasks.length,
      dueSoon: 0,
      overdueModerate: 0,
      overdueSevere: 0,
      percentage: 0
    };

    tasks.forEach(task => {
      const status = getTaskStatus(task);
      if (status === 'dueSoon') stats.dueSoon++;
      if (status === 'overdueModerate') stats.overdueModerate++;
      if (status === 'overdueSevere') stats.overdueSevere++;
    });

    const totalProblematicTasks = stats.dueSoon + stats.overdueModerate + stats.overdueSevere;
    stats.percentage = tasks.length > 0 ? Math.round((totalProblematicTasks / tasks.length) * 100) : 0;

    return stats;
  };

  // Function to filter tasks based on filter type
  const filterTasks = (tasks: MyTask[], filterType: FilterType): MyTask[] => {
    if (filterType === 'all') return tasks;
    
    return tasks.filter(task => {
      const status = getTaskStatus(task);
      
      if (filterType === 'overdue') {
        return status === 'overdueModerate' || status === 'overdueSevere';
      }
      
      return status === filterType;
    });
  };

  // Function to sort tasks
  const sortTasks = (tasks: MyTask[], sortType: SortType): MyTask[] => {
    if (sortType === 'default') return tasks;
    
    if (sortType === 'overdueFirst') {
      return [...tasks].sort((a, b) => {
        const statusA = getTaskStatus(a);
        const statusB = getTaskStatus(b);
        
        // Priority order: overdueSevere > overdueModerate > dueSoon > normal
        const priorityOrder = {
          overdueSevere: 0,
          overdueModerate: 1,
          dueSoon: 2,
          normal: 3
        };
        
        const priorityA = priorityOrder[statusA];
        const priorityB = priorityOrder[statusB];
        
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        
        // If same priority, sort by days overdue (more overdue first)
        if (statusA === 'overdueModerate' || statusA === 'overdueSevere') {
          const today = new Date();
          const endDateA = new Date(a.end);
          const endDateB = new Date(b.end);
          today.setHours(0, 0, 0, 0);
          endDateA.setHours(0, 0, 0, 0);
          endDateB.setHours(0, 0, 0, 0);
          
          const daysOverdueA = Math.floor((today.getTime() - endDateA.getTime()) / (1000 * 60 * 60 * 24));
          const daysOverdueB = Math.floor((today.getTime() - endDateB.getTime()) / (1000 * 60 * 60 * 24));
          
          return daysOverdueB - daysOverdueA; // More overdue first
        }
        
        return 0;
      });
    }
    
    return tasks;
  };

  // Function to add notification
  const addNotification = (type: 'warning' | 'error', title: string, message: string) => {
    const notification: NotificationItem = {
      id: Math.random().toString(36).substring(2, 11),
      type,
      title,
      message,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Function to check for overdue tasks and send notifications
  const checkForOverdueTasks = (tasks: MyTask[]) => {
    const newOverdueTasks = tasks.filter(task => {
      const status = getTaskStatus(task);
      return status === 'overdueModerate' || status === 'overdueSevere';
    });

    const dueSoonTasks = tasks.filter(task => {
      const status = getTaskStatus(task);
      return status === 'dueSoon';
    });

    // Notify about new overdue tasks

  };

  // Function to sort tasks in hierarchical order
  const sortTasksHierarchically = (tasks: MyTask[]): MyTask[] => {
    const result: MyTask[] = [];
    const taskMap = new Map<string, MyTask>();
    
    // Create a map for quick lookup
    tasks.forEach(task => taskMap.set(task.id, task));
    
    // Function to add task and its children recursively
    const addTaskAndChildren = (task: MyTask) => {
      result.push(task);
      
      // Find and add children
      const children = tasks
        .filter(t => t.project === task.id)
        .sort((a, b) => {
          // Sort children by their original order or by start date
          const aIndex = tasks.findIndex(t => t.id === a.id);
          const bIndex = tasks.findIndex(t => t.id === b.id);
          return aIndex - bIndex;
        });
      
      children.forEach(child => addTaskAndChildren(child));
    };
    
    // Start with root tasks (tasks without parent)
    const rootTasks = tasks
      .filter(task => !task.project)
      .sort((a, b) => {
        const aIndex = tasks.findIndex(t => t.id === a.id);
        const bIndex = tasks.findIndex(t => t.id === b.id);
        return aIndex - bIndex;
      });
    
    rootTasks.forEach(rootTask => addTaskAndChildren(rootTask));
    
    return result;
  };

    useEffect(() => {
    fetchData();
  }, [idDuAn]);

  // Effect to update filtered tasks when tasks, filterType, or sortType changes
  useEffect(() => {
    let filtered = filterTasks(tasks, filterType);
    filtered = sortTasks(filtered, sortType);
    setFilteredTasks(filtered);
  }, [tasks, filterType, sortType]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);

  // Effect to find and clone timeline header SVG
  useEffect(() => {
    const findAndCloneTimelineHeader = () => {
      // Look for the calendar SVG in the gantt container
      const ganttContainer = document.querySelector(`.${styles.ganttContainer}`);
      if (!ganttContainer) return;

      // Find the SVG with calendar class
      const calendarGroup = ganttContainer.querySelector('svg g.calendar');
      const calendarSvg = calendarGroup?.parentElement;
      
      if (calendarSvg && calendarSvg instanceof SVGElement && calendarSvg.tagName.toLowerCase() === 'svg') {
   
        
        // Clone the entire SVG
        const clonedSvg = calendarSvg.cloneNode(true) as SVGElement;
        
        // Ensure proper attributes for sticky display
        clonedSvg.style.width = '100%';
        clonedSvg.style.height = '50px';
        clonedSvg.style.display = 'block';
        clonedSvg.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
        
        // Convert to string for state
        const svgString = new XMLSerializer().serializeToString(clonedSvg);
        setStickyTimelineHeader(svgString);
        
      } else {
 
        
        // Alternative search: look for any SVG with width and height attributes
        const alternateSvg = ganttContainer.querySelector('svg[width][height]') as SVGElement;
        if (alternateSvg) {

          
          const clonedSvg = alternateSvg.cloneNode(true) as SVGElement;
          clonedSvg.style.width = '100%';
          clonedSvg.style.height = '50px';
          clonedSvg.style.display = 'block';
          clonedSvg.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
          
          const svgString = new XMLSerializer().serializeToString(clonedSvg);
          setStickyTimelineHeader(svgString);
          

        }
      }
    };

    // Run after gantt renders
    if (filteredTasks.length > 0) {
      setTimeout(findAndCloneTimelineHeader, 500);
    }
  }, [filteredTasks, viewMode]); // Re-run when tasks or view mode changes

  // Effect to sync scroll between sticky header and timeline content
  useEffect(() => {
    const ganttContainer = document.querySelector(`.${styles.ganttContainer}`);
    const stickyTimelineWrapper = document.querySelector(`.${styles.timelineHeaderSticky}`);
    
    if (!ganttContainer || !stickyTimelineWrapper) return;

    // Find the actual timeline scrollable container using helper function
    const timelineScrollContainer = findTimelineScrollContainer(ganttContainer as HTMLElement);

    let isScrolling = false;
    let scrollSyncTimeout: NodeJS.Timeout | null = null;

    const handleTimelineScroll = () => {
      if (isScrolling) return;
      
      // Clear previous timeout to prevent race conditions
      if (scrollSyncTimeout) {
        clearTimeout(scrollSyncTimeout);
      }
      
      // Use RAF for smoother sync
      requestAnimationFrame(() => {
        const scrollLeft = timelineScrollContainer.scrollLeft;
        // Apply the same scroll to sticky timeline
        stickyTimelineWrapper.scrollLeft = scrollLeft;
        

      });
    };

    const handleStickyScroll = () => {
      if (isScrolling) return;
      
      isScrolling = true;
      
      // Clear previous timeout
      if (scrollSyncTimeout) {
        clearTimeout(scrollSyncTimeout);
      }
      
      // Use RAF for smoother sync
      requestAnimationFrame(() => {
        const scrollLeft = stickyTimelineWrapper.scrollLeft;
        // Apply the same scroll to timeline container
        timelineScrollContainer.scrollLeft = scrollLeft;
        
 
      });
      
      // Reset scrolling flag after a short delay
      scrollSyncTimeout = setTimeout(() => {
        isScrolling = false;
        scrollSyncTimeout = null;
      }, 100);
    };

    timelineScrollContainer.addEventListener('scroll', handleTimelineScroll, { passive: true });
    stickyTimelineWrapper.addEventListener('scroll', handleStickyScroll, { passive: true });
    
    return () => {
      timelineScrollContainer.removeEventListener('scroll', handleTimelineScroll);
      stickyTimelineWrapper.removeEventListener('scroll', handleStickyScroll);
      
      // Clean up timeout
      if (scrollSyncTimeout) {
        clearTimeout(scrollSyncTimeout);
      }
    };
  }, [stickyTimelineHeader]); // Re-run when sticky header updates

  // Effect to update Gantt bar colors based on task status
  useEffect(() => {
    const updateGanttBarColors = () => {
      setTimeout(() => {
        const ganttContainer = document.querySelector('.gantt-container');
        if (!ganttContainer) return;
        
        const ganttBars = ganttContainer.querySelectorAll('[class*="gantt-task-bar"]');
        const ganttProgresses = ganttContainer.querySelectorAll('[class*="gantt-task-progress"]');
        const ganttMilestones = ganttContainer.querySelectorAll('[class*="gantt-milestone"]');
        
        filteredTasks.forEach((task, index) => {
          const taskStatus = task.status || getTaskStatus(task);
          
          // Update task bars by index since we don't have task-id attribute
          if (ganttBars[index]) {
            ganttBars[index].setAttribute('data-status', taskStatus);
          }
          
          // Update progress bars by index
          if (ganttProgresses[index]) {
            ganttProgresses[index].setAttribute('data-status', taskStatus);
          }
          
          // Update milestones by index
          if (ganttMilestones[index]) {
            ganttMilestones[index].setAttribute('data-status', taskStatus);
          }
        });
        

      }, 200);
    };

    updateGanttBarColors();
  }, [filteredTasks]);

  // Effect to setup custom tooltip event handlers
  useEffect(() => {
    const debounce = (func: (...args: any[]) => void, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    };

    const setupTooltipEvents = () => {
      const ganttContainer = document.querySelector(`.${styles.ganttContainer}`);
      if (!ganttContainer) return;

      // Clean up previously created hover areas to prevent duplication
      ganttContainer.querySelectorAll('[data-custom-hover-area="true"]').forEach(area => area.remove());

      let taskBars = ganttContainer.querySelectorAll('g._1KJ6x, g._KxSXS, g[class*="_1KJ6x"], g[class*="_KxSXS"]');
      if (taskBars.length === 0) {
        taskBars = ganttContainer.querySelectorAll('g[tabindex="0"], .bar g, g.bar, svg g[tabindex]');
      }
       if (taskBars.length === 0) {
           taskBars = ganttContainer.querySelectorAll('svg g[class*="_"]:not([class*="grid"]):not([class*="calendar"])');
       }


      const handleMouseEnter = (event: Event, task: MyTask) => {
        const target = event.currentTarget as HTMLElement;
        if (!target) return;
        
        const rect = target.getBoundingClientRect();
        setCustomTooltip({
          visible: true,
          x: rect.left + rect.width / 2,
          y: rect.top,
          task: task,
        });
      };

      const handleMouseLeave = () => {
        setCustomTooltip(prev => ({ ...prev, visible: false, task: null }));
      };

      taskBars.forEach((bar, index) => {
        const task = filteredTasks[index];
        if (!bar || !task) return;

        try {
          const barBBox = (bar as SVGGraphicsElement).getBBox();
          if (barBBox.width > 0 || barBBox.height > 0) {
            const hoverRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            
            const minHoverSize = 22;
            const hoverWidth = Math.max(barBBox.width + 4, minHoverSize);
            const hoverHeight = Math.max(barBBox.height + 4, minHoverSize);
            
            hoverRect.setAttribute('x', String(barBBox.x + (barBBox.width - hoverWidth) / 2));
            hoverRect.setAttribute('y', String(barBBox.y + (barBBox.height - hoverHeight) / 2));
            hoverRect.setAttribute('width', String(hoverWidth));
            hoverRect.setAttribute('height', String(hoverHeight));
            hoverRect.setAttribute('fill', 'transparent');
            hoverRect.style.cursor = 'pointer';
            hoverRect.setAttribute('data-custom-hover-area', 'true');

            hoverRect.addEventListener('mouseenter', (e) => handleMouseEnter(e, task));
            hoverRect.addEventListener('mouseleave', handleMouseLeave);

            bar.appendChild(hoverRect);
          }
        } catch (error) {
          // Fallback for safety
          bar.addEventListener('mouseenter', (e) => handleMouseEnter(e, task));
          bar.addEventListener('mouseleave', handleMouseLeave);
        }
      });
    };

    const debouncedSetup = debounce(setupTooltipEvents, 250);
    debouncedSetup();

    const svgContainer = document.querySelector(`.${styles.ganttContainer} svg`);
    if (!svgContainer) return;

    const observer = new MutationObserver(() => {
      debouncedSetup();
    });

    observer.observe(svgContainer, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [filteredTasks, viewMode]);

  const transformDataToGanttTasks = (data: DA_KeHoachThucHienTreeType[], userOptions: any[]): MyTask[] => {
    const ganttTasks: MyTask[] = [];
    const processNode = (node: DA_KeHoachThucHienTreeType, parentId?: string, level: number = 0) => {
      const id = node.id || `temp-${Math.random().toString(36).substring(2, 11)}`;
      const start = node.ngayBatDau ? dayjs(node.ngayBatDau, ["YYYY-MM-DD", "DD/MM/YYYY"]).toDate() : new Date();
      const end = node.ngayKetThuc ? dayjs(node.ngayKetThuc, ["YYYY-MM-DD", "DD/MM/YYYY"]).toDate() : new Date();

      const assignedUsers = node.phanCong ? node.phanCong.split(',').map((userId: string) => {
        const user = userOptions.find((u: any) => u.value === userId.trim());
        return user ? user.label : userId.trim();
      }).join(', ') : '';
      const assignedUsersId = node.phanCong ? node.phanCong.split(',').map((userId: string) => {
        const user = userOptions.find((u: any) => u.value === userId.trim());
        return user ? user.value : userId.trim();
      }).join(', ') : '';


            const taskObj: MyTask = {
        id: id,
        name: node.noiDungCongViec || 'No Content',
        start: start,
        end: end,
        progress: node.progress || 0,
        type: node.listdA_KeHoachThucHienTrees && node.listdA_KeHoachThucHienTrees.length > 0 ? 'project' : 'task',
        project: parentId,
        hideChildren: false,
        phanCong: assignedUsers,
        phanCongId: assignedUsersId,
        phanCongKH: node.phanCongKH || '',
        level: level,
        duAnId: node.duAnId || undefined,
        groupNoidungId: node.groupNoiDungId || parentId,
      };


      const status = getTaskStatusUtil(taskObj);
      taskObj.status = status;

      ganttTasks.push(taskObj);

      if (node.listdA_KeHoachThucHienTrees && node.listdA_KeHoachThucHienTrees.length > 0) {
        node.listdA_KeHoachThucHienTrees.forEach((child: DA_KeHoachThucHienTreeType) => processNode(child, id, level + 1));
      }
    };

    data.forEach(node => processNode(node, undefined, 0)); // Start with level 0 for top-level nodes
    return ganttTasks;
  };

  const handleTaskChange = async (task: MyTask) => {

    // Lưu trữ task gốc trước khi optimistic update để có thể revert
    const originalTaskData = tasks.find(t => t.id === task.id);
    if (originalTaskData) {
      setOptimisticDraggedTask(originalTaskData);
    }

    // Cập nhật optimistic UI trước để có trải nghiệm mượt mà
    setTasks((prevTasks) => prevTasks.map((t) => (t.id === task.id ? task : t)));

    // Tìm parentTask để truyền vào modal (cho validation)
    let parentTaskForModal: MyTask | undefined;
    if (task.project) {
      parentTaskForModal = tasks.find(t => t.id === task.project);

    }

    // Mở modal để người dùng xác nhận hoặc hủy bỏ thay đổi
    setSelectedTask(task); // Task đã được cập nhật optimistic
    setParentTask(parentTaskForModal || null);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAddSubTask = (task: MyTask) => {
    setParentTask(task);
    setSelectedTask(null);
    setModalMode('addSub');
    setIsModalOpen(true);
  };

  const handleModalClose = (saved: boolean = false) => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setParentTask(null);
    // Hoàn tác dữ liệu nếu có task được kéo thả và người dùng hủy bỏ (chỉ khi không lưu)
    if (!saved && optimisticDraggedTask) {
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === optimisticDraggedTask.id ? optimisticDraggedTask : t
      ));
      setOptimisticDraggedTask(null);
    }
  };

  const handleModalSave = async (updatedTask: MyTask) => {
    // Update tasks state and get the new tasks array
    setTasks((prevTasks) => {
      let newTasks: MyTask[];
      
      // Check if the task already exists (edit mode)
      const existingTaskIndex = prevTasks.findIndex(t => t.id === updatedTask.id);
      if (existingTaskIndex > -1) {
        // Update existing task
        newTasks = prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
      } else {
        // Add new task (addSub mode) - insert at correct position
        if (updatedTask.project) {
          // Find parent task index
          const parentIndex = prevTasks.findIndex(t => t.id === updatedTask.project);
          if (parentIndex > -1) {
            // Find the position to insert the new sub task
            // It should be after the parent and all its existing children
            let insertIndex = parentIndex + 1;
            
            // Find all existing children of the parent
            for (let i = parentIndex + 1; i < prevTasks.length; i++) {
              if (prevTasks[i].project === updatedTask.project) {
                insertIndex = i + 1;
                             } else if (!prevTasks[i].project || (prevTasks[i].level || 0) <= (prevTasks[parentIndex]?.level || 0)) {
                // Stop when we reach a task that's not a child or at same/higher level
                break;
              }
            }
            
            // Insert the new task at the calculated position
            newTasks = [
              ...prevTasks.slice(0, insertIndex),
              updatedTask,
              ...prevTasks.slice(insertIndex)
            ];
            
            // Ensure parent project is expanded
            newTasks = newTasks.map(t =>
              t.id === updatedTask.project ? { ...t, hideChildren: false } : t
            );
          } else {
            // Parent not found, add at end (fallback)
            newTasks = [...prevTasks, updatedTask];
          }
        } else {
          // No parent, add at end
          newTasks = [...prevTasks, updatedTask];
        }
      }
      
      // Sort tasks hierarchically to maintain proper tree structure
      newTasks = sortTasksHierarchically(newTasks);
      
      // Update statistics and check for overdue tasks after state update
      setTimeout(() => {
        const stats = calculateStatistics(newTasks);
        setStatistics(stats);
   
        
        // Check for overdue tasks and send notifications
        checkForOverdueTasks(newTasks);
      }, 0);
      
      return newTasks;
    });
    
    setOptimisticDraggedTask(null); // Clear optimistic state after successful save
    handleModalClose(true); // Close modal after save attempt, indicating a save
    // Removed fetchData() to prevent full refresh
  };



  const handleExpanderClick = (task: MyTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...task, hideChildren: !task.hideChildren } : t))
    );
  };

  // Function to highlight timeline row corresponding to selected task
  const highlightTimelineRow = (taskId: string) => {

    
    const taskIndex = filteredTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    // Remove previous highlights
    document.querySelectorAll('.gantt-grid-row').forEach(row => {
      row.classList.remove('row-selected', 'gantt-grid-row-highlighted');
      row.removeAttribute('data-task-selected');
    });

    // Add highlight to corresponding timeline row
    setTimeout(() => {
      const gridRows = document.querySelectorAll('.gantt-grid-row');
      if (gridRows[taskIndex]) {
        gridRows[taskIndex].classList.add('row-selected', 'gantt-grid-row-highlighted');
        gridRows[taskIndex].setAttribute('data-task-selected', 'true');
      }

      // Also highlight the task bar
      const taskBars = document.querySelectorAll('[class*="gantt-task-bar"], [class*="gantt-task-item"], [class*="gantt-bar"]');
      if (taskBars[taskIndex]) {
        taskBars[taskIndex].setAttribute('data-task-selected', 'true');
      }
    }, 100);
  };

  // Function to handle task list row click (single click)
  const handleTaskListSingleClick = (task: MyTask) => {

    setSelectedTaskId(task.id);
    highlightTimelineRow(task.id);
    scrollToTask(task);
  };

  // Function to handle task list row double click
  const handleTaskListDoubleClick = (task: MyTask) => {
   
    setSelectedTask(task);
    setModalMode('edit');
    if (task.project) {
      const foundParentTask = tasks.find(t => t.id === task.project);
      setParentTask(foundParentTask || null);
    } else {
      setParentTask(null);
    }
    setIsModalOpen(true);
  };

  // Enhanced function to handle task list clicks with double-click detection
  const handleTaskListClick = (task: MyTask) => {
    if (clickTimeout) {
      // Double click detected
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleTaskListDoubleClick(task);
    } else {
      // Single click - set timeout to detect if double click follows
      const timeout = setTimeout(() => {
        handleTaskListSingleClick(task);
        setClickTimeout(null);
      }, 300); // 300ms delay to detect double click
      setClickTimeout(timeout);
    }
  };

  if (loading) {
    return (
      <div className={`${styles.mainContainer} ${styles.fadeIn}`}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Đang tải dữ liệu kế hoạch triển khai...</div>
        </div>
      </div>
    );
  }

  const customColumns = [
    {
      header: 'Hạng mục công việc',
      render: (task: MyTask) => task.name,
      width: "250px",
    },
    {
      header: 'Thời gian ',
      render: (task: MyTask) => `${dayjs(task.start).format('DD/MM')} - ${dayjs(task.end).format('DD/MM')}`,
      width: "100px",
    },
    {
      header: 'Phân Công',
      render: (task: MyTask) => task.phanCong || '',
      width: "150px",
    },
    {
      header: 'Tiến độ (%)',
      render: (task: MyTask) => `${task.progress}%`,
      width: "120px",
    },
  ];

  const totalColumnsWidth = customColumns.reduce((sum, column) => sum + parseInt(column.width), 0);

  const CustomTaskListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }> = ({ headerHeight, rowWidth, fontFamily, fontSize }) => {
    const totalColumnsWidth = customColumns.reduce((sum, column) => sum + parseInt(column.width), 0);

    return (
      <div
        className={styles.taskListHeader}
        style={{
          height: headerHeight,
          width: totalColumnsWidth + 'px',
        }}
      >
        {customColumns.map((column, index) => (
          <div
            key={index}
            className={styles.taskListHeaderColumn}
            style={{
              width: column.width,
              minWidth: column.width,
              maxWidth: column.width,
            }}
          >
            {column.header}
          </div>
        ))}
      </div>
    );
  };

  const CustomTaskListTable: React.FC<{
    tasks: MyTask[];
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    onExpanderClick: (task: Task) => void;
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onAddSubTask: (task: MyTask) => void;
    onTaskRowClick: (task: MyTask) => void; // New prop for row click
    isTaskOverdue: (task: MyTask) => boolean; // New prop for overdue check
  }> = ({ tasks, rowHeight, rowWidth, fontFamily, fontSize, locale, onExpanderClick, selectedTaskId, setSelectedTask, onAddSubTask, onTaskRowClick, isTaskOverdue }) => {
    const totalColumnsWidth = customColumns.reduce((sum, column) => sum + parseInt(column.width), 0);

    const handleContextMenu = (e: React.MouseEvent, task: MyTask) => {
      e.preventDefault();
      // Chỉ cho phép thêm công việc con cho project/group, không cho task con
      if (task.type === 'project') {
        onAddSubTask(task);
      }
    };

    return (
      <div className={styles.taskListTable} style={{ width: totalColumnsWidth + 'px' }}>
                {filteredTasks.map((task) => {
          const taskStatus = getTaskStatus(task);
          const isOverdue = taskStatus === 'overdueModerate' || taskStatus === 'overdueSevere';
          
          // Get appropriate CSS classes based on task status
          const getRowClass = () => {
            switch (taskStatus) {
              case 'dueSoon':
                return styles.taskListRowDueSoon;
              case 'overdueModerate':
                return styles.taskListRowOverdueModerate;
                              case 'overdueSevere':
                  return styles.taskListRowOverdueSevere;
              default:
                return '';
            }
          };
          
          return (
          <div
            key={task.id}
              className={`${styles.taskListRow} ${task.id === selectedTaskId ? styles.taskListRowSelected : ''} ${styles.slideIn} ${getRowClass()}`}
            style={{ 
              height: rowHeight,
              cursor: task.type === 'project' ? 'context-menu' : 'default'
            }}
            // Xóa onClick cũ để tránh lỗi linter
            onContextMenu={(e) => handleContextMenu(e, task)}
            title={task.type === 'project' ? `${task.name} - Chuột phải để thêm công việc con` : task.name}
            onClick={() => onTaskRowClick(task)} // Giữ lại onClick này
          >
            {customColumns.map((column, index) => {
              if (column.header === 'Hạng mục công việc') {
                const hasChildren = task.type === 'project' && !task.hideChildren;
                const isProject = task.type === 'project';
                const taskName = task.name;
                // Calculate available width for text (subtract padding, expander width if present)
                const paddingAndExpanderWidth = 32 + (task.level || 0) * 20 + (isProject ? 24 : 0);
                const availableWidth = parseInt(column.width) - paddingAndExpanderWidth;
                // Simple check: if text is likely longer than available space, show tooltip
                const isTextTruncated = taskName && (taskName.length > 20 || taskName.length * 8 > availableWidth);
                
                return (
                  <div
                    key={index}
                    className={`${styles.taskListColumn} ${isProject ? styles.taskNameProject : styles.taskNameColumn} ${
                      taskStatus === 'dueSoon' ? styles.taskNameDueSoon :
                      taskStatus === 'overdueModerate' ? styles.taskNameOverdueModerate :
                      taskStatus === 'overdueSevere' ? styles.taskNameOverdueSevere : ''
                    }`}
                    style={{
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width,
                      paddingLeft: 16 + (task.level || 0) * 20,
                    }}
                  >
                    <div className={styles.taskListColumnContent}>
                      {isProject && (
                        <span
                          className={styles.expanderButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            onExpanderClick(task);
                          }}
                        >
                          {hasChildren ? '▼' : '►'}
                        </span>
                      )}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {column.render(task)}
                      </span>
               
                      {taskName && taskName.length > 15 && (
                        <div className={`${styles.columnTooltip} ${isOverdue ? styles.overdueTooltip : ''}`} title={taskName}>
                          {taskName}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              
                              if (column.header === 'Thời gian ') {
                const dateText = `${dayjs(task.start).format('DD/MM/YYYY')} - ${dayjs(task.end).format('DD/MM/YYYY')}`;
                const duration = dayjs(task.end).diff(dayjs(task.start), 'day') + 1;
                const daysOverdue = isOverdue ? dayjs().diff(dayjs(task.end), 'day') : 0;
                const daysDueSoon = taskStatus === 'dueSoon' ? dayjs(task.end).diff(dayjs(), 'day') : 0;
                
                return (
                  <div
                    key={index}
                    className={`${styles.taskListColumn} ${styles.dateColumn} ${
                      taskStatus === 'dueSoon' ? styles.taskNameDueSoon :
                      taskStatus === 'overdueModerate' ? styles.taskNameOverdueModerate :
                      taskStatus === 'overdueSevere' ? styles.taskNameOverdueSevere : ''
                    }`}
                    style={{
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width,
                    }}
                  >
                    {column.render(task)}
          
                  </div>
                );
              }
              
              if (column.header === 'Phân Công') {
                const assignmentText = task.phanCong || task.phanCongKH || 'Chưa phân công';
                const isTextTruncated = assignmentText && assignmentText.length > 15;
                const displayText = isTextTruncated && assignmentText.length > 20 
                  ? assignmentText.substring(0, 17) + '...' 
                  : assignmentText;
                
                // Determine assignment type for styling
                let assignmentClass = styles.assignmentEmpty; // Default: no assignment
                if (task.phanCong) {
                  assignmentClass = styles.assignmentPhanCong; // Has phanCong (actual assignment)
                } else if (task.phanCongKH) {
                  assignmentClass = styles.assignmentPhanCongKH; // Has phanCongKH (plan assignment)
                }
                
                // Add warning styling based on task status
                if (taskStatus === 'dueSoon') {
                  assignmentClass += ` ${styles.taskNameDueSoon}`;
                } else if (taskStatus === 'overdueModerate') {
                  assignmentClass += ` ${styles.taskNameOverdueModerate}`;
                } else if (taskStatus === 'overdueSevere') {
                  assignmentClass += ` ${styles.taskNameOverdueSevere}`;
                }
                
                return (
                  <div
                    key={index}
                    className={`${styles.taskListColumn} ${assignmentClass}`}
                    title={assignmentText}
                    style={{
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width,
                    }}
                  >
                    {displayText}
                    {isTextTruncated && (
                      <div className={`${styles.columnTooltip} ${isOverdue ? styles.overdueTooltip : ''}`} title={assignmentText}>
                        {assignmentText}
                      </div>
                    )}
                  </div>
                );
              }
              
              if (column.header === 'Tiến độ (%)') {
                
                
                return (
                  <div
                    key={index}
                    className={styles.taskListColumn}
                    style={{
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width,
                    }}
                  >

                        <div className={`${styles.progressBar} ${
                          taskStatus === 'dueSoon' ? styles.progressBarDueSoon :
                          taskStatus === 'overdueModerate' ? styles.progressBarOverdueModerate :
                          taskStatus === 'overdueSevere' ? styles.progressBarOverdueSevere : ''
                        }`} style={{marginRight:'10px !important'}}>
                          <div
                            className={`${styles.progressFill} ${
                              taskStatus === 'dueSoon' ? styles.progressFillDueSoon :
                              taskStatus === 'overdueModerate' ? styles.progressFillOverdueModerate :
                              taskStatus === 'overdueSevere' ? styles.progressFillOverdueSevere : ''
                            }`}
                            style={{ width: `${task.progress}  %`,marginRight:'5px !important' }}
                          />
                        </div>
                        <span className={`${styles.progressText} ${
                          taskStatus === 'dueSoon' ? styles.progressTextDueSoon :
                          taskStatus === 'overdueModerate' ? styles.progressTextOverdueModerate :
                          taskStatus === 'overdueSevere' ? styles.progressTextOverdueSevere : ''
                          
                        }`}>{task.progress} %</span>
                      </div>
                  
              
                );
              }
              return (
                <div
                  key={index}
                  className={styles.taskListColumn}
                  style={{
                    width: column.width,
                    minWidth: column.width,
                    maxWidth: column.width,
                  }}
                >
                  {column.render(task)}
                </div>
              );
            })}
          </div>
          );
        })}
      </div>
    );
  };

  const viewModeOptions = [

    { mode: ViewMode.Day, label: 'Ngày' },
    { mode: ViewMode.Week, label: 'Tuần' },
    { mode: ViewMode.Month, label: 'Tháng' },
  ];



  return (
    <div className={styles.mainContainer}>
      {/* Notification Container */}
      {notifications.length > 0 && (
        <div className={styles.notificationContainer}>
          {notifications.map((notification) => (
            <div key={notification.id} className={`${styles.notificationItem} ${styles[notification.type]}`}>
              <div className={styles.notificationTitle}>{notification.title}</div>
              <div className={styles.notificationMessage}>{notification.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Page-level sticky wrapper for filter and headers */}
      <div className={styles.pageStickyWrapper}>
        {/* Filter and Statistics Container */}
        <div className={styles.stickyFilterContainer}>
          <div className={styles.filterButtonsGroup}>
            <button
                 onClick={() => setFilterType('all')}
                 className={`${styles.filterButton} ${filterType === 'all' ? styles.filterButtonActive : ''}`}>
              Tất cả ({tasks.length})
            </button>
            <button
                 onClick={() => setFilterType('overdue')}
                 className={`${styles.filterButton} ${styles.filterButtonOverdue} ${filterType === 'overdue' ? styles.filterButtonOverdueActive : ''}`}>
              Quá hạn ({statistics.overdueModerate + statistics.overdueSevere})
            </button>
            <button
                 onClick={() => setFilterType('dueSoon')}
                 className={`${styles.filterButton} ${styles.filterButtonDueSoon} ${filterType === 'dueSoon' ? styles.filterButtonDueSoonActive : ''}`}>
              Sắp hết hạn ({statistics.dueSoon})
            </button>
            
            <button
                 onClick={() => setSortType(sortType === 'default' ? 'overdueFirst' : 'default')}
                 className={`${styles.filterButton} ${styles.filterButtonSort} ${sortType === 'overdueFirst' ? styles.filterButtonSortActive : ''}`}>
              Sắp xếp theo độ ưu tiên
            </button>
          </div>
          
          {/* View Mode Container */}
          <div className={styles.viewModeButtonsGroup}>
            <span className={styles.viewModeLabel}>
              Chế độ hiển thị:
            </span>
            {viewModeOptions.map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`${styles.viewModeButton} ${viewMode === mode ? styles.viewModeButtonActive : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Gantt Headers Container */}
        {filteredTasks.length > 0 && (
          <div className={styles.ganttHeadersWrapper}>
            <div className={styles.taskListHeaderSticky}>
              <CustomTaskListHeader 
                headerHeight={50} 
                rowWidth="620px" 
                fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
                fontSize="12px" 
              />
            </div>
            <div className={styles.timelineHeaderSticky}>
              {/* Render cloned SVG timeline header */}
              {stickyTimelineHeader ? (
                <div 
                  style={{ 
                    height: '50px', 
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                  dangerouslySetInnerHTML={{ __html: stickyTimelineHeader }}
                />
              ) : (
                <div style={{ 
                  height: '50px', 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  paddingLeft: '16px', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#374151' 
                }}>
                  Loading timeline...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gantt Container - without sticky headers */}
      {filteredTasks.length > 0 ? (
        <div className={styles.ganttContainer}>
          <Gantt
            tasks={filteredTasks}
            viewMode={viewMode}
            onDateChange={handleTaskChange}
            onProgressChange={handleTaskChange}
            onDoubleClick={handleTaskDoubleClick}
            onClick={handleTaskSingleClick}
            onExpanderClick={handleExpanderClick}
            listCellWidth={"auto"}
            columnWidth={viewMode === ViewMode.Hour ? 60 : viewMode === ViewMode.Day ? 80 : viewMode === ViewMode.Week ? 100 : 120}
            rowHeight={50}
            barFill={65}
            barCornerRadius={1}
            fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            todayColor="rgba(59, 130, 246, 0.08)"
            locale="vi"
            ganttHeight={undefined}
            preStepsCount={2}
            TaskListHeader={() => null} // Hide original header since we have sticky one
            TaskListTable={(props) => CustomTaskListTable({ 
              ...props, 
              selectedTaskId, 
              setSelectedTask: setSelectedTaskId,
              onAddSubTask: handleAddSubTask,
              onTaskRowClick: handleTaskListClick,
              isTaskOverdue: isTaskOverdue
            })}
            TooltipContent={() => null} // Disable default tooltip since we use custom portal tooltip
          />
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📊</div>
          <div className={styles.emptyStateTitle}>
            {tasks.length === 0 ? 'Chưa có dữ liệu' : 'Không có kết quả'}
          </div>
          <div className={styles.emptyStateText}>
            {tasks.length === 0 
              ? 'Không có dữ liệu kế hoạch triển khai nội bộ để hiển thị.'
              : 'Không có công việc nào phù hợp với bộ lọc hiện tại.'
            }
          </div>
        </div>
      )}

      {/* KeHoachTrienKhaiModal */}
      <KeHoachTrienKhaiModal
        visible={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        task={selectedTask}
        parentTask={parentTask}
        userOptions={userOptions}
        mode={modalMode}
        duAnId={idDuAn || undefined}
      />
      
      {/* Custom Tooltip Portal */}
      <ToolTipComponentKHTK tooltip={customTooltip} />
    </div>
   
  );
};

export default KeHoachTrienKhaiNoiBoContent; 