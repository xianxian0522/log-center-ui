import axios from "axios";
import router from "@/router";
import { message } from "ant-design-vue";

const service = axios.create({
  baseURL: '/',
  timeout: 1000000,
})
service.defaults.headers.post['Content-Type'] = 'application/json'

service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  } else {
    router.push('/login').then()
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    router.push('/login').then()
  }
  message.error(error.response?.data)
  return Promise.reject(error)
})

export default {
  get<T>(url: string, params = {}) {
    return new Promise<T>((resolve, reject) => {
      service.get(url, {params})
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  post<T>(url: string, params = {}) {
    return new Promise<T>((resolve, reject) => {
      service.post(url, params)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  put<T>(url: string, params = {}) {
    return new Promise<T>((resolve, reject) => {
      service.put(url, params)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  patch<T>(url: string, params = {}) {
    return new Promise<T>((resolve, reject) => {
      service.patch(url, params)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
}
