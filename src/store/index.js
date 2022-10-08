import { createStore } from 'vuex'

import adminAuthStore from './modules/adminAuth/adminAuth';
import adminInterfaceStore from './modules/adminInterface/adminInterface';
import adminMenuActionStore from './modules/adminMenuActionStore/adminMenuActionStore';
import customerPortalAuthStore from './modules/customerPortalAuth/customerPortalAuth';
import customerHeaderStore from './modules/customerHeader/customerHeader';

export default createStore({
  
  modules: {
    adminAuthStore: adminAuthStore,
    adminInterfaceStore: adminInterfaceStore,
    adminMenuActionStore: adminMenuActionStore,
    customerPortalAuthStore: customerPortalAuthStore,
    customerHeaderStore: customerHeaderStore
  }
})
