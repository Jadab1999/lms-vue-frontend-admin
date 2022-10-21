<template>
    <div class="sup_content general-settings">
        <div class="sup_page_heading">
            <h2>Email Type</h2>
            <Button icon="pi pi-plus" class="p-button-sm p-button-rounded p-button-primary" v-tooltip="'Add New Type'" @click="typeModal.addType = true" />
        </div>
        <div class="sup_inner_content">
            <!--- Show Email Type Start --->
            <DataTable class="p-datatable" :paginator="true" :value="allEmailTypeState.data" :rows="10" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Showing {currentPage} of {totalPages}" :rowsPerPageOptions="[10,20,50]" :rowHover="true" :loading="allEmailTypeState.loading" responsiveLayout="scroll" removableSort :filters="filters">
                <template #loading>
                    Loading Email Type data. Please wait.
                </template>
                <template #header>
                    <div class="p-d-flex p-jc-between">
                        <div class="sup_list_action">
                            <Button :label="allEmailTypeState.activityStatus === 'active' ? 'Deactive List': 'Active List'" :icon="['pi', allEmailTypeState.activityStatus === 'active' ? 'pi-ban' : 'pi-check-circle']" :class="[allEmailTypeState.activityStatus === 'active' ? 'p-button-danger' : 'p-button-primary', 'p-mr-2']" @click="fetchAllEmailType(allEmailTypeState.activityStatus, 'typeStatus')" />
                        </div>
                        <div class="p-d-flex p-align-center">
                            <span class="p-input-icon-left sup_search_box">
                                <i class="pi pi-search" />
                                <InputText v-model="allEmailTypeState.search" placeholder="Search Email Type" @keyup.enter="fetchAllEmailType(allEmailTypeState.activityStatus, 'search')"/>
                            </span>
                            <Calendar v-model="allEmailTypeState.dateRange" placeholder="DD.MM.YY" dateFormat="dd.mm.yy" selectionMode="range" class="sup_button p-ml-2" inputClass="p-inputtext" :manualInput="false" :showIcon="true" @date-select="allEmailTypeState.dateRange[1] != null ? fetchAllEmailType(allEmailTypeState.activityStatus, 'dateRange') : ''" plceholder="abc" />
                            <Button v-if="allEmailTypeState.search !== null || allEmailTypeState.dateRange !== null" icon="pi pi-refresh" class="p-button-sm p-button-dark sup_search_clear p-ml-2" @click="fetchAllEmailType(allEmailTypeState.activityStatus, 'resetFilters')"/>
                        </div>
                    </div>
                </template>
                <template #empty>
                    No Email Type found...
                </template>
                <Column field="type" header="Type" :sortable="true">
                    <template #body="slotProps">
                        <strong>{{underscoreTostring(slotProps.data.type)}}</strong>
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
                        <Button v-if="slotProps.data.deletedAt === null" type="button" icon="pi pi-pencil" class="p-button-sm p-button-rounded p-button-primary p-mr-1" @click="editEmailType(slotProps.data)" v-tooltip="'Edit Email Type'" />
                        <Button v-if="slotProps.data.deletedAt === null" type="button" icon="pi pi-ban" class="p-button-sm p-button-rounded p-button-danger p-mr-1" v-tooltip="'Deactivate'" @click="confirmationModalfn(slotProps.data, 'delete')" />
                        <Button v-if="slotProps.data.deletedAt !== null" icon="pi pi-undo" class="p-button-secondary p-button-rounded p-button-sm p-mr-1"  v-tooltip="'Restore Language'" @click="confirmationModalfn(slotProps.data, 'restore')" />
                        <Button v-if="slotProps.data.deletedAt !== null" icon="pi pi-trash" class="p-button-danger p-button-rounded p-button-sm"  v-tooltip="'Delete Language'" />
                    </template>
                </Column>
            </DataTable>
            <!--- Show Email Type End --->
        </div>
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
        <!--- Add Email Type Modal Start --->
        <Dialog header="Add New Email Type" v-model:visible="typeModal.addType" :modal="true" :style="{width: '600px'}" @hide="close()">
            <form class="sup_template_add" @submit.prevent="createEmailType()">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-12">
                        <label for="temp_subject">Email Type*</label>
                        <InputText v-model="addEditType.type" id="temp_subject" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditType.typeError">Subject is not available.</small>
                    </div>
                </div>
                <div class="p-fluid p-d-flex sup_submit_wrap">
                    <Button type="submit" label="Add" class="btn-primary sup_submit" />
                </div>
                <div :class="['sup_form_massage p-mt-3', addEditType.addStatus === 200 ? 'success' : 'error']" v-if="addEditType.addStatus !== ''">{{addEditType.addMessage}}</div >
            </form>
        </Dialog>
        <!--- Add Email Type Modal End --->
        <!--- Edit Email Type Modal Start --->
        <Dialog header="Edit Email Type" v-model:visible="typeModal.editType" :modal="true" :style="{width: '600px'}" @hide="close()">
            <form class="sup_template_add" @submit.prevent="updateEmailType(typeModal.editData.uuid)">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-12">
                        <label for="temp_subject">Email Type*</label>
                        <InputText v-model="addEditType.type" id="temp_subject" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditType.typeError">Subject is not available.</small>
                    </div>
                </div>
                <div class="p-fluid p-d-flex sup_submit_wrap">
                    <Button type="submit" label="Update" class="btn-primary sup_submit" />
                </div>
                <div :class="['sup_form_massage p-mt-3', allEmailTypeState.editStatus === 200 ? 'success' : 'error']" v-if="allEmailTypeState.editStatus !== ''">{{allEmailTypeState.editMessage}}</div >
            </form>
        </Dialog>
        <!--- Edit Email Type Modal End --->
    </div>
