import React, { useRef, useEffect, useState } from "react";

type Props = {
  initialName?: string;
  penColor?: string;
  penWidth?: number;
  onSave?: (blob: Blob, name: string) => void;
};

export default function SignaturePad({
  initialName = "",
  penColor = "#000",
  penWidth = 2,
  onSave,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [name, setName] = useState(initialName);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctxRef.current = ctx;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      ctx.scale(ratio, ratio);
      // preserve existing drawing if needed (left simple: clear on resize)
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [penColor, penWidth]);

  const getPos = (e: PointerEvent | Touch | MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let clientX = 0,
      clientY = 0;
    if ("touches" in e) {
      if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else if ("clientX" in e) {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    } else {
      // fallback
      clientX = 0;
      clientY = 0;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // use pointer events for unified handling
  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = ctxRef.current!;
    const pointerDown = (ev: PointerEvent) => {
      drawingRef.current = true;
      (ev.target as Element).setPointerCapture(ev.pointerId);
      lastPointRef.current = { x: ev.offsetX, y: ev.offsetY };
      ctx.beginPath();
      ctx.moveTo(ev.offsetX, ev.offsetY);
    };
    const pointerMove = (ev: PointerEvent) => {
      if (!drawingRef.current) return;
      const lp = lastPointRef.current;
      if (!lp) {
        ctx.moveTo(ev.offsetX, ev.offsetY);
        lastPointRef.current = { x: ev.offsetX, y: ev.offsetY };
        return;
      }
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.lineTo(ev.offsetX, ev.offsetY);
      ctx.stroke();
      lastPointRef.current = { x: ev.offsetX, y: ev.offsetY };
    };
    const pointerUp = (ev: PointerEvent) => {
      drawingRef.current = false;
      lastPointRef.current = null;
      try {
        (ev.target as Element).releasePointerCapture(ev.pointerId);
      } catch {}
    };

    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
    };
  }, [penColor, penWidth]);

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const isEmpty = () => {
    const canvas = canvasRef.current!;
    const blank = document.createElement("canvas");
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
  };

  const save = async () => {
    const canvas = canvasRef.current!;
    if (isEmpty()) {
      alert("Chưa có chữ ký để lưu.");
      return;
    }
    // convert to blob (png)
    canvas.toBlob((blob) => {
      if (!blob) return;
      const filename = (name || "signature").trim() + ".png";
      // trigger download in browser
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      // callback for upload
      if (onSave) onSave(blob, filename);
    }, "image/png");
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ border: "1px solid #ccc", borderRadius: 4, padding: 8 }}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ marginRight: 8 }}>Tên:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên để lưu cùng chữ ký"
          />
        </div>
        <div
          style={{
            width: "100%",
            height: 200,
            border: "1px dashed #999",
            marginBottom: 8,
            touchAction: "none",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={clear}>
            Xóa
          </button>
          <button type="button" onClick={save}>
            Lưu (tải về)
          </button>
        </div>
      </div>
    </div>
  );
}
