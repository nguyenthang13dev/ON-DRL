"use client";
import { Layout } from "antd";
import {
    TEMPLATE,
    GRAY_SCALE,
    SIDE_NAV_WIDTH,
} from "@/constants/ThemeConstant";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useSelector } from "@/store/hooks";
import MenuContent from "./MenuContent";
import {
    ArrowLeftOutlined,
    MenuOutlined,
    SwapLeftOutlined,
    VerticalRightOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
    toggleMobileSidebar,
    toggleSidebar,
} from "@/store/customizer/CustomizerSlice";
const { Sider } = Layout;

export const SideNav = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navCollapsed = useSelector((state) => state.customizer.isCollapse);
    const isMobile = useSelector((state) => state.customizer.isMobile);
    const onToggle = () => {
        if (!isMobile) {
            dispatch(toggleSidebar());
        } else {
            dispatch(toggleMobileSidebar());
        }
    };
    return (
        <Sider
            style={{
                height: `calc(100vh - ${TEMPLATE.HEADER_HEIGHT}px)`,
                position: `fixed`,
                top: `${TEMPLATE.HEADER_HEIGHT}px`,
                zIndex: 999,
                backgroundColor: `white`,
            }}
            className={`"side-nav border-r border-gray-200 ${
                navCollapsed ? "menu-min" : "menu-max"
            }`}
            width={SIDE_NAV_WIDTH}
            collapsed={navCollapsed}
        >
            <Scrollbars autoHide>
                <div className="p-2">
                    <div
                        className="flex gap-1 align-items-center hover bg-[#7c3aed] text-white p-[10px] rounded-sm cursor-pointer toggle-button"
                        onClick={onToggle}
                    >
                        <MenuOutlined />
                        {!navCollapsed && (
                            <>
                                <div className="mr-auto">Chức năng</div>
                                <div>
                                    <ArrowLeftOutlined className="text-yellow-200" />
                                </div>
                            </>
                        )}
                    </div>
                    <MenuContent />
                </div>
            </Scrollbars>
        </Sider>
    );
};
