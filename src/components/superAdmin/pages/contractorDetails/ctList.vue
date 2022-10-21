<template>
    <div class="sup_content customer-list">
        <div class="sup_page_heading">
            <h2>Customer Management</h2>
            <Button v-if="customerAdd" icon="pi pi-plus" class="p-button-sm p-button-rounded p-button-primary" v-tooltip="'Add Customer'" @click="ctModal.addCustomer = true" />
        </div>
        <div class="sup_inner_content">
            <!--- Show Customer Table Start --->
            <DataTable class="p-datatable" :paginator="true" :value="allCtData.data" :rows="10" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Showing {currentPage} of {totalPages}" :rowsPerPageOptions="[10,20,50]" :rowHover="true" :loading="allCtData.loading" responsiveLayout="scroll" removableSort :filters="filters">
                <template #loading>
                    Loading customers data. Please wait.
                </template>
                <template #header>
                    <div class="p-d-flex p-jc-between">
                        <div class="sup_list_action">
                            <Button v-if="customerDeactivateList" :label="allCtData.activityStatus === 'active' ? 'Deactive List': 'Active List'" :icon="['pi', allCtData.activityStatus === 'active' ? 'pi-ban' : 'pi-check-circle']" :class="[allCtData.activityStatus === 'active' ? 'p-button-danger' : 'p-button-primary', 'p-mr-2']" @click="fetchAllCsutomer(allCtData.activityStatus, 'customerStatus')" />
                        </div>
                        <div class="p-d-flex p-align-center">
                            <span class="p-input-icon-left sup_search_box">
                                <i class="pi pi-search" />
                                <InputText v-model="allCtData.search" placeholder="Search Customer" @keyup.enter="fetchAllCsutomer(allCtData.activityStatus, 'search')"/>
                            </span>
                            <Calendar v-model="allCtData.dateRange" placeholder="DD.MM.YY" dateFormat="dd.mm.yy" selectionMode="range" class="sup_button p-ml-2" inputClass="p-inputtext" :manualInput="false" :showIcon="true" @date-select="allCtData.dateRange[1] != null ? fetchAllCsutomer(allCtData.activityStatus, 'dateRange') : ''" plceholder="abc" />
                            <Button v-if="allCtData.search !== null || allCtData.dateRange !== null" icon="pi pi-refresh" class="p-button-sm p-button-dark sup_search_clear p-ml-2" @click="fetchAllCsutomer(allCtData.activityStatus, 'resetFilters')"/>
                            <SplitButton v-if="customerListExport" label="Export" icon="pi pi-external-link" class="p-button-secondary p-ml-2" :model="exportType"></SplitButton>
                        </div>
                    </div>
                </template>
                <template #empty>
                    No customers found.
                </template>
                <Column field="name" header="Name" headerStyle="width: 12rem" :sortable="true"></Column>

                <Column field="email" header="Email" headerStyle="width: 17rem" :sortable="true"></Column>

                <Column field="city" header="City" :sortable="true"></Column>

                <Column field="state" header="State">
                    <template #body="slotProps">
                        {{slotProps.data.State.name}}
                    </template>
                </Column>

                <Column field="country" header="Country">
                    <template #body="slotProps">
                        {{slotProps.data.Country.name}}
                    </template>
                </Column>

                <Column field="createdAt" header="Created On" headerStyle="width: 12rem" :sortable="true">
                    <template #body="slotProps">
                        <!-- {{usFormatDate(slotProps.data.createdAt.split("T")[0])}} {{slotProps.data.createdAt.split("T")[1].split(".")[0]}} -->
                        {{usFormatDate(slotProps.data.createdAt)}}
                    </template>
                </Column>

                <Column field="action" header="Actions">
                    <template #body="slotProps">
                        <Button type="button" icon="pi pi-eye" class="p-button-sm p-button-rounded p-button-dark p-mr-1" @click="viewEdit(slotProps.data, 'viewCustomer')" v-tooltip="'View More'" />
                        <Button v-if="customerEdit ? slotProps.data.status : false" type="button" icon="pi pi-pencil" class="p-button-sm p-button-rounded p-button-primary p-mr-1" @click="viewEdit(slotProps.data, 'editCustomer')" v-tooltip="'Edit'" />
                        <Button v-if="customerDeactivate ? slotProps.data.status : false" type="button" icon="pi pi-ban" class="p-button-sm p-button-rounded p-button-danger p-mr-1" v-tooltip="'Deactivate'" @click="confimationModal(slotProps.data, 'delete')" />
                        <Button v-if="!slotProps.data.status" icon="pi pi-undo" class="p-button-secondary p-button-rounded p-button-sm p-mr-1"  v-tooltip="'Restore Customer'" @click="confimationModal(slotProps.data, 'restore')" />
                        <Button v-if="!slotProps.data.status" icon="pi pi-trash" class="p-button-danger p-button-rounded p-button-sm"  v-tooltip="'Delete Customer'" />
                        <!-- Respective customer website list route action start -->
                        <Button v-if="customerViewWebsite ? slotProps.data.status : false" icon="pi pi-globe" class="p-button-warning p-button-rounded p-button-sm" v-tooltip.left="'Website List'" @click="$router.push({ name: 'SuperAdminWebsiteList', params: {id: slotProps.data.uuid} })" />
                        <!-- Respective customer website list route action end -->
                    </template>
                </Column>
            </DataTable>
            <!--- Show Customer Table End --->
        </div>
        <!--- Add Customer Modal Start --->
        <Dialog header="Add New Customer" v-model:visible="ctModal.addCustomer" :modal="true" :style="{width: '600px'}" @hide="closeModal()">
            <form class="sup_customer_add" @submit.prevent="createContractors()">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_name">Name<span class="text-danger">*</span></label>
                        <InputText v-model="addeditContractors.name" id="u_name" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.nameEmpty">Name is not available.</small>
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_email">Email Address<span class="text-danger">*</span></label>
                        <InputText v-model="addeditContractors.email" id="u_email" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.emailEmpty">Email is not available.</small>
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.emailInvalid">Email is not valid.</small>
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_mobile">Mobile<span class="text-danger">*</span></label>
                        <InputText v-model="addeditContractors.phone" id="u_mobile" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.mobileEmpty">Mobile is not available.</small>
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.mobileInvalid">Mobile is not valid.</small>
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_company">Company<span class="text-danger">*</span></label>
                        <InputText v-model="addeditContractors.company" id="u_company" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.companyEmpty">Company is not available.</small>
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_country">Country<span class="text-danger">*</span></label>
                        <Dropdown v-model="addeditContractors.country" :options="allLocationDtData.country" id="u_country" optionLabel="name" optionValue="uuid" placeholder="Select a Country" @change="fetchLocation('countryOnchange')" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.countryEmpty">Selact a Country.</small>
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_state">State<span class="text-danger">*</span></label>
                        <Dropdown v-model="addeditContractors.state" :options="allLocationDtData.state" id="u_state" optionLabel="name" optionValue="uuid" placeholder="Select a State" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.stateEmpty">Selact a State.</small>
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_city">City</label>
                        <InputText v-model="addeditContractors.city" id="u_city" type="text" />
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_zipcode">Zipcode</label>
                        <InputText v-model="addeditContractors.zipCode" id="u_zipcode" type="text" />
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_intro">Intro</label>
                        <InputText v-model="addeditContractors.intro" id="u_intro" type="text" />
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_profile">Profile</label>
                        <InputText v-model="addeditContractors.profile" id="u_profile" type="text" />
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_password">Password<span class="text-danger">*</span></label>
                        <InputText v-model="addeditContractors.password" id="u_password" type="password" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.PasswordEmpty">Password is not available.</small>
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_confirm_password">Confirm Password<span class="text-danger">*</span></label>
                        <InputText v-model="addeditContractors.confirmPassword" id="u_confirm_password" type="password" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.ConfrmPasswordEmpty || addEditvalidationError.userPasswordMissmatch">Password does not match.</small>
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_address1">Address1</label>
                        <InputText v-model="addeditContractors.address1" id="u_address1" type="text" />
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_address2">Address2</label>
                        <InputText v-model="addeditContractors.address2" id="u_address2" type="text" />
                    </div>
                </div>
                <div class="p-fluid p-d-flex sup_submit_wrap">
                    <Button type="submit" label="Add" class="btn-primary sup_submit" />
                </div>
                <div :class="['sup_form_massage p-mt-3', allCtData.addStatus === 200 ? 'success' : 'error']" v-if="allCtData.addStatus !== ''">{{allCtData.addMessage}}</div >
            </form>
        </Dialog>
        <!--- Add Customer Modal End --->
        <!--- Edit Customer Modal Start --->
        <Dialog v-model:visible="ctModal.editCustomer" :modal="true" :style="{width: '600px'}" @hide="closeModal()">
            <template #header>
                <span class="p-dialog-title">Edit {{editModaldata.value.name}}</span>
            </template>
            <form class="sup_user_edit" @submit.prevent="updateUser(editModaldata.value.uuid)">
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_name">Full Name*</label>
                        <InputText v-model="addeditContractors.name" id="u_name" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.userNameEmpty">Name is not available.</small>
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_email">Email Address*</label>
                        <InputText v-model="addeditContractors.email" id="u_email" type="text" readonly />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.userEmailEmpty">Email is not available.</small>
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.userEmailInvalid">Email is not valid.</small>
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_mobile">Mobile Number*</label>
                        <InputText v-model="addeditContractors.phone" id="u_mobile" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.userMobileEmpty">Mobile Number is not available.</small>
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.userMobileInvalid">Mobile Number is not valid.</small>
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_company">Company*</label>
                        <InputText v-model="addeditContractors.company" id="u_company" type="text" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.companyEmpty">Company is not available.</small>
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_intro">Intro</label>
                        <InputText v-model="addeditContractors.intro" id="u_intro" type="text" />
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_profile">Profile</label>
                        <InputText v-model="addeditContractors.profile" id="u_profile" type="text" />
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_country">Country*</label>
                        <Dropdown v-model="addeditContractors.country" :options="allLocationDtData.country" id="u_country" optionLabel="name" optionValue="uuid" placeholder="Select a Country" @change="fetchLocation('onchange')" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.userCountryEmpty">Selact a Country.</small>
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_state">State*</label>
                        <Dropdown v-model="addeditContractors.state" :options="allLocationDtData.state" id="u_state" optionLabel="name" optionValue="uuid" placeholder="Select a State" />
                        <small class="p-invalid sup_text_danger" v-if="addEditvalidationError.userStateEmpty">Selact a State.</small>
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_city">City</label>
                        <InputText v-model="addeditContractors.city" id="u_city" type="text" />
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_zip">ZipCode</label>
                        <InputText v-model="addeditContractors.zipCode" id="u_zip" type="text" />
                    </div>
                </div>
                <div class="p-fluid p-formgrid p-grid">
                    <div class="p-field p-col-6">
                        <label for="u_address_1">Address 1</label>
                        <InputText v-model="addeditContractors.address1" id="u_address_1" type="text" />
                    </div>
                    <div class="p-field p-col-6">
                        <label for="u_address_2">Address 2</label>
                        <InputText v-model="addeditContractors.address2" id="u_address_2" type="text" />
                    </div>
                </div>
                <div class="p-fluid p-d-flex sup_submit_wrap">
                    <Button type="submit" label="Update" class="btn-primary sup_submit" />
                    <!-- <Button type="button" icon="pi pi-ban" class="p-button-sm p-button-rounded p-button-danger sup_deactive p-ml-3" v-tooltip="'Deactivate Customer'" /> -->
                </div>
                <div :class="['sup_form_massage p-mt-3', allCtData.editStatus === 200 ? 'success' : 'error']" v-if="allCtData.editStatus !== ''">{{'User has been updated ' + allCtData.editMessage}}</div >
            </form>
        </Dialog>
        <!--- Edit Customer Modal End --->
        <!--- View Customer Modal Start --->
        <Dialog v-model:visible="ctModal.viewCustomer" class="sub_customer_view" :modal="true" :style="{width: '600px'}">
            <template #header>
                <div class="sup_customer_highlight">
                    <div class="sup_customer_icon">
                        <figure>
                            <img :src="imageUrl + '/avatar.png'" alt="">
                        </figure>
                    </div>
                    <h3>{{editModaldata.value.name}}</h3>
                </div>
            </template>
            <div class="sup_dialog_content">
                <div class="sup_customer_info">
                    <ul>
                        <li><i class="pi pi-user"></i> {{editModaldata.value.name}}</li>
                        <li><i class="pi pi-envelope"></i> {{editModaldata.value.email}}</li>
                        <li><i class="pi pi-phone"></i> {{editModaldata.value.mobile}}</li>
                        <li><i class="pi pi-briefcase"></i> {{editModaldata.value.company}}</li>
                        <li><i class="pi pi-map"></i> {{editModaldata.value.addressOne}}{{editModaldata.value.addressTwo}}, {{editModaldata.value.zipcode}}</li>
                        <li><i class="pi pi-map-marker"></i> {{editModaldata.value.stateName}}, {{editModaldata.value.countryName}}</li>
                        <li><i class="pi pi-star"></i> {{editModaldata.value.intro}}</li>
                        <li><i class="pi pi-clock"></i> last Login at {{editModaldata.value.lastLogin.split("T")[0]}} {{editModaldata.value.lastLogin.split("T")[1].split(".")[0]}}</li>
                    </ul>
                    
                </div>
            </div>
            <template #footer>
                <Button icon="pi pi-pencil" label="Edit Customer" class="p-button-primary p-button-sm sup_customer_edit_btn" @click="ctModal.viewCustomer = false;viewEdit(editModaldata.value, 'editCustomer')" />
                <Button label="Deactivate" icon="pi pi-ban" class="p-button-danger p-button-sm" />
                <Button label="Cancel" icon="pi pi-times" class="p-button-plain p-button-sm p-button-text" @click="ctModal.viewCustomer = false" autofocus />
            </template>
        </Dialog>
        <!--- View Customer Modal End --->
        <!--- Deactive/Restore Confirmation Start --->
        <Dialog header="Confirmation" v-model:visible="confirmationModal.modalState" :style="{width: '350px'}" :modal="true">
            <div class="confirmation-content p-d-flex p-items-center">
                <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 1.6rem" />
                <span>Do you want to proceed?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="confirmationModal.modalState = false" class="p-button-text" autofocus/>
                <Button label="Yes" icon="pi pi-check" @click="deleteAndRestoreCustomer(confirmationModal.modaldata.data, confirmationModal.modaldata.load), confirmationModal.modalState = false" class="p-button-primary" />
            </template>
        </Dialog>
        <!--- Deactive/Restore Confirmation End --->
        <!--- Deactive Alert Start --->
        <Dialog header="Confirmation" v-model:visible="confirmationModal.alertState" :style="{width: '500px'}" :modal="true">
            <div class="confirmation-content confirmation-warning p-d-flex p-items-center">
                <i class="pi pi-exclamation-triangle p-mr-3" />
                <span>{{confirmationModal.alertMsg}}</span>
            </div>
            <template #footer>
                <Button label="See Websites" icon="pi pi-globe" @click="$router.push({ name: 'SuperAdminWebsiteList', params: {id: confirmationModal.uuid} })" class="p-button-warning" />
                <Button label="No" icon="pi pi-times" @click="confirmationModal.alertState = false" class="p-button-text" autofocus/>
            </template>
        </Dialog>
        <!--- Deactive Alert End --->
    </div>
