<template>
    <div :class="['sup_sidbar', collapseLeftMenu ? 'sup_sidbar_collapse' : '']">
        <div class="sup_brand_logo">
            <div v-if="collapseLeftMenu" class="sup_brand_logo_small">
                <img :src="imageUrl + 'truabilities-logo-mini.png'" class="truabilities-image" alt="Truabilities Image">
            </div>
            <div v-else class="sup_brand_logo_large">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRHpcqwj6RuBnis9zCi-ECPX9JsebA6WccrOG7Wm5O0nkjMdcjEVTX07sC75WG4d2El0o&usqp=CAU" class="truabilities-image" alt="Truabilities Image">
            </div>
        </div>
        <div class="sup_sidebar_menu_container">
            <ul class="sup_sidebar_menu">
                <!-- Left menu dynamically initate start -->
                <li v-for="(item, i) of menuItems.filter(x=>x.accessable)" :key="i" :class="[{'sup_dropdown_active' : activeParentMenu === i }, {'sup_has_dropdown' : item.items}]">
                    <router-link v-if="item.to" :to="item.to" :class="'p-ripple'" v-ripple><i class="pi" :class="item.iconName" @click="onMenuItemClick($e, item , i)"></i>{{item.label}}<i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></i></router-link>
                    <a v-if="!item.to" :class="['p-ripple']"  @click="onMenuItemClick($e, item , i)" v-ripple><i class="pi" :class="item.iconName"></i>{{item.label}}<i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></i></a>
                    <transition name="list">
                        <ul v-if="item.items" class="sup_mainmenu_dropdown" v-show="activeParentMenu === i">
                            <li class="sup_dropdown_menu_head">{{item.label}}</li>
                            <li v-for="(innerItem, i) of item.items.filter(x=>x.accessable)" :key="i" >
                                <router-link v-if="innerItem.to" :to="innerItem.to" :class="['p-ripple']" v-ripple><i class="pi" :class="innerItem.iconName"></i>{{innerItem.label}}</router-link>
                                <a v-if="!innerItem.to" href="#" :class="'p-ripple'"><i class="pi" :class="innerItem.iconName"></i>{{innerItem.label}}</a>
                            </li>
                        </ul>
                    </transition>
                </li>
                <!-- Left menu dynamically initate end -->
            </ul>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue';
import { imageUrl, apiKey, logoUrl } from '../../../config/constant';
import userLogout from '../../../helper/userLogout/userLogout';
import { useStore } from 'vuex';
import { menuSync } from '../../../config/appUrls';
import axios from "axios";

