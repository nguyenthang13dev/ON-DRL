import {
  createEditType,
  tableNP_DangKyNghiPhepDataType,
  ThongTinNghiPhepType,
} from "@/types/NP_DangKyNghiPhep/NP_DangKyNghiphep";
import {
  Form,
  FormProps,
  Input,
  Modal,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import { nP_DangKyNghiPhepService } from "@/services/NghiPhep/NP_DangKyNghiPhep/NP_DangKyNghiPhep.service";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DropdownOption } from "@/types/general";
import { calculateWorkingDays } from "@/libs/CommonFunction";
import { tableNP_LoaiNghiPhepDataType } from "@/types/NP_LoaiNghiPhep/np_LoaiNghiPhep";
import nS_NhanSuService from "@/services/QLNhanSu/nS_NhanSu/nS_NhanSuService";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Props {
  isOpen: boolean;
  NP_DangKyNghiPhep?: tableNP_DangKyNghiPhepDataType | null;
  listLoaiNghiPhep?: tableNP_LoaiNghiPhepDataType[];
  onClose: () => void; //function callback
  onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const dateFormat = "DD/MM/YYYY";
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const [dropdownLoaiNP, setDropdownLoaiNP] = useState<DropdownOption[]>([]);
  const [thongTinNghiPhep, setThongTinNghiPhep] =
    useState<ThongTinNghiPhepType>();

  const [listNhanSu, setListNhanSu] = useState<DropdownOption[]>([]);

  const handleOnFinish: FormProps<createEditType>["onFinish"] = async (
    formData: createEditType
  ) => {
    try {
      const [tuNgayRaw, denNgayRaw] = formData.khoangNgayNghi || [];
      const tuNgay = dayjs(tuNgayRaw);
      const denNgay = dayjs(denNgayRaw);
      const payload: createEditType = {
        ...formData,
        tuNgay: tuNgay.toDate(),
        denNgay: denNgay.toDate(),
      };
      delete payload.khoangNgayNghi;
      if (props.NP_DangKyNghiPhep) {
        const response = await nP_DangKyNghiPhepService.Update(payload);
        if (response.status) {
          toast.success("Chỉnh sửa thành công");
          form.resetFields();
          setIsOpen(false);
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await nP_DangKyNghiPhepService.Create(payload);
        if (response.status) {
          toast.success("Thêm mới thành công");
          form.resetFields();
          setIsOpen(false);
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    }
  };

  const handleMapEdit = () => {
    const data = props.NP_DangKyNghiPhep;
    if (data) {
      const formData: createEditType = {
        ...data,
        khoangNgayNghi: [
          data.tuNgay ? dayjs(data.tuNgay) : dayjs(),
          data.denNgay ? dayjs(data.denNgay) : dayjs(),
        ],
      };
      form.setFieldsValue(formData);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    props.onClose();
  };

  const handleChangeKhoangThoiGian = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      const valLoaiNghiPhep = form.getFieldValue("maLoaiPhep");

      const loaiNghiPhep = props.listLoaiNghiPhep?.find(
        (item) => item.maLoaiPhep === valLoaiNghiPhep
      );

      if (loaiNghiPhep && loaiNghiPhep.soNgayMacDinh !== undefined) {
        if (
          loaiNghiPhep.soNgayMacDinh < 1 &&
          dates[0].isSame(dates[1], "day")
        ) {
          form.setFieldsValue({ soNgayNghi: loaiNghiPhep.soNgayMacDinh });
        } else {
          const soNgay = calculateWorkingDays(dates[0], dates[1]);
          form.setFieldsValue({ soNgayNghi: soNgay });
        }
      }
    } else {
      form.setFieldsValue({ soNgayNghi: undefined });
    }
  };

  const handleGetSoNgayPhep = async () => {
    try {
      const res = await nP_DangKyNghiPhepService.GetSoNgayPhep();
      setThongTinNghiPhep(res.data);
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleGetNhanSu = async () => {
    try {
      const res = await nS_NhanSuService.getDropdowns();
      setListNhanSu(res.data || []);
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    if (props.isOpen) {
      handleGetSoNgayPhep();
      handleGetNhanSu();
      setIsOpen(props.isOpen);
      if (props.NP_DangKyNghiPhep) {
        handleMapEdit();
      }

      if (props.listLoaiNghiPhep != null && props.listLoaiNghiPhep.length > 0) {
        const dropdown: DropdownOption[] = props.listLoaiNghiPhep.map(
          (item) => ({
            label: item.tenLoaiPhep,
            value: item.maLoaiPhep ?? "",
          })
        );
        setDropdownLoaiNP(dropdown);
      }
    }
  }, [props.isOpen]);

  return (
    <Modal
      title={
        props.NP_DangKyNghiPhep != null
          ? "Chỉnh sửa đơn đăng ký nghỉ phép"
          : "Thêm mới đơn đăng ký nghỉ phép"
      }
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Xác nhận"
      cancelText="Đóng"
      width={600}
    >
      <div>
        Tổng số ngày phép: <b style={{color: "red"}}>{thongTinNghiPhep?.tongSoNgayPhep}</b>,
        Số ngày đã sử dụng: <b style={{color: "red"}}>{thongTinNghiPhep?.soNgayPhepDaSuDung}</b>,
        Số ngày phép còn lại: <b style={{color: "red"}}>{thongTinNghiPhep?.soNgayPhepConLai}</b>
      </div>
      <Form
        layout="vertical"
        form={form}
        name="formCreateUpdate"
        style={{ maxWidth: 1000 }}
        onFinish={handleOnFinish}
        autoComplete="off"
      >
        {props.NP_DangKyNghiPhep && (
          <Form.Item<createEditType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item<createEditType>
          label="Loại phép"
          name="maLoaiPhep"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Select
            onChange={(value) => {
              const loaiNghiPhep = props.listLoaiNghiPhep?.find(
                (item) => item.maLoaiPhep === value
              );
              form.setFieldsValue({ soNgayNghi: loaiNghiPhep?.soNgayMacDinh });
            }}
            options={dropdownLoaiNP}
            allowClear
            placeholder={"Chọn loại phép"}
          />
        </Form.Item>
        <Form.Item<createEditType>
          label="Thời gian nghỉ"
          name="khoangNgayNghi"
          rules={[
            {
              validator: (_, value) => {
                const formData = form.getFieldsValue();
                const { khoangNgayNghi, loaiPhep_Id } = formData;

                if (
                  !khoangNgayNghi ||
                  !khoangNgayNghi[0] ||
                  !khoangNgayNghi[1]
                ) {
                  return Promise.reject("Vui lòng nhập thông tin này!");
                }

                let soNgay = value;
                if (!soNgay || isNaN(soNgay)) {
                  const soNgayTinh = calculateWorkingDays(
                    khoangNgayNghi[0],
                    khoangNgayNghi[1]
                  );
                  soNgay = soNgayTinh;
                }

                if (soNgay <= 0) {
                  return Promise.reject("Số ngày nghỉ phải lớn hơn 0.");
                }

                const loaiNghiPhep = props.listLoaiNghiPhep?.find(
                  (item) => item.maLoaiPhep === loaiPhep_Id
                );

                if (loaiNghiPhep?.soNgayMacDinh !== undefined) {
                  if (
                    loaiNghiPhep.soNgayMacDinh < 1 &&
                    soNgay > 1 &&
                    soNgay > loaiNghiPhep.soNgayMacDinh
                  ) {
                    return Promise.reject(
                      `Không được vượt quá ${loaiNghiPhep.soNgayMacDinh} ngày (chỉ được nghỉ nửa ngày)`
                    );
                  } else if (
                    soNgay > 1 &&
                    soNgay > loaiNghiPhep.soNgayMacDinh
                  ) {
                    return Promise.reject(
                      `Không được vượt quá ${loaiNghiPhep.soNgayMacDinh} ngày`
                    );
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <RangePicker
            style={{ width: "100%" }}
            format={dateFormat}
            allowClear
            onChange={(dates) => {
              handleChangeKhoangThoiGian(dates);
            }}
          />
        </Form.Item>
        <Form.Item<createEditType>
          label="Lý do"
          name="lyDo"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <TextArea
            rows={4}
            showCount={true}
            placeholder="Giới hạn 255 ký tự"
            maxLength={255}
          />
        </Form.Item>
        <Form.Item<createEditType>
          label="Số ngày nghỉ"
          name="soNgayNghi"
          rules={[
            {
              validator: async (_, value) => {
                const { khoangNgayNghi, loaiPhep_Id } = form.getFieldsValue();

                if (
                  !khoangNgayNghi ||
                  !khoangNgayNghi[0] ||
                  !khoangNgayNghi[1]
                ) {
                  return Promise.reject("Vui lòng chọn khoảng thời gian nghỉ.");
                }

                let soNgay = value;
                if (!soNgay || isNaN(soNgay)) {
                  const soNgayTinh = calculateWorkingDays(
                    dayjs(khoangNgayNghi[0]),
                    dayjs(khoangNgayNghi[1])
                  );
                  form.setFieldsValue({ soNgayNghi: soNgayTinh });
                  soNgay = soNgayTinh;
                }

                if (soNgay <= 0) {
                  return Promise.reject("Số ngày nghỉ phải lớn hơn 0.");
                }

                const loaiNghiPhep = props.listLoaiNghiPhep?.find(
                  (item) => item.maLoaiPhep === loaiPhep_Id
                );
                if (
                  loaiNghiPhep?.soNgayMacDinh !== undefined &&
                  soNgay > 1 &&
                  soNgay > loaiNghiPhep.soNgayMacDinh
                ) {
                  return Promise.reject(
                    `Số ngày nghỉ không được vượt quá ${loaiNghiPhep.soNgayMacDinh} ngày.`
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item<createEditType>
          label="Người bàn giao công việc"
          name="maNhanSuBanGiao"
        >
          <Select
            options={listNhanSu}
            allowClear
            placeholder={"Chọn người bàn giao công việc"}
            showSearch={true}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item<createEditType>
          label="Công việc bàn giao"
          name="congViecBanGiao"
        >
          <TextArea
            rows={4}
            showCount={true}
            placeholder="Giới hạn 255 ký tự"
            maxLength={255}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateOrUpdate;
