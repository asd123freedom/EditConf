package com.hiservice.authentication;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;

import org.springframework.ldap.AuthenticationException;
import org.springframework.ldap.CommunicationException;
import org.springframework.ldap.NameNotFoundException;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.DistinguishedName;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.AbstractContextMapper;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.ldap.support.LdapUtils;

import com.hiservice.ldap.LdapAuthenticationException;
import com.hiservice.ldap.LdapConnectionException;
import com.hiservice.ldap.LdapManagementException;
import com.hiservice.ldap.LdapTenant;
import com.hiservice.ldap.LdapUser;
import com.hiservice.ldap.LdapUserDisabledException;
import com.hiservice.ldap.LdapAuthenticationException.LdapAuthenticationExceptionType;
import com.hiservice.ldap.LdapManagementException.LdapManagementExceptionType;
import com.hiservice.ldap.dao.LdapTenantDao;
import com.hiservice.ldap.dao.LdapTenantDaoImpl;
import com.hiservice.ldap.dao.LdapUserDao;
import com.hiservice.ldap.dao.LdapUserDaoImpl;

/**
 * 
 * @author lulu
 * ʵ��ע��
 * 
 * ÿ����������Ҫ�¿����ӣ�ʹ�ú��漴�رա�
 * ԭ������ʹ����Spring Ldap�е�LdapTemplate�ࡣ�����ṩ�˸��������������ά����
 * 
 * 
 * ʹ��Root��ݻ�ȡ��¼��Ϣ��������ʹ���û���������
 * 
 * �ɸĽ��ĵط���
 * 1��
 */
public class LdapAuthenticationService implements AuthenticationService {

	private LdapTemplate ldapTemplate;
	private LdapTenantDao ldapTenantDao;
	private LdapUserDao ldapUserDao;

	public void setLdapTemplate(LdapTemplate ldapTemplate) {
		this.ldapTemplate = ldapTemplate;
	}



	/**
     * ��֤����
     */
	@SuppressWarnings("unchecked")
	public LoginInfo login(String username, String companyname, String password)
			throws LdapManagementException, LdapConnectionException,
			LdapAuthenticationException {

		ldapTenantDao = new LdapTenantDaoImpl(ldapTemplate);
		ldapUserDao = new LdapUserDaoImpl(ldapTemplate);
		String filter = "(&(companyName=" + companyname + ")(username=" + username + "))";   
		List<String> result = null;
		try {
			result = (List<String>) this.ldapTemplate.search(
					DistinguishedName.EMPTY_PATH, filter ,new AbstractContextMapper() {
						@Override
						protected Object doMapFromContext(
								DirContextOperations ctx) {
							return ctx.getNameInNamespace();
						}
					}
					);
		} catch (NameNotFoundException ex) {
			throw new LdapManagementException(
					LdapManagementExceptionType.UserNotExist);
		} catch (CommunicationException ex) {
			ex.printStackTrace();
			throw new LdapConnectionException();
		}
		assert result.size() > 1 : "��Ӧ���ڶ����ͬ�û����û����������û�����";

		if (result.size() == 0) {
			throw new LdapManagementException(
					LdapManagementExceptionType.UserNotExist);
		}
		String dn = result.get(0);

		DirContext ctx = null;
		try {
			ctx = this.ldapTemplate.getContextSource().getContext(dn, password);
		} catch (AuthenticationException ex) {
			throw new LdapAuthenticationException(
					LdapAuthenticationExceptionType.WrongPassword);
		} catch (CommunicationException ex) {
			throw new LdapConnectionException();
		} catch (NameNotFoundException ex) {
			throw new LdapManagementException(
					LdapManagementExceptionType.UserNotExist);
		} finally {
			if (ctx != null) {
				LdapUtils.closeContext(ctx);// �����׳��쳣
			}
		}

		Long tenantId = getTenantFromDn(dn);
		Long uid = getUidFromDn(dn);

		LdapTenant ldapTenant = this.ldapTenantDao.getLdapTenant(tenantId);
		LdapUser ldapUser = this.ldapUserDao.getLdapUser(tenantId, uid);

		if (ldapUser.getEnable())
			return new LoginInfo(ldapTenant, ldapUser);
		else
			throw new LdapUserDisabledException();
	}
	private Long getUidFromDn(String dn) {

		Pattern pattern = Pattern.compile("^uid=([\\w\\.-_@]*?),ou.*?$");
		Matcher matcher = pattern.matcher(dn);
		if (matcher.matches()) {
			return Long.parseLong(matcher.group(1));
		} else {
			return null;
		}

	}

