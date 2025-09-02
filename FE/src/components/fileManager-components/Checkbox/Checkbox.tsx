import React from "react";
import "./Checkbox.scss";

type CheckboxProps = {
  name?: string;
  id?: string;
  checked?: boolean;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  title?: string;
  disabled?: boolean;
};

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  id,
  checked,
  onClick,
  onChange,
  className = "",
  title,
  disabled = false,
}) => {
  return (
    <input
      className={`fm-checkbox ${className}`}
      type="checkbox"
      name={name}
      id={id}
      checked={checked}
      onClick={onClick}
      onChange={onChange}
      title={title}
      disabled={disabled}
    />
  );
};

export default Checkbox;
