package com.greenballot.voting.user;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService service;
    @PatchMapping("/changePassword")
    public ResponseEntity<String> changePassword(
          @RequestBody ChangePasswordRequest request,
          Principal connectedUser
    ) {
        service.changePassword(request, connectedUser);
        Gson gson = new Gson();
        Map<String,String> response = new HashMap<>();
        response.put("status","success");
        return ResponseEntity.ok(gson.toJson(response));
    }

    @PreAuthorize("hasAnyRole('ADMIN_UPDATE','MANAGER_UPDATE')")
    @GetMapping("/all")
    public Page<User> getAllUsers(Pageable pageable){
        return service.getAllUsers(pageable);
    }

//    @PreAuthorize("hasAnyRole('ADMIN_UPDATE','MANAGER_UPDATE')")
    @PatchMapping("/change-role")
    public ResponseEntity<String> changeUserRole(@RequestBody ChangeRoleRequest request){
        return service.changeRole(request);
    }

}
