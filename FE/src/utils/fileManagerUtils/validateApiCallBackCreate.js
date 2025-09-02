// version 2
export const validateApiCallBackCreate = (callback, callbackName, newFolderName, currentFolder) => {
    try {
        if (typeof callback === "function" && callbackName == "onCreateFolder") {
            const newFolder = { name: newFolderName, parentId: currentFolder?.id, isDirectory: true }
            callback(newFolder);
        } else {
            throw new Error(
                `<FileManager /> Missing prop: Callback function "${callbackName}" is required.`
            );
        }
    } catch (error) {
        console.error(error.message);
    }
};
