import React from "react";
import { FaCheck } from "react-icons/fa6";

type SubMenuItem = {
  title: string;
  icon?: JSX.Element;
  onClick?: () => void;
  selected?: boolean;
};

type SubMenuProps = {
  subMenuRef: React.MutableRefObject<HTMLUListElement | null>;
  list: SubMenuItem[];
  position?: "right" | "left";
};

const SubMenu: React.FC<SubMenuProps> = ({
  subMenuRef,
  list,
  position = "right",
}) => {
  return (
    <ul ref={subMenuRef} className={`sub-menu ${position}`}>
      {list?.map((item) => (
        <li key={item.title} onClick={item.onClick}>
          <span className="item-selected">
            {item.selected && <FaCheck size={13} />}
          </span>
          {item.icon}
          <span>{item.title}</span>
        </li>
      ))}
    </ul>
  );
};

export default SubMenu;
