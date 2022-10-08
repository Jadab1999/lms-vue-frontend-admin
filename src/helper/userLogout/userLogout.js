import router from "../../router/index";

const userLogout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('user-details');
    router.push({name: "SuperAdminLogin"});
};

export default userLogout;