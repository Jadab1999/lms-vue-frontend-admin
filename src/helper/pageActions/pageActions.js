import axios from "axios";
import store from '../../store';
import { apiKey } from "../../config/constant";
import { getPrivilegebyMenuUUID } from '../../config/appUrls';

/**
 * @param {menuName} coming with current menu name from where the function initiate
 * Object.keys(store.getters.userDetails).length Checking if store data available for user else get form browser local storage
 * 
 * @returns UserRole and Menu available action value
 */
export const currentMenuUuid = async (menuName) => {
    let NewMenu = [];
        if (Object.keys(store.getters.userDetails).length === 0) { //When stroe data is blank
            //Getting data from localstorage
            const userData = JSON.parse(localStorage.getItem('user-details'));
            const userRole = userData.role.role;
            for (const key in userData.primaryMenu) {
                if (key.match(" > ") != null) { // if string has ' > '
                    let newLabel = key.split(' > ');
                    NewMenu[newLabel[1]] = userData.primaryMenu[key]; 
                } else {
                    NewMenu[key] = userData.primaryMenu[key]; 
                }
            }

            //calling getActionsName() to get action name from api with passing current menu UUID by NewMenu[menuName]
            const menuActions = await getActionsName(NewMenu[menuName]);
            
            //Returing {userRole, menuActions}
            return {userRole, menuActions};

        } else { //When stroe has data
            const userRole = store.getters.userDetails.role.role;
            for (const key in store.getters.userDetails.primaryMenu) {
                if (key.match(" > ") != null) { // if string has ' > '
                    let newLabel = key.split(' > ');
                    NewMenu[newLabel[1]] = store.getters.userDetails.primaryMenu[key]; 
                } else {
                    NewMenu[key] = store.getters.userDetails.primaryMenu[key]; 
                }
            }

            //calling getActionsName() to get action name from api with passing current menu UUID by NewMenu[menuName]
            const menuActions = await getActionsName(NewMenu[menuName]);

            //Returing {userRole, menuActions}
            return {userRole, menuActions};
        }
};

/**
 * getPrivilegebyMenuUUID api call to fetch page action access value
 * @param {*} uuid 
 * @returns 
 */
const getActionsName = async (uuid) => {
    const userData = JSON.parse(localStorage.getItem('user-details'));
    if (userData.role.role != 'systemAdministrator') { // Checking if user not super admin
        const response = await axios.get(getPrivilegebyMenuUUID,{
            params: {
                uuid: uuid
            }, 
            headers: {
            apiKey: apiKey,
                token: store.getters.adminAuthToken 
            }
        })

        //Returing api data
        return response.data.data;
    }
};