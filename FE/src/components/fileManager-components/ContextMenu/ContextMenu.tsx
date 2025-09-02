import { useEffect, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import SubMenu from "./SubMenu";
import "./ContextMenu.scss";

type MenuItem = {
  title: string;
  icon?: JSX.Element;
  onClick?: () => void;
  className?: string;
  divider?: boolean;
  hidden?: boolean;
  selected?: boolean;
  children?: MenuItem[];
};

type ClickPosition = {
  clickX: number;
  clickY: number;
};

type ContextMenuProps = {
  filesViewRef: React.MutableRefObject<HTMLDivElement | null>;
  contextMenuRef: React.MutableRefObject<HTMLDivElement | null>;
  menuItems: MenuItem[];
  visible: boolean;
  clickPosition: ClickPosition;
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  filesViewRef,
  contextMenuRef,
  menuItems,
  visible,
  clickPosition,
}) => {
  const [left, setLeft] = useState<string>("0");
  const [top, setTop] = useState<string>("0");
  const [activeSubMenuIndex, setActiveSubMenuIndex] = useState<number | null>(null);
  const [subMenuPosition, setSubMenuPosition] = useState<"right" | "left">("right");

  const subMenuRef = useRef<HTMLUListElement | null>(null);

  const contextMenuPosition = () => {
    const { clickX, clickY } = clickPosition;

    const container = filesViewRef.current;
    const contextMenuEl = contextMenuRef.current;

    if (!container || !contextMenuEl) return;

    const containerRect = container.getBoundingClientRect();
    const scrollBarWidth = container.offsetWidth - container.clientWidth;

    const contextMenuRect = contextMenuEl.getBoundingClientRect();
    const menuWidth = contextMenuRect.width;
    const menuHeight = contextMenuRect.height;

    const leftToCursor = clickX - containerRect.left;
    const right = containerRect.width - (leftToCursor + scrollBarWidth) > menuWidth;
    const leftAlign = !right;

    const topToCursor = clickY - containerRect.top;
    const topAlign = containerRect.height - topToCursor > menuHeight;
    const bottomAlign = !topAlign;

    if (right) {
      setLeft(`${leftToCursor}px`);
      setSubMenuPosition("right");
    } else if (leftAlign) {
      setLeft(`${leftToCursor - menuWidth}px`);
      setSubMenuPosition("left");
    }

    if (topAlign) {
      setTop(`${topToCursor + container.scrollTop}px`);
    } else if (bottomAlign) {
      setTop(`${topToCursor + container.scrollTop - menuHeight}px`);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseOver = (index: number) => {
    setActiveSubMenuIndex(index);
  };

  useEffect(() => {
    if (visible && contextMenuRef.current) {
      contextMenuPosition();
    } else {
      setTop("0");
      setLeft("0");
      setActiveSubMenuIndex(null);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={contextMenuRef}
      onContextMenu={handleContextMenu}
      onClick={(e) => e.stopPropagation()}
      className={`fm-context-menu ${top !== "0" ? "visible" : "hidden"}`}
      style={{ top, left }}
    >
      <div className="file-context-menu-list">
        <ul>
          {menuItems
            .filter((item) => !item.hidden)
            .map((item, index) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const activeSubMenu = activeSubMenuIndex === index && hasChildren;

              return (
                <div key={item.title}>
                  <li
                    onClick={item.onClick}
                    className={`${item.className ?? ""} ${activeSubMenu ? "active" : ""}`}
                    onMouseOver={() => handleMouseOver(index)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {hasChildren && (
                      <>
                        <FaChevronRight size={14} className="list-expand-icon" />
                        {activeSubMenu && (
                          <SubMenu
                            subMenuRef={subMenuRef}
                            list={item.children ?? []}
                            position={subMenuPosition}
                          />
                        )}
                      </>
                    )}
                  </li>
                  {item.divider && <div className="divider"></div>}
                </div>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default ContextMenu;
