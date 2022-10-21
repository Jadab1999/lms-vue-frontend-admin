<template>
    <div class="sup_content general-settings">
        <div class="sup_page_heading">
            <h2>Email Recipients</h2>
            <Button icon="pi pi-plus" class="p-button-sm p-button-rounded p-button-primary" v-tooltip="'Add New Recipient'" @click="emailRecipientModal.addRecipient = true" />
        </div>
        <div class="sup_inner_content">
            <!--- Show Email Recipient Start --->
            <DataTable class="p-datatable" :paginator="true" :value="allEmailRecipientState.data" :rows="10" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Showing {currentPage} of {totalPages}" :rowsPerPageOptions="[10,20,50]" :rowHover="true" :loading="allEmailRecipientState.loading" responsiveLayout="scroll" removableSort :filters="filters">
                <template #loading>
                    Loading Email Recipient data. Please wait.
                </template>
                <template #header>
                    <div class="p-d-flex p-jc-between">
                        <div class="sup_list_action">
                            <Button :label="allEmailRecipientState.activityStatus === 'active' ? 'Deactive List': 'Active List'" :icon="['pi', allEmailRecipientState.activityStatus === 'active' ? 'pi-ban' : 'pi-check-circle']" :class="[allEmailRecipientState.activityStatus === 'active' ? 'p-button-danger' : 'p-button-primary', 'p-mr-2']" @click="fetchAllEmailRecipient(allEmailRecipientState.activityStatus, 'typeStatus')" />
                        </div>
                        <div class="p-d-flex p-align-center">
                            <span class="p-input-icon-left sup_search_box">
                                <i class="pi pi-search" />
                                <InputText v-model="allEmailRecipientState.search" placeholder="Search Email Recipient" @keyup.enter="fetchAllEmailRecipient(allEmailRecipientState.activityStatus, 'search')"/>
                            </span>
                            <Calendar v-model="allEmailRecipientState.dateRange" placeholder="DD.MM.YY" dateFormat="dd.mm.yy" selectionMode="range" class="sup_button p-ml-2" inputClass="p-inputtext" :manualInput="false" :showIcon="true" @date-select="allEmailRecipientState.dateRange[1] != null ? fetchAllEmailRecipient(allEmailRecipientState.activityStatus, 'dateRange') : ''" plceholder="abc" />
                            <Button v-if="allEmailRecipientState.search !== null || allEmailRecipientState.dateRange !== null" icon="pi pi-refresh" class="p-button-sm p-button-dark sup_search_clear p-ml-2" @click="fetchAllEmailRecipient(allEmailRecipientState.activityStatus, 'resetFilters')"/>
                        </div>
                    </div>
                </template>
                <template #empty>
                    No Email Recipient found...
                </template>
                <Column field="emailCc" header="Email CC" :sortable="true" >
                    <template #body="slotProps">
                        {{slotProps.data.emailCc.join(", ")}}
                    </template>
                </Column>

                <Column field="emailBcc" header="Email BCC" :sortable="true" >
                    <template #body="slotProps">
                        {{slotProps.data.emailBcc.join(", ")}}
                    </template>
                </Column>

                <Column field="createdAt" header="Created On">
                    <template #body="slotProps">
                    {{usFormatDate(slotProps.data.createdAt)}}
                    </template>
                </Column>

                <Column field="status" header="Status" headerStyle="8rem">
                    <template #body="slotProps">
                        <span :class="['sup_item_status ', slotProps.data.status ? 'sup_item_status_success' : 'sup_item_status_danger']"><i :class="['pi ', slotProps.data.status ? 'pi-check' : 'pi-times']"></i>{{slotProps.data.status ? 'Active' : 'In-Active'}}</span>
                    </template>
                </Column>

                <Column field="action" header="Actions">
                    <template #body="slotProps">
                        <Button v-if="slotProps.data.deletedAt === null" type="button" icon="pi pi-pencil" class="p-button-sm p-button-rounded p-button-primary p-mr-1" @click="editEmailTemplate(slotProps.data)" v-tooltip="'Edit Recipients'" />
                        <Button v-if="slotProps.data.deletedAt === null" type="button" icon="pi pi-ban" class="p-button-sm p-button-rounded p-button-danger p-mr-1" v-tooltip="'Deactivate'" @click="confirmationModalfn(slotProps.data, 'delete')" />
                        <Button v-if="slotProps.data.deletedAt !== null" icon="pi pi-undo" class="p-button-secondary p-button-rounded p-button-sm p-mr-1"  v-tooltip="'Restore Recipients'" @click="confirmationModalfn(slotProps.data, 'restore')" />
                        <Button v-if="slotProps.data.deletedAt !== null" icon="pi pi-trash" class="p-button-danger p-button-rounded p-button-sm"  v-tooltip="'Delete Recipients'" />
                    </template>
                </Column>
            </DataTable>
            <!--- Show Email Recipient End --->
        </div>
        <!--- Add Email Recipient Modal Start --->
        <Dialog header="Add New Email Recipient" v-model:visible="emailRecipientModal.addRecipient" :modal="true" :style="{width: '600px'}" @hide="close()">
            <form class="sup_recipient_add" @submit.prevent="createEmailRecipient()">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-12">
                        <label for="l_code">Email Type*</label>
                        <Dropdown v-model="addEditRecipient.type" :options="emailType" id="u_state" optionLabel="name" optionValue="value" />
                        <small class="p-invalid sup_text_danger" v-if="addEditRecipient.typeEmpty">Selact a Type.</small>
                    </div>
                    <div class="p-field p-col-12">
                        <label for="recpt_cc">Email Cc*</label>
                        <Chips v-model="addEditRecipient.emailcc" separator="," />
                        <small class="p-invalid sup_text_danger" v-if="addEditRecipient.emailccError">Email Cc is not available.</small>
                    </div>
                    <div class="p-field p-col-12">
                        <label for="recpt_bcc">Email Bcc*</label>
                        <Chips v-model="addEditRecipient.emailbcc" separator="," />
                        <small class="p-invalid sup_text_danger" v-if="addEditRecipient.emailbccError">Email Bcc is not available.</small>
                    </div>
                </div>
                <div class="p-fluid p-d-flex sup_submit_wrap">
                    <Button type="submit" label="Add" class="btn-primary sup_submit" />
                </div>
                <div :class="['sup_form_massage p-mt-3', allEmailRecipientState.addStatus === 200 ? 'success' : 'error']" v-if="allEmailRecipientState.addStatus !== ''">{{allEmailRecipientState.addMessage}}</div >
            </form>
        </Dialog>
        <!--- Add Email Recipient Modal End --->
        <!--- Edit Email Recipient Modal Start --->
        <Dialog header="Edit Email Recipient" v-model:visible="emailRecipientModal.editRecipient" :modal="true" :style="{width: '600px'}" @hide="close()">
            <form class="sup_recipient_add" @submit.prevent="updateEmailRecipient(emailRecipientModal.editRecipientData.uuid)">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-12">
                        <label for="l_code">Email Type*</label>
                        <Dropdown v-model="addEditRecipient.type" :options="emailType" id="u_state" optionLabel="name" optionValue="value" />
                        <small class="p-invalid sup_text_danger" v-if="addEditRecipient.typeEmpty">Selact a Type.</small>
                    </div>
                    <div class="p-field p-col-12">
                        <label for="recpt_cc">Email Cc*</label>
                        <Chips v-model="addEditRecipient.emailcc" separator="," />
                        <small class="p-invalid sup_text_danger" v-if="addEditRecipient.emailccError">Email Cc is not available.</small>
                    </div>
                    <div class="p-field p-col-12">
                        <label for="recpt_bcc">Email Bcc*</label>
                        <Chips v-model="addEditRecipient.emailbcc" separator="," />
                        <small class="p-invalid sup_text_danger" v-if="addEditRecipient.emailbccError">Email Bcc is not available.</small>
                    </div>
                </div>
                <div class="p-fluid p-d-flex sup_submit_wrap">
                    <Button type="submit" label="Update" class="btn-primary sup_submit" />
                </div>
                <div :class="['sup_form_massage p-mt-3', allEmailRecipientState.addStatus === 200 ? 'success' : 'error']" v-if="allEmailRecipientState.addStatus !== ''">{{allEmailRecipientState.addMessage}}</div >
            </form>
        </Dialog>
        <!--- Edit Email Recipient Modal End --->
        <!--- Deactive/Restore Confirmation Start --->
        <Dialog header="Confirmation" v-model:visible="confirmationModal.modalState" :style="{width: '350px'}" :modal="true">
            <div class="confirmation-content p-d-flex p-items-center">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 1.6rem" />
                <span>Do you want to proceed?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="confirmationModal.modalState = false" class="p-button-text" autofocus/>
                <Button label="Yes" icon="pi pi-check" @click="deleteAndRestoreEmailRecipient(confirmationModal.modaldata.data, confirmationModal.modaldata.type), confirmationModal.modalState = false" class="p-button-primary" />
            </template>
        </Dialog>
        <!--- Deactive/Restore Confirmation End --->
    </div>
