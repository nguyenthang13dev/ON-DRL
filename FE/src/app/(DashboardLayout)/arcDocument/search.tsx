import React from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import * as extensions from "@/utils/extensions";

import { ArcDocumentSearchType } from "@/types/arcDocument/arcDocument";
import arcDocumentService from "@/services/arcDocument/arcDocumentService";
import { DropdownOption } from "@/types/general";
import { removeAccents } from "@/libs/CommonFunction";

interface SearchProps {
	onFinish: ((values: ArcDocumentSearchType) => void) | undefined;
	pageIndex: number;
	pageSize: number;
	dropdownSecurity: DropdownOption[];
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize, dropdownSecurity }) => {
	const [form] = useForm<ArcDocumentSearchType>();

	const Export = async () => {
		const formValues = form.getFieldsValue();

		const exportData = {
			...formValues,
			pageIndex,
			pageSize,
		};

		const response = await arcDocumentService.exportExcel(exportData);
		if (response.status) {
			downloadFileFromBase64(response.data, "Danh sách quản lý văn bản.xlsx");
		} else {
			toast.error(response.message);
		}
	};

	return (
		<>
			<Card className="customCardShadow mb-3">
				<Form
					form={form}
					layout="vertical"
					name="basic"
					labelCol={{ span: 24 }}
					wrapperCol={{ span: 24 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="off"
				>
					<Row gutter={24}>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcDocumentSearchType>
								key="docCode"
								label="Mã định danh văn bản"
								name="docCode">
								<Input placeholder="Mã định danh văn bản" />
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcDocumentSearchType>
								key="fileCode"
								label="Mã hồ sơ"
								name="fileCode">
								<Input placeholder="Mã hồ sơ" />
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcDocumentSearchType>
								key="typeName"
								label="Tên loại văn bản"
								name="typeName">
								<Input placeholder="Tên loại văn bản" />
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcDocumentSearchType>
								key="codeNumber"
								label="Số của văn bản"
								name="codeNumber">
								<Input placeholder="Số của văn bản" />
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcDocumentSearchType>
								key="codeNotation"
								label="Ký hiệu của văn bản"
								name="codeNotation">
								<Input placeholder="Ký hiệu của văn bản" />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item<ArcDocumentSearchType>
								label="Ngày, tháng, năm văn bản"
							>
								<Row gutter={12}>
									<Col span={12}>
										<Form.Item<ArcDocumentSearchType>
											name="issuedDateFrom"
											noStyle
										>
											<DatePicker
												format="DD/MM/YYYY"
												className="w-100"
												placeholder="Từ"
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item<ArcDocumentSearchType> name="issuedDateTo"
											noStyle
										>
											<DatePicker
												format="DD/MM/YYYY"
												className="w-100"
												placeholder="Đến"
											/>
										</Form.Item>
									</Col>
								</Row>
							</Form.Item>
						</Col>

						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcDocumentSearchType>
								key="organName"
								label="Tên cơ quan, tổ chức ban hành văn bản"
								name="organName">
								<Input placeholder="Tên cơ quan, tổ chức ban hành văn bản" />
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcDocumentSearchType>
								key="subject"
								label="Trích yếu nội dung"
								name="subject">
								<Input placeholder="Trích yếu nội dung" />
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcDocumentSearchType>
								key="security"
								label="Độ mật của hồ sơ, văn bản"
								name="security">
								<Select
									placeholder="Độ mật của hồ sơ, văn bản"
									allowClear
									showSearch
									options={dropdownSecurity}
									filterOption={(input, option) => {
										return removeAccents(option?.label ?? "")
											.toLowerCase()
											.includes(removeAccents(input).toLowerCase());
									}}

								/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcDocumentSearchType>
								key="keyword"
								label="Từ khóa"
								name="keyword">
								<Input placeholder="Từ khóa" />
							</Form.Item>
						</Col>
					</Row>

					<Flex
						alignItems="center"
						justifyContent="center"
						className="btn-group"
					>
						<Button
							type="primary"
							htmlType="submit"
							icon={<SearchOutlined />}
							size="small"
						>
							Tìm kiếm
						</Button>
						<Button
							onClick={Export}
							type="primary"
							icon={<DownloadOutlined />}
							className="colorKetXuat"
							size="small"
						>
							Kết xuất
						</Button>
					</Flex>
				</Form>
			</Card>
		</>
	);
};

export default Search;
