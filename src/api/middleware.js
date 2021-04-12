import axios from './axios'
import store from '@/store'
import { typeCheck, deepMerge, deepCopy } from '@/utils/functions'

// 各类状态码对应的提示属性 - status0为成功, 非0即为失败, 500为服务器报错
const resStatusMap = [
    {
        // http传入: 失败状态码
        type: 'error', //  状态码类型
        msgType: 'error', // 提示信息类型
        validStatus: status => parseInt(status, 10) === 500, // status对应status格式
        msgMethod: '服务器连接失败，请检查网络后重试', // msg获取方法
        msgPosition: 'center' // 提示信息展示位置
    },
    {
        // 后端传入: 未登录状态码
        type: 'error',
        msgType: 'warning',
        validStatus: status => parseInt(status, 10) === 14,
        msgMethod: '登录信息无效，正在跳转到登录页',
        handleStatus: () => {
            // TODO 跳转登录
        },
        msgPosition: 'center'
    },
    {
        // 后端传入: 成功状态码
        type: 'success',
        msgType: 'success',
        validStatus: status => parseInt(status, 10) === 10000,
        msgMethod: response => response?.msg ?? '',
        msgPosition: 'right'
    },
    {
        // 其他： status不是数字/其他后端传入其他错误状态码
        type: 'error',
        msgType: 'error',
        validStatus: status =>
            isNaN(status) ||
            (parseInt(status, 10) !== 0 &&
                parseInt(status, 10) !== 14 &&
                parseInt(status, 10) !== 500),
        msgMethod: response => response?.msg ?? '未知错误, 错误码未能解析',
        msgPosition: 'center'
    }
]

// 格式化response对象
function handleFormatResponse({ status, response, prompts }) {
    const _statusObj = resStatusMap.find(map => map.validStatus(status))

    // 格式化response
    let _msg =
        typeCheck(_statusObj.msgMethod) === 'function'
            ? _statusObj.msgMethod(response)
            : String(_statusObj.msgMethod)
    const _data = response?.data
    const _meta = response?.meta
    const _type = _statusObj?.type
    const _msgType = _statusObj?.msgType
    const _msgPosition = _statusObj.msgPosition
    const _code = String(status).padStart(5, '0')

    // 格式化信息对象
    const _msgObj = getPromptObj({
        type: _type,
        msg: _msg,
        msgType: _msgType,
        msgPosition: _msgPosition,
        prompts
    })

    // 格式化后的response
    return {
        msg: _msgObj,
        data: _data,
        code: _code,
        type: _type,
        meta: _meta
    }
}

// response造成的global-提示处理返回值为String则不提示，否则根据返回值提示
function getPromptObj({ type, msg, msgType, msgPosition, prompts }) {
    const _prompt = prompts?.[type]

    // 获取提示文字
    const _title = (function() {
        // 强制不提示： 仅当_prompt='none'/后端传入msg='none'时
        if (String(_prompt) === 'none' || String(msg) === 'none') {
            return false
        }

        // 成功： 默认不提示，除非用户自定义提示成功信息才提示用户定义的信息
        if (type === 'success') {
            if (_prompt && String(_prompt)?.length) {
                return String(_prompt)
            } else {
                return false
            }
        }
        // 失败： 默认提示后端传入，除非用户自定义提示错误信息才修改为用户定义的信息
        if (type === 'error') {
            if (_prompt && String(_prompt)?.length) {
                return String(_prompt)
            } else {
                return String(msg)
            }
        }

        return false
    })()

    // 定义提示对象
    return _title
        ? { title: _title, type: msgType, position: msgPosition }
        : { title: msg, type: msgType, position: 'none' }
}

// response造成的global-callback处理
function runCallback({ response, callback }) {
    const { type, data, meta, code, msg } = response
    const _cb = callback?.[type]
    let _result = { data, meta, code, msg: msg.title }

    if (_cb?.length) {
        _cb.forEach(fns => {
            _result = fns(_result)
        })
    }

    return _result
}

