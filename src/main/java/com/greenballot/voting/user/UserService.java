package com.greenballot.voting.user;

import com.google.gson.Gson;
import com.greenballot.voting.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    private final Gson gson;

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // save the new password
        repository.save(user);
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public ResponseEntity<String> changeRole(ChangeRoleRequest request) {
        Map<String, String> response = new HashMap<>();
        Optional<User> userSearch = repository.findById(request.getId());
        if (userSearch.isPresent()) {
            userSearch.get().setRole(request.getNewRole());
            repository.save(userSearch.get());
            response.put("status", "0");
            response.put("message", "Role changed successfully!");
        } else {
            response.put("status", "1");
            response.put("message", "failed to find user with specified id:" + request.getId());
        }
        return ResponseEntity.ok(gson.toJson(response));

    }
}
