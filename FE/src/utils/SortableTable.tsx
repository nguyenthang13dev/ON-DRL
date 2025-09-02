import React, {useEffect, useState} from "react";
import {CaretDownOutlined, CaretUpOutlined} from "@ant-design/icons";

const SortIconSVG = () => (
    <svg
        width="22px"
        height="22px"
        viewBox="0 0 20 20"
        // fill="none"
        // style={{ fontSize: '14px' }}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8 10L12 6L16 10M8 14L12 18L16 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// Custom hook for table sorting
export const useSortableTable = <T, >(initialData: T[]) => {
    const [data, setData] = useState<T[]>(initialData);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T | null;
        direction: 'asc' | 'desc' | null;
    }>({
        key: null,
        direction: null,
    });

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const requestSort = (key: keyof T) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            // Reset sorting
            setSortConfig({key: null, direction: null});
            setData([...initialData]);
            return;
        }

        setSortConfig({key, direction});

        const sortedData = [...data].sort((a, b) => {
            // Handle null or undefined values
            if (a[key] === null || a[key] === undefined) return 1;
            if (b[key] === null || b[key] === undefined) return -1;

            // Handle string comparison
            if (typeof a[key] === 'string' && typeof b[key] === 'string') {
                return direction === 'asc'
                    ? (a[key] as string).localeCompare(b[key] as string)
                    : (b[key] as string).localeCompare(a[key] as string);
            }

            // Handle number comparison
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setData(sortedData);
    };

    return {data, requestSort, sortConfig};
};

// Separate sortable header component for better reusability

export const SortableHeader = <T, >({
                                        column,
                                        label,
                                        className = "",
                                        style,
                                        rowSpan,
                                        colSpan,
                                        sortConfig,
                                        requestSort,
                                        customSortIcon,
                                        children,
                                        isSearching = false,
                                    }: {
    column: keyof T;
    label?: string;
    className?: string;
    style?: React.CSSProperties;
    rowSpan?: number;
    colSpan?: number;
    sortConfig: { key: keyof T | null; direction: 'asc' | 'desc' | null };
    requestSort: (key: keyof T) => void;
    customSortIcon?: {
        asc?: React.ReactNode;
        desc?: React.ReactNode;
    };
    children?: React.ReactNode;
    isSearching?: boolean;
}) => {
    const renderSortIcon = () => {
        if (!sortConfig.key || sortConfig.key !== column) {
            // When column is not being sorted
            return isSearching ? (
                <span style={{width: '14px', display: 'inline-block'}}></span>
            ) : (
                <SortIconSVG/>
            );
        }

        // When column is being sorted
        if (sortConfig.direction === 'asc') {
            return customSortIcon?.asc || <CaretUpOutlined style={{fontSize: '14px'}}/>;
        } else {
            return customSortIcon?.desc || <CaretDownOutlined style={{fontSize: '14px'}}/>;
        }
    };

    return (
        <th
            className={`${className} cursor-pointer hover:bg-gray-100`}
            onClick={() => requestSort(column)}
            rowSpan={rowSpan}
            colSpan={colSpan}
            style={style}
        >
            <div className="flex items-center justify-center gap-1">
                {label || children}
                <span style={{
                    width: '14px',
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {renderSortIcon()}
                </span>
            </div>
        </th>
    );
};