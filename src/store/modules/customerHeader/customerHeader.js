export default {
    state: {
        fullHeader: false
    },

    // Synchronous
    mutations: {
        fullHeaderMU(state, payload) {
            state.fullHeader = payload.value;
        },
    },

    // Asynchronous
    actions: {
        fullHeaderAC(context, payload) {
            context.commit('fullHeaderMU', payload);
        }
    },

    // getters
    getters: {
        fullHeaderStatus(state) {
            return state.fullHeader;
        }
    }
}