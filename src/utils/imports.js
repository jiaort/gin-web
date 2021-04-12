import { firstUpperCase } from '@/utils/functions'

export default function(context) {
    const map = {}
    for (const key of context.keys()) {
        // 格式化key
        const mapKey = key
            .replace(/\.scss$/g, '')
            .replace(/\.js$/g, '')
            .replace(/\.vue$/g, '')
            .split('/')
            .filter(v => v !== '.' && v !== '..')
            .map(v => firstUpperCase(v))
            .join('')
        map[mapKey] = context(key).default || context(key)
    }

    return map
}
