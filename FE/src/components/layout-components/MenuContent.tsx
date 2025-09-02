import { useDispatch, useSelector } from "@/store/hooks";
import { Grid, Image, Menu } from "antd";
import utils from "@/utils";
import { setIsMobile } from "@/store/customizer/CustomizerSlice";
import Link from "next/link";
import React, { ReactNode, useMemo } from "react";
import { MenuDataType } from "@/types/menu/menu";
import { MenuItemType } from "antd/es/menu/interface";
import * as Icons from "@ant-design/icons";
const { useBreakpoint } = Grid;

const setDefaultOpen = (key?: string): string[] => {
  if (!key) return [];
  const arr = key.split("-");
  const keyList: string[] = [];
  let keyString = "";
  arr.forEach((elm, index) => {
    keyString = index === 0 ? elm : `${keyString}-${elm}`;
    keyList.push(keyString);
  });
  return keyList;
};

type MenuItemProps = {
  title: string;
  icon?: ReactNode;
  path?: string;
  isSubMenu?: boolean;
};

const getAntdIconByName = (iconString: string) => {
  if (!iconString) return <Icons.SettingOutlined />;
  const match = iconString.match(/<(\w+)\s*\/>/);
  const iconName = match ? match[1] : null;
  if (!iconName) return <Icons.SettingOutlined />;
  const IconComponent = (Icons as any)[iconName];
  return IconComponent ? <IconComponent /> : <Icons.QuestionOutlined />;
};

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  icon,
  path,
  isSubMenu,
}) => {
  const dispatch = useDispatch();
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes("lg");
  // const navCollapsed = useSelector((state) => state.customizer.isCollapse);

  const closeMobileNav = () => {
    if (isMobile) {
      dispatch(setIsMobile(false));
    }
  };

  return (
    <>
      {/* {icon && icon} */}
      <span>
        {isSubMenu ? (
          <span style={{ fontWeight: "400" }}>{title}</span>
        ) : (
          <span style={{ fontWeight: "600" }}>{title}</span>
        )}
      </span>

      {path && <Link onClick={closeMobileNav} href={path} />}
    </>
  );
};

const getSideNavMenuItem = (
  navItem: MenuDataType[],
  isSubMenu: boolean = false,
  navCollapsed?: boolean
): MenuItemType[] => {
  return navItem
    .filter((x) => x.isAccess && x.isAccess == true)
    .map((nav: MenuDataType) => ({
      key: nav.id,
      icon: !isSubMenu ? (
        nav.classCss ? (
          getAntdIconByName(nav.classCss)
        ) : (
          <Icons.SettingOutlined />
        )
      ) : (
        // <MinusOutlined />
        <></>
      ),
      label: (
        <MenuItem
          title={nav.name || ""}
          {...(!nav.listMenu || nav.listMenu.length == 0
            ? { icon: nav.icon }
            : {})}
          {...(!nav.listMenu || nav.listMenu.length == 0
            ? { path: nav.url }
            : {})}
          isSubMenu={isSubMenu}
        />
      ),
      ...(nav.listMenu && nav.listMenu.length > 0
        ? { children: getSideNavMenuItem(nav.listMenu, true, navCollapsed) }
        : {}),
    }));
};

type SideNavContentProps = {
  routeInfo?: MenuDataType;
  hideGroupTitle?: boolean;
};

const SideNavContent: React.FC<SideNavContentProps> = ({
  routeInfo,
  hideGroupTitle,
}) => {
  const menuData: MenuDataType[] | null = useSelector(
    (state) => state.menu.menuData
  );
  const navCollapsed = useSelector((state) => state.customizer.isCollapse);
  const menuItems = useMemo(
    () => getSideNavMenuItem(menuData || [], false, navCollapsed),
    [menuData, navCollapsed]
  );

  return (
    <Menu
      mode="inline"
      theme="light"
      defaultSelectedKeys={[routeInfo?.id || ""]}
      defaultOpenKeys={setDefaultOpen(routeInfo?.id)}
      className={`left-menu ${hideGroupTitle ? "hide-group-title" : ""}`}
      items={menuItems}
      inlineCollapsed={navCollapsed}
    />
  );
};

const MenuContent: React.FC = () => {
  return <SideNavContent />;
};

export default MenuContent;
