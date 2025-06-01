package com.java.shopapp.service;

import com.java.shopapp.dto.GoogleAccountDTO;
import com.java.shopapp.dto.request.UserCreateRequest;
import com.java.shopapp.dto.request.UserUpdateRequest;
import com.java.shopapp.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserCreateRequest userCreateRequest);
    List<UserResponse> getUsers();
    UserResponse findUserById(Long userId);
    UserResponse updateUser(Long id,UserUpdateRequest userUpdateRequest);
    UserResponse getMyInfo();
    UserResponse createByGoogleAccount(GoogleAccountDTO googleAccountDTO);
    UserResponse changePassword(Long id, UserUpdateRequest userUpdateRequest);
}
