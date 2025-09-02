import React from "react";
import { ImSpinner2 } from "react-icons/im";
import "./Loader.scss";

type LoaderProps = {
  loading?: boolean;  // Biến này là optional và mặc định là false
  className?: string;  // Biến này là optional để nhận thêm className cho phần tử
};

const Loader: React.FC<LoaderProps> = ({ loading = false, className = "" }) => {
  if (!loading) return null;

  return (
    <div className={`loader-container ${className}`}>
      <ImSpinner2 className="spinner" />
    </div>
  );
};

export default Loader;
