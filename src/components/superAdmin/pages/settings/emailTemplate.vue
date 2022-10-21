<template>
    <div class="sup_content general-settings">
        <div class="sup_page_heading">
            <h2>Email Template</h2>
            <Button icon="pi pi-plus" class="p-button-sm p-button-rounded p-button-primary" v-tooltip="'Add New Type'" @click="emailTemplateModal.addTemplate = true" />
        </div>
        <div class="sup_inner_content">
            <!--- Show Email Template Start --->
            <DataTable class="p-datatable" :paginator="true" :value="allEmailTemplateState.data" :rows="10" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Showing {currentPage} of {totalPages}" :rowsPerPageOptions="[10,20,50]" :rowHover="true" :loading="allEmailTemplateState.loading" responsiveLayout="scroll" removableSort :filters="filters">
                <template #loading>
                    Loading Email Template data. Please wait.
                </template>
                <template #header>
                    <div class="p-d-flex p-jc-between">
                        <div class="sup_list_action">
                            <Button :label="allEmailTemplateState.activityStatus === 'active' ? 'Deactive List': 'Active List'" :icon="['pi', allEmailTemplateState.activityStatus === 'active' ? 'pi-ban' : 'pi-check-circle']" :class="[allEmailTemplateState.activityStatus === 'active' ? 'p-button-danger' : 'p-button-primary', 'p-mr-2']" @click="fetchAllEmailTemplate(allEmailTemplateState.activityStatus, 'typeStatus')" />
                        </div>
                        <div class="p-d-flex p-align-center">
                            <span class="p-input-icon-left sup_search_box">
                                <i class="pi pi-search" />
                                <InputText v-model="allEmailTemplateState.search" placeholder="Search Email Template" @keyup.enter="fetchAllEmailTemplate(allEmailTemplateState.activityStatus, 'search')"/>
                            </span>
                            <Calendar v-model="allEmailTemplateState.dateRange" placeholder="DD.MM.YY" dateFormat="dd.mm.yy" selectionMode="range" class="sup_button p-ml-2" inputClass="p-inputtext" :manualInput="false" :showIcon="true" @date-select="allEmailTemplateState.dateRange[1] != null ? fetchAllEmailTemplate(allEmailTemplateState.activityStatus, 'dateRange') : ''" plceholder="abc" />
                            <Button v-if="allEmailTemplateState.search !== null || allEmailTemplateState.dateRange !== null" icon="pi pi-refresh" class="p-button-sm p-button-dark sup_search_clear p-ml-2" @click="fetchAllEmailTemplate(allEmailTemplateState.activityStatus, 'resetFilters')"/>
                        </div>
                    </div>
                </template>
                <template #empty>
                    No Email Template found...
                </template>
                <Column field="subject" header="Subject" :sortable="true" >
                    <template #body="slotProps">
                        <strong>{{slotProps.data.subject}}</strong>
                    </template>
                </Column>

                <Column field="EmailType" header="Email Type">
                    <template #body="slotProps">
                    {{slotProps.data.EmailType.type}}
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
                        <Button v-if="slotProps.data.deletedAt === null" type="button" icon="pi pi-pencil" class="p-button-sm p-button-rounded p-button-primary p-mr-1" @click="editEmailTemplate(slotProps.data)" v-tooltip="'Edit Email Template'" />
                        <Button v-if="slotProps.data.deletedAt === null" type="button" icon="pi pi-ban" class="p-button-sm p-button-rounded p-button-danger p-mr-1" v-tooltip="'Deactivate'" @click="confirmationModalfn(slotProps.data, 'delete')" />
                        <Button v-if="slotProps.data.deletedAt !== null" icon="pi pi-undo" class="p-button-secondary p-button-rounded p-button-sm p-mr-1"  v-tooltip="'Restore Email Template'" @click="confirmationModalfn(slotProps.data, 'restore')" />
                        <Button v-if="slotProps.data.deletedAt !== null" icon="pi pi-trash" class="p-button-danger p-button-rounded p-button-sm"  v-tooltip="'Delete Email Template'" />
                    </template>
                </Column>
            </DataTable>
            <!--- Show Email Template End --->
        </div>
        <!--- Add Email Template Modal Start --->
        <Dialog header="Add New Email Tempalate" v-model:visible="emailTemplateModal.addTemplate" :modal="true" :style="{width: '600px'}" @hide="close()">
            <form class="sup_template_add" @submit.prevent="createEmailTemplate()">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="temp_subject">Email Subject*</label>
                        <InputText v-model="addEditTemplate.subject" id="temp_subject" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditTemplate.subjectEmpty">Subject is not available.</small>
                    </div>
                    <div class="p-field p-col-6">
                        <label for="l_code">Email Type*</label>
                        <Dropdown v-model="addEditTemplate.type" :options="emailType" id="u_state" optionLabel="name" optionValue="value" />
                        <small class="p-invalid sup_text_danger" v-if="addEditTemplate.typeEmpty">Selact a Type.</small>
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-12">
                        <label for="l_voice">Email Content*</label>
                        <Editor v-model="addEditTemplate.content" editorStyle="height: 200px"/>
                        <small class="p-invalid sup_text_danger" v-if="addEditTemplate.contentEmpty">Selact a Voice Support.</small>
                    </div>
                </div>
                <div class="p-fluid p-d-flex sup_submit_wrap">
                    <Button type="submit" label="Add" class="btn-primary sup_submit" />
                </div>
                <div :class="['sup_form_massage p-mt-3', allEmailTemplateState.addStatus === 200 ? 'success' : 'error']" v-if="allEmailTemplateState.addStatus !== ''">{{allEmailTemplateState.addMessage}}</div >
            </form>
        </Dialog>
        <!--- Add Email Template Modal End --->
        <!--- Edit Email Template Modal Start --->
        <Dialog header="Edit Email Tempalate" v-model:visible="emailTemplateModal.editTemplate" :modal="true" :style="{width: '600px'}" @hide="close()">
            <form class="sup_template_edit" @submit.prevent="updateEmailTemplate(emailTemplateModal.editData.uuid)">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="temp_subject">Email Subject*</label>
                        <InputText v-model="addEditTemplate.subject" id="temp_subject" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditTemplate.subjectEmpty">Subject is not available.</small>
                    </div>
                    <div class="p-field p-col-6">
                        <label for="l_code">Email Type*</label>
                        <Dropdown v-model="addEditTemplate.type" :options="emailType" id="u_state" optionLabel="name" optionValue="value" />
                        <small class="p-invalid sup_text_danger" v-if="addEditTemplate.typeEmpty">Selact a Type.</small>
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-12">
                        <label for="l_voice">Email Content*</label>
                        <Editor v-model="addEditTemplate.content" editorStyle="height: 200px"/>
                        <small class="p-invalid sup_text_danger" v-if="addEditTemplate.contentEmpty">Selact a Voice Support.</small>
                    </div>
                </div>
                <div class="p-fluid p-d-flex sup_submit_wrap">
                    <Button type="submit" label="Update" class="btn-primary sup_submit" />
                </div>
                <div :class="['sup_form_massage p-mt-3', allEmailTemplateState.editStatus === 200 ? 'success' : 'error']" v-if="allEmailTemplateState.editStatus !== ''">{{allEmailTemplateState.editMessage}}</div >
            </form>
        </Dialog>
        <!--- Edit Email Template Modal End --->
        <!--- Deactive/Restore Confirmation Start --->
        <Dialog header="Confirmation" v-model:visible="confirmationModal.modalState" :style="{width: '350px'}" :modal="true">
            <div class="confirmation-content p-d-flex p-items-center">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 1.6rem" />
                <span>Do you want to proceed?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="confirmationModal.modalState = false" class="p-button-text" autofocus/>
                <Button label="Yes" icon="pi pi-check" @click="deleteAndRestoreEmailType(confirmationModal.modaldata.data, confirmationModal.modaldata.type), confirmationModal.modalState = false" class="p-button-primary" />
            </template>
        </Dialog>
        <!--- Deactive/Restore Confirmation End --->
    </div>
