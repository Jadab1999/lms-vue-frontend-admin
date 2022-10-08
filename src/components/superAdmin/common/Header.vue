<template>
    <div class="sup_header">
        <div class="sup_left_action p-d-flex">
            <div class="sup_toggle_button">
                <Button icon="pi pi-bars" class="p-button-rounded p-button-white-shadow p-button-text sup_text_black p-mr-2" v-tooltip.right="'Collapse Menu'" @click="toggleLeftMenu()" />
            </div>
            <div class="sup_browser-back">
                <Button icon="pi pi-arrow-left" class="p-button-rounded p-button-white-shadow p-button-text sup_text_black" v-tooltip.right="'Back'" @click="$router.go(-1)" />
            </div>
        </div>
        <div class="sup_header_nav_wrap">
            <ul class="sup_header_nav">
                <li>
                    <Button :icon="['pi', changeMode ? 'pi-sun' : 'pi-moon', 'sup_text_black']" class="p-button-rounded p-button-white-shadow p-button-text sup_text_black" @click="changeThemeMode()" v-tooltip.bottom="changeMode ? 'Try Our Blue Theme' : 'Try Our Dark Theme'" />
                </li>
                <li>
                    <Button icon="pi pi-bell sup_text_black" class="p-button-rounded p-button-white-shadow p-button-text sup_text_black" v-tooltip.bottom="'Notification'" />
                </li>
                <li class="sup_user">
                    <div class="sup_user_profile" @click="dropdownToggle" v-tooltip.bottom="'User Info'">
                        <div class="sup_user_icon">
                            <img :src="imageUrl + '/avatar.png'" alt="">
                        </div>
                        <div class="sup_user_info">
                            <span>Welcome,</span>
                            <h3 class="sup_user_name p-d-flex p-ai-center">{{UserName}}</h3>
                        </div>
                    </div>
                    <div :class="['sup_user_dropdown', showDropDown ? 'sup_user_dropdown_show' : '']">
                        <ul class="sup_user_dropdown-menu" v-show="showDropDown">
                            <li>
                                <router-link to="/admin/profile" class="p-ripple" v-ripple><i class="pi pi-user"></i>Profile</router-link>
                            </li>
                            <li>
                                <router-link to="/admin/change-password" class="p-ripple" v-ripple><i class="pi pi-key"></i>Change Password</router-link>
                            </li>
                            <li>
                                <a @click="logout()" class="p-ripple" v-ripple><i class="pi pi-sign-out"></i>Log out</a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
        <!--- Deactive/Restore Confirmation End --->
        <!-- Toast to show notification of events start -->
        <Toast position="top-right" />
        <!-- Toast to show notification of events end -->
</template>

<script>
import userLogout from '../../../helper/userLogout/userLogout';
import { useStore } from 'vuex';
import { ref } from 'vue';

export default {
    name: 'Header',
    setup(){
        //Vuex store data call fucntion
        const store = useStore();

        //left menu collapse state
        const collapseStatus = ref(false);

        //Theme change state
        const changeMode = ref(false);

        //Show drop down toggle state
        const showDropDown = ref(false);

        //User name value state
        const UserName = ref();

        /**
         * Self calling fucntion
         * Getting user name form local storage or Vuex storage
         */
        (() => {
            if (Object.keys(store.getters.userDetails).length === 0) { //Coming from local storage
                const user = JSON.parse(localStorage.getItem('user-details'));
                UserName.value = user.name;
            } else { //Coming from veux store
                UserName.value = store.getters.userDetails.name;
            }
        })();

        /**
         * Admin user logout function
         */
        function logout(){
            //Generic fucntion call
            userLogout();
        }

        /**
         * User menu collapse toggle fucntion
         */
        function toggleLeftMenu(){
            collapseStatus.value = !collapseStatus.value;
            store.dispatch('leftMenuCollapsedAC',{
                value: collapseStatus.value,
            });
        }
        
        /**
         * Super admin theme color change fucntion
         */
        function changeThemeMode(){
            changeMode.value = !changeMode.value;
            store.dispatch('darkModeAC',{
                value: changeMode.value,
            });
            //localStorage.setItem('dark-mode', changeMode.value);
        }

        /**
         * User profile dropdown menu toggle
         */
        function dropdownToggle(){
            showDropDown.value = !showDropDown.value;
        }

        /**
         * On outside click close profile dropdown
         */
        document.addEventListener("click", function(e){
            if(showDropDown.value === true){
                if(e.target.closest('.sup_user_profile, .sup_user_dropdown') === null){
                    showDropDown.value = false
                }
            }
        });

        //variable value pass to template
        return{
            logout,
            toggleLeftMenu,
            changeThemeMode,
            changeMode,
            dropdownToggle,
            showDropDown,
            UserName
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/style/component/superAdmin/common/Header.scss";
</style>