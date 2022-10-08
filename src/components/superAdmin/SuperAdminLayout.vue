<template>
    <div :class="['sup_layout_wrpper', isDarkMode ? 'skin-dark' : 'skin-blue']">
        <div class="sup_sidebar_contianer">
            <LeftPanel />
        </div>
        <div :class="['sup_main_container', collapseLeftMenu ? 'sup_sidbar_collapsed' : '']">
            <Header />
            <router-view />
            <Footer />
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import Header from './common/Header';
import Footer from './common/Footer';
import LeftPanel from './common/LeftPanel';

import { useStore } from 'vuex';
export default {
    name: 'AdminLayout',
    components: {
       Header,
       Footer,
       LeftPanel
    },

    setup(){

        //const isDarkMode = ref(false)

        const store = useStore();
        // (() => {
        //     isDarkMode.value = localStorage.getItem('dark-mode');
        // })();

        const collapseLeftMenu = computed(() => store.getters.LeftMenuCollapsedStatus);
        const isDarkMode = computed(() => store.getters.darkModeStatus);

        return{
            collapseLeftMenu,
            isDarkMode
        }
    }
}
</script>

<style lang="scss">
@import "../../assets/style/component/superAdmin/SuperAdmin.scss";
</style>