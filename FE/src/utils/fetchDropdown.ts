import React from "react";

export const fetchDropdown = async (
  currentData: any[],
  apiService: () => Promise<any>,
  setState: React.Dispatch<React.SetStateAction<any[]>>
) => {
  if (currentData.length === 0) {
    try {
      const response = await apiService(); // Gọi API
      setState(response.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  }
};
