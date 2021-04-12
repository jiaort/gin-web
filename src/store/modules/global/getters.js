export default {
    loading: state => {
        return Object.values(state.loading).filter(v => v).length
    }
}
