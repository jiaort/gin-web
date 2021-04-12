export default [
    {
        path: '/',
        redirect: {
            name: 'Home'
        }
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            cnName: '登录'
        }
    },
    {
        path: '/error',
        name: 'Error',
        meta: {
            cnName: '出错了'
        }
    },
    {
        path: '/home',
        name: 'Home',
        meta: {
            requireAuth: true,
            cnName: '首页'
        },
        children: [
            {
                path: 'tools',
                name: 'HomeTools',
                meta: {
                    requireAuth: true,
                    cnName: '工具'
                },
                redirect: {
                    name: 'HomeToolsImage'
                },
                children: [
                    {
                        path: 'image',
                        name: 'HomeToolsImage',
                        meta: {
                            requireAuth: true,
                            cnName: '目标检测'
                        }
                    },
                    {
                        path: 'train',
                        name: 'HomeToolsTrain',
                        meta: {
                            requireAuth: true,
                            cnName: '模型训练'
                        }
                    }
                ]
            }
        ]
    }
]
