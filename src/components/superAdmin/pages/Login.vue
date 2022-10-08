<template>
  <div class="sup_login_container">
    <div class="sup_login_box">
      <div class="sup_left">
        <img src="https://console.staging.truabilities.com/assets/dist/img/login-graphic.png" alt="" class="sup_graphic">
        <h1>Admin Console</h1>
      </div>
      <div class="sup_right">
        <a href="https://console.staging.truabilities.com/" class="logo">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRHpcqwj6RuBnis9zCi-ECPX9JsebA6WccrOG7Wm5O0nkjMdcjEVTX07sC75WG4d2El0o&usqp=CAU" class="truabilities-image" alt="Truabilities Image">
        </a>
        <div class="p-grid">
          <div class="p-col-12">
            <!-- login form end -->
            <form @submit.prevent="superAdminLogin('submit')" class="super_admin_login">
              <div class="p-fluid">
                <div class="p-field">
                  <label for="email">Email</label>
                  <InputText type="email" v-model="loginValue.email" :class="{ 'error' : loginError.emailError && loginError.emailInvalid, 'sucess' : loginError.noEmailError && loginError.noEmailInvalid }" v-on:keyup="superAdminLogin(null)" id="email" />
                  <small class="p-invalid sup_text_danger" v-if="loginError.emailError">Email is not available.</small>
                  <small class="p-invalid sup_text_danger" v-if="!loginError.emailError && loginError.emailInvalid">Email is not valid.</small>
                </div>
                <div class="p-field">
                  <label for="password">Password</label>
                  <InputText type="password" v-model="loginValue.password" :class="{ error : loginError.passwordError , 'sucess' : loginError.noPasswordError }" v-on:keyup="superAdminLogin(null)" id="password" />
                  <small class="p-invalid sup_text_danger" v-if="loginError.passwordError">Password is not available.</small>
                </div>
                <div class="p-field p-d-flex p-jc-between p-ai-center">
                  <div class="sup_submit_btn">
                    <span class="sup_icon_container">
                      <i class="pi pi-spin pi-spinner" style="fontSize: 1.5rem"></i>
                    </span>
                    <Button type="submit" label="Sign in" class="btn-primary" />
                  </div>
                  <a href="#" class="forget-pasword">Forgot Password</a>
                </div>
                <div class="sup_login_massage error text-danger" v-if="apiError.status !== 200 && apiError.status !== null">{{apiError.message}}</div >
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
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { reactive } from 'vue';
import { validateEmail, validatePassword } from '../../../helper/validationProcess/ValidationProcess';
import { superAdminLoginAuth } from '../../../config/appUrls';
import { apiKey } from "../../../config/constant";
import router from "../../../router"; 
import axios from "axios";
import { useStore } from 'vuex';

export default {
    name: 'SuperAdminLogin',
    components: {
      InputText,
      Button,
    },
    
    setup(){

      const store = useStore();

      const loginValue = reactive ({
        email: '',
        password: '',
        isSubmitted: false
      })

      const loginError = reactive ({
        emailError: false,
        emailInvalid: false,
        passwordError: false,
        noEmailError: false,
        noEmailInvalid: false,
        noPasswordError: false,
      })

      const apiError = reactive({
          status: null,
          message: null
      });

      async function superAdminLogin(location){
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
            const response = await axios.post( superAdminLoginAuth, {
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
              router.push({name: "SuperAdminDashboard"});
              store.dispatch('adminAuthAC',{
                isAuth: true,
                token: response.data.data.token
              });
              store.dispatch('userDetailsAC',{
                value: response.data.data
              });
              localStorage.setItem('admin-token', response.data.data.token);
              localStorage.setItem('user-details', JSON.stringify(response.data.data));
              if(localStorage.getItem('customer-token')){
                localStorage.removeItem('customer-token');
                localStorage.removeItem('customer-details');
              }
            }
          } catch(err) {
            apiError.status = err.response.data.status;
            apiError.message = err.response.data.message;
            localStorage.removeItem('admin-token');
          }
        }
      }

      return{
        superAdminLogin,
        loginValue,
        loginError,
        apiError
      }
    }
    
}
</script>

<style lang="scss" scoped>
@import "../../../assets/style/component/superAdmin/pages/Login.scss";
</style>