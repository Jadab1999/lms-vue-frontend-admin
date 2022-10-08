export default {
    state: {
        menuAction: [],
    },

    // Synchronous
    mutations: {
        menuActionMU(state, payload){
            state.menuAction = payload.value;
        },
    },

    // Asynchronous
    actions: {
        menuActionAC(context, payload){
            context.commit('menuActionMU', payload);
        },
    },

    // getters
    getters: {
        menuActionStatus(state){
            return state.menuAction;
        },
    }
}