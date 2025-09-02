import {
  Button,
  Card,
  Col,
  Form,
  Input,
  DatePicker,
  Row,
  TreeSelect,
  Select,
} from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { QLThongBaoSearchType } from "@/types/QLThongBao/QLThongBao";
import QL_ThongBaoService from "@/services/QLThongBao/QLThongBaoService";
import { DropdownOption, DropdownTreeOptionAntd } from "@/types/general";
import TypeNotifyConstant from "@/constants/TypeNotify";

interface SearchProps {
  onFinish: ((values: QLThongBaoSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
  typeNotify?: DropdownOption[];
}
const Search: React.FC<SearchProps> = ({
  onFinish,
  pageIndex,
  pageSize,
  typeNotify = TypeNotifyConstant.getDropdownList(),
}) => {
  const [form] = useForm();
  return (
    <>
      <Card className="customCardShadow mb-3">
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
          <Row gutter={24} justify={"center"}>
            <Col span={8}>
              <Form.Item<QLThongBaoSearchType>
                key="tieuDe"
                label="Tiêu đề"
                name="tieuDe"
              >
                <Input placeholder="Tiêu đề" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<QLThongBaoSearchType>
                key="loaiThongBao"
                label="Loại Thông Báo"
                name="loaiThongBao"
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Loại Thông Báo"
                  fieldNames={{ label: "label", value: "value" }}
                  options={typeNotify}
                >
                  {/* <Select.Option value="All">All</Select.Option> */}
                </Select>
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
          </Flex>
        </Form>
      </Card>
    </>
  );
};
export default Search;
