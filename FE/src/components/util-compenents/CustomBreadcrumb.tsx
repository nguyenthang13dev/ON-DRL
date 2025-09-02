import { Breadcrumb } from 'antd';
import Link from 'next/link';
import React from 'react';
import styles from './CustomBreadcrumb.module.css';

export type CustomBreadcrumbItem = {
  label: string;
  href?: string;
  isActive?: boolean;
};

interface CustomBreadcrumbProps {
  items: CustomBreadcrumbItem[];
  className?: string;
}

const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({ items, className }) => {
  const breadcrumbItems = items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    return {
      title: item.href && !isLast ? (
        <Link href={item.href}>{item.label}</Link>
      ) : (
        <span style={isLast ? { color: 'var(--color-primary)', fontWeight: 600 } : {}}>{item.label}</span>
      ),
    };
  });

  return (
    <div className={`${styles['custom-breadcrumb']} ${className || ''}`}>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default CustomBreadcrumb;
