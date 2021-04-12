import Vue from 'vue'
import functions from '@/utils/functions'
import constant from '@/utils/constant'
import api from '@/api'
import styleConstant from '@/styles/base/_constant.scss'

Vue.prototype.$fns = functions
Vue.prototype.$vars = constant
Vue.prototype.$api = api
Vue.prototype.$styles = styleConstant

// Vue.filter('mapLabelFilter', (val, list) => {
//     const cur = list.find(map => map.value === val)
//     return cur ? cur.label : '无'
// })