</template>

<script>
import { onBeforeMount, reactive } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { adminEmailType } from '../../../../config/appUrls';
import { apiKey } from "../../../../config/constant";
import userLogout from '../../../../helper/userLogout/userLogout';
import { formatDate, usFormatDate, underscoreTostring } from "../../../../helper/utility/utility";

export default {
    name: "EmailType",
    setup(){
        //Store call
        let store = useStore();

        //Fetch and filtring data initial state
        const allEmailTypeState = reactive({
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

        //Active-deactive confimation state
        const confirmationModal = reactive({
            modalState: false,
            modaldata: '',
        });

        const typeModal = reactive({
            addType: false,
            editType: false,
            editData: ''
        })

        const addEditType = ({
            type: '',
            typeError: false,
        })

        //Before component mount required function invoke
        onBeforeMount(async () => {
            fetchAllEmailType('active');
        });

        //Fetch All Email type
        const fetchAllEmailType = async(status, activity) => {
            let date = null;
            if(activity === 'typeStatus'){
                allEmailTypeState.activityStatus = status === 'active' ? 'de-active' : 'active' ;
            }

            if(activity === 'resetFilters'){
                allEmailTypeState.search = null;
                allEmailTypeState.dateRange = null;
            }

            if (activity === 'dateRange') {
                date = formatDate(allEmailTypeState.dateRange[0]) + ' ' + formatDate(allEmailTypeState.dateRange[1]);
            }

            try{
                allEmailTypeState.loading = !allEmailTypeState.loading;
                const response = await axios.get(adminEmailType, {
                    params: {
                        status: allEmailTypeState.activityStatus,
                        search: allEmailTypeState.search,
                        filterDt: date
                    },
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.adminAuthToken
                    }
                })
                allEmailTypeState.data = response.data.data.emailtype;
                allEmailTypeState.total = response.data.data.total;
                allEmailTypeState.loading = !allEmailTypeState.loading;
            } catch(err){
                if(err.response.status === 403 || store.getters.adminAuthToken === '' ){
                    userLogout();
                } else {
                    console.log('error', err);
                }
            }
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
                    url: adminEmailType,
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
                fetchAllEmailType('active');
            } catch(err){
                console.log(err);
            }
        }

        //Create New Email Type
        const createEmailType = async() => {
            if (addEditType.type === "") {
                addEditType.typeError = true;
            } else {
                addEditType.typeError = false;
            }

            if (!addEditType.typeError) {
                try{
                    const options = {
                        method: 'post',
                        url: adminEmailType,
                        data: JSON.stringify({
                            type: addEditType.type,
                        }),
                        headers: {'Content-Type': 'application/json', 'apiKey': apiKey, 'token': store.getters.adminAuthToken},
                        transformRequest: [(data) => {
                            // transform the data
                            return data;
                        }]
                    };
                    let response = await axios(options);
                    
                    if(response.status === 200) {
                        allEmailTypeState.addStatus = response.data.status;
                        allEmailTypeState.addMessage = response.data.data;
                        typeModal.addType = false;
                        addEditType.type = "";
                        fetchAllEmailType('active');
                    }
                } catch(err){
                    allEmailTypeState.addStatus = err.response.data.status;
                    allEmailTypeState.addMessage = err.response.data.message;
                }
            }
        }

        //Edit Email type data set
        const editEmailType = async(slotData) => {
            typeModal.editType = true;
            typeModal.editData = slotData;
            addEditType.type = slotData.type
        }

        //Update Email type
        const updateEmailType = async(uuid) => {
            if (addEditType.type === "") {
                addEditType.typeError = true;
            } else {
                addEditType.typeError = false;
            }

            if (!addEditType.typeError) {
                try{
                    const options = {
                        method: 'put',
                        url: adminEmailType,
                        params: {
                            uuid: uuid
                        },
                        data: JSON.stringify({
                            type: addEditType.type,
                        }),
                        headers: {'Content-Type': 'application/json', 'apiKey': apiKey, 'token': store.getters.adminAuthToken},
                        transformRequest: [(data) => {
                            // transform the data
                            return data;
                        }]
                    };
                    const response = await axios(options);
                    allEmailTypeState.editStatus = response.data.status;
                    allEmailTypeState.editMessage = response.data.message;
                    fetchAllEmailType('active');
                } catch(err){
                    allEmailTypeState.editStatus = err.response.data.status;
                    allEmailTypeState.editMessage = err.response.data.message;
                }
            }
        }

        //Modal close data reset
        const close = () => {
            addEditType.type = '';
            allEmailTypeState.addStatus = "";
            allEmailTypeState.addMessage = "";
            allEmailTypeState.editStatus = "";
            allEmailTypeState.editMessage = "";
        }

        return{
            allEmailTypeState,
            confirmationModal,
            addEditType,
            typeModal,
            fetchAllEmailType,
            usFormatDate,
            confirmationModalfn,
            deleteAndRestoreEmailType,
            createEmailType,
            underscoreTostring,
            editEmailType,
            updateEmailType,
            close
        }
    }
}
</script>

<style>

</style>