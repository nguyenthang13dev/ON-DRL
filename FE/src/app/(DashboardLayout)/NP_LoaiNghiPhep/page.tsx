"use client";
import Flex from "@/components/shared-components/Flex";
import {
  searchNP_LoaiNghiPhepDataType,
  tableNP_LoaiNghiPhepDataType,
} from "@/types/NP_LoaiNghiPhep/np_LoaiNghiPhep";
import { ResponsePageInfo } from "@/types/general";
import withAuthorization from "@/libs/authentication";
import { nP_LoaiNghiPhepService } from "@/services/NghiPhep/NP_LoaiNghiPhep/NP_LoaiNghiPhep.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useDispatch, useSelector } from "@/store/hooks";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  MenuProps,
  Pagination,
  Popconfirm,
  Space,
  Table,
  TableProps,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import CreateOrUpdate from "./createOrUpdate";
import { toast } from "react-toastify";

const NP_LoaiNghiPhep: React.FC = () => {
  const dispatch = useDispatch();
  const [listNP_LoaiNghiPhep, setListNP_LoaiNghiPhep] = useState<
    tableNP_LoaiNghiPhepDataType[]
  >([]);
  const [dataPage, setDataPage] = useState<ResponsePageInfo>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const loading = useSelector((state) => state.general.isLoading);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentNP_LoaiNghiPhep, setCurrentNP_LoaiNghiPhep] =
    useState<tableNP_LoaiNghiPhepDataType>();

  const tableColumns: TableProps<tableNP_LoaiNghiPhepDataType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tên loại phép",
      dataIndex: "tenLoaiPhep",
      render: (_: any, record: tableNP_LoaiNghiPhepDataType) => (
        <span>{record.tenLoaiPhep}</span>
      ),
    },
    {
      title: "Mã loại phép",
      dataIndex: "maLoaiPhep",
      render: (_: any, record: tableNP_LoaiNghiPhepDataType) => (
        <span>{record.maLoaiPhep}</span>
      ),
    },
    {
      title: "Số ngày phép mặc định",
      dataIndex: "soNgayMacDinh",
      render: (_: any, record: tableNP_LoaiNghiPhepDataType) => (
        <span>{record.soNgayMacDinh}</span>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      fixed: "right",
      render: (_: any, record: tableNP_LoaiNghiPhepDataType) => {
        const items: MenuProps["items"] = [
          {
            label: "Chỉnh sửa",
            key: "2",
            icon: <EditOutlined />,
            onClick: () => {
              handleShowModal(true, record);
            },
          },
          {
            type: "divider",
          },
          {
            label: (
              <Popconfirm
                key={"Delete" + record.id}
                title="Xác nhận xóa"
                description={
                  <span>
                    Bạn có muốn xóa dữ liệu này không? <br /> Sau khi xóa sẽ
                    không thể khôi phục.
                  </span>
                }
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() => {
                  handleDeleteNP_LoaiNghiPhep(record.id || "");
                }}
                trigger="click"
                forceRender
              >
                <span>Xóa</span>
              </Popconfirm>
            ),
            key: "4",
            icon: <DeleteOutlined />,
            danger: true,
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
    handleGetList();
  };

  const handleDeleteNP_LoaiNghiPhep = async (id: string) => {
    try {
      const response = await nP_LoaiNghiPhepService.Delete(id);
      if (response.status) {
        toast.success("Xóa tài khoản thành công");
        handleGetList();
      } else {
        toast.error("Xóa tài khoản thất bại");
      }
    } catch (error) {
      toast.error("Xóa tài khoản thất bại");
    }
  };

  const handleGetList = useCallback(
    async (searchDataOverride?: searchNP_LoaiNghiPhepDataType) => {
      dispatch(setIsLoading(true));
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
        };
        const response = await nP_LoaiNghiPhepService.getDataByPage(searchData);
        if (response != null && response.data != null) {
          const data = response.data;
          const items = data.items;
          setListNP_LoaiNghiPhep(items);
          setDataPage({
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPage: data.totalPage,
          });
        }
        dispatch(setIsLoading(false));
      } catch (error) {
        dispatch(setIsLoading(false));
      }
    },
    [pageIndex, pageSize]
  );

  const handleShowModal = (
    isEdit?: boolean,
    NP_LoaiNghiPhep?: tableNP_LoaiNghiPhepDataType
  ) => {
    setIsOpenModal(true);
    if (isEdit) {
      setCurrentNP_LoaiNghiPhep(NP_LoaiNghiPhep);
    }
  };

  const handleClose = () => {
    setIsOpenModal(false);
    setCurrentNP_LoaiNghiPhep(undefined);
  };

  useEffect(() => {
    handleGetList();
  }, [handleGetList]);

  return (
    <>
      <Flex alignItems="center" justifyContent="end">
        <Button
          onClick={() => {
            handleShowModal();
          }}
          type="primary"
          icon={<PlusCircleOutlined />}
          size="small"
        >
          Thêm mới
        </Button>
        <CreateOrUpdate
          isOpen={isOpenModal}
          onSuccess={hanleCreateEditSuccess}
          onClose={handleClose}
          NP_LoaiNghiPhep={currentNP_LoaiNghiPhep}
        />
      </Flex>

      <Card style={{ padding: "0px" }}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={listNP_LoaiNghiPhep}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={false}
            loading={loading}
          />
        </div>
        <Pagination
          className="mt-2"
          total={dataPage?.totalCount}
          showTotal={(total, range) =>
            range[0] + "-" + range[1] + " trong " + total + " dữ liệu"
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

export default withAuthorization(NP_LoaiNghiPhep, "NP_LoaiNghiPhep_index");
