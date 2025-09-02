"use client";
import { useEffect, useState } from "react";

export default function CKFinderComponent() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && !(window as any).CKFinder) {
            const script = document.createElement("script");
            script.src = "https://cdn.ckeditor.com/ckfinder/3.7.2/ckfinder.js";
            script.async = true;

            script.onload = () => {
                console.log("CKFinder đã tải xong!");
                if ((window as any).CKFinder) {
                    setLoaded(true);
                } else {
                    console.error("CKFinder không tải được hoặc bị lỗi!");
                }
            };

            script.onerror = () => {
                console.error("Lỗi khi tải CKFinder. Thử tải lại sau...");
                setTimeout(() => {
                    setLoaded(false);
                }, 3000); // Thử tải lại sau 3 giây
            };

            document.body.appendChild(script);
        } else {
            setLoaded(true);
        }
    }, []);

    const openCKFinder = () => {
        if (
            loaded &&
            typeof window !== "undefined" &&
            (window as any).CKFinder
        ) {
            (window as any).CKFinder.popup({
                chooseFiles: true,
                uploadUrl: "http://localhost:8083/api/v1/attachment/uploads",
                onInit: function (finder: any) {
                    finder.on("files:choose", function (evt: any) {
                        const file = evt.data.files.first();
                        console.log("File URL:", file.getUrl());
                    });
                },
            });
        } else {
            console.error("CKFinder chưa tải xong hoặc bị lỗi!");
        }
    };

    return <button onClick={openCKFinder}>Mở CKFinder</button>;
}
