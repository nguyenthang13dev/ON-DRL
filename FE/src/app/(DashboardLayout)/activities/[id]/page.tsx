"use client";
import React from "react";
import { useEffect, useState } from "react";
import activitiesService from "@/services/activities/activitiesService";
import { Spin } from "antd";
import dayjs from "dayjs";
import { Drawer, Divider } from "antd";
import { ActivitiesType } from "@/types/activities/activities";
import * as extensions from "@/utils/extensions";
import { useParams } from "next/navigation";
import Image from "next/image";

const ActivitiesDetail = () => {
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<ActivitiesType | null>(null);
  const params = useParams();
  const id = params?.id.toString() ?? "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await activitiesService.get(id);
        if (res.status) {
          setActivity(res.data);
        }
      } catch (err) {
        setActivity(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Spin className="block mx-auto my-12" />;
  if (!activity)
    return <div className="text-center my-12">Không tìm thấy hoạt động</div>;

  return (
    <div className="container mx-auto bg-white rounded shadow p-6 mt-8">
      <h1 className="text-2xl font-bold mb-2 text-primary">{activity.name}</h1>
      <div className="text-gray-500 mb-4">
        {activity.startDate && (
          <span>
            Thời gian: {dayjs(activity.startDate).format("DD/MM/YYYY HH:mm")}
          </span>
        )}
      </div>
      <div
        className="prose prose-lg mb-6"
        dangerouslySetInnerHTML={{ __html: activity.description || "" }}
      />
      {activity.qRPath && (
        <div className="flex items-center gap-2 mt-4">
          <span className="font-semibold">QR tham gia:</span>
          <Image
            src={activity.qRPath}
            alt="QR"
            width={96}
            height={96}
            className="h-24 w-24 object-contain border rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ActivitiesDetail;
