import KeHoachTrienKhaiNoiBoContent from "./KeHoachTrienKhaiNoiBoContent";

interface DetailKeHoachTrienKhaiNoiBoProps {
    idDuAn: string | null;
    onClose?: () => void;
    onUpdate?: () => void;
}

const DetailKeHoachTrienKhaiNoiBo: React.FC<DetailKeHoachTrienKhaiNoiBoProps> = ({ idDuAn, onClose, onUpdate }) => {
    return (
        <div>
            <KeHoachTrienKhaiNoiBoContent idDuAn={idDuAn} onClose={onClose} onUpdate={onUpdate} />
        </div>
    )
}

export default DetailKeHoachTrienKhaiNoiBo; 