package com.greenballot.voting.auth;

import com.greenballot.voting.service.SecureAuthenticationService;
import com.greenballot.voting.user.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthenticationController {

    private final AuthenticationService service;
    private final SecureAuthenticationService secureAuthenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) throws Exception {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) throws Exception {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }

    @GetMapping("/getRole")
    public ResponseEntity<Map<String, String>> getRole(@RequestParam(value = "Authorization", required = false) String authorization) throws Exception {
        Map<String, String> roles = new HashMap<>();
        if (authorization == null) {
            roles.put("roles", "VIEWER");
            return ResponseEntity.ok(roles);
        }
        roles.put("roles", service.getRole(authorization));
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/getUser")
    public ResponseEntity<Map<String,String>> getUser(@RequestParam(value = "Authorization") String authorization) {
        User user = service.getUser(authorization);
        Map<String,String> response = new HashMap<>();
        response.put("id",user.getId().toString());
        response.put("firstname",user.getFirstname());
        response.put("lastname",user.getLastname());
        response.put("email",user.getEmail());
        response.put("walletAddress",user.getWalletAddress());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/updateUser")
    public ResponseEntity<Map<String,String>> updateUser(@RequestBody UpdateUserRequest request){
        Map<String,String> response = new HashMap<>();
        String status = service.updateUser(request);
        response.put("status",status);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/getUsers")
    public ResponseEntity<List<String>> getUsers(){
        return ResponseEntity.ok(service.getUsers());
    }

//    @PostMapping("/changePassword")
//    public ResponseEntity<AuthenticationResponse> changePassword(@RequestBody UpdatePasswordRequest request){
//        service.changePassword(request);
//
//    }


}
