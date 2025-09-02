//CreatedBy:TruongTD
const formatDate = (date: Date, dateOnly: boolean = false): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const pad = (num: number): string => num.toString().padStart(2, '0')

  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1)
  const year = date.getFullYear().toString()

  return dateOnly
    ? `${day}/${month}/${year}`
    : `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

export default formatDate
