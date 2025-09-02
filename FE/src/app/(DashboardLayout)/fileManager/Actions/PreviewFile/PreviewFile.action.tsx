import React, { useMemo, useState } from 'react';
import { getFileExtension } from '@/utils/fileManagerUtils/getFileExtension';
import { getDataSize } from '@/utils/fileManagerUtils/getDataSize';
import { useFileIcons } from '@/hooks/useFileIcons';
import { MdOutlineFileDownload } from 'react-icons/md';
import { FaRegFileAlt } from 'react-icons/fa';
import './PreviewFile.action.scss';
import Loader from '@/components/fileManager-components/Loader/Loader';
import { useSelection } from '@/contexts/SelectionContext';
import Button from '@/components/fileManager-components/Button/Button';
import { FileManagerType } from '@/types/fileManager/fileManager';
import formatDate from '@/utils/formatDate';

// Các extension hỗ trợ preview
const imageExtensions = ['jpg', 'jpeg', 'png'];
const videoExtensions = ['mp4', 'mov', 'avi'];
const audioExtensions = ['mp3', 'wav', 'm4a'];
const iFrameExtensions = ['txt', 'pdf'];

// Props cho component
interface PreviewFileActionProps {
  filePreviewPath?: string;
  filePreviewComponent?: (file: FileManagerType) => React.ReactNode;
}

const PreviewFileAction: React.FC<PreviewFileActionProps> = ({
  filePreviewPath = '',
  filePreviewComponent,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { selectedFiles } = useSelection();
  const fileIcons = useFileIcons(73);

  if (!selectedFiles || selectedFiles.length === 0) return null;
  const file = selectedFiles[0];
  // const customPreview = filePreviewComponent?.(file);
  const extension = getFileExtension(file.name)?.toLowerCase() || '';
  const filePath = `${filePreviewPath}${file.physicalPath}`;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const customPreview = useMemo(() => {
    return filePreviewComponent?.(file);
  }, [filePreviewComponent, file]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleDownload = () => {
    window.location.href = filePath;
  };

  if (React.isValidElement(customPreview)) {
    return <>{customPreview}</>;
  }

  return (
    <section
      style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}
      className={`file-previewer ${extension === 'pdf' ? 'pdf-previewer' : ''}`}
    >
      <div className='inforFile' >
        <h4>Loại văn bản: <strong>{file?.tenLoaiVanBan ?? "Chưa cập nhật"}</strong></h4>
        <h4>Số ký hiệu: <strong>{file?.soKyHieu ?? "Chưa cập nhật"}</strong></h4>
        <h4>Ngày ban hành: <strong>
          {file.ngayBanHanh ? formatDate(new Date(file.ngayBanHanh), true) : "Chưa cập nhật"}
        </strong></h4>
        <h4>Trích yếu: <strong>{file?.trichYeu ?? "Chưa cập nhật"}</strong></h4>

      </div>
      <div className='previewFile'>
        <h4><strong>{file?.name ?? "Chưa cập nhật"}</strong></h4>

        {(hasError ||
          ![
            ...imageExtensions,
            ...videoExtensions,
            ...audioExtensions,
            ...iFrameExtensions,
          ].includes(extension)) && (
            <div className="preview-error">
              <span className="error-icon">
                {fileIcons[extension as keyof typeof fileIcons] ?? (
                  <FaRegFileAlt size={73} />
                )}
              </span>
              <span className="error-msg">
                Xin lỗi! Tài liệu này không hỗ trợ xem trước
              </span>
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                {file.size !== undefined && (
                  <>
                    <span>-</span>
                    <span className="file-size">{getDataSize(file.size)}</span>
                  </>
                )}
              </div>
              <Button onClick={handleDownload} padding="0.45rem .9rem">
                <div className="download-btn">
                  <MdOutlineFileDownload size={18} />
                  <span>Tải xuống</span>
                </div>
              </Button>
            </div>
          )}

        {imageExtensions.includes(extension) && (
          <>
            <Loader loading={isLoading} />
            <img
              style={{ width: "100%" }}
              src={filePath}
              alt="Chưa có sẵn"
              className={`photo-popup-image ${isLoading ? 'img-loading' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </>
        )}

        {videoExtensions.includes(extension) && (
          <video style={{ height: "100%" }} src={filePath} className="video-preview" controls autoPlay />
        )}

        {audioExtensions.includes(extension) && (
          <audio style={{ height: "100%" }} src={filePath} controls autoPlay className="audio-preview" />
        )}

        {iFrameExtensions.includes(extension) && (
          <iframe
            style={{ height: "100%" }}
            src={filePath}
            onLoad={handleImageLoad}
            onError={handleImageError}
            frameBorder={0}
            className={`photo-popup-iframe ${isLoading ? 'img-loading' : ''}`}
          />
        )}
      </div>

    </section>
  );
};

export default PreviewFileAction;
