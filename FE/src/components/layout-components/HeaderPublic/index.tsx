'use client';
import {
  NAV_TYPE_TOP,
} from '@/constants/ThemeConstant';
import { useSelector } from '@/store/hooks';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { Menu, Drawer, Button, Grid } from 'antd';
import { useState } from 'react';
import LogoPublic from '../LogoPublic';
import Link from 'next/link';
import { MenuOutlined } from '@ant-design/icons';
import HeaderClient from './HeaderClient';
import HeaderWrapper from '../HeaderNav/HeaderWrapper';

const { useBreakpoint } = Grid;

export const HeaderPublic = () => {
  const dispatch = useDispatch<AppDispatch>();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  const headerNavColor = useSelector((state) => state.customizer.topNavColor);
  const navMode = 'light';

  const [currentMenu, setCurrentMenu] = useState('home');
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const menuItems = [
    { key: 'gioithieu', label: 'GioiThieu' },
    { key: 'sanpham', label: 'SANPHAM&GIAIPHAP' },
    { key: 'dichvu', label: 'DICHVU~' },
    { key: 'khachhang', label: 'KHACHHANG~' },
    { key: 'tintuc', label: 'TINTUC~' },
    { key: 'tuyenDung', label: 'TUYENDUNG' },
    { key: 'lienhe', label: 'LIENHE' },
  ];

  const handleMenuClick = (e: any) => {
    setCurrentMenu(e.key);
    setMobileMenuVisible(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <HeaderClient headerNavColor="#fff" className="border-b border-gray-300">
       <HeaderWrapper>
        <div className="flex items-center justify-between w-full">
          {/* Phần bên trái (logo trên desktop) */}
          <div className="hidden md:block">
            <LogoPublic logoType={navMode} />
          </div>
          
          {/* Menu desktop - Căn giữa */}
          <div className="hidden md:flex flex-1 justify-center mx-8">
            <Menu
              mode="horizontal"
              selectedKeys={[currentMenu]}
              onClick={handleMenuClick}
              className="w-full border-0"
              style={{ lineHeight: '64px', borderBottom: 'none' }}
            >
              {menuItems.map((item) => (
                <Menu.Item 
                  key={item.key} 
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  <Link href={`/${item.key}`}>{item.label}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </div>
          
          {/* Phần bên phải (cho các icon khác) */}
          <div className="hidden md:flex items-center gap-4 w-12">
            {/* Có thể thêm các icon khác ở đây nếu cần */}
          </div>
          
          {/* Mobile: Nút menu và logo căn giữa */}
          {isMobile && (
            <>
              <Button 
                type="text"
                icon={<MenuOutlined style={{ fontSize: '20px' }} />}
                onClick={toggleMobileMenu}
                className="flex items-center justify-center z-10"
                style={{ width: '48px', height: '48px' }}
              />
              
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <LogoPublic logoType={navMode} mobileLogo={true} />
              </div>
            </>
          )}
        </div>
      </HeaderWrapper>
      {/* Drawer cho menu mobile */}
      <Drawer
        title="Menu"
        placement="right"
        closable={true}
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[currentMenu]}
          onClick={handleMenuClick}
          style={{ borderRight: 'none' }}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} style={{ padding: '16px 24px' }}>
              <Link href={`/${item.key}`}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>
    </HeaderClient>
  );
};