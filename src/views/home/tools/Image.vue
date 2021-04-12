<template>
    <div id="home_tools_image">
        <el-upload class="upload_box" action :http-request="startUpload" :on-change="handleChange">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>

        <div class="img_list_box">
            <template v-for="img in imgList">
                <div class="img_list" :key="img.key" v-if="img.src">
                    <div class="img_title">{{ img.label }}</div>
                    <div class="img_box" @click="zoomImg(img.src)">
                        <img :src="img.src" @error="handleErrorImg(img)" />
                    </div>
                </div>
            </template>
        </div>

        <pre class="code_box" v-if="code">{{ JSON.stringify(code, null, 4) }}</pre>

        <BaseCarousel :visible.sync="dialogVisible" :url="bigImgSrc"></BaseCarousel>
    </div>
</template>

<script>
import BaseCarousel from '@/components/BaseCarousel.vue'
import { baseUrl, httpMethod, contentType } from '@/api/axios'

export default {
    name: 'HomeToolsImage',
    props: {},
    data() {
        return {
            dialogVisible: false,
            code: null,

            imgList: [
                {
                    key: 'origin',
                    label: '原图',
                    src: ''
                },
                {
                    key: 'result',
                    label: '检测后',
                    src: ''
                }
            ],

            bigImgSrc: '',
            fileFormData: null
        }
    },
    components: { BaseCarousel },
    computed: {},
    watch: {},
    mounted() {},
    methods: {
        /**
         * 图片加载失败时展示错误图片
         * @param 加载错误的图片对象
         * @returns none
         */
        handleErrorImg(img) {
            this.$set(img, 'src', this.$vars.imgSrc.errorBg)
        },

        /**
         * 展开大图
         * @returns none
         */
        zoomImg(img_path) {
            this.bigImgSrc = img_path
            this.dialogVisible = true
        },

        /**
         * 开始文件上传
         * @param 上传的文件信息
         * @description 上传文件到服务器
         * @returns none
         */
        startUpload(content) {
            this.$api({
                url: 'imgDetection',
                method: httpMethod.post,
                headers: {
                    post: {
                        'Content-Type': contentType.form
                    }
                },
                options: this.fileFormData,
                callback: {
                    error: this.handleUploadError,
                    success: this.handleUploadSuccess
                }
            })
        },

        /**
         * 文件上传成功触发
         * @param response 服务器返回response
         * @description
         * @returns none
         */
        handleUploadSuccess(response) {
            this.code = response.data.result

            this.imgList = this.imgList.map(v => {
                switch (v.key) {
                    case 'origin':
                        v.src = baseUrl.uploads + response.data.img_path
                        break
                    case 'result':
                        v.src = baseUrl.uploads + response.data.res_img_path
                        break
                }

                return v
            })
        },

        /**
         * 文件上传失败触发
         * @param error 服务器返回response
         * @description
         * @returns none
         */
        handleUploadError(error) {
            this.code = error
        },

        /**
         * 文件上传列表修改时触发
         * @param file 改变的文件
         * @description
         * @returns none
         */
        handleChange(file) {
            this.fileFormData = new FormData()
            this.fileFormData.append('file', file.raw)
        }
    }
}
</script>
