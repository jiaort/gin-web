const importAll = require.context('@/store/', true, /index.js$/)

const modulesMap = {}

importAll.keys().map(path => {
    if (path.indexOf('/modules/') > -1) {
        let api = importAll(path).default || importAll(path)
        const key = path.split('/').reverse()[1]
        modulesMap[key] = api
    }
})

export default modulesMap
