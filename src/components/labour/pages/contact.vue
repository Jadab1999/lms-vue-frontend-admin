<template>
    <div class="shade">
		<div class="blackboard">
            <form @submit.prevent="contactUs()" class="user_portal_login">
				<div class="form">
						<p>
								<label>Name: </label>
								<input v-model="contactDetails.name" type="text" />
						</p>
						<p>
								<label>Email: </label>
								<input v-model="contactDetails.email" type="text" />
						</p>
						<p>
								<label>Phone: </label>
								<input v-model="contactDetails.mobile" type="tel" />
						</p>
						<p>
								<label>Subject: </label>
								<input v-model="contactDetails.subject" type="text" />
						</p>
						<p>
								<label>Message: </label>
								<textarea v-model="contactDetails.message"></textarea>
						</p>
						<div class="wipeout">
                        </div>
                        <div class="wipein"> 
                            <Button type="submit" label="Connect" class="btn-body-text" />
                            <!-- <Button type="submit" icon="pi pi-whatsapp" class="btn btn-success" />
                            <Button type="submit" icon="pi pi-phone" class="btn btn-body-text" /> -->
                        </div>
						<div class="custom-success" v-if="contactDetails.addStatus !== ''">{{contactDetails.addMessage}}</div >
				</div>
            </form>
		</div>
    </div>
</template>

<script>
import { contactedByLabour } from '../../../config/appUrls';
import { apiKey } from "../../../config/constant";
import axios from "axios";
import { useStore } from 'vuex';
import { reactive } from 'vue';

export default {
    name: "Profile",
    setup(){
        //Application store call
        const store = useStore();

		const contactDetails = reactive({
			name : "",
			email : "",
			mobile : "",
			subject : "",
			message : "",
			addMessage: '',
			addStatus : ''
		});

		const contactUs = async () => {
			try{
				const response = await axios.post( contactedByLabour,{
					name: contactDetails.name,
					email: contactDetails.email,
					mobile: contactDetails.mobile,
					subject: contactDetails.subject,
					message: contactDetails.message
				},{
					headers: {
						apiKey: apiKey,
						token: store.getters.adminAuthToken
					}, 
				});
				if(response.status === 200) {
					contactDetails.addStatus = response.status;
					contactDetails.addMessage = response.data.data;
				}
			} catch(err){
				contactDetails.addStatus = err.response.data.status;
				contactDetails.addMessage = err.response.data.message;
			}
        }


		return {
			contactUs,
			contactDetails
		}
	}
}
</script>



<style lang="scss">

.custom-success{
	text-align: center;
	margin: 18px 0px;
	padding: 10px;
	color: #fff;
	border: 2px dashed darkgreen
}
@import '../../../assets/style/component/userportal/pages/contact/contact.css';
</style>