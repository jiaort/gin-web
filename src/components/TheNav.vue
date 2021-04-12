<template>
    <div class="the_nav">
        <div class="user">
            <div class="avatar">
                <img :src="user.avatar" />
            </div>
            <span class="name">{{ user.name }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TheNav',
    props: {},
    data() {
        return {
            user: {
                avatar: this.$vars.imgSrc.avatar,
                name: 'admin'
            }
        }
    },
    components: {},
    computed: {},
    watch: {},
    mounted() {},
    methods: {}
}
</script>
