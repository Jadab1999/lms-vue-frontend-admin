<template>
    <div class="up_main_footer">
        <div class="up_main_contianer_full">
            <div class="up_footer_menu">
                <div class="up_copywrite" :value="currYear.date">
                    <p>© {{currYear.date}} Lms All Rights Reserved.</p>
                </div>
                <div class="up_footer_menu_wrap">
                    <ul>
                        <li>
                            <a :href="frontendUrl + 'privacy-policy'" target="_blank">Privacy Policy</a>
                        </li>
                        <li>
                            <a :href="frontendUrl + 'terms-of-service'" target="_blank">Terms &amp; Condition</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="up_extra_note">
                <p>Website best viewed in all latest versions of Chrome, Firefox, Mozilla and EDGE on desktop and mobile devices.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import { frontendUrl } from '../../../config/constant';
export default {
    name: 'Footer',
    setup() {

    const currYear = reactive({
        date : ''
    })

    currYear.date = new Date().getFullYear();

    return{
    currYear,
    frontendUrl
    }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/style/component/userportal/common/Footer';
</style>