export default {
    state: {
        isAdminAuth : false,
        adminToken : '',
        userDetail: {}
    },

    // Synchronous
    mutations: {
        adminAuthMU(state, payload) {
            state.isAdminAuth = payload.isAuth;
            state.adminToken = payload.token
        },
        userDetailsMU(state, payload){
            state.userDetail = payload.value;
        }
    },

    // Asynchronous
    actions: {
        adminAuthAC(context, payload) {
            context.commit('adminAuthMU', payload);
        },
        userDetailsAC(context, payload){
            context.commit('userDetailsMU', payload);
        }
    },

    // getters
    getters: {
        adminAuthStatus(state) {
            return state.isAdminAuth;
        },
        adminAuthToken(state){
            return state.adminToken;
        },
        userDetails(state){
            return state.userDetail;
        }
    }
}