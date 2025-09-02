import { tableModuleType } from "@/types/menu/menu";
import { Drawer } from "antd";

interface UserViewProps {
  user?: tableModuleType | null;
  isOpen: boolean;
  onClose: () => void;
}

const ConfigureOperation: React.FC<UserViewProps> = () => {
  return (
    <Drawer
      title={`Phân quyền vai trò`}
      width="80%"
      placement="right"
      //   onClose={onClose}
      closable={true}
      //   open={isOpen}
    ></Drawer>
  );
};

export default ConfigureOperation;
