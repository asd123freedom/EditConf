package com.hiservice.authentication;

import java.util.List;

import com.hiservice.user.User;
import com.hiservice.user.UserServiceTime;

public interface UserManagementService {
    public static final String service_name = "userManagementService";
	
    User loadUser(Long uid);

    void addUser(User user, String password);
    
    void addCasualUser(long tenantId, User user, String password); //by wanz添加临时用户
    
    void addCasualUserServiceTime(UserServiceTime userservicetime); //by wanz为临时用户添加到期时间
    
    void deleteUser(Long uid);

    void updateUserPassword(Long uid, String oldPassword, String newPassword);
    
    void resetUserPassword(Long uid, String newPassword);
    
    void updateUserInfo(User user);
    
    List<User> listAllUsers();
    
    void enableUser(Long uid);
    
    void disableUser(Long uid);
    
    boolean checkCasualUser(String username);//by wanz
}
