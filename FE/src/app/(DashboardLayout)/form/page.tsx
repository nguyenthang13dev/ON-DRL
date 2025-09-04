'use client'
import Flex from '@/components/shared-components/Flex'
import {
  searchNhomDanhMucData,
  tableNhomDanhMucDataType,
} from '@/types/nhomDanhMuc/nhomDanhMuc'
import { Response, ResponsePageInfo, ResponsePageList } from '@/types/general'
import withAuthorization from '@/libs/authentication'
import { nhomDanhMucService } from '@/services/nhomDanhMuc/nhomDanhMuc.service'
import { setIsLoading } from '@/store/general/GeneralSlice'
import { useSelector } from '@/store/hooks'
import { AppDispatch } from '@/store/store'
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Dropdown,
  FormProps,
  MenuProps,
  Pagination,
  Popconfirm,
  Space,
  Table,
  TableProps,
} from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import classes from './page.module.css'
import { toast } from 'react-toastify'
import CreateOrUpdate from './createOrUpdate'
import NhomDanhMucDetail from './detail'
import Search from './search'
import { useRouter } from 'next/navigation'
import AutoBreadcrumb from '@/components/util-compenents/Breadcrumb'
import TemplatePreviewPage from './config'
import {
  FormTemplate,
  FormTemplateSearch,
} from '@/types/formTemplate/formTemplate'
import { formTemplateService } from '@/services/formTemplate/formTemplate.service'
import FormTemplateConfig from './formTemplateConfig'

