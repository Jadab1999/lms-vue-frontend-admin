<template>
    <div class="sup_content general-settings">
        <div class="sup_page_heading">
            <h2>Pdf Template</h2>
            <Button icon="pi pi-plus" class="p-button-sm p-button-rounded p-button-primary" v-tooltip="'Add New Type'" @click="PdfTemplateModal.addTemplate = true" />
        </div>
        <div class="sup_inner_content">
            <!--- Show Pdf Template Start --->
            <DataTable class="p-datatable" :paginator="true" :value="allPdfTemplateState.data" :rows="10" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Showing {currentPage} of {totalPages}" :rowsPerPageOptions="[10,20,50]" :rowHover="true" :loading="allPdfTemplateState.loading" responsiveLayout="scroll" removableSort :filters="filters">
                <template #loading>
                    Loading Pdf Template data. Please wait.
                </template>
                <template #header>
                    <div class="p-d-flex p-jc-between">
                        <div class="sup_list_action">
                            <Button :label="allPdfTemplateState.activityStatus === 'active' ? 'Deactive List': 'Active List'" :icon="['pi', allPdfTemplateState.activityStatus === 'active' ? 'pi-ban' : 'pi-check-circle']" :class="[allPdfTemplateState.activityStatus === 'active' ? 'p-button-danger' : 'p-button-primary', 'p-mr-2']" @click="fetchAllPdfTemplate(allPdfTemplateState.activityStatus, 'typeStatus')" />
                        </div>
                        <div class="p-d-flex p-align-center">
                            <span class="p-input-icon-left sup_search_box">
                                <i class="pi pi-search" />
                                <InputText v-model="allPdfTemplateState.search" placeholder="Search Pdf Template" @keyup.enter="fetchAllPdfTemplate(allPdfTemplateState.activityStatus, 'search')"/>
                            </span>
                            <Calendar v-model="allPdfTemplateState.dateRange" placeholder="DD.MM.YY" dateFormat="dd.mm.yy" selectionMode="range" class="sup_button p-ml-2" inputClass="p-inputtext" :manualInput="false" :showIcon="true" @date-select="allPdfTemplateState.dateRange[1] != null ? fetchAllPdfTemplate(allPdfTemplateState.activityStatus, 'dateRange') : ''" plceholder="abc" />
                            <Button v-if="allPdfTemplateState.search !== null || allPdfTemplateState.dateRange !== null" icon="pi pi-refresh" class="p-button-sm p-button-dark sup_search_clear p-ml-2" @click="fetchAllPdfTemplate(allPdfTemplateState.activityStatus, 'resetFilters')"/>
                        </div>
                    </div>
                </template>
                <template #empty>
                    No Pdf Template found...
                </template>
                <Column field="type" header="Type" :sortable="true" >
                    <template #body="slotProps">
                        <strong>{{slotProps.data.type}}</strong>
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
                        <Button v-if="slotProps.data.deletedAt === null" type="button" icon="pi pi-pencil" class="p-button-sm p-button-rounded p-button-primary p-mr-1" @click="editPdfTemplate(slotProps.data)" v-tooltip="'Edit Pdf Template'" />
                        <Button v-if="slotProps.data.deletedAt === null" type="button" icon="pi pi-ban" class="p-button-sm p-button-rounded p-button-danger p-mr-1" v-tooltip="'Deactivate'" @click="confirmationModalfn(slotProps.data, 'delete')" />
                        <Button v-if="slotProps.data.deletedAt !== null" icon="pi pi-undo" class="p-button-secondary p-button-rounded p-button-sm p-mr-1"  v-tooltip="'Restore Pdf Template'" @click="confirmationModalfn(slotProps.data, 'restore')" />
                        <Button v-if="slotProps.data.deletedAt !== null" icon="pi pi-trash" class="p-button-danger p-button-rounded p-button-sm"  v-tooltip="'Delete Pdf Template'" />
                    </template>
                </Column>
            </DataTable>
            <!--- Show Pdf Template End --->
        </div>
        <!--- Add Pdf Template Modal Start --->
        <Dialog header="Add New Pdf Tempalate" v-model:visible="PdfTemplateModal.addTemplate" :modal="true" :style="{width: '600px'}" @hide="close()">
            <form class="sup_template_add" @submit.prevent="createPdfTemplate()">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="temp_type">Pdf type*</label>
                        <InputText v-model="addEditTemplate.type" id="temp_type" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditTemplate.typeEmpty">type is not available.</small>
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-12">
                        <label for="l_voice">Pdf Content*</label>
                        <Editor id="editor" v-model="addEditTemplate.content" editorStyle="height: 200px"/>
                        <small class="p-invalid sup_text_danger" v-if="addEditTemplate.contentEmpty">Selact a Voice Support.</small>
                    </div>
                </div>
                <div class="p-fluid p-d-flex sup_submit_wrap">
                    <Button type="submit" label="Add" class="btn-primary sup_submit" />
                </div>
                <div :class="['sup_form_massage p-mt-3', allPdfTemplateState.addStatus === 200 ? 'success' : 'error']" v-if="allPdfTemplateState.addStatus !== ''">{{allPdfTemplateState.addMessage}}</div >
            </form>
        </Dialog>
        <!--- Add Pdf Template Modal End --->
        <!--- Edit Pdf Template Modal Start --->
        <Dialog header="Edit Pdf Tempalate" v-model:visible="PdfTemplateModal.editTemplate" :modal="true" :style="{width: '600px'}" @hide="close()">
            <form class="sup_template_edit" @submit.prevent="updatePdfTemplate(PdfTemplateModal.editData.uuid)">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="temp_type">Pdf type</label>
                        <InputText v-model="addEditTemplate.type" id="temp_type" type="text" readonly />
                        <small class="p-invalid sup_text_danger" v-if="addEditTemplate.typeEmpty">type is not available or in a wrong fromat.</small>
                    </div>
                    <div class="p-field p-col-6">
                        <label for="temp_type">Pdf Template Status</label>
                        <InputText v-model="addEditTemplate.status" id="temp_type" type="text" readonly />
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-12">
                        <label for="l_voice">Pdf Content</label>
                        <Editor v-model="addEditTemplate.content" editorStyle="height: 200px"/>
                        <small class="p-invalid sup_text_danger" v-if="addEditTemplate.contentEmpty">Selact a Voice Support.</small>
                    </div>
                </div>
                <div class="p-fluid p-d-flex sup_submit_wrap">
                    <Button type="submit" label="Update" class="btn-primary sup_submit" />
                </div>
                <div :class="['sup_form_massage p-mt-3', allPdfTemplateState.editStatus === 200 ? 'success' : 'error']" v-if="allPdfTemplateState.editStatus !== ''">{{allPdfTemplateState.editMessage}}</div >
            </form>
        </Dialog>
        <!--- Edit Pdf Template Modal End --->
        <!--- Deactive/Restore Confirmation Start --->
        <Dialog header="Confirmation" v-model:visible="confirmationModal.modalState" :style="{width: '350px'}" :modal="true">
            <div class="confirmation-content p-d-flex p-items-center">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 1.6rem" />
                <span>Do you want to proceed?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="confirmationModal.modalState = false" class="p-button-text" autofocus/>
                <Button label="Yes" icon="pi pi-check" @click="deleteAndRestorePdfType(confirmationModal.modaldata.data, confirmationModal.modaldata.type), confirmationModal.modalState = false" class="p-button-primary" />
            </template>
        </Dialog>
        <!--- Deactive/Restore Confirmation End --->
    </div>
