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
}
export interface LogResultResponse {
  stream: {
    filename: string;
    job: string;
  },
  values: [string, string][]
}
export interface LogSearchResponse {
  lokiRes: {
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
  shareUrl: string
}
export interface LabelValue {
  label: string;
  value: string[];
}
export interface LabelsResponse {
  Labels: string[];
}