</template>

<script>
import { onBeforeMount, reactive } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { adminEmailTemplates, adminEmailType } from '../../../../config/appUrls';
import { apiKey } from "../../../../config/constant";
import userLogout from '../../../../helper/userLogout/userLogout';
import { formatDate, usFormatDate } from "../../../../helper/utility/utility";

export default {
    name: "EmailTemplate",
    setup(){
        //Store call
        let store = useStore();

        //Fetch and filtring data initial state
        const allEmailTemplateState = reactive({
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

        const emailTemplateModal = reactive({
            addTemplate: false,
            editTemplate: false,
            editData: ''
        });

        const addEditTemplate = reactive({
            subject: '',
            subjectEmpty: false,
            type: '',
            typeEmpty: false,
            content: '',
            contentEmpty: false
        });

        const emailType = reactive([]);

        //Active-deactive confimation state
        const confirmationModal = reactive({
            modalState: false,
            modaldata: '',
        });

        //Before component mount required function invoke
        onBeforeMount(async () => {
            fetchAllEmailTemplate('active');
            fetchAllEmailType();
        });

        //Fetch All Email type
        const fetchAllEmailTemplate = async(status, activity) => {
            let date = null;
            if(activity === 'typeStatus'){
                allEmailTemplateState.activityStatus = status === 'active' ? 'de-active' : 'active' ;
            }

            if(activity === 'resetFilters'){
                allEmailTemplateState.search = null;
                allEmailTemplateState.dateRange = null;
            }

            if (activity === 'dateRange') {
                date = formatDate(allEmailTemplateState.dateRange[0]) + ' ' + formatDate(allEmailTemplateState.dateRange[1]);
            }

            try{
                allEmailTemplateState.loading = !allEmailTemplateState.loading;
                const response = await axios.get(adminEmailTemplates, {
                    params: {
                        status: allEmailTemplateState.activityStatus,
                        search: allEmailTemplateState.search,
                        filterDt: date
                    },
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.adminAuthToken
                    }
                })
                allEmailTemplateState.data = response.data.data.emailtemplate;
                allEmailTemplateState.total = response.data.data.total;
                allEmailTemplateState.loading = !allEmailTemplateState.loading;
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
                        name: response.data.data.emailtype[i].type,
                        value: response.data.data.emailtype[i].uuid,
                    })
                }
                
            } catch(err){
                console.error('error', err);
            }
        }

        const createEmailTemplate = async() => {
            let isvalidate = templateFormValidation();

            if (isvalidate) {
                try{
                    const options = {
                        method: 'post',
                        url: adminEmailTemplates,
                        data: JSON.stringify({
                            subject: addEditTemplate.subject,
                            type: addEditTemplate.type,
                            content: addEditTemplate.content,
                        }),
                        headers: {'Content-Type': 'application/json', 'apiKey': apiKey, 'token': store.getters.adminAuthToken},
                        transformRequest: [(data) => {
                            // transform the data
                            return data;
                        }]
                    };
                    let response = await axios(options);
                    console.log(response);
                    allEmailTemplateState.addStatus = response.data.status;
                    allEmailTemplateState.addMessage = response.data.message;
                    resetTemplateForm();
                    fetchAllEmailTemplate('active');
                } catch(err){
                    allEmailTemplateState.addStatus = err.response.data.status;
                    allEmailTemplateState.addMessage = err.response.data.message;
                }
            }
        }

        const editEmailTemplate = (slotData) => {
            emailTemplateModal.editTemplate = true;
            emailTemplateModal.editData = slotData;
            addEditTemplate.subject = slotData.subject;
            addEditTemplate.content = slotData.content;

            for (let i = 0; i < emailType.length; i++) {
                if (emailType[i].name === slotData.EmailType.type) {
                    addEditTemplate.type = emailType[i].value;
                }
            }
        }
        
        const updateEmailTemplate = async(uuid) =>{
            let isvalidate = templateFormValidation();
            if (isvalidate) {
                try{
                    const options = {
                        method: 'put',
                        url: adminEmailTemplates,
                        params: {
                            uuid: uuid
                        },
                        data: JSON.stringify({
                            subject: addEditTemplate.subject,
                            type: addEditTemplate.type,
                            content: addEditTemplate.content,
                        }),
                        headers: {'Content-Type': 'application/json', 'apiKey': apiKey, 'token': store.getters.adminAuthToken},
                        transformRequest: [(data) => {
                            // transform the data
                            return data;
                        }]
                    };
                    let response = await axios(options);
                    allEmailTemplateState.editStatus = response.data.status;
                    allEmailTemplateState.editMessage = response.data.message;
                    fetchAllEmailTemplate('active');
                } catch(err){
                    allEmailTemplateState.editStatus = err.response.data.status;
                    allEmailTemplateState.editMessage = err.response.data.message;
                }
            }
        }

        const close = () =>{
            resetTemplateForm();
            addEditTemplate.addStatus = '';
            addEditTemplate.addMessage = '';
            addEditTemplate.editStatus = '';
            addEditTemplate.editMessage = '';
        }

        const templateFormValidation = () => {
            if(addEditTemplate.subject === ''){
                addEditTemplate.subjectEmpty = true;
            } else {
                addEditTemplate.subjectEmpty = false;
            }

            if(addEditTemplate.type === ''){
                addEditTemplate.typeEmpty = true;
            } else {
                addEditTemplate.typeEmpty = false;
            }

            if(addEditTemplate.content === ''){
                addEditTemplate.contentEmpty = true;
            } else {
                addEditTemplate.contentEmpty = false;
            }

            if (!addEditTemplate.subjectEmpty && !addEditTemplate.typeEmpty && !addEditTemplate.contentEmpty) {
                return true;
            } else {
                return false;
            }
        }

        const resetTemplateForm = () => {
            addEditTemplate.subject = '';
            addEditTemplate.type = '';
            addEditTemplate.content = '';
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
        const deleteAndRestoreEmailType = async (slotData, methodType) => {
            try{
                const options = {
                    method: methodType === 'delete' ? 'delete' : 'patch',
                    url: adminEmailTemplates,
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
                fetchAllEmailTemplate('active');
            } catch(err){
                console.log(err);
            }
        }

        return{
            allEmailTemplateState,
            emailTemplateModal,
            addEditTemplate,
            emailType,
            confirmationModal,
            fetchAllEmailTemplate,
            createEmailTemplate,
            usFormatDate,
            editEmailTemplate,
            updateEmailTemplate,
            close,
            confirmationModalfn,
            deleteAndRestoreEmailType
        }
    }
}
</script>

<style>

</style>