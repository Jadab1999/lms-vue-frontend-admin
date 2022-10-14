import router from "../../router/index";
import { frontendUrl } from "../../config/constant";

export const labourLogout = () => {
    if (window.location.hostname === 'localhost') {
        localStorage.removeItem('customer-token');
        localStorage.removeItem('customer-details');
        router.push({name: "LabourPortalLogin"});
    } else {
        localStorage.removeItem('customer-token');
        localStorage.removeItem('customer-details');
        window.location.href = frontendUrl
    }
};

export const contractorLogout = () => {
    if (window.location.hostname === 'localhost') {
        localStorage.removeItem('customer-token');
        localStorage.removeItem('customer-details');
        router.push({name: "ContractorPortalLogin"});
    } else {
        localStorage.removeItem('customer-token');
        localStorage.removeItem('customer-details');
        window.location.href = frontendUrl
    }
};