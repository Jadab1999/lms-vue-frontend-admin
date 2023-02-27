<template>
    <div class="up_content_inner up_manage_invoice">
        <div class="up_main_container">
            <div class="up_page_header p-jc-center">
                <h2 class="up_page_title">My Profile</h2>
            </div>
            <div class="up_inner_container">
                <!-- Profile form start -->
                <div :class="['up_profile_container', profileState.loading ? 'loading' : '']">
                    <h3 class="p-mb-2">Enter Details</h3>
                    <form @submit.prevent="updateProfile()" class="up_profile_update">
                        <div class="p-d-flex p-ai-center p-mb-4 up_profile_icon">
                            <figure>
                                <img v-if="profileDetails.avatar !== null" :src="profileState.newAvaterSelected ? profileState.selectedUrl : profileDetails.avatar" :alt="profileDetails.name">
                                <img v-else :src="imageUrl + 'avatar.png'" alt="">
                            </figure>
                            <div class="up_profile_upload">
                                <FileUpload mode="basic" name="demo[]" url="./upload.php" accept="image/*" :maxFileSize="2000000" chooseLabel="Upload Profile Icon" @select="fileSelected($event)" />
                                <small>Max upload size 2MB and in jpg, png format.</small>
                            </div>
                        </div>
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col">
                                <label for="name">Name <span class="text-danger">*</span></label>
                                <InputText v-model="profileDetails.name" id="name" type="text" />
                                <small class="p-invalid text-danger" v-if="profileDetails.nameError">Name is not valid.</small>
                            </div>
                            <div class="p-field p-col">
                                <label for="email">Email</label>
                                <InputText v-model="profileDetails.email" id="email" type="text" />
                                <small class="p-invalid text-danger" v-if="profileDetails.emailError">Email is not valid.</small>
                            </div>
                        </div>
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col">
                                <label for="country">Country <span class="text-danger">*</span></label>
                                <Dropdown v-model="profileDetails.country" :options="alllocationData.country" :filter="true" optionLabel="name" optionValue="uuid" placeholder="Select a Country" @change="fetchLocation('onchange')" />
                                <small class="p-invalid text-danger" v-if="profileDetails.countryError">Country is not valid.</small>
                            </div>
                            <div class="p-field p-col">
                                <label for="state">County/State <span class="text-danger">*</span></label>
                                <Dropdown v-model="profileDetails.state" :options="alllocationData.state" :filter="true" optionLabel="name" optionValue="uuid" placeholder="Select a County/State" />
                                <small class="p-invalid text-danger" v-if="profileDetails.stateError">County/State is not valid.</small>
                            </div>
                        </div>
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col">
                                <label for="city">City</label>
                                <InputText v-model="profileDetails.city" id="city" type="text" />
                            </div>
                            <div class="p-field p-col">
                                <label for="company">Company <span class="text-danger">*</span></label>
                                <InputText v-model="profileDetails.company" id="company" type="text" />
                                <small class="p-invalid text-danger" v-if="profileDetails.companyError">Company is not valid.</small>
                            </div>
                        </div>
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col">
                                <label for="addr1">Address 1 <span class="text-danger">*</span></label>
                                <InputText v-model="profileDetails.address1" id="addr1" type="text" />
                                <small class="p-invalid text-danger" v-if="profileDetails.address1Error">Address is required.</small>
                            </div>
                            <div class="p-field p-col">
                                <label for="addr2">Address 2</label>
                                <InputText v-model="profileDetails.address2" id="addr2" type="text" />
                            </div>
                        </div>
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col">
                                <label for="zipcode">Zipcode <span class="text-danger">*</span></label>
                                <InputText v-model="profileDetails.zipcode" id="zipcode" type="text" />
                                <small class="p-invalid text-danger" v-if="profileDetails.zipcodeError">Zipcode is not valid.</small>
                            </div>
                            <div class="p-field p-col">
                                <label for="intro">Intro</label>
                                <InputText v-model="profileDetails.intro" id="intro" type="text" />
                            </div>
                        </div>
                        <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col">
                                <label for="mobile">Mobile</label>
                                <InputText v-model="profileDetails.mobile" id="mobile" type="text" />
                            </div>
                            <div class="p-field p-col">
                                <label for="profile">Profile</label>
                                <InputText v-model="profileDetails.profile" id="profile" type="text" />
                            </div>
                        </div>
                        <!-- <div class="p-fluid p-formgrid p-grid">
                            <div class="p-field p-col">
                                <label for="mobile">Mobile</label>
                                <FileUpload mode="basic" name="demo[]" url="./upload.php" chooseLabel="Choose File" accept="image/*" :maxFileSize="1000000" @select="onUpload($event)" />
                            </div>
                        </div> -->
                        <div class="p-fluid up_button_center_align p-d-flex">
                            <Button icon="pi pi-refresh" type="button" label="Reset" class="p-button-white-shadow p-mr-2" @click="resetProfileForm()" />
                            <Button type="submit" label="Submit" class="p-button-primary" />
                        </div>
                    </form>
                    <Toast />
                </div>
                <!-- Profile form end -->
            </div>
        </div>
    </div>
