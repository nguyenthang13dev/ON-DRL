"use client";
import { useCallback, useEffect, useState } from "react";
import Flex from "@/components/shared-components/Flex";
import { ResponsePageList } from "@/types/general";
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
  message,
  Modal,
  Pagination,
  Space,
  Table,
  TableProps,
  DatePicker,
  Row,
  Col,
} from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Search from "./search";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import {
  DataTableChamCongType,
  DataTableSearch,
  NS_ChamCongSearchType,
  NS_ChamCongType,
} from "@/types/QLNhanSu/nS_ChamCong/nS_ChamCong";
import nS_ChamCongService from "@/services/QLNhanSu/nS_ChamCong/nS_ChamCongService";
import NS_ChamCongCreateOrUpdate from "./Components/NS_ChamCongImportExcel";
import { CiImport } from "react-icons/ci";
import NS_ChamCongImportExcel from "./Components/NS_ChamCongImportExcel";
import dayjs from "dayjs";
import DataTable from "./Components/DataTable";
import { FaRegCalendarAlt } from "react-icons/fa";
import { VaiTroConstant } from "@/constants/VaiTroConstant";
const NS_ChamCongPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] =
    useState<NS_ChamCongSearchType | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentItem, setCurentItem] = useState<NS_ChamCongType | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const listRoles = useSelector((state) => state.auth.User?.listRole) || [];
  const currentUser = useSelector((state) => state.auth.User);
  const isHR =
    listRoles.includes(VaiTroConstant.HR) ||
    listRoles.includes(VaiTroConstant.Admin);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DataTableChamCongType[]>([]);
  const [currentUserData, setCurrentUserData] =
    useState<DataTableChamCongType | null>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(
    dayjs().subtract(1, "month") // mặc định nếu không có dữ liệu thì sẽ lấy giá trị thasdn truiwco
  );
  const handleSuccess = () => {
    setCurentItem(null);
    fetchData();
  };

  const handleDelete = async () => {
    const response = await nS_ChamCongService.delete(confirmDeleteId ?? "");
    if (response.status) {
      toast.success("Xóa thành công");
    }
    setConfirmDeleteId(null);
  };

  const handleShowModal = () => {
    setIsOpenModal(true);
  };
  const handleClose = () => {
    setIsOpenModal(false);
    setCurentItem(null);
  };
  const fetchData = async () => {
    try {
      // setLoading(true);
      const searchParams: DataTableSearch = {
        month: selectedDate.month() + 1, // dayjs month() trả về 0-11, DB cần 1-12
        year: selectedDate.year(),
        pageIndex: 1,
        pageSize: 1000,
      };

      const response = await nS_ChamCongService.getDataTableChamCong(
        searchParams
      );

      if (response.status) {
        // Transform data để phù hợp với DataTable component
        const transformedData =
          response.data?.map((item, index) => ({
            ...item,
            key: item.maNV || index.toString(),
            stt: index + 1,
          })) || [];

        setData(transformedData);

        // Nếu không phải HR/Admin, sử dụng data đầu tiên làm currentUserData (backend đã filter)
        if (!isHR && transformedData.length > 0) {
          setCurrentUserData(transformedData[0]);
          console.log("Current User Data:", transformedData[0]);
        }

        message.success(
          `Đã tải ${transformedData.length} bản ghi chấm công cho tháng ${
            selectedDate.month() + 1
          }/${selectedDate.year()}`
        );
      } else {
        message.error(response.message || "Có lỗi xảy ra khi tải dữ liệu");
        setData([]);
        setCurrentUserData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu");
      setData([]);
      setCurrentUserData(null);
    } finally {
    }
  };
  useEffect(() => {
    fetchData();
  }, [selectedDate]); // Thêm selectedDate vào dependency để tự động reload khi thay đổi tháng/năm

  const handleView = (record: DataTableChamCongType) => {
    message.info(`Xem chi tiết chấm công của ${record.hoTen}`);
  };

  const handleEdit = (record: DataTableChamCongType) => {
    message.info(`Chỉnh sửa chấm công của ${record.hoTen}`);
  };

  const handleSaveEdit = async (editData: any) => {
    try {
      fetchData();
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật chấm công!");
      throw error;
    }
  };
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"
      >
        <AutoBreadcrumb />
        <Space>
          {/* <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => setIsPanelVisible(!isPanelVisible)}
          >
            {isPanelVisible ? "Ẩn tìm kiếm" : "Tìm kiếm"}
          </Button> */}
          {isHR && (
            <Button
              onClick={handleShowModal}
              type="primary"
              icon={<CiImport />}
            >
              Import dữ liệu chấm công
            </Button>
          )}
        </Space>
      </Flex>

      <div>
        {/* Search Panel */}
        {isPanelVisible && (
          <Card style={{ marginBottom: "8px" }}>
            <Search
              onFinish={(values: NS_ChamCongSearchType) => {
                setSearchValues(values);
                setPageIndex(1);
              }}
              pageIndex={pageIndex}
              pageSize={pageSize}
            />
          </Card>
        )}

        <Card>
          {/* Date Picker cho tháng/năm */}
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "6px",
              border: "1px solid #e9ecef",
            }}
          >
            <Row gutter={16} align="middle" justify="start">
              <Col>
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  <FaRegCalendarAlt /> Chọn tháng/năm:
                </span>
              </Col>
              <Col>
                <DatePicker
                  picker="month"
                  value={selectedDate}
                  onChange={(date) => {
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                  format="MM/YYYY"
                  placeholder="Chọn tháng/năm"
                  style={{ width: "200px" }}
                />
              </Col>
              <Col>
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Hiển thị dữ liệu chấm công tháng{" "}
                  <strong>
                    {selectedDate.month() + 1}/{selectedDate.year()}
                  </strong>
                </span>
              </Col>
            </Row>
          </div>

          <div style={{ padding: 0 }}>
            <DataTable
              data={data}
              onView={handleView}
              onEdit={handleEdit}
              onSaveEdit={handleSaveEdit}
              startDate={selectedDate.startOf("month").format("DD/MM/YYYY")}
              endDate={selectedDate.endOf("month").format("DD/MM/YYYY")}
              currentUserData={currentUserData}
            />
          </div>
        </Card>

        {/* Import Modal */}
        {isOpenModal && (
          <NS_ChamCongImportExcel
            onSuccess={handleSuccess}
            onClose={handleClose}
          />
        )}
      </div>
    </>
  );
};
export default withAuthorization(NS_ChamCongPage, "");
