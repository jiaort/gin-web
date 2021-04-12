import axios from 'axios'
import { browser } from '@/utils/constant'

export const contentType = {
    json: 'application/json;charset=UTF-8', // default
    form: 'multipart/form-data;'
}

export const httpMethod = {
    get: 'get', // default
    post: 'post',
    patch: 'patch',
    delete: 'delete'
}

export const baseUrl = {
    detection: process.env.VUE_APP_BASEURL + '/detection', // default
    base: process.env.VUE_APP_BASEURL + '/base',
    user: process.env.VUE_APP_BASEURL + '/user',
    uploads: process.env.VUE_APP_BASEURL.slice(0, -7) + '/'
}

export const timeout = 60000

// 创建一个axios实例
const instance = axios.create({
    baseURL: baseUrl.detection,
    timeout: timeout,
    headers: {
        post: {
            'Content-Type': contentType.json
        }
    }
})

// http request 拦截
instance.interceptors.request.use(
    config => {
        // timeout - 超时处理(单元ms): 带有 timeout 参数的接口，不设置该属性, 否则使用默认超时 10秒
        config.timeout = parseInt(config?.timeout ?? timeout, 10)

        // timestamp - 时间戳配置: 若为 ie浏览器且为 get请求,添加  timestamp (防止缓存造成的get请求response不赋值, 保证相邻get请求唯一),否则不添加timestamp
        if (config.method === httpMethod.get && browser.includes('ie')) {
            config.params = Object.assign({}, config?.params ?? {}, {
                timestamp: new Date().getTime()
            })
        }

        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// http response 拦截器
instance.interceptors.response.use(
    response => {
        // 只要成功和服务器端交互连通(无论交互结果成功和失败),此时后端均返回200,开启response format
        if (response.status === 200) {
            const _status = response.data?.code ?? 0
            delete response.data.code

            return { status: _status, response: response.data }
        }

        // 只要http状态码不是200,就认为跟服务器的交互失败
        return { status: 500 }
    },
    error => {
        return { status: 500 }
    }
)

export default instance
