"use client";
import { Button, Card, Col, InputNumber, Row } from "antd";
import classes from "./import.module.css";
import { useCallback, useEffect, useState } from "react";
import { userService } from "@/services/user/user.service";
import { tableConfigImport, tableUserDataTypeTrue } from "@/types/auth/User";
import UploadFiler from "@/libs/UploadFilter";
import { UploadFile } from "antd/lib";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { toast } from "react-toastify";

const Import: React.FC = () => {
  const [fileListImport, setFileListImport] = useState<UploadFile[]>([]);
  const [uploadedData, setUploadedData] = useState<string[]>([]);
  const [listColumns, setListColumns] = useState<tableConfigImport[]>([]);
  const [isImportSuccessful, setIsImportSuccessful] = useState<boolean>(false); // State kiểm tra trạng thái thành công
  const [importResult, setImportResult] = useState<
    tableUserDataTypeTrue[] | null
  >(null); // State lưu trữ kết quả API

  const handleGetData = useCallback(async () => {
    try {
      const response = await userService.getDataImportView();
      if (response != null && response.data != null) {
        const data = response.data;
        setListColumns(data);
      }
    } catch (error) { }
  }, []);

  const handleOrderChange = (value: number | null, index: number) => {
    if (value !== null) {
      const updatedColumns = [...listColumns]; // Sao chép state hiện tại
      updatedColumns[index].order = value; // Cập nhật giá trị order trong item
      setListColumns(updatedColumns); // Cập nhật lại state
    }
  };

  const getInitialData = () => {
    return listColumns.map((item) => ({
      columnName: item.columnName,
      displayName: item.displayName,
      order: item.order,
    }));
  };

  const handleImport = async () => {
    const dataToSend = {
      IdFile: uploadedData[0], // Giả sử fileListImport[0].uid là Id của file
      collection: getInitialData(), // Lấy dữ liệu cấu hình cột từ state
    };
    try {
      const res = await userService.saveImport(dataToSend);
      setIsImportSuccessful(true);
      setImportResult(res.data.listTrue);
      toast.success("Import thành công");
    } catch (error) {
      toast.error("Import thất bại");
    }
  };

  const handleDownloadTemplate = async () => {
    const excelBase64 = await userService.exportTemplateImport();
    downloadFileFromBase64(excelBase64.data, "ImportQlNguoiDung.xlsx");
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <>
      <Card className={classes.customCardShadow}>
        <Row>
          <Col flex={3}>
            <table>
              <tr>
                <th className={classes.th}>Mẫu file Excel</th>
                <td>
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleDownloadTemplate}
                    style={{ margin: "5px 0px" }}
                    icon={<DownloadOutlined />}
                  >
                    Tải xuống
                  </Button>
                </td>
              </tr>
              <tr>
                <th className={classes.th}>Tệp nhập dữ liệu</th>
                <td>
                  <UploadFiler
                    maxFiles={1}
                    setUploadedData={setUploadedData}
                    fileList={fileListImport}
                    setFileList={setFileListImport}
                    type="ImportNguoiDung"
                  />
                </td>
              </tr>
              <tr>
                <th></th>
                <td>
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleImport}
                    style={{ margin: "5px 0px" }}
                  >
                    Nhập dữ liệu
                  </Button>
                </td>
              </tr>
            </table>
          </Col>
          <Col flex={3}>
            <p className={classes.center}>Cấu hình cột lấy thông tin</p>
            <table className={classes.tableCauHinh}>
              <tr>
                <th className={`${classes.thCss} ${classes.center}`}>#</th>
                <th className={classes.thCss}>Tên trường thông tin</th>
                <th className={classes.thCss}>Cấu hình</th>
              </tr>
              <tr>
                <th className={`${classes.thCss} ${classes.center}`}></th>
                <th className={classes.thCss}>Dòng bắt đầu đọc</th>
                <th className={classes.thCss}>
                  <InputNumber
                    min={1}
                    max={100}
                    defaultValue={2}
                    style={{ width: "100%" }}
                  />
                </th>
              </tr>
              {listColumns &&
                listColumns.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className={`${classes.tdCss} ${classes.center}`}>
                        {index + 1}
                      </td>
                      <td className={classes.tdCss}>
                        {item.displayName + "(" + item.columnName + ")"}
                      </td>
                      <td className={classes.tdCss}>
                        <InputNumber
                          min={1}
                          max={100}
                          defaultValue={item.order}
                          style={{ width: "100%" }}
                          onChange={(value) => handleOrderChange(value, index)}
                        />
                      </td>
                    </tr>
                  );
                })}
            </table>
          </Col>
        </Row>
      </Card>
      {isImportSuccessful && importResult && Array.isArray(importResult) && (
        <Card className={classes.customCardShadow}>
          <p>Danh sách Import thành công</p>
          <table className={classes.tableCauHinh}>
            <thead>
              <tr>
                {listColumns.map((item, index) => (
                  <th key={index} className={classes.thCss}>
                    {`${item.displayName} (${item.columnName})`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {importResult.map(
                (item: tableUserDataTypeTrue, index: number) => (
                  <tr key={index}>
                    {listColumns.map((column: tableConfigImport, colIndex) => {
                      // Chuyển đổi columnName thành key theo đúng định dạng
                      const key = column.columnName
                        ? column.columnName.charAt(0).toLowerCase() +
                        column.columnName.slice(1)
                        : "";
                      return (
                        <td key={colIndex} className={classes.tdCss}>
                          {
                            key && (item as Record<string, any>)[key] // Ép kiểu item để truy cập động
                          }
                        </td>
                      );
                    })}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
};

export default Import;
