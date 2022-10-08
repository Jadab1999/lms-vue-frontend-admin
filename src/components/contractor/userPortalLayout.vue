<template>
    <div class="up_layout_wrpper">
        <div class="up_layout_content">
            <Header />
            <router-view />
            <Footer />
        </div>
    </div>
</template>

<script>
import Header from './common/Header';
import Footer from './common/Footer';
//import { useToast } from "primevue/usetoast";
export default {
    name: 'UserPortalLayout',
    components: {
      Header,
      Footer
    },

    setup(){

        //Toast Message
        //const toast = useToast();
        // console.log(toast);
        // toast.add({severity:'error', summary:'Card Error', detail:'error', life: 3000});

        return{
            
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/style/component/userportal/UserPortal';
</style>