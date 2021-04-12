<template>
    <div id="error">
        <div class="inset">
            <img :src="$vars.imgSrc.errorBg" />
            <p>页面被神秘力量吸走了，请联系我们修复</p>
            <el-button type="primary" @click="$router.push({ name: 'Home' })">返回首页</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error'
}
</script>
