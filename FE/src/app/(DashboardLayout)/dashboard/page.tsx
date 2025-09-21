"use client";
import KySoInfo from "@/components/signature/SisnatureInfo";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";

export default function Dashboard() {
  return (
    <>
      <div style={{ marginBottom: "1%" }}>
        <AutoBreadcrumb />
      </div>
      <KySoInfo
        idBieuMau={"1bbc2563-8156-42e0-808c-164ab99ec0fc"}
        idDTTienTrinhXuLy={"1bbc2563-8156-42e0-808c-164ab99ec0fc"}
      ></KySoInfo>
    </>
  );
}
