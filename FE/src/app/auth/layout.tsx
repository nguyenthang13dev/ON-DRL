"use client";
import React from "react";
import styled from "@emotion/styled";
import "../(DashboardLayout)/layout.css";
import "@/app/assets/css/global.css";
import { ConfigProvider } from "antd";
import locale from "antd/locale/vi_VN";

const AuthContainer = styled.div(() => ({
    height: "100vh",
}));

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ConfigProvider
            locale={locale}
            theme={{
                token: {
                    colorPrimary: "#7c3aed",
                    fontFamily: `var(--font-inter), system-ui`,
                },
                components: {
                    Input: {
                        borderRadius: 4,
                    },
                    Select: {
                        borderRadius: 4,
                    },
                    DatePicker: {
                        borderRadius: 4,
                    },
                },
            }}
        >
            <AuthContainer>{children}</AuthContainer>
        </ConfigProvider>
    );
}
