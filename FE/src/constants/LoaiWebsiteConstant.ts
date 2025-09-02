import { createConstant } from './Constant'
const LoaiWebsiteConstant = createConstant(
  {
    "0" : 'Website TMĐT bán hàng',
    "1": 'Website CCDV TMĐT',
  },
  {
    "0" : {
      displayName: 'Website TMĐT bán hàng',
    },
    "1": { displayName: 'Website CCDV TMĐT' },
  }
)
export default LoaiWebsiteConstant
