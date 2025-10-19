"use client";
import React from "react";
import { Button, Image } from "antd";
import styles from "./avatar.module.css";

const Avatar = ({
  src,
  style,
  onClose,
  onSuccess,
  onOpen,
}: {
  src?: string;
  style?: React.CSSProperties;
  onClose: () => void;
  onSuccess: () => void;
  onOpen: () => void;
}) => {
  return (
    <div className={styles.avatarContainer}>
      <div className={styles.avatarImage}>
        <Image
          width={200}
          height={200}
          src={src}
          style={style}
          fallback="/img/default-image.jpg"
        />
      </div>
      <Button
        size="small"
        className={`primary ${styles.changeButton}`}
        color="cyan"
        variant="solid"
        onClick={onOpen}
      >
        Thay đổi ảnh đại diện
      </Button>
    </div>
  );
};
export default Avatar;
