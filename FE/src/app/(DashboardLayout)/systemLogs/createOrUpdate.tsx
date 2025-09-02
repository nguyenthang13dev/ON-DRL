import React from "react";
import { Form, FormProps, Input, Select, DatePicker, Modal } from "antd";
import { toast } from "react-toastify";
import {
  SystemLogsCreateOrUpdateType,
  SystemLogsType,
} from "@/types/systemLogs/systemLogs";
import * as extensions from "@/utils/extensions";
import systemLogsService from "@/services/systemLogs/systemLogsService";
import { Dictionary, DropdownOption } from "@/types/general";
interface Props {
  item?: SystemLogsType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SystemLogsCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<SystemLogsCreateOrUpdateType>();
  const [dropdowns, setDropdown] = React.useState<Dictionary<DropdownOption[]>>({});
  const handleOnFinish: FormProps<SystemLogsCreateOrUpdateType>["onFinish"] =
    async (formData: SystemLogsCreateOrUpdateType) => {
      if (props.item) {
        console.log(props);
        const response = await systemLogsService.update(formData);
        if (response.status) {
          toast.success("Chỉnh sửa  thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await systemLogsService.create(formData);
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
    		async function fetchDropdowns() {
			const dropdownResponse = await systemLogsService.getDropdowns();
			if (dropdownResponse.status) {
				setDropdown(dropdownResponse.data);
			}
		}
		fetchDropdowns();

    if (props.item) {
      form.setFieldsValue({
        ...props.item,
      });
    }
  }, [form, props.item]);

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
          <Form.Item<SystemLogsCreateOrUpdateType> name="id" hidden>
            <Input />
          </Form.Item>
        )}
        {
          <>
            <Form.Item<SystemLogsCreateOrUpdateType>
							label="Id tài khoản"
							name="userId"
							>
							<Select placeholder="Id tài khoản" options={dropdowns["AppUser"]} />
						</Form.Item>
						<Form.Item<SystemLogsCreateOrUpdateType>
							label="Tên tài khoản"
							name="userName"
							>
							<Input placeholder="Tên tài khoản"/>
						</Form.Item>
						<Form.Item<SystemLogsCreateOrUpdateType>
							label="Thời gian"
							name="timestamp"
							>
							<DatePicker format="DD/MM/YYYY" className="w-100" placeholder="Thời gian"/>
						</Form.Item>
						<Form.Item<SystemLogsCreateOrUpdateType>
							label="Địa chỉ Ip"
							name="iPAddress"
							>
							<Input placeholder="Địa chỉ Ip"/>
						</Form.Item>
						<Form.Item<SystemLogsCreateOrUpdateType>
							label="Loại"
							name="level"
							>
							<Select placeholder="Loại" options={dropdowns["LogLevel"]} />
						</Form.Item>
						<Form.Item<SystemLogsCreateOrUpdateType>
							label="Nội dung"
							name="message"
							>
							<Input placeholder="Nội dung"/>
						</Form.Item>
          </>
        }
      </Form>
    </Modal>
  );
};
export default SystemLogsCreateOrUpdate;
