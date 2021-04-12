<template>
    <div id="home">
        <div class="aside">
            <router-link :to="{ name: 'Home' }" class="logo">
                <img :src="$vars.imgSrc.logo" />
                <h1 class="app_name">AI 平台</h1>
                <h1 class="seo_name">AI Platform</h1>
            </router-link>
            <div class="menu">
                <TheMenu />
            </div>
        </div>
        <div class="content">
            <div class="nav">
                <TheNav />
            </div>
            <div class="body" v-loading="globalLoading">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import TheMenu from '@/components/TheMenu'
import TheNav from '@/components/TheNav'

export default {
    name: 'Home',
    data() {
        return {}
    },
    components: { TheMenu, TheNav },
    computed: {
        ...mapGetters('global', {
            globalLoading: 'loading'
        })
    }
}
</script>
