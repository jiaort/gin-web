import routeArray from '@/utils/routes'
import imports from '@/utils/imports'
import { deepCopy } from '@/utils/functions'

const importRoutes = imports(require.context('@/views', true, /\.vue$/))

/**
 * 递归添加component属性
 * @module event
 * @desc  完成route对象format
 * @param  {Array} - constant路由数组
 * @return  {Array}  - format后(添加component属性)的route数组
 */
const addPropComponent = arr => {
    arr.forEach(route => {
        if (route.children && route.children.length) {
            addPropComponent(route.children)
        }

        if (route.path !== '/') {
            route.component = importRoutes[route.name]
        }
    })
}

let routes = deepCopy(routeArray)

addPropComponent(routes)

export default routes
