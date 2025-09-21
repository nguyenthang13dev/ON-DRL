'use client'
import Flex from '@/components/shared-components/Flex'
import { tableNhomDanhMucDataType } from '@/types/nhomDanhMuc/nhomDanhMuc'
import {
  DropdownOption,
  Response,
  ResponsePageInfo,
  ResponsePageList,
} from '@/types/general'
import withAuthorization from '@/libs/authentication'
import { setIsLoading } from '@/store/general/GeneralSlice'
import { useSelector } from '@/store/hooks'
import { AppDispatch } from '@/store/store'
import {
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Dropdown,
  FormProps,
  Menu,
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
import AutoBreadcrumb from '@/components/util-compenents/Breadcrumb'
import { toast } from 'react-toastify'
import {
  FormDeclaration,
  FormDeclarationSearch,
} from '@/types/formDeclaration/formDeclaration'
import { formDeclarationService } from '@/services/formDeclaration/formDeclaration.service'
import { formTemplateService } from '@/services/formTemplate/formTemplate.service'
import CreateOrUpdate from './createOrUpdate'

const Declaration: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [templateOptions, setTemplateOptions] = useState<MenuProps['items']>([])
  const [currentTemplateId, setCurrentTemplateId] = useState<string>('')
  const [formDeclarations, setFormDeclarations] = useState<FormDeclaration[]>(
    []
  )
  const [currentDeclaration, setCurrentDeclaration] =
    useState<FormDeclaration | null>(null)
  const [dataPage, setDataPage] = useState<ResponsePageInfo>()
  const [pageSize, setPageSize] = useState<number>(20)
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false)
  const [searchValues, setSearchValues] =
    useState<FormDeclarationSearch | null>(null)
  const loading = useSelector((state) => state.general.isLoading)

  //state for modal
  const [isOpenCreateUpdate, setIsOpenCreateUpdate] = useState<boolean>(false)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isOpenConfigModal, setIsOpenConfigModal] = useState<boolean>(false)
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false)
  const [openPopconfirmId, setOpenPopconfirmId] = useState<string | null>(null)

  const tableColumns: TableProps<FormDeclaration>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên kê khai',
      dataIndex: 'name',
      render: (_: any, record: FormDeclaration) => <span>{record.name}</span>,
    },
    {
      title: 'Người kê khai',
      dataIndex: 'name',
      render: (_: any, record: FormDeclaration) => <span>{record.name}</span>,
    },
    {
      title: 'Tên kê khai',
      dataIndex: 'name',
      render: (_: any, record: FormDeclaration) => (
        <span>{record.declarant}</span>
      ),
    },
    {
      title: 'Thao tác',
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      render: (_: any, record: FormDeclaration) => {
        const items: MenuProps['items'] = [
          {
            label: 'Xem',
            key: '1',
            icon: <SettingOutlined />,
            onClick: () => {
              // setIsOpenConfigModal(true)
              // setCurrentFormTemplate(record)
            },
          },
          {
            label: 'Chỉnh sửa',
            key: '2',
            icon: <EditOutlined />,
            onClick: () => {
              // handleShowCreateUpdateModal(true, record)
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
            // onClick: () => setOpenPopconfirmId(record.id ?? ''),
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
                // handleDelete(record.id || '')
                setOpenPopconfirmId(null)
              }}
              onCancel={() => setOpenPopconfirmId(null)}
            ></Popconfirm>
          </>
        )
      },
    },
  ]

  // const hanleCreateEditSuccess = () => {
  //   handleGetFormTemplates()
  //   setCurrentFormTemplate(null)
  // }

  // const handleDelete = async (id: string) => {
  //   try {
  //     const response = await formTemplateService.Delete(id)
  //     if (response.status) {
  //       toast.success('Xóa thành công')
  //       handleGetFormTemplates()
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

  // const onFinishSearch: FormProps<FormTemplateSearch>['onFinish'] = async (
  //   values
  // ) => {
  //   try {
  //     setSearchValues(values)
  //     await handleGetFormTemplates(values)
  //   } catch (error) {
  //     console.error('Lỗi khi lưu dữ liệu:', error)
  //   }
  // }

  const handleGetTemplates = async () => {
    try {
      const response: Response = await formTemplateService.GetDropdown()
      if (response != null && response.data != null) {
        const data: DropdownOption[] = response.data
        const options = data.map((item) => ({
          label: item.label,
          key: item.value,
        }))
        setTemplateOptions(options)
      } else {
        setTemplateOptions([])
      }
    } catch (error) {
      setTemplateOptions([])
    }
  }

  const handleGetDeclarations = useCallback(
    async (searchDataOverride?: FormDeclarationSearch) => {
      dispatch(setIsLoading(true))
      try {
        const searchData = searchDataOverride || {
          pageIndex,
          pageSize,
          ...(searchValues || {}),
        }
        const response: Response = await formDeclarationService.getDataByPage(
          searchData
        )
        if (response != null && response.data != null) {
          const data: ResponsePageList = response.data
          const items: FormDeclaration[] = data.items
          setFormDeclarations(items)
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

  const handleShowCreateUpdateModal = (
    isEdit?: boolean,
    currentDeclaration?: FormDeclaration
  ) => {
    setIsOpenCreateUpdate(true)
    if (isEdit) {
      setCurrentDeclaration(currentDeclaration ?? null)
    }
  }

  // Define handleSelectFormType function

  useEffect(() => {
    handleGetDeclarations()
    handleGetTemplates()
  }, [handleGetDeclarations])

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
          <Dropdown
            overlay={
              <Menu
                onClick={({ key }) => {
                  setCurrentTemplateId(key)
                  setIsOpenCreateUpdate(true)
                }}
                items={templateOptions}
              />
            }
            trigger={['click']}
          >
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              size="small"
              style={{ marginLeft: 8 }}
            >
              Thêm mới
            </Button>
          </Dropdown>
          <CreateOrUpdate
            isOpen={isOpenCreateUpdate}
            templateId={currentTemplateId}
            currentDeclaration={currentDeclaration}
            onSuccess={() => {
              setIsOpenCreateUpdate(false)
              setCurrentDeclaration(null)
              setCurrentTemplateId('')
              handleGetDeclarations()
            }}
            onClose={() => {
              setIsOpenCreateUpdate(false)
              setCurrentDeclaration(null)
              setCurrentTemplateId('')
            }}
          />

          {/* {isOpenModal && <TemplatePreviewPage />} */}
          {/* <FormTemplateConfig
            isOpen={isOpenConfigModal}
            onClose={() => {
              setIsOpenConfigModal(false)
              setCurrentFormTemplate(null)
            }}
            formTemplate={currentFormTemplate}
            handleAfterUpdateTemplateFields={handleAfterUpdateTemplateFields}
          /> */}
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
            dataSource={formDeclarations}
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

export default withAuthorization(Declaration, '')
