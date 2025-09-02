// components/SearchInput.tsx
import { useFileNavigation } from "@/contexts/FileNavigationContext";
import { useFiles } from "@/contexts/FilesContext";
import { FileManagerType } from "@/types/fileManager/fileManager";
import sortFiles from "@/utils/fileManagerUtils/sortFiles";
import { useState } from "react";
import { MdSearch } from "react-icons/md";


interface SearchInputProps {
    onSearch: (searchContent: string) => Promise<FileManagerType[]>
}

const SearchInput = (props: SearchInputProps) => {
    const [query, setQuery] = useState("");
    const { currentFolder, currentPathFiles, setCurrentPathFiles, currentPath } = useFileNavigation();
    const { files } = useFiles();
    return (
        <div className="search-input">
            <MdSearch size={18} />
            <input
                type="text"
                placeholder={`Tìm kiếm trong ${currentFolder?.name ?? "thư mục"}...`}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
                onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                        const fileRs = await props.onSearch(query);
                        setCurrentPathFiles(fileRs);
                    }
                }}
            />
        </div>
    );
};

export default SearchInput;
