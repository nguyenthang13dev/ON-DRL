import React, { useEffect, useState } from "react";
import { Form, FormProps, Input, Select, DatePicker, Modal, Tag } from "antd";
import { toast } from "react-toastify";
import {
  DA_NoiDungCuocHopCreateOrUpdateType,
  DA_NoiDungCuocHopType,
} from "@/types/dA_DuAn/dA_NoiDungCuocHop";
import {
  TaiLieuDinhKemSearch,
  TaiLieuDinhKem,
} from "@/types/taiLieuDinhKem/taiLieuDinhKem";

import dayjs from "dayjs";
import dA_NoiDungCuocHopService from "@/services/dA_DuAn/dA_NoiDungCuocHopService";
import dynamic from "next/dynamic";
import UploadFiler, { CustomUploadFile } from "@/libs/UploadFilter";
import { UploadFile, UploadFileStatus } from "antd/es/upload/interface";
import { DropdownOption } from "@/types/general";
import TaiLieuDinhKemService from "@/services/taiLieuDinhKem/taiLieuDinhKem.service";

const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
interface Props {
  item?: DA_NoiDungCuocHopType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DA_NoiDungCuocHopCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const GetDropDownUser = (): Promise<DropdownOption[]> => {
    return dA_NoiDungCuocHopService
      .getDropDownUser()
      .then((response) => {
        return response.data as DropdownOption[];
      })
      .catch((error) => {
        //console.error("Lỗi khi gọi API, sử dụng dữ liệu mock", error);
        return [{ label: "Không có dữ liệu", value: "" }];
      });
  };
  const [thanhPhan, setThanhPhanOptions] = useState<DropdownOption[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  useEffect(() => {
    GetDropDownUser().then((data) => {
      setThanhPhanOptions(data);
    });
  }, []);

  const [searchValues, setSearchValues] = useState<TaiLieuDinhKemSearch | {}>(
    {}
  );
  const [form] = Form.useForm<DA_NoiDungCuocHopCreateOrUpdateType>();
  const [fileList, setFileList] = useState<CustomUploadFile[]>([]);
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]); // Danh sách ID
  const handleSubmit = async (
    formData: DA_NoiDungCuocHopCreateOrUpdateType
  ) => {
    try {
      const isEdit = Boolean(props.item?.id);

      formData.taiLieuDinhKem = uploadedFileIds.join(","); // Chuyển đổi mảng ID thành chuỗi
      //console.log("Form Dataa: ", formData);

      // 2. Gửi dữ liệu form chính (không bao gồm files)
      const mainResponse = isEdit
        ? await dA_NoiDungCuocHopService.update(formData)
        : await dA_NoiDungCuocHopService.create(formData);

      //console.log("Kết quả tạo mới/cập nhật:", mainResponse);

      if (!mainResponse.status) {
        toast.error(mainResponse.message);
        return;
      }
      toast.success(isEdit ? "Chỉnh sửa thành công" : "Thêm mới thành công");
      form.resetFields();
      setFileList([]);
      props.onSuccess();
      props.onClose();
    } catch (error: any) {
      console.error("Lỗi khi xử lý:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xử lý dữ liệu");

      setFileList([]);
    }
  };
  useEffect(() => {
    const currentValue = form.getFieldValue("thanhPhanThamGia"); // dạng "a,b,c"
    if (currentValue) {
      const splitValues = currentValue.split(",").filter(Boolean);
      setSelectedValues(splitValues);
    }
  }, []);
  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    props.onClose();
  };

  React.useEffect(() => {
    if (props.item?.listTaiLieu && Array.isArray(props.item.listTaiLieu)) {
      const fileListMapped: UploadFile[] = props.item.listTaiLieu.map(
        (file) => ({
          uid: file.id,
          name: file.tenTaiLieu,
          status: "done" as UploadFileStatus,
          url: `${StaticFileUrl}/${file.duongDanFile}`,
        })
      );
      setFileList(fileListMapped);
    }
    if (props.item) {
      const searchObj: TaiLieuDinhKemSearch = {
        item_ID: props.item.id || "",
        loaiTaiLieu: "NoiDungCuocHop",
        tenTaiLieu: "",
        dinhDangFile: "",
      };
      setSearchValues(searchObj);
      const response = TaiLieuDinhKemService.getData(searchObj);
      response
        .then((res) => {
          if (res.status) {
            const taiLieuList: TaiLieuDinhKem[] = Array.isArray(res.data?.items)
              ? res.data.items
              : [];
            const fileList: CustomUploadFile[] = taiLieuList.map((item) => ({
              uid: item.id,
              name: item.tenTaiLieu,
              status: "done",
              url: `${StaticFileUrl}/${item.duongDanFile}`,
              id: item.id, // Lưu ID để sử dụng sau này
            }));
            if (props.item?.id) {
              setFileList(fileList);
              setUploadedFileIds(taiLieuList.map((item) => item.id));
            } else {
              setFileList([]);
              setUploadedFileIds([]);
            }
          } else {
            toast.error(res.message);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải tài liệu:", error);
          toast.error("Lỗi khi tải tài liệu");
        });
      form.setFieldsValue({
        ...props.item,
        tenDuAn: props.item.tenDuAn || "",
        duAnId: props.item.duAnId || "",
        thoiGianHop: props.item.thoiGianHop
          ? dayjs(props.item.thoiGianHop)
          : null,
        listTaiLieu: fileList,
      });
    } else {
      form.setFieldsValue({
        isNoiBo: true,
        listTaiLieu: fileList,
      });
    }
  }, [props.item]);

  return (
    <Modal
      title={
        props.item != null && Boolean(props.item?.id)
          ? "Chỉnh sửa"
          : "Thêm mới nội dung cuộc họp"
      }
      open={true}
      onOk={() => {
        form
          .validateFields()
          .then(handleSubmit)
          .catch((info) => console.log("Validate Failed:", info));
      }}
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
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item name="id" hidden={true}>
          <Input hidden />
        </Form.Item>
        <Form.Item name="tenDuAn" hidden={true}>
          <Input hidden />
        </Form.Item>
        <Form.Item name="duAnId" hidden={true}>
          <Input hidden />
        </Form.Item>

        {/* Dòng 1: Thành phần tham gia */}
        <Form.Item
          label={<strong>Thành phần tham gia</strong>}
          name="thanhPhanThamGia" // đây là name để form quản lý
          rules={[{ required: true, message: "Vui lòng chọn thành phần!" }]}
          getValueProps={(value) => ({
            value: (value || "").split(",").filter(Boolean),
          })}
          getValueFromEvent={(values) => values.join(",")} // trả về dạng chuỗi a,b,c
        >
          <Select
            mode="multiple"
            placeholder="Chọn thành phần"
            options={thanhPhan} // [{ label: "...", value: "..." }]
            tagRender={(props) => (
              <Tag color="orange" closable onClose={props.onClose}>
                {props.label}
              </Tag>
            )}
          />
        </Form.Item>

        {/* Dòng 2: Loại cuộc họp + Thời gian họp */}
        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            label={<strong>Loại cuộc họp</strong>}
            name="isNoiBo"
            rules={[{ required: true, message: "Chọn đối tượng!" }]}
            style={{ flex: 1 }}
          >
            <Select placeholder="Chọn đối tượng">
              <Select.Option value={true}>Nội bộ</Select.Option>
              <Select.Option value={false}>Họp với khách hàng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<strong>Thời gian họp</strong>}
            name="thoiGianHop"
            rules={[
              { required: true, message: "Vui lòng nhập thông tin này!" },
            ]}
            style={{ flex: 1 }}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Thời gian họp"
            />
          </Form.Item>
        </div>

        {/* Dòng 3: Địa điểm */}
        <Form.Item
          label={<strong>Địa điểm họp</strong>}
          name="diaDiemCuocHop"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <Input placeholder="Địa điểm họp" />
        </Form.Item>

        {/* Dòng 4: File */}
        <Form.Item label={<strong>File đính kèm</strong>}>
          <UploadFiler
            maxFiles={10}
            fileList={fileList}
            setFileList={setFileList}
            type="NoiDungCuocHop"
            setUploadedData={setUploadedFileIds}
          />
        </Form.Item>
        <Form.Item
          label={<strong>Nội dung họp</strong>}
          name="noiDungCuocHop"
          rules={[{ required: true, message: "Vui lòng nhập thông tin này!" }]}
        >
          <ReactQuill theme="snow" style={{ height: 250 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default DA_NoiDungCuocHopCreateOrUpdate;
