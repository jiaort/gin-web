<template>
    <div id="app">
        <router-view v-if="isRouterAlive" />
    </div>
</template>

<script>
export default {
    name: 'App',

    data() {
        return {
            isRouterAlive: true
        }
    },

    // 页面刷新
    provide() {
        return {
            reload: this.reload
        }
    },

    methods: {
        // 页面刷新
        reload() {
            this.isRouterAlive = false

            this.$nextTick(() => {
                this.isRouterAlive = true
            })
        }
    }
}
</script>
