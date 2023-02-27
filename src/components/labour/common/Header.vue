<template>
    <div class="up_main_header">
        <div class="up_main_contianer_full">
            <div class="up_left_block">
                <div :class="['mobi_menu_toggler', showMobileMenu ? 'iconActive':'']" @click="mobileMenu()"> <!-- 'mobi_menu_toggler': -->
                    <i class="pi pi-bars"></i>
                    <i class="pi pi-times"></i>
                </div>
                <div class="up_logo_wrap">
                    <router-link to="/labours/dashboard" class="up_logo">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRHpcqwj6RuBnis9zCi-ECPX9JsebA6WccrOG7Wm5O0nkjMdcjEVTX07sC75WG4d2El0o&usqp=CAU" class="lms-image" alt="Lms Image">
                    </router-link>
                </div>
                <div :class="['mobile_menu_overlay', showMobileMenu ? 'overlayActive':'']"></div>
                <nav v-if="isDashboardNow" :class="['up_main_nav up_navbar-nav', showMobileMenu ? 'mobileMenuActive':'']">
                     
                </nav>
            </div>
            <div class="up_right_block">
                <nav class="up_right_nav">
                    <!-- <li class="desktop_menu_active">
                        <router-link to="monitoring">
                            <img src="" alt=""> Monitor
                        </router-link>
                    </li>
                    <li class="desktop_menu_active">
                        <router-link to="billing-details">
                            <img src="" alt=""> Billing
                        </router-link>
                    </li>
                    <li class="desktop_menu_active">
                        <router-link to="invoice-list">
                            <img src="#" alt=""> Invoices
                        </router-link>
                    </li> -->
                    <li class="dropdown user user-menu">
                        <div class="up_user_dropdown_toggle" data-toggle="dropdown" aria-expanded="false" @click="customerDropdownToggle('userMenu')">
                            <img :src="customerDetails.avatar === null ? 'https://www.freeiconspng.com/thumbs/profile-icon-png/am-a-19-year-old-multimedia-artist-student-from-manila--21.png': customerDetails.avatar" alt=""> Profile
                            <small><i class="pi pi-angle-down p-ml-2"></i></small>
                        </div>
                        <div :class="['up_user_dropdown', customerDropdownShow.usermenu ? 'up_user_dropdown_show' : '']">
                            <ul class="up_user_dropdown_menu" v-show="customerDropdownShow.usermenu">
                                <li>
                                    <router-link to="my-profile">My Profile</router-link>
                                </li>
                                <li>
                                    <router-link to="wallet">My Wallet</router-link>
                                </li>
                                <li>
                                    <router-link to="cscs">Change Password</router-link>
                                </li>
                                <li>
                                    <router-link to="cscscs">Settings</router-link>
                                </li>
                                <li>
                                    <a @click="logout()">Sign out</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
import {labourLogout} from '../../../helper/userLogout/customerLogout';
import { userPortalNotification } from '../../../config/appUrls';
import { apiKey, imageUrlFrontEnd } from '../../../config/constant';
import { computed, onBeforeMount, reactive } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
    name: 'Header',
    data(){
        const mobileMenu = () =>{
            this.showMobileMenu = !this.showMobileMenu;
        }
          return {
            showMobileMenu: false,
            mobileMenu
          }; 
    },
    methods(){
        
    },
    setup(){

        let store = useStore();

        let isDashboardNow = computed(() => store.getters.fullHeaderStatus);
        let customerDetails = computed(() => store.getters.customerDetails);

        let customerDropdownShow = reactive({
            notification: false,
            usermenu: false
        });

        /**
         * Labour logout function
         */
         function logout(){
            //Generic fucntion call
            labourLogout();
        }

        const customerDropdownToggle = (type) =>{
            if (type === "userMenu") {
                customerDropdownShow.usermenu = !customerDropdownShow.usermenu;
            } else {
                customerDropdownShow.notification = !customerDropdownShow.notification;
            }
        }

        const notification = reactive({
            data: null,
            count: null,
            unread: null,
        })

        document.addEventListener("click", function(e){
            if(customerDropdownShow.usermenu === true){
                if(e.target.closest('.up_user_dropdown_toggle, .up_user_dropdown') === null){
                    customerDropdownShow.usermenu = false;
                }
            }
            if (customerDropdownShow.notification === true) {
                if(e.target.closest('.up_bell_icon, .up_notification_box') === null){
                    customerDropdownShow.notification = false;
                }
            }
        });

        onBeforeMount(()=>{
            // fetchNotification();
        });

        const fetchNotification = async() =>{
            try{
                const response = await axios.get( userPortalNotification + '/user', {
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.adminAuthToken
                    }, 
                });
                // console.log(response.data.data.notifications)
                notification.data = response.data.data.notifications;
                notification.count = response.data.data.total;
                notification.unread = response.data.data.unreadCount;
            } catch(err){
                if(err.response.status === 403 || store.getters.adminAuthToken === '' ){
                    labourLogout();
                } else {
                    console.log('error', err);
                }
            }
        }

        const readNotification = async(uuid) => {
            try {
                notification.unread--;
                await axios(userPortalNotification, {
                    method: 'PATCH',
                    data: {uuid},
                    headers: {'apiKey': apiKey, 'token': store.getters.adminAuthToken}
                })
            } catch (error) {
                console.log(error);
            }
        }

        const closeOnClick = () => {

        }

        // const pollNotifications = async() =>{
        //     try{
        //         const response = await axios.get( userPortalNotification + '/user', {
        //             headers: {
        //                 apiKey: apiKey,
        //                 token: store.getters.adminAuthToken
        //             }, 
        //         });
        //         notification.data = response.data.data.notifications;
        //         notification.count = response.data.data.total;
        //         if(notification.unread !== response.data.data.unreadCount)
        //             notification.unread = response.data.data.unreadCount;
        //         setTimeout(pollNotifications, 5000);

        //     } catch(err){
        //         if(err.response.status === 403 || store.getters.adminAuthToken === '' ){
        //             customerLogout();
        //         } else {
        //             console.log('error', err);
        //         }
        //     }
        // }

        // onMounted(() => {
        //     setTimeout(pollNotifications, 3000);
        // })

        return{
            customerDetails,
            notification,
            isDashboardNow,
            imageUrlFrontEnd,
            customerDropdownShow,
            customerDropdownToggle,
            logout,
            closeOnClick,
            readNotification,
            fetchNotification
        }
    },
    
}
</script>

<style lang="scss" scoped>

img.lms-image {
    height: 40px;
}
@import '../../../assets/style/component/userportal/common/Header.css';
</style>