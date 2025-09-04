import { MenuProps } from "antd";
import React from 'react';
import usePermissionHelper from "./PermissionHelper";

interface ActionWrapperProps {
    children: React.ReactNode;
    moduleCode: string;
    operation?: string;
    businessRule?: boolean;
    fallback?: React.ReactNode;
}
export const PermissionWrapper: React.FC<ActionWrapperProps> = ({
    children,
    moduleCode,
    operation = '',
    businessRule = true,
    fallback = null
}) => {
    const {
        hasPermission,
        isAuthenticated,
    } = usePermissionHelper();



    if (isAuthenticated()) {
        // Kiểm tra quyền truy cập theo moduleCode và operation
        console.log(operation);
        
    
        if ( hasPermission( moduleCode, operation ) && businessRule )
        {
            return <>{children}</>;
        } else if (fallback) {
            return <>{fallback}</>;
        } else {
            return false; // Không có quyền và không có fallback
        }
    }
    return false;
};

export const PermissionWrapperPage: React.FC<ActionWrapperProps> = ({
    children,
    moduleCode,
    operation = '',
    businessRule = false,
    fallback = null
}) => {
    const {
        hasPermission,
        isAuthenticated,
    } = usePermissionHelper();

    const errorHtml = (
        <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            border: '1px dashed #d9d9d9'
        }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
            <h3 style={{ color: '#8c8c8c', marginBottom: '8px' }}>Không có quyền truy cập</h3>
            <p style={{ color: '#bfbfbf', margin: 0 }}>
                Bạn không có quyền truy cập vào module <strong>{moduleCode}</strong>
            </p>
        </div>
    );

    if (isAuthenticated()) {
        // Kiểm tra quyền truy cập theo moduleCode và operation
        if (hasPermission(moduleCode, operation) && businessRule) {
            return <>{children}</>;
        } else if (fallback) {
            return <>{fallback}</>;
        } else {
            return errorHtml; // Không có quyền và không có fallback
        }
    }
    if (fallback) {
        return <>{fallback}</>;
    }
    return errorHtml;
};


type ActionItem = {
    operation: string;
    label: string;
    icon?: React.ReactNode;
    key?: string;
    danger?: true;
    businessRule?: (record: any) => boolean | true;
    func: (record: any) => void;
}

type MenuItemProps = {
    moduleCode: string,
    actionItems: ActionItem[]
}


export const useBuildMenuItems = ({ moduleCode, actionItems }: MenuItemProps): MenuProps["items"] => {
    const { hasPermission } = usePermissionHelper();

    return React.useMemo(() => {
        const items: MenuProps["items"] = [];

        actionItems.forEach((item, idx) => {
            items.push({
                key: item.key ?? item.operation,
                danger: item.danger,
                icon: item.icon,
                label: item.label,
                onClick: () => item.func(item),
                disabled: !hasPermission(moduleCode, item.operation) ,
            });
            if (idx < actionItems.length - 1) {
                items.push({ type: "divider" });
            }
        });

        return items;
    }, [moduleCode, actionItems, hasPermission]);
};


