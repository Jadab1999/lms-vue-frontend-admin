export default {
    state: {
        isCustomerPortalAuth : false,
        customerPortalToken : '',
        customerDetail: {}
    },

    // Synchronous
    mutations: {
        adminAuthMU(state, payload) {
            state.isCustomerPortalAuth = payload.isAuth;
            state.customerPortalToken = payload.token
        },
        userDetailsMU(state, payload){
            state.customerDetail = payload.value;
        }
    },

    // Asynchronous
    actions: {
        customerAuthAC(context, payload) {
            context.commit('adminAuthMU', payload);
        },
        customerDetailsAC(context, payload){
            context.commit('userDetailsMU', payload);
        }
    },

    // getters
    getters: {
        customerPortalAuthStatus(state) {
            return state.isCustomerPortalAuth;
        },
        customerPortalToken(state){
            return state.customerPortalToken;
        },
        customerDetails(state){
            return state.customerDetail;
        }
    }
}