</template>

<script>
import { onBeforeMount, reactive } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { adminPdfTemplates } from '../../../../config/appUrls';
import { apiKey } from "../../../../config/constant";
import userLogout from '../../../../helper/userLogout/userLogout';
import { formatDate, usFormatDate } from "../../../../helper/utility/utility";

export default {
    name: "PdfTemplate",
    setup(){
        //Store call
        let store = useStore();

        //Fetch and filtring data initial state
        const allPdfTemplateState = reactive({
            data: null,
            total: null,
            status: null,
            loading: false,
            activityStatus: 'all',
            search: null,
            dateRange: null,
            addStatus: '',
            addMessage: '',
            editStatus: '',
            editMessage: ''
        });

        const PdfTemplateModal = reactive({
            addTemplate: false,
            editTemplate: false,
            editData: ''
        });

        const addEditTemplate = reactive({
            type: '',
            typeEmpty: false,
            content: '',
            contentEmpty: false,
            status : ''
        });

        //Active-deactive confimation state
        const confirmationModal = reactive({
            modalState: false,
            modaldata: '',
        });

        //Before component mount required function invoke
        onBeforeMount(async () => {
            fetchAllPdfTemplate('active');
        });

        //Fetch All Pdf type
        const fetchAllPdfTemplate = async(status, activity) => {
            let date = null;
            if(activity === 'typeStatus'){
                allPdfTemplateState.activityStatus = status === 'active' ? 'de-active' : 'active' ;
            }

            if(activity === 'resetFilters'){
                allPdfTemplateState.search = null;
                allPdfTemplateState.dateRange = null;
            }

            if (activity === 'dateRange') {
                date = formatDate(allPdfTemplateState.dateRange[0]) + ' ' + formatDate(allPdfTemplateState.dateRange[1]);
            }

            try{
                allPdfTemplateState.loading = !allPdfTemplateState.loading;
                const response = await axios.get(adminPdfTemplates, {
                    params: {
                        status: allPdfTemplateState.activityStatus,
                        search: allPdfTemplateState.search,
                        filterDt: date
                    },
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.adminAuthToken
                    }
                })
                allPdfTemplateState.data = response.data.data.pdflayouts;
                allPdfTemplateState.total = response.data.data.total;
                allPdfTemplateState.loading = !allPdfTemplateState.loading;
            } catch(err){
                if(err.response.status === 403 || store.getters.adminAuthToken === '' ){
                    userLogout();
                } else {
                    console.log('error', err);
                }
            }
        }

        // const fetchAllPdfType = async() => {
        //     try{
        //         const response = await axios.get(adminPdfType, {
        //             headers: {
        //                 apiKey: apiKey,
        //                 token: store.getters.adminAuthToken
        //             }
        //         })
        //         console.log("Pdf type ->", response.data.data);
        //         for(let i =0; i < response.data.data.Pdftype.length; i++){
        //             PdfType.push({
        //                 name: response.data.data.Pdftype[i].type,
        //                 value: response.data.data.Pdftype[i].uuid,
        //             })
        //         }
                
        //     } catch(err){
        //         console.error('error', err);
        //     }
        // }

        const createPdfTemplate = async() => {
            let isvalidate = templateFormValidation();

            if (isvalidate) {
                try{
                    const options = {
                        method: 'post',
                        url: adminPdfTemplates,
                        data: JSON.stringify({
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
                    allPdfTemplateState.addStatus = response.data.status;
                    allPdfTemplateState.addMessage = response.data.message;
                    resetTemplateForm();
                    fetchAllPdfTemplate('active');
                } catch(err){
                    allPdfTemplateState.addStatus = err.response.data.status;
                    allPdfTemplateState.addMessage = err.response.data.message;
                }
            }
        }

        const editPdfTemplate = (slotData) => {
            PdfTemplateModal.editTemplate = true;
            PdfTemplateModal.editData = slotData;
            addEditTemplate.type = slotData.type;
            addEditTemplate.content = slotData.content;
            addEditTemplate.status = slotData.status ? 'Active' : 'In-Active'
        }
        
        const updatePdfTemplate = async(uuid) =>{
            let isvalidate = templateFormValidation();
            if (isvalidate) {
                try{
                    const options = {
                        method: 'put',
                        url: adminPdfTemplates,
                        params: {
                            uuid: uuid
                        },
                        data: JSON.stringify({
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
                    allPdfTemplateState.editStatus = response.data.status;
                    allPdfTemplateState.editMessage = response.data.message;
                    fetchAllPdfTemplate('active');
                } catch(err){
                    allPdfTemplateState.editStatus = err.response.data.status;
                    allPdfTemplateState.editMessage = err.response.data.message;
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

        const addEditvalidationError = reactive({
            typeEmpty: false,
            typeinvalid: false
        });

        const templateFormValidation = () => {
            let hasSpace = addEditTemplate.type.indexOf(' ') >= 0;
            if (!addEditTemplate.type) {
                addEditvalidationError.typeEmpty = true;
            } else if (addEditTemplate.type && hasSpace){
                addEditvalidationError.typeEmpty = false;
                addEditvalidationError.typeinvalid = true;
            } 
            else {
                addEditvalidationError.typeError = false;
            }
            // if(addEditTemplate.type === ''){
            //     addEditTemplate.typeEmpty = true;
            // } else {
            //     addEditTemplate.typeEmpty = false;
            // }

            if(addEditTemplate.content === ''){
                addEditTemplate.contentEmpty = true;
            } else {
                addEditTemplate.contentEmpty = false;
            }

            if (!addEditvalidationError.typeError && !addEditTemplate.contentEmpty) {
                return true;
            } else {
                return false;
            }
        }

        const resetTemplateForm = () => {
            addEditTemplate.type = '';
            addEditTemplate.content = '';
        }

        //Delete-restore Pdf type confirmation modal
        const confirmationModalfn = (sloteData, load) => {
            confirmationModal.modalState = true;
            confirmationModal.modaldata = {
                data: sloteData,
                type: load
            }
        }

        //Delete-restore Pdf type HTTP call
        const deleteAndRestorePdfType = async (slotData, methodType) => {
            try{
                const options = {
                    method: methodType === 'delete' ? 'delete' : 'patch',
                    url: adminPdfTemplates,
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
                fetchAllPdfTemplate('active');
            } catch(err){
                console.log(err);
            }
        }

        return{
            allPdfTemplateState,
            PdfTemplateModal,
            addEditTemplate,
            confirmationModal,
            fetchAllPdfTemplate,
            createPdfTemplate,
            usFormatDate,
            editPdfTemplate,
            updatePdfTemplate,
            close,
            confirmationModalfn,
            deleteAndRestorePdfType
        }
    }
}
</script>

<style>

</style>