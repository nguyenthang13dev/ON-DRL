import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, DatePicker, Modal, Select, Checkbox, Form, Drawer } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, PlusOutlined, MenuOutlined, FileExcelOutlined } from "@ant-design/icons";
import styles from './KeHoachTrienKhai.module.css';
import { DropdownOption } from "@/types/general";
import dayjs from "dayjs";
import { userService } from "@/services/user/user.service";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DA_KeHoachThucHienCreateOrUpdateType } from "@/types/dA_DuAn/dA_KeHoachThucHien";
import dA_KeHoachThucHienService from "@/services/dA_KeHoachThucHien/dA_KeHoachThucHienService";
import { toast } from "react-toastify";
import KeHoachThucHienConstant from "@/constants/DuAn/KeHoachThucHienConstant";
import TextArea from "antd/es/input/TextArea";

interface RowType {
  key: string;
  stt: number | string;
  group?: string;
  isGroup?: boolean;
  ngayBatDau?: string | null;
  ngayKetThuc?: string | null;
  canhBaoTruocNgay?: number | null;
  isKeHoachNoiBo?: boolean | null;
  isCanhBao?: boolean | null;
  noiDungCongViec?: string | null;
  phanCong?: string | null;
  phanCongKH?: string | null;
  groupNoiDungId?: string | null; // Add this field to store the parent group ID
}

interface Props {
  idDuAn: string | null;
  iskeHoachNoiBo?: boolean | null;
  onClose?: () => void;
  onRefresh?: () => void;
}

const DEFAULT_ROW: Omit<RowType, 'key' | 'stt' | 'group'> = {
  ngayBatDau: null,
  ngayKetThuc: null,
  canhBaoTruocNgay: 0,
  isKeHoachNoiBo: false,
  isCanhBao: false,
  noiDungCongViec: "",
  phanCong: "",
};

// DraggableRow phải là component độc lập ngoài component cha để tránh lỗi hook
const DraggableRow = ({ row, children, ...props }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.key,
  });
  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? "#fafafa" : undefined,
    cursor: "move",
  };
  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </tr>
  );
};

