/**
 * 检查指定对象的数据类型
 * @param {*} target 需要检查的对象
 * @returns 小写的数据类型
 */
export function typeCheck(target) {
    return Object.prototype.toString
        .call(target)
        .slice(8, -1)
        .toLowerCase()
}

/**
 * 检查是否包含指定属性
 * @param {*} target 需要检查的对象
 * @param {String} key  检查的属性名
 * @returns {Boolean}
 */
export function hasProp(target, key) {
    return typeCheck(target) === 'object' && Object.prototype.hasOwnProperty.call(target, key)
}

/**
 * 首字母大写，其他字母全部小写
 * @param {String} 需要格式化的字符串
 * @returns 格式化后的str
 */
export function firstUpperCase(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

/**
 * 深拷贝
 * @module function
 * @desc  对象 数据深拷贝
 * @param  {Array/object} - 原数据
 * @return   {Array/object} - 拷贝后的新数据
 */
export function deepCopy(val) {
    const copyVal = obj => {
        // 若为null则跳出递归，若无这行，null会复制为{}
        if (obj === null) {
            return null
        }

        if (obj instanceof Date || obj instanceof String || obj instanceof Number) {
            return obj
        }

        let result = Array.isArray(obj) ? [] : {}

        for (let key in obj) {
            if (hasProp(obj, key)) {
                if (typeof obj[key] === 'object') {
                    // 递归复制
                    result[key] = copyVal(obj[key])
                } else {
                    result[key] = obj[key]
                }
            } else {
                result = obj
            }
        }
        return result
    }

    return copyVal(val)
}

/**
 * 两个对象深度合并
 * @module function
 * @desc  非重复属性都保留,重复属性用后一个对象覆盖前一个对象已存在的属性/子属性
 * @param  {object} - 对象一
 * @param  {object} - 对象二,权重大于一
 * @return   {object} - 新数据
 */

export function deepMerge(obj1, obj2) {
    const result = {}

    for (const key in obj2) {
        if (typeCheck(obj2[key]) === 'object' || typeCheck(obj2[key]) === 'array') {
            result[key] = deepCopy(obj2[key])
        } else {
            result[key] = obj2[key]
        }
    }

    for (const key in obj1) {
        if (Object.keys(obj2).includes(key)) {
            if (typeCheck(obj1[key]) === 'object' || typeCheck(obj1[key]) === 'array') {
                result[key] = deepMerge(obj1[key], obj2[key])
            }
        } else {
            if (typeCheck(obj1[key]) === 'object' || typeCheck(obj1[key]) === 'array') {
                result[key] = deepCopy(obj1[key])
            } else {
                result[key] = obj1[key]
            }
        }
    }

    return result
}

/**
 * 格式化时间
 * @param {string} 时间字符串
 * @param {string} 分隔符 判定为FALSE时默认传出toLocaleString
 * @param {string} 时间解析失败传出的字符串
 */
export function formatDate(str, separator = undefined, out_str = '-') {
    if (!str) {
        return out_str
    } else {
        let date = new Date(str)
        if (!separator) {
            return date.toLocaleString('zh', { hour12: false })
        } else {
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let hour = date.getHours()
            let minute = String.prototype.padStart.call(date.getMinutes(), 2, '0')
            let second = String.prototype.padStart.call(date.getSeconds(), 2, '0')

            return (
                year +
                separator +
                month +
                separator +
                day +
                ' ' +
                hour +
                ':' +
                minute +
                ':' +
                second
            )
        }
    }
}

/**
 * 根据当前时间比较转换为统一的时间差格式
 * @module function
 * @desc 转换为转化为几分钟前，几秒钟前 yyyy-MM-dd HH:mm:ss
 * @param  {String} - 需要转换的数据
 * @return  {String}  - 时间格式
 */
export function formatterDateBefore(str, nullStr = '-') {
    if (!str) {
        return nullStr
    }

    const dateTimeStamp = new Date(str)

    var minute = 1000 * 60 //把分，时，天，周，半个月，一个月用毫秒表示
    var hour = minute * 60
    var day = hour * 24
    var week = day * 7
    var month = day * 30
    var year = day * 365
    var now = new Date().getTime() //获取当前时间毫秒
    var diffValue = now - dateTimeStamp //时间差

    if (diffValue < 0) {
        return
    }
    var minC = diffValue / minute //计算时间差的分，时，天，周，月
    var hourC = diffValue / hour
    var dayC = diffValue / day
    var weekC = diffValue / week
    var monthC = diffValue / month
    var yearC = diffValue / year
    var result
    if (yearC >= 1) {
        result = ' ' + parseInt(yearC) + '年前'
    } else if (monthC >= 1 && monthC <= 12) {
        result = ' ' + parseInt(monthC) + '月前'
    } else if (weekC >= 1 && weekC <= 4) {
        result = ' ' + parseInt(weekC) + '周前'
    } else if (dayC >= 1 && dayC <= 7) {
        result = ' ' + parseInt(dayC) + '天前'
    } else if (hourC >= 1 && hourC <= 24) {
        result = ' ' + parseInt(hourC) + '小时前'
    } else if (minC >= 1 && minC <= 60) {
        result = ' ' + parseInt(minC) + '分钟前'
    } else if (diffValue >= 0 && diffValue <= minute) {
        result = '刚刚'
    } else {
        var datetime = new Date()
        datetime.setTime(dateTimeStamp)
        var Nyear = datetime.getFullYear()
        var Nmonth =
            datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
        var Ndate = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
        result = Nyear + '-' + Nmonth + '-' + Ndate
    }
    return result
}

/**
 * 深度查找
 * @module function
 * @desc  在对象/数组中查询某个属性=某个值的 输出属性的值
 * @param  {String} - 目标属性名称
 * @param  {String} - 目标属性值
 * @param   {Array/Object} - 源数据
 * @param   {String} - 输出属性名称
 * @param   {String} - 子数据对应属性名称
 * @return   {Any} - 目标数据的输出属性值
 */
export function deepFind(in_key, in_val, target, out_key, sub_key = 'children') {
    // 即将返回的值
    let result
    ;(function deep(list) {
        if (!in_key || !list) return undefined
        if (typeCheck(list) !== 'array') return undefined

        list.forEach(item => {
            if (item[in_key] === in_val) {
                result = item[out_key]
            } else {
                deep(item[sub_key])
            }
        })
    })(target)

    return result
}

/**
 * request body format
 * @module function
 * @desc  给后端的参数若为数组或对象则 JSON.stringify，function不传输，string int直接传输，req_attachments列表传输
 * @param  {obj} - 原对象
 * @return   {String} - 序列化后的字符串
 */
export function reqBodyFormat(obj) {
    let body = new FormData()

    Object.keys(obj).forEach(key => {
        const val = obj[key]

        if (typeCheck(val) === 'object') {
            body.append(key, JSON.stringify(val))
        } else if (typeCheck(val) === 'array') {
            // 特殊处理  req_attachments
            if (key === 'req_attachments' || key === 'attachments' || key === 'file') {
                val.forEach(v => {
                    body.append(key, v.raw)
                })
            } else {
                body.append(key, JSON.stringify(val))
            }
        } else if (typeCheck(val) !== 'function') {
            body.append(key, val)
        }
    })

    return body
}

/**
 * mac 地址验证
 * @module function
 * @param  {String} - 需要判断的字符串
 */
export function checkMac(rule, value, cb) {
    let pattern = /^[a-fA-F0-9]{2}(-[a-fA-F0-9]{2}){5}$|^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$/

    if (pattern.test(value)) {
        return cb()
    } else {
        return cb(new Error('不是正确的Mac地址'))
    }
}

/**
 * ip 地址验证
 * @module function
 * @param  {String} - 需要判断的字符串
 */
export function checkIp(rule, value, cb) {
    let pattern = /^[0-9]{1,3}(\.[0-9]{1,3}){3}$/

    if (pattern.test(value)) {
        return cb()
    } else {
        return cb(new Error('不是正确的Ip地址'))
    }
}

/**
 * 密码 地址验证
 * @module function
 * @param  {String} - 需要判断的字符串
 */
export function checkPwd(rule, value, cb) {
    let pattern = /^(?![a-zA-z]+$)(?!\d+$)(?![.,!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z.,!@#$%^&*]+$)(?![\d.,!@#$%^&*]+$)[a-zA-Z\d.,!@#$%^&*]+$/

    if (value.length < 8) {
        return cb(new Error('密码至少8位数'))
    } else if (pattern.test(value)) {
        return cb()
    } else {
        return cb(new Error('新密码必须包含字母+数字+特殊字符'))
    }
}

export default {
    reqBodyFormat,
    deepCopy,
    deepMerge,
    formatDate,
    formatterDateBefore,
    typeCheck,
    firstUpperCase,
    deepFind,
    hasProp,
    checkMac,
    checkIp,
    checkPwd
}
