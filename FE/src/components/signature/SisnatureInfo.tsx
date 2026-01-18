"use client";
import Loading from "@/components/effect-components/Loading";
import { uploadFileService } from "@/services/File/uploadFile.service";
import kySoCauHinhService from "@/services/kySoCauHinh/kySoCauHinhService";
import kySoInfoService from "@/services/kySoInfo/kySoInfoService";
import { soLieuKeKhaiService } from "@/services/SoLieuKeKhai/soLieuKeKhai.service";
import { useSelector } from "@/store/hooks";
import { ChuKyType } from "@/types/kySoCauHinh/chuKy";
import
  {
    KySoCauHinhType,
    PdfDisplayType,
  } from "@/types/kySoCauHinh/kySoCauHinh";
import
  {
    DEFAULT_CAU_HINH_IMAGE,
    DEFAULT_CAU_HINH_TEXT,
  } from "@/types/kySoCauHinh/kySoCauHinh.constant";
import { KySoInfoType } from "@/types/kySoInfo/kySoInfo";
import
  {
    AppstoreAddOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PictureOutlined,
    SafetyCertificateOutlined,
    SignatureOutlined,
    SyncOutlined,
    UploadOutlined,
    WarningOutlined
  } from "@ant-design/icons";
import { PdfJs, Viewer, Worker } from "@react-pdf-viewer/core";
import
  {
    Button,
    Col,
    ColorPicker,
    Dropdown,
    Form,
    Input,
    message,
    Modal,
    Progress,
    Row,
    Tag,
    Upload,
  } from "antd";
import { MenuProps } from "antd/lib";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import SignaturePad from "react-signature-canvas";
import { v4 as uuidv4 } from "uuid";
import { addImageAndTextToPdf, extractFilePath } from "./utils/KySoHelper";
const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;
const workerUrl = "/pdf.worker.min.js";
const primaryColor = "#CE1127";

type KySoInfoProps = {
  idBieuMau: string;
  idDTTienTrinhXuLy: string;
  isLopTruongOrGvhd?: boolean;
  idUser?: string;
};