const KeHoachTrienKhaiCustomTable: React.FC<Props> = ({ idDuAn, iskeHoachNoiBo, onClose, onRefresh }) => {
 console.log("iskeHoachNoiBo props",iskeHoachNoiBo);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<RowType>({} as RowType);
  const [data, setData] = useState<RowType[]>([]);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Load user options
  useEffect(() => {
    userService.getDropdown().then(userRes => {
      setUserOptions(Array.isArray(userRes.data) ? userRes.data : []);
    });
  }, []);

  // Helper function to safely parse date strings
  const parseApiDate = (dateString: string | null): string | null => {
    if (!dateString) return null;
    
    try {
      // Handle ISO format with microseconds that might have 9999999
      if (dateString.includes('T') && dateString.includes('.')) {
        // Replace problematic microseconds with valid ones
        const cleanedDateString = dateString.replace(/\.9999999/, '.999999');
        const parsed = dayjs(cleanedDateString);
        
        if (parsed.isValid() && parsed.year() < 9999 && parsed.year() > 1900) {
          return parsed.format("YYYY-MM-DD");
        }
      }
      
      // Try standard formats
      const parsed = dayjs(dateString, ["YYYY-MM-DD", "DD/MM/YYYY", "YYYY-MM-DDTHH:mm:ssZ"]);
      if (parsed.isValid() && parsed.year() < 9999 && parsed.year() > 1900) {
        return parsed.format("YYYY-MM-DD");
      }
      
      console.warn(`Failed to parse date: ${dateString}`);
      return null;
    } catch (error) {
      console.warn(`Error parsing date ${dateString}:`, error);
      return null;
    }
  };

  // Helper function to flatten tree data
  const flattenTreeData = (treeData: any[]): RowType[] => {
    const result: RowType[] = [];
    let groupIndex = 0;

    treeData.forEach(node => {
      const groupKey = node.id || `G${Date.now()}_${groupIndex}`;
      groupIndex++;

      console.log("node", node);

      // Add parent node (group)
      result.push({
        key: groupKey,
        stt: node.stt || String.fromCharCode(65 + groupIndex - 1),
        group: groupKey,
        isGroup: true,
        ngayBatDau: parseApiDate(node.ngayBatDau),
        ngayKetThuc: parseApiDate(node.ngayKetThuc),
        canhBaoTruocNgay: node.canhBaoTruocNgay,
        isKeHoachNoiBo: node.isKeHoachNoiBo,
        isCanhBao: node.isCanhBao,
        noiDungCongViec: node.noiDungCongViec,
        phanCong: node.phanCong || null,
        phanCongKH: node.phanCongKH || null,
      });


      // Add child nodes
      if (node.listdA_KeHoachThucHienTrees && node.listdA_KeHoachThucHienTrees.length > 0) {
        node.listdA_KeHoachThucHienTrees.forEach((child: any, childIndex: number) => {
          const userFound = userOptions.find(u => u.value === child.phanCong);

          result.push({
            key: child.id || `${groupKey}_${Date.now()}_${childIndex}`,
            stt: child.stt || (childIndex + 1),
            group: groupKey,
            isGroup: false,
            ngayBatDau: parseApiDate(child.ngayBatDau),
            ngayKetThuc: parseApiDate(child.ngayKetThuc),
            canhBaoTruocNgay: child.canhBaoTruocNgay,
            isKeHoachNoiBo: child.isKeHoachNoiBo,
            isCanhBao: child.isCanhBao,
            noiDungCongViec: child.noiDungCongViec,
            phanCong: child.phanCong || null,
          });
        });
      }
    });


    return result;
  };

  // Function to load template data
  const loadTemplateData = useCallback(async () => {
    if (!idDuAn) return false;
    
    setLoadingData(true);
    try {
      // Load template data
      const res = await dA_KeHoachThucHienService.getDropdownsTreeTemplate(
       idDuAn || "",
        iskeHoachNoiBo || false
      );
      
      if (res.status && Array.isArray(res.data) && res.data.length > 0) {
        console.log("Template data loaded:", res.data);
        
        // Process template data
        const flatData = flattenTreeData(res.data);
        console.log(`Processed ${flatData.length} template items`);
        
        // Set the data
        setData(flatData);
        
        // If we're in edit mode, set the first group to be edited
        if (flatData.length > 0 && flatData[0].isGroup) {
          setEditingKey(flatData[0].key);
          setEditingRow(flatData[0]);
        }
        
        // Clear localStorage flag
        localStorage.removeItem('useTemplateData');
        
       
        return true;
      } else {
        toast.error("Không thể tải mẫu kế hoạch!");
        return false;
      }
    } catch (error) {
      console.error("Error loading template data:", error);
      toast.error("Có lỗi khi tải mẫu kế hoạch!");
      return false;
    } finally {
      setLoadingData(false);
    }
  }, [idDuAn, iskeHoachNoiBo]);

  // Function to load data from khách hàng for copying
  const loadDataFromKhachHang = useCallback(async () => {
    if (!idDuAn) return false;
    
    setLoadingData(true);
    try {
      // Load data from khách hàng kế hoạch
      const res = await dA_KeHoachThucHienService.getDropdownsTree(idDuAn, false); // false for khách hàng
      
      if (res.status && Array.isArray(res.data) && res.data.length > 0) {
        console.log("Khách hàng data loaded for copying:", res.data);
        
        // Process khách hàng data and convert to nội bộ format with temporary keys
        const processedData = res.data.map((group, groupIndex) => {
          const tempGroupKey = `COPY_G${Date.now()}_${groupIndex}`;
          return {
            ...group,
            id: tempGroupKey, // Use temporary key for new items
            isKeHoachNoiBo: iskeHoachNoiBo, // Use the current prop value
            // Convert children too
            listdA_KeHoachThucHienTrees: group.listdA_KeHoachThucHienTrees?.map((child: any, childIndex: number) => ({
              ...child,
              id: `COPY_${tempGroupKey}_${childIndex}`, // Use temporary key for children
              isKeHoachNoiBo: iskeHoachNoiBo // Use the current prop value
            }))
          };
        });
        
        const flatData = flattenTreeData(processedData);
        console.log(`Processed ${flatData.length} copied items from khách hàng`);
        
        // Set the data
        setData(flatData);
        
        // If we're in edit mode, set the first group to be edited
        if (flatData.length > 0 && flatData[0].isGroup) {
          setEditingKey(flatData[0].key);
          setEditingRow(flatData[0]);
        }
        
        return true;
      } else {
        toast.error("Không thể tải dữ liệu kế hoạch khách hàng!");
        return false;
      }
    } catch (error) {
      console.error("Error loading khách hàng data:", error);
      toast.error("Có lỗi khi tải dữ liệu kế hoạch khách hàng!");
      return false;
    } finally {
      setLoadingData(false);
    }
  }, [idDuAn, iskeHoachNoiBo]);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    if (!idDuAn) return;
    
    setLoadingData(true);
    try {
      // Check if we should use template data
      const useTemplateData = localStorage.getItem('useTemplateData') === 'true';
      
      if (useTemplateData) {
        console.log("Using template data as requested");
        const templateLoaded = await loadTemplateData();
        
        // If template loading failed, create a default group
        if (!templateLoaded) {
          const groupKey = `G${Date.now()}`;
          const newGroup = {
            key: groupKey,
            stt: 'A',
            group: groupKey,
            isGroup: true,
            ...DEFAULT_ROW,
            isKeHoachNoiBo: iskeHoachNoiBo
          };
          setData([newGroup]);
          setEditingKey(groupKey);
          setEditingRow(newGroup);
        }
        
        // Clear localStorage flag
        localStorage.removeItem('useTemplateData');
        return;
      }

      // Check if we should copy from khách hàng
      const copyFromKhachHang = localStorage.getItem('copyFromKhachHang') === 'true';
      
      if (copyFromKhachHang) {
        console.log("Copying from khách hàng as requested");
        const copyLoaded = await loadDataFromKhachHang();
        
        // If copy loading failed, create a default group
        if (!copyLoaded) {
          const groupKey = `G${Date.now()}`;
          const newGroup = {
            key: groupKey,
            stt: 'A',
            group: groupKey,
            isGroup: true,
            ...DEFAULT_ROW,
            isKeHoachNoiBo: iskeHoachNoiBo
          };
          setData([newGroup]);
          setEditingKey(groupKey);
          setEditingRow(newGroup);
        }
        
        // Clear localStorage flag
        localStorage.removeItem('copyFromKhachHang');
        return;
      }
      
      // If useEmptyForm is set, create a default group without loading data
      const useEmptyForm = localStorage.getItem('useEmptyForm') === 'true';
      if (useEmptyForm) {
        console.log("Using empty form as requested");
        const groupKey = `G${Date.now()}`;
        const newGroup = {
          key: groupKey,
          stt: 'A',
          group: groupKey,
          isGroup: true,
          ...DEFAULT_ROW,
          isKeHoachNoiBo: iskeHoachNoiBo
        };
        setData([newGroup]);
        setEditingKey(groupKey);
        setEditingRow(newGroup);
        
        // Clear localStorage flag
        localStorage.removeItem('useEmptyForm');
        return;
      }
      
      // Make the API call to get existing data
      console.log(`Loading existing data for duAnId: ${idDuAn}, isKeHoachNoiBo: ${iskeHoachNoiBo}`);
      const res = await dA_KeHoachThucHienService.getDropdownsTree(idDuAn, iskeHoachNoiBo || false);
      console.log("Fetched tree data:", res.data);
      
      if (res.status && Array.isArray(res.data)) {
        // Check if we have any data
        const hasData = res.data.length > 0;
        console.log(`Has data: ${hasData}, data length: ${res.data.length}`);
        
        // Check if this is data from the template
        const isTemplate = res.data.length > 0 && res.data[0].duAnId === KeHoachThucHienConstant.DuAnIdTemplate;
        const isViewMode = !onClose; // If onClose is not provided, we're in view mode
        
        console.log(`Is template data: ${isTemplate}, Is view mode: ${isViewMode}`);
        
        // If this is template data and we're in view mode, don't display the data
        if (isTemplate && isViewMode) {
          console.log("Template data in view mode - not displaying");
          setData([]);
        } else {
          // Otherwise process the data normally
          const flatData = flattenTreeData(res.data);
          console.log("Processed flat data:", flatData);
          setData(flatData);
          
          // If no data, create a default group
          if (flatData.length === 0) {
            console.log("No data found, creating default group");
            const groupKey = `G${Date.now()}`;
            const newGroup = {
              key: groupKey,
              stt: 'A',
              group: groupKey,
              isGroup: true,
              ...DEFAULT_ROW,
              isKeHoachNoiBo: iskeHoachNoiBo
            };
            setData([newGroup]);
            setEditingKey(groupKey);
            setEditingRow(newGroup);
          }
        }
      } else {
        console.log("No valid data returned from API, creating default group");
        const groupKey = `G${Date.now()}`;
        const newGroup = {
          key: groupKey,
          stt: 'A',
          group: groupKey,
          isGroup: true,
          ...DEFAULT_ROW,
          isKeHoachNoiBo: iskeHoachNoiBo
        };
        setData([newGroup]);
        setEditingKey(groupKey);
        setEditingRow(newGroup);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Có lỗi khi tải dữ liệu!");
      
      // Create default group on error
      const groupKey = `G${Date.now()}`;
      const newGroup = {
        key: groupKey,
        stt: 'A',
        group: groupKey,
        isGroup: true,
        ...DEFAULT_ROW,
        isKeHoachNoiBo: iskeHoachNoiBo
      };
      setData([newGroup]);
      setEditingKey(groupKey);
      setEditingRow(newGroup);
    } finally {
      setLoadingData(false);
    }
  }, [idDuAn, iskeHoachNoiBo, onClose, loadTemplateData, loadDataFromKhachHang]);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Đảm bảo luôn ở chế độ edit khi chỉ có 1 hàng nhóm mới
  useEffect(() => {
    if (
      data.length === 1 &&
      data[0].isGroup &&
      (!data[0].noiDungCongViec || data[0].noiDungCongViec.trim() === "") &&
      editingKey !== data[0].key
    ) {
      setEditingKey(data[0].key);
      setEditingRow(data[0]);
    }
  }, [data, editingKey]);

  // Helper: Create new group row
  const createGroupRow = useCallback((): RowType => {
    const groupKey = `G${Date.now()}`;
    const groupChar = String.fromCharCode(65 + data.filter(r => r.isGroup).length);
    return {
      key: groupKey,
      stt: groupChar,
      group: groupKey,
      isGroup: true,
      ...DEFAULT_ROW,
    };
  }, [data]);

  // Helper: Create new child row
  const createChildRow = useCallback((groupKey: string): RowType => {
    const stt = data.filter(r => r.group === groupKey && !r.isGroup).length + 1;
    return {
      key: `${groupKey}_${Date.now()}`,
      stt,
      group: groupKey,
      groupNoiDungId: groupKey, // Set groupNoiDungId to match the parent group
      isGroup: false,
      ...DEFAULT_ROW,
    };
  }, [data]);

  // Hàm lưu hàng đang edit nếu có
  const saveEditingRowIfNeeded = () => {
    if (editingKey) {
      setData(prev => prev.map(row => row.key === editingKey ? { ...row, ...editingRow } as RowType : row));
      setEditingKey(null);
      setEditingRow({} as RowType);
    }
  };

  // Add group (hàm thường, không dùng useCallback)
  function handleAddGroup() {
    let newData = [...data];
    if (editingKey) {
      newData = newData.map(row => row.key === editingKey ? { ...row, ...editingRow } as RowType : row);
      setEditingKey(null);
      setEditingRow({} as RowType);
    }
    const newGroup = createGroupRow();
    newData.push(newGroup);
    setData(newData);
    setEditingKey(newGroup.key);
    setEditingRow(newGroup);
  }

  // Add child (hàm thường, không dùng useCallback)
  function handleAddChild(groupKey: string) {
    let newData = [...data];
    if (editingKey) {
      newData = newData.map(row => row.key === editingKey ? { ...row, ...editingRow } as RowType : row);
      setEditingKey(null);
      setEditingRow({} as RowType);
    }
    // Tìm vị trí group (so sánh đúng row.group)
    const groupIdx = newData.findIndex(r => r.isGroup && r.group === groupKey);
    let insertIdx = groupIdx + 1;
    for (let i = groupIdx + 1; i < newData.length; i++) {
      if (newData[i].group === groupKey && !newData[i].isGroup) {
        insertIdx = i + 1;
      } else if (newData[i].isGroup) {
        break;
      }
    }
    const newChild = createChildRow(groupKey);
    newData.splice(insertIdx, 0, newChild);
    setData(newData);
    setEditingKey(newChild.key);
    setEditingRow(newChild);
  }

  // Edit row
  const handleEditRow = useCallback((row: RowType) => {
    // Don't allow editing if userOptions are not loaded
    if (!userOptions || userOptions.length === 0) {
      console.warn('Cannot edit: User options not loaded yet');
      return;
    }
    
    
    // Convert phanCong string to array if it contains comma-separated values
    let phanCongArray: string[] = [];
    if (row.phanCong && typeof row.phanCong === 'string') {
      phanCongArray = row.phanCong.split(',').map(id => id.trim()).filter(id => id);
    }
    
    // Check if the phanCong values exist in userOptions
    const usersExist = phanCongArray.map(userId => 
      userOptions.find(u => u.value === userId)
    );
    console.log('Users exist in options:', usersExist);
    
    setEditingKey(row.key);
    setEditingRow({ 
      ...row,
      // Store as array for multi-select
      phanCong: phanCongArray.length > 0 ? phanCongArray : undefined
    } as any);
  }, [userOptions]);

  // Add a useEffect to update editingRow when userOptions change
  useEffect(() => {
    if (editingKey && editingRow.phanCong && userOptions.length > 0) {
      console.log('Updating editingRow with loaded userOptions');
      // Force a re-render by updating the editingRow
      setEditingRow(prev => ({ ...prev }));
    }
  }, [userOptions, editingKey, editingRow.phanCong]);

  // Delete row
  const handleDeleteRow = useCallback((key: string) => {
    setData(prev => {
      const newData = prev.filter(row => row.key !== key);
      // Nếu xoá hết thì tạo lại 1 nhóm mới ở chế độ edit
      if (newData.length === 0) {
        const groupChar = 'A';
        const groupKey = `G${Date.now()}`;
        const newGroup = {
          key: groupKey,
          stt: groupChar,
          group: groupChar,
          isGroup: true,
          ...DEFAULT_ROW,
        };
        setEditingKey(groupKey);
        setEditingRow(newGroup);
        return [newGroup];
      }
      // Nếu xoá hàng đang edit thì reset edit về null, trừ trường hợp còn 1 hàng nhóm mới thì giữ edit
      if (editingKey === key) {
        if (newData.length === 1 && newData[0].isGroup && (!newData[0].noiDungCongViec || newData[0].noiDungCongViec.trim() === "")) {
          setEditingKey(newData[0].key);
          setEditingRow(newData[0]);
        } else {
          setEditingKey(null);
          setEditingRow({} as RowType);
        }
      }
      return newData;
    });
  }, [editingKey]);
  
  // Save edit
  const handleSaveEdit = useCallback(async () => {
    console.log('Saving edit with data:', editingRow);
    
    // Convert array back to comma-separated string if needed
    let phanCongValue = editingRow.phanCong;
    if (Array.isArray(phanCongValue)) {
      phanCongValue = phanCongValue.join(',');
    }
    
    // Make sure we preserve the phanCong field exactly as is
    const updatedRow = {
      ...editingRow,
      phanCong: phanCongValue
    };
    
    // If this is a group and it's a new group (key starts with G), save it to the server first
    if (updatedRow.isGroup && updatedRow.key && updatedRow.key.startsWith('G')) {
      try {
        // Format dates properly
        let ngayBatDau = null;
        if (updatedRow.ngayBatDau && updatedRow.ngayBatDau !== '') {
          if (dayjs.isDayjs(updatedRow.ngayBatDau)) {
            ngayBatDau = updatedRow.ngayBatDau.format("YYYY-MM-DD");
          } else {
            const parsedDate = dayjs(updatedRow.ngayBatDau);
            if (parsedDate.isValid()) {
              ngayBatDau = parsedDate.format("YYYY-MM-DD");
            }
          }
        }

        let ngayKetThuc = null;
        if (updatedRow.ngayKetThuc && updatedRow.ngayKetThuc !== '') {
          if (dayjs.isDayjs(updatedRow.ngayKetThuc)) {
            ngayKetThuc = updatedRow.ngayKetThuc.format("YYYY-MM-DD");
          } else {
            const parsedDate = dayjs(updatedRow.ngayKetThuc);
            if (parsedDate.isValid()) {
              ngayKetThuc = parsedDate.format("YYYY-MM-DD");
            }
          }
        }
        
        // Create payload for API
        const groupPayload: DA_KeHoachThucHienCreateOrUpdateType = {
          id: null, // New group
          duAnId: idDuAn,
          groupNoiDungId: null, // Groups don't have parent groups
          group: null, // Group reference for backend
          isGroup: true,
          ngayBatDau,
          ngayKetThuc,
          isKeHoachNoiBo: iskeHoachNoiBo,
          noiDungCongViec: updatedRow.noiDungCongViec || null,
          isCanhBao: !!updatedRow.isCanhBao,
          canhBaoTruocNgay: updatedRow.canhBaoTruocNgay ?? null,
          phanCong: phanCongValue || null,
          phanCongKH: updatedRow.phanCongKH || null,
        };
        
        console.log("Creating new group:", groupPayload);
        const response = await dA_KeHoachThucHienService.create(groupPayload);
        
        if (response && response.status && response.data) {
          console.log("Group created successfully with ID:", response.data);
          // Get the ID returned from the server
          let newId;
          
          // Handle different response formats to ensure we get the ID as a string
          if (typeof response.data === 'string') {
            newId = response.data;
          } else if (typeof response.data === 'object' && response.data !== null) {
            // If response.data is an object, try to extract the id field
            newId = response.data.id || response.data;
          } else {
            console.error("Unexpected response format:", response.data);
            toast.error("Không thể xác định ID nhóm từ phản hồi máy chủ");
            // Continue with local update
            setData(prev => prev.map(row => row.key === editingKey ? updatedRow : row));
            setEditingKey(null);
            setEditingRow({} as RowType);
            return;
          }
          
          // Ensure newId is a string
          newId = String(newId);
          console.log("Extracted ID:", newId);
          
          const oldKey = updatedRow.key;
          
          // Update the data state with the new ID
          setData(prev => {
            // First create a new array with the updated group
            const newData = prev.map(row => {
              if (row.key === oldKey) {
                // Update the group row with the new ID from server
                const updatedGroupRow = { 
                  ...row, 
                  ...updatedRow, 
                  key: newId,  // Replace temporary key with real ID from server
                  group: newId // Update group reference too
                };
                console.log("Updated group row:", updatedGroupRow);
                return updatedGroupRow;
              } 
              // Update any child rows that reference this group
              else if (row.group === oldKey) {
                const updatedChildRow = { 
                  ...row, 
                  group: newId,
                  groupNoiDungId: newId
                };
                console.log("Updated child row:", updatedChildRow);
                return updatedChildRow;
              }
              return row;
            });
            
            console.log("Updated data with new group ID:", newData);
            return newData;
          });
          
          // Clear editing state
          setEditingKey(null);
          setEditingRow({} as RowType);
          
          toast.success("Nhóm công việc đã được lưu thành công!");
          return;
        } else {
          console.error("Failed to create group:", response?.message);
          toast.error(response?.message || "Lưu nhóm công việc thất bại!");
          // Continue with local update even if server update fails
        }
      } catch (error) {
        console.error("Error creating group:", error);
        toast.error("Có lỗi xảy ra khi lưu nhóm công việc!");
        // Continue with local update even if server update fails
      }
    }
    
    // Regular local update for non-group items or if API call failed
    setData(prev => prev.map(row => row.key === editingKey ? updatedRow : row));
    setEditingKey(null);
    setEditingRow({} as RowType);
  }, [editingKey, editingRow, idDuAn, iskeHoachNoiBo]);

  // Cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditingKey(null);
    setEditingRow({} as RowType);
  }, []);

  // Drag & drop
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
  
    if (!over || active.id === over.id) return;
  
    const oldIndex = data.findIndex(item => item.key === active.id);
    const newIndex = data.findIndex(item => item.key === over.id);
  
    if (oldIndex === -1 || newIndex === -1) return;
  
    const movingItem = data[oldIndex];
    const targetItem = data[newIndex];
  
   
    if (movingItem.isGroup) {
      const groupKey = movingItem.key;
  
      // 1. Lấy tất cả phần tử thuộc group này
      const groupBlock: typeof data = [];
      for (let i = oldIndex; i < data.length; i++) {
        const item = data[i];
        if (i !== oldIndex && item.isGroup) break;
        groupBlock.push(item);
      }
  
      // 2. Xoá groupBlock khỏi data
      const remaining = data.filter(item => !groupBlock.includes(item));
  
      // 3. Xác định vị trí chèn mới
      let insertIndex = -1;
      if (targetItem.isGroup) {
        // Nếu thả lên group khác → chèn trước group đó
        insertIndex = remaining.findIndex(i => i.key === targetItem.key);
      } else {
        // Nếu thả lên item con → tìm group của item đó rồi chèn trước
        const targetGroupId = targetItem.group;
        insertIndex = remaining.findIndex(i => i.key === targetGroupId);
      }
  
      // 4. Chèn lại block group
      if (insertIndex === -1) {
        toast.error(" Không tìm được vị trí chèn group");
        return;
      }
  
      const newData = [
        ...remaining.slice(0, insertIndex),
        ...groupBlock,
        ...remaining.slice(insertIndex),
      ];
  
      setData(newData);
      return;
    }
  
   
    let newData = arrayMove([...data], oldIndex, newIndex);
  
    // Tìm group gần nhất phía trên
    let newGroupId: string | null = null;
    for (let i = newIndex; i >= 0; i--) {
      if (newData[i].isGroup) {
        newGroupId = newData[i].key;
        break;
      }
    }
  
  
    if (!newGroupId) {
      toast.warn(" Item con không thể nằm ngoài group");
      setData(data); // revert lại
      return;
    }
  

    const itemIndex = newData.findIndex(i => i.key === movingItem.key);
    const groupIndex = newData.findIndex(i => i.key === newGroupId);
    if (itemIndex < groupIndex) {
      toast.warn(" Item không thể nằm trước group");
      setData(data);
      return;
    }
  
 
    if (newGroupId !== movingItem.group) {
      newData = newData.map(item =>
        item.key === movingItem.key
          ? { ...item, group: newGroupId, groupNoiDungId: newGroupId }
          : item
      );
    }
  
    setData(newData);
  }, [data]);
  
  
  
  // Validate trước khi lưu
  const validateRows = () => {
    for (const row of data) {
      if (row.isGroup) {
        if (!row.noiDungCongViec || row.noiDungCongViec.trim() === "") {
          toast.error("Tên nhóm công việc không được để trống!");
          setEditingKey(row.key);
          setEditingRow(row);
          return false;
        }
      } else {
        if (!row.noiDungCongViec || row.noiDungCongViec.trim() === "") {
          toast.error("Tên công việc không được để trống!");
          setEditingKey(row.key);
          setEditingRow(row);
          return false;
        }

        // Validation for child task dates within parent group dates
        const parentGroup = data.find(g => g.key === row.group && g.isGroup);
        if (parentGroup) {
          const childStartDate = row.ngayBatDau ? dayjs(row.ngayBatDau, ["YYYY-MM-DD", "DD/MM/YYYY"]) : null;
          const childEndDate = row.ngayKetThuc ? dayjs(row.ngayKetThuc, ["YYYY-MM-DD", "DD/MM/YYYY"]) : null;
          const parentStartDate = parentGroup.ngayBatDau ? dayjs(parentGroup.ngayBatDau, ["YYYY-MM-DD", "DD/MM/YYYY"]) : null;
          const parentEndDate = parentGroup.ngayKetThuc ? dayjs(parentGroup.ngayKetThuc, ["YYYY-MM-DD", "DD/MM/YYYY"]) : null;

          // If parent group has no dates, no need to validate child dates against parent
          if (parentStartDate && parentEndDate) {
            if (childStartDate && !childStartDate.isValid()) {
              toast.error(`Ngày bắt đầu của công việc \"${row.noiDungCongViec}\" không hợp lệ.`);
              setEditingKey(row.key);
              setEditingRow(row);
              return false;
            }
            if (childEndDate && !childEndDate.isValid()) {
              toast.error(`Ngày kết thúc của công việc \"${row.noiDungCongViec}\" không hợp lệ.`);
              setEditingKey(row.key);
              setEditingRow(row);
              return false;
            }

            if (childStartDate && childStartDate.isValid() && childStartDate.isBefore(parentStartDate)) {
              toast.error(`Ngày bắt đầu của công việc \"${row.noiDungCongViec}\" không được trước ngày bắt đầu của nhóm \"${parentGroup.noiDungCongViec}\".`);
              setEditingKey(row.key);
              setEditingRow(row);
              return false;
            }
            if (childEndDate && childEndDate.isValid() && childEndDate.isAfter(parentEndDate)) {
              toast.error(`Ngày kết thúc của công việc \"${row.noiDungCongViec}\" không được sau ngày kết thúc của nhóm \"${parentGroup.noiDungCongViec}\".`);
              setEditingKey(row.key);
              setEditingRow(row);
              return false;
            }

            if (childStartDate && childEndDate && childStartDate.isValid() && childEndDate.isValid() && childStartDate.isAfter(childEndDate)) {
              toast.error(`Ngày bắt đầu của công việc \"${row.noiDungCongViec}\" không được sau ngày kết thúc.`);
              setEditingKey(row.key);
              setEditingRow(row);
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  // Tối ưu mapping khi lưu, đảm bảo đúng kiểu dữ liệu
  const handleSaveKeHoachTrienKhai = useCallback(async () => {
    if (!validateRows()) return;
    setLoading(true);
    try {
      // First pass: collect all group IDs
      const groupIdMap = new Map();
      
      // Helper function to extract ID from various formats
      const extractId = (value: any): string | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value !== null) {
          return value.id || null;
        }
        return String(value);
      };
      
      // In ra log để kiểm tra dữ liệu trước khi lưu
      console.log("Data trước khi map:", data.map(item => ({
        key: item.key,
        isGroup: item.isGroup,
        group: item.group,
        groupNoiDungId: item.groupNoiDungId,
        noiDungCongViec: item.noiDungCongViec,
        isKeHoachNoiBo: iskeHoachNoiBo
      })));
      
      // Second pass: create the mapped data
      const mappedData: DA_KeHoachThucHienCreateOrUpdateType[] = data.map(item => {
        // Properly format dates with clearer logic
        let ngayBatDau = null;
        if (item.ngayBatDau && item.ngayBatDau !== '') {
          if (dayjs.isDayjs(item.ngayBatDau)) {
            ngayBatDau = item.ngayBatDau.format("YYYY-MM-DD");
          } else {
            // Try multiple date formats including ISO format with timezone
            const parsedDate = dayjs(item.ngayBatDau, ["DD/MM/YYYY", "YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ssZ"]);
            if (parsedDate.isValid()) {
              ngayBatDau = parsedDate.format("YYYY-MM-DD");
            }
          }
        }

        let ngayKetThuc = null;
        if (item.ngayKetThuc && item.ngayKetThuc !== '') {
          if (dayjs.isDayjs(item.ngayKetThuc)) {
            ngayKetThuc = item.ngayKetThuc.format("YYYY-MM-DD");
          } else {
            // Try multiple date formats including ISO format with timezone
            const parsedDate = dayjs(item.ngayKetThuc, ["DD/MM/YYYY", "YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ssZ"]);
            if (parsedDate.isValid()) {
              ngayKetThuc = parsedDate.format("YYYY-MM-DD");
            }
          }
        }

        // Extract IDs properly - handle copied items
        let itemId = extractId(item.key);
        const groupId = extractId(item.group);
        let groupNoiDungId = !item.isGroup ? extractId(item.groupNoiDungId) || groupId : null;
        
        // If this is a copied item (key starts with COPY_), set id to null for creation
        if (typeof item.key === 'string' && item.key.startsWith('COPY_')) {
          itemId = null;
        }
        
        // If group key starts with COPY_, set groupNoiDungId to null for new groups
        if (typeof item.group === 'string' && item.group.startsWith('COPY_')) {
          if (!item.isGroup) {
            groupNoiDungId = null; // Will be set after parent group is created
          }
        }
        
        console.log(`Item "${item.noiDungCongViec}" - ID: ${itemId}, Group: ${groupId}, GroupNoiDungId: ${groupNoiDungId}`);
        
        return {
          id: itemId,
          duAnId: idDuAn,
          groupNoiDungId: groupNoiDungId,
          group: groupId, // Add back the group attribute for backend grouping
          isGroup: !!item.isGroup,
          stt: item.stt !== undefined && item.stt !== null ? String(item.stt) : null,
          ngayBatDau,
          ngayKetThuc,
          isKeHoachNoiBo: iskeHoachNoiBo,
          noiDungCongViec: item.noiDungCongViec || null,
          isCanhBao: !!item.isCanhBao,
          canhBaoTruocNgay: item.canhBaoTruocNgay ?? null,
          phanCong: typeof item.phanCong === 'object' ? null : item.phanCong || null,
          phanCongKH: item.phanCongKH || null,
        };
      });
      
      // Đảm bảo idDuAn không null trước khi gọi API
      if (!idDuAn) {
        toast.error("ID dự án không hợp lệ!");
        return;
      }
      console.log("iskeHoachNoiBo props data",iskeHoachNoiBo);
      console.log("Saving data:", mappedData);

      const response = await dA_KeHoachThucHienService.saveForm(idDuAn,iskeHoachNoiBo || false, mappedData);
      
      if (response && response.status) {
        toast.success("Lưu kế hoạch triển khai thành công!");
        // Refresh data after save
        await fetchData();
        
        // Call onRefresh to update parent component
        if (onRefresh) {
          console.log("Calling onRefresh to update parent component");
          onRefresh();
        }
        
        // Close the component if onClose is provided
        if (onClose) {
          console.log("Closing component after save");
          onClose();
        }
      } else {
        toast.error(response?.message || "Có lỗi xảy ra khi lưu!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu kế hoạch!");
    } finally {
      setLoading(false);
    }
  }, [data, idDuAn, iskeHoachNoiBo, onClose, onRefresh, fetchData]);

  // Export to Excel function
  const handleExportExcel = async () => {
    if (!idDuAn) {
      toast.error("ID dự án không hợp lệ!");
      return;
    }
    
    setExportLoading(true);
    try {
      const result = await dA_KeHoachThucHienService.exportKeHoachThucHienDA(idDuAn,iskeHoachNoiBo || false);
      
      if (result.status) {
        // Create download link
        const downloadUrl = `${process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL}${result.data}`;
        
        // Create a temporary anchor element and trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `KeHoachThucHien_${new Date().toISOString().slice(0, 10)}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Xuất Excel thành công!");
      } else {
        toast.error(result.message || "Có lỗi xảy ra khi xuất Excel!");
      }
    } catch (error) {
      console.error("Export Excel error:", error);
      toast.error("Có lỗi xảy ra khi xuất Excel!");
    } finally {
      setExportLoading(false);
    }
  };

  // Tách logic render row cho dễ bảo trì, truyền các handler và biến cần thiết vào
  const renderEditRow = (row: RowType, editingRow: RowType, setEditingRow: any, handleSaveEdit: any, handleCancelEdit: any, userOptions: any, styles: any) => {
    console.log('renderEditRow - editingRow.phanCong:', editingRow.phanCong);
    console.log('renderEditRow - userOptions:', userOptions);
    
    // Convert string to array for Select multiple
    let phanCongValue: string[] | undefined = undefined;
    if (editingRow.phanCong) {
      if (Array.isArray(editingRow.phanCong)) {
        phanCongValue = editingRow.phanCong as any;
      } else if (typeof editingRow.phanCong === 'string') {
        phanCongValue = editingRow.phanCong.split(',').map(id => id.trim()).filter(id => id);
      }
    }
    
    console.log('renderEditRow - phanCongValue for Select:', phanCongValue);
    
    return (
    <DraggableRow row={row}>
      <td>
        <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
      </td>
      <td style={{ textAlign: "center" }}>
        <Input
          value={editingRow.stt ?? 'A'}
          onChange={e => setEditingRow({ ...editingRow, stt: e.target.value })}
          size="small"
          style={{ width: 60, textAlign: "center" }}
        />
      </td>
      <td>
        <Input
          key="input-group"
          value={editingRow.noiDungCongViec || ""}
          onChange={e => setEditingRow({ ...editingRow, noiDungCongViec: e.target.value })}
          size="small"
          autoFocus={true}
          placeholder={editingRow.isGroup ? "Nhập tên nhóm" : "Nhập hạng mục công việc"}
        />
      </td>
      <td>
        <DatePicker.RangePicker
          value={[
            editingRow.ngayBatDau ? dayjs(editingRow.ngayBatDau) : null,
            editingRow.ngayKetThuc ? dayjs(editingRow.ngayKetThuc) : null
          ]}
          onChange={dates => {
            setEditingRow({
              ...editingRow,
              ngayBatDau: dates && dates[0] ? dates[0].format("YYYY-MM-DD") : null,
              ngayKetThuc: dates && dates[1] ? dates[1].format("YYYY-MM-DD") : null,
            });
          }}
          format="DD/MM/YYYY"
          style={{ width: 220, height: 36, minHeight: 36, lineHeight: '36', boxSizing: 'border-box' }}
          size="small"
        />
      </td>
      {editingRow.isGroup ? (
        <>
          <td>
            <TextArea
              value={editingRow.phanCongKH || ""}
              onChange={e => setEditingRow({ ...editingRow, phanCongKH: e.target.value })}
              size="small"
              placeholder="Phân công khách hàng"
              autoSize={{ minRows: 1, maxRows: 3 }}
            />
          </td>
          <td style={{ textAlign: "center" }}>
            <Checkbox
              checked={editingRow.isCanhBao || false}
              onChange={e => setEditingRow({ ...editingRow, isCanhBao: e.target.checked })}
            />
          </td>
        </>
      ) : (
        <>
          <td className={styles.assignCell}>
            <Select
              mode="multiple"
              placeholder="Chọn người thực hiện"
              options={userOptions}
              allowClear
              showSearch
              optionFilterProp="label"
              value={phanCongValue}
              onChange={val => {
                console.log('Select onChange:', val);
                setEditingRow({ ...editingRow, phanCong: val });
              }}
              className={styles.inputAssign}
              size="small"
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              maxTagCount="responsive"
              maxTagTextLength={10}
              showArrow
              suffixIcon={null}
            />
          </td>
          <td style={{ textAlign: "center" }}>
            <Checkbox
              checked={editingRow.isCanhBao || false}
              onChange={e => setEditingRow({ ...editingRow, isCanhBao: e.target.checked })}
            />
          </td>
        </>
      )}
      <td style={{ textAlign: "center" }}>
        <Button
          icon={<SaveOutlined />}
          type="link"
          onClick={handleSaveEdit}
          style={{ padding: 0, marginRight: 8 }}
        />
        <Button
          icon={<CloseOutlined />}
          type="link"
          onClick={handleCancelEdit}
          style={{ padding: 0 }}
        />
      </td>
    </DraggableRow>
  )};

  const renderGroupRow = (row: RowType, handleAddChild: any, handleEditRow: any, handleDeleteRow: any, styles: any, userOptions: any) => (
    <DraggableRow row={row}>
      <td>
        <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
      </td>
      <td style={{ textAlign: "center", fontWeight: "bold" }}>{row.stt}</td>
      <td style={{ fontWeight: "bold" }}>{row.noiDungCongViec}</td>
      <td>
        {/* Nếu nhóm không có ngày, tự động lấy min ngày bắt đầu và max ngày kết thúc của các child thuộc group */}
        {(() => {
          // Ưu tiên hiển thị ngày của nhóm nếu có
          if (
            row.ngayBatDau &&
            row.ngayKetThuc &&
            dayjs(row.ngayBatDau).isValid() &&
            dayjs(row.ngayKetThuc).isValid()
          ) {
            return `${dayjs(row.ngayBatDau).format("DD/MM/YYYY")} - ${dayjs(row.ngayKetThuc).format("DD/MM/YYYY")}`;
          }
          // Nếu không có ngày nhóm, tổng hợp từ child
          const childDates = data.filter(r => r.group === row.group && !r.isGroup);
          if (childDates.length === 0) return "-";
          const validStarts = childDates.map(r => r.ngayBatDau).filter(d => d && dayjs(d).isValid()).map(d => dayjs(d));
          const validEnds = childDates.map(r => r.ngayKetThuc).filter(d => d && dayjs(d).isValid()).map(d => dayjs(d));
          if (validStarts.length === 0 && validEnds.length === 0) return "-";
          const minStart = validStarts.length > 0 ? dayjs(validStarts.reduce((a, b) => a.isBefore(b) ? a : b)).format("DD/MM/YYYY") : "";
          const maxEnd = validEnds.length > 0 ? dayjs(validEnds.reduce((a, b) => a.isAfter(b) ? a : b)).format("DD/MM/YYYY") : "";
          return `${minStart}${minStart && maxEnd ? ' - ' : ''}${maxEnd}`;
        })()}
      </td>
      <td>
        <div style={{ 
          whiteSpace: "pre-wrap", 
          maxHeight: "120px", 
          overflowY: "auto", 
          padding: "4px", 
          border: "1px solid #f0f0f0", 
          borderRadius: "4px", 
          background: "#fafafa" 
        }}>
          {row.phanCongKH}
        </div>
      </td>
      <td style={{ textAlign: "center" }}>
        {row.isCanhBao ? (
          <Checkbox checked disabled />
        ) : (
          <Checkbox disabled />
        )}
      </td>
      <td style={{ textAlign: "center" }}>
        <Button
          icon={<PlusOutlined />}
          onClick={() => handleAddChild(row.group!)}
          type="link"
          size="small"
          className={styles.btnThem}
        />
        <br />
        <Button
          icon={<EditOutlined />}
          type="link"
          onClick={() => handleEditRow(row)}
          style={{ padding: 0, marginRight: 8 }}
        />
        <Button
          icon={<DeleteOutlined />}
          type="link"
          danger
          onClick={() => {
            Modal.confirm({
              title: 'Bạn có chắc chắn muốn xoá?',
              content: 'Hành động này không thể hoàn tác.',
              okText: 'Xoá',
              okType: 'danger',
              cancelText: 'Huỷ',
              onOk: () => handleDeleteRow(row.key),
            });
          }}
          style={{ padding: 0 }}
        />
      </td>
    </DraggableRow>
  );

  const renderChildRow = (row: RowType, handleEditRow: any, handleDeleteRow: any, userOptions: any[], styles: any) => {
    // Find the user labels for display
    let userLabels = "";
    if (row.phanCong && typeof row.phanCong === 'string') {
      const userIds = row.phanCong.split(',').map(id => id.trim()).filter(id => id);
      const labels = userIds.map(userId => {
        const user = userOptions.find((u: any) => u.value === userId);
        return user?.label || userId;
      });
      userLabels = labels.join(', ');
    }
    

    
    return (
    <DraggableRow row={row}>
      <td>
        <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
      </td>
      <td style={{ textAlign: "center" }}>{row.stt}</td>
      <td>{row.noiDungCongViec}</td>
      <td>
        {(row.ngayBatDau && dayjs(row.ngayBatDau).isValid()
          ? dayjs(row.ngayBatDau).format("DD/MM/YYYY")
          : "")}
        {row.ngayBatDau && row.ngayKetThuc ? " - " : ""}
        {(row.ngayKetThuc && dayjs(row.ngayKetThuc).isValid()
          ? dayjs(row.ngayKetThuc).format("DD/MM/YYYY")
          : "")}
      </td>
      <td>{userLabels}</td>
      <td style={{ textAlign: "center" }}>
        {row.isCanhBao ? (
          <Checkbox checked disabled />
        ) : (
          <Checkbox disabled />
        )}
      </td>
      <td style={{ textAlign: "center" }}>
        <Button
          icon={<EditOutlined />}
          type="link"
          onClick={() => handleEditRow(row)}
          style={{ padding: 0, marginRight: 8 }}
        />
        <Button
          icon={<DeleteOutlined />}
          type="link"
          danger
          onClick={() => {
            Modal.confirm({
              title: 'Bạn có chắc chắn muốn xoá?',
              content: 'Hành động này không thể hoàn tác.',
              okText: 'Xoá',
              okType: 'danger',
              cancelText: 'Huỷ',
              onOk: () => handleDeleteRow(row.key),
            });
          }}
          style={{ padding: 0 }}
        />
      </td>
    </DraggableRow>
  )};

  // Render - Add loading state
  if (loadingData) {
    return (
      <div className={styles.loadingWrapper}>Đang tải dữ liệu...</div>
    );
  }

  // Check if this is the template ID in view mode
  const isTemplate = idDuAn === KeHoachThucHienConstant.DuAnIdTemplate;
  const isViewMode = !onClose;
  if (isTemplate && isViewMode && data.length === 0) {
    return (
      <div className={styles.keHoachTrienKhaiContainer}>
        <div className={styles.emptyTemplate}>
          <p>Đây là mẫu kế hoạch. Dữ liệu sẽ được hiển thị khi bạn vào chế độ cập nhật.</p>
          {onRefresh && (
            <Button type="primary" onClick={onRefresh}>
              Vào chế độ cập nhật
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.keHoachTrienKhaiContainer}>
      <div className={styles.headerActions}>
        <Button 
          type="primary"
          icon={<FileExcelOutlined />} 
          onClick={handleExportExcel} 
          loading={exportLoading}

        >
          Xuất Excel
        </Button>
        {onClose && (
          <Button 
            onClick={onClose}
            className={styles.cancelButton}
            style={{ marginLeft: 8 }}
          >
            Quay lại xem
          </Button>
        )}
      </div>
      <div className={styles.tableWrapper}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map(item => item.key)}
            strategy={verticalListSortingStrategy}
          >
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th></th>
                  <th>STT</th>
                  <th>Hạng mục công việc</th>
                  <th>Thời gian thực hiện</th>
                  <th>Người thực hiện</th>
                  <th>Cảnh báo</th>
                  <th>
                    <Button
                      onClick={handleAddGroup}
                      size="small"
                      className={styles.btnThem}
                    >
                      Thêm nhóm
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <React.Fragment key={row.key}>
                    {editingKey === row.key
                      ? renderEditRow(row, editingRow, setEditingRow, handleSaveEdit, handleCancelEdit, userOptions, styles)
                      : row.isGroup
                      ? renderGroupRow(row, handleAddChild, handleEditRow, handleDeleteRow, styles, userOptions)
                      : renderChildRow(row, handleEditRow, handleDeleteRow, userOptions, styles)}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
      <div className={styles.actionButtons}>
        {onClose && <Button onClick={onClose}>Hủy</Button>}
        <Button type="primary" onClick={handleSaveKeHoachTrienKhai} loading={loading} disabled={loading}>
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default KeHoachTrienKhaiCustomTable;