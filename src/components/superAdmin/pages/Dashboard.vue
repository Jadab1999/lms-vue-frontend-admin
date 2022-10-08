<template>
    <div class="sup_content sup_dashboard">
        <h2>Dashboard</h2>
        <div class="sup_inner_content p-mb-4">
            <div class="sup_quick_overview">
                <div class="sup_qo_inner p-d-flex">
                    <div class="p-col sup_qo_item">
                        <div class="sup_qo_icon one"><img src="../../../assets/images/users.png" alt="Websites" /></div>
                        <div class="sup_qo_info">
                            <h3>Total Customers</h3>
                            <span class="sup_qo_number">{{allDashboardData.data.totalCustomer}}</span>
                        </div>
                    </div>
                    <div class="p-col sup_qo_item">
                        <span class="sup_qo_icon two"><img src="../../../assets/images/websites.png" alt="Websites" /></span>
                        <div class="sup_qo_info">
                            <h3>Total Websites</h3>
                            <span class="sup_qo_number">{{allDashboardData.data.totalWebsite}}</span>
                        </div>
                    </div>
                    <div class="p-col sup_qo_item">
                        <span class="sup_qo_icon four"><img src="../../../assets/images/licensed-website.png" alt="Websites" /></span>
                        <div class="sup_qo_info">
                            <h3>Active Websites</h3>
                            <span class="sup_qo_number">{{allDashboardData.data.activeWebsite}}</span>
                        </div>
                    </div>
                    <div class="p-col sup_qo_item">
                        <span class="sup_qo_icon three"><img src="../../../assets/images/websites.png" alt="Websites" /></span>
                        <div class="sup_qo_info">
                            <h3>Current Month Sale</h3>
                            <span class="sup_qo_number">${{allDashboardData.data.currMonthSale}}</span>
                        </div>
                    </div>
                    <div class="p-col sup_qo_item">
                        <span class="sup_qo_icon five"><img src="../../../assets/images/sales.png" alt="Websites" /></span>
                        <div class="sup_qo_info">
                            <h3>Total Sale</h3>
                            <span class="sup_qo_number">${{allDashboardData.data.totalSale}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="sup_detial_report">
            <div class="sup_dr-inner p-d-flex">
                    <div class="p-col-6">
                        <div class="sup_inner_content">
                            <div class="sup_chart_heading">
                                <div class="supchart_left"><h3>Sales Report</h3></div>
                                <div class="supchart_right">
                                    <Calendar v-model="Dvalue" selectionMode="range" />
                                </div>
                            </div>
                            
                            <Chart type="line" :data="lineStylesData" :options="basicOptions" />
                        </div>
                    </div>
                    <div class="p-col-6">
                        <div class="sup_inner_content">
                            <div class="sup_chart_heading">
                                <div class="supchart_left"><h3>Customer Overview</h3></div>
                                <div class="supchart_right">
                                    <Calendar v-model="Dvalue" selectionMode="range" />
                                </div>
                            </div>
                            <Chart type="line" :data="multiAxisData" :options="multiAxisOptions" />
                        </div>
                    </div>
                </div>
        </div>

        <div class="sup_detial_report">
            <div class="sup_dr-inner p-d-flex">
                    <div class="p-col-12">
                        <div class="sup_inner_content">
                            <DataTable class="p-datatable" :paginator="true" :value="allCustomerData.data" :rows="10" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Showing {currentPage} of {totalPages}" :rowsPerPageOptions="[10,20,50,70,100]" :rowHover="true" :loading="allCustomerData.loading" responsiveLayout="scroll" removableSort :filters="filters">
                                <template #loading>
                                    Loading customers data. Please wait.
                                </template>
                                <template #header>
                                    <div class="p-d-flex p-jc-between">
                                        <div class="supchart_left"><h3>Recent Customers</h3></div>
                                        <div class="p-d-flex p-align-center">
                                            <div class="sup_header_field">
                                                 <Dropdown v-model="selectedRecordType" :options="dataRecord" optionLabel="name" placeholder="Select filter" @change="searchCustomer('countryOnchange')"/>
                                            </div>
                                           
                                        </div>
                                    </div>
                                </template>
                                
                                <template #empty>
                                    No customers found.
                                </template>
                                <!-- <Column field="avatar" header="Name" headerStyle="width: 12rem" :sortable="true">
                                
                                </Column> -->
                                <Column header="Name" headerStyle="width: 3rem" :sortable="true">
                                    <template #body="slotProps">
                                        <!--- Check conditionally avatar image is null --->
                                        <div v-if="!slotProps.data.avatar">
                                            <div class="profile-image-customer">
                                                <img :src="imageUrl + '/avatar.png'" :alt="slotProps.data.avatar" class="product-image" />
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div class="profile-image-customer">
                                                <img :src="slotProps.data.avatar" :alt="slotProps.data.avatar" class="product-image" />
                                            </div>
                                        </div>
                                        <!-- <div class="profile-image-customer">
                                            <img :src="slotProps.data.avatar" :alt="slotProps.data.avatar" class="product-image" />
                                        </div> -->
                                    </template>
                                </Column>
                                <Column field="name" headerStyle="width: 15rem"> </Column>

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
                                        {{usFormatDate(slotProps.data.createdAt.split("T")[0])}} {{slotProps.data.createdAt.split("T")[1].split(".")[0]}}
                                    </template>
                                </Column>
                                <Column field="status" header="Status">
                                    <template #body="slotProps">
                                        <span :class="['customer-status', slotProps.data.status === true ? 'status-active' : 'status-inactive']">{{slotProps.data.status === true ? 'Active':'Inactive'}}</span>
                                    </template>
                                </Column>

                            
                            </DataTable>
                        </div>
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onBeforeMount, reactive, computed } from 'vue';
import { getDashBoardData } from "../../../config/appUrls";
import axios from "axios";
import { useStore } from 'vuex';
//import { useRoute } from "vue-router";
import { apiKey } from "../../../config/constant";



