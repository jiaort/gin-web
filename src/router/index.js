import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/importAllRoutes'
import guard from '@/router/guard'

Vue.use(VueRouter)

// 解决vue NavigationDuplicated报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}

export default guard(
    new VueRouter({
        mode: 'history',
        base: process.env.BASE_URL,
        linkActiveClass: 'active',
        linkExactActiveClass: 'exact_active',
        routes
    })
)
