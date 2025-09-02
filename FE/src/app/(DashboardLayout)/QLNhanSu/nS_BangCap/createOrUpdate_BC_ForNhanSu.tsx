import React, { use, useEffect, useState } from "react";
import {
  Form,
  FormProps,
  Input,
  Select,
  DatePicker,
  Modal,
  Space,
  Button,
} from "antd";
import { toast } from "react-toastify";
import {
  NS_BangCapCreateOrUpdateType,
  NS_BangCapType,
} from "@/types/QLNhanSu/nS_BangCap/nS_BangCap";
import nS_BangCapService from "@/services/QLNhanSu/nS_BangCap/nS_BangCapService";
import dayjs from "dayjs";
import { DropdownOption } from "@/types/general";
import { duLieuDanhMucService } from "@/services/duLieuDanhMuc/duLieuDanhMuc.service";
import NhomDanhMucConstant from "@/constants/NhomDanhMucConstant";
import nS_NhanSuService from "@/services/QLNhanSu/nS_NhanSu/nS_NhanSuService";
import { NS_NhanSuType } from "@/types/QLNhanSu/nS_NhanSu/nS_NhanSu";
import { nhomDanhMucService } from "@/services/nhomDanhMuc/nhomDanhMuc.service";
import { PlusOutlined } from "@ant-design/icons";
import CreateOrUpdateNoiCap from "./createOrUpdateNoiCap";

interface Props {
  item?: NS_BangCapType | null;
  onClose: () => void;
  onSuccess: () => void;
  nhanSuId: string;
}

const NS_BangCapCreateOrUpdateForNhanSu: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<NS_BangCapCreateOrUpdateType>();
  const [trinhDoOptions, setTrinhDoOptions] = useState<DropdownOption[]>([]);
  const [schoolOptions, setSchoolOptions] = useState<DropdownOption[]>([]);
  const [userData, setUserData] = useState<NS_NhanSuType | null>(null);
  const [groupId, setGroupId] = useState<string | null>();
  const [isOpenCreateNoiCap, setIsOpenCreateNoiCap] = useState<boolean>(false);
  const [selectedTrinhDoId, setSelectedTrinhDoId] = useState<string>("");

  const handleOnFinish: FormProps<NS_BangCapCreateOrUpdateType>["onFinish"] =
    async (formData) => {
      console.log("Giá trị nơi cấp:", formData.noiCap);
      const payload = {
        ...formData,
        nhanSuId: props.nhanSuId,
      };
      if (props.item) {
        const response = await nS_BangCapService.update(payload);
        if (response.status) {
          toast.success("Chỉnh sửa thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await nS_BangCapService.create(payload);
        console.log(formData);
        if (response.status) {
          toast.success("Thêm mới thành công");
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

  //Get Detail Staff
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await nS_NhanSuService.getDetail(props.nhanSuId);
      if (response.status) {
        setUserData(response.data);
      }
      try {
        if (props.item) {
          form.setFieldsValue({
            ...props.item,
            ngayCap: props.item.ngayCap ? dayjs(props.item.ngayCap) : null,
          });
        } else {
          form.setFieldsValue({ nhanSuId: props.nhanSuId });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
      }
    };
    fetchUserData();
  }, [form, props.item, props.nhanSuId]);

  const getGroupId = async () => {
    try {
      const response = await nhomDanhMucService.GetDataByGroupCode(
        NhomDanhMucConstant.TrinhDoHocVan
      );
      if (response.status) {
        setGroupId(response.data.id);
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu nhóm danh mục");
    }
  };
  //Get All School By Education Level
  const loadSchoolOptions = async (trinhDoId: string) => {
    try {
      const response = await duLieuDanhMucService.GetDropDownByDonViId(
        trinhDoId
      );
      if (response.status) {
        setSchoolOptions(
          response.data.map((item: any) => ({
            value: item.label,
            label: item.label,
          }))
        );
      }
    } catch (error) {
      toast.error(
        "Lỗi khi tải dữ liệu trường học! Vui lòng chọn trình độ học vấn"
      );
    }
  };
  //Get DropDown Data Education Level
  useEffect(() => {
    const fetchTrinhDo = async () => {
      try {
        const response = await duLieuDanhMucService.GetDropdown(
          NhomDanhMucConstant.TrinhDoHocVan
        );
        if (response.status) {
          setTrinhDoOptions(
            response.data.map((item: any) => ({
              value: item.value,
              label: item.label,
            }))
          );
        }
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu trình độ");
      }
    };
    fetchTrinhDo();
    getGroupId();
  }, []);
  return (
    <>
      <Modal
        title={props.item != null ? "Chỉnh sửa bằng cấp" : "Thêm mới bằng cấp"}
        open={true}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Đóng"
        width={600}
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
            <Form.Item<NS_BangCapCreateOrUpdateType> name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item<NS_BangCapCreateOrUpdateType>
            label="Trình độ"
            name="trinhDoId"
            rules={[
              { required: true, message: "Vui lòng nhập thông tin này!" },
            ]}
          >
            <Select
              placeholder="Chọn trình độ"
              options={trinhDoOptions.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
              allowClear
              showSearch
              optionFilterProp="label"
              onChange={async (value) => {
                setSelectedTrinhDoId(value);
                await loadSchoolOptions(value);
              }}
            />
          </Form.Item>
          <Form.Item<NS_BangCapCreateOrUpdateType>
            label="Ngày cấp"
            name="ngayCap"
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-100"
              placeholder="Ngày cấp"
            />
          </Form.Item>
          <Form.Item<NS_BangCapCreateOrUpdateType>
            label="Nơi cấp"
            name="noiCap"
            rules={[
              { required: true, message: "Vui lòng nhập thông tin này!" },
            ]}
          >
            <Space.Compact style={{ width: "100%" }}>
              <Form.Item name="noiCap" noStyle>
                <Select
                  placeholder="Chọn nơi cấp"
                  options={schoolOptions}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  style={{ width: "calc(100% - 32px)" }}
                />
              </Form.Item>
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  if (!selectedTrinhDoId) {
                    toast.error("Vui lòng chọn trình độ trước!");
                    return;
                  }
                  setIsOpenCreateNoiCap(true);
                }}
              />
            </Space.Compact>
          </Form.Item>
          <Form.Item<NS_BangCapCreateOrUpdateType>
            label="Ghi chú"
            name="ghiChu"
          >
            <Input placeholder="Ghi chú" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm mới nơi cấp */}
      {isOpenCreateNoiCap && groupId && (
        <CreateOrUpdateNoiCap
          isOpen={isOpenCreateNoiCap}
          groupId={groupId}
          trinhDoId={selectedTrinhDoId}
          onClose={() => setIsOpenCreateNoiCap(false)}
          onSuccess={async () => {
            setIsOpenCreateNoiCap(false);
            // Reload lại danh sách nơi cấp
            await loadSchoolOptions(selectedTrinhDoId);
          }}
        />
      )}
    </>
  );
};
export default NS_BangCapCreateOrUpdateForNhanSu;
