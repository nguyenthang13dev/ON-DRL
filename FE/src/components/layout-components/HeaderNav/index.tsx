'use client';
import {
  NAV_TYPE_TOP,
  SIDE_NAV_COLLAPSED_WIDTH,
  SIDE_NAV_WIDTH,
} from '@/constants/ThemeConstant';
import {
  toggleMobileSidebar,
  toggleSidebar,
} from '@/store/customizer/CustomizerSlice';
import { useSelector } from '@/store/hooks';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import Logo from '../Logo';
import NavHDSD from '../NavHDSD';
import NavNotification from '../NavNotification';
import NavProfile from '../NavProfile';
import NavSearch from '../NavSearch';
import Header from './Header';
import HeaderWrapper from './HeaderWrapper';

export const HeaderNav = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navCollapsed = useSelector((state) => state.customizer.isCollapse);
  const isMobile = useSelector((state) => state.customizer.isMobile);
  const headerNavColor = useSelector((state) => state.customizer.topNavColor);
  const navType = useSelector((state) => state.customizer.navType);
  const isNavTop = navType === NAV_TYPE_TOP;
  const navBgColor = useSelector((state) => state.customizer.topNavColor);
  const navMode = 'light';

  const getNavWidth = () => {
    if (isNavTop || isMobile) {
      return '0px';
    }
    if (navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
    } else {
      return `${SIDE_NAV_WIDTH}px`;
    }
  };
  const onToggle = () => {
    if (!isMobile) {
      dispatch(toggleSidebar());
    } else {
      dispatch(toggleMobileSidebar());
    }
  };
  return (
    <Header headerNavColor="#fff" className="border-b border-gray-300">
      <HeaderWrapper>
        <Logo logoType={navMode} />
        <div className="flex gap-2 items-center grow">
          <div className="w-full">
            <NavSearch className="!w-3/4 m-auto"></NavSearch>
          </div>
          <NavHDSD></NavHDSD>
          <NavNotification />
          <NavProfile />
        </div>
      </HeaderWrapper>
    </Header>
  );
};
