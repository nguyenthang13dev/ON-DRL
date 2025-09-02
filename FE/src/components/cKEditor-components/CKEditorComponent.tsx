'use client';
import { CKEditor } from 'ckeditor4-react'; // Import CKEditor 4 as named export
import { useEffect, useRef, useState } from 'react';

interface CKEditor4ComponentProps {
  initialData?: string;
  onChange?: (data: string) => void;
}

export default function CKEditor4Component({
  initialData,
  onChange,
}: CKEditor4ComponentProps) {
    // useRef để tham chiếu đến instance của CKEditor, giá trị sẽ không thay đổi giữa các lần render
  const editorRef = useRef<any>(null); // ref để truy cập instance CKEditor
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleInstanceReady = (evt: any) => {
    editorRef.current = evt.editor;
    setIsEditorReady(true);
    console.log("Initdata: ", initialData);
    if (initialData) {
      evt.editor.setData(initialData); // Cập nhật nội dung sau khi editor sẵn sàng
    }
  };

  const handleChange = (evt: any) => {
    const data = evt.editor.getData();
    onChange?.(data);
  };

  // Nếu muốn cập nhật lại nội dung khi initialData thay đổi
useEffect(() => {
  if (isEditorReady && editorRef.current && initialData) {
    editorRef.current.setData(initialData);
    console.log("Initdata2: ", initialData);
  }
}, [initialData, isEditorReady]);

  return (
    <CKEditor
      onInstanceReady={handleInstanceReady}
      onChange={handleChange}
      config={{
        toolbar: [
          ['Bold', 'Italic', 'Underline'],
          ['NumberedList', 'BulletedList'],
          ['Link', 'Unlink'],
          ['Image', 'Table'],
          ['Source'],
        ],
        height: 300,
      }}
    />
  );
}
