package com.greenballot.voting.user;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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


}
