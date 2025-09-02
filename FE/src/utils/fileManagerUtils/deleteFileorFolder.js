export const deleteFileAndChildren = (fileId, allFiles) => {
    // Tìm tất cả các file con
    const children = allFiles.filter(file => file.parentId === fileId);

    // Đệ quy xóa từng file con
    for (const child of children) {
        allFiles = deleteFileAndChildren(child.id, allFiles);
    }

    // Xóa chính nó
    return allFiles.filter(file => file.id !== fileId);
}
