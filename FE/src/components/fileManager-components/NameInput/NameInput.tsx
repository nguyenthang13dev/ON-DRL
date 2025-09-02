import React, { ChangeEvent, KeyboardEvent, MouseEvent, RefObject } from "react";
import "./NameInput.scss";

type NameInputProps = {
  nameInputRef: RefObject<HTMLTextAreaElement>;
  maxLength?: number;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onClick?: (e: MouseEvent<HTMLTextAreaElement>) => void;
  rows?: number;
};

const NameInput: React.FC<NameInputProps> = ({
  nameInputRef,
  maxLength,
  value,
  onChange,
  onKeyDown,
  onClick,
  rows,
}) => {
  return (
    <textarea
      ref={nameInputRef}
      className="rename-file"
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onClick={onClick}
      rows={rows}
    />
  );
};

export default NameInput;
