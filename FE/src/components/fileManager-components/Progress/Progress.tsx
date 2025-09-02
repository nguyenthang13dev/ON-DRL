import React from "react";
import "./Progress.scss";

type ProgressProps = {
  percent?: number;
  isCanceled?: boolean;
  isCompleted?: boolean;
  error?: string | boolean | null;
};

const Progress: React.FC<ProgressProps> = ({
  percent = 0,
  isCanceled = false,
  isCompleted = false,
  error,
}) => {
  return (
    <div role="progressbar" className="fm-progress">
      {!error && (
        <div className="fm-progress-bar">
          <div className="fm-progress-bar-fill" style={{ width: `${percent}%` }}></div>
        </div>
      )}
      {isCanceled ? (
        <span className="fm-upload-canceled">Canceled</span>
      ) : error ? (
        <span className="fm-upload-canceled">{error}</span>
      ) : (
        <div className="fm-progress-status">
          <span>{isCompleted ? "Tải lên hoàn tất" : percent + "% done"}</span>
        </div>
      )}
    </div>
  );
};

export default Progress;