	private Long getTenantFromDn(String dn) {
		Pattern pattern = Pattern
				.compile("^uid=.*,\\s*?ou=([\\w\\.-_@]*?),.*$");
		Matcher matcher = pattern.matcher(dn);
		if (matcher.matches()) {
			return Long.parseLong(matcher.group(1));
		} else {
			return null;
		}
	}

	public void close() {
		 //��ǰ��ʵ����ÿ��ԭ�Ӳ������ڶ��������ӣ������������ر�
		}

    @SuppressWarnings("unchecked")
	public List<LdapTenant> getTenants(){
 
    	return (List<LdapTenant>)this.ldapTemplate.search("",
                new EqualsFilter("objectClass", "TenantInfo").encode(),
                new TenantAttributesMapper());
    }
    
    // add by zby
    @SuppressWarnings("unchecked")
    public LdapTenant getTenant(String ou){
    	DistinguishedName dn = new DistinguishedName();
        dn.add("ou",ou);
        List<LdapTenant> ldapTenants;
		try {
			ldapTenants = (List<LdapTenant>)this.ldapTemplate.search(dn,
					new EqualsFilter("objectClass", "TenantInfo").encode(),
					new AttributesMapper() {
			            public Object mapFromAttributes(Attributes attrs) throws NamingException {
			            	LdapTenant tenant = new LdapTenant();
			            	tenant.setTenantDBUserName(attrs.get("tenantDBUserName").get().toString());
			            	return tenant;
			            }
			        });
			return ldapTenants.get(0);
		} catch (Exception e) {
			return null;
		}
    }
    
    public class TenantAttributesMapper	implements	AttributesMapper{

		public Object mapFromAttributes(Attributes arg0) throws NamingException {
			LdapTenant tenant = new LdapTenant();
			tenant.setTenantDBPassword((String)arg0.get("tenantDBPassword").get());
			tenant.setTenantDBUserName((String)arg0.get(("tenantDBUserName")).get());
			tenant.setTenantId(Long.parseLong((String) arg0.get("tenantId").get()));
			return tenant;
		}
    }
    @SuppressWarnings("unchecked")
    public int getUsernum(String ou){
    	DistinguishedName dn = new DistinguishedName();
        dn.add("ou",ou);
        List<LdapUser> users = (List<LdapUser>)this.ldapTemplate.search(dn, new EqualsFilter(
                "objectClass", "UserInfo").encode(), new AttributesMapper() {
            public Object mapFromAttributes(Attributes attrs)
                    throws NamingException {
                return attrs.get("mail").get();
            }
        });
    	return users.size();
    }
//  ����ou��tenant id���һ���⻧�µ������û�
    @SuppressWarnings("unchecked")
    public List<LdapUser> getUsers(String ou){
    	DistinguishedName dn = new DistinguishedName();
        dn.add("ou",ou);
        List<LdapUser> users = (List<LdapUser>)this.ldapTemplate.search(dn, new EqualsFilter(
                "objectClass", "UserInfo").encode(), new AttributesMapper() {
            public Object mapFromAttributes(Attributes attrs)
                    throws NamingException {
                return attrs.get("mail").get();
            }
        });
    	return users;
    }
    
    @SuppressWarnings("unchecked")
    public List<LdapUser> getUsersByou(String ou){
    	DistinguishedName dn = new DistinguishedName();
        dn.add("ou",ou);
        List<LdapUser> users = (List<LdapUser>)this.ldapTemplate.search(dn, new EqualsFilter(
                "objectClass", "UserInfo").encode(), new AttributesMapper() {
            public Object mapFromAttributes(Attributes attrs)
                    throws NamingException {
            	LdapUser user = new LdapUser();
            	user.setUsername(attrs.get("username").get().toString());
            	user.setCompanyName(attrs.get("companyName").get().toString());
            	user.setUid(Long.valueOf(attrs.get("uid").get().toString()));
                return user;
            }
        });
    	return users;
    }
   
}
