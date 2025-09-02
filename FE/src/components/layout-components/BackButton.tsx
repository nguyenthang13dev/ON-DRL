'use client';
import { SwapLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BackButton = ({ className }: { className?: string }) => {
  const router = useRouter();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory((prev) => [...prev, window.location.pathname]);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.go(-1);
    } else {
      window.location.href = '/';
    }
  };
  return (
    <Button
      icon={<SwapLeftOutlined />}
      size="small"
      variant="outlined"
      color="primary"
      className={className}
      onClick={handleBack}
    >
      Trở về
    </Button>
  );
};

export default BackButton;
