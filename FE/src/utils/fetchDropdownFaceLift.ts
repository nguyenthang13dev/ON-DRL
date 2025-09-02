export const fetchDropdownFaceLift = async (
    currentData: any[],
    apiService: () => Promise<any>,
    setState: React.Dispatch<React.SetStateAction<any[]>>
) => {
    if (currentData.length === 0) {
        try {
            const response = await apiService(); 
            setState(response.data);
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
        }
    }
};
