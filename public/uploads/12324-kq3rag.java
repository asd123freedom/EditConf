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
     * 返回租户下的所有表的信息
     */
    List<String> showAllTablesInfo(String dbUserName);
    
    /**
     * copy the tables of the standard schema
     */
    void copyAllTables(List<String> tableNames,String todbUserName,String fromdbUserName);
    
    /**
     * 返回租户下的所有键的信息
     */
    List<ConstraintInfo> showAllConstraintInfo(String dbUserName,List<String> tableNames);
    
    void copyAllConstraints(List<ConstraintInfo> constraintInfos,String targetDBuserName);
    
    /**
     * 返回租户下的所有序列的信息
     */
    List<SequenceInfo> showAllSequenceInfo();
    
    /**
     * copy the sequences of the standard schema
     */
    void copyAllSequences(List<SequenceInfo> sequenceInfos,String targetDBuserName);
    
    void addTolarantIndex(String dbUserName);
    
    
    /**
     * 创建租户的基本信息
     */
    void createTenant(String dbUserName,String dbPassword,int dbSize,Tenant tenant,User user,String password);
    
    void updatePersonalInfo(User user);
    
    /**
     * 删除一个租户的表
     */
    void dropTables(List<String> tables);
    
    /**
     * 删除一个租户的序列
     */
    void dropSequences(List<SequenceInfo> sequences);
    
    void dropConstraints(List<ConstraintInfo> constraintInfos);
    
}
