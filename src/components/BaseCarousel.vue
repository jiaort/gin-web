<template>
    <div class="base_carousel" v-if="visible">
        <div class="header" @click="close">
            <i class="close_btn el-icon-close"></i>
        </div>

        <div class="body">
            <img :src="url" />
        </div>

        <div class="mask" @click="close"></div>
    </div>
</template>

<script>
export default {
    name: 'BaseCarousel',

    props: {
        visible: {
            type: Boolean,
            default: false,
            required: false
        },

        url: {
            type: String,
            default: '',
            required: true
        }
    },

    data() {
        return {}
    },

    methods: {
        // 闭关组件
        close() {
            this.$emit('update:visible', false)
        }
    }
}
</script>
