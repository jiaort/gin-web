import Vue from 'vue'
import '@/styles/base/_element.scss'

import {
    Upload,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Button,
    MessageBox,
    Message,
    Loading,
    Notification
} from 'element-ui'

const components = {
    Upload,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Button,
    MessageBox,
    Message,
    Notification
}
// 全局设置
// Vue.prototype.$ELEMENT = { size: 'medium' }

// 自定义指令
Vue.use(Loading.directive)

// 全局属性
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

const componentsHandler = {
    install(Vue) {
        Object.keys(components)
            .filter(key => key !== 'Message' && key !== 'Notification' && key !== 'MessageBox')
            .forEach(key => Vue.use(components[key]))
    }
}

Vue.use(componentsHandler)
