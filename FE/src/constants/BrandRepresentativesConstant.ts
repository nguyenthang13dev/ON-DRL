import { createConstant } from './Constant'
const BrandRepresentativesConstant = createConstant(
  {
    Organization: 'Organization',
    Person: 'Person',
  },
  {
    Organization: { displayName: 'Tổ chức' },
    Person: { displayName: 'Cá nhân' },
  }
)
export default BrandRepresentativesConstant
