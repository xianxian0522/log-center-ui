import request from "@/utils/request";
import { LoginResponse, ValueResponse } from "@/utils/response";

const ApiLogin = '/api/v1/sso/login'
const API = '/api/log-center'
const ApiLog = `${API}/log`

export default {
  login: () => request.get<LoginResponse>(ApiLogin),

  queryLog: (params: any, query?: any) => request.post(`${ApiLog}/search`, params, query),
  queryLabelsValue: (labelName: string) => request.get<ValueResponse>(`${ApiLog}/labels/values/${labelName}`),
}