import { allCustomer } from '../../../config/appUrls';
import userLogout from '../../../helper/userLogout/userLogout';
import { imageUrl } from '../../../config/constant';
import { currentMenuUuid } from '../../../helper/pageActions/pageActions';
import { formatDate, usFormatDate } from '../../../helper/utility/utility';




export default {
    name: 'Dashboard',
    components: {},
    setup(){
        
         //Vuex store data call fucntion
        const store = useStore();

        //Route call
        //const route = useRoute();

        //console.log('customer id', route.params.id);

        /// ***** All Dashboard data call 
        const allDashboardData = reactive({
            data : false,
        });

        onBeforeMount(async()=>{
            dashboardDetails();
            fetchAllCsutomer();
        });

       

        const dashboardDetails = async () => {
            try {
                const response = await axios.get( getDashBoardData,{
                    
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.adminAuthToken
                    }, 
                });
                if (response.status === 200) {
                    allDashboardData.data = response.data.data;
                }
                else {
                    console.log('error', response);
                }
            } catch (err) {
                console.log('error', err);
            }
        }
        /// ***** All Dashboard data call end

        //User privilages role, UUID and actions store
        const pagePrivilages = reactive({
            userRole: '',
            uuid: '',
            actions: ''
        });

        //Customer data filter by month
        

        //Customer initial data storing state
        const allCustomerData = reactive({
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

        

        

        //Location state
        const alllocationData = reactive({
            country: null,
            state: null,
            status: null,
        });

        

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
        

        /**
         * Fetching all Customers from DB
         * intially fetching active Customers but this fucntion user can get deactive Customer and filter Customers by date and name
         * @param {customerStatus} getting customer list current state(ex: active/deactive)
         * @param {load} from where function calling
         */
           const searchCustomer = (dataRecord) => {
               console.log(dataRecord);
           }

           const fetchAllCsutomer = async (customerStatus, load) => {
            
            //Toggle Customer status to fetch active/deactive role
            if(load === 'customerStatus'){
                allCustomerData.activityStatus = customerStatus === 'active' ? 'de-active' : 'active' ;
            }

            //To clear search and filter then fetch all data
            if(load === 'resetFilters'){
                allCustomerData.search = null;
                allCustomerData.dateRange = null;
            }

            //Filter date wise code
            // if (load === 'dateRange') {
            //     date = formatDate(allCustomerData.dateRange[0]) + ' ' + formatDate(allCustomerData.dateRange[1]);
            // }

            //API call start
            try{
                allCustomerData.loading = !allCustomerData.loading;
                const response = await axios.get( allCustomer, {
                    params: {
                        status: allCustomerData.activityStatus,
                        search: allCustomerData.search,
                        filterDt: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)) + ' ' + formatDate(new Date())
                    },
                    headers: {
                        apiKey: apiKey,
                        token: store.getters.adminAuthToken
                    }, 
                });
                    allCustomerData.data = response.data.data.users;
                    allCustomerData.total = response.data.data.total;
                    allCustomerData.loading = !allCustomerData.loading;
            } catch(err){
                if(err.response.status === 403 || store.getters.adminAuthToken === '' ){
                    userLogout();
                } else {
                    console.log('error', err);
                }
            }
        }

        
       
       

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
            allCustomerData,
            imageUrl,
            alllocationData,
            confirmationModal,
            fetchAllCsutomer,
            confimationModal,
            usFormatDate,
            Dvalue: null,
            allDashboardData,
            dashboardDetails,
            searchCustomer,
            basicData: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [
					{
						label: 'My First dataset',
						backgroundColor: '#42A5F5',
						data: [65, 59, 80, 81, 56, 55, 40]
					},
					{
						label: 'My Second dataset',
						backgroundColor: '#9CCC65',
						data: [28, 48, 40, 19, 86, 27, 90]
					}
				]
			},
            multiAxisData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Customers',
                    fill: true,
                    borderColor: '#00bb7e',
                    yAxisID: 'y1',
                    tension: .4,
                    data: [28, 48, 40, 19, 86, 27, 90],
                    backgroundColor: 'rgba(0,219,182,0.2)'
                }]
            },
            lineStylesData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'Sales Data',
                        data: [12, 51, 62, 33, 21, 62, 45],
                        fill: true,
                        borderColor: '#FFA726',
                        tension: .4,
                        backgroundColor: 'rgba(255,167,38,0.2)'
                    }
                ]
            },
            multiAxisOptions:{
                stacked: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            drawOnChartArea: false,
                            color: '#ebedef'
                        }
                    }
                }
            },
        }
        

        
      
    },
    methods(){
        
    }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/style/component/superAdmin/pages/Dashboard.scss";
</style>