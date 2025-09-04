import Flex from "@/components/shared-components/Flex";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row } from "antd";
import classes from "./page.module.css";

import { typeDanhMucService } from "@/services/TypeDanhMuc/TypeDanhMuc.service";
import { SearchTypeDanhMucData } from "@/types/TypeDanhMuc/TypeDanhMuc";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";

interface SearchProps {
  onFinish: ((values: SearchTypeDanhMucData) => void) | undefined;
  pageIndex: number;
  pageSize: number;
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = useForm();

  const Export = async () => {
    const formValues = form.getFieldsValue();
    try {
      const exportData = {
        ...formValues,
        pageIndex,
        pageSize,
      };

      const excelBase64 = await typeDanhMucService.export(exportData);
      downloadFileFromBase64(excelBase64.data, "Danh sách type danh mục.xlsx");
    } catch (error) {
      toast.error("Lỗi khi xuất file");
    }
  };

  return (
    <>
      <Card className={`${classes.customCardShadow} ${classes.mgButton10}`}>
        <Form
          form={form}
          layout="vertical"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item<SearchTypeDanhMucData>
                label="Tên"
                name="name"
              >
                <Input placeholder="Tên" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<SearchTypeDanhMucData>
                label="Loại"
                name="type"
              >
                <Input placeholder="Loại" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<SearchTypeDanhMucData>
                label="Mã DM"
                name="codeDm"
              >
                <Input placeholder="Mã DM" />
              </Form.Item>
            </Col>
          </Row>

          <Flex alignItems="center" justifyContent="center">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              className={classes.mgright5}
              size="small"
            >
              Tìm kiếm
            </Button>
            <Button
              onClick={Export}
              type="primary"
              icon={<DownloadOutlined />}
              className={`${classes.mgright5} ${classes.colorKetXuat}`}
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
