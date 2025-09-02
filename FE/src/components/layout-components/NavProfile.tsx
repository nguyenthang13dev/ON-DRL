import React from 'react';
import { Dropdown, Avatar, MenuProps } from 'antd';
import { useDispatch } from 'react-redux';
import {
  EditOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  LockOutlined,
  KeyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import NavItem from './NavItem';
import Flex from '@/components/shared-components/Flex';
import styled from '@emotion/styled';
import {
  FONT_WEIGHT,
  MEDIA_QUERIES,
  SPACER,
  FONT_SIZES,
} from '@/constants/ThemeConstant';
import { AppDispatch } from '@/store/store';
import { setLogout } from '@/store/auth/AuthSlice';
import { useRouter } from 'next/navigation';
import { useSelector } from '@/store/hooks';
import { resetMenuData } from '@/store/menu/MenuSlice';

// Styled components
const Icon = styled.div(() => ({
  fontSize: FONT_SIZES.LG,
}));

const Profile = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const UserInfo = styled('div')`
  padding-left: ${SPACER[2]};

  @media ${MEDIA_QUERIES.MOBILE} {
    display: none;
  }
`;

const Name = styled.div(() => ({
  fontWeight: FONT_WEIGHT.SEMIBOLD,
}));

const Title = styled.span(() => ({
  opacity: 0.8,
}));

interface MenuItemProps {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface MenuItemSignOutProps {
  label: string;
}

// const MenuItem: React.FC<MenuItemProps> = ({ label, icon }) => (
//   <Flex as="a" alignItems="center" gap={SPACER[2]}>
//     <Icon>{icon}</Icon>
//     <span>{label}</span>
//   </Flex>
// );
const MenuItem: React.FC<MenuItemProps> = ({ label, icon, path }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(path); // Điều hướng đến path
  };

  return (
    <Flex
      as="a"
      alignItems="center"
      gap={2}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <Icon>{icon}</Icon>
      <span>{label}</span>
    </Flex>
  );
};

const MenuItemSignOut: React.FC<MenuItemSignOutProps> = ({ label }) => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRouter();

  const handleSignOut = () => {
    dispatch(setLogout());
    dispatch(resetMenuData());
    route.push('/auth/login');
  };

  return (
    <div onClick={handleSignOut}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <LogoutOutlined />
        </Icon>
        <span>{label}</span>
      </Flex>
    </div>
  );
};

const items: MenuProps['items'] = [
  {
    key: 'Profile',
    label: (
      <MenuItem
        path="/profile"
        label="Thông tin cá nhân"
        icon={<UserOutlined />}
      />
    ),
  },
  {
    key: 'Change Password',
    label: (
      <MenuItem
        path="/changePassword"
        label="Đổi mật khẩu"
        icon={<KeyOutlined />}
      ></MenuItem>
    ),
  },
  {
    key: 'LinkAccount',
    label: (
      <MenuItem
        path="/profile/link-account"
        label="Liên kết tài khoản"
        icon={<SettingOutlined />}
      />
    ),
  },
  {
    key: 'Đăng xuất',
    label: <MenuItemSignOut label="Đăng xuất" />,
  },
];

export const NavProfile: React.FC = () => {
  const user = useSelector((state) => state.auth.User);
  const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;
  return (
    <Dropdown
      placement="bottomRight"
      menu={{ items }}
      trigger={['click']}
      className="shrink-0 p-0 pr-2"
    >
      <NavItem>
        <Profile>
          <Avatar
            src={
              `${StaticFileUrl}${user?.picture ?? ''}` ||
              '/img/avatars/thumb-12.jpg'
            }
          />
          <UserInfo className="profile-text flex items-center">
            <Name className="!text-gray-600 max-w-30 truncate">
              {user?.name}
            </Name>
            <div>
              <DownOutlined className="!text-gray-600 !text-[10px]" />
            </div>
          </UserInfo>
        </Profile>
      </NavItem>
    </Dropdown>
  );
};

export default NavProfile;
