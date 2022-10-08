export const AuthGuard = function(to, from, next) {
    if (to.name !== 'SuperAdminLogin' && localStorage.getItem('admin-token') == null) {
      next({ name: 'SuperAdminLogin' })
    } else next();
}

export const CustomerAuthGuard = function(to, from, next) {
  if (to.name !== 'UserPortalLogin' && localStorage.getItem('customer-token') == null) {
    next({ name: 'UserPortalLogin' })
  } else next();
}