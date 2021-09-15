import moment from "moment";
import { LogResultResponse } from "@/utils/response";
import * as _ from "lodash";

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

export function flattenLogResult(data: LogResultResponse[]) {
  const result = data.map((re: LogResultResponse) => re.values)
  const resultFlatten = _.flatten(result)
  return resultFlatten.map((r, index: number) => ({ index: index, time: moment(parseInt(r?.[0], 10) / 1000000).format('YYYY-MM-DD HH:mm:ss'),message: r?.[1], oldTime: r?.[0], isShow: false}))
}
