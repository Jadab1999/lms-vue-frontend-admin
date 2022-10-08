import { createRouter, createWebHistory } from 'vue-router';
import { defineAsyncComponent } from 'vue'
// const Missing = defineAsyncComponent(() => import('../components/Missing.vue'));
import {AuthGuard, CustomerAuthGuard} from '../helper/authGuard/AuthGuard'
import store from '../store';

const routes = [
    /** User Portal Labour Routes **/
    {
      path: '/login',
      name: 'LabourPortalLogin',
      component: () => defineAsyncComponent(() => import('../components/labour/pages/Login.vue')),
      meta: { title: 'User Portal - LMS Labour Portal' }
    },
    {
        path: "/labours",
        name: 'LaboursLayout',
        component: () => defineAsyncComponent(() => import('../components/labour/userPortalLayout.vue')),
        beforeEnter: CustomerAuthGuard,
        children: [
          {
            path: "dashboard",
            name: "LaboursDashboard",
            component: () => defineAsyncComponent(() => import('../components/labour/pages/Dashboard.vue')),
            meta: { title: 'Dashboard - LMS Customer Portal' }
          },
        ]
    },




    /** User Portal Contractor Routes **/
    {
      path: '/signin',
      name: 'ContractorPortalLogin',
      component: () => defineAsyncComponent(() => import('../components/contractor/pages/Login.vue')),
      meta: { title: 'User Portal - LMS Labour Portal' }
    },
    {
        path: "/contractors",
        name: 'ContractorsLayout',
        component: () => defineAsyncComponent(() => import('../components/contractor/userPortalLayout.vue')),
        beforeEnter: CustomerAuthGuard,
        children: [
          {
            path: "dashboard",
            name: "ContractorsDashboard",
            component: () => defineAsyncComponent(() => import('../components/contractor/pages/Dashboard.vue')),
            meta: { title: 'Dashboard - LMS Customer Portal' }
          },
        ]
    },




    /** Admin Portal Routes **/
    {
      path: '/console',
      name: 'SuperAdminLogin',
      component: () => defineAsyncComponent(() => import('../components/superAdmin/pages/Login.vue')),
      meta: { title: 'Super Admin - LMS Admin Login' }
    },
    {
        path: "/admin",
        name: 'AdminLayout',
        component: () => defineAsyncComponent(() => import('../components/superAdmin/SuperAdminLayout.vue')),
        beforeEnter: AuthGuard,
        children: [
        {
            path: "dashboard",
            name: "SuperAdminDashboard",
            component: () => defineAsyncComponent(() => import('../components/superAdmin/pages/Dashboard.vue')),
            meta: { title: 'Dashboard - LMS Admin' }
        },
    ]}
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  })
  
  router.beforeEach((to, from, next) => {
    if(to.path === '/v3/customer/dashboard'){
      store.dispatch('fullHeaderAC',{
        value: false
      });
    } else if (to.path === '/console' && window.localStorage.getItem('admin-token')){
      router.push({name: "SuperAdminDashboard"});
    } else if (to.path === '/login' && window.localStorage.getItem('customer-token')){
      router.push({name: "CustomerDashboard"});
    } else {
      store.dispatch('fullHeaderAC',{
        value: true
      });
    }
    document.title = to.meta.title;
    next();
  });
  
  export default router