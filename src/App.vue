<template>
  <router-view />
  <!-- admin-login -->
</template>

<script>
import { useStore } from 'vuex';

export default {
  name: 'App',
  setup() {

    const store = useStore();
    //const route = useRoute();
    
    (() => {
      const adminToken = window.localStorage.getItem('admin-token');
      const customerToken = window.localStorage.getItem('customer-token');
      const customerData = JSON.parse(window.localStorage.getItem('customer-details'));
      if(adminToken !== null){
        store.dispatch('adminAuthAC',{
          isAuth: true,
          token: adminToken
        });
      }
      if(customerToken !== null && customerData !== null){
        store.dispatch('customerAuthAC',{
          isAuth: true,
          token: customerToken
        });
        store.dispatch('customerDetailsAC',{
          value: customerData
        });
      }
    })();
    
    return{

    }
  }
}
</script>

<style lang="scss">
</style>
