//const baseUrl = process.env.NODE_ENV === "development" ? 'http://api.stage.truabilities.com/truabilities-dev/api/v1/' : 'https://api.truabilities.com/truabilities/api/v1/';
const baseUrl = 'http://localhost:4545/lms-dev/api/v1/';
// const baseUrl = 'https://apiv3.stage.truabilities.com/truabilities-dev/api/v1/';

/**
 * LABOUR BASE URL
 */
const labourBaseUrl = baseUrl + "labour/";

/**
 * CONTRACTOR BASE URL
 */
const contractorBaseUrl = baseUrl + "contractor/";

/**
 * SUPER ADMIN BASE URL
 */
const superAdminBaseUrl = baseUrl + "admin/";

/**
 * ADMIN LOGIN
 */
/** Super Admin Login **/
export const superAdminLoginAuth = superAdminBaseUrl + 'auth/login';




/**
 * CONTRACTOR LOGIN
 */
/** Contractor Login **/
export const contractorLoginAuth = contractorBaseUrl + 'user/login';




/**
 * LABOUR LOGIN
 */
/**Labour Login **/
export const labourLoginAuth = labourBaseUrl + 'labour-login/login';