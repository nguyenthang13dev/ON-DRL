import React, { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho LayoutContext
type Layout = "list" | "grid";

// Định nghĩa kiểu dữ liệu cho LayoutContext
interface LayoutContextType {
  activeLayout: string;
  setActiveLayout: React.Dispatch<React.SetStateAction<string>>;
}

// Tạo context với kiểu dữ liệu đã định nghĩa
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
  layout: Layout;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children, layout }) => {
  const [activeLayout, setActiveLayout] = useState<string>(() => validateLayout(layout));

  function validateLayout(layout: Layout): Layout {
    const acceptedValue: Layout[] = ["list", "grid"];
    return acceptedValue.includes(layout) ? layout : "grid";
  }

  return (
    <LayoutContext.Provider value={{ activeLayout, setActiveLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng context
export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
