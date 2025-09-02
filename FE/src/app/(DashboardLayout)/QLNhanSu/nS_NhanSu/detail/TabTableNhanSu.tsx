import { Tabs } from "antd";
import React from "react";
import ChamCong from "./ChamCong";

interface Props {
    maNV: string;
}

const TabTableNhanSu: React.FC<Props> = ({maNV}) => {
  const tabItems = [
    {
      label: "Dữ liệu nhân sự",
      key: "1",
      children: <ChamCong maNV={maNV} />,
    },
  ];
  return (
    <>
      <Tabs tabPosition="left" items={tabItems} />
    </>
  );
};

export default TabTableNhanSu;
