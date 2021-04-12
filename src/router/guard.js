/**
 * 路由守卫
 * @module function
 * @desc vue路由拦截,路由名称转换,路由隐藏
 * @param  {Object}  - vue路由对象 router=new VueRouter({ ... })
 * @return  无
 */
let guard = router => {
    router.beforeEach(async (to, from, next) => {
        if (to.matched.length) {
            document.title = to.meta.cnName
            next()
        } else {
            next({ name: 'Error' })
        }
    })

    return router
}

export default guard
