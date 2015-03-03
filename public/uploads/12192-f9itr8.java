package com.hiservice.authentication;

import java.util.List;

import org.jboss.logging.Logger;

import com.hiservice.RequestContext;
import com.hiservice.ldap.LdapAuthenticationException;
import com.hiservice.ldap.LdapManagementException;
import com.hiservice.ldap.LdapUser;
import com.hiservice.ldap.dao.LdapUserDao;
import com.hiservice.persistence.AuthorizationDAO;
import com.hiservice.user.User;
import com.hiservice.user.UserServiceTime;

public class UserManagementServiceImpl implements UserManagementService{
    
    private static final Logger log = Logger.getLogger(UserManagementServiceImpl.class);
    
    private LdapUserDao ldapUserDao;
    
    public UserManagementServiceImpl() {
        ldapUserDao = RequestContext.getContext().getLdapService().getLdapUserDao();
    }

    public LdapUserDao getLdapUserDAO() {
        return ldapUserDao;
    }
    
    private AuthorizationDAO getAuthorizationDAO() {
        return RequestContext.getContext().getPersistenceService().getAuthorizationDAO();
    }
    
    private Long getTenantID(){
        LoginInfo loginInfo=(LoginInfo)RequestContext.getContext().getLoginInfo();
        if (loginInfo!=null){
            return loginInfo.getTenantId();
        }else{
            return null;
        }
    }
    
    public User loadUser(Long uid) {
        try{
            return getAuthorizationDAO().loadUser(uid);
        }catch(Exception ex){
            ex.printStackTrace();
            RequestContext.getContext().setRollback();
            return null;
        }
    }
    
    public void addUser(User user, String password) {
         try{
             log.info("ADD USER START...");
             getAuthorizationDAO().saveUser(user);
             
             LdapUser ldapUser = new LdapUser();
             ldapUser.setUsername(user.getUserName());
     		 ldapUser.setCompanyName(user.getCompanyName());
             ldapUser.setPassword(password);
             ldapUser.setUid(user.getId());
             
             log.info("LDAP USER:id="+ldapUser.getUid()+",username="+ldapUser.getUsername()+",companyname="+ldapUser.getCompanyName());
             
             getLdapUserDAO().createLdapUser(getTenantID(), ldapUser);
             
             log.info("ADD USER End..");
             
         }catch(LdapManagementException ex){
             RequestContext.getContext().setRollback();
             throw ex;
         }
    }
    
    public void addCasualUser(long tenantId, User user, String password) {//by wanz
        try{
            log.info("ADD USER START...");
            getAuthorizationDAO().saveUser(user);
            
            LdapUser ldapUser = new LdapUser();
            ldapUser.setUsername(user.getEmail());
    		ldapUser.setCompanyName("ÔÆÖ®¶Ë");
            ldapUser.setPassword(password);
            ldapUser.setUid(user.getId());
            
            log.info("LDAP USER:id="+ldapUser.getUid()+",username="+ldapUser.getUsername()+",companyname="+ldapUser.getCompanyName());
            
            getLdapUserDAO().createLdapUser(tenantId, ldapUser);
            
            log.info("ADD USER End..");
            
        }catch(LdapManagementException ex){
            RequestContext.getContext().setRollback();
            throw ex;
        }
   }

    public void deleteUser(Long uid) {
        try{
            getAuthorizationDAO().deleteUser(uid);
            getLdapUserDAO().deleteLdapUser(getTenantID(), uid);
        }catch(Exception ex){
            ex.printStackTrace();
            RequestContext.getContext().setRollback();
        }

    }

    public void updateUserInfo(User user) {
        try{
            getAuthorizationDAO().updateUser(user);
        }catch(Exception ex){
            ex.printStackTrace();
            RequestContext.getContext().setRollback();
        }
    }

    public void updateUserPassword(Long uid, String oldPassword,
            String newPassword) {
        try{
            getLdapUserDAO().updatePassword(getTenantID(), uid, oldPassword, newPassword);
        }catch(LdapAuthenticationException ex){
            throw ex;
        }catch(Exception ex){
            RequestContext.getContext().setRollback();
        }
    }
    
    public void resetUserPassword(Long uid, String newPassword) {
        getLdapUserDAO().resetPassword(getTenantID(), uid, newPassword);
    }
    
    public List<User> listAllUsers() {
        try{
            return getAuthorizationDAO().listAllUser();
        }catch(Exception ex){
            ex.printStackTrace();
            RequestContext.getContext().setRollback();
            return null;
        }
    }
    
    public void disableUser(Long uid) {
        try{
            if (log.isDebugEnabled()) log.debug("UserManagermentService disable start...");
            
            ldapUserDao.disableLdapUser(getTenantID(), uid);
            
            User user = loadUser(uid);
            
            user.unsetEnable();
            
            if (log.isDebugEnabled()) log.debug("UserManagermentService disable end");
        }catch(Exception ex){
            ex.printStackTrace();
            RequestContext.getContext().setRollback();
        }
    }
    
    public void enableUser(Long uid) {
        try{
            
            if (log.isDebugEnabled()) log.debug("UserManagermentService enable start...");
            
            ldapUserDao.enableLdapUser(getTenantID(), uid);
            
            User user = loadUser(uid);
            
            user.setEnable();
            
            if (log.isDebugEnabled()) log.debug("UserManagermentService enable end");
            
        }catch(Exception ex){
            ex.printStackTrace();
            RequestContext.getContext().setRollback();
        }
    }

	
	public boolean checkCasualUser(String username) {
		if(getAuthorizationDAO().checkCasualUser(username) != 0){
			return true;
		}
		else{
			return false;
		}
	}

	@Override
	public void addCasualUserServiceTime(UserServiceTime userservicetime) {
		try{
            log.info("ADD USERSERVICETIME START...");
            getAuthorizationDAO().saveUserServiceTime(userservicetime);
            
        }catch(Exception ex){
            ex.printStackTrace();
            RequestContext.getContext().setRollback();
        }
	}
}
