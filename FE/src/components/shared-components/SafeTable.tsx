import React from 'react';
import { Table, TableProps } from 'antd';

interface SafeTableProps<T = any> extends TableProps<T> {
  fallback?: React.ReactNode;
}

/**
 * Safe Table component với error handling
 */
const SafeTable = <T extends Record<string, any> = any>({
  fallback,
  ...tableProps
}: SafeTableProps<T>) => {
  const [hasError, setHasError] = React.useState(false);

  // Reset error state khi props thay đổi
  React.useEffect(() => {
    setHasError(false);
  }, [tableProps.dataSource, tableProps.columns]);

  try {
    if (hasError) {
      return fallback || <div>Đã xảy ra lỗi khi hiển thị bảng</div>;
    }

    return <Table {...tableProps} />;
  } catch (error) {
    console.error('SafeTable error:', error);
    setHasError(true);
    return fallback || <div>Đã xảy ra lỗi khi hiển thị bảng</div>;
  }
};

export default SafeTable;
