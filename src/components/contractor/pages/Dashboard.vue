<template>
    <div class="up_content_inner up_dashboard">
        <div class="up_main_container_sm">
            <div class="up_dashboard_menu_list">
                <ul>
                    <li>
                        <router-link to="" >
                            <figure><img src="" alt="My profile"></figure>
                            <h4>My profile</h4>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="">
                            <figure><img src="" alt="Labours"></figure>
                            <h4>Labours</h4>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="">
                            <figure><img src="" alt="Contacted Labours"></figure>
                            <h4>Contacted Labours</h4>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="">
                            <figure><img src="" alt="Companies"></figure>
                            <h4>Companies</h4>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="">
                            <figure><img src="" alt="Contacted Companies"></figure>
                            <h4>Contacted Companies</h4>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="">
                            <figure><img src="" alt="Support"></figure>
                            <h4>Support</h4>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
// import BillingDetailsModal from '../popups/BillingDetails.vue';
import { imageUrlFrontEnd } from '../../../config/constant';

export default {
    name: 'Dashboard',
    components: {
    },
    setup(){

        // const userCardStatus = computed(() => store.getters.customerDetails);

        return{
            imageUrlFrontEnd
        }
    }
}
</script>

<style lang="scss">
@import '../../../assets/style/component/userportal/pages/Dashboard';
</style>