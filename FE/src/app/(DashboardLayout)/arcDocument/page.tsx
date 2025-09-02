"use client";
import { useCallback, useEffect, useState } from "react";
import Flex from "@/components/shared-components/Flex";
import { DropdownOption, ResponsePageList } from "@/types/general";
import withAuthorization from "@/libs/authentication";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import * as extensions from "@/utils/extensions";
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  FormProps,
  MenuProps,
  Modal,
  Pagination,
  Space,
  Table,
  TableProps,
  Tabs,
} from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ArcDocumentDetail from "./detail";
import Search from "./search";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import {
  ArcDocumentSearchType,
  ArcDocumentType,
} from "@/types/arcDocument/arcDocument";
import arcDocumentService from "@/services/arcDocument/arcDocumentService";
import ArcDocumentCreateOrUpdate from "./createOrUpdate";
import TabArcDocumentPage from "./oneTab";


const ArcDocumentPage: React.FC = () => {

  const [typeDocuments, setTypeDocuments] = useState<DropdownOption[]>([]);

  const handleGetTypeName = async () => {
    const rs = await arcDocumentService.getTypeDocument();
    if (rs.status) {
      setTypeDocuments(rs.data)
    }
    else {
      toast.error("Đã xảy ra lỗi khi lấy dữ liệu");
    }
  }

  useEffect(() => {
    handleGetTypeName();
  }, [])

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"

      >
        <AutoBreadcrumb />
      </Flex>

      <Tabs
        onChange={() => { }}
        type="card"
        items={typeDocuments.map((type, index) => {
          const label = type.label;
          const value = type.value;
          return {
            label: label,
            key: value,
            children: <TabArcDocumentPage />,
          };
        })}
      />

    </>
  );
};

export default withAuthorization(ArcDocumentPage, "");
