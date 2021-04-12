<template>
    <div id="home_tools_train">
        <el-button @click="send" size="small" type="primary">执行命令</el-button>
        <pre class="code_box"><p v-for="(line, i) in list" :key="i" >{{line}}</p></pre>
    </div>
</template>

<script>
export default {
    name: 'HomeToolsTrain',
    data() {
        return {
            path: 'ws://127.0.0.1:8888/api/v1/detection/ping',
            socket: '',
            list: []
        }
    },
    mounted() {
        // 初始化
        this.init()
    },
    watch: {
        processData: 'scrollToBottom'
    },
    methods: {
        init: function() {
            if (typeof WebSocket === 'undefined') {
                alert('您的浏览器不支持socket')
            } else {
                // 实例化socket
                this.socket = new WebSocket(this.path)
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
            }
        },
        open: function() {
            console.log('socket连接成功')
        },
        error: function() {
            console.log('连接错误')
        },
        getMessage: function(msg) {
            if (this.list.length > 999) {
                this.list.shift()
            }
            this.list.push(msg.data)
        },
        send: function() {
            this.socket.send('ping')
        },
        close: function() {
            console.log('socket已经关闭')
        },
        scrollToBottom: function() {
            console.log('---------------')
            this.$nextTick(() => {
                var div = document.getElementsByClassName('code_box')

                div.scrollTop = div.scrollHeight
            })
        }
    },
    destroyed() {
        // 销毁监听
        this.socket.onclose = this.close
    }
}
</script>

<style></style>
