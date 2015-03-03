package com.hiservice.authentication;

import java.util.List;

import com.hiservice.authentication.model.ConstraintInfo;
import com.hiservice.authentication.model.SequenceInfo;
import com.hiservice.tanent.Tenant;
import com.hiservice.user.User;

/**
 * @author zby
 */
public interface TenantSchemaCopyService {
    
	public static final String TENANT_SCHEMA_COPY_SERVICE = "tenantSchemaCopyService";

    /**
     * �����⻧�µ����б����Ϣ
     */
    List<String> showAllTablesInfo(String dbUserName);
    
    /**
     * copy the tables of the standard schema
     */
    void copyAllTables(List<String> tableNames,String todbUserName,String fromdbUserName);
    
    /**
     * �����⻧�µ����м�����Ϣ
     */
    List<ConstraintInfo> showAllConstraintInfo(String dbUserName,List<String> tableNames);
    
    void copyAllConstraints(List<ConstraintInfo> constraintInfos,String targetDBuserName);
    
    /**
     * �����⻧�µ��������е���Ϣ
     */
    List<SequenceInfo> showAllSequenceInfo();
    
    /**
     * copy the sequences of the standard schema
     */
    void copyAllSequences(List<SequenceInfo> sequenceInfos,String targetDBuserName);
    
    void addTolarantIndex(String dbUserName);
    
    
    /**
     * �����⻧�Ļ�����Ϣ
     */
    void createTenant(String dbUserName,String dbPassword,int dbSize,Tenant tenant,User user,String password);
    
    void updatePersonalInfo(User user);
    
    /**
     * ɾ��һ���⻧�ı�
     */
    void dropTables(List<String> tables);
    
    /**
     * ɾ��һ���⻧������
     */
    void dropSequences(List<SequenceInfo> sequences);
    
    void dropConstraints(List<ConstraintInfo> constraintInfos);
    
}
