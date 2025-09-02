'use client';
import Flex from '@/components/shared-components/Flex';
import AutoBreadcrumb from '@/components/util-compenents/Breadcrumb';
import withAuthorization from '@/libs/authentication';
import { notificationService } from '@/services/notification/notification.service';
import { setIsLoading } from '@/store/general/GeneralSlice';
import { useSelector } from '@/store/hooks';
import { AppDispatch } from '@/store/store';
import { ResponsePageList } from '@/types/general';
import {
  NotificationSearch,
  NotificationUser,
} from '@/types/notification/notification';
import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Dropdown,
  FormProps,
  MenuProps,
  Pagination,
  Space,
  Table,
  TableProps,
} from 'antd';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Search from '../Search';
import { useRouter } from 'next/navigation';

const NotificationUserPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<ResponsePageList<NotificationUser[]>>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<NotificationSearch | null>(
    null
  );
  const loading = useSelector((state) => state.general.isLoading);

  const handleOpenNotificationLink = async (id: string, link: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
    } finally {
      router.push(link);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await notificationService.markAsRead(id);
      if (response && response.status) {
        handleLoadData();
      }
    } catch (error) {}
  };

  const tableColumns: TableProps<NotificationUser>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: 50,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tin nhắn',
      dataIndex: 'message',
      key: 'message',
      render: (_: any, record: NotificationUser) => (
        <>
          {record.isRead ? (
            <Badge key={record.id} color="green" />
          ) : (
            <Badge key={record.id} color="red" />
          )}{' '}
          <Link
            href={record?.link ?? '#'}
            onClick={(e) => {
              e.preventDefault();
              handleOpenNotificationLink(record.id, record.link ?? '');
            }}
          >
            {record.message}
          </Link>
        </>
      ),
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      width: 50,
      render: (_: any, record: NotificationUser) => {
        const items: MenuProps['items'] = [
          {
            label: 'Đánh dấu là đã đọc',
            key: '1',
            icon: <CheckOutlined />,
            onClick: () => markAsRead(record.id),
          },
        ];
        return (
          <>
            <Dropdown menu={{ items }} trigger={['click']}>
              <Button
                onClick={(e) => e.preventDefault()}
                color="primary"
                size="small"
              >
                <Space>
                  Thao tác
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </>
        );
      },
    },
  ];

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<NotificationSearch>['onFinish'] = async (
    values
  ) => {
    try {
      setSearchValues(values);
      await handleLoadData(values);
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  const handleLoadData = useCallback(
    async (searchDataOverride?: NotificationSearch) => {
      dispatch(setIsLoading(true));

      const searchData = searchDataOverride || {
        pageIndex,
        pageSize,
        ...(searchValues || {}),
      };
      const response = await notificationService.getDataByUser(searchData);
      if (response != null && response.data != null) {
        const data = response.data;
        setData(data);
      }
      dispatch(setIsLoading(false));
    },
    [dispatch, pageIndex, pageSize, searchValues]
  );

  useEffect(() => {
    handleLoadData();
  }, []);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"
      >
        <AutoBreadcrumb />
        <div className="btn-group">
          <Button
            onClick={() => toggleSearch()}
            type="primary"
            size="small"
            icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
          >
            {isPanelVisible ? 'Ẩn tìm kiếm' : 'Tìm kiếm'}
          </Button>
        </div>
      </Flex>
      {isPanelVisible && <Search handleSearch={onFinishSearch} />}
      <Card className={'customCardShadow'}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={data?.items}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={false}
            loading={loading}
          />
        </div>
        <Pagination
          className="mt-2"
          total={data?.totalCount}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} trong ${total} dữ liệu`
          }
          pageSize={pageSize}
          defaultCurrent={1}
          onChange={(e) => {
            setPageIndex(e);
          }}
          onShowSizeChange={(current, pageSize) => {
            setPageIndex(current);
            setPageSize(pageSize);
          }}
          size="small"
          align="end"
        />
      </Card>
    </>
  );
};

export default withAuthorization(NotificationUserPage, '');
