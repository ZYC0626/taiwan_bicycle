export function formatDate (time) {
  const d = new Date(time)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = '' + d.getFullYear()
  const hr = d.getHours()
  let min = d.getMinutes()
  const sec = d.getSeconds()
  if (min < 10) {
    min = '0' + min
  }
  if (month.length < 2) {
    month = '0' + month
  }
  if (day.length < 2) {
    day = '0' + day
  }
  // return [year, month, day].join('/')
  return `${year}-${month}-${day} ${hr}:${min}:${sec}`
}

export function middleArray (arr) {
  return arr[Math.round((arr.length - 1) / 2)]
}
