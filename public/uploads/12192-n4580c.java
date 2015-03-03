package com.hiservice.authentication;

import com.hiservice.ldap.LdapAuthenticationException;
import com.hiservice.ldap.LdapConnectionException;
import com.hiservice.ldap.LdapManagementException;

public interface AuthenticationService {

    String DOMAINBASE = "dc=hiservice,dc=com";

    LoginInfo login(String username, String companyname, String password)
            throws LdapManagementException, LdapConnectionException,
            LdapAuthenticationException;

}
