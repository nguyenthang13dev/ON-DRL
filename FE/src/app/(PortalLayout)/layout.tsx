"use client";
import { HeaderNav } from "@/components/layout-components/HeaderNav";
import { SideNav } from "@/components/layout-components/SideNav";
import { MEDIA_QUERIES, TEMPLATE } from "@/constants/ThemeConstant";
import { useSelector } from "@/store/hooks";
import utils from "@/utils";
import styled from "@emotion/styled";
import { ConfigProvider, Grid, Layout } from "antd";

import "@/app/assets/css/global.css";
import "./layout.css";
import "react-toastify/dist/ReactToastify.css";

import Loading from "@/components/shared-components/Loading";
import { authService } from "@/services/auth/auth.service";
import { setUserInfo } from "@/store/auth/AuthSlice";
import { setMenuData } from "@/store/menu/MenuSlice";
import { AppDispatch } from "@/store/store";
import { UserType } from "@/types/auth/User";
import { MenuDataType } from "@/types/menu/menu";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-cube";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toggleSidebar } from "@/store/customizer/CustomizerSlice";
import themConfig from "../(DashboardLayout)/theme.config";
import { HeaderPublic } from "@/components/layout-components/HeaderPublic";

dayjs.locale("vi");

const { useBreakpoint } = Grid;
const { Content } = Layout;

const AppContent = styled("div")`
  padding: ${TEMPLATE.LAYOUT_CONTENT_GUTTER}px;
  margin-top: ${TEMPLATE.HEADER_HEIGHT}px;
  min-height: calc(100vh - 126px);
  position: relative;

  @media ${MEDIA_QUERIES.MOBILE} {
    padding: ${TEMPLATE.LAYOUT_CONTENT_GUTTER_SM}px;
    padding-left: 0; // Thêm dòng này để loại bỏ padding trái trên mobile
    padding-right: 0; // Loại bỏ padding phải trên mobile
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state) => state.general.isLoading);
  const pathname = usePathname();
  const navCollapsed = useSelector((state) => state.customizer.isCollapse);
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = screens.length === 0 ? false : !screens.includes("lg");
  const userInfo: UserType | null = useSelector((state) => state.auth.User);
  const menuData: MenuDataType[] | null = useSelector(
    (state) => state.menu.menuData
  );

  const getLayoutGutter = () => {
    if (isMobile) {
      return 0; // Sửa từ 80 xuống 0 cho mobile
    }
    return navCollapsed
      ? TEMPLATE.SIDE_NAV_COLLAPSED_WIDTH
      : TEMPLATE.SIDE_NAV_WIDTH;
  };

  const getLayoutDirectionGutter = () => {
    return { paddingLeft: getLayoutGutter() };
  };

  // ... giữ nguyên các hàm khác ...

  return (
    <ConfigProvider locale={locale} theme={themConfig}>
      <Layout style={{ overflowX: "hidden" }}>
        {" "}
        {/* Thêm overflowX: hidden */}
        <ToastContainer />
        <HeaderPublic />
        <Layout style={getLayoutDirectionGutter()}>
          <AppContent>
            <Content className="h-100">
              <Suspense fallback={<Loading content="content" />}>
                {children}
              </Suspense>
            </Content>
          </AppContent>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
