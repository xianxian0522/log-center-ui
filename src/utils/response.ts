import { Moment } from "moment";

export interface LoginResponse {
  url?: string;
  token?: string;
}
export interface BarItem {
  id: number;
  icon?: string;
  path: string;
  name: string;
  route?: string;
  children?: BarItem[];
}
export interface QueryForm {
  searchContent?: string,
  limit?: string,
  startTime?: Moment,
  endTime?: Moment,
  lastPageStartTime?: string,
  nextPageStartTime?: string,
}
export interface ValueResponse {
  data: string[];
  status: string;
}
export interface LogCenterList {
  index: number;
  time: string;
  message: string;
  oldTime: string;
  isShow: boolean;
}
export interface LogResultResponse {
  stream: {
    filename: string;
    job: string;
  },
  values: [string, string][]
}
export interface LogSearchResponse {
  endTime: string;
  isBottom: boolean;
  isTop: boolean;
  lastPageStartTime: string;
  limit: string;
  lokiRes: LogCommonResponse;
  nextPageStartTime: string;
  shareUrl: string;
  startTime: string;
  total: number
}
export interface LogCommonResponse {
  data: {
    result: LogResultResponse[];
    resultType: string;
    stats: {
      ingester: {[key: string]: number};
      store: {[key: string]: number};
      summary: {[key: string]: number};
    }
  }
  status: string;
}
export interface LogContextResponse {
  backward: LogCommonResponse;
  forward: LogCommonResponse;
}
export interface LabelValue {
  label: string;
  value: string[];
}
export interface LabelsResponse {
  Labels: string[];
}
export interface InstanceResponse {
  ID: number;
  Name: string;
}
export interface GroupInfoItem {
  id: number;
  name: string;
}
export interface GroupInfoBiz {
  app: GroupInfoItem[];
  id: number;
  name: string;
}
export interface GroupInfo {
  answer: GroupInfoBiz[];
}
export interface MonitorInfoResponse {
  active: boolean;
  appId: number;
  id: number;
  logPath: string;
  appName: string;
  bizId: number;
  bizName: string;
  expression: string[];
  instanceId: number;
  instanceName: string;
  logParseType: string;
}
