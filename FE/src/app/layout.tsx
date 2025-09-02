"use client";
import React from "react";
import { Providers } from "@/store/providers";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { lightTheme } from "@/constants/ThemeConstant";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>{process.env.NEXT_PUBLIC_HEADER_TITLE}</title>
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
      </head>
      <body className="dir-ltr">
        <div className="App">
          <Providers>
            <ConfigProvider theme={lightTheme} locale={viVN}>
              {children}
            </ConfigProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
