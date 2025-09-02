import { removeAccents } from "@/libs/CommonFunction";
import arcFontService from "@/services/arcFont/arcFontService";
import
  {
    ArcFontCreateOrUpdateType,
    ArcFontType,
  } from "@/types/arcFont/arcFont";
import { Dictionary, DropdownOption, DropdownTreeOptionAntd } from "@/types/general";
import * as extensions from "@/utils/extensions";
import { Col, Form, FormProps, Input, Modal, Row, Select } from "antd";
import TreeSelect from "antd/lib/tree-select";
import React from "react";
import { toast } from "react-toastify";
import OtherTypesBlock from "./Components/otherTypesBlock";

interface Props {
  item?: ArcFontType | null;
  onClose: () => void;
  onSuccess: () => void;
  departmentDropdown: DropdownTreeOptionAntd[];
}

const ArcFontCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<ArcFontCreateOrUpdateType>();
  const [dropdowns, setDropdown] = React.useState<Dictionary<DropdownOption[]>>(
    {}
  );

  const handleOnFinish: FormProps<ArcFontCreateOrUpdateType>["onFinish"] =

    async (formData: ArcFontCreateOrUpdateType) => {
      //join data từ lstOtherTypes to string
      const otherTypesFormatted = (formData.lstOtherTypes || []).map(
        (item: any) =>
          `#${item.loaiTaiLieu}:${item.soLuong}:${item.donViTinh}#`
      )
        .join(',');

      //join data từ lstLanguage to string
      const languageFormatted = (formData.lstLanguage || []).join(',');

      //add data archivesTimeStart - archivesTimeEnd = ArchivesTime
      formData.archivesTime = `${formData.archivesTimeStart}-${formData.archivesTimeEnd}`;
      formData.otherTypes = otherTypesFormatted;
      formData.language = languageFormatted;
      if (props.item) {
        const response = await arcFontService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa  thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await arcFontService.create(formData);
        if (response.status) {
          toast.success("Thêm mới  thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      }
    };

  const handleCancel = () => {
    form.resetFields();
    props.onClose();
  };


  React.useEffect(() => {
    //GetDropdown
    async function fetchDropdowns() {
      const dropdownResponse = await arcFontService.getDropdowns();
      if (dropdownResponse.status) {
        setDropdown(dropdownResponse.data);
        console.log(dropdownResponse);
        //fetch dropdown Ngôn ngữ
        if (!props.item) {
          form.setFieldValue("lstLanguage",
            extensions.getDropdownOptionSelected(
              dropdownResponse.data["Lang"]
            )
          );

          form.setFieldValue("lookupTools",
            extensions.getDropdownOptionSelected(
              dropdownResponse.data["CCTC"]
            )
          );

        }
      }
    };

    fetchDropdowns();
    function parseOtherTypesString(input?: string) {
      if (!input) return [];
      return input
        .split(",")
        .map((item) => item.replace(/^#|#$/g, "")) // remove #
        .map((item) => {
          const [loaiTaiLieu, soLuongStr, donViTinh] = item.split(":");
          return {
            loaiTaiLieu,
            soLuong: parseInt(soLuongStr),
            donViTinh,
          };
        });
    }

    //end
    //Set value to form Edit 
    if (props.item) {
      form.setFieldsValue({
        ...props.item,
        lstLanguage: props.item.language?.split(",") || [],
        lstOtherTypes: parseOtherTypesString(props.item.otherTypes)
      });
    }
  }, [form, props.item]);

  const validateOrganId = async ({ value, id }: { value: string; id?: string; }) => {
    try {
      const response = await arcFontService.checkOrganIdExists(value, id);
      return response; // Giả sử API trả về { exists: true/false }
    } catch (error) {
      console.error('Error checking organId:', error);
      return false; // Xử lý lỗi nếu cần
    }
  };

  // useEffect(() => {
  //   console.log(props.departmentDropdown)
  // })
  return (
    <Modal
      title={
        props.item != null
          ? "Chỉnh sửa "
          : "Thêm mới "
      }
      open={true}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      width="50%"

    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdate"
        style={{ maxWidth: 1000 }}
        onFinish={handleOnFinish}
        autoComplete="off"

      >
        {props.item && (
          <Form.Item<ArcFontCreateOrUpdateType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        {
          <>
            <Form.Item<ArcFontCreateOrUpdateType>
              label="Mã cơ quan lưu trữ"
              name="identifier"
              className="w-full"
              rules={[
                { required: true, message: "Vui lòng nhập thông tin này!" },
              ]}
            >
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                value={props.item?.identifier}
                placeholder="Chọn phòng ban"
                allowClear
                treeDefaultExpandAll
                treeData={props.departmentDropdown}
                treeNodeFilterProp="title"
              />

            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<ArcFontCreateOrUpdateType>
                  label="Tên phông lưu trữ"
                  name="fondName"
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin này!" },
                  ]}
                >
                  <Input placeholder="Tên phông lưu trữ" />

                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<ArcFontCreateOrUpdateType>
                  label="Mã phông lưu trữ"
                  name="organId"
                  className="w-full"
                  rules={[
                    { required: true, message: 'Vui lòng nhập thông tin này!' },
                    () => ({
                      async validator(_, value) {
                        const res = validateOrganId({ value, id: props.item?.id });
                        if (await res) {
                          return Promise.reject("Mã phông đã tồn tại!");
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  validateTrigger="onChange"
                >
                  <Input placeholder="Mã phông lưu trữ" />
                </Form.Item>

              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<ArcFontCreateOrUpdateType>
                  label="Năm bắt đầu"
                  name="archivesTimeStart"
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin này!" },
                    { pattern: /^[0-9]{4}$/, message: "Năm bắt đầu phải có đúng 4 chữ số!" }
                  ]}
                >
                  <Input placeholder="Năm bắt đầu"
                    type="number"
                    min={0} />

                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<ArcFontCreateOrUpdateType>
                  label="Năm kết thúc"
                  name="archivesTimeEnd"
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin này!" },
                    { pattern: /^[0-9]{4}$/, message: "Năm bắt đầu phải có đúng 4 chữ số!" }
                  ]}
                >
                  <Input placeholder="Năm kết thúc"
                    type="number"
                    min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<ArcFontCreateOrUpdateType>
                  label="Tổng số tài liệu giấy"
                  name="paperTotal"
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin này!" },
                  ]}
                >
                  <Input placeholder="Tổng số tài liệu giấy"
                    type="number"
                    min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<ArcFontCreateOrUpdateType>
                  label="Số lượng tài liệu giấy đã số hóa"
                  name="paperDigital"
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin này!" },
                  ]}
                >
                  <Input placeholder="Số lượng tài liệu giấy đã số hóa"
                    type="number"
                    min={0} />
                </Form.Item></Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<ArcFontCreateOrUpdateType>
                  label="Ngôn ngữ"
                  name="lstLanguage"
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin này!" },
                  ]}
                >
                  <Select placeholder="Ngôn ngữ"
                    mode="multiple"
                    options={dropdowns["Lang"]}
                    allowClear
                    showSearch
                    filterOption={(input, option) => {
                      return removeAccents(option?.label ?? "")
                        .toLowerCase()
                        .includes(removeAccents(input).toLowerCase());
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<ArcFontCreateOrUpdateType>
                  label="Lịch sử đơn vị"
                  name="fondHistory"
                >
                  <Input placeholder="" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<ArcFontCreateOrUpdateType>
                  label="Nhóm tài liệu"
                  name="keyGroups"
                >
                  <Input placeholder="Nhóm tài liệu" />
                </Form.Item>
              </Col>
              <Col span={12}>

              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item<ArcFontCreateOrUpdateType>
                  label="Công cụ tra cứu"
                  name="lookupTools"
                >
                  <Select placeholder=""
                    options={dropdowns["CCTC"]}
                    allowClear
                    showSearch
                    filterOption={(input, option) => {
                      return removeAccents(option?.label ?? "")
                        .toLowerCase()
                        .includes(removeAccents(input).toLowerCase());
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<ArcFontCreateOrUpdateType>
                  label="Số lượng trang tài liệu đã lập bản sao"
                  name="copyNumber"
                >
                  <Input placeholder="" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item<ArcFontCreateOrUpdateType>
              label="Ghi chú"
              name="description"
            >
              <Input placeholder="Ghi chú" />
            </Form.Item>

            <OtherTypesBlock
              loaiOptions={dropdowns['LTL']}
              donViOptions={dropdowns['DVT']}
            />



          </>
        }
      </Form>
    </Modal >
  );
};
export default ArcFontCreateOrUpdate;
