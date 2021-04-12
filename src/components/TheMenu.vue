<template>
    <el-menu
        class="the_menu"
        :router="true"
        :background-color="$styles.menuColor"
        :text-color="$styles.textReverseColor"
        :active-text-color="$styles.activeColor"
    >
        <!-- 一级菜单 -->
        <template v-for="(menu, index) in $vars.menuList">
            <template v-if="menu.children && menu.children.length > 0">
                <el-submenu :index="`menu${index}`" :key="`menu${index}`">
                    <template slot="title">
                        <i :class="menu.icon" v-if="menu.icon"></i>
                        <span class="title">{{ menu.title }} </span>
                    </template>

                    <!-- 二级菜单 -->
                    <template v-if="menu.children && menu.children.length > 0">
                        <template v-for="(menu2, index2) in menu.children">
                            <template v-if="menu2.children && menu2.children.length > 0">
                                <el-submenu
                                    :index="`menu${index}-${index2}`"
                                    :key="`menu${index}-${index2}`"
                                >
                                    <template slot="title">
                                        <i :class="menu2.icon" v-if="menu2.icon"></i>
                                        <span class="title">{{ menu2.title }}</span>
                                    </template>

                                    <!-- 三级菜单 -->
                                    <template v-if="menu2.children && menu2.children.length > 0">
                                        <template v-for="(menu3, index3) in menu2.children">
                                            <el-menu-item
                                                :route="menu3.route"
                                                :index="`menu${index}-${index2}-${index3}`"
                                                :key="`menu${index}-${index2}-${index3}`"
                                            >
                                                <template slot="title">
                                                    <i :class="menu3.icon" v-if="menu3.icon"></i>
                                                    <span class="title">{{ menu3.title }}</span>
                                                </template>
                                            </el-menu-item>
                                        </template>
                                    </template>
                                </el-submenu>
                            </template>

                            <template v-else>
                                <el-menu-item
                                    :route="menu2.route"
                                    :index="`menu${index}-${index2}`"
                                    :key="`menu${index}-${index2}`"
                                >
                                    <i :class="menu2.icon" v-if="menu2.icon"></i>
                                    <span class="title">{{ menu2.title }}</span>
                                </el-menu-item>
                            </template>
                        </template>
                    </template>
                </el-submenu>
            </template>

            <template v-else>
                <el-menu-item :route="menu.route" :index="`menu${index}`" :key="`menu${index}`">
                    <i :class="menu.icon" v-if="menu.icon"></i>
                    <span class="title">{{ menu.title }}</span>
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</template>

<script>
export default {
    name: 'TheMenu',
    props: {},
    data() {
        return {}
    },
    components: {},
    computed: {},
    watch: {},
    mounted() {},
    methods: {}
}
</script>