const NhomDanhMuc: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([])
  const [currentFormTemplate, setCurrentFormTemplate] =
    useState<FormTemplate | null>(null)
  const [dataPage, setDataPage] = useState<ResponsePageInfo>()
  const [pageSize, setPageSize] = useState<number>(20)
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false)
  const [searchValues, setSearchValues] = useState<FormTemplateSearch | null>(
    null
  )
  const loading = useSelector((state) => state.general.isLoading)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isOpenConfigModal, setIsOpenConfigModal] = useState<boolean>(false)

  const [currentDetailNhomDanhMuc, setCurrentDetailNhomDanhMuc] =
    useState<tableNhomDanhMucDataType>()
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false)
  const router = useRouter()
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null)

  const tableColumns: TableProps<FormTemplate>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên mẫu',
      dataIndex: 'groupCode',
      render: (_: any, record: FormTemplate) => <span>{record.name}</span>,
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      render: (_: any, record: FormTemplate) => {
        const items: MenuProps['items'] = [
          {
            label: 'Cấu hình',
            key: '1',
            icon: <SettingOutlined />,
            onClick: () => {
              setIsOpenConfigModal(true)
              setCurrentFormTemplate(record)
            },
          },
          {
            label: 'Chi tiết',
            key: '2',
            icon: <EyeOutlined />,
            onClick: () => {
              // setCurrentDetailNhomDanhMuc(record)
              // setIsOpenDetail(true)
            },
          },
          {
            label: 'Chỉnh sửa',
            key: '3',
            icon: <EditOutlined />,
            onClick: () => {
              // handleShowModal(true, record)
            },
          },
          {
            type: 'divider',
          },
          {
            label: 'Xóa',
            key: '4',
            danger: true,
            icon: <DeleteOutlined />,
            onClick: () => setOpenPopconfirmId(record.id ?? ''),
          },
        ]
        return (
          <>
            <Dropdown menu={{ items }} trigger={['click']}>
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
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa?"
              okText="Xóa"
              cancelText="Hủy"
              open={openPopconfirmId === record.id}
              onConfirm={() => {
                // handleDeleteNhomDanhMuc(record.id || '')
                setOpenPopconfirmId(null)
              }}
              onCancel={() => setOpenPopconfirmId(null)}
            ></Popconfirm>
          </>
        )
      },
    },
  ]

  const hanleCreateEditSuccess = () => {
    handleGetFormTemplates()
    setCurrentFormTemplate(null)
  }

  // const handleDeleteNhomDanhMuc = async (id: string) => {
  //   try {
  //     const response = await nhomDanhMucService.Delete(id)
  //     if (response.status) {
  //       toast.success('Xóa thành công')
  //       handleGetListNhomDanhMuc()
  //     } else {
  //       toast.error('Xóa thất bại')
  //     }
  //   } catch (error) {
  //     toast.error('Xóa thất bại')
  //   }
  // }

  const toggleSearch = () => {
    setIsPanelVisible(!isPanelVisible)
  }

  const onFinishSearch: FormProps<FormTemplateSearch>['onFinish'] = async (
    values
  ) => {
    try {
      setSearchValues(values)
      await handleGetFormTemplates(values)
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error)
    }
  }

  const handleGetFormTemplates = useCallback(
    async (searchDataOverride?: FormTemplateSearch) => {
      dispatch(setIsLoading(true))
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          ...(searchValues || {}),
        }
        const response: Response = await formTemplateService.getDataByPage(
          searchData
        )
        if (response != null && response.data != null) {
          const data: ResponsePageList = response.data
          const items: FormTemplate[] = data.items
          setFormTemplates(items)
          setDataPage({
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPage: data.totalPage,
          })
        }
        dispatch(setIsLoading(false))
      } catch (error) {
        dispatch(setIsLoading(false))
      }
    },
    [pageIndex, pageSize]
  )

  // const handleShowModal = (
  //   isEdit?: boolean,
  //   NhomDanhMuc?: tableNhomDanhMucDataType
  // ) => {
  //   setIsOpenModal(true)
  //   if (isEdit) {
  //     setCurrentNhomDanhMuc(NhomDanhMuc ?? null)
  //   }
  // }

  // const handleClose = () => {
  //   setIsOpenModal(false)
  //   setCurrentNhomDanhMuc(null)
  // }

  // const handleCloseDetail = () => {
  //   setIsOpenDetail(false)
  // }

  useEffect(() => {
    console.log({
      ...searchValues,
      pageIndex,
      pageSize,
    })
    handleGetFormTemplates()
  }, [handleGetFormTemplates])

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"
      >
        <AutoBreadcrumb />
        <div>
          <Button
            onClick={() => toggleSearch()}
            type="primary"
            size="small"
            icon={isPanelVisible ? <CloseOutlined /> : <SearchOutlined />}
            className={classes.mgright5}
          >
            {isPanelVisible ? 'Ẩn tìm kiếm' : 'Tìm kiếm'}
          </Button>
          <Button
            onClick={() => {
              // handleShowModal()
            }}
            type="primary"
            icon={<PlusCircleOutlined />}
            size="small"
          >
            Thêm mới
          </Button>
          {/* <CreateOrUpdate
            isOpen={isOpenModal}
            onSuccess={hanleCreateEditSuccess}
            onClose={handleClose}
            NhomDanhMuc={currentNhomDanhMuc} 
          />
            */}
          {/* {isOpenModal && <TemplatePreviewPage />} */}
          <FormTemplateConfig
            isOpen={isOpenConfigModal}
            onClose={() => {
              setIsOpenConfigModal(false)
              setCurrentFormTemplate(null)
            }}
            formTemplate={currentFormTemplate}
          />
        </div>
      </Flex>
      {/* {isPanelVisible && (
        <Search
          onFinish={onFinishSearch}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      )} */}
      {/* <NhomDanhMucDetail
        NhomDanhMuc={currentDetailNhomDanhMuc}
        isOpen={isOpenDetail}
        onClose={handleCloseDetail}
      /> */}
      <Card style={{ padding: '0px' }} className={classes.customCardShadow}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            bordered
            dataSource={formTemplates}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            pagination={false}
            loading={loading}
          />
        </div>
        <Pagination
          className="mt-2"
          total={dataPage?.totalCount}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} trong ${total} dữ liệu`
          }
          pageSize={pageSize}
          defaultCurrent={1}
          onChange={(e) => {
            setPageIndex(e)
          }}
          onShowSizeChange={(current, pageSize) => {
            setPageIndex(current)
            setPageSize(pageSize)
          }}
          size="small"
          align="end"
        />
      </Card>
    </>
  )
}

export default withAuthorization(NhomDanhMuc, '')
