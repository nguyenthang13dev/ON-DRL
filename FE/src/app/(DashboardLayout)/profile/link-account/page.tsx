"use client";
import React from "react";
import { Card } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { LinkAccountInterface } from "@/components/link-account";
import classes from "../page.module.css";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";

const LinkAccountPage: React.FC = () => {
  return (
    <>
      <div className="mb-2 flex-wrap justify-content-end flex items-center">
        <AutoBreadcrumb />
      </div>
      <Card
        className={classes.profileCard}
        bordered={false}
        headStyle={{
          backgroundColor: "#fff1f2",
          borderBottom: "2px solid #fda4af",
        }}
      >
        <div className={`${classes.sectionTitle} mb-3`}>
          <LinkOutlined className="text-rose-600 mr-2" />
          <span className="font-medium text-rose-700">Liên kết tài khoản</span>
        </div>

        {/* New Modern Interface */}
        <div className="bg-white rounded-lg">
          <LinkAccountInterface />
        </div>
      </Card>
    </>
  );
};

export default LinkAccountPage;
