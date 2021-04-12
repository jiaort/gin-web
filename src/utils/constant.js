// copyright
export const copyright = 'Copyright © 2019-2020  神州网信技术有限公司 版权所有'

export const imgSrc = {
    hideIcon: require('@/assets/images/ZoomRight.png'),
    showIcon: require('@/assets/images/ZoomLeft.png'),
    errorBg: require('@/assets/images/ErrorBg.png'),
    logo: require('@/assets/images/logo.png'),
    avatar: require('@/assets/images/avatar.jpg')
}

export const menuList = [
    {
        icon: 'el-icon-s-tools',
        title: '工具',
        children: [
            {
                icon: 'el-icon-location',
                title: '目标检测',
                route: { name: 'HomeToolsImage' }
            },
            {
                icon: 'el-icon-star-on',
                title: '模型训练',
                route: { name: 'HomeToolsTrain' }
            }
        ]
    }
]

// 获取当前浏览器类型
export const browser = (function() {
    let _userAgent = navigator.userAgent // 取得浏览器的_userAgent字符串
    let _isOpera = _userAgent.indexOf('Opera') > -1 // 判断是否Opera浏览器
    let _isIE =
        _userAgent.indexOf('compatible') > -1 && _userAgent.indexOf('MSIE') > -1 && !_isOpera // 判断是否IE浏览器
    let _isEdge = _userAgent.indexOf('Edge') > -1 // 判断是否IE的Edge浏览器
    let _isFF = _userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器
    let _isSafari = _userAgent.indexOf('Safari') > -1 && _userAgent.indexOf('Chrome') === -1 // 判断是否Safari浏览器
    let _isChrome = _userAgent.indexOf('Chrome') > -1 && _userAgent.indexOf('Safari') > -1 // 判断Chrome浏览器

    // 获取方法
    const browserName = () => {
        if (_isIE) {
            let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
            reIE.test(_userAgent)
            let _fIEVersion = parseFloat(RegExp['$1'])
            if (_fIEVersion === 7) {
                return 'IE7'
            } else if (_fIEVersion === 8) {
                return 'IE8'
            } else if (_fIEVersion === 9) {
                return 'IE9'
            } else if (_fIEVersion === 10) {
                return 'IE10'
            } else if (_fIEVersion === 11) {
                return 'IE11'
            } else {
                // IE版本过低
                return 'IE6'
            }
        }
        if (_isOpera) {
            return 'Opera'
        }
        if (_isEdge) {
            return 'Edge'
        }
        if (_isFF) {
            return 'FF'
        }
        if (_isSafari) {
            return 'Safari'
        }
        if (_isChrome) {
            return 'Chrome'
        }
        // 无法检测都是IE
        return 'IE'
    }

    return browserName().toLowerCase()
})()

export default {
    imgSrc,
    copyright,
    browser,
    menuList
}
