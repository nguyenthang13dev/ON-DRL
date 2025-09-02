import React, { useState } from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { ArcFileSearchType } from "@/types/arcFile/arcFile";
import arcFileService from "@/services/arcFile/arcFileService";
import { DropdownOption } from "@/types/general";
import { removeAccents } from "@/libs/CommonFunction";

interface SearchProps {
	onFinish: ((values: ArcFileSearchType) => void) | undefined;
	pageIndex: number;
	pageSize: number;
	dropdownOrgan: DropdownOption[];
	dropdownLang: DropdownOption[];
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize, dropdownOrgan, dropdownLang }) => {
	const [form] = useForm<ArcFileSearchType>();

	const dropdownRights = [
		{ label: "Không hạn chế", value: false },
		{ label: "Hạn chế", value: true },
	];

	const Export = async () => {
		const formValues = form.getFieldsValue();

		const exportData = {
			...formValues,
			pageIndex,
			pageSize,
		};

		const response = await arcFileService.exportExcel(exportData);
		if (response.status) {
			downloadFileFromBase64(response.data, "Danh sách quản lý hồ sơ.xlsx");
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
						<Col xl={8} lg={8} md={12} xs={24}>
							<Form.Item<ArcFileSearchType>
								key="fileCode"
								label="Mã hồ sơ"
								name="fileCode">
								<Input placeholder="Mã hồ sơ" />
							</Form.Item>
						</Col>
						<Col xl={8} lg={8} md={12} xs={24}>
							<Form.Item<ArcFileSearchType>
								key="organId"
								label="Mã phông lưu trữ"
								name="organId">
								<Select
									placeholder="Mã phông lưu trữ"
									options={dropdownOrgan}
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
						<Col xl={8} lg={8} md={12} xs={24}>
							<Form.Item<ArcFileSearchType>
								key="title"
								label="Tiêu đề hồ sơ"
								name="title">
								<Input placeholder="Tiêu đề hồ sơ" />
							</Form.Item>
						</Col>
						<Col xl={8} lg={8} md={12} xs={24}>
							<Form.Item<ArcFileSearchType>
								key="rights"
								label="Chế độ sử dụng"
								name="rights">
								<Select
									placeholder="Chế độ sử dụng"
									options={dropdownRights}
									allowClear
									showSearch
								/>
							</Form.Item>
						</Col>
						<Col xl={8} lg={8} md={12} xs={24}>
							<Form.Item<ArcFileSearchType>
								key="language"
								label="Ngôn ngữ"
								name="language">
								<Select
									placeholder="Ngôn ngữ"
									options={dropdownLang}
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
