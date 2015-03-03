package com.hiservice.authentication;

import java.util.Date;
import java.util.List;

import org.jboss.logging.Logger;
import org.springframework.ldap.core.LdapTemplate;

import com.hiservice.RequestContext;
import com.hiservice.authentication.model.ConstraintInfo;
import com.hiservice.authentication.model.SequenceInfo;
import com.hiservice.ldap.LdapTenant;
import com.hiservice.ldap.LdapUser;
import com.hiservice.ldap.dao.LdapTenantDao;
import com.hiservice.ldap.dao.LdapUserDao;
import com.hiservice.persistence.TenantSchemaCopyDao;
import com.hiservice.tanent.Tenant;
import com.hiservice.user.User;
import com.hiservice.util.AppContextUtil;

public class TenantSchemaCopyServiceImpl implements TenantSchemaCopyService {

	private Logger log = Logger.getLogger(TenantSchemaCopyServiceImpl.class);

	private LdapTenantDao ldapTenantDao;
	private LdapUserDao ldapUserDao;

	public TenantSchemaCopyServiceImpl() {

		LdapTemplate ldapTemplate = AppContextUtil.getBean("ldapTemplate");
		ldapTenantDao = AppContextUtil.getBean("ldapTenantDao", ldapTemplate);
		ldapUserDao = AppContextUtil.getBean("ldapUserDao", ldapTemplate);
	}

	private static LdapTenant createContext(String dbUserName, String dbPassword) {
		LdapTenant ldapTenant = new LdapTenant();
		ldapTenant.setTenantDBUserName(dbUserName);
		ldapTenant.setTenantDBPassword(dbPassword);
		LoginInfo loginInfo = new LoginInfo(ldapTenant, new LdapUser());
		RequestContext.createContext(loginInfo);
		return ldapTenant;
	}

	public List<String> showAllTablesInfo(String dbUserName) {
		TenantSchemaCopyDao tenantSchemaCopyDao = RequestContext.getContext()
				.getPersistenceService().getTenantSchemaCopyDao();
		return tenantSchemaCopyDao.showAllTablesInfo(dbUserName);
	}

	public void copyAllTables(List<String> tableNames, String todbUserName,
			String fromdbUserName) {
		RequestContext.getContext().getPersistenceService()
				.getTenantSchemaCopyDao().copyAllTables(tableNames,
						todbUserName, fromdbUserName);
	}

	public List<ConstraintInfo> showAllConstraintInfo(String dbUserName,
			List<String> tableNames) {
		TenantSchemaCopyDao tenantSchemaCopyDao = RequestContext.getContext()
				.getPersistenceService().getTenantSchemaCopyDao();
		return tenantSchemaCopyDao
				.showAllConstraintInfo(dbUserName, tableNames);
	}

	public List<SequenceInfo> showAllSequenceInfo() {
		TenantSchemaCopyDao tenantSchemaCopyDao = RequestContext.getContext()
				.getPersistenceService().getTenantSchemaCopyDao();
		return tenantSchemaCopyDao.showAllSequenceInfo();
	}

	public void copyAllSequences(List<SequenceInfo> sequenceInfos,
			String targetDBuserName) {
		TenantSchemaCopyDao tenantSchemaCopyDao = RequestContext.getContext()
				.getPersistenceService().getTenantSchemaCopyDao();
		tenantSchemaCopyDao.copyAllSequences(sequenceInfos, targetDBuserName);
	}

	public void copyAllConstraints(List<ConstraintInfo> constraintInfos,String targetDBuserName) {
		TenantSchemaCopyDao tenantSchemaCopyDao = RequestContext.getContext().getPersistenceService().getTenantSchemaCopyDao();
		tenantSchemaCopyDao.copyAllConstraints(constraintInfos,targetDBuserName);
	}

	public void addTolarantIndex(String dbUserName) {
		TenantSchemaCopyDao tenantSchemaCopyDao = RequestContext.getContext()
				.getPersistenceService().getTenantSchemaCopyDao();
		tenantSchemaCopyDao.addTolarantIndex(dbUserName);
	}

	public void createTenant(String dbUserName, String dbPassword, int dbSize,
			Tenant tenant, User user, String password) {
		if (log.isInfoEnabled()) log.info("Creating Tenant...");

		Date now = new Date();
		tenant.setCreateTime(now.getTime());
		
		
		if (log.isDebugEnabled()) log.debug("Creating ldapTenant...");
		
		LdapTenant ldapTenant = createContext(dbUserName, dbPassword);
		ldapTenant.setTenantId(tenant.getId());
		ldapTenantDao.createLdapTenant(ldapTenant);
		
		if (log.isDebugEnabled()) log.debug("Creating ldapTenant done");
		if (log.isDebugEnabled()) log.debug("Creating Tenant...initialing new schema...creating Profile/Role/User infomations...");
		
		LdapUser ldapUser = new LdapUser();
		ldapUser.setUsername(user.getUserName());
		ldapUser.setCompanyName(user.getCompanyName());
		ldapUser.setPassword(password);
		ldapUser.setUid(user.getId());
		ldapUserDao.createLdapUser(tenant.getId(), ldapUser);
		
        if (log.isDebugEnabled()) log.debug("Createing ldapUser Infomation done");

		RequestContext.getContext().close();
		
        if (log.isInfoEnabled()) log.info("Creating Tenant done!Congratulations!=.=||");

	}

	public void updatePersonalInfo(User user) {
		TenantSchemaCopyDao tenantSchemaCopyDao = RequestContext.getContext()
		.getPersistenceService().getTenantSchemaCopyDao();
		tenantSchemaCopyDao.updatePersonalInfo(user);
	}
	
	public void dropTables(List<String> tables){
		TenantSchemaCopyDao tenantSchemaCopyDao = RequestContext.getContext()
		.getPersistenceService().getTenantSchemaCopyDao();
		tenantSchemaCopyDao.dropTables(tables);
	}

	public void dropSequences(List<SequenceInfo> sequences) {
		TenantSchemaCopyDao tenantSchemaCopyDao = RequestContext.getContext()
		.getPersistenceService().getTenantSchemaCopyDao();
		tenantSchemaCopyDao.dropSequences(sequences);
	}

	public void dropConstraints(List<ConstraintInfo> constraintInfos) {
		TenantSchemaCopyDao tenantSchemaCopyDao = RequestContext.getContext()
		.getPersistenceService().getTenantSchemaCopyDao();
		tenantSchemaCopyDao.dropConstraints(constraintInfos);
	}
}
