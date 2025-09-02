import React, { useState } from "react";
import { Form, FormProps, Input, Select, DatePicker, Modal, Row, Col, InputNumber, Checkbox, UploadFile } from "antd";
import { toast } from "react-toastify";
import {
	ArcDocumentCreateOrUpdateType,
	ArcDocumentType,
} from "@/types/arcDocument/arcDocument";
import arcDocumentService from "@/services/arcDocument/arcDocumentService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { DropdownOption } from "@/types/general";
import { removeAccents } from "@/libs/CommonFunction";
import TextArea from "antd/es/input/TextArea";
import UploadFiler from "@/libs/UploadFilter";
import FileTypeConstant from "@/constants/FileTypeConstant";
dayjs.locale("vi");
dayjs.extend(utc);
const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;


interface Props {
	item?: ArcDocumentType | null;
	onClose: () => void;
	onSuccess: () => void;
	dropdownSecurity: DropdownOption[];
	dropdownLang: DropdownOption[];
	dropdownConfidentLevel: DropdownOption[];
	dropdownFormat: DropdownOption[];
}

const ArcDocumentCreateOrUpdate: React.FC<Props> = (props: Props) => {
	const [form] = Form.useForm<ArcDocumentCreateOrUpdateType>();

	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [idFile, setIdFile] = useState<string[]>([])

	const dropdownMode: DropdownOption[] = [
		{ label: "Hạn chế", value: "Hạn chế" },
		{ label: "Không hạn chế", value: "Không hạn chế" }
	]

	const handleOnFinish: FormProps<ArcDocumentCreateOrUpdateType>["onFinish"] =
		async (formData: ArcDocumentCreateOrUpdateType) => {

			const updateData: ArcDocumentCreateOrUpdateType = { ...formData, attachmentId: idFile[0] }

			if (props.item) {
				const response = await arcDocumentService.update(updateData);
				if (response.status) {
					toast.success("Chỉnh sửa thành công");
					form.resetFields();
					props.onSuccess();
					props.onClose();
					setFileList([]);
					setIdFile([]);
				} else {
					toast.error(response.message);
				}
			} else {
				const response = await arcDocumentService.create(updateData);
				if (response.status) {
					toast.success("Thêm mới thành công");
					form.resetFields();
					props.onSuccess();
					props.onClose();
					setFileList([]);
					setIdFile([]);

				} else {
					toast.error(response.message);
				}
			}
		};

	const handleCancel = () => {
		form.resetFields();
		props.onClose();
		setFileList([]);
		setIdFile([]);
	};

	React.useEffect(() => {
		if (props.item) {
			form.setFieldsValue({
				...props.item,
				issuedDate: props.item.issuedDate ? dayjs.utc(props.item.issuedDate) : null,
				security: props.item.security?.toString()
			});
			if (props.item.acttachmentId && props.item.duongDanFile) {
				setFileList([
					{
						uid: `${props.item.acttachmentId}`,
						name: props.item.attachmentName ?? "Tài liệu đính kèm",
						status: "done",
						url: `${StaticFileUrl}/${props.item.duongDanFile}`,
					},
				]);
				setIdFile([props.item?.acttachmentId ?? ""]);
			}
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
			width={800}
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
					<Form.Item<ArcDocumentCreateOrUpdateType> name="id" hidden>
						<Input />
					</Form.Item>
				)}
				{
					<>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Mã định danh văn bản"
									name="docCode"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Input placeholder="Mã định danh văn bản" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Mã hồ sơ"
									name="fileCode"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Input placeholder="Mã hồ sơ" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Năm đưa vào hồ sơ"
									name="nam"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<InputNumber
										placeholder="Năm đưa vào hồ sơ"
										style={{ width: "100%", borderRadius: 4 }}
										min={1950}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Số thứ tự văn bản trong hồ sơ"
									name="docOrdinal"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<InputNumber
										placeholder="Số thứ tự văn bản trong hồ sơ"
										style={{ width: "100%", borderRadius: 4 }}
										min={0}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Tên loại văn bản"
									name="typeName"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Input placeholder="Tên loại văn bản" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Số của văn bản"
									name="codeNumber"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Input placeholder="Số của văn bản" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Ký hiệu của văn bản"
									name="codeNotation"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Input placeholder="Ký hiệu của văn bản" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Ngày, tháng, năm văn bản"
									name="issuedDate"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<DatePicker format="DD/MM/YYYY" className="w-100" placeholder="Ngày, tháng, năm văn bản" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Tên cơ quan, tổ chức ban hành văn bản"
									name="organName"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Input placeholder="Tên cơ quan, tổ chức ban hành văn bản" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Tên người ký văn bản"
									name="fullName"
								>
									<Input placeholder="Tên người ký văn bản" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Trích yếu nội dung"
									name="subject"
								>
									<TextArea placeholder="Trích yếu nội dung" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Độ mật của hồ sơ, văn bản"
									name="security"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Select
										placeholder="Độ mật của hồ sơ, văn bản"
										options={props.dropdownSecurity}
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
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Ngôn ngữ"
									name="language"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Select
										placeholder="Ngôn ngữ"
										options={props.dropdownLang}
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
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Số lượng trang của văn bản"
									name="pageAmount"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<InputNumber
										placeholder="Số lượng trang của văn bản"
										style={{ width: "100%", borderRadius: 4 }}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Ghi chú"
									name="description"
								>
									<TextArea placeholder="Ghi chú" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Bút tích"
									name="autograph"
								>
									<TextArea placeholder="Bút tích" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Chế độ sử dụng"
									name="mode"
								>
									<Select
										placeholder="Chế độ sử dụng"
										options={dropdownMode}
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
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Mức độ tin cậy"
									name="confidenceLevel"
								>
									<Select
										placeholder="Mức độ tin cậy"
										options={props.dropdownConfidentLevel}
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
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Từ khóa"
									name="keyword"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Input placeholder="Từ khóa" />
								</Form.Item>
							</Col>

							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Tình trạng vật lý"
									name="format"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Select
										placeholder="Tình trạng vật lý"
										options={props.dropdownFormat}
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
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Tệp đính kèm"
									name="attachmentName"
								>
									<UploadFiler
										listType="text"
										maxFiles={1}
										fileList={fileList}
										setFileList={setFileList}
										type={FileTypeConstant.QLVB_FILE}
										setUploadedData={setIdFile}
									/>
								</Form.Item>

							</Col>
							<Col span={12}>
								<Form.Item<ArcDocumentCreateOrUpdateType>
									label="Chữ ký số"
									name="signature"
								>
									<TextArea placeholder="Chữ ký số" />
								</Form.Item>
							</Col>
						</Row>

					</>
				}
			</Form>
		</Modal>
	);
};
export default ArcDocumentCreateOrUpdate;
