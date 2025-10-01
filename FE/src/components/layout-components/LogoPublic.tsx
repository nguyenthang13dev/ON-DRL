import React from "react";
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_TYPE_TOP,
} from "@/constants/ThemeConstant";
import { APP_NAME } from "@/configs/AppConfig";
import utils from "@/utils";
import { Grid, Image } from "antd";
import styled from "@emotion/styled";
import { TEMPLATE } from "@/constants/ThemeConstant";
import { useSelector } from "@/store/hooks";
import Link from "next/link";

const LogoWrapper = styled.div(() => ({
  height: TEMPLATE.HEADER_HEIGHT,
  display: "flex",
  alignItems: "center",
  padding: "0 1rem",
  backgroundColor: "transparent",
  transition: "all .2s ease",
}));

const { useBreakpoint } = Grid;

interface LogoProps {
  mobileLogo?: boolean;
  logoType: "light" | "default";
}

// Component Logo
export const LogoPublic: React.FC<LogoProps> = ({ mobileLogo, logoType }) => {
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes("lg");

  const navCollapsed = useSelector((state) => state.customizer.isCollapse);
  const navType = useSelector((state) => state.customizer.navType);

  const getLogoWidthGutter = (): string | number => {
    const isNavTop = navType === NAV_TYPE_TOP;

    if (isMobile && !mobileLogo) {
      return 0;
    }
    if (isNavTop) {
      return "auto";
    }
    if (navCollapsed) {
      return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
    } else {
      return `${SIDE_NAV_WIDTH}px`;
    }
  };

  const getLogo = (): string => {
    // if (logoType === 'light') {
    //   if (navCollapsed) {
    //     return '/img/hinet.png';
    //   }
    //   return '/img/hinet.png';
    // }

    if (navCollapsed) {
      return "/img/logo-sm.png";
    }
    return "/img/logo.png";
  };
  return (
    <LogoWrapper>
      <Link href="/home" className="flex items-center shrink-0">
        <Image
          src={getLogo()}
          alt={`${APP_NAME} logo`}
          preview={false}
          width={isMobile ? 120 : undefined}
          height={isMobile ? 40 : undefined}
          style={{
            maxHeight: isMobile ? `${TEMPLATE.HEADER_HEIGHT - 10}px` : "100%",
            objectFit: "contain",
          }}
        />
        {/* HIỂN THỊ TEXT CHỈ TRÊN DESKTOP */}
        {!isMobile && (
          <div
            style={{
              lineHeight: "28px",
              fontSize: "20px",
              marginLeft: "8px",
            }}
            className="font-bold uppercase text-black leading-4.5 w-full text-center font-sans tracking-tight"
          >
            HINET- EMS <br />
            Trust to success
          </div>
        )}
      </Link>
    </LogoWrapper>
  );
};

export default LogoPublic;
