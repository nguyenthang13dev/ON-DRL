"use client";
import
  {
    ArrowLeftOutlined
  } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import React, { useCallback, useState } from 'react';
import ModernProviderSelection from './ModernProviderSelection';

const { Title, Text } = Typography;

type ViewMode = 'selection' | 'telegram';

interface LinkAccountInterfaceProps {
  onBack?: () => void;
  className?: string;
}

const LinkAccountInterface: React.FC<LinkAccountInterfaceProps> = ({
  onBack,
  className = ''
}) => {
  const [currentView, setCurrentView] = useState<ViewMode>('selection');

  // Handle provider selection
  const handleProviderSelect = useCallback((providerId: string) => {
    switch (providerId) {
      case 'telegram':
        setCurrentView('telegram');
        break;
      default:
        // Handle other providers when they become available
        break;
    }
  }, []);

  // Handle back to provider selection
  const handleBackToSelection = useCallback(() => {
    setCurrentView('selection');
  }, []);

  const renderHeader = () => {
    if (currentView !== 'selection') {
      return null; // Child components handle their own headers
    }

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={onBack}
                type="text"
                className="text-[#2A5DA3] hover:bg-blue-50"
              >
                Quay lại
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'telegram':
        return (
          <></>
        );
      
      case 'selection':
      default:
        return (
          <ModernProviderSelection
            onProviderSelect={handleProviderSelect}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 py-8 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {renderHeader()}
        {renderContent()}
      </div>
    </div>
  );
};

export default LinkAccountInterface;