const KySoInfo = ({ idBieuMau, idDTTienTrinhXuLy, isLopTruongOrGvhd, idUser }: KySoInfoProps) => {
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  useEffect(() => {
    function updatePadWidth() {
      if (signaturePadContainerRef.current) {
        setSignaturePadWidth(signaturePadContainerRef.current.offsetWidth);
        if (signaturePadRef) {
          signaturePadRef.clear();
        }
      }
    }
    if (showSignaturePad) {
      updatePadWidth();
      window.addEventListener("resize", updatePadWidth);
    }
    return () => {
      window.removeEventListener("resize", updatePadWidth);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSignaturePad]);
  //1.Biến và trạng thái
  // Redux
  const user = useSelector((state) => state.auth.User);
  const roles = user?.listRole ?? [];

  // Form
  const [form] = Form.useForm<KySoCauHinhType>();

  // PDF hiển thị
  const [pdfDisplay, setPdfDisplay] = useState<PdfDisplayType>({
    displayWidth: 0,
    displayHeight: 0,
    marginLeft: 0,
    marginTop: 5,
  });

  // Trạng thái dữ liệu
  const [listCauHinh, setListCauHinh] = useState<KySoCauHinhType[]>([]);
  const [kySoInfo, setKySoInfo] = useState<KySoInfoType | null>(null);

  // Modal / UI state
  const [isModalUploadProgressOpen, setIsModalUploadProgressOpen] =
    useState(false);
  const [isModalKySoOpen, setIsModalKySoOpen] = useState(false);
  const [isModalCauHinhOpen, setIsModalCauHinhOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cấu hình thêm
  const [cauHinhType, setCauHinhType] = useState("TEXT");
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  // Liên quan đến file PDF
  const [pdfTempLink, setPdfTempLink] = useState("");
  const [pdfKySoLink, setPdfKySoLink] = useState("");

  // Kết nối SignalR
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Chữ ký
  const [signatureList, setSignatureList] = useState<ChuKyType[]>([]);
  const [selectedSignature, setSelectedSignature] = useState<string | null>(
    null
  );

  const [signaturePadRef, setSignaturePadRef] = useState<SignaturePad | null>(
    null
  );
  const [signaturePadWidth, setSignaturePadWidth] = useState<number>(400);
  const signaturePadContainerRef = useRef<HTMLDivElement | null>(null);

  //2. Hàm tiện ích
  const getFileName = (path: string) => path?.split("/").pop() ?? "";

  const calculatePageFromY = (y: number) => {
    const pageHeight = pdfDisplay.displayHeight;
    const adjustedY = y - pdfDisplay.marginTop;
    return Math.floor(adjustedY / pageHeight) + 1;
  };

  const resetForm = () => {
    form.resetFields();
    form.setFieldsValue({
      fontSize: 8,
      textColor: primaryColor,
      content: "",
      imageFile: undefined,
      type: cauHinhType,
    });
    setSelectedSignature(null);
    setShowSignaturePad(false);
  };

  const fetchSignatureList = async () => {
    try {
      const response = await kySoCauHinhService.getChuKy();
      if (response?.status) {
        setSignatureList(response.data || []);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chữ ký:", error);
      // Fallback về dữ liệu giả lập nếu API chưa sẵn sàng
      setSignatureList([]);
    }
  };

  const cleanUp = () => {
    setPdfTempLink("");
    setPdfKySoLink("");
    setKySoInfo(null);
    setListCauHinh([]);
  };

  // 3. Xử lý PDF và lấy dữ liệu
  const handleDocumentLoad = useCallback((e: { doc: PdfJs.PdfDocument }) => {
    const doc = e.doc;
    doc.getPage(1).then((page) => {
      const viewport = page.getViewport({ scale: 1 });
      const pdfWidth = viewport.width;
      const pdfHeight = viewport.height;
      const containerWidth = 793;
      const marginLeft = Math.floor((containerWidth - pdfWidth) / 2);
      setPdfDisplay({
        displayWidth: pdfWidth,
        displayHeight: pdfHeight,
        marginLeft,
        marginTop: 5,
      });
    });
  }, []);

  const handleShowPdf = async () => {
    setOpen(true);
    setIsLoading(true);
    cleanUp();
    try {
      // Try to generate/preview the PDF via SoLieuKeKhai preview API
      try
      {
        if ( isLopTruongOrGvhd )
        {
         const res = await soLieuKeKhaiService.GetDetail(idBieuMau, idUser!);
          if (res.status) {
              setPdfTempLink(extractFilePath(res.data));
          } else {
              message.error("Không thể xem chi tiết");
         }
          
        } else
        {
           const responseDuLieuBieuMau = await soLieuKeKhaiService.PreSoLieuKeKhai(
            idBieuMau
          );
          if (responseDuLieuBieuMau?.status && responseDuLieuBieuMau.data?.path) {
            setPdfTempLink(extractFilePath(responseDuLieuBieuMau.data.path));
          } else {
            message.error("Không thể tải trước file PDF");
          }
        }

       
      } catch (err) {
        console.error("Lỗi khi gọi PreviewSoLieuFilePdf:", err);
        message.error("Lỗi khi tải trước file PDF");
      }
      
    } catch (error) {
      console.error("Lỗi khi kết xuất PDF:", error);
      setIsLoading(false);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pdfDisplay.displayWidth && pdfDisplay.displayHeight) {
      const fetchCauHinhKySo = async () => {
        try {
          const res = await kySoCauHinhService.getByThongTin(
            idBieuMau,
            idDTTienTrinhXuLy
          );
          if (res?.status) {
            setListCauHinh(res.data);
          }
        } catch (error) {
          console.error("Lỗi khi lấy cấu hình ký số:", error);
        }
      };
      fetchCauHinhKySo();
    }
  }, [pdfDisplay, idBieuMau, idDTTienTrinhXuLy, open]);

  const items = useMemo<MenuProps["items"]>(
    () => [
      // {
      //   label: (
      //     <>
      //       <FileTextOutlined /> Thêm text
      //     </>
      //   ),
      //   key: "addText",
      // },
      // {
      //   label: (
      //     <>
      //       <FileTextOutlined /> Thêm nhanh thông tin
      //     </>
      //   ),
      //   key: "addTextDefault",
      // },
      {
        label: (
          <>
            <PictureOutlined /> Chọn chữ ký
          </>
        ),
        key: "addImage",
      },
      // {
      //   label: (
      //     <>
      //       <PictureOutlined /> Thêm nhanh chữ ký
      //     </>
      //   ),
      //   key: "addImageDefault",
      // },
    ],
    []
  );

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "addText":
        handleAddCauHinh("TEXT");
        break;
      case "addImage":
        handleAddCauHinh("IMAGE");
        break;
      case "addTextDefault":
        handleAddCauHinhDefault("TEXT");
        break;
      case "addImageDefault":
        handleAddCauHinhDefault("IMAGE");
        break;
      default:
        break;
    }
  };

  const handleAddCauHinh = (type: string) => {
    setCauHinhType(type);
    form.setFieldValue("type", type);
    setIsModalCauHinhOpen(true);
    if (type === "IMAGE") {
      fetchSignatureList();
    }
    if (contextMenuPos) {
      const posX = contextMenuPos.x - pdfDisplay.marginLeft;
      const posY = contextMenuPos.y - pdfDisplay.marginTop;
      form.setFieldsValue({
        posX: Math.max(0, posX),
        posY: Math.max(0, posY),
      });
    }
  };

  const handleAddCauHinhDefault = (type: string) => {
    setCauHinhType(type);
    form.setFieldValue("type", type);
    let posX = 0;
    let posY = 0;
    let page = 1;
    // Sử dụng tọa độ từ contextMenuPos nếu có
    if (contextMenuPos) {
      posX = contextMenuPos.x - pdfDisplay.marginLeft;
      posY = contextMenuPos.y - pdfDisplay.marginTop;
      page = calculatePageFromY(posY);
      form.setFieldsValue({
        posX: Math.max(0, posX),
        posY: Math.max(0, posY),
      });
    }
    let newCauHinh: KySoCauHinhType;
    switch (type) {
      case "TEXT":
        setIsModalCauHinhOpen(true);
        const now = new Date();
        const formattedDate = now.toLocaleDateString("vi-VN");
        const formattedTime = now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        form.setFieldsValue({
          content: `KÝ BỞI: ${user?.name?.toUpperCase()} \n KÝ NGÀY: ${formattedDate} ${formattedTime}`,
          fontSize: 8,
          textColor: primaryColor,
        });
        break;
      case "IMAGE":
        const imgChuKy = user?.anhChuKy;
        if (imgChuKy) {
          form.setFieldsValue({
            imageFile: undefined,
          });

          // Tạo một đối tượng Image để lấy kích thước tự nhiên của ảnh
          const img = new window.Image();
          img.src = `${StaticFileUrl}/${imgChuKy}`;
          console.log(`img.src`, img.src);
          img.onload = () => {
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            const maxHeight = 75; // Giới hạn chiều cao tối đa
            const scale = Math.min(maxHeight / naturalHeight, 1);
            const scaledWidth = naturalWidth * scale;
            const scaledHeight = naturalHeight * scale;

            // Cập nhật cấu hình mặc định cho ảnh chữ ký
            newCauHinh = {
              ...DEFAULT_CAU_HINH_IMAGE,
              id: uuidv4(),
              imageSrc: imgChuKy,
              width: Math.floor(scaledWidth),
              height: Math.floor(scaledHeight),
              posX: Math.max(0, posX),
              posY: Math.max(0, posY),
              idBieuMau: idBieuMau,
              idDTTienTrinhXuLy: idDTTienTrinhXuLy,
            };
            setListCauHinh((prev) => [...prev, newCauHinh]);
          };
          img.onerror = () => {
            message.error(
              "Không thể tải ảnh chữ ký. Vui lòng chọn ảnh thủ công."
            );
            setIsModalCauHinhOpen(true);
            form.setFieldsValue({
              imageFile: undefined,
            });
          };
        } else {
          message.warning("Không tìm thấy ảnh chữ ký. Vui lòng chọn ảnh.");
          setIsModalCauHinhOpen(true);
          form.setFieldsValue({
            imageFile: undefined,
            posX: Math.max(0, posX),
            posY: Math.max(0, posY),
          });
        }
        break;
      default:
        break;
    }
  };

  const handleAddCauHinhOk = async () => {
    const values = form.getFieldsValue();
    if (cauHinhType === "IMAGE") {
      let imageSrc = "";

      // Kiểm tra xem có chọn chữ ký có sẵn không
      if (selectedSignature) {
        const selectedSig = signatureList.find(
          (sig) => sig.id === selectedSignature
        );
        if (selectedSig) {
          imageSrc = selectedSig.duongDanFile;
        }
      } else if (values.imageFile) {
        // Upload file mới
        const formData = new FormData();
        formData.append("file", values.imageFile);
        const response = await kySoCauHinhService.upload(formData);
        if (response && response.status) {
          imageSrc = response.data;
        }
      } else {
        message.error("Vui lòng chọn chữ ký hoặc upload ảnh mới");
        return;
      }

      if (imageSrc) {
        const img = new window.Image();
        img.src = `${StaticFileUrl}/${imageSrc}`;
        img.onload = () => {
          const naturalWidth = img.naturalWidth;
          const naturalHeight = img.naturalHeight;
          const maxHeight = 75;
          const scale = Math.min(maxHeight / naturalHeight, 1);
          const scaledWidth = naturalWidth * scale;
          const scaledHeight = naturalHeight * scale;

          const newCauHinh: KySoCauHinhType = {
            ...DEFAULT_CAU_HINH_IMAGE,
            id: uuidv4(),
            imageSrc: imageSrc,
            width: Math.floor(scaledWidth),
            height: Math.floor(scaledHeight),
            posX: values.posX || 0,
            posY: values.posY || 0,
            idBieuMau: idBieuMau,
            idDTTienTrinhXuLy: idDTTienTrinhXuLy,
          };
          setListCauHinh((prev) => [...prev, newCauHinh]);
        };
      }
    } else {
      const newCauHinh: KySoCauHinhType = {
        ...DEFAULT_CAU_HINH_TEXT,
        ...values,
        id: uuidv4(),
        posX: values.posX || 0,
        posY: values.posY || 0,
        idBieuMau: idBieuMau,
        idDTTienTrinhXuLy: idDTTienTrinhXuLy,
      };
      setListCauHinh((prev) => [...prev, newCauHinh]);
    }
    resetForm();
    setFileList([]);
    setIsModalCauHinhOpen(false);
  };

  const handleRemoveCauHinh = (id: string) => {
    setListCauHinh((prev) => prev.filter((item) => item.id != id));
  };

  //6. Lưu & Ký số
  const handleSaveCauHinhKySo = async (showMessage: boolean = true) => {
    const blob = await addImageAndTextToPdf(
      listCauHinh,
      pdfTempLink,
      pdfDisplay
    );
    const file = new File([blob], `${idBieuMau}_${idDTTienTrinhXuLy}.pdf`, {
      type: "application/pdf",
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("idBieuMau", idBieuMau);
    formData.append("idDTTienTrinhXuLy", idDTTienTrinhXuLy );
    formData.append("idUser", idUser! ?? "");
    formData.append("listCauHinh", JSON.stringify(listCauHinh));

    const response = await kySoCauHinhService.save(formData, isLopTruongOrGvhd || false);
    if (response?.status) {
      setKySoInfo(response.data);
      setPdfKySoLink(response.data.duongDanFileTemp);
      if (showMessage) {
        message.success("Lưu cấu hình thành công");
      }
    }
  };

  const handleKySoInfo = async () => {
    if (!pdfKySoLink) return message.error("Chưa cấu hình file ký số");
    try {
      setUploadProgress(0);
      setIsModalUploadProgressOpen(true);
      try {
        const res = await kySoInfoService.updateStatus(idBieuMau);
        if (res?.status) {
          message.success("Gửi yêu cầu ký số thành công");
        } else {
          message.error("Gửi yêu cầu ký số thất bại");
        }
      } catch (err) {
        console.error("Lỗi khi gọi updateStatus:", err);
        message.error("Lỗi khi gửi yêu cầu ký số");
      } finally {
        setIsModalUploadProgressOpen(false);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu ký số:", error);
    }
  };

  //7. Hành động nhỏ
  const handleCancel = async () => {
    setOpen(false);
    if (pdfTempLink) {
      try {
        await uploadFileService.deleteTemp(pdfTempLink);
      } catch (error) {
        console.error("Lỗi khi xóa file tạm:", error);
      }
    }
    cleanUp();
  };

  const handleDownloadKySoLink = () => {
    if (kySoInfo?.duongDanFile) {
      window.open(`${StaticFileUrl}/${kySoInfo.duongDanFile}`, "_blank");
    } else {
      message.warning("Không tìm thấy file ký số để tải xuống!");
    }
  };

  const handleUploadChange = (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // chỉ 1 file
    setFileList(newFileList);
    // Reset selected signature khi upload file mới
    if (newFileList.length > 0) {
      setSelectedSignature(null);
    }
  };

  const handleSaveSignature = async () => {
    if (!signaturePadRef || signaturePadRef.isEmpty()) {
      message.error("Vui lòng vẽ chữ ký trước khi lưu");
      return;
    }

    try {
      const dataUrl = signaturePadRef.toDataURL();
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("File", blob, "signature.png");
      const apiResponse = await kySoCauHinhService.saveChuKy(formData);
      if (apiResponse?.status) {
        message.success("Lưu chữ ký thành công!");
        setShowSignaturePad(false);
        fetchSignatureList();
      } else {
        message.error("Lưu chữ ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu chữ ký:", error);
      message.error("Lưu chữ ký thất bại!");
    }
  };

  const handleClearSignature = () => {
    if (signaturePadRef) {
      signaturePadRef.clear();
    }
  };

  return (
    <div>
      <Button
        icon={<SignatureOutlined />}
        size="small"
        type="primary"
        onClick={handleShowPdf}
      >
        Ký số
      </Button>

      <Modal
        style={{ top: "20px" }}
        title={
          <div className="text-sm flex justify-start w-full pl-2 pr-8">
            {kySoInfo?.trangThai == "DAKYSO" &&
              kySoInfo.listCertificateInfo &&
              kySoInfo.listCertificateInfo.length > 0 && (
                <>
                  <Tag
                    icon={<DownloadOutlined />}
                    color="processing"
                    onClick={handleDownloadKySoLink}
                    className="cursor-pointer"
                  >
                    Tải xuống
                  </Tag>
                </>
              )}
            {isLoading ? (
              <Tag
                icon={<SyncOutlined spin />}
                color="default"
                className="ml-auto"
              >
                Đang kiểm tra cấu hình
              </Tag>
            ) : kySoInfo?.duongDanFileTemp ? (
              <Tag
                icon={<SafetyCertificateOutlined />}
                color="success"
                className="ml-auto"
              >
                Đã cấu hình
              </Tag>
            ) : (
              <Tag icon={<WarningOutlined />} color="error" className="ml-auto">
                Chưa cấu hình
              </Tag>
            )}
          </div>
        }
        closable={{ "aria-label": "Close Button" }}
        open={open}
        width={840}
        getContainer={false}
        onCancel={handleCancel}
        footer={
          !isLoading
            ? [
                <Button
                  key="saveCauHinh"
                  onClick={() => handleSaveCauHinhKySo()}
                  type="primary"
                  icon={<AppstoreAddOutlined />}
                >
                  Lưu cấu hình
                </Button>,
                <Button
                  key="sign"
                  size="small"
                  type="primary"
                  onClick={async () => {
                    await handleSaveCauHinhKySo(false);
                    setIsModalKySoOpen(true);
                  }}
                >
                  <SignatureOutlined /> Ký số
                </Button>,
                <Button key="close" onClick={handleCancel}>
                  Đóng
                </Button>,
              ]
            : [
                <Button
                  key="saveCauHinh"
                  onClick={() => handleSaveCauHinhKySo()}
                  type="primary"
                  icon={<AppstoreAddOutlined />}
                >
                  Lưu cấu hình
                </Button>,
                <Button key="close" onClick={handleCancel}>
                  Đóng
                </Button>,
              ]
        }
      >
        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          trigger={["contextMenu"]}
        >
          <div
            style={{ width: 793 }}
            className="!relative !overflow-hidden"
            onContextMenu={(e) => {
              e.preventDefault();
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.floor(e.clientX - rect.left); // Tọa độ x tương đối
              const y = Math.floor(e.clientY - rect.top); // Tọa độ y tương đối
              setContextMenuPos({ x, y }); // Lưu tọa độ nhấp chuột
            }}
          >
            {pdfTempLink ? (
              <Worker workerUrl={workerUrl}>
                <Viewer
                  fileUrl={`${StaticFileUrl}/${pdfTempLink}`}
                  defaultScale={1}
                  // defaultScale={scale}
                  onDocumentLoad={handleDocumentLoad}
                  renderLoader={() => <Loading className="mt-12" />}
                />
              </Worker>
            ) : (
              <Loading title="Đang tải PDF..." className="mt-12" />
            )}

            {/* Khối kéo thả cho hình ảnh */}
            {listCauHinh.map((item, index) => {
              const x = (item.posX ?? 0) + pdfDisplay.marginLeft;
              const y = (item.posY ?? 0) + pdfDisplay.marginTop;

              return (
                <Rnd
                  key={item.id}
                  size={{ width: item.width ?? 150, height: item.height ?? 75 }}
                  position={{ x, y }}
                  onDragStop={(e, d) => {
                    const newY = d.y - pdfDisplay.marginTop;
                    const newPage = calculatePageFromY(newY);
                    const updatedItem = {
                      ...item,
                      posX: d.x - pdfDisplay.marginLeft,
                      posY: newY,
                      page: newPage,
                    };

                    setListCauHinh((prev) =>
                      prev.map((cauHinh) =>
                        cauHinh.id === item.id ? updatedItem : cauHinh
                      )
                    );
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    const newY = position.y - pdfDisplay.marginTop;
                    const newPage = calculatePageFromY(newY);

                    const updatedItem = {
                      ...item,
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      posX: position.x - pdfDisplay.marginLeft,
                      posY: newY,
                      page: newPage,
                    };

                    setListCauHinh((prev) =>
                      prev.map((cauHinh) =>
                        cauHinh.id === item.id ? updatedItem : cauHinh
                      )
                    );
                  }}
                  minWidth={50}
                  minHeight={25}
                  maxWidth={pdfDisplay.displayWidth}
                  maxHeight={pdfDisplay.displayHeight}
                  bounds="parent"
                  enableResizing={{ bottomRight: true }}
                  style={{
                    border: `1px dashed ${
                      item.type === "IMAGE" ? primaryColor : "blue"
                    }`,
                    boxSizing: "border-box",
                    display: item.type === "TEXT" ? "flex" : undefined,
                    alignItems: item.type === "TEXT" ? "center" : undefined,
                    padding: item.type === "TEXT" ? "5px" : undefined,
                    position: "relative",
                  }}
                >
                  {item.type === "IMAGE" ? (
                    <img
                      src={`${StaticFileUrl}/${item.imageSrc ?? ""}`}
                      alt={`Image ${item.id}`}
                      width={item.width}
                      height={item.height}
                      style={{
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                      }}
                    />
                  ) : (
                    <textarea
                      placeholder="Nhập nội dung..."
                      value={item.content}
                      onChange={(e) => {
                        const updatedItem = {
                          ...item,
                          content: e.target.value,
                        };
                        setListCauHinh((prev) =>
                          prev.map((cauHinh) =>
                            cauHinh.id === item.id ? updatedItem : cauHinh
                          )
                        );
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        outline: "none",
                        fontSize: `${item.fontSize}px`,
                        color: `${item.textColor}`,
                        resize: "none",
                        fontFamily: "Arial",
                        overflow: "hidden",
                        background: "transparent",
                      }}
                    />
                  )}
                  <div
                    className="absolute -top-[4px] right-0 cursor-pointer"
                    onClick={() => handleRemoveCauHinh(item.id)}
                  >
                    <CloseOutlined className="text-primary" />
                  </div>
                </Rnd>
              );
            })}
          </div>
        </Dropdown>
      </Modal>
      <Modal
        title="Thêm mới cấu hình"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalCauHinhOpen}
        onOk={handleAddCauHinhOk}
        width={"50%"}
        onCancel={() => {
          setIsModalCauHinhOpen(false);
          resetForm();
          setFileList([]);
        }}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            {cauHinhType == "TEXT" ? (
              <>
                <Col span={12}>
                  <Form.Item<KySoCauHinhType>
                    label="Kích thước font"
                    initialValue={8}
                    name="fontSize"
                  >
                    <Input type="number" min={1}></Input>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<KySoCauHinhType>
                    label="Màu chữ"
                    name="textColor"
                    getValueFromEvent={(color) => {
                      return "#" + color.toHex();
                    }}
                  >
                    <ColorPicker defaultValue={primaryColor} showText />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item<KySoCauHinhType>
                    name="content"
                    label="Nội dung"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập thông tin này!",
                      },
                    ]}
                  >
                    <Input.TextArea></Input.TextArea>
                  </Form.Item>
                </Col>
              </>
            ) : (
              <>
                {/* Danh sách chữ ký có sẵn */}
                {signatureList && signatureList.length > 0 && (
                  <Col span={24} style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                      Chọn chữ ký có sẵn:
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        maxHeight: 200,
                        overflowY: "auto",
                      }}
                    >
                      {signatureList.map((sig) => (
                        <div
                          key={sig.id}
                          style={{
                            position: "relative",
                            border:
                              selectedSignature === sig.id
                                ? "2px solid #CE1127"
                                : "1px solid #ccc",
                            borderRadius: 4,
                            cursor: "pointer",
                            padding: 4,
                            transition: "box-shadow 0.2s",
                          }}
                          className="signature-item"
                          onClick={() => {
                            setSelectedSignature(sig.id);
                            form.setFieldsValue({ imageFile: undefined });
                            setFileList([]);
                          }}
                        >
                          <img
                            src={`${StaticFileUrl}/${sig.duongDanFile}`}
                            alt="Chữ ký"
                            style={{
                              width: 120,
                              height: 60,
                              objectFit: "contain",
                            }}
                          />
                          <div
                            className="signature-delete-icon"
                            style={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              display: "none",
                              zIndex: 2,
                              background: "rgba(255,255,255,0.8)",
                              borderRadius: "50%",
                              padding: 2,
                              cursor: "pointer",
                            }}
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const res =
                                  await kySoCauHinhService.deleteChuKy(sig.id);
                                if (res?.status) {
                                  message.success("Xóa chữ ký thành công!");
                                  fetchSignatureList();
                                } else {
                                  message.error("Xóa chữ ký thất bại!");
                                }
                              } catch (err) {
                                message.error("Lỗi khi xóa chữ ký!");
                              }
                            }}
                          >
                            <DeleteOutlined
                              style={{ color: "#CE1127", fontSize: 16 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
                )}

                {/* Upload ảnh mới */}
                <Col span={24}>
                  <Form.Item<KySoCauHinhType>
                    name="imageFile"
                    label="Hoặc upload ảnh chữ ký mới"
                    valuePropName="file"
                    getValueFromEvent={(info) => {
                      return info.fileList[0]?.originFileObj || null;
                    }}
                    rules={
                      selectedSignature
                        ? []
                        : [
                            {
                              required: true,
                              message: "Vui lòng chọn chữ ký hoặc upload ảnh",
                            },
                            {
                              validator: (_, value) => {
                                if (value && !value.type.startsWith("image/")) {
                                  return Promise.reject(
                                    "Chỉ được tải lên file ảnh!"
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]
                    }
                  >
                    <Upload
                      beforeUpload={async (file) => {
                        // Gọi API saveChuKy với file upload
                        const formData = new FormData();
                        formData.append("File", file);
                        const response = await kySoCauHinhService.saveChuKy(
                          formData
                        );
                        if (response?.status && response.data?.id) {
                          message.success("Lưu chữ ký thành công!");
                          await fetchSignatureList();
                          setSelectedSignature(response.data.id);
                          setFileList([]); // Không hiển thị lại ảnh trong Upload
                        } else {
                          message.error("Lưu chữ ký thất bại!");
                        }
                        return false;
                      }}
                      listType="picture"
                      maxCount={1}
                      onChange={handleUploadChange}
                      accept="image/*"
                      // fileList={fileList}
                    >
                      <Button icon={<UploadOutlined />}>Upload ảnh</Button>
                    </Upload>
                  </Form.Item>
                </Col>

                {/* Vẽ chữ ký */}
                <Col span={24}>
                  <div style={{ marginBottom: 8 }}>
                    <Button
                      type="dashed"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setShowSignaturePad(!showSignaturePad);
                        if (!showSignaturePad) {
                          setSelectedSignature(null);
                          form.setFieldsValue({ imageFile: undefined });
                          setFileList([]);
                        }
                      }}
                    >
                      {showSignaturePad ? "Ẩn bảng vẽ" : "Vẽ chữ ký mới"}
                    </Button>
                  </div>

                  {showSignaturePad && (
                    <div
                      ref={signaturePadContainerRef}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        padding: 8,
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <div style={{ marginBottom: 8, fontWeight: "bold" }}>
                        Vẽ chữ ký của bạn:
                      </div>
                      <div
                        style={{
                          border: "1px solid #ddd",
                          backgroundColor: "white",
                        }}
                      >
                        <SignaturePad
                          ref={(ref: SignaturePad) => setSignaturePadRef(ref)}
                          canvasProps={{
                            width: signaturePadWidth,
                            height: 150,
                            className: "signature-canvas",
                            style: { width: "100%", height: "150px" },
                          }}
                        />
                      </div>
                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <Button
                          type="primary"
                          icon={<CheckCircleOutlined />}
                          onClick={handleSaveSignature}
                          size="small"
                        >
                          Lưu chữ ký
                        </Button>
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={handleClearSignature}
                          size="small"
                        >
                          Xóa
                        </Button>
                        <Button
                          onClick={() => setShowSignaturePad(false)}
                          size="small"
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  )}
                </Col>
              </>
            )}
          </Row>
          <Form.Item<KySoCauHinhType> name="type" label="Loại cấu hình" hidden>
            <Input></Input>
          </Form.Item>
          <Form.Item<KySoCauHinhType> name="posX" label="Tọa độ X" hidden>
            <Input></Input>
          </Form.Item>
          <Form.Item<KySoCauHinhType> name="posY" label="Tọa độ Y" hidden>
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Xác nhận ký số"
        open={isModalKySoOpen}
        onOk={async () => {
          setIsModalKySoOpen(false);
          handleKySoInfo();
        }}
        onCancel={() => setIsModalKySoOpen(false)}
      >
        {kySoInfo?.trangThai == "DAKYSO" ? (
          <p>
            File{" "}
            <span className="font-semibold">{getFileName(pdfKySoLink)}</span> đã
            được ký số. Bạn vẫn muốn ký?
          </p>
        ) : (
          <p>
            Xác nhận ký số file{" "}
            <span className="font-semibold">{getFileName(pdfKySoLink)}</span>?
          </p>
        )}
      </Modal>

      <Modal open={isModalUploadProgressOpen} footer={null} closable={false}>
        <div className="my-4">
          <Progress percent={uploadProgress} status="active" />
          <div className="text-center mt-2">
            {uploadProgress < 100 ? (
              <>
                Đang tiến hành ký số file{" "}
                <span className="font-semibold">
                  {getFileName(pdfKySoLink)}
                </span>
              </>
            ) : (
              <>
                <CheckCircleOutlined className="!text-green-500" /> Ký số file{" "}
                <span className="font-semibold">
                  {getFileName(pdfKySoLink)}
                </span>{" "}
                thành công.
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default KySoInfo;
