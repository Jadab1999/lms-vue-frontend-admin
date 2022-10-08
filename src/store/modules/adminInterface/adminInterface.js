export default {
    state: {
        leftMenuCollapsed: false,
        darkMode: false
    },

    // Synchronous
    mutations: {
        leftMenuCollapsedMU(state, payload){
            state.leftMenuCollapsed = payload.value;
        },
        darkModeMU(state, payload){
            state.darkMode = payload.value;
        }
    },

    // Asynchronous
    actions: {
        leftMenuCollapsedAC(context, payload){
            context.commit('leftMenuCollapsedMU', payload);
        },
        darkModeAC(context, payload){
            context.commit('darkModeMU', payload);
        }
    },

    // getters
    getters: {
        LeftMenuCollapsedStatus(state){
            return state.leftMenuCollapsed;
        },
        darkModeStatus(state){
            return state.darkMode;
        }
    }
}