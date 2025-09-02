import { createConstant } from './Constant'
const LoaiDaiDienConstant = createConstant(
  {
    Organization: 'Tổ chức',
    Person: 'Cá nhân',
  },
  {
    'Tổ chức': { displayName: 'Tổ chức' },
    'Cá nhân': { displayName: 'Cá nhân' },
  }
)
export default LoaiDaiDienConstant
