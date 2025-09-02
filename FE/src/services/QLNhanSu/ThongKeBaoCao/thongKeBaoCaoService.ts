import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import { BaoCaoTHongKeNS } from "@/types/QLNhanSu/thongKeBaoCao/thongKeBaoCao";
class ThongKeBaoCao {
  private static _instance: ThongKeBaoCao;
  public static get instance(): ThongKeBaoCao {
    if (!ThongKeBaoCao._instance) {
      ThongKeBaoCao._instance = new ThongKeBaoCao();
    }
    return ThongKeBaoCao._instance;
  }

  public async ThongKeNhanSu(
    search?: string | null
  ): Promise<Response<BaoCaoTHongKeNS[]>> {
    const response = await apiService.get<Response<BaoCaoTHongKeNS[]>>(
      `/NS_NhanSu/ThongKeNS?search=${search ?? ""}`
    );
    return response.data;
  }
}
const thongKeBaoCaoService = ThongKeBaoCao.instance;
export default thongKeBaoCaoService;
