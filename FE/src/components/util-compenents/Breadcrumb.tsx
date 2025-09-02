import { operationService } from '@/services/operation/operation.service';
import { CalendarOutlined } from '@ant-design/icons';
import { Breadcrumb, Calendar } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from '@/store/hooks';

const weekdays = [
  'Chủ nhật',
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
];
const today = dayjs();



type BreadcrumbData = {
  operationName : string,
  operationUrl : string,
  moduleName : string,
  ModuleIcon : string,
};

const AutoBreadcrumb = () => {
  const [breadcrumbData, setBreadcrumbData] = useState<BreadcrumbData | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  // const user = useSelector((state) => state.auth.User);

  const handleBuildBreadcrumb = () => {
    const items = [
      {
        title: <Link href="/dashboard">Trang chủ</Link>,
      },
    ];

    if (breadcrumbData?.moduleName) {
      items.push({
        title: <Link href="#">{breadcrumbData.moduleName}</Link>,
      });
    }

    if (breadcrumbData?.operationName) {
      items.push({
        title: <Link href={breadcrumbData.operationUrl}>{breadcrumbData.operationName}</Link>,
      });
    }

    // Highlight the last item
    if (items.length > 1) {
      const lastItem = items[items.length - 1];
      items[items.length - 1] = {
        title: (
            <Link
                href={(lastItem.title as any).props.href}
                style={{ color: 'var(--color-primary)' }}
            >
              {(lastItem.title as any).props.children}
            </Link>
        ),
      };
    }

    return items;
  };


  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  useEffect(() => {
    const pathName = window.location.pathname;

    operationService
        .GetBreadcrumb(pathName)
        .then((res) => {
          if (res.status) {
            setBreadcrumbData(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
  }, []);

  return (
      <div className="w-full flex justify-between align-items-center pb-2 border-b border-gray-300 mb-2 relative z-10">
        <Breadcrumb items={handleBuildBreadcrumb()} />
        {/* <span className="uppercase font-bold">{user?.tenDonVi_txt}</span> */}
        <span className="cursor-pointer hover:underline" onClick={toggleCalendar}>
        <CalendarOutlined /> {weekdays[today.day()]} ngày{' '}
          {today.format('DD/MM/YYYY')}
      </span>
        {showCalendar && (
            <div className="w-[300px] absolute top-[30px] right-0">
              <Calendar fullscreen={false} className="rounded-lg shadow-lg" />
            </div>
        )}
      </div>
  );
};

export default AutoBreadcrumb;