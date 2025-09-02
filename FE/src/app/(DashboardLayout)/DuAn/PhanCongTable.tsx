import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Select, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { DropdownOption } from "@/types/general";
import { userService } from "@/services/user/user.service";
import { roleService } from "@/services/role/role.service";
import { DA_PhanCongCreateOrUpdateType } from "@/types/dA_DuAn/dA_PhanCong";

interface PhanCongTableProps {
  phanCongList: DA_PhanCongCreateOrUpdateType[];
  userOptions: DropdownOption[];
  roleOptions: DropdownOption[];
  onAdd: () => void;
  onChange: (index: number, key: "userId" | "vaiTroId", value: string) => void;
  onDelete: (index: number) => void;
}

const PhanCongTable: React.FC<PhanCongTableProps> = ({
  phanCongList,
  userOptions,
  roleOptions,
  onAdd,
  onChange,
  onDelete,
}) => {
  // Memoize selected user IDs to prevent unnecessary recalculations
  const selectedUserIds = useMemo(() => 
    phanCongList.map(item => item.userId).filter(Boolean),
    [phanCongList]
  );

  // Memoize available users to prevent unnecessary recalculations
  const availableUsers = useMemo(() => 
    userOptions.filter(user => !selectedUserIds.includes(user.value)),
    [userOptions, selectedUserIds]
  );

  // Helper function to convert comma-separated string to array
  const getRoleIdsArray = (vaiTroId: string | null | undefined): string[] => {
    if (!vaiTroId) return [];
    return vaiTroId.split(',').map(id => id.trim()).filter(Boolean);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, idx: number) => idx + 1,
    },
    {
      title: "Thành viên",
      dataIndex: "userId",
      render: (_: any, record: any, idx: number) => {
        // Get current row's selection
        const currentSelection = phanCongList[idx]?.userId;
        
        // Filter options to show only available users plus current selection
        const rowOptions = userOptions.filter(user => 
          !selectedUserIds.includes(user.value) || 
          user.value === currentSelection
        );

        return (
        <Select
          showSearch
          placeholder="Chọn thành viên"
            value={currentSelection}
            options={rowOptions.map(u => ({ label: u.label, value: u.value }))}
          onChange={val => onChange(idx, "userId", val)}
          style={{ width: "100%" }}
          optionFilterProp="label"
        />
        );
      },
    },
    {
      title: "Vai trò",
      dataIndex: "roleId",
      render: (_: any, record: any, idx: number) => {
        // Get current role selections as array
        const currentSelections = getRoleIdsArray(phanCongList[idx]?.vaiTroId);

        return (
        <Select
          showSearch
            mode="multiple"
          placeholder="Chọn vai trò"
            value={currentSelections}
          options={roleOptions.map(r => ({ label: r.label, value: r.value }))}
            onChange={values => {
              // Join selected values with commas and update
              const newValue = values.join(',');
              onChange(idx, "vaiTroId", newValue);
            }}
          style={{ width: "100%" }}
          optionFilterProp="label"
        />
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      align: "center" as const,
      width: 80,
      render: (_: any, __: any, idx: number) => (
        <Popconfirm 
          title="Xoá thành viên này?" 
          onConfirm={() => onDelete(idx)}
        >
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={onAdd}
        style={{ marginBottom: 12 }}
        disabled={availableUsers.length === 0}
      >
        Thêm thành viên
      </Button>
      <Table
        columns={columns}
        dataSource={phanCongList}
        rowKey={(_, idx) => String(idx)}
        pagination={false}
        bordered
        size="small"
      />
    </div>
  );
};
    
export default PhanCongTable;