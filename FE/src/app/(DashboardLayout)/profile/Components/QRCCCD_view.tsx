"use client";
import { Button, Image } from "antd";
import React from "react";
import styles from "./avatar.module.css";

const QRCCCD_view = ({
    src,
    style,
    onOpen,
}: {
    src?: string;
    style?: React.CSSProperties;
    onOpen: () => void;
}) => {
    return (
        <div className={styles.avatarContainer}>
            <div className={styles.avatarImage}>
                <Image
                    width={50}
                    height={50}
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
                Thay đổi QR CCCD
            </Button>
        </div>
    );
};
export default QRCCCD_view;
