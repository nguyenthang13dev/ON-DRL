import React from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

// Generic type for table data
interface SortableTableProps<T> {
  columns: TableColumnsType<T>;
  dataSource: T[];
  onChange?: TableProps<T>['onChange'];
  loading?: boolean;
  pagination?: TableProps<T>['pagination'];
  scroll?: TableProps<T>['scroll'];
  size?: TableProps<T>['size'];
  bordered?: boolean;
}

// Generic SortableTable component
function SortableTable<T extends object>({
  columns,
  dataSource,
  onChange,
  loading = false,
  pagination = { pageSize: 10 },
  scroll,
  size = 'middle',
  bordered = true,
}: SortableTableProps<T>) {
  return (
    <Table<T>
      columns={columns}
      dataSource={dataSource}
      onChange={onChange}
      loading={loading}
      pagination={pagination}
      scroll={scroll}
      size={size}
      bordered={bordered}
    />
  );
}

export default SortableTable;
