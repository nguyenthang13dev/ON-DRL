import { createConstant } from './Constant'
const DepartmentConstant = createConstant(
  {
    Organization: 'Organization',
    Department: 'Department',
  },
  {
    Organization: { displayName: 'Tổ chức' },
    Department: { displayName: 'Phòng ban' },
  }
)
export default DepartmentConstant
