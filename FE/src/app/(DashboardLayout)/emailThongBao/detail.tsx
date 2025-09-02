import React from "react";
import { Drawer, Divider } from "antd";
import { EmailThongBaoType } from "@/types/emailThongBao/emailThongBao";
import * as extensions from "@/utils/extensions";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

interface Props {
  item?: EmailThongBaoType | null;
  onClose: () => void;
}

const EmailThongBaoDetail: React.FC<Props> = ({ item, onClose }) => {
  return (
    <Drawer
      title={`Thông tin email thông báo`}
      width="50%"
      placement="right"
      onClose={onClose}
      closable={true}
      open={true}
    >
      <Divider dashed />
      <div>
        <p>
          <span className="ml-3 text-dark">Mã: {item?.ma}</span>
        </p>
        <p>
          <p>
            <span className="ml-3 text-dark">
              Nội dung:
              {<ReactQuill readOnly value={item?.noiDung} theme="snow" />}
            </span>
          </p>
        </p>
      </div>
    </Drawer>
  );
};

export default EmailThongBaoDetail;
