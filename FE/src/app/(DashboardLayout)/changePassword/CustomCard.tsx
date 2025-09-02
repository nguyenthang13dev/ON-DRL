import {Spin} from 'antd';
import React, {ReactNode} from 'react';

interface CustomCardProps {
    title?: string | null;
    children?: React.ReactNode | null;
    className?: string | null;
    icon?: ReactNode | null;
    menuBar?: React.ReactNode | null;
    loading?: boolean;
}

const CustomCard: React.FC<CustomCardProps> = ({
                                                   title,
                                                   children,
                                                   className,
                                                   icon,
                                                   menuBar,
                                                   loading = false,
                                               }) => {
    return (
        <>
            <div
                className={`rounded-lg w-full border border-slate-200 mb-2 bg-white shadow-md ${className}`}
            >
                {title && (
                    <div className="border-b border-rose-300 p-2.5 text-base flex items-center bg-gradient-to-r from-rose-500 to-rose-700 text-white rounded-t-lg shadow-sm">
                        <span className="uppercase font-medium tracking-wide flex items-center">
                            {React.cloneElement(icon as React.ReactElement, {
                                className: "text-yellow-200 mr-2 text-lg"
                            })}
                            {loading ? 'Đang tải dữ liệu' : title}
                        </span>
                        <div className="ml-auto">{menuBar}</div>
                    </div>
                )}
                {loading ? (
                    <div className="h-40 flex justify-center items-center">
                        <Spin />
                        <div>Đang tải dữ liệu</div>
                    </div>
                ) : (
                    <div className="p-4">{children}</div>
                )}
            </div>
        </>
    );
};

export default CustomCard;