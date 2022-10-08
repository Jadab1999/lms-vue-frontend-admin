import router from "../../router/index";
import { frontendUrl } from "../../config/constant";

const customerLogout = () => {
    if (window.location.hostname === 'localhost') {
        localStorage.removeItem('customer-token');
        localStorage.removeItem('customer-details');
        router.push({name: "UserPortalLogin"});
    } else {
        localStorage.removeItem('customer-token');
        localStorage.removeItem('customer-details');
        window.location.href = frontendUrl
    }
};

export default customerLogout;