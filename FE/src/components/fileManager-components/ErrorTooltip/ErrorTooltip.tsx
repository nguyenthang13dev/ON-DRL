import React from "react";
import "./ErrorTooltip.scss";

type ErrorTooltipProps = {
  message: string;
  xPlacement?: "left" | "right" | "center";  // Các giá trị có thể có cho xPlacement
  yPlacement?: "top" | "bottom" | "center"; // Các giá trị có thể có cho yPlacement
};

const ErrorTooltip: React.FC<ErrorTooltipProps> = ({
  message,
  xPlacement = "center", // Gía trị mặc định là "center"
  yPlacement = "bottom", // Giá trị mặc định là "bottom"
}) => {
  return <p className={`error-tooltip ${xPlacement} ${yPlacement}`}>{message}</p>;
};

export default ErrorTooltip;
