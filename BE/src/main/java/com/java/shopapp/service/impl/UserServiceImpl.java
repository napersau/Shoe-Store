package com.java.shopapp.service.impl;


import com.java.shopapp.dto.GoogleAccountDTO;
import com.java.shopapp.dto.request.UserCreateRequest;
import com.java.shopapp.dto.request.UserUpdateRequest;
import com.java.shopapp.dto.response.UserResponse;
import com.java.shopapp.entity.Cart;
import com.java.shopapp.entity.Role;
import com.java.shopapp.entity.User;
import com.java.shopapp.exception.AppException;
import com.java.shopapp.exception.ErrorCode;
import com.java.shopapp.repository.CartRepository;
import com.java.shopapp.repository.RoleRepository;
import com.java.shopapp.repository.UserRepository;
import com.java.shopapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;


    @Override
    public UserResponse createUser(UserCreateRequest userCreateRequest) {

        if(userRepository.existsByUsername(userCreateRequest.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }


        User user = modelMapper.map(userCreateRequest, User.class);
        user.setPassword(passwordEncoder.encode(userCreateRequest.getPassword()));
        user.setActive(true);
        Role role = roleRepository.findById(Long.valueOf(2)).get();
        user.setRole(role);

        Cart cart = Cart.builder().totalMoney(0D).build();
        cart = cartRepository.save(cart);

        user.setCart(cart);


        return modelMapper.map(userRepository.save(user), UserResponse.class);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserResponse.class))
                .toList();
    }

//    @PostAuthorize("returnObject.username == authentication.name")
    @Override
    public UserResponse findUserById(Long userId) {
        return modelMapper.map(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User Not Found")), UserResponse.class);
    }

    @Override
    public UserResponse updateUser(Long id,UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));
        BeanUtils.copyProperties(userUpdateRequest, user, getNullPropertyNames(userUpdateRequest));

        return modelMapper.map(userRepository.save(user), UserResponse.class);
    }

    private String[] getNullPropertyNames(Object source) {
        return Arrays.stream(source.getClass().getDeclaredFields())
                .filter(field -> {
                    field.setAccessible(true);
                    try {
                        return field.get(source) == null;
                    } catch (IllegalAccessException e) {
                        return false;
                    }
                })
                .map(field -> field.getName())
                .toArray(String[]::new);
    }


    @Override
    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(context).orElseThrow(()
                -> new AppException(ErrorCode.USER_NOT_EXISTED));


        return modelMapper.map(user, UserResponse.class);
    }

    @Override
    public UserResponse createByGoogleAccount(GoogleAccountDTO googleAccountDTO) {
        Optional<User> existingUser = userRepository.findByUsername(googleAccountDTO.getEmail());

        if (existingUser.isPresent()) {
            return modelMapper.map(existingUser.get(), UserResponse.class);
        }



        Role role = roleRepository.findById(2L).orElseThrow(() -> new RuntimeException("Role Not Found"));

        Cart cart = Cart.builder().totalMoney(0D).build();
        cart = cartRepository.save(cart);

        User user = new User();
        user.setUsername(googleAccountDTO.getEmail());
        user.setPassword(passwordEncoder.encode(googleAccountDTO.getEmail()));
        user.setFullName(googleAccountDTO.getName());
        user.setRole(role);
        user.setActive(true);
        user.setGoogleAccountId(1);
        user.setCart(cart);

        User savedUser = userRepository.save(user);

        return modelMapper.map(savedUser, UserResponse.class);
    }
}
