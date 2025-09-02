//CreatedBy:TruongTD
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/vi'
dayjs.locale('vi')
const convertDayjsToISOString = (dayjsObject: Dayjs): string => {
  const date = dayjsObject.toDate()
  date.setHours(date.getHours() + 7)
  return date.toISOString()
}

export default convertDayjsToISOString
