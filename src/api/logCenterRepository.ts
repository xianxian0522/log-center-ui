import request from "@/utils/request";
import { LabelsResponse, LogContextResponse, LoginResponse, LogSearchResponse, ValueResponse } from "@/utils/response";

const ApiLogin = '/api/v1/sso/login'
const API = '/api/log-center'
const ApiLog = `${API}/log`

export default {
  login: () => request.get<LoginResponse>(ApiLogin),

  queryLog: (params: any, query?: any) => request.post<LogSearchResponse>(`${ApiLog}/search`, params, query),
  queryLabelsValue: (labelName: string, params?: any) => request.get<ValueResponse>(`${ApiLog}/labels/values/${labelName}`, params),
  queryLabels: () => request.get<LabelsResponse>(`${ApiLog}/labels`),
  queryLogContext: (params: any, query?: any) => request.post<LogContextResponse>(`${ApiLog}/search/context`, params, query),
}