</template>

<script>
import { labourProfile, allLocation } from '../../../config/appUrls';
import customerLogout from '../../../helper/userLogout/customerLogout';
import { imageUrl, apiKey } from "../../../config/constant";
import axios from "axios";
import { useStore } from 'vuex';
import { onBeforeMount, reactive } from 'vue';
import { useToast } from "primevue/usetoast";

export default {
    name: "Profile",
    setup(){
        //Application store call
        const store = useStore();

        //Toast Message
        const toast = useToast();

        //Component Profile local data
        const profileState = reactive({
            loading: false,
            updateStatus: '',
            newAvaterSelected: false,
            selectedUrl: ''
        });

        //Profile details form managing state
        const profileDetails = reactive({
            avatar: null,
            name: null,
            email: null,
            country: null,
            state: null,
            city: null,
            company: null,
            address1: null,
            address2: null,
            zipcode: null,
            intro: null,
            mobile: null,
            profile: null,
            nameError: false,
            emailError: false,
            countryError: false,
            stateError: false,
            companyError: false,
            zipcodeError: false,
            address1Error: false
        });

        //Location state
        const alllocationData = reactive({
            country: null,
            state: null,
        });

        onBeforeMount(()=>{
            fetchLocation('intialLoad');
            fetchUserProfile();
        });

        /**
         * Fetching country and state location
         */
        const fetchLocation = async(load) => {
            const response = await axios.get( allLocation, {
                params: {
                    uuid: profileDetails.country
                }, 
                headers: {
                    apiKey: apiKey,
                    token: store.getters.adminAuthToken
                },
            });
            
            if (response.data.status === 200) {
                //If condition for country and state segrigation
                if (load === 'intialLoad') {
                    alllocationData.country = response.data.data;
                } else {
                    alllocationData.state = response.data.data;
                }
            }
        }

        /**
         * Fetching user profile details
         */
        const fetchUserProfile = async() =>{
            try{
                profileState.loading = !profileState.loading;
                const response = await axios.get( labourProfile, {
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.adminAuthToken
                    }, 
                });
                if (response.data.status === 200) {
                    profileDetails.avatar = response.data.data.avatar;
                    profileDetails.name = response.data.data.name;
                    profileDetails.email = response.data.data.email;
                    profileDetails.country = response.data.data.countryUuid;
                    await fetchLocation('state');
                    profileDetails.state = response.data.data.stateUuid;
                    profileDetails.city = response.data.data.city;
                    profileDetails.company = response.data.data.company;
                    profileDetails.address1 = response.data.data.addressOne === "null" ? '' : response.data.data.addressOne;
                    profileDetails.address2 = response.data.data.addressTwo === "null" ? '' : response.data.data.addressTwo;
                    profileDetails.zipcode = response.data.data.zipcode === "null" ? '' : response.data.data.zipcode;
                    profileDetails.intro = response.data.data.intro === "null" ? '' : response.data.data.intro;
                    profileDetails.mobile = response.data.data.mobile === "null" ? '' : response.data.data.mobile;
                    profileDetails.profile = response.data.data.profile === "null" ? '' : response.data.data.profile;
                    profileState.loading = !profileState.loading;
                }
            } catch(err){
                if(err.response.status === 403 || store.getters.adminAuthToken === '' ){
                    customerLogout();
                } else {
                    console.log('error', err);
                }
            }
        }

        /**
         * Update user profile details
         */
        const updateProfile = async() => {
            let isValidate = updateProfileValidate();

            if(isValidate){
                try{
                    profileState.loading = !profileState.loading;
                    let options = {
                        method: 'put',
                        url: labourProfile,
                        data: JSON.stringify({
                            countryId: profileDetails.country,
                            stateId: profileDetails.state,
                            name: profileDetails.name,
                            email: profileDetails.email,
                            mobile: profileDetails.mobile,
                            company: profileDetails.company,
                            city: profileDetails.city,
                            addressOne: profileDetails.address1,
                            addressTwo: profileDetails.address2,
                            zipcode: profileDetails.zipcode,
                            intro: profileDetails.intro,
                            profile: profileDetails.profile,
                        }),
                        headers: {"Content-Type": "application/json", 'apiKey': apiKey, 'token': store.getters.adminAuthToken},
                        transformRequest: [(data) => {
                            // transform the data
                            return data;
                        }]
                    };
                    const response = await axios(options);

                    //On API success functionality
                    if (response.data.status === 200) {
                        profileState.loading = !profileState.loading;
                        profileState.updateStatus = true;
                        toast.add({severity:'success', summary:'Success', detail:'Profile Updated Successfully', life: 3000});
                        profileState.newAvaterSelected = false;

                        //Local storage user avatar data update 
                        let UserData = JSON.parse(localStorage.getItem("customer-details"));
                        UserData.avatar = response.data.data.avatar;
                        localStorage.setItem("customer-details", JSON.stringify(UserData));

                        //Application global storage user avatar data update 
                        store.dispatch('customerDetailsAC',{
                            value: UserData
                        });

                        fetchUserProfile();
                    }

                } catch(err){
                    if(err.response.status === 403 || store.getters.adminAuthToken === '' ){
                        customerLogout();
                    } else {
                        console.log('error', err);
                    }
                }
            }
        }

        /**
         * File after upload store to local state
         */
        const fileSelected = (e) => {
            profileDetails.avatar = e.files[0];
            profileState.newAvaterSelected = true;
            profileState.selectedUrl = e.files[0].objectURL;
        }

        /**
         * User profile form validation
         */
        const updateProfileValidate = () => {
            if(profileDetails.name === ''){
                profileDetails.nameError = true;
            } else {
                profileDetails.nameError = false;
            }
            if(profileDetails.email === ''){
                profileDetails.emailError = true;
            } else {
                profileDetails.emailError = false;
            }
            if(profileDetails.country === ''){
                profileDetails.countryError = true;
            } else {
                profileDetails.countryError = false;
            }
            if(profileDetails.state === ''){
                profileDetails.stateError = true;
            } else {
                profileDetails.stateError = false;
            }
            if(profileDetails.company === ''){
                profileDetails.companyError = true;
            } else {
                profileDetails.companyError = false;
            }
            if(profileDetails.zipcode === ''){
                profileDetails.zipcodeError = true;
            } else {
                profileDetails.zipcodeError = false;
            }
            if(profileDetails.address1 === ''){
                profileDetails.address1Error = true;
            } else {
                profileDetails.address1Error = false;
            }

            if(!profileDetails.nameError && !profileDetails.nameError && !profileDetails.countryError && !profileDetails.stateError && !profileDetails.companyError && !profileDetails.zipcodeError && !profileDetails.address1Error){
                return true;
            } else {
                return false;
            }
        }

        /**
         * Reset form funtion
         */
        const resetProfileForm = () => {
            profileDetails.avatar = null;
            profileDetails.name = "";
            profileDetails.email = "";
            profileDetails.country = "";
            profileDetails.state = "";
            profileDetails.city = "";
            profileDetails.company = "";
            profileDetails.address1 = "";
            profileDetails.address2 = "";
            profileDetails.zipcode = "";
            profileDetails.intro = "";
            profileDetails.mobile = "";
            profileDetails.profile = "";
        }

        return{
            imageUrl,
            profileState,
            profileDetails,
            alllocationData,
            fetchLocation,
            updateProfile,
            resetProfileForm,
            fileSelected
        }
    }
}
</script>


<style lang="scss" scoped>
@import '../../../assets/style/component/userportal/pages/profile/Profile.scss';
</style>