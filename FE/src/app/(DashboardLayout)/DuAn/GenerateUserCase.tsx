import React, {
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Select,
  message,
  Popconfirm,
  AutoComplete,
  Radio,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  BulbOutlined,
  DeleteOutlined,
  SaveOutlined,
  SearchOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import ExcelJS from "exceljs";
import { FileExcelOutlined } from "@ant-design/icons";
import templateTestCaseService, {
  UseCaseInputDto,
  UseCaseGenerateResultDto,
  DropdownOption,
} from "@/services/templateTestCase/templateTestCaseService";
import { tacNhan_UseCaseService } from "@/services/TacNhan_UseCase/TacNhan_UseCase.service";
import { TacNhan_UseCaseType } from "@/types/TacNhan_UseCase/TacNhan_UseCase";
import { useCaseService } from "@/services/UseCase/UseCase.service";
import { UseCaseCreate } from "@/types/UseCase/UseCase";
import { uC_UseCaseDemoService } from "@/services/UC_UseCaseDemo/UC_UseCaseDemo.service";
import { UC_UseCaseDemoCreateType } from "@/types/UC_UseCaseDemo";
// Simple debounce function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Helper function để trích xuất tên tác nhân từ display name
const extractTacNhanName = (displayName: string): string => {
  // Nếu có format "Tên tác nhân (Mã tác nhân)", trích xuất phần tên
  const match = displayName.match(/^(.+?)\s*\([^)]+\)$/);
  if (match) {
    return match[1].trim();
  }
  // Nếu không có format đó, trả về nguyên bản
  return displayName;
};

// Cập nhật interface để phù hợp với API mới
interface UpdatedUseCaseInputDto {
  id?: string; // Thêm id để phục vụ việc tạo mô tả trường hợp mới với các thay đổi mới
  tenUseCase: string;
  maTacNhanChinhs: string[];
  doPhucTapCode: string; // Thay đổi từ number thành string
  loaiUseCaseCode: string; // Thêm: danh sách code được chọn, phân cách bằng dấu ','
  idDuAn?: string; // Thêm idDuAn vào interface
}

interface UpdatedUseCaseGenerateResultDto {
  tenUseCase: string;
  tacNhanChinh: string;
  doPhucTapCode: string;
  doPhucTapName: string;
  moTaTruongHop?: string[];
  lstHanhDongNangCao?: string[];
  loaiUseCaseCode?: string; // Thêm: code loại tương ứng của bản ghi sinh ra
}

interface UseCaseRow {
  key: number;
  tenTruongHop: string;
  tacNhanChinh: string[]; // Lưu danh sách mã tác nhân
  tacNhanChinhDisplay: string[]; // Hiển thị danh sách tên tác nhân
  doPhucTapCode: string | null; // Thay đổi từ number thành string
  moTa: string[]; // mỗi mô tả là 1 dòng
  lstHanhDongNangCao?: string[]; // Thêm trường mô tả nâng cao từ API
  id?: string; // Thêm trường id để phân biệt update/create
  loaiUseCase?: "QUANLY_USECASE" | "KHAITHAC_USECASE" | "BAOCAO_USECASE";
  isNewRow?: boolean; // Chỉ hiển thị chọn loại khi là dòng mới tạo
}

interface GenerateUserCaseProps {
  idDuAn?: string; // ID dự án được truyền từ component cha (optional)
}

