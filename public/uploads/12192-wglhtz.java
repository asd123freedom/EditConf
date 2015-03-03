package com.hiservice.authentication;

import com.hiservice.ldap.LdapTenant;
import com.hiservice.ldap.LdapUser;

public class LoginInfo {

    private String username;
    private String companyName;
    private Long uid;
    private Long tenantId;
    private String tenantDBUserName;
    private String tenantDBPassword;
    private boolean tenantAdmin;
    private String customIpAddr;
    
    public LoginInfo(String tenantDBUserName, String tenantDBPassword){
        this.tenantDBUserName = tenantDBUserName;
        this.tenantDBPassword = tenantDBPassword;
    }

    public LoginInfo(LdapTenant tenant, LdapUser user) {
        this.username = user.getUsername();
        this.companyName = user.getCompanyName();
        this.uid = user.getUid();
        this.tenantId = tenant.getTenantId();
        this.tenantDBUserName = tenant.getTenantDBUserName();
        this.tenantDBPassword = tenant.getTenantDBPassword();
        this.tenantAdmin = tenant.isAdmin();
    }

    public LoginInfo(String username, String companyName, Long uid, Long tenantId,
            String tenantDBUserName, String tenantDBPassword, boolean admin) {
        this.username = username;
        this.companyName = companyName;
        this.uid = uid;
        this.tenantId = tenantId;
        this.tenantDBUserName = tenantDBUserName;
        this.tenantDBPassword = tenantDBPassword;
        this.tenantAdmin = admin;
    }


    public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public Long getUid() {
        return uid;
    }

    public void setUid(Long uid) {
        this.uid = uid;
    }

    public Long getTenantId() {
        return tenantId;
    }

    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }

    public String getTenantDBUserName() {
        return tenantDBUserName;
    }

    public void setTenantDBUserName(String tenantDBUserName) {
        this.tenantDBUserName = tenantDBUserName;
    }

    public String getTenantDBPassword() {
        return tenantDBPassword;
    }

    public void setTenantDBPassword(String tenantDBPassword) {
        this.tenantDBPassword = tenantDBPassword;
    }

	public boolean isAdmin() {
		return tenantAdmin;
	}

	public void setAdmin(boolean admin) {
		this.tenantAdmin = admin;
	}

	public void setCustomIpAddr(String customIpAddr) {
		this.customIpAddr = customIpAddr;
	}

	public String getCustomIpAddr() {
		return customIpAddr;
	}
	
}
