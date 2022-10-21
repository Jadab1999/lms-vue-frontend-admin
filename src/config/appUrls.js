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
 * ADMIN SETTINGS
 */
/** Super Admin Settings **/
export const adminSetting = superAdminBaseUrl + 'settings/general/';

/** Super Admin Email Type **/
export const adminEmailType = superAdminBaseUrl + 'email/type/';

/** Super Admin Email Template **/
export const adminEmailTemplates = superAdminBaseUrl + 'email/templates/';

/** Super Admin Email Recipient **/
export const adminEmailRecipients = superAdminBaseUrl + 'email/receipents/';

/** Super Admin CouchDB **/
export const adminCouchDB = superAdminBaseUrl + 'settings/couchdb';

/** Super Admin CouchDB delete**/
export const deleteAdminCouchDB = superAdminBaseUrl + 'settings/couchdb';


/**
 * ADMIN Labour List
 */
/**Super Admin Labour list */
export const allLabours = superAdminBaseUrl + 'customer/labours';
/**Super Admin Add Labour */
export const addLabour = superAdminBaseUrl + 'customer/add-labour';
/**Super Admin Location list */
export const allLocation = superAdminBaseUrl + 'customer/countries';
/**Super Admin Labour by id */
export const laboursById = superAdminBaseUrl + 'customer/labour/one';
/**Super Admin Delete Labour */
export const deleteLabour = superAdminBaseUrl + 'customer/delete-labour';
/**Super Admin Edit Labour */
export const editLabour = superAdminBaseUrl + 'customer/edit-labour';
/**Super Admin Labour export */
export const laboursExport = superAdminBaseUrl + '';

/**
 * ADMIN Contractor List
 */
/**Super Admin Labour list */
export const allContractors = superAdminBaseUrl + 'customer/contractors';
/**Super Admin Add Labour */
export const addContractor = superAdminBaseUrl + 'customer/add-contractor';
/**Super Admin Location list */
export const allLocationDt = superAdminBaseUrl + 'customer/countries';
/**Super Admin Labour by id */
export const contractorById = superAdminBaseUrl + 'customer/contractor/one';
/**Super Admin Delete Labour */
export const deleteContractors = superAdminBaseUrl + 'customer/delete-contractor';
/**Super Admin Edit Labour */
export const editContractors = superAdminBaseUrl + 'customer/edit-contractor';
/**Super Admin Labour export */
export const contractorsExport = superAdminBaseUrl + '';



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