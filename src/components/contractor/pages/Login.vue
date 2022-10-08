<template>
  <div :class="['up_login_container', redirect.status ? 'up_login_container_nobg':'']">
    <div v-if="!redirect.status" class="up_login_box">
      <div class="up_left">
        <img src="https://console.staging.truabilities.com/assets/dist/img/login-graphic.png" alt="" class="up_graphic">
        <h1>Contractor PORTAL</h1>
      </div>
      <div class="up_right">
        <a href="https://console.staging.truabilities.com/" class="logo">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRHpcqwj6RuBnis9zCi-ECPX9JsebA6WccrOG7Wm5O0nkjMdcjEVTX07sC75WG4d2El0o&usqp=CAU" class="truabilities-image" alt="Truabilities Image">
        </a>
        <div class="p-grid">
          <div class="p-col-12">
            <!-- login form end -->
            <form @submit.prevent="userPortalLogin('submit')" class="user_portal_login">
              <div class="p-fluid">
                <div class="p-field">
                  <label for="email">Email</label>
                  <InputText type="email" v-model="loginValue.email" id="email" />
                  <small class="p-invalid text-danger" v-if="loginError.emailError">Email is not available.</small>
                  <small class="p-invalid text-danger" v-if="!loginError.emailError && loginError.emailInvalid">Email is not valid.</small>
                </div>
                <div class="p-field">
                  <label for="password">Password</label>
                  <InputText type="password" v-model="loginValue.password" id="password" />
                  <small class="p-invalid text-danger" v-if="loginError.passwordError">Password is not available.</small>
                </div>
                <div class="p-field p-d-flex p-jc-between p-ai-center">
                    <Button type="submit" label="Sign in" class="btn-primary" />
                    <router-link to="/forget-password" class="up_forget_pasword">Forgot Password</router-link>
                </div>
                <div class="sup_login_massage text-danger" v-if="apiError.status !== 200 && apiError.status !== null">{{apiError.message}}</div >
              </div>
            </form>
            <!-- login form end -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { contractorLoginAuth, userPortalUserVerify, userPortalWPLoginAuth } from '../../../config/appUrls';
import { apiKey, frontendUrl } from "../../../config/constant";
import { validateEmail, validatePassword } from '../../../helper/validationProcess/ValidationProcess';
import router from "../../../router";
import axios from "axios";
import { useStore } from 'vuex';
import { reactive } from 'vue';
import { useRoute } from "vue-router";

export default {
    name: 'UserPortalLogin',
    setup() {
      const store = useStore();

      //Route call
      const route = useRoute();

      const loginValue = reactive ({
        email: '',
        password: '',
        isSubmitted: false
      });

      const loginError = reactive ({
        emailError: false,
        emailInvalid: false,
        passwordError: false,
        noEmailError: false,
        noEmailInvalid: false,
        noPasswordError: false,
      });

      const apiError = reactive({
          status: null,
          message: null,
          redirecting: false,
          redirectingUuid: null,
      });

      const redirect = reactive({
        status: false,
        uuid: null
      });

      if(Object.keys(route.params).length > 0){
        redirect.status = true;
        redirect.uuid = route.params.id;
        if (route.path.includes("verify")) {
          wpVerifyUser();
        } else {
          wpUserLogin();
        }
      }

      async function wpVerifyUser () {
              try{
                const response = await axios.post( userPortalUserVerify, null, {
                  params:{
                    uuid: redirect.uuid
                  },
                  headers: {
                    apiKey: apiKey
                  },
                });
                if(response.status === 200) {
                  window.location.href = `${frontendUrl}?sso=true`;
                }
              } catch(err){
                  window.location.href = `${frontendUrl}?sso=invalid`;
              }
      }

      const userPortalLogin = async(location) => {
        const emailValid = validateEmail(loginValue.email);
        if(!emailValid.lValidation){
          loginError.emailError = true;
          loginError.noEmailError = false;
        } else {
          loginError.emailError = false;
          loginError.noEmailError = true;
        }

        if(!emailValid.eValidation){
          loginError.emailInvalid = true;
          loginError.noEmailInvalid = false;
        } else {
          loginError.emailInvalid = false;
          loginError.noEmailInvalid = true;
        }

        if(!validatePassword(loginValue.password).lValidation){
          loginError.passwordError = true;
          loginError.noPasswordError = false;
        } else {
          loginError.passwordError = false;
          loginError.noPasswordError = true;
        }

        if(!loginError.emailInvalid && !loginError.emailError && !loginError.passwordError){
          loginValue.isSubmitted = true;
        }

        if(loginValue.isSubmitted && location === 'submit'){
          try{
            const response = await axios.post( contractorLoginAuth, {
              email: loginValue.email,
              password: loginValue.password 
            },  {
                headers: {
                  apiKey: apiKey
                },
            });

            if(response.status === 200) {
              apiError.status = response.data.status;
              apiError.message = response.data.message;
              router.push({name: "ContractorsDashboard"});
              store.dispatch('customerAuthAC',{
                isAuth: true,
                token: response.data.data.token
              });
              store.dispatch('customerDetailsAC',{
                value: response.data.data
              });
              localStorage.setItem('customer-token', response.data.data.token);
              localStorage.setItem('customer-details', JSON.stringify(response.data.data));
              if(localStorage.getItem('admin-token')){
                localStorage.removeItem('admin-token');
                localStorage.removeItem('customer-details');
              }
            }
          } catch(err) {
            apiError.status = err.response.data.status;
            apiError.message = err.response.data.message;
          }
        }
      }

      async function wpUserLogin () {
        try{
          const response = await axios.get( userPortalWPLoginAuth, {
            params:{
              uuid: redirect.uuid
            },
            headers: {
              apiKey: apiKey
            },
          });
          if(response.status === 200) {
            apiError.status = response.data.status;
            apiError.message = response.data.message;
            router.push({name: "CustomerDashboard"});
            store.dispatch('customerAuthAC',{
              isAuth: true,
              token: response.data.data.token
            });
            store.dispatch('customerDetailsAC',{
              value: response.data.data
            });
            localStorage.setItem('customer-token', response.data.data.token);
            localStorage.setItem('customer-details', JSON.stringify(response.data.data));
            if(localStorage.getItem('admin-token')){
              localStorage.removeItem('admin-token');
              localStorage.removeItem('customer-details');
            }
          }
        } catch(err){
          console.error(err);
        }
      }
  
      return{
        loginValue,
        loginError,
        apiError,
        redirect,
        wpVerifyUser,
        userPortalLogin
      }
    }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/style/component/userportal/pages/Login.scss";
</style>