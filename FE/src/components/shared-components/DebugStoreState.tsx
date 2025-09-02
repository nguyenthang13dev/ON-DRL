import React from 'react';
import { useSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { Card, Typography, Collapse } from 'antd';

const { Title, Text, Paragraph } = Typography;

/**
 * Component Debug để kiểm tra trạng thái Redux store
 */
export const DebugStoreState: React.FC = () => {
  // Lấy toàn bộ state từ store
  const fullState = useSelector((state: RootState) => state);
  
  // Lấy từng phần riêng biệt
  const authState = useSelector((state: RootState) => state?.auth);
  const menuState = useSelector((state: RootState) => state?.menu);
  const permissionState = useSelector((state: RootState) => state?.permission);

  const items = [
    {
      key: '1',
      label: 'Auth State',
      children: (
        <div>
          <Paragraph>
            <Text strong>Auth State exists: </Text>
            <Text type={authState ? 'success' : 'danger'}>
              {authState ? 'Yes' : 'No'}
            </Text>
          </Paragraph>
          {authState && (
            <>
              <Paragraph>
                <Text strong>User: </Text>
                <Text>{authState.User ? JSON.stringify(authState.User, null, 2) : 'null'}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>ListRole: </Text>
                <Text>{authState.ListRole ? JSON.stringify(authState.ListRole, null, 2) : 'null'}</Text>
              </Paragraph>
              <Paragraph>
                <Text strong>AccessToken: </Text>
                <Text>{authState.AccessToken ? 'Exists' : 'null'}</Text>
              </Paragraph>
            </>
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: 'Menu State',
      children: (
        <div>
          <Paragraph>
            <Text strong>Menu State exists: </Text>
            <Text type={menuState ? 'success' : 'danger'}>
              {menuState ? 'Yes' : 'No'}
            </Text>
          </Paragraph>
          {menuState && (
            <Paragraph>
              <Text strong>MenuData: </Text>
              <Text>{menuState.menuData ? JSON.stringify(menuState.menuData, null, 2) : 'null'}</Text>
            </Paragraph>
          )}
        </div>
      ),
    },
    {
      key: '3',
      label: 'Permission State',
      children: (
        <div>
          <Paragraph>
            <Text strong>Permission State exists: </Text>
            <Text type={permissionState ? 'success' : 'danger'}>
              {permissionState ? 'Yes' : 'No'}
            </Text>
          </Paragraph>
          {permissionState && (
            <Paragraph>
              <Text strong>Permissions: </Text>
              <Text>{permissionState.permissions ? JSON.stringify(permissionState.permissions, null, 2) : 'null'}</Text>
            </Paragraph>
          )}
        </div>
      ),
    },
    {
      key: '4',
      label: 'Full State Structure',
      children: (
        <div>
          <Paragraph>
            <Text strong>Available Keys: </Text>
            <Text>{Object.keys(fullState || {}).join(', ')}</Text>
          </Paragraph>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
            {JSON.stringify(fullState, null, 2)}
          </pre>
        </div>
      ),
    },
  ];

  return (
    <Card title="Redux Store Debug Information" style={{ margin: '20px 0' }}>
      <Title level={4}>Store State Debug</Title>
      <Paragraph>
        Use this component to debug Redux store state issues. 
        Remove this component in production.
      </Paragraph>
      
      <Collapse items={items} />
    </Card>
  );
};

export default DebugStoreState;
