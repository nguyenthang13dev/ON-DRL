/**
 * Tải xuống file từ chuỗi Base64
 * @param base64Data - Dữ liệu Base64
 * @param fileName - Tên file tải xuống
 * @param mimeType - Loại MIME của file (mặc định là Excel)
 */
export const downloadFileFromBase64 = (
    base64Data: string,
    fileName: string,
    mimeType: string = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
): void => {
    try {
        // Giải mã Base64 thành chuỗi nhị phân
        const binaryString = atob(base64Data);
        const byteNumbers = new Uint8Array(
            binaryString.split("").map((char) => char.charCodeAt(0)),
        );

        // Tạo Blob từ dữ liệu nhị phân
        const blob = new Blob([byteNumbers], { type: mimeType });

        // Tạo URL tạm thời và liên kết để tải file
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName; // Tên file tải xuống
        link.click();

        // Giải phóng URL sau khi tải
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error downloading file:", error);
    }
};

/**
 * Tải xuống file từ filePath
 * @param filePath - Dữ liệu Base64
 * @param fileName - Tên file tải xuống
 */
export const downLoadFileFromFilePath = async (
    filePath?: string,
    fileName?: string,
): Promise<void> => {
    try {
        if (
            fileName == null ||
            fileName == undefined ||
            filePath == null ||
            filePath == undefined
        ) {
            throw new Error("Không tồn tại file");
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL}${filePath}`,
        );
        if (!response.ok) {
            throw new Error("Tải file xuống thất bại");
        }
        // Lấy blob khi tải file thành công;
        const blob = await response.blob();
        const link = document.createElement("a");
        //gán href cho object url tạo từ blob
        link.href = URL.createObjectURL(blob);
        link.download = fileName; // tên file
        link.click();
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error downloading file:", error);
    }
};
