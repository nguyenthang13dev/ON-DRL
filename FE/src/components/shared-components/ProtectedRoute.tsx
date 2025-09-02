import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { isUserAuthenticated, clearExpiredToken } from '@/utils/authUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        if (isUserAuthenticated()) {
          setIsAuthenticated(true);
        } else {
          // Xóa token hết hạn và redirect về login
          clearExpiredToken();
          router.replace('/auth/login');
          return;
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        clearExpiredToken();
        router.replace('/auth/login');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [router]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Hoặc có thể return một loading spinner khác
  }

  return <>{children}</>;
};

export default ProtectedRoute;
