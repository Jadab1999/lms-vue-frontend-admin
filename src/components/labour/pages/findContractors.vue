<template>
    <div class="sup_content customer-list">
        <div class="sup_page_heading">
            <h2>Contractors Near you</h2>
        </div>
        <div class="sup_inner_content">
            <!--- Show Customer Table Start --->
            <DataTable v-if="phoneView" class="p-datatable" :paginator="true" :value="allCtData.data" :rows="10" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Showing {currentPage} of {totalPages}" :rowsPerPageOptions="[10,20,50]" :rowHover="true" :loading="allCtData.loading" responsiveLayout="scroll" removableSort :filters="filters">
                <template #loading>
                    Loading customers data. Please wait.
                </template>
                <template #header>
                    <div class="p-d-flex p-jc-between">
                        <div class="p-d-flex p-align-center">
                            <span class="p-input-icon-left sup_search_box">
                                <i class="pi pi-search" />
                                <InputText v-model="allCtData.search" placeholder="Search" @keyup.enter="fetchNearestContractors(allCtData.activityStatus, 'search')"/>
                            </span>
                            <Calendar v-model="allCtData.dateRange" placeholder="DD.MM.YY" dateFormat="dd.mm.yy" selectionMode="range" class="sup_button p-ml-2" inputClass="p-inputtext" :manualInput="false" :showIcon="true" @date-select="allCtData.dateRange[1] != null ? fetchNearestContractors(allCtData.activityStatus, 'dateRange') : ''" plceholder="abc" />
                            <Button v-if="allCtData.search !== null || allCtData.dateRange !== null" icon="pi pi-refresh" class="p-button-sm p-button-dark sup_search_clear p-ml-2" @click="fetchNearestContractors(allCtData.activityStatus, 'resetFilters')"/>
                            <SplitButton v-if="customerListExport" label="Export" icon="pi pi-external-link" class="p-button-secondary p-ml-2" :model="exportType"></SplitButton>
                        </div>
                    </div>
                </template>
                <template #empty>
                    No Contractors found.
                </template>
                <Column field="name" header="Name" headerStyle="width: 8rem" :sortable="true"></Column>

                <Column field="city" header="City" :sortable="true"></Column>

                <Column field="action" header="Actions">
                    <template #body="slotProps">
                        <Button type="button" icon="pi pi-phone" class="p-button-sm p-button-rounded p-button-primary p-mr-1" @click="contactContractors(slotProps.data, 'dial')" v-tooltip="'Call'" />
                        <Button type="button" icon="pi pi-envelope" class="p-button-sm p-button-rounded p-button-secondary p-mr-1" @click="contactContractors(slotProps.data, 'mail')" v-tooltip="'Email'" />
                        <!-- <Button type="button" icon="pi pi-ban" class="p-button-sm p-button-rounded p-button-danger p-mr-1" v-tooltip="'Deactivate'" @click="confimationModal(slotProps.data, 'delete')" /> -->
                        <!-- <Button icon="pi pi-undo" class="p-button-secondary p-button-rounded p-button-sm p-mr-1"  v-tooltip="'Restore Customer'" @click="confimationModal(slotProps.data, 'restore')" /> -->
                        <!-- <Button icon="pi pi-trash" class="p-button-danger p-button-rounded p-button-sm"  v-tooltip="'Delete Customer'" /> --> 
                    </template>
                </Column>
            </DataTable>
            <DataTable v-else class="p-datatable" :paginator="true" :value="allCtData.data" :rows="10" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Showing {currentPage} of {totalPages}" :rowsPerPageOptions="[10,20,50]" :rowHover="true" :loading="allCtData.loading" responsiveLayout="scroll" removableSort :filters="filters">
                <template #loading>
                    Loading customers data. Please wait.
                </template>
                <template #header>
                    <div class="p-d-flex p-jc-between">
                        <div class="p-d-flex p-align-center">
                            <span class="p-input-icon-left sup_search_box">
                                <i class="pi pi-search" />
                                <InputText v-model="allCtData.search" placeholder="Search Contractors" @keyup.enter="fetchNearestContractors(allCtData.activityStatus, 'search')"/>
                            </span>
                            <Calendar v-model="allCtData.dateRange" placeholder="DD.MM.YY" dateFormat="dd.mm.yy" selectionMode="range" class="sup_button p-ml-2" inputClass="p-inputtext" :manualInput="false" :showIcon="true" @date-select="allCtData.dateRange[1] != null ? fetchNearestContractors(allCtData.activityStatus, 'dateRange') : ''" plceholder="abc" />
                            <Button v-if="allCtData.search !== null || allCtData.dateRange !== null" icon="pi pi-refresh" class="p-button-sm p-button-dark sup_search_clear p-ml-2" @click="fetchNearestContractors(allCtData.activityStatus, 'resetFilters')"/>
                            <SplitButton v-if="customerListExport" label="Export" icon="pi pi-external-link" class="p-button-secondary p-ml-2" :model="exportType"></SplitButton>
                        </div>
                    </div>
                </template>
                <template #empty>
                    No Contractors found.
                </template>
                <Column field="name" header="Name" headerStyle="width: 12rem" :sortable="true"></Column>

                <Column field="email" header="Email" headerStyle="width: 17rem" :sortable="true"></Column>

                <Column field="mobile" header="Mobile No" headerStyle="width: 17rem" :sortable="true"></Column>

                <Column field="city" header="City" :sortable="true"></Column>

                <Column field="state" header="State">
                    <template #body="slotProps">
                        {{slotProps.data.State.name}}
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
                        <Button type="button" icon="pi pi-phone" class="p-button-sm p-button-rounded p-button-primary p-mr-1" @click.once="contactContractors(slotProps.data, 'dial')" v-tooltip="'Call'" />
                        <Button type="button" icon="pi pi-envelope" class="p-button-sm p-button-rounded p-button-secondary p-mr-1" @click.once="contactContractors(slotProps.data, 'mail')" v-tooltip="'Email'" />
                        <!-- <Button type="button" icon="pi pi-ban" class="p-button-sm p-button-rounded p-button-danger p-mr-1" v-tooltip="'Deactivate'" @click="confimationModal(slotProps.data, 'delete')" /> -->
                        <!-- <Button icon="pi pi-undo" class="p-button-secondary p-button-rounded p-button-sm p-mr-1"  v-tooltip="'Restore Customer'" @click="confimationModal(slotProps.data, 'restore')" /> -->
                        <!-- <Button icon="pi pi-trash" class="p-button-danger p-button-rounded p-button-sm"  v-tooltip="'Delete Customer'" /> --> 
                    </template>
                </Column>
            </DataTable>
            <!--- Show Customer Table End --->
        </div>
    </div>
