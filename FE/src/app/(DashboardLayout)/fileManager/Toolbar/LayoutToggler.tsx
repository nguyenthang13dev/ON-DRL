import { useLayout } from "@/contexts/LayoutContext";
import { useDetectOutsideClickLayout } from "@/hooks/useDetectOutsideClick";
import { BsGridFill } from "react-icons/bs";
import { FaCheck, FaListUl } from "react-icons/fa6";

interface LayoutTogglerProps {
  setShowToggleViewMenu: (show: boolean) => void;
  onLayoutChange: (layout: string) => void;
}

const LayoutToggler: React.FC<LayoutTogglerProps> = ({ setShowToggleViewMenu, onLayoutChange }) => {
  const toggleViewRef = useDetectOutsideClickLayout(() => {
    setShowToggleViewMenu(false);
  });
  const { activeLayout, setActiveLayout } = useLayout();

  const layoutOptions = [
    {
      key: "grid",
      name: "Lưới",
      icon: <BsGridFill size={18} />,
    },
    {
      key: "list",
      name: "Danh sách",
      icon: <FaListUl size={18} />,
    },
  ];

  const handleSelection = (key: string) => {
    setActiveLayout(key);
    onLayoutChange(key);
    setShowToggleViewMenu(false);
  };

  return (
    <ul ref={toggleViewRef.ref} className="toggle-view" role="dropdown">
      <ul role="menu" aria-orientation="vertical">
        {layoutOptions.map((option) => (
          <li
            role="menuitem"
            key={option.key}
            onClick={() => handleSelection(option.key)}
            onKeyDown={() => handleSelection(option.key)}
          >
            <span>{option.key === activeLayout && <FaCheck size={13} />}</span>
            <span>{option.icon}</span>
            <span>{option.name}</span>
          </li>
        ))}
      </ul>
    </ul>
  );
};

export default LayoutToggler;
