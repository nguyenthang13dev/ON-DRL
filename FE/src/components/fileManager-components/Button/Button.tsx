import "./Button.scss";
import React, { ReactNode, MouseEventHandler, KeyboardEventHandler } from "react";

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  type?: "primary" | "secondary" | "danger" | string;
  padding?: string;
  children: ReactNode;
  disable?: boolean;
  isSubmit?: boolean;
};

const Button = ({
  onClick,
  onKeyDown,
  type = "primary",
  padding = "0.4rem 0.8rem",
  children,
  isSubmit,
}: ButtonProps) => {
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`fm-button fm-button-${type}`}
      style={{ padding }}
    >
      {children}
    </button>
  );
};

export default Button;