import moment from "moment";

export function timeValue(queryForm: any) {
  const query: any = { ...queryForm }
  if (queryForm.startTime) {
    query.startTime = moment(queryForm.startTime).valueOf()
  }
  if (queryForm.endTime) {
    query.endTime = moment(queryForm.endTime).valueOf()
  }
  return query
}
