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
export interface ValueResponse {
  data: string[];
  status: string;
}
export interface LogCenterList {
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
export interface LogCommonResopnse {
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
export interface LogSearchResponse {
  lokiRes: LogCommonResopnse;
  shareUrl: string
}
export interface LogContextResponse {
  backward: LogCommonResopnse;
  forward: LogCommonResopnse;
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
