import Vue from 'vue'

export default {
    updateLoading: (state, payload) => {
        Vue.set(state.loading, payload.type, payload.value)
    }
}