export default {
    name: 'Sidebar',
    setup(){
        //Vuex store data call fucntion
        const store = useStore();
        
        //User role state
        const userRole = ref();

        //Unless Super admin permitted menu will show by this state
        const NewMenuUpdate = ref();

        //storing accessible menu's
        const menuItemsAccessable = reactive ([]);

        /**
         * From here receiving and modifing data for menu accessible
         * updating value to NewMenuUpdate state
         */
        (() => {
            let NewMenu = {};
            if (Object.keys(store.getters.userDetails).length === 0) { //When stroe data is blank
                //Getting data from localstorage
                const user = JSON.parse(localStorage.getItem('user-details'));
                userRole.value = user.role.role;
                menuItemsAccessable.value = user.primaryMenu;

                //looping api menu data for new formating
                for (const key in menuItemsAccessable.value) {
                    if (key.match(" > ") != null) { // if string has ' > '
                        let newLabel = key.split(' > ');
                        NewMenu[newLabel[1]] = menuItemsAccessable.value[key]; 
                    } else {
                        NewMenu[key] = menuItemsAccessable.value[key]; 
                    }
                }
                NewMenuUpdate.value = NewMenu;
                //console.log(NewMenuUpdate.value);
            } else { //When stroe has data
                userRole.value = store.getters.userDetails.role.role;
                menuItemsAccessable.value = store.getters.userDetails.primaryMenu;
                
                //looping api menu data for new formating
                for (const key in menuItemsAccessable.value) {
                    if (key.match(" > ") != null) { // if string has ' > '
                        let newLabel = key.split(' > ');
                        NewMenu[newLabel[1]] = menuItemsAccessable.value[key]; 
                    } else {
                        NewMenu[key] = menuItemsAccessable.value[key]; 
                    }
                }
                NewMenuUpdate.value = NewMenu;
                //console.log(NewMenuUpdate.value);
            }
        })();

        //Portal Full Menu items List
        const menuItems = reactive ([
            {
                label: 'Dashboard',
                menu: 'Dashboard',
                to: '/admin/dashboard',
                iconName: 'pi-home',
                accessable: true,
                hasSubmenu: false,
                menuOrder: 1,
                menuActions: {},
            },
            {
                label: 'Contractors',
                menu: 'Contractors',
                to: '/admin/contractors',
                iconName: 'pi-home',
                accessable: true,
                hasSubmenu: false,
                menuOrder: 1,
                menuActions: {},
            },
            {
                label: 'Media',
                menu: 'Media',
                to: '/admin/media',
                iconName: 'pi-images',
                accessable: true,
                hasSubmenu: false,
                menuOrder: 1,
                menuActions: {},
            },
            {
                label: 'Roles & Privileges',
                menu: 'RolesAndPrivileges',
                iconName: 'pi-unlock',
                accessable: userRole.value === 'systemAdministrator' ? true  : NewMenuUpdate.value.RoleManagement === undefined && NewMenuUpdate.value.UserManagement === undefined ? false : true,
                hasSubmenu: true,
                menuOrder: 2,
                items: [
                    {
                        label: 'User Management',
                        menu: 'UserManagement',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.UserManagement ? true : false,
                        iconName: 'pi-user-edit',
                        to: '/admin/user-management',
                        menuActions: {
                            "Add": true,
                            "Edit": true,
                            "Deactivate": true,
                            "DeactivateList": true,
                            "Export": true,                            
                            "SetPrivilage": true                        
                        }
                    },
                    {
                        label: 'Role Management',
                        menu: 'RoleManagement',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.RoleManagement ? true : false,
                        iconName: 'pi-key',
                        to: '/admin/role-management',
                        menuActions: {
                            "Add": true,
                            "Edit": true,
                            "Deactivate": true,
                            "DeactivateList": true,                      
                        }
                    }
                ]
            },
            {
                label: 'Reports',
                menu: 'Reports',
                iconName: 'pi-book',
                accessable: true,
                hasSubmenu: true,
                menuOrder: 2,
                items: [
                    {
                        label: 'Active Websites',
                        menu: 'ActiveWebsites',
                        accessable: true,
                        iconName: 'pi-check-circle',
                        to: '/admin/active-websites',
                        menuActions: {
                            "Add": true,
                            "Edit": true,
                            "Deactivate": true,
                            "DeactivateList": true,
                            "Export": true,                            
                            "SetPrivilage": true                        
                        }
                    },
                    {
                        label: 'Deactive Websites',
                        menu: 'DeactiveWebsites',
                        accessable: true,
                        iconName: 'pi-ban',
                        to: '/admin/deactive-websites',
                        menuActions: {
                            "Add": true,
                            "Edit": true,
                            "Deactivate": true,
                            "DeactivateList": true,
                            "Export": true,                            
                            "SetPrivilage": true                        
                        }
                    }
                ]
            },
            {
                label: 'Customer',
                menu: 'Customer',
                iconName: 'pi-users',
                accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.CustomerManagement === undefined ? false : true,
                hasSubmenu: true,
                menuOrder: 5,
                items: [
                    {
                        label: 'Customer Management',
                        menu: 'CustomerManagement',
                        accessable: true,
                        iconName: 'pi-list',
                        to: '/admin/customer-list',
                        menuActions: {
                            "Add": true,
                            "Edit": true,
                            "Deactivate": true,
                            "DeactivateList": true,
                            "Export": true,                       
                            "ViewWebsite": true                       
                        }
                    }
                ]
            },
            {
                label: 'Websites',
                menu: 'Website',
                iconName: 'pi-desktop',
                accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.WebsiteManagement === undefined && NewMenuUpdate.value.WebsiteHits === undefined && NewMenuUpdate.value.WebsiteCancellationRequest === undefined ? false : true,
                hasSubmenu: true,
                menuOrder: 5,
                items: [
                    {
                        label: 'Website Management',
                        menu: 'WebsiteManagement',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.WebsiteManagement ? true : false,
                        iconName: 'pi-list',
                        to: '/admin/website-list',
                        menuActions: {
                            "Deactivate": true,
                            "DeactivateList": true,
                            "Export": true,
                            "ViewInvoice": true                    
                        }
                    },
                    {
                        label: 'Free Website List',
                        menu: 'freeWebsiteManagement',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.freeWebsiteManagement ? true : false,
                        iconName: 'pi-list',
                        to: '/admin/website-list/free'
                    },
                    {
                        label: 'Website Hits',
                        menu: 'WebsiteHits',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.WebsiteHits ? true : false,
                        iconName: 'pi-circle-off',
                        to: '/admin/website-hits',
                        menuActions: {
                            "Export": true
                        }
                    },
                    {
                        label: 'Cancellation Requests',
                        menu: 'WebsiteCancellationRequest',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.WebsiteCancellationRequest ? true : false,
                        iconName: 'pi-ban',
                        to: '/admin/website-cancel',
                        menuActions: {
                            "Edit": true,
                            "Export": true,
                        }
                    }
                ]
            },
            {
                label: 'Accessability Scan',
                menu: 'Accessability',
                iconName: 'pi-qrcode',
                accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.ScanManagement === undefined && NewMenuUpdate.value.ScanSettings === undefined ? false : true,
                hasSubmenu: true,
                menuOrder: 5,
                items: [
                    {
                        label: 'Scan Management',
                        menu: 'ScanManagement',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.ScanManagement ? true : false,
                        iconName: 'pi-list',
                        to: '/admin/scan-list',
                        menuActions: {
                            "Deactivate": true,
                            "DeactivateList": true,
                            "Export": true,
                            "ViewInvoice": true                    
                        }
                    },
                    {
                        label: 'Scan Settings',
                        menu: 'ScanSettings',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.ScanSettings ? true : false,
                        iconName: 'pi-list',
                        to: '/admin/scansettings-list',
                        menuActions: {
                            "Deactivate": true,
                            "DeactivateList": true,
                            "Export": true,
                            "ViewInvoice": true                    
                        }
                    },
                ]
            },
            {
                label: 'Order',
                menu: 'Order',
                iconName: 'pi-credit-card',
                accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.InvoiceManagement === undefined && NewMenuUpdate.value.PayementManagement === undefined ? false : true,
                hasSubmenu: true,
                menuOrder: 5,
                items: [
                    {
                        label: 'Order Management',
                        menu: 'OrderManagement',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.InvoiceManagement ? true : false,
                        iconName: 'pi-list',
                        to: '/admin/order-list',
                        menuActions: {
                            "Export": true,
                            "SendReceipt": true
                        }
                    },
                    {
                        label: 'Free Order Management',
                        menu: 'FreeOrderManagement',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.InvoiceManagement ? true : false,
                        iconName: 'pi-list',
                        to: '/admin/free-order-list',
                    }
                ]
            },
            {
                label: 'Package',
                menu: 'Package',
                iconName: 'pi-inbox',
                accessable: userRole.value === 'systemAdministrator' ? true  : NewMenuUpdate.value.PackageType === undefined && NewMenuUpdate.value.PackageManagement === undefined && NewMenuUpdate.value.PackageFeatures === undefined ? false : true,
                hasSubmenu: true,
                menuOrder: 6,
                items: [
                    {
                        label: 'Package Type',
                        menu: 'PackageType',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.PackageType ? true : false,
                        iconName: 'pi-tags',
                        to: '/admin/package-type',
                        menuActions: {
                            "Add": true,
                            "Edit": true,
                            "Deactivate": true,
                            "DeactivateList": true                      
                        }
                    },
                    {
                        label: 'Package Management',
                        menu: 'PackageManagement',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.PackageManagement ? true : false,
                        iconName: 'pi-list',
                        to: '/admin/package-management',
                        menuActions: {
                            "Add": true,
                            "Edit": true,
                            "Deactivate": true,
                            "DeactivateList": true                      
                        }
                    },
                    {
                        label: 'Features',
                        menu: 'PackageFeatures',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.PackageFeatures ? true : false,
                        iconName: 'pi-copy',
                        to: '/admin/package-feature',
                        menuActions: {
                            "Edit": true
                        }
                    }
                ]
            },
            {
                label: 'Widget Management',
                menu: 'WidgetManagement',
                iconName: 'pi-discord',
                accessable: userRole.value === 'systemAdministrator' ? true  : NewMenuUpdate.value.pages === undefined && NewMenuUpdate.value.Languages === undefined && NewMenuUpdate.value.LanguagesKey === undefined && NewMenuUpdate.value.LanguagesText === undefined && NewMenuUpdate.value.DeviceInfo === undefined && NewMenuUpdate.value.Leads === undefined ? false : true,
                hasSubmenu: true,
                menuOrder: 6,
                items: [
                    {
                        label: 'Website Content',
                        menu: 'pages',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.Languages ? true : false,
                        iconName: 'pi-book',
                        to: '/admin/pages',
                        menuActions: {
                            "Add": true,
                            "Edit": true,
                            "Deactivate": true,
                            "DeactivateList": true                      
                        }
                    },
                    {
                        label: 'Languages',
                        menu: 'Languages',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.Languages ? true : false,
                        iconName: 'pi-globe',
                        to: '/admin/languages',
                        menuActions: {
                            "Add": true,
                            "Edit": true,
                            "Export": true,
                            "Deactivate": true,
                            "DeactivateList": true                      
                        }
                    },
                    {
                        label: 'Languages Key',
                        menu: 'LanguagesKey',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.LanguagesKey ? true : false,
                        iconName: 'pi-globe',
                        to: '/admin/language-key',
                        menuActions: {
                            "Add": true,
                            "Edit": true,
                            "Deactivate": true,
                            "DeactivateList": true                      
                        }
                    },
                    {
                        label: 'Languages Text',
                        menu: 'LanguagesText',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.LanguagesText ? true : false,
                        iconName: 'pi-globe',
                        to: '/admin/language-text',
                        menuActions: {
                            "Edit": true,
                            "Deactivate": true,
                            "DeactivateList": true                      
                        }
                    },
                    {
                        label: 'Device Info',
                        menu: 'DeviceInfo',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.DeviceInfo ? true : false,
                        iconName: 'pi-mobile',
                        to: '/admin/device-info',
                        menuActions: {
                            "Edit": true,
                            "Deactivate": true,
                            "DeactivateList": true                      
                        }
                    },
                    {
                        label: 'Leads',
                        menu: 'Leads',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.Leads ? true : false,
                        iconName: 'pi-users',
                        to: '/admin/leads'
                    }
                ]
            },
            {
                label: 'Promotion',
                menu: 'Promotion',
                iconName: 'pi-ticket',
                accessable: userRole.value === 'systemAdministrator' ? true  : NewMenuUpdate.value.CouponManagement === undefined ? false : true,
                hasSubmenu: true,
                menuOrder: 6,
                items: [
                    {
                        label: 'Coupon',
                        menu: 'CouponManagement',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.CouponManagement ? true : false,
                        iconName: 'pi-ticket',
                        to: '/admin/coupon'
                    },
                ]
            },
            {
                label: 'Services',
                menu: 'Services',
                iconName: 'pi-briefcase',
                accessable: userRole.value === 'systemAdministrator' ? true  : NewMenuUpdate.value.CookieManagement === undefined && NewMenuUpdate.value.CookieCategory === undefined ? false : true,
                hasSubmenu: true,
                menuOrder: 6,
                items: [
                    {
                        label: 'Cookie Management',
                        menu: 'CookieManagement',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.CookieManagement ? true : false,
                        iconName: 'pi-briefcase',
                        to: '/admin/cookie'
                    },
                    {
                        label: 'Cookie Category',
                        menu: 'CookieCategory',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.CookieCategory ? true : false,
                        iconName: 'pi-briefcase',
                        to: '/admin/cookie-category'
                    },
                ]
            },
            {
                label: 'Settings',
                menu: 'Settings',
                iconName: 'pi-cog',
                accessable: userRole.value === 'systemAdministrator' ? true  : NewMenuUpdate.value.GenerelSettings === undefined && NewMenuUpdate.value.EmailType === undefined && NewMenuUpdate.value.EmailTemplate === undefined && NewMenuUpdate.value.EmailRecipients === undefined ? false : true,
                hasSubmenu: true,
                menuOrder: 6,
                items: [
                    {
                        label: 'General',
                        menu: 'GeneralSettings',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.GenerelSettings ? true : false,
                        iconName: 'pi-cog',
                        to: '/admin/general-settings'
                    },
                    {
                        label: 'Email Type',
                        menu: 'EmailType',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.EmailType ? true : false,
                        iconName: 'pi-envelope',
                        to: '/admin/email-type'
                    },
                    {
                        label: 'Email Template',
                        menu: 'EmailTemplate',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.EmailTemplate ? true : false,
                        iconName: 'pi-envelope',
                        to: '/admin/email-template'
                    },
                    {
                        label: 'Pdf Template',
                        menu: 'PdfTemplate',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.PdfTemplate ? true : false,
                        iconName: 'pi-envelope',
                        to: '/admin/pdf-template'
                    },
                    {
                        label: 'Email Recipients',
                        menu: 'EmailRecipients',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.EmailRecipients ? true : false,
                        iconName: 'pi-users',
                        to: '/admin/email-recipients'
                    },
                    {
                        label: 'CouchDB',
                        menu: 'CouchDB',
                        accessable: userRole.value === 'systemAdministrator' ? true : NewMenuUpdate.value.CouchDB ? true : false,
                        iconName: 'pi-folder',
                        to: '/admin/couchdb'
                    }
                ]
            }
        ])

        //SideMenu Collapse State Manage
        const collapseLeftMenu = computed(() => store.getters.LeftMenuCollapsedStatus);

        //Menu Dropdown Toggle State
        let activeParentMenu = ref()

        //Menu Dropdown Toggle
        function onMenuItemClick(e, item, i){
            document.querySelectorAll('.sup_sidebar_menu li').forEach( ele => {
                if (ele.classList.contains("link-parent-active")) {
                    ele.classList.remove("link-parent-active")
                }
            })
            if(item.items){
                activeParentMenu.value = i === activeParentMenu.value ? null : i;
            }
        }

        //Menu sync with DB
        async function adminMenuInsert () {
            if (userRole.value === 'systemAdministrator') {
                let mainMenuList = [];
                let subMenuList = [];
                for (let i=0; i < menuItems.length; i++) {
                    if(!menuItems[i].hasSubmenu){
                        mainMenuList.push({
                            menuName: menuItems[i].menu,
                            // menuActions: {
                            //     "Export": true,
                            //     "DeactiveList": true
                            // },
                            menuLink: '/'+menuItems[i].to.split("/")[2],
                            icon: menuItems[i].iconName,
                            hasSubmenu: menuItems[i].hasSubmenu,
                            menuOrder: menuItems[i].menuOrder,
                            menuActions: menuItems[i].menuActions
                        })
                    }
                    if(menuItems[i].hasSubmenu) {
                        for (let j=0; j < menuItems[i].items.length; j++) {
                            subMenuList.push({
                                menuName: menuItems[i].items[j].menu,
                                // menuActions: {
                                //     "Export": true,
                                //     "DeactiveList": true
                                // },
                                menuLink: '/'+menuItems[i].items[j].to.split("/")[2],
                                icon: menuItems[i].items[j].iconName,
                                hasSubmenu: menuItems[i].hasSubmenu,
                                parentMenu: menuItems[i].menu,
                                menuOrder: menuItems[i].menuOrder,
                                menuActions: menuItems[i].items[j].menuActions
                            })
                        }
                    }
                }
                //console.log(mainMenuList.concat(subMenuList));
                try{
                    await axios.post( menuSync, {
                        menuSync: mainMenuList.concat(subMenuList)
                        },{
                            headers: {
                            apiKey: apiKey,
                            token: store.getters.adminAuthToken
                        },
                    });
                } catch(err){
                    if(err.response.status === 403 || store.getters.adminAuthToken === '' ){
                        userLogout();
                    } else {
                        console.log('error', err.message);
                    }
                }
            }
        }

        /**
         * On mounted call
         */
        onMounted(() => {
            adminMenuInsert(); //admin menu insert through api
            activeParentMenuOnload(); //collapsing active menu onload
        })

        /**
         * Activing menu on mount
         */
        function activeParentMenuOnload() {
            let activeMenu = document.querySelector('.sup_sidebar_menu li a.router-link-active');
            if (activeMenu.closest("li.sup_has_dropdown")) {
                activeMenu.closest("li.sup_has_dropdown").classList.add('link-parent-active');
            }
        }

        return{
            imageUrl,
            menuItems,
            activeParentMenu,
            collapseLeftMenu,
            onMenuItemClick,
            logoUrl
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/style/component/superAdmin/common/LeftPanel.scss";
</style>