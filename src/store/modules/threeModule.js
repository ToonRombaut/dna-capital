export default {
    state: {
        sketch: null
    },
    getters: {
        sketch: state => state.sketch
    },
    mutations: {
        setSketch(state, sketch) {
            state.sketch = sketch;
        }
    },
    actions: {
        setSketch({ commit }, sketch) {
            commit("setSketch", sketch);
        }
    }
}