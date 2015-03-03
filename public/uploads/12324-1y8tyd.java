package com.hiservice.authentication;

import java.util.Stack;

import org.jboss.logging.Logger;
import org.springframework.ldap.core.LdapTemplate;

import com.hiservice.ldap.dao.LdapTenantDao;
import com.hiservice.ldap.dao.LdapUserDao;
import com.hiservice.persistence.db.rollback.RollbackOperator;
import com.hiservice.util.AppContextUtil;


/**
 * this service is actually a transaction manager due to ldap lack of support of transaction and this service can provide ldap daos under transaction protection.
 * hence a manually roll back mechanism is made. 
 * when an operation is to be done, the opposite operation packaged in roll back operator is put into a stack.
 * if any exception occurred in the transaction, all these roll back operator will be executed.
 * 
 * if a dao is managed in this service, its private property ldapService is linked to this service.
 * else the property is null.
 * 
 * under some situation, dao may not need transaction support. Just new a ldap dao and leave the ldap service property null. 
 * 
 * @author lulu
 *
 */
public class DefaultLdapService implements LdapService {
    
    private Logger log = Logger.getLogger(DefaultLdapService.class);
    
    private boolean isRollback = false;
    
    private Stack<RollbackOperator> rollbackOperatorStack;
    
    private LdapTenantDao ldapTenantDao;
    private LdapUserDao ldapUserDao;
    
    private LdapTemplate ldapTemplate;
    
    public void setLdapTemplate(LdapTemplate ldapTemplate) {
        this.ldapTemplate = ldapTemplate;
    }
    
    public LdapTenantDao getLdapTenantDao() {
        if (ldapTenantDao==null){
            ldapTenantDao = AppContextUtil.getBean(LdapTenantDao.LdapTenantDao, ldapTemplate);
        }
        return ldapTenantDao;
    }
    
    public LdapUserDao getLdapUserDao() {
        if (ldapUserDao==null){
            ldapUserDao = AppContextUtil.getBean(LdapUserDao.LdapUserDao, ldapTemplate);
        }
        return ldapUserDao;
    }
    
    
    public void pushRollbackOperator(RollbackOperator rollbackOperator) {
        if (rollbackOperatorStack==null){
            rollbackOperatorStack = new Stack<RollbackOperator>();
        }
        rollbackOperatorStack.push(rollbackOperator);
        if (log.isDebugEnabled()) log.debug("Default Service got a Rollback Operator(" + rollbackOperator.toString() +")");
    }

    public void close() {
        
        if (log.isDebugEnabled())log.debug("Default Ldap Service closing...");
        
        if (isRollback==false && rollbackOperatorStack==null){
            if (log.isDebugEnabled()) log.debug("Default Ldap Service closed:No operation needs rollback operator");
            return;
        }
        
        if (isRollback==false && rollbackOperatorStack!=null){
            rollbackOperatorStack.clear();
            rollbackOperatorStack=null;
            if (log.isDebugEnabled()) log.debug("Transaction commit successfully. All rollback operators are released...");
            return;
        }
        
        if (rollbackOperatorStack==null){
            log.warn("LdapService transaction is set to roll back, but no rollback operators are found...however,no roll back is operated");
            return;
        }
        
        if (log.isDebugEnabled()) log.debug("Default Ldap Service is rolling back...");
        while (!rollbackOperatorStack.isEmpty()){
            RollbackOperator rollbackOperator = rollbackOperatorStack.pop();
            if (log.isDebugEnabled()) log.debug("Default Ldap Service ("+rollbackOperator.toString()+")is rolling back...");
            try{
                rollbackOperator.rollback();
            }catch(Exception ex){
                log.warn("DefaultLdapService occured fatal error while rollback...Error data need handling manually...",ex);
            }
            if (log.isDebugEnabled()) log.debug("Default Ldap Service has rollen back...");
        }
    }

    public void setRollback() {
        isRollback = true;
    }
}
