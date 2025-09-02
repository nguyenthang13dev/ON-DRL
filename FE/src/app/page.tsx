"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isUserAuthenticated, clearExpiredToken } from "@/utils/authUtils";
import { Spin } from "antd";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = () => {
      try {
        if (isUserAuthenticated()) {
          // Nếu user đã đăng nhập và token còn hạn, redirect về dashboard
          router.replace("/dashboard");
        } else {
          // Xóa token hết hạn (nếu có) và redirect về login
          clearExpiredToken();
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        // Trong trường hợp lỗi, mặc định redirect về login
        clearExpiredToken();
        router.replace("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    // Delay nhỏ để tránh flash
    const timeoutId = setTimeout(handleRedirect, 100);
    
    return () => clearTimeout(timeoutId);
  }, [router]);

  // Hiển thị loading spinner trong khi đang kiểm tra authentication
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

  return null;
}
