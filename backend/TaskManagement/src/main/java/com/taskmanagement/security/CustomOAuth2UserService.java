package com.taskmanagement.security;

import com.taskmanagement.model.Role;
import com.taskmanagement.model.User;
import com.taskmanagement.model.AuthProvider;
import com.taskmanagement.repository.RoleRepository;
import com.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oauth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        OAuth2UserInfo oauth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
            userRequest.getClientRegistration().getRegistrationId(),
            oauth2User.getAttributes()
        );

        if (oauth2UserInfo.getEmail() == null || oauth2UserInfo.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(oauth2UserInfo.getEmail());
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getProvider().equals(AuthProvider.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase()))) {
                throw new OAuth2AuthenticationException(
                    "Looks like you're signed up with " + user.getProvider() + " account. Please use your " + user.getProvider() + " account to login."
                );
            }
            user = updateExistingUser(user, oauth2UserInfo);
        } else {
            user = registerNewUser(userRequest, oauth2UserInfo);
        }

        return UserPrincipal.create(user, oauth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest userRequest, OAuth2UserInfo oauth2UserInfo) {
        User user = new User();
        user.setProvider(AuthProvider.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase()));
        user.setProviderId(oauth2UserInfo.getId());
        user.setEmail(oauth2UserInfo.getEmail());
        user.setName(oauth2UserInfo.getName());
        user.setUsername(oauth2UserInfo.getEmail());
        user.setEmailVerified(true);

        // Set default role
        Role userRole = roleRepository.findByName("ROLE_USER")
            .orElseGet(() -> {
                Role newRole = new Role();
                newRole.setName("ROLE_USER");
                return roleRepository.save(newRole);
            });
        user.setRoles(Set.of(userRole));

        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oauth2UserInfo) {
        existingUser.setName(oauth2UserInfo.getName());
        return userRepository.save(existingUser);
    }
}
