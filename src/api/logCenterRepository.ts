import request from "@/utils/request";
import { LoginResponse } from "@/utils/response";

const ApiLogin = '/api/v1/sso/login'
const ApiLog = '/api/log-center'

let ApiBar = '/api/my/bar';
if (window.location.hostname.endsWith('dev.ops.sumscope.com')) {
  ApiBar = 'http://menu.dev.ops.sumscope.com:3000' + ApiBar;
} else if (window.location.hostname.endsWith('ops.sumscope.com')) {
  ApiBar = 'http://menu.ops.sumscope.com' + ApiBar;
}

export default {
  login: () => request.get<LoginResponse>(ApiLogin),
}
