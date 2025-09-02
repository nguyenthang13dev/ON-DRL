import React from "react";
import { Table, Pagination } from "antd";
import type { TableProps, ColumnsType } from "antd/es/table";

interface Props<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: string;
  loading?: boolean;
  total: number;
  pageSize: number;
  pageIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (current: number, size: number) => void;
}

const TableStatus = <T extends object>({
  columns,
  dataSource,
  rowKey,
  loading,
  total,
  pageSize,
  pageIndex,
  onPageChange,
  onPageSizeChange,
}: Props<T>) => {
  return (
    <>
      <div className="table-responsive">
        <Table<T>
          columns={columns}
          bordered
          dataSource={dataSource}
          rowKey={rowKey}
          scroll={{ x: "max-content" }}
          pagination={false}
          loading={loading}
        />
      </div>
      <Pagination
        className="mt-2"
        total={total}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} trong ${total} dữ liệu`
        }
        pageSize={pageSize}
        current={pageIndex}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
        size="small"
        showSizeChanger
        style={{ textAlign: "right", marginTop: 16 }}
      />
    </>
  );
};

export default TableStatus;
