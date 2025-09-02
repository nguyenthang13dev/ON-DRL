"use client";
import { useCallback, useEffect, useState } from "react";
import Flex from "@/components/shared-components/Flex";
import { ResponsePageList } from "@/types/general";
import withAuthorization from "@/libs/authentication";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import * as extensions from "@/utils/extensions";
import classes from "./page.module.css";
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
} from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DA_NoiDungCuocHopDetail from "./detail";
import Search from "./search";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import {
  DA_NoiDungCuocHopSearchType,
  DA_NoiDungCuocHopType,
} from "@/types/dA_DuAn/dA_NoiDungCuocHop";
import dA_NoiDungCuocHopService from "@/services/dA_DuAn/dA_NoiDungCuocHopService";
import DA_NoiDungCuocHopCreateOrUpdate from "./createOrUpdate";
import { DA_DuAnType } from "@/types/dA_DuAn/dA_DuAn";

interface Props {
  duAnId?: string; // Thêm prop này để filter theo dự án
  tenDuAn?: string;
  embeddedMode?: boolean; // Flag để biết khi được nhúng vào component khác
}

const DA_NoiDungCuocHopPage = ({ duAnId, tenDuAn, embeddedMode }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<ResponsePageList<DA_NoiDungCuocHopType[]>>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [searchValues, setSearchValues] =
    useState<DA_NoiDungCuocHopSearchType | null>(null);
  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentItem, setCurentItem] = useState<DA_NoiDungCuocHopType | null>(
    null
  );
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const tableColumns: TableProps<DA_NoiDungCuocHopType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      key: "ThanhPhanThamGiaText",
      title: "Thành phần tham gia",
      dataIndex: "thanhPhanThamGiaText",
    },
    {
      key: "loaiCuocHopText",
      title: "Loại cuộc họp",
      dataIndex: "loaiCuocHopText",
      align: "center",
    },
    {
      key: "thoiGianHop",
      title: "Thời gian họp",
      dataIndex: "thoiGianHop",
      align: "center",
      render: (date: string) => formatDateTime(date),
    },
    {
      key: "NoiDungCuocHop",
      title: "Nội dung cuộc họp",
      dataIndex: "noiDungCuocHop",
      render: (html: string) => (
        <div
          style={{
            maxWidth: 350,
            maxHeight: 100,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ),
    },
    {
      key: "DiaDiemCuocHop",
      title: "Địa điểm cuộc họp",
      dataIndex: "diaDiemCuocHop",
    },

    {
      key: "soTaiLieu",
      title: "File đính kèm",
      dataIndex: "soTaiLieu",
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      align: "center",
      render: (_: any, record: DA_NoiDungCuocHopType) => {
        const items: MenuProps["items"] = [
          {
            label: "Chi tiết",
            key: "2",
            icon: <EyeOutlined />,
            onClick: () => {
              setCurentItem(record);
              setIsOpenDetail(true);
            },
          },
          {
            label: "Chỉnh sửa",
            key: "3",
            icon: <EditOutlined />,
            onClick: () => {
              handleShowModal(true, record);
            },
          },
          {
            type: "divider",
          },
          {
            label: "Xóa",
            key: "4",
            danger: true,
            icon: <DeleteOutlined />,
            onClick: () => setConfirmDeleteId(record.id ?? ""),
          },
        ];
        return (
          <>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Button
                onClick={(e) => e.preventDefault()}
                color="primary"
                size="small"
              >
                <Space>
                  Thao tác
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </>
        );
      },
    },
  ];

  const hanleCreateEditSuccess = () => {
    handleLoadData();
    setCurentItem(null);
  };
  const handleDelete = async () => {
    const response = await dA_NoiDungCuocHopService.delete(
      confirmDeleteId ?? ""
    );
    if (response.status) {
      toast.success("Xóa thành công");
      handleLoadData();
    }
    setConfirmDeleteId(null);
  };

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const onFinishSearch: FormProps<DA_NoiDungCuocHopSearchType>["onFinish"] =
    async (values) => {
      try {
        setSearchValues(values);
        await handleLoadData(values);
      } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
      }
    };

  const handleLoadData = useCallback(
    async (searchDataOverride?: DA_NoiDungCuocHopSearchType) => {
      dispatch(setIsLoading(true));

      const searchData = searchDataOverride || {
        pageIndex,
        pageSize,
        duAnId: duAnId,
        ...(searchValues || {}),
      };
      try {
        const response = await dA_NoiDungCuocHopService.getData(searchData);

        if (response != null && response.data != null) {
          const data = response.data;
          setData(data);
        }
      } catch (error) {
        console.error(
          "Lỗi khi gọi API dA_NoiDungCuocHopService.getData:",
          error
        );
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, pageIndex, pageSize, searchValues]
  );

  const handleShowModal = (isEdit?: boolean, item?: DA_NoiDungCuocHopType) => {
    setIsOpenModal(true);

    if (isEdit && item) {
      // Chỉnh sửa: giữ nguyên item nhưng đảm bảo có duAnId
      setCurentItem({
        ...item,
        duAnId: item.duAnId || duAnId || "", // Ưu tiên duAnId từ item, fallback về props.duAnId
        tenDuAn: item.tenDuAn || tenDuAn || "",
      });
    } else {
      // Tạo mới: khởi tạo item với duAnId từ props
      setCurentItem({
        id: "",
        duAnId: duAnId || "", // Luôn lấy từ props khi tạo mới
        tenDuAn: tenDuAn || "",
        isNoiBo: true,
        thanhPhanThamGia: "",
        loaiCuocHopText: "",
        thoiGianHop: "",
        noiDungCuocHop: "",
        diaDiemCuocHop: "",
        soTaiLieu: 0,
        // ... các trường khác
      });
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurentItem(null);
  };

  const handleCloseDetail = () => {
    setIsOpenDetail(false);
  };

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <Button
          onClick={() => toggleSearch()}
          type="primary"
          size="small"
          icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
        >
          {isPanelVisible ? "Ẩn tìm kiếm" : "Tìm kiếm"}
        </Button>
        <Button
          onClick={() => {
            handleShowModal();
          }}
          type="primary"
          icon={<PlusCircleOutlined />}
          size="small"
        >
          Thêm mới cuộc họp
        </Button>
      </div>
      {isOpenModal && (
        <DA_NoiDungCuocHopCreateOrUpdate
          onSuccess={hanleCreateEditSuccess}
          onClose={handleClose}
          item={currentItem}
        />
      )}
      {isPanelVisible && (
        <Search
          onFinish={onFinishSearch}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      )}
      {isOpenDetail && currentItem && (
        <DA_NoiDungCuocHopDetail
          item={currentItem}
          onClose={handleCloseDetail}
        />
      )}

      {confirmDeleteId && (
        <Modal
          title="Xác nhận xóa"
          open={true}
          onOk={handleDelete}
          onCancel={() => setConfirmDeleteId(null)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn xóa mục này?</p>
        </Modal>
      )}
      <Card className={"customCardShadow"}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={data?.items}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={false}
            loading={loading}
          />
        </div>
        <Pagination
          className="mt-2"
          total={data?.totalCount}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} trong ${total} dữ liệu`
          }
          pageSize={pageSize}
          defaultCurrent={1}
          onChange={(e) => {
            setPageIndex(e);
          }}
          onShowSizeChange={(current, pageSize) => {
            setPageIndex(current);
            setPageSize(pageSize);
          }}
          size="small"
          align="end"
        />
      </Card>
    </>
  );
};

export default withAuthorization(DA_NoiDungCuocHopPage, "");

function formatDateTime(date: Date | string | number): string {
  // Xử lý đầu vào
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === "string" || typeof date === "number") {
    d = new Date(date);
  } else {
    return "Invalid Date";
  }

  // Kiểm tra Date hợp lệ
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }

  // Lấy các thành phần ngày tháng
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  // Trả về chuỗi định dạng dd/mm/yyyy hh:mm
  return `${hours}:${minutes} ${day}/${month}/${year} `;
}