</template>

<script>
import { onBeforeMount, reactive } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { adminEmailRecipients, adminEmailType } from '../../../../config/appUrls';
import { apiKey } from "../../../../config/constant";
import userLogout from '../../../../helper/userLogout/userLogout';
import { formatDate, usFormatDate, underscoreTostring } from "../../../../helper/utility/utility";

export default {
    name: "EmailRecipients",
    setup(){
        //Store call
        let store = useStore();

        //Fetch and filtring data initial state
        const allEmailRecipientState = reactive({
            data: null,
            total: null,
            status: null,
            loading: false,
            activityStatus: 'active',
            search: null,
            dateRange: null,
            addStatus: '',
            addMessage: '',
            editStatus: '',
            editMessage: ''
        });

        const emailRecipientModal = reactive({
            addRecipient: false,
            editRecipient: false,
            editRecipientData: '',
        });

        const addEditRecipient = reactive({
            type: '',
            typeEmpty: false,
            emailcc: '',
            emailccError: false,
            emailbcc: '',
            emailbccError: false
        });

        const emailType = reactive([]);

        //Active-deactive confimation state
        const confirmationModal = reactive({
            modalState: false,
            modaldata: '',
        });

        //Before component mount required function invoke
        onBeforeMount(async () => {
            fetchAllEmailRecipient('active');
            fetchAllEmailType()
        });

        //Fetch All Email recipient
        const fetchAllEmailRecipient = async(status, activity) => {
            let date = null;
            if(activity === 'typeStatus'){
                allEmailRecipientState.activityStatus = status === 'active' ? 'de-active' : 'active' ;
            }

            if(activity === 'resetFilters'){
                allEmailRecipientState.search = null;
                allEmailRecipientState.dateRange = null;
            }

            if (activity === 'dateRange') {
                date = formatDate(allEmailRecipientState.dateRange[0]) + ' ' + formatDate(allEmailRecipientState.dateRange[1]);
            }

            try{
                allEmailRecipientState.loading = !allEmailRecipientState.loading;
                const response = await axios.get(adminEmailRecipients, {
                    params: {
                        status: allEmailRecipientState.activityStatus,
                        search: allEmailRecipientState.search,
                        filterDt: date
                    },
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.adminAuthToken
                    }
                })
                allEmailRecipientState.data = response.data.data.emailrecepient;
                allEmailRecipientState.total = response.data.data.total;
                allEmailRecipientState.loading = !allEmailRecipientState.loading;
            } catch(err){
                if(err.response.status === 403 || store.getters.adminAuthToken === '' ){
                    userLogout();
                } else {
                    console.log('error', err);
                }
            }
        }

        const fetchAllEmailType = async() => {
            try{
                const response = await axios.get(adminEmailType, {
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.adminAuthToken
                    }
                })
                for(let i =0; i < response.data.data.emailtype.length; i++){
                    emailType.push({
                        name: underscoreTostring(response.data.data.emailtype[i].type),
                        value: response.data.data.emailtype[i].uuid,
                    })
                }
                
            } catch(err){
                console.error('error', err);
            }
        }

        const createEmailRecipient = async() =>{
            let isValidate = validateEmailRecipient();

            if(isValidate){
                try{
                    const options = {
                        method: 'post',
                        url: adminEmailRecipients,
                        data: JSON.stringify({
                            emailtypeUuid: addEditRecipient.type,
                            emailCc: addEditRecipient.emailcc,
                            emailBcc: addEditRecipient.emailbcc,
                        }),
                        headers: {'Content-Type': 'application/json', 'apiKey': apiKey, 'token': store.getters.adminAuthToken},
                        transformRequest: [(data) => {
                            // transform the data
                            return data;
                        }]
                    };
                    let response = await axios(options);
                    allEmailRecipientState.addStatus = response.data.status;
                    allEmailRecipientState.addMessage = response.data.data;
                    resetTemplateForm();
                    fetchAllEmailRecipient('active');
                } catch(err){
                    allEmailRecipientState.addStatus = err.response.data.status;
                    allEmailRecipientState.addMessage = err.response.data.message;
                }
            }
        }

        const editEmailTemplate = (slotData) => {
            emailRecipientModal.editRecipient = true;
            emailRecipientModal.editRecipientData = slotData;
            addEditRecipient.emailcc = slotData.emailCc;
            addEditRecipient.emailbcc = slotData.emailBcc;

            // for (let i = 0; i < emailType.length; i++) {
            //     if (emailType[i].name === slotData.EmailType.type) {
            //         addEditRecipient.type = emailType[i].value;
            //     }
            // }
        }

        const updateEmailRecipient = async(uuid) => {
            let isValidate = validateEmailRecipient();

            if (isValidate) {
                try{
                    const options = {
                        method: 'put',
                        url: adminEmailRecipients,
                        params: {
                            uuid: uuid
                        },
                        data: JSON.stringify({
                            emailtypeUuid: addEditRecipient.type,
                            emailCc: addEditRecipient.emailcc,
                            emailBcc: addEditRecipient.emailbcc,
                        }),
                        headers: {'Content-Type': 'application/json', 'apiKey': apiKey, 'token': store.getters.adminAuthToken},
                        transformRequest: [(data) => {
                            // transform the data
                            return data;
                        }]
                    };
                    let response = await axios(options);
                    allEmailRecipientState.editStatus = response.data.status;
                    allEmailRecipientState.editMessage = response.data.message;
                    fetchAllEmailRecipient('active');
                } catch(err){
                    allEmailRecipientState.editStatus = err.response.data.status;
                    allEmailRecipientState.editMessage = err.response.data.message;
                }
            }
        }

        const validateEmailRecipient = () => {
            if (addEditRecipient.type === '') {
                addEditRecipient.typeEmpty = true;
            } else {
                addEditRecipient.typeEmpty = false;
            }

            if (addEditRecipient.emailcc === '') {
                addEditRecipient.emailccError = true;
            } else {
                addEditRecipient.emailccError = false;
            }

            if (addEditRecipient.emailbcc === '') {
                addEditRecipient.emailbccError = true;
            } else {
                addEditRecipient.emailbccError = false;
            }

            if(!addEditRecipient.emailbccError && !addEditRecipient.emailccError && !addEditRecipient.typeEmpty){
                return true;
            } else {
                return false;
            }
        }

        const resetTemplateForm = () => {
            addEditRecipient.type = '';
            addEditRecipient.emailcc = '';
            addEditRecipient.emailbcc = '';
        }

        const close = () => {
            resetTemplateForm();
            allEmailRecipientState.addStatus = '';
            allEmailRecipientState.addMessage = '';
            allEmailRecipientState.editStatus = '';
            allEmailRecipientState.editMessage = '';
        }

        //Delete-restore Email type confirmation modal
        const confirmationModalfn = (sloteData, load) => {
            confirmationModal.modalState = true;
            confirmationModal.modaldata = {
                data: sloteData,
                type: load
            }
        }
        
        //Delete-restore Email type HTTP call
        const deleteAndRestoreEmailRecipient = async (slotData, methodType) => {
            try{
                const options = {
                    method: methodType === 'delete' ? 'delete' : 'patch',
                    url: adminEmailRecipients,
                    params: {
                        uuid: slotData.uuid
                    },
                    headers: {'Content-Type': 'application/json', 'apiKey': apiKey, 'token': store.getters.adminAuthToken},
                    transformRequest: [(data) => {
                        // transform the data
                        return data;
                    }]
                };
                await axios(options);
                fetchAllEmailRecipient('active');
            } catch(err){
                console.log(err);
            }
        }

        return{
            emailType,
            emailRecipientModal,
            allEmailRecipientState,
            addEditRecipient,
            confirmationModal,
            fetchAllEmailRecipient,
            usFormatDate,
            createEmailRecipient,
            editEmailTemplate,
            updateEmailRecipient,
            close,
            confirmationModalfn,
            deleteAndRestoreEmailRecipient
        }
    }
}
</script>

<style>

</style>