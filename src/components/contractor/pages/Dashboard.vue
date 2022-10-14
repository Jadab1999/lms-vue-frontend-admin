<template>
    <div class="up_content_inner up_dashboard">
        <div class="up_main_container_sm">
            <div class="con_dashboard_menu_list">
                <ul>
                    <li>
                        <router-link to="" >
                            <figure><img class="con-body-boxes" src="../../../assets/images/labours/profile.jpg" alt="My profile"></figure>
                            <h4>My profile</h4>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="">
                            <figure><img class="con-body-boxes" src="../../../assets/images/labours/people.jpg" alt="Labours"></figure>
                            <h4>Labours</h4>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="">
                            <figure><img class="con-body-companies" src="../../../assets/images/labours/contactedLab.jpg" alt="Contacted Labours"></figure>
                            <h4>Contacted Labours</h4>
                        </router-link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <router-link to="">
                            <figure><img class="con-body-companies" src="../../../assets/images/labours/companies.jpg" alt="Companies"></figure>
                            <h4>Companies</h4>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="">
                            <figure><img class="con-body-boxes" src="../../../assets/images/labours/contactedCom.jpg" alt="Contacted Companies"></figure>
                            <h4>Contacted Companies</h4>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="">
                            <figure><img class="con-body-support" src="../../../assets/images/labours/support.png" alt="Support"></figure>
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
@import '../../../assets/style/component/userportal/pages/Dashboard.css';
</style>