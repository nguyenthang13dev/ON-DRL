import React, { useEffect, useState } from "react";
import { Form, FormProps, Input, Select, DatePicker, Modal, Row, Col, Checkbox, InputNumber } from "antd";
import { toast } from "react-toastify";
import {
	ArcFileCreateOrUpdateType,
	ArcFileType,
} from "@/types/arcFile/arcFile";
import arcFileService from "@/services/arcFile/arcFileService";
import { DropdownOption } from "@/types/general";
import { removeAccents } from "@/libs/CommonFunction";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.locale("vi");
dayjs.extend(utc);


interface Props {
	item?: ArcFileType | null;
	onClose: () => void;
	onSuccess: () => void;
	dropdownMaintence: DropdownOption[];
	dropdownOrgan: DropdownOption[];
	dropdownLang: DropdownOption[];
	dropdownFormat: DropdownOption[];
}

const ArcFileCreateOrUpdate: React.FC<Props> = (props: Props) => {
	const [form] = Form.useForm<ArcFileCreateOrUpdateType>();

	const handleOnFinish: FormProps<ArcFileCreateOrUpdateType>["onFinish"] =
		async (formData: ArcFileCreateOrUpdateType) => {

			const dataToSend = {
				...formData,
				language: Array.isArray(formData.language)
					? formData.language.join(',')
					: formData.language
			};

			if (props.item) {
				const response = await arcFileService.update(dataToSend);
				if (response.status) {
					toast.success("Chỉnh sửa thành công");
					form.resetFields();
					props.onSuccess();
					props.onClose();
				} else {
					toast.error(response.message);
				}
			} else {
				const response = await arcFileService.create(dataToSend);
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



	React.useEffect(() => {

		if (props.item) {
			form.setFieldsValue({
				...props.item,
				startDate: props.item.startDate ? dayjs.utc(props.item.startDate) : null,
				endDate: props.item.endDate ? dayjs.utc(props.item.endDate) : null,
				language: props.item.language
					? props.item.language.split(',')
					: [],
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
					<Form.Item<ArcFileCreateOrUpdateType> name="id" hidden>
						<Input />
					</Form.Item>
				)}
				{
					<>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
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
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Mã phông lưu trữ"
									name="organId"
								>
									<Select
										placeholder="Mã phông lưu trữ"
										options={props.dropdownOrgan}
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
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Mục lục số hoặc năm hình thành hồ sơ"
									name="fileCataLog"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<InputNumber
										placeholder="Mục lục số hoặc năm hình thành hồ sơ"
										style={{ width: "100%", borderRadius: 4 }}
										min={0}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Số và ký hiệu hồ sơ"
									name="fileNotation"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Input placeholder="Số và ký hiệu hồ sơ" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Tiêu đề hồ sơ"
									name="title"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Input placeholder="Tiêu đề hồ sơ" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Thời hạn bảo quản"
									name="maintenance"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Select
										placeholder="Thời hạn bảo quản"
										options={props.dropdownMaintence}
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
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Hạn chế sử dụng"
									name="rights"
									valuePropName="checked"
								>
									<Checkbox />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Ngôn ngữ"
									name="language"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Select
										mode="multiple"
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
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Thời gian bắt đầu"
									name="startDate"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<DatePicker format="DD/MM/YYYY" className="w-100" placeholder="Thời gian bắt đầu" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Thời gian kết thúc"
									name="endDate"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<DatePicker format="DD/MM/YYYY" className="w-100" placeholder="Thời gian kết thúc" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Tổng số văn bản trong hồ sơ"
									name="totalDoc"
								>
									<InputNumber
										placeholder="Tổng số văn bản trong hồ sơ"
										style={{ width: "100%", borderRadius: 4 }}
										min={0}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Chú giải"
									name="description"
								>
									<TextArea placeholder="Chú giải" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Ký hiệu thông tin"
									name="inforSign"
								>
									<Input placeholder="Ký hiệu thông tin" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Từ khóa"
									name="keyWord"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<Input placeholder="Từ khóa" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Số lượng tờ"
									name="sheetNumber"
								>
									<InputNumber
										placeholder="Số lượng tờ"
										style={{ width: "100%", borderRadius: 4 }}
										min={0}
									/>

								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Số lượng trạng"
									name="pageNumber"
								>
									<InputNumber
										placeholder="Số lượng trang"
										style={{ width: "100%", borderRadius: 4 }}
										min={0}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<ArcFileCreateOrUpdateType>
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
								<Form.Item<ArcFileCreateOrUpdateType>
									label="Năm"
									name="nam"
									rules={[
										{ required: true, message: "Vui lòng nhập thông tin này!" },
									]}
								>
									<InputNumber
										placeholder="Năm"
										style={{ width: "100%", borderRadius: 4 }}
										min={1980}
									/>
								</Form.Item>
							</Col>
						</Row>
					</>
				}
			</Form>
		</Modal>
	);
};
export default ArcFileCreateOrUpdate;