</template>

<script>
import { allContractors, allLocationDt, contractorById, editContractors, deleteContractors, addContractor } from '../../../../config/appUrls';
import { apiKey } from "../../../../config/constant";
import userLogout from '../../../../helper/userLogout/userLogout';
import { imageUrl } from '../../../../config/constant';
import { validateEmail, validateMobile, validatePassword, matchPassword } from "../../../../helper/validationProcess/ValidationProcess";
import { currentMenuUuid } from '../../../../helper/pageActions/pageActions';
import { formatDate, usFormatDate } from '../../../../helper/utility/utility';
import axios from "axios";
import { useStore } from 'vuex';
import { useRoute } from "vue-router";
import { reactive, onBeforeMount, computed } from 'vue';
// const FileSaver = require('file-saver');

export default({
    setup() {
        //Vuex store data call fucntion
        const store = useStore();

        //Route call
        const route = useRoute();

        console.log('customer id', route.params.id);

        //User privilages role, UUID and actions store
        const pagePrivilages = reactive({
            userRole: '',
            uuid: '',
            actions: ''
        });

        //Customer initial data storing state
        const allCtData = reactive({
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
            editMessage: '',
        });

        //All modal open/close handling state
        const ctModal = reactive({
            addCustomer: false,
            editCustomer: false,
            viewCustomer: false
        });

        //ADD and EDIT Customer input binding state
        const addeditContractors = reactive ({
            name: '',
            email: '',
            phone: '',
            company: '',
            city: '',
            zipCode: '',
            address1: '',
            address2: '',
            country: '',
            state: '',
            intro: '',
            profile: '',
            password: '',
            confirmPassword: ''
        });

        //Form validation error state
        const addEditvalidationError = reactive({
            nameEmpty: false,
            emailEmpty: false,
            emailInvalid: false,
            mobileEmpty: false,
            mobileInvalid: false,
            companyEmpty: false,
            countryEmpty: false,
            stateEmpty: false,
            PasswordEmpty: false,
            ConfrmPasswordEmpty: false,
            PasswordMissmatch: false,
        });
        
        //Edit Modal data state 
        const editModaldata = reactive({});

        //Location state
        const allLocationDtData = reactive({
            country: null,
            state: null,
            status: null,
        });

        //Export type
        // const exportType = reactive([
        //     {
        //         label: 'Excel',
        //         icon: 'pi pi-file-excel',
        //         command: () => {
        //             exportXL('excel');
        //         }
        //     },
        //     {
        //         label: 'PDF',
        //         icon: 'pi pi-file-pdf',
        //         command: () => {
        //             exportXL('pdf');
        //         }
        //     }
        // ]);

        //Delete/restore item corfirmation state
        const confirmationModal = reactive({
            modalState: false,
            modaldata: '',
            alertState: false,
            alertMsg: '',
            uuid: ''
        });

        
        //Coditional page action state update to show action conditionally
        const customerAdd = computed(() => pagePrivilages.userRole === 'systemAdministrator' ? true : pagePrivilages.actions.customermanagementAdd);
        const customerEdit = computed(() => pagePrivilages.userRole === 'systemAdministrator' ? true : pagePrivilages.actions.customermanagementEdit);
        const customerDeactivate = computed(() => pagePrivilages.userRole === 'systemAdministrator' ? true : pagePrivilages.actions.customermanagementDeactivate);
        const customerDeactivateList = computed(() => pagePrivilages.userRole === 'systemAdministrator' ? true : pagePrivilages.actions.customermanagementDeactivateList);
        const customerViewWebsite = computed(() => pagePrivilages.userRole === 'systemAdministrator' ? true : pagePrivilages.actions.customermanagementViewWebsite);
        const customerListExport = computed(() => pagePrivilages.userRole === 'systemAdministrator' ? true : pagePrivilages.actions.customermanagementExport);

        /**
         * Self calling fucntion on compement initiation
         */
        (async () => {
            let { userRole, menuActions } = await currentMenuUuid('CustomerManagement');
            pagePrivilages.userRole = userRole;
            pagePrivilages.actions = menuActions;
        })();

        /**
         * On component get mounted require functions call
         */
        onBeforeMount( async() => {
            fetchAllContractors();
            fetchLocation('intialLoad');
        });

        /**
         * Fetching all Customers from DB
         * intially fetching active Customers but this fucntion user can get deactive Customer and filter Customers by date and name
         * @param {customerStatus} getting customer list current state(ex: active/deactive)
         * @param {load} from where function calling
         */
        const fetchAllContractors = async (customerStatus, load) => {
            let date = null;
            //Toggle Customer status to fetch active/deactive role
            if(load === 'customerStatus'){
                allCtData.activityStatus = customerStatus === 'active' ? 'de-active' : 'active' ;
            }

            //To clear search and filter then fetch all data
            if(load === 'resetFilters'){
                allCtData.search = null;
                allCtData.dateRange = null;
            }

            //Filter date wise code
            if (load === 'dateRange') {
                date = formatDate(allCtData.dateRange[0]) + ' ' + formatDate(allCtData.dateRange[1]);
            }

            //API call start
            try{
                allCtData.loading = !allCtData.loading;
                const response = await axios.get( allContractors, {
                    params: {
                        status: allCtData.activityStatus,
                        search: allCtData.search,
                        filterDt: date
                    },
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.adminAuthToken
                    }, 
                });
                allCtData.data = response.data.data.users;
                allCtData.total = response.data.data.total;
                allCtData.loading = !allCtData.loading;
            } catch(err){
                if(err.response.status === 403 || store.getters.adminAuthToken === '' ){
                    userLogout();
                } else {
                    console.log('error', err);
                }
            }
        }

        /**
         * Fucntion is for add new customer and data pass to api
         * After API success calling customer list again by fetchAllContractors()
         * And reseting form value
         */
        const createContractors = async () => {
            const isValidate = fromValidation();
            if (isValidate) {
                try{
                    const response = await axios.post( addContractor,{
                        countryId: addeditContractors.country,
                        stateId: addeditContractors.state,
                        name: addeditContractors.name,
                        email: addeditContractors.email,
                        mobile: addeditContractors.phone,
                        company: addeditContractors.company,
                        city: addeditContractors.city,
                        addressOne: addeditContractors.address1,
                        addressTwo: addeditContractors.address2,
                        zipcode: addeditContractors.zipCode,
                        intro: addeditContractors.intro,
                        profile: addeditContractors.profile,
                        password: addeditContractors.password,
                    },{
                        headers: {
                            apiKey: apiKey,
                            token: store.getters.adminAuthToken
                        }, 
                    });
                    if(response.status === 200) {
                        allCtData.addStatus = response.data.status;
                        allCtData.addMessage = response.data.data;
                        fetchAllContractors();
                        addEditFormReset();
                    }
                } catch(err){
                    allCtData.addStatus = err.response.data.status;
                    allCtData.addMessage = err.response.data.message;
                }
            }
        }

        /**
         * On view and edit customer UI content update by respective customer data
         */
        const viewEdit = async (slotData, load) => {
            const response = await axios.get( contractorById, {
                params: {
                    uuid: slotData.uuid,
                }, 
                headers: {
                    apiKey: apiKey,
                    token: store.getters.adminAuthToken
                },
            });
            

            if (response.data.status === 200) {
                
                if (load === 'editCustomer') { //On edit every input data updation
                    ctModal.editCustomer = true;
                    editModaldata.value = slotData;
                    addeditContractors.name = response.data.data.name;
                    addeditContractors.email = response.data.data.email;
                    addeditContractors.email = response.data.data.email;
                    addeditContractors.phone = response.data.data.mobile;
                    addeditContractors.company = response.data.data.company;
                    addeditContractors.city = response.data.data.city;
                    addeditContractors.zipCode = response.data.data.zipcode;
                    addeditContractors.address1 = response.data.data.addressOne;
                    addeditContractors.address2 = response.data.data.addressTwo;
                    addeditContractors.country = response.data.data.countryId;
                    addeditContractors.state = response.data.data.stateId;
                    addeditContractors.role = response.data.data.roleId;
                    addeditContractors.intro = response.data.data.intro;
                    addeditContractors.profile = response.data.data.profile;

                    fetchLocation('onchange');

                } else { //On view full API data value store to a value
                    ctModal.viewCustomer = true;
                    editModaldata.value = response.data.data;
                }
                
            }
        }

        /**
         * Update edited customer data by this function
         * @{UUID} pass respective customer unique ID
         */
        const updateUser = async (uuid) => {
            
            try{
                const options = {
                    method: 'put',
                    url: editContractors,
                    params: {
                        uuid: uuid
                    },
                    data: JSON.stringify({
                        countryId: addeditContractors.country,
                        stateId: addeditContractors.state,
                        name: addeditContractors.name,
                        email: addeditContractors.email,
                        mobile: addeditContractors.phone,
                        company: addeditContractors.company,
                        city: addeditContractors.city,
                        addressOne: addeditContractors.address1,
                        addressTwo: addeditContractors.address2,
                        zipcode: addeditContractors.zipCode,
                        intro: addeditContractors.intro,
                        profile: addeditContractors.profile,
                    }),
                    headers: {'Content-Type': 'application/json', 'apiKey': apiKey, 'token': store.getters.adminAuthToken},
                    transformRequest: [(data) => {
                        // transform the data
                        return data;
                    }]
                };
                let response = await axios(options);
                allCtData.editStatus = response.data.status;
                allCtData.editMessage = response.data.message;
                fetchAllContractors('active');
            } catch(err){
                allCtData.editStatus = err.response.data.status;
                allCtData.editMessage = err.response.data.message;
            }
        }

        /**
         * Delete or Restore Customer
         * On success fetch all cutomer data again to update list
         */
        const deleteAndRestoreLabour = async (sloteData, type) => {
            try{
                const options = {
                    method: type === 'delete' ? 'delete' : 'patch',
                    url: deleteContractors,
                    params: {
                        uuid: sloteData.uuid
                    },
                    headers: {'Content-Type': 'application/json', 'apiKey': apiKey, 'token': store.getters.adminAuthToken},
                    transformRequest: [(data) => {
                        // transform the data
                        return data;
                    }]
                };
                await axios(options);
                fetchAllContractors('active');
            } catch(err){
                if (err.response.data.status === 400) {
                    confirmationModal.alertState = true;
                    //err.response.data.message
                    confirmationModal.alertMsg = 'Please Disable This Customer realted Websites Before Disabling The Customer.';
                    confirmationModal.uuid = sloteData.uuid;
                }
            }
        }

        /**
         * All add/edit form validation
         */
        const fromValidation = () => {
            const emailValid = validateEmail(addeditContractors.email);
            const mobileValid = validateMobile(addeditContractors.phone);

            if (!addeditContractors.name) {
                addEditvalidationError.nameEmpty = true;
            } else {
                addEditvalidationError.nameEmpty = false;
            }

            if (!emailValid.lValidation) {
                addEditvalidationError.emailEmpty = true;
            } else if (emailValid.lValidation && !emailValid.eValidation){
                addEditvalidationError.emailEmpty = false;
                addEditvalidationError.emailInvalid = true;
            } else {
                addEditvalidationError.emailEmpty = false;
                addEditvalidationError.emailInvalid = false;
            }

            if (!mobileValid.lValidation) {
                addEditvalidationError.mobileEmpty = true;
            } else if (mobileValid.lValidation && !mobileValid.mValidation){
                addEditvalidationError.mobileEmpty = false;
                addEditvalidationError.mobileInvalid = true;
            } else {
                addEditvalidationError.mobileEmpty = false;
                addEditvalidationError.mobileInvalid = false;
            }

            if (!addeditContractors.company) {
                addEditvalidationError.companyEmpty = true;
            } else {
                addEditvalidationError.companyEmpty = false;
            }

            if (!addeditContractors.country) {
                addEditvalidationError.countryEmpty = true;
            } else {
                addEditvalidationError.countryEmpty = false;
            }

            if (!addeditContractors.state) {
                addEditvalidationError.stateEmpty = true;
            } else {
                addEditvalidationError.stateEmpty = false;
            }

            if (!addeditContractors.country) {
                addEditvalidationError.CountryEmpty = true;
            } else {
                addEditvalidationError.CountryEmpty = false;
            }

            if (!addeditContractors.state) {
                addEditvalidationError.StateEmpty = true;
            } else {
                addEditvalidationError.StateEmpty = false;
            }

            if(!validatePassword(addeditContractors.password).lValidation){
                addEditvalidationError.PasswordEmpty = true;
            } else {
                addEditvalidationError.PasswordEmpty = false;
            }

            if(!validatePassword(addeditContractors.confirmPassword).lValidation){
                addEditvalidationError.ConfrmPasswordEmpty = true;
            } else {
                addEditvalidationError.ConfrmPasswordEmpty = false;
            }

            if(!matchPassword(addeditContractors.password, addeditContractors.confirmPassword)) {
                addEditvalidationError.PasswordMissmatch = true;
            }else {
                addEditvalidationError.PasswordMissmatch = false;
            }

            if (!addEditvalidationError.nameEmpty && !addEditvalidationError.mobileEmpty && !addEditvalidationError.mobileInvalid && !addEditvalidationError.emailEmpty && !addEditvalidationError.emailInvalid && !addEditvalidationError.companyEmpty && !addEditvalidationError.userPasswordMissmatch && !addEditvalidationError.StateEmpty && !addEditvalidationError.CountryEmpty) {
                return true;
            } else {
                return false;
            }
        }

        //Form reset
        const addEditFormReset = () => {
            addeditContractors.name = '';
            addeditContractors.email = '';
            addeditContractors.phone = '';
            addeditContractors.company = '';
            addeditContractors.city = '';
            addeditContractors.zipCode = '';
            addeditContractors.address1 = '';
            addeditContractors.address2 = '';
            addeditContractors.country = '';
            addeditContractors.state = '';
            addeditContractors.intro = '';
            addeditContractors.profile = '';
            addeditContractors.password = '';
            addeditContractors.confirmPassword = '';
        }

        /**
         * fetch country and state location dynamically
         */
        const fetchLocation = async(load) => {
            const response = await axios.get( allLocationDt, {
                params: {
                    uuid: addeditContractors.country,
                }, 
                headers: {
                    apiKey: apiKey,
                    token: store.getters.adminAuthToken
                },
            });
            
            if (response.data.status === 200) {
                //If condition for country and state segrigation
                if (load === 'intialLoad') {
                    allLocationDtData.country = response.data.data;
                } else {
                    allLocationDtData.state = response.data.data;
                }
            }
        }

        //All modal after close function call
        const closeModal = () => {
            addEditFormReset();
            allCtData.addStatus= '',
            allCtData.addMessage= '',
            allCtData.editStatus = '';
            allCtData.editMessage = '';
        }

        /**
         * Export customer list in PDF and Excell
         * Export can be happen by filtered customer or searched customer
         */
        // const exportXL = async(load) => {
        //     let date = null;
        //     if (load === 'excel') {
        //         try{
        //             if (allCtData.dateRange !== null) {
        //                 date = formatDate(allCtData.dateRange[0]) + ' ' + formatDate(allCtData.dateRange[1]);
        //             }
        //             const response = await axios.get( customerExport, {
        //                 responseType: 'arraybuffer',
        //                 params: {
        //                     status: allCtData.activityStatus,
        //                     search: allCtData.search,
        //                     filterDt: date,
        //                     exe: load
        //                 },headers: {
        //                     apiKey: apiKey,
        //                     token: store.getters.adminAuthToken
        //                 },
        //             });
        //             if(response.status === 200) {
        //                 const dirtyFileName = response.headers['content-disposition'];
        //                 const regex = /filename[^;=\n]*=(?:(\\?['"])(.*?)\1|(?:[^\s]+'.*?')?([^;\n]*))/;
        //                 var fileName = dirtyFileName.match(regex)[3];
        //                 var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        //                 FileSaver(blob, fileName);
        //             }
        //         } catch(err) {
        //             console.log('error', err);
        //         }   
        //     }
        //     if (load === 'pdf') {
        //         try{
        //             if (allCtData.dateRange !== null) {
        //                 date = formatDate(allCtData.dateRange[0]) + ' ' + formatDate(allCtData.dateRange[1]);
        //             }
        //             const response = await axios.get( customerExport, {
        //                 responseType: 'arraybuffer',
        //                 params: {
        //                     status: allCtData.activityStatus,
        //                     search: allCtData.search,
        //                     filterDt: date,
        //                     exe: load
        //                 },headers: {
        //                     apiKey: apiKey,
        //                     token: store.getters.adminAuthToken
        //                 },
        //             });
        //             if(response.status === 200) {
        //                 const dirtyFileName = response.headers['content-disposition'];
        //                 const regex = /filename[^;=\n]*=(?:(\\?['"])(.*?)\1|(?:[^\s]+'.*?')?([^;\n]*))/;
        //                 var pdfFileName = dirtyFileName.match(regex)[3];
        //                 var pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        //                 FileSaver(pdfBlob, pdfFileName);
        //             }
        //         } catch(err) {
        //             console.log('error', err);
        //         }   
        //     }
        // }

        /**
         * Confirmation on delete/restore
         */
        const confimationModal = (sloteData, load) => {
            confirmationModal.modalState = true;
            confirmationModal.modaldata = {
                data: sloteData,
                load: load
            }
        }

        //Returing variables to template
        return{
            customerAdd,
            customerEdit,
            customerDeactivate,
            customerListExport,
            customerDeactivateList,
            customerViewWebsite,
            pagePrivilages,
            allCtData,
            ctModal,
            addeditContractors,
            addEditvalidationError,
            imageUrl,
            allLocationDtData,
            editModaldata,
            // exportType,
            confirmationModal,
            createContractors,
            fetchLocation,
            viewEdit,
            updateUser,
            closeModal,
            fetchAllContractors,
            deleteAndRestoreLabour,
            confimationModal,
            usFormatDate
        }
    },
})
</script>
<style lang="scss" scoped>
@import "../../../../assets/style/component/superAdmin/pages/customer/CustomerList";
</style>