// object的相同key的值合并为一个array,只遍历一级
function deepConcat(actionObj = {}, pageObj = {}) {
    const _pageKeys = Object.keys(pageObj)
    const _actionKeys = Object.keys(actionObj)
    const _keys = _pageKeys.concat(_actionKeys)

    const result = {}
    _keys.forEach(key => {
        result[key] = [actionObj?.[key], pageObj?.[key]].filter(v => typeCheck(v) !== 'undefined')
    })
    return result
}

// 格式化config data - 先merge再将value格式为object/array的转string
function formatRequestData(actionObj, pageObj) {
    const _result = {}

    // TODO 当前FormData仅支持页面传入
    if (typeCheck(pageObj) === 'formdata') {
        return pageObj
    }

    const _mergeObj = deepMerge(actionObj, pageObj)

    Object.keys(_mergeObj).forEach(key => {
        const _val = _mergeObj[key]

        switch (typeCheck(_val)) {
            case 'array':
                _result[key] = JSON.stringify(_val)
                break
            case 'object':
                _result[key] = JSON.stringify(_val)
                break
            default:
                _result[key] = _val
                break
        }
    })

    return _result
}

// 用于将传入的payload属性格式化 - method为格式化函数，接受两个参数（pageVal,actionVal），
const payloadFormatMap = [
    {
        originKey: 'params',
        finishKey: 'params',
        used: ['request'],
        method: deepMerge
    },
    {
        originKey: 'timeout',
        finishKey: 'timeout',
        used: ['request'],
        method: null
    },
    {
        originKey: 'headers',
        finishKey: 'headers',
        used: ['request'],
        method: deepMerge
    },
    {
        originKey: 'options',
        finishKey: 'data',
        used: ['request'],
        method: formatRequestData
    },
    {
        originKey: 'prompts',
        finishKey: 'prompts',
        used: ['response'],
        method: deepMerge
    },
    {
        originKey: 'url',
        finishKey: 'url',
        used: ['request'],
        method: null
    },
    {
        originKey: 'method',
        finishKey: 'method',
        used: ['request'],
        method: null
    },
    {
        originKey: 'callback',
        finishKey: 'callback',
        used: ['response'],
        method: deepConcat
    }
]

function payloadFormat(pagePayload, actionPayload, usedVal) {
    let _config = {}

    payloadFormatMap
        .filter(formatObj => formatObj.used.includes(usedVal))
        .forEach(formatObj => {
            let _originKey = formatObj.originKey
            let _finishKey = formatObj.finishKey
            const _pageVal = pagePayload?.[_originKey]
            const _actionVal = actionPayload?.[_originKey]

            switch (typeCheck(formatObj.method)) {
                case 'null':
                    // 格式化函数为null时 => pageVal > actionVal
                    _config[_finishKey] = _pageVal ?? _actionVal
                    break
                case 'function':
                    // 格式化函数为函数时 => 函数返回值
                    _config[_finishKey] = formatObj.method(_actionVal, _pageVal)
                    break

                default:
                    // 默认 => pageVal > actionVal
                    _config[_finishKey] = _pageVal ?? _actionVal
                    break
            }
        })

    return _config
}

// 结果处理
function handleResponse({ status, response }, { prompts, callback }) {
    const _response = handleFormatResponse({ status, response, prompts })

    // TODO 根据_response.msg值 执行全局提示函数

    return runCallback({ response: _response, callback })
}

// 发送请求
const runAxios = async (pagePayload, actionPayload) => {
    let _actionName = pagePayload?.name || actionPayload?.name || 'globalAction'
    let _requestConfig = payloadFormat(pagePayload, actionPayload, 'request')
    let _responseConfig = payloadFormat(pagePayload, actionPayload, 'response')

    // start loading
    store.commit('global/updateLoading', { type: _actionName, value: true }, { root: true })

    //   发送请求
    const _result = await axios(_requestConfig)

    // end loading
    store.commit('global/updateLoading', { type: _actionName, value: false }, { root: true })

    return handleResponse(_result, _responseConfig)
}
export { runAxios, handleResponse }
