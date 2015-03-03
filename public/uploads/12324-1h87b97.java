package com.hiservice.authentication;

import com.hiservice.ldap.dao.LdapTenantDao;
import com.hiservice.ldap.dao.LdapUserDao;
import com.hiservice.persistence.db.rollback.RollbackOperator;
import com.hiservice.rsservice.RequestScopeService;


/**
 * a transaction manager for ldap operations
 * @author lulu
 *
 */
public interface LdapService extends RequestScopeService{
    
    String BEAN_NAME = "SERVICE_NAME_LDAP";
    
    void pushRollbackOperator(RollbackOperator rollbackOperator);
    
    LdapTenantDao getLdapTenantDao ();
    LdapUserDao getLdapUserDao();
    
}