</template>

<script>
import { nearestContractors, contactedContractors } from '../../../config/appUrls';
import { apiKey } from "../../../config/constant";
import userLogout from '../../../helper/userLogout/userLogout';
import { formatDate, usFormatDate } from '../../../helper/utility/utility';
import axios from "axios";
import { useStore } from 'vuex';
import { useRoute } from "vue-router";
import { reactive, onBeforeMount } from 'vue';
// const FileSaver = require('file-saver');

export default({
    setup() {
        //Vuex store data call fucntion
        const store = useStore();

        //Route call
        const route = useRoute();

        console.log('customer id', route.params.id);

        //Checking for desktop view
        const deskView = window.innerWidth > 700;
        //Checking for Mobile view
        const phoneView = window.innerWidth <= 700;

        //Customer initial data storing state
        const allCtData = reactive({
            data: null,
            total: null,
            status: null,
            loading: false,
            activityStatus: 'all',
            search: null,
            dateRange: null
        });

        /**
         * On component get mounted require functions call
         */
        onBeforeMount( async() => {
            fetchNearestContractors();
        });

        /**
         * Fetching all Customers from DB
         * intially fetching active Customers but this fucntion user can get deactive Customer and filter Customers by date and name
         * @param {customerStatus} getting customer list current state(ex: active/deactive)
         * @param {load} from where function calling
         */
        const fetchNearestContractors = async (customerStatus, load) => {
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
                const response = await axios.get( nearestContractors, {
                    params: {
                        status: allCtData.activityStatus,
                        search: allCtData.search,
                        filterDt: date
                    },
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.customerPortalToken
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

        const contactContractors = async(contData, load) => {
            try {
                const response = await axios.post( contactedContractors,{
                    contractorId: contData.uuid
                },{
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.customerPortalToken
                    }, 
                });
                if(response.status === 200) {
                    if (load === 'dial') {
                        window.location ='tel:'+contData.mobile;
                    } else {
                        window.location = 'mailto:'+contData.email;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        //Returing variables to template
        return{
            allCtData,
            fetchNearestContractors,
            usFormatDate,
            contactContractors,
            deskView,
            phoneView
        }
    },
})
</script>
<style lang="scss" scoped>
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation:portrait) { 
.sup_content .customer-list {
-webkit-transform: rotate(90deg);
-moz-transform: rotate(90deg);
-o-transform: rotate(90deg);
-ms-transform: rotate(90deg);
transform: rotate(90deg);
width: 100%;
height: 100%;
overflow: hidden;
position: absolute;
top: 0;
left: 0; 
}}

@import "../../../assets/style/component/superAdmin/pages/customer/CustomerList.css";
</style>