const GenerateUserCase = forwardRef<any, GenerateUserCaseProps>(
  ({ idDuAn }, ref) => {
    const [data, setData] = useState<UseCaseRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [tacNhanOptions, setTacNhanOptions] = useState<
      { value: string; label: string }[]
    >([]);
    const [doPhucTapOptions, setDoPhucTapOptions] = useState<DropdownOption[]>(
      []
    );
    const [searchingTacNhan, setSearchingTacNhan] = useState(false);
    const [isDataReady, setIsDataReady] = useState(false);
    const [searchText, setSearchText] = useState("");

    // Debug: Log doPhucTapOptions changes
    useEffect(() => {}, [doPhucTapOptions]);

    // Function để load danh sách độ phức tạp
    const loadDoPhucTapOptions = useCallback(async () => {
      try {
        const response = await templateTestCaseService.getDoPhucTapCode();

        // Kiểm tra response có thể là object với data property hoặc array trực tiếp
        let optionsData = null;
        const responseAny = response as any;

        if (responseAny.data && Array.isArray(responseAny.data)) {
          // Nếu response.data là array trực tiếp
          optionsData = responseAny.data;
        } else if (
          responseAny.data &&
          responseAny.data.data &&
          Array.isArray(responseAny.data.data)
        ) {
          // Nếu response.data là object có data property
          optionsData = responseAny.data.data;
        } else if (Array.isArray(responseAny)) {
          // Nếu response là array trực tiếp
          optionsData = responseAny;
        }

        if (optionsData && optionsData.length > 0) {
          setDoPhucTapOptions(optionsData);
        } else {
          // Fallback options nếu API không trả về dữ liệu - khớp với format API
        }
      } catch (error) {
        console.error("Lỗi khi load danh sách độ phức tạp:", error);
      }
    }, []);

    // Function để load danh sách tác nhân - chỉ gọi 1 lần khi component mount
    const loadTacNhanList = useCallback(async () => {
      setSearchingTacNhan(true);
      try {
        const response = await tacNhan_UseCaseService.getData({
          tenTacNhan: "", // Không cần search text
          pageIndex: 1,
          pageSize: 200, // Tăng pageSize để lấy nhiều tác nhân hơn
          idDuAn: idDuAn,
        });

        if (response.status && response.data?.items) {
          const options = response.data.items.map(
            (item: TacNhan_UseCaseType) => ({
              value: item.maTacNhan,
              label: item.tenTacNhan,
            })
          );
          setTacNhanOptions(options);
        } else if ((response as any).items) {
          // Direct response with items
          const options = (response as any).items.map(
            (item: TacNhan_UseCaseType) => ({
              value: item.maTacNhan,
              label: item.tenTacNhan,
            })
          );
          setTacNhanOptions(options);
        } else {
          setTacNhanOptions([]);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm tác nhân:", error);
        setTacNhanOptions([]);
      } finally {
        setSearchingTacNhan(false);
      }
    }, [idDuAn]);

    // Function để tìm kiếm tác nhân trong dữ liệu local
    const searchTacNhan = useCallback((searchText: string) => {
      // Không cần debounce vì tìm kiếm local rất nhanh
      if (!searchText || searchText.trim().length < 1) {
        // Nếu không có text, hiển thị tất cả options
        return;
      }
      // Tìm kiếm sẽ được xử lý bởi Ant Design Select component với filterOption
    }, []);

    // Load danh sách tác nhân và độ phức tạp khi component mount
    useEffect(() => {
      loadTacNhanList();
      loadDoPhucTapOptions();
    }, [loadTacNhanList, loadDoPhucTapOptions]);

    // Function để load dữ liệu UC_UseCaseDemo
    const loadUseCaseDemoData = useCallback(async () => {
      if (!idDuAn || idDuAn.trim() === "") {
        return;
      }
      setLoadingData(true);
      try {
        const response = await uC_UseCaseDemoService.getData({
          idDuAn: idDuAn,
          pageSize: 1000,
          pageIndex: 1,
        });

        if (response.status && response.data) {
          // Xử lý cả trường hợp response.data là array trực tiếp hoặc có cấu trúc items
          const responseData = response.data as any;
          const items = Array.isArray(responseData)
            ? responseData
            : responseData.items || [];

          const useCaseRows: UseCaseRow[] = items.map(
            (item: any, index: number) => {
              // Debug: Log dữ liệu gốc từ API
              console.log(
                "Original lstHanhDongNangCao:",
                item.lstHanhDongNangCao
              );

              // Tách lstHanhDong thành mảng moTa (sử dụng || làm separator)
              const moTaArray = item.lstHanhDong
                ? item.lstHanhDong
                    .split("||")
                    .map((s: string) => s.trim())
                    .filter((s: string) => s !== "")
                : [""];

              // Tách lstHanhDongNangCao thành mảng (sử dụng || làm separator)
              const lstHanhDongNangCaoArray = item.lstHanhDongNangCao
                ? item.lstHanhDongNangCao
                    .split("||")
                    .map((s: string) => s.trim())
                    .filter((s: string) => s !== "")
                : [];

              console.log(
                "Parsed lstHanhDongNangCaoArray:",
                lstHanhDongNangCaoArray
              );

              const tacNhanArray = item.tacNhanChinh
                ? item.tacNhanChinh
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter((s: string) => s !== "")
                : [];

              // Tìm tên tác nhân dựa trên mã - chỉ khi tacNhanOptions đã load
              const tacNhanDisplayArray = tacNhanArray.map(
                (maTacNhan: string) => {
                  const option = tacNhanOptions.find(
                    (opt) => opt.value === maTacNhan
                  );
                  console.log(
                    `Mapping ${maTacNhan}:`,
                    option ? option.label : maTacNhan
                  );
                  return option ? option.label : maTacNhan;
                }
              );

              const codes =
                typeof item.loaiUseCaseCode === "string"
                  ? item.loaiUseCaseCode
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter((s: string) => s.length > 0)
                  : [];
              const baseLoai:
                | "QUANLY_USECASE"
                | "KHAITHAC_USECASE"
                | "BAOCAO_USECASE"
                | undefined = codes.includes("QUANLY_USECASE")
                ? "QUANLY_USECASE"
                : codes.includes("KHAITHAC_USECASE")
                ? "KHAITHAC_USECASE"
                : codes.includes("BAOCAO_USECASE")
                ? "BAOCAO_USECASE"
                : undefined;

              const row = {
                key: Date.now() + index, // Tạo key duy nhất
                tenTruongHop: item.tenUseCase || "",
                tacNhanChinh: tacNhanArray,
                tacNhanChinhDisplay: tacNhanDisplayArray, // Hiển thị tên tác nhân
                doPhucTapCode: item.doPhucTap || null,
                moTa: moTaArray,
                lstHanhDongNangCao: lstHanhDongNangCaoArray, // Lưu trữ dữ liệu nâng cao
                id: item.id, // Lấy ID từ dữ liệu nếu có
                loaiUseCase: baseLoai as any,
                isNewRow: false,
              };

              return row;
            }
          );

          setData(useCaseRows);
        }
      } catch (error) {
        console.error("Lỗi khi load dữ liệu UC_UseCaseDemo:", error);
        message.error("Lỗi khi load dữ liệu!");
      } finally {
        setLoadingData(false);
      }
    }, [idDuAn, tacNhanOptions]);

    // Load dữ liệu UC_UseCaseDemo khi component mount
    useEffect(() => {
      // Chỉ load dữ liệu khi tacNhanOptions đã có
      if (tacNhanOptions.length > 0) {
        loadUseCaseDemoData();
      }
    }, [loadUseCaseDemoData]);

    // Reload dữ liệu khi tacNhanOptions thay đổi (để cập nhật tên tác nhân)
    useEffect(() => {
      if (tacNhanOptions.length > 0 && data.length > 0) {
        setData((prev) =>
          prev.map((row) => {
            // Cập nhật tacNhanChinhDisplay dựa trên tacNhanChinh và tacNhanOptions mới
            const tacNhanDisplayArray = row.tacNhanChinh.map(
              (maTacNhan: string) => {
                const option = tacNhanOptions.find(
                  (opt) => opt.value === maTacNhan
                );
                return option ? option.label : maTacNhan;
              }
            );

            return {
              ...row,
              tacNhanChinhDisplay: tacNhanDisplayArray,
            };
          })
        );
        setIsDataReady(true);
      }
    }, [tacNhanOptions]);

    // Set data ready khi có dữ liệu và tacNhanOptions
    useEffect(() => {
      if (data.length > 0 && tacNhanOptions.length > 0) {
        setIsDataReady(true);
      }
    }, [data, tacNhanOptions]);

    // Hàm helper để tìm phần tử scrollable (giờ chủ yếu dùng window scroll)
    const findScrollableElement = (): "window" | Element | null => {
      // Kiểm tra xem có cần scroll không
      if (document.body.scrollHeight > window.innerHeight) {
        return "window";
      }

      // Fallback: tìm table element nếu có
      const tableElement = document.querySelector(".ant-table");
      if (
        tableElement &&
        tableElement.scrollHeight > tableElement.clientHeight
      ) {
        return tableElement;
      }

      return null;
    };

    // Hàm scroll với fallback
    const scrollToPosition = (position: "top" | "bottom") => {
      const scrollableElement = findScrollableElement();

      if (scrollableElement === "window") {
        if (position === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }
      } else if (scrollableElement instanceof Element) {
        console.log(
          `Scrolling ${position} of table element:`,
          scrollableElement
        );
        if (position === "top") {
          scrollableElement.scrollTop = 0;
        } else {
          scrollableElement.scrollTop = scrollableElement.scrollHeight;
        }
      } else {
        console.log(
          "No scrollable element found, using window scroll as fallback"
        );
        // Fallback: scroll window
        if (position === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }
      }
    };

    // Ref để track row mới được thêm
    const newRowRef = useRef<HTMLDivElement>(null);
    const lastAddedKey = useRef<number | null>(null);

    // useEffect để focus vào row mới sau khi data thay đổi
    useEffect(() => {
      if (lastAddedKey.current && data.length > 0) {
        const newKey = lastAddedKey.current;
        const newRow = data.find((row) => row.key === newKey);

        if (newRow && newRow.isNewRow) {
          // Đợi một chút để DOM render hoàn toàn
          setTimeout(() => {
            // Tìm input của row mới
            const newRowInput =
              document.querySelector(
                `textarea[data-row-key="${newKey}"][data-field="tenTruongHop"]`
              ) ||
              document.querySelector(
                `[data-row-key="${newKey}"][data-field="tenTruongHop"]`
              ) ||
              document.querySelector(`[data-row-key="${newKey}"] textarea`) ||
              document.querySelector(`[data-row-key="${newKey}"] .ant-input`);

            if (newRowInput) {
              (newRowInput as HTMLElement).focus();
              // Scroll đến input
              newRowInput.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              // Reset key
              lastAddedKey.current = null;
            } else {
              console.log(
                "Could not find input for new row in useEffect, key:",
                newKey
              );
            }
          }, 100);
        }
      }
    }, [data]);

    const handleAddRow = () => {
      const newKey = Date.now();
      // Lấy giá trị đầu tiên từ doPhucTapOptions nếu có
      const defaultDoPhucTapCode =
        doPhucTapOptions.length > 0 ? doPhucTapOptions[0].value : null;

      setData((prev) => [
        ...prev,
        {
          key: newKey,
          tenTruongHop: "",
          tacNhanChinh: [],
          tacNhanChinhDisplay: [],
          doPhucTapCode: defaultDoPhucTapCode,
          moTa: [""],
          loaiUseCase: "QUANLY_USECASE",
          isNewRow: true,
        },
      ]);

      // Lưu key của row mới để focus sau
      lastAddedKey.current = newKey;

      // Tự động cuộn xuống dòng mới sau khi thêm
      setTimeout(() => {
        // Scroll xuống cuối danh sách
        scrollToPosition("bottom");

        // Tự động focus vào input tên trường hợp sử dụng của dòng mới
        // Sử dụng data attributes để tìm chính xác input cần thiết
        const newRowInput =
          document.querySelector(
            `textarea[data-row-key="${newKey}"][data-field="tenTruongHop"]`
          ) ||
          document.querySelector(
            `[data-row-key="${newKey}"][data-field="tenTruongHop"]`
          ) ||
          document.querySelector(`[data-row-key="${newKey}"] textarea`) ||
          document.querySelector(`[data-row-key="${newKey}"] .ant-input`);

        if (newRowInput) {
          (newRowInput as HTMLElement).focus();
          // Scroll đến input nếu cần
          newRowInput.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          // Fallback: tìm tất cả input trong row
          const rowInputs = document.querySelectorAll(
            `[data-row-key="${newKey}"] input, [data-row-key="${newKey}"] textarea`
          );
          if (rowInputs.length > 0) {
            (rowInputs[0] as HTMLElement).focus();
            rowInputs[0].scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }, 300); // Tăng thời gian chờ để DOM render hoàn toàn
    };

    const handleDeleteRow = async (key: number) => {
      const row = data.find((r) => r.key === key);
      if (!row) return;

      // Kiểm tra xem có phải xóa trên server hay client
      const isServerDelete = row.id && row.id !== "";

      if (isServerDelete) {
        // Xóa trên server
        try {
          const response = await uC_UseCaseDemoService.delete(row.id!);
          if (response.status) {
            setData((prev) => prev.filter((row) => row.key !== key));
            message.success("Xóa UseCase thành công!");
          } else {
            message.error(response.message || "Xóa UseCase thất bại!");
          }
        } catch (error) {
          console.error("Lỗi khi xóa UseCase:", error);
          message.error("Lỗi khi xóa UseCase!");
        }
      } else {
        // Xóa trên client
        setData((prev) => prev.filter((row) => row.key !== key));
        message.success("Đã xóa trường hợp sử dụng!");
      }
    };

    const handleCellChange = (
      key: number,
      dataIndex: keyof UseCaseRow,
      value: any
    ) => {
      setData((prev) =>
        prev.map((row) =>
          row.key === key ? { ...row, [dataIndex]: value } : row
        )
      );
    };

    // Xử lý khi chọn tác nhân
    const handleTacNhanSelect = (
      key: number,
      selectedValues: string[],
      selectedOptions: any
    ) => {
      // Đảm bảo selectedValues chỉ chứa mã tác nhân (value), không phải tên (label)
      const maTacNhanValues = selectedValues.map((value) => {
        // Nếu value là mã tác nhân (có trong tacNhanOptions), giữ nguyên
        const option = tacNhanOptions.find((opt) => opt.value === value);
        if (option) {
          return value; // Đây là mã tác nhân
        }

        // Nếu value không tìm thấy trong options, có thể là tên
        // Tìm option có label chứa value này
        const optionByLabel = tacNhanOptions.find((opt) => opt.label === value);
        if (optionByLabel) {
          return optionByLabel.value; // Trả về mã tác nhân
        }

        // Nếu không tìm thấy, giữ nguyên value (có thể là mã không hợp lệ)
        return value;
      });

      // Lấy tên hiển thị từ tacNhanOptions dựa trên mã tác nhân
      const displayNames = maTacNhanValues.map((maTacNhan) => {
        const option = tacNhanOptions.find((opt) => opt.value === maTacNhan);
        return option ? option.label : maTacNhan;
      });

      setData((prev) =>
        prev.map((row) =>
          row.key === key
            ? {
                ...row,
                tacNhanChinh: maTacNhanValues,
                tacNhanChinhDisplay: displayNames,
              }
            : row
        )
      );
    };

    // Thay đổi từng mô tả trong mảng moTa
    const handleMoTaChange = (rowKey: number, idx: number, value: string) => {
      setData((prev) => {
        const newData = prev.map((row) => {
          if (row.key === rowKey) {
            const moTaArr = [...(row.moTa || [])];
            moTaArr[idx] = value;
            return { ...row, moTa: moTaArr };
          }
          return row;
        });
        return newData;
      });
    };

    // Lưu theo danh sách hàng cung cấp, tránh lệ thuộc thời điểm cập nhật state
    const saveRows = async (rows: UseCaseRow[]) => {
      if (!idDuAn || idDuAn.trim() === "") {
        message.error("ID dự án không hợp lệ! Vui lòng kiểm tra lại.");
        return;
      }
      const validRows = rows.filter(
        (row) =>
          row.tenTruongHop &&
          row.tenTruongHop.trim() !== "" &&
          row.tacNhanChinh.length &&
          row.doPhucTapCode !== null
      );

      if (validRows.length === 0) return;

      setSaving(true);
      try {
        let successCount = 0;
        let errorCount = 0;

        for (const row of validRows) {
          try {
            // Xác định loaiUseCaseCode: mỗi bản ghi chỉ 1 loại
            const loaiUseCaseCode = row.loaiUseCase ?? "QUANLY_USECASE";

            // Debug: Log dữ liệu trước khi tạo payload
            console.log(
              "row.moTa type:",
              typeof row.moTa,
              "isArray:",
              Array.isArray(row.moTa)
            );
            console.log(
              "row.lstHanhDongNangCao type:",
              typeof row.lstHanhDongNangCao,
              "isArray:",
              Array.isArray(row.lstHanhDongNangCao)
            );

            const useCaseDemoData = {
              id: row.id!,
              idDuAn: idDuAn,
              tenUseCase: row.tenTruongHop.trim(),
              tacNhanChinh: row.tacNhanChinh.join(", "),
              doPhucTap: row.doPhucTapCode || "",
              lstHanhDong: (row.moTa || []).join("||"),
              lstHanhDongNangCao: (row.lstHanhDongNangCao || []).join("||"),
              loaiUseCaseCode,
            };

            // Debug: Log payload cuối cùng
            console.log(
              "lstHanhDongNangCao value:",
              useCaseDemoData.lstHanhDongNangCao
            );
            const response = await uC_UseCaseDemoService.update(
              useCaseDemoData
            );
            if (response.status) {
              successCount++;
            } else {
              errorCount++;
            }
          } catch (error) {
            errorCount++;
            console.error(`Lỗi khi lưu row ${row.key}:`, error);
          }
        }

        if (errorCount === 0) {
          message.success(`Lưu thành công ${successCount} UseCase!`);
        } else if (successCount === 0) {
          message.error(`Lưu thất bại ${errorCount} UseCase!}`);
        } else {
          message.warning(
            `Lưu thành công ${successCount} UseCase, thất bại ${errorCount} UseCase!`
          );
        }
      } finally {
        setSaving(false);
      }
    };

    // Gọi API sinh mô tả cho từng dòng
    const handleGenerateMoTa = async (row: UseCaseRow) => {
      if (
        !row.tenTruongHop ||
        !row.tacNhanChinh.length ||
        row.doPhucTapCode === null
      ) {
        message.warning("Vui lòng nhập đủ thông tin trước khi tạo mô tả!");
        return;
      }
      setLoading(true);
      try {
        // Xử lý dữ liệu có thể trống
        const validMaTacNhan = (row.tacNhanChinh || []).filter((ma) => {
          const isValid = tacNhanOptions.some((option) => option.value === ma);
          if (!isValid) {
            console.warn(`Mã tác nhân không hợp lệ: ${ma}`);
          }
          return isValid;
        });

        // Không cần cảnh báo nếu không có tác nhân - có thể là dòng trống

        // Tính danh sách loaiUseCaseCode được chọn
        let selectedCodes: string[] = [];
        if (row.isNewRow) {
          const radioCode = row.loaiUseCase ?? "QUANLY_USECASE";
          selectedCodes = [radioCode];
        } else {
          // Sau khi đã nở, mỗi row đại diện cho đúng 1 loại
          const only = row.loaiUseCase ?? "QUANLY_USECASE";
          selectedCodes = [only];
        }
        const loaiUseCaseCodeStr = selectedCodes.join(",");

        const input: UpdatedUseCaseInputDto[] = [
          {
            id: row.id, // Thêm id để phục vụ việc tạo mô tả trường hợp mới với các thay đổi mới
            tenUseCase: row.tenTruongHop.trim(),
            maTacNhanChinhs: validMaTacNhan, // Sử dụng danh sách mã tác nhân đã validate
            doPhucTapCode: row.doPhucTapCode,
            loaiUseCaseCode: loaiUseCaseCodeStr,
            idDuAn: idDuAn, // Thêm idDuAn vào payload
          },
        ];

        const res = await templateTestCaseService.generateUseCaseStrings(
          input as any
        );
        if (res.status) {
          message.success("Tạo mô tả thành công! Đang tải dữ liệu mới...");

          // Gọi getData để lấy dữ liệu mới từ server
          await loadUseCaseDemoData();
        } else {
          message.error(res.message || "Không tạo được mô tả!");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API tạo mô tả:", err);
        message.error("Lỗi khi gọi API tạo mô tả!");
      } finally {
        setLoading(false);
      }
    };

    // Gọi API sinh mô tả cho tất cả dòng
    const handleGenerateAll = async () => {
      // Lọc các dòng đã nhập đủ thông tin
      const validRows = data.filter(
        (row) =>
          row.tenTruongHop &&
          row.tacNhanChinh.length &&
          row.doPhucTapCode !== null
      );
      if (validRows.length === 0) {
        message.warning("Không có dòng nào đủ thông tin để tạo mô tả!");
        return;
      }
      setLoading(true);
      try {
        const input = validRows.map((row) => {
          // Xử lý dữ liệu có thể trống
          const validMaTacNhan = (row.tacNhanChinh || []).filter((ma) => {
            const isValid = tacNhanOptions.some(
              (option) => option.value === ma
            );
            if (!isValid) {
              console.warn(`Row ${row.key} - Mã tác nhân không hợp lệ: ${ma}`);
            }
            return isValid;
          });

          // Không cần cảnh báo nếu không có tác nhân - có thể là dòng trống

          // Xác định loaiUseCaseCode cho từng row
          let loaiUseCaseCodeStr: string;
          if (row.isNewRow) {
            loaiUseCaseCodeStr = row.loaiUseCase ?? "QUANLY_USECASE";
          } else {
            loaiUseCaseCodeStr = row.loaiUseCase ?? "QUANLY_USECASE";
          }

          return {
            id: row.id, // Thêm id để phục vụ việc tạo mô tả trường hợp mới với các thay đổi mới
            tenUseCase: row.tenTruongHop.trim(),
            maTacNhanChinhs: validMaTacNhan, // Sử dụng danh sách mã tác nhân đã validate
            doPhucTapCode: row.doPhucTapCode,
            loaiUseCaseCode: loaiUseCaseCodeStr,
            idDuAn: idDuAn, // Thêm idDuAn vào payload
          };
        });

        const res = await templateTestCaseService.generateUseCaseStrings(
          input as any
        );

        if (res.status) {
          message.success(
            "Tạo mô tả cho tất cả thành công! Đang tải dữ liệu mới..."
          );

          // Gọi getData để lấy dữ liệu mới từ server
          await loadUseCaseDemoData();
        } else {
          message.error(res.message || "Không tạo được mô tả!");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API tạo mô tả cho tất cả:", err);
        message.error("Lỗi khi gọi API tạo mô tả!");
      } finally {
        setLoading(false);
      }
    };

    // Function để lưu UseCase
    const handleSaveUseCase = async (row: UseCaseRow) => {
      if (!idDuAn || idDuAn.trim() === "") {
        message.error("ID dự án không hợp lệ! Vui lòng kiểm tra lại.");
        return;
      }

      // Bỏ validation - cho phép lưu dòng trống để tạo dòng mới
      // Chỉ kiểm tra xem có phải dòng mới hay không

      setSaving(true);
      try {
        // Xác định loaiUseCaseCode để lưu: mỗi bản ghi chỉ 1 loại
        const loaiUseCaseCode = row.loaiUseCase ?? "QUANLY_USECASE";

        const useCaseDemoData = {
          id: row.id, // Có thể undefined nếu là dòng mới
          idDuAn: idDuAn,
          tenUseCase: (row.tenTruongHop || "").trim(),
          tacNhanChinh: (row.tacNhanChinh || []).join(", "),
          doPhucTap: row.doPhucTapCode || "",
          lstHanhDong: (row.moTa || []).join("||"),
          lstHanhDongNangCao: (row.lstHanhDongNangCao || []).join("||"),
          loaiUseCaseCode,
        };

        let response;
        if (row.id && row.id.trim() !== "") {
          // Nếu có ID thì gọi update
          response = await uC_UseCaseDemoService.update(useCaseDemoData as any);
          if (response.status) {
            message.success("Cập nhật UseCase thành công!");
          } else {
            message.error(response.message || "Cập nhật UseCase thất bại!");
          }
        } else {
          // Nếu không có ID thì gọi create
          const { id, ...createData } = useCaseDemoData; // Loại bỏ id khi create
          response = await uC_UseCaseDemoService.create(createData);
          if (response.status) {
            message.success("Tạo mới UseCase thành công!");
            // Cập nhật ID cho row sau khi tạo thành công
            row.id = response.data?.id;
            // Reload dữ liệu để cập nhật UI
            await loadUseCaseDemoData();
          } else {
            message.error(response.message || "Tạo mới UseCase thất bại!");
          }
        }
      } catch (error) {
        console.error("Lỗi khi lưu UseCase:", error);
        message.error("Lỗi khi lưu UseCase!");
      } finally {
        setSaving(false);
      }
    };

    // Function để lưu tất cả UseCase
    const handleSaveAllUseCases = async () => {
      if (!idDuAn || idDuAn.trim() === "") {
        message.error("ID dự án không hợp lệ! Vui lòng kiểm tra lại.");
        return;
      }

      // Lấy tất cả các dòng - không cần validation
      const validRows = data;

      if (validRows.length === 0) {
        message.warning("Không có dữ liệu để lưu!");
        return;
      }

      setSaving(true);
      try {
        let successCount = 0;
        let errorCount = 0;
        let createCount = 0;
        let updateCount = 0;

        // Tách dữ liệu thành 2 nhóm: tạo mới và cập nhật
        const createPayloads: any[] = [];
        const updatePayloads: any[] = [];

        for (const row of validRows) {
          const loaiUseCaseCode = row.loaiUseCase ?? "QUANLY_USECASE";
          const basePayload = {
            idDuAn: idDuAn,
            tenUseCase: (row.tenTruongHop || "").trim(),
            tacNhanChinh: (row.tacNhanChinh || []).join(", "),
            doPhucTap: row.doPhucTapCode || "",
            lstHanhDong: (row.moTa || []).join("||"),
            lstHanhDongNangCao: (row.lstHanhDongNangCao || []).join("||"),
            loaiUseCaseCode,
          };

          if (row.id && row.id.trim() !== "") {
            updatePayloads.push({ id: row.id, ...basePayload });
          } else {
            createPayloads.push(basePayload);
          }
        }

        // Gọi API updateMany một lần cho tất cả bản ghi cần cập nhật
        if (updatePayloads.length > 0) {
          try {
            const res = await uC_UseCaseDemoService.updateMany(
              updatePayloads as any
            );
            if (res.status) {
              updateCount = res.data?.length ?? updatePayloads.length;
              successCount += updateCount;
            } else {
              errorCount += updatePayloads.length;
            }
          } catch (err) {
            console.error("Lỗi updateMany:", err);
            errorCount += updatePayloads.length;
          }
        }

        // Gọi API createMany một lần cho tất cả bản ghi cần tạo mới
        if (createPayloads.length > 0) {
          try {
            const res = await uC_UseCaseDemoService.createMany(
              createPayloads as any
            );
            if (res.status) {
              createCount = res.data?.length ?? createPayloads.length;
              successCount += createCount;
            } else {
              errorCount += createPayloads.length;
            }
          } catch (err) {
            console.error("Lỗi createMany:", err);
            errorCount += createPayloads.length;
          }
        }

        // Reload dữ liệu sau khi lưu tất cả để cập nhật UI
        if (successCount > 0) {
          await loadUseCaseDemoData();
        }

        if (errorCount === 0) {
          message.success(
            `Lưu thành công ${successCount} UseCase! (${createCount} mới, ${updateCount} cập nhật)`
          );
        } else if (successCount === 0) {
          message.error(`Lưu thất bại ${errorCount} UseCase!`);
        } else {
          message.warning(
            `Lưu thành công ${successCount} UseCase (${createCount} mới, ${updateCount} cập nhật), thất bại ${errorCount} UseCase!`
          );
        }
      } catch (error) {
        console.error("Lỗi khi lưu tất cả UseCase:", error);
        message.error("Lỗi khi lưu UseCase!");
      } finally {
        setSaving(false);
      }
    };

    // Hàm search theo tên usecase
    const handleSearch = async () => {
      if (!idDuAn || idDuAn.trim() === "") return;
      setLoadingData(true);
      try {
        const response = await uC_UseCaseDemoService.getData({
          idDuAn: idDuAn,
          pageSize: 1000,
          pageIndex: 1,
          tenUseCase: searchText.trim() || undefined,
        });
        if (response.status && response.data) {
          const responseData = response.data as any;
          const items = Array.isArray(responseData)
            ? responseData
            : responseData.items || [];
          const useCaseRows: UseCaseRow[] = items.map(
            (item: any, index: number) => {
              // Tách lstHanhDong thành mảng moTa (sử dụng || làm separator)
              const moTaArray = item.lstHanhDong
                ? item.lstHanhDong
                    .split("||")
                    .map((s: string) => s.trim())
                    .filter((s: string) => s !== "")
                : [""];
              // Tách lstHanhDongNangCao thành mảng (sử dụng || làm separator); nếu API trả array thì dùng trực tiếp
              const lstHanhDongNangCaoArray = Array.isArray(
                item.lstHanhDongNangCao
              )
                ? item.lstHanhDongNangCao
                : typeof item.lstHanhDongNangCao === "string"
                ? item.lstHanhDongNangCao
                    .split("||")
                    .map((s: string) => s.trim())
                    .filter((s: string) => s.length > 0)
                : [];
              // Tách tacNhanChinh thành mảng
              const tacNhanArray = item.tacNhanChinh
                ? item.tacNhanChinh
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter((s: string) => s !== "")
                : [];
              // Parse loại từ loaiUseCaseCode/single loaiUseCase
              const codes =
                typeof item.loaiUseCaseCode === "string"
                  ? item.loaiUseCaseCode
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter((s: string) => s.length > 0)
                  : [];
              if (typeof item.loaiUseCase === "string" && item.loaiUseCase) {
                if (!codes.includes(item.loaiUseCase))
                  codes.push(item.loaiUseCase);
              }
              const baseLoai:
                | "QUANLY_USECASE"
                | "KHAITHAC_USECASE"
                | "BAOCAO_USECASE"
                | undefined = codes.includes("QUANLY_USECASE")
                ? "QUANLY_USECASE"
                : codes.includes("KHAITHAC_USECASE")
                ? "KHAITHAC_USECASE"
                : codes.includes("BAOCAO_USECASE")
                ? "BAOCAO_USECASE"
                : undefined;
              const tacNhanDisplayArray = tacNhanArray.map(
                (maTacNhan: string) => {
                  const option = tacNhanOptions.find(
                    (opt) => opt.value === maTacNhan
                  );
                  return option ? option.label : maTacNhan;
                }
              );
              return {
                key: Date.now() + index,
                tenTruongHop: item.tenUseCase || "",
                tacNhanChinh: tacNhanArray,
                tacNhanChinhDisplay: tacNhanDisplayArray,
                doPhucTapCode: item.doPhucTap || null,
                moTa: moTaArray,
                lstHanhDongNangCao: lstHanhDongNangCaoArray,
                id: item.id,
                loaiUseCase: (baseLoai as any) ?? "QUANLY_USECASE",
                isNewRow: false,
              };
            }
          );
          setData(useCaseRows);
        }
      } catch (error) {
        message.error("Lỗi khi tìm kiếm!");
      } finally {
        setLoadingData(false);
      }
    };

    const exportTableToExcel = async () => {
      // Kiểm tra xem dữ liệu đã sẵn sàng chưa
      if (!isDataReady) {
        message.warning("Đang tải dữ liệu, vui lòng chờ một chút và thử lại!");
        return;
      }

      // Log từng row để kiểm tra tacNhanChinhDisplay
      data.forEach((row, index) => {
        console.log(`Row ${index}:`, {
          tenTruongHop: row.tenTruongHop,
          tacNhanChinh: row.tacNhanChinh,
          tacNhanChinhDisplay: row.tacNhanChinhDisplay,
          doPhucTapCode: row.doPhucTapCode,
          moTa: row.moTa,
        });
      });

      // Kiểm tra nếu không có dữ liệu nào
      if (data.length === 0) {
        message.warning("Không có dữ liệu để xuất Excel!");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách trường hợp sử dụng");

      // Tính toán số lượng theo độ phức tạp
      const countDonGian = data.filter(
        (row) => row.doPhucTapCode === "DonGian"
      ).length;
      const countTrungBinh = data.filter(
        (row) => row.doPhucTapCode === "TrungBinh"
      ).length;
      const countPhucTap = data.filter(
        (row) => row.doPhucTapCode === "PhucTap"
      ).length;
      const totalCount = data.length;

      // Tính tổng số transaction (tổng số mô tả của tất cả trường hợp)
      const totalTransactions = data.reduce((sum, row) => {
        const moTaArray = row.moTa || [""];
        // Nếu có mô tả chi tiết thì đếm số mô tả, nếu không thì đếm 1 (usecase tổng quát)
        return (
          sum +
          (moTaArray.length > 0 && moTaArray[0].trim() !== ""
            ? moTaArray.length
            : 1)
        );
      }, 0);

      // Header row 1 - Tiêu đề các cột
      const headerRow = worksheet.addRow([
        "STT",
        "Tên trường hợp sử dụng",
        "Tác nhân chính",
        "Tác nhân phụ",
        "Mức độ cần thiết",
        "Độ phức tạp",
        "Mô tả trường hợp sử dụng",
        "Giao dịch (Transaction)",
        "Ghi chú",
        "Số transaction",
        "Đơn giản",
        "Trung bình",
        "Phức tạp",
      ]);

      // Format header row - màu vàng và border
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF00" }, // Màu vàng
        };
        cell.font = {
          name: "Times New Roman",
          size: 13,
          bold: true,
          color: { argb: "FF000000" }, // Màu đen
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });

      // Header row 2 - Hàng tổng kết
      const summaryRow = worksheet.addRow([
        "", // STT
        "", // Tên trường hợp
        "", // Tác nhân chính
        "", // Tác nhân phụ
        "", // Mức độ cần thiết
        "", // Độ phức tạp
        `Cộng: ${totalCount}`, // Mô tả - hiển thị tổng số trường hợp
        "", // Giao dịch (Transaction)
        "", // Ghi chú
        totalTransactions, // Số transaction - tổng số mô tả của tất cả trường hợp
        countDonGian, // Số lượng đơn giản
        countTrungBinh, // Số lượng trung bình
        countPhucTap, // Số lượng phức tạp
      ]);

      // Format summary row
      summaryRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE6E6E6" }, // Màu xám nhạt
        };
        cell.font = {
          name: "Times New Roman",
          size: 12, // Font size 12 cho dòng thứ 2
          bold: true,
          color: { argb: "FF000000" },
        };
        // Màu đỏ cho các cột số lượng (cột 11, 12, 13: Đơn giản, Trung bình, Phức tạp)
        if (colNumber >= 11 && colNumber <= 13) {
          cell.font = {
            name: "Times New Roman",
            size: 12,
            bold: true,
            color: { argb: "FFFF0000" }, // Màu đỏ
          };
        }
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });

      // Data - sử dụng tất cả dữ liệu vì đã kiểm tra đầy đủ ở trên
      data.forEach((row, idx) => {
        const moTaArray = row.moTa || [""];

        // Nếu có mô tả, xuất từng mô tả thành 1 hàng riêng
        if (moTaArray.length > 0 && moTaArray[0].trim() !== "") {
          // Thêm hàng "Usecase tổng quát" đầu tiên
          // Xác định tiền tố theo loại
          const typeLabel =
            row.loaiUseCase === "BAOCAO_USECASE"
              ? "Báo cáo"
              : row.loaiUseCase === "KHAITHAC_USECASE"
              ? "Khai thác"
              : row.loaiUseCase === "QUANLY_USECASE"
              ? "Quản lý"
              : "";
          const prefixedName = typeLabel
            ? row.tenTruongHop.startsWith(typeLabel)
              ? row.tenTruongHop
              : `${typeLabel} ${row.tenTruongHop}`
            : row.tenTruongHop;

          const usecaseRow = worksheet.addRow([
            idx + 1, // STT
            prefixedName, // Tên trường hợp theo loại đã chọn
            Array.isArray(row.tacNhanChinhDisplay) &&
            row.tacNhanChinhDisplay.length > 0
              ? row.tacNhanChinhDisplay
                  .filter((name) => name && name.trim())
                  .map(extractTacNhanName)
                  .join(", ")
              : "", // Tác nhân chính
            "", // Tác nhân phụ - để trống
            "", // Mức độ cần thiết - để trống
            row.doPhucTapCode === "DonGian"
              ? "Đơn giản"
              : row.doPhucTapCode === "TrungBinh"
              ? "Trung bình"
              : row.doPhucTapCode === "PhucTap"
              ? "Phức tạp"
              : "", // Độ phức tạp
            "Usecase tổng quát", // Mô tả
            "", // Giao dịch (Transaction) - để trống cho usecase tổng quát
            "", // Ghi chú - để trống
            moTaArray.length, // Số transaction - hiển thị số lượng mô tả của trường hợp này
            "", // Đơn giản - để trống
            "", // Trung bình - để trống
            "", // Phức tạp - để trống
          ]);

          // Format usecase row
          usecaseRow.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFD3D3D3" }, // Màu xám nhạt
            };
            cell.font = {
              name: "Times New Roman",
              size: 12, // Font size 12 cho từ dòng thứ 2 trở đi
              bold: true, // In đậm
              color: { argb: "FF000000" }, // Màu đen
            };
            cell.border = {
              top: { style: "thin", color: { argb: "FF000000" } },
              left: { style: "thin", color: { argb: "FF000000" } },
              bottom: { style: "thin", color: { argb: "FF000000" } },
              right: { style: "thin", color: { argb: "FF000000" } },
            };
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
              wrapText: true,
            };
          });

          // Sau đó thêm các hàng mô tả
          moTaArray.forEach((moTa, moTaIndex) => {
            // Lấy nội dung giao dịch tương ứng từ lstHanhDongNangCao
            const giaoDichContent =
              Array.isArray(row.lstHanhDongNangCao) &&
              row.lstHanhDongNangCao[moTaIndex]
                ? row.lstHanhDongNangCao[moTaIndex]
                : "";

            const dataRow = worksheet.addRow([
              "", // STT để trống
              "", // Tên trường hợp để trống
              "", // Tác nhân chính để trống
              "", // Tác nhân phụ - để trống
              "", // Mức độ cần thiết - để trống
              "", // Độ phức tạp để trống
              moTa.trim(), // Mô tả chi tiết
              giaoDichContent, // Giao dịch (Transaction) - nội dung từ lstHanhDongNangCao
              "", // Ghi chú - để trống
              "", // Số transaction - để trống
              "", // Đơn giản - để trống
              "", // Trung bình - để trống
              "", // Phức tạp - để trống
            ]);

            // Format data row - border và alignment
            dataRow.eachCell((cell) => {
              // Các hàng mô tả có nền trắng
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFFFF" }, // Màu trắng
              };
              cell.font = {
                name: "Times New Roman",
                size: 12, // Font size 12 cho từ dòng thứ 2 trở đi
                color: { argb: "FF000000" },
              };
              cell.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
              };
              cell.alignment = {
                horizontal: "center",
                vertical: "middle",
                wrapText: true,
              };
            });
          });
        } else {
          // Nếu không có mô tả, vẫn xuất 1 hàng với thông tin cơ bản
          // Xác định tiền tố theo loại
          const typeLabel2 =
            row.loaiUseCase === "BAOCAO_USECASE"
              ? "Báo cáo"
              : row.loaiUseCase === "KHAITHAC_USECASE"
              ? "Khai thác"
              : row.loaiUseCase === "QUANLY_USECASE"
              ? "Quản lý"
              : "";
          const prefixedName2 = typeLabel2
            ? row.tenTruongHop.startsWith(typeLabel2)
              ? row.tenTruongHop
              : `${typeLabel2} ${row.tenTruongHop}`
            : row.tenTruongHop;

          const dataRow = worksheet.addRow([
            idx + 1,
            prefixedName2, // Tên trường hợp theo loại đã chọn
            Array.isArray(row.tacNhanChinhDisplay) &&
            row.tacNhanChinhDisplay.length > 0
              ? row.tacNhanChinhDisplay
                  .filter((name) => name && name.trim())
                  .map(extractTacNhanName)
                  .join(", ")
              : "",
            "", // Tác nhân phụ - để trống
            "", // Mức độ cần thiết - để trống
            row.doPhucTapCode === "DonGian"
              ? "Đơn giản"
              : row.doPhucTapCode === "TrungBinh"
              ? "Trung bình"
              : row.doPhucTapCode === "PhucTap"
              ? "Phức tạp"
              : "",
            "Usecase tổng quát",
            "", // Giao dịch (Transaction) - để trống
            "", // Ghi chú - để trống
            1, // Số transaction - 1 vì chỉ có 1 mô tả tổng quát
            "", // Đơn giản - để trống
            "", // Trung bình - để trống
            "", // Phức tạp - để trống
          ]);

          // Format data row - border và alignment
          dataRow.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFD3D3D3" }, // Màu xám nhạt cho hàng không có mô tả
            };
            cell.font = {
              name: "Times New Roman",
              size: 12, // Font size 12 cho từ dòng thứ 2 trở đi
              bold: true, // In đậm
              color: { argb: "FF000000" }, // Màu đen
            };
            cell.border = {
              top: { style: "thin", color: { argb: "FF000000" } },
              left: { style: "thin", color: { argb: "FF000000" } },
              bottom: { style: "thin", color: { argb: "FF000000" } },
              right: { style: "thin", color: { argb: "FF000000" } },
            };
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
              wrapText: true,
            };
          });
        }
      });

      // Set column widths
      worksheet.getColumn(1).width = 5; // STT
      worksheet.getColumn(2).width = 25; // Tên trường hợp sử dụng
      worksheet.getColumn(3).width = 20; // Tác nhân chính
      worksheet.getColumn(4).width = 15; // Tác nhân phụ
      worksheet.getColumn(5).width = 15; // Mức độ cần thiết
      worksheet.getColumn(6).width = 12; // Độ phức tạp
      worksheet.getColumn(7).width = 50; // Mô tả trường hợp sử dụng
      worksheet.getColumn(8).width = 60; // Giao dịch (Transaction)
      worksheet.getColumn(9).width = 15; // Ghi chú
      worksheet.getColumn(10).width = 15; // Số transaction
      worksheet.getColumn(11).width = 10; // Đơn giản
      worksheet.getColumn(12).width = 12; // Trung bình
      worksheet.getColumn(13).width = 10; // Phức tạp

      // Format wrap text for mô tả
      worksheet.getColumn(7).alignment = {
        wrapText: true,
        horizontal: "center",
        vertical: "middle",
      };

      // Format wrap text for giao dịch
      worksheet.getColumn(8).alignment = {
        wrapText: true,
        horizontal: "center",
        vertical: "middle",
      };

      // Set font for all cells
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          if (!cell.font || !cell.font.name) {
            // Dòng 1 (header) giữ nguyên font size 13, từ dòng 2 trở đi là font size 12
            const fontSize = rowNumber === 1 ? 13 : 12;
            let fontColor = { argb: "FF000000" }; // Màu đen mặc định

            // Màu đỏ cho các cột số lượng (cột 11, 12, 13: Đơn giản, Trung bình, Phức tạp) từ dòng 2 trở đi
            if (rowNumber >= 2 && colNumber >= 11 && colNumber <= 13) {
              fontColor = { argb: "FFFF0000" }; // Màu đỏ
            }

            cell.font = {
              name: "Times New Roman",
              size: fontSize,
              color: fontColor,
              ...(cell.font || {}),
            };
          }
          if (!cell.alignment) {
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
              wrapText: true,
            };
          }
        });
      });

      // Xuất file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "DanhSachTruongHopSuDung.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      // Thông báo thành công
      message.success(
        `Xuất Excel thành công! Đã xuất ${data.length} trường hợp sử dụng.`
      );
    };

    const columns = [
      {
        title: "STT",
        dataIndex: "key",
        width: 60,
        align: "center" as const,
        render: (_: any, __: any, idx: number) => idx + 1,
      },
      {
        title: (
          <span>
            Tên trường hợp sử dụng
            <span style={{ color: "#ff4d4f", marginLeft: 4 }}>*</span>
          </span>
        ),
        dataIndex: "tenTruongHop",
        width: 220,
        render: (text: string, record: UseCaseRow) => {
          const isEmpty = !text || text.trim() === "";
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                gap: 8,
                height: "100%",
              }}
            >
              <Input.TextArea
                value={text}
                placeholder={
                  isEmpty
                    ? "Trường này bắt buộc nhập"
                    : "Nhập tên trường hợp sử dụng"
                }
                autoSize={{ minRows: 1, maxRows: 3 }}
                onChange={(e) =>
                  handleCellChange(record.key, "tenTruongHop", e.target.value)
                }
                style={{
                  margin: 0,
                  resize: "vertical",
                  borderColor: isEmpty ? "#ff4d4f" : undefined,
                  backgroundColor: isEmpty ? "#fff2f0" : undefined,
                }}
                status={isEmpty ? "error" : undefined}
                data-row-key={record.key}
                data-field="tenTruongHop"
              />
              <Radio.Group
                value={record.loaiUseCase}
                onChange={(e) =>
                  handleCellChange(record.key, "loaiUseCase", e.target.value)
                }
              >
                <Radio value="QUANLY_USECASE">Quản lý</Radio>
                <Radio value="KHAITHAC_USECASE">Khai thác</Radio>
                <Radio value="BAOCAO_USECASE">Báo cáo</Radio>
              </Radio.Group>
            </div>
          );
        },
      },
      {
        title: (
          <span>
            Tác nhân chính
            <span style={{ color: "#ff4d4f", marginLeft: 4 }}>*</span>
          </span>
        ),
        dataIndex: "tacNhanChinh",
        width: 180,
        render: (text: string[], record: UseCaseRow) => {
          const isEmpty = !text || text.length === 0;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                height: "100%",
                minHeight: "32px",
                width: "100%",
                maxHeight: "120px",
                overflow: "hidden",
              }}
            >
              <Select
                mode="multiple"
                showSearch
                placeholder="Nhập tên tác nhân chính"
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onSearch={searchTacNhan}
                onChange={(values, options) => {
                  console.log(
                    "Select onChange - record.tacNhanChinh:",
                    record.tacNhanChinh
                  );
                  console.log(
                    "Select onChange - record.tacNhanChinhDisplay:",
                    record.tacNhanChinhDisplay
                  );
                  handleTacNhanSelect(record.key, values, options || []);
                }}
                value={record.tacNhanChinh}
                labelInValue={false}
                style={{
                  width: "100%",
                  margin: 0,
                  borderColor: isEmpty ? "#ff4d4f" : undefined,
                  backgroundColor: isEmpty ? "#fff2f0" : undefined,
                  minHeight: "32px",
                  maxHeight: "120px",
                  overflow: "auto",
                }}
                listHeight={300}
                tokenSeparators={[","]}
                dropdownStyle={{
                  overflow: "auto",
                }}
                optionLabelProp="label"
                loading={searchingTacNhan}
                notFoundContent={
                  searchingTacNhan
                    ? "Đang tìm kiếm..."
                    : "Không tìm thấy tác nhân"
                }
                options={tacNhanOptions}
                allowClear
                maxTagCount={undefined}
                tagRender={(props) => {
                  const { value, closable, onClose } = props;

                  // Tìm tên hiển thị dựa trên value (mã tác nhân)
                  const option = tacNhanOptions.find(
                    (opt) => opt.value === value
                  );
                  const displayName = option ? option.label : value;

                  return (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#e6f7ff",
                        border: "1px solid #91d5ff",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        margin: "1px 2px",
                        fontSize: "11px",
                        lineHeight: "1.2",
                        maxWidth: "150px",
                        minHeight: "20px",
                        boxSizing: "border-box",
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          wordBreak: "break-word",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "#1890ff",
                          fontWeight: "500",
                        }}
                        title={displayName}
                      >
                        {displayName}
                      </span>
                      {closable && (
                        <span
                          style={{
                            marginLeft: "4px",
                            cursor: "pointer",
                            color: "#1890ff",
                            fontSize: "12px",
                            flexShrink: 0,
                            fontWeight: "bold",
                            lineHeight: "1",
                          }}
                          onClick={onClose}
                          title="Xóa"
                        >
                          ×
                        </span>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          );
        },
      },
      {
        title: (
          <span>
            Độ phức tạp
            <span style={{ color: "#ff4d4f", marginLeft: 4 }}>*</span>
          </span>
        ),
        dataIndex: "doPhucTapCode",
        width: 140,
        render: (value: string | null, record: UseCaseRow) => {
          const isEmpty = value === null;
          console.log(
            "Render doPhucTapCode - doPhucTapOptions:",
            doPhucTapOptions
          );
          console.log(
            "Render doPhucTapCode - doPhucTapOptions.length:",
            doPhucTapOptions.length
          );
          return (
            <Select
              key={`doPhucTap-${doPhucTapOptions.length}`}
              value={value}
              placeholder={isEmpty ? "Bắt buộc chọn" : "Chọn độ phức tạp"}
              style={{
                width: "100%",
                borderColor: isEmpty ? "#ff4d4f" : undefined,
              }}
              options={doPhucTapOptions}
              onChange={(val) => {
                handleCellChange(record.key, "doPhucTapCode", val);
              }}
              status={isEmpty ? "error" : undefined}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          );
        },
      },
      {
        title: (
          <span>
            Mô tả trường hợp sử dụng
            <br />
            <span style={{ fontWeight: 400, fontSize: 12, color: "#888" }}>
              (Bấm nút <BulbOutlined /> để tạo tự động)
            </span>
          </span>
        ),
        dataIndex: "moTa",
        width: 600,
        render: (moTa: string[], record: UseCaseRow) => (
          <div style={{ minWidth: 400 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {Array.isArray(moTa) && moTa.length > 0 ? (
                moTa.map((desc, idx) => (
                  <Input.TextArea
                    key={idx}
                    value={desc}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{
                      marginBottom: 4,
                      whiteSpace: "pre-line",
                      wordBreak: "break-word",
                    }}
                    onChange={(e) =>
                      handleMoTaChange(record.key, idx, e.target.value)
                    }
                    placeholder={`Mô tả #${idx + 1}`}
                  />
                ))
              ) : (
                <Input.TextArea
                  value={moTa && moTa[0] ? moTa[0] : ""}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={{
                    marginBottom: 4,
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                  }}
                  onChange={(e) =>
                    handleMoTaChange(record.key, 0, e.target.value)
                  }
                  placeholder="Nhập mô tả trường hợp sử dụng"
                />
              )}
              <Button
                icon={<BulbOutlined />}
                size="small"
                type="primary"
                loading={loading}
                onClick={() => handleGenerateMoTa(record)}
                disabled={loading}
              >
                Tạo mô tả trường hợp
              </Button>
            </Space>
          </div>
        ),
      },
      {
        title: "Thao tác",
        key: "action",
        width: 120,
        align: "center" as const,
        render: (_: any, record: UseCaseRow) => (
          <Space size="small">
            <Button
              type="text"
              icon={<SaveOutlined />}
              size="small"
              title="Lưu UseCase"
              onClick={() => handleSaveUseCase(record)}
              loading={saving}
              disabled={saving || !idDuAn || idDuAn.trim() === ""}
              style={{ color: "#52c41a" }}
            />
            <Popconfirm
              title="Xóa trường hợp sử dụng"
              description="Bạn có chắc chắn muốn xóa trường hợp này?"
              onConfirm={() => handleDeleteRow(record.key)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                title="Xóa"
              />
            </Popconfirm>
          </Space>
        ),
      },
    ];

    useImperativeHandle(ref, () => ({
      handleGenerateAll,
      handleSaveAllUseCases,
      exportTableToExcel,
      handleAddRow,
      reloadTacNhanList: () => {
        loadTacNhanList();
      },
      refreshData: () => {
        loadUseCaseDemoData();
      },
    }));

    // Tính số lượng từng loại độ phức tạp
    const countDonGian = data.filter(
      (row) => row.doPhucTapCode === "DonGian"
    ).length;
    const countTrungBinh = data.filter(
      (row) => row.doPhucTapCode === "TrungBinh"
    ).length;
    const countPhucTap = data.filter(
      (row) => row.doPhucTapCode === "PhucTap"
    ).length;

    return (
      <div className="bg-white p-4 rounded shadow">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Input
            placeholder="Tìm kiếm theo tên UseCase"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300, marginRight: 8 }}
            allowClear
          />
          <Button
            icon={<SearchOutlined />}
            type="primary"
            onClick={handleSearch}
            style={{ marginRight: 16 }}
          >
            Tìm kiếm
          </Button>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddRow}
              >
                Thêm trường hợp sử dụng
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  loadTacNhanList();
                  loadUseCaseDemoData();
                }}
                type="default"
                style={{
                  border: "1px solid #fa8c16",
                  color: "#fa8c16",
                }}
              >
                Làm mới
              </Button>
            </Space>
            <Space>
              <Button
                icon={<BulbOutlined />}
                onClick={handleGenerateAll}
                loading={loading}
                disabled={loading}
                type="default"
                style={{
                  border: "1px solid #0000002b",
                }}
              >
                Tạo mô tả tất cả
              </Button>
              <Button
                icon={<SaveOutlined />}
                onClick={handleSaveAllUseCases}
                loading={saving}
                disabled={saving || !idDuAn || idDuAn.trim() === ""}
                type="default"
                style={{
                  border: "1px solid #52c41a",
                  color: "#52c41a",
                }}
              >
                Lưu tất cả UseCase
              </Button>
              <Button
                icon={<FileExcelOutlined />}
                onClick={exportTableToExcel}
                type="primary"
                disabled={!isDataReady}
                title={!isDataReady ? "Đang tải dữ liệu..." : "Xuất Excel"}
              >
                Xuất Excel
              </Button>
            </Space>
          </Space>
        </div>
        <div
          style={{
            marginBottom: 12,
            fontWeight: 500,
            fontSize: 16,
            color: "#333",
          }}
        >
          Tổng:{" "}
          <span style={{ color: "#52c41a" }}>{countDonGian} Đơn giản</span> |
          <span style={{ color: "#faad14", marginLeft: 8 }}>
            {countTrungBinh} Trung bình
          </span>{" "}
          |
          <span style={{ color: "#ff4d4f", marginLeft: 8 }}>
            {countPhucTap} Phức tạp
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
            scroll={{ x: 1320 }}
            size="middle"
            style={{ minWidth: 1320 }}
            rowKey="key"
            rowClassName={(record) => "excel-table-row"}
            onRow={(record) =>
              ({
                "data-row-key": record.key,
              } as any)
            }
            loading={loadingData}
          />

          {/* Helper Buttons - Fixed Position Right */}
          <div
            style={{
              position: "fixed",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              background: "white",
              padding: "12px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              border: "1px solid #d9d9d9",
            }}
          >
            <Button
              size="small"
              icon={<VerticalAlignTopOutlined />}
              onClick={() => scrollToPosition("top")}
              title="Cuộn lên đầu danh sách"
              style={{
                width: "40px",
                height: "40px",
                borderColor: "#1890ff",
                color: "#1890ff",
              }}
            />

            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddRow}
              title="Thêm trường hợp sử dụng"
              style={{
                width: "40px",
                height: "40px",
                borderColor: "#52c41a",
                color: "#52c41a",
              }}
            />

            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => {
                loadTacNhanList();
                loadUseCaseDemoData();
              }}
              title="Làm mới dữ liệu (Refresh)"
              style={{
                width: "40px",
                height: "40px",
                borderColor: "#fa8c16",
                color: "#fa8c16",
              }}
            />

            <Button
              size="small"
              icon={<BulbOutlined />}
              onClick={handleGenerateAll}
              loading={loading}
              disabled={loading}
              title="Tạo mô tả tất cả"
              style={{
                width: "40px",
                height: "40px",
                borderColor: "#faad14",
                color: "#faad14",
              }}
            />

            <Button
              size="small"
              icon={<SaveOutlined />}
              onClick={handleSaveAllUseCases}
              loading={saving}
              disabled={saving || !idDuAn || idDuAn.trim() === ""}
              title="Lưu tất cả UseCase"
              style={{
                width: "40px",
                height: "40px",
                borderColor: "#13c2c2",
                color: "#13c2c2",
              }}
            />

            <Button
              size="small"
              icon={<FileExcelOutlined />}
              onClick={exportTableToExcel}
              disabled={!isDataReady}
              title={!isDataReady ? "Đang tải dữ liệu..." : "Xuất Excel"}
              style={{
                width: "40px",
                height: "40px",
                borderColor: "#722ed1",
                color: "#722ed1",
              }}
            />

            <Button
              size="small"
              icon={<VerticalAlignBottomOutlined />}
              onClick={() => scrollToPosition("bottom")}
              title="Cuộn xuống cuối danh sách"
              style={{
                width: "40px",
                height: "40px",
                borderColor: "#eb2f96",
                color: "#eb2f96",
              }}
            />
          </div>
        </div>
        <style>{`
        .excel-table-row .ant-table-cell {
          vertical-align: top !important;
        }
        
        /* Loại bỏ giới hạn độ cao để tránh 2 thanh scroll */
        .ant-table-wrapper {
          overflow: visible !important;
        }
        
        .ant-table-content {
          overflow: visible !important;
        }
        
        .ant-table-body {
          overflow: visible !important;
        }
        
        /* Đảm bảo table có thể mở rộng tự nhiên */
        .ant-table {
          overflow: visible !important;
        }
      `}</style>
      </div>
    );
  }
);

GenerateUserCase.displayName = "GenerateUserCase";
export default GenerateUserCase;
