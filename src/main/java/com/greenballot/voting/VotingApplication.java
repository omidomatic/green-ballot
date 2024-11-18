package com.greenballot.voting;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import java.nio.file.Paths;

@SpringBootApplication
@EnableCaching
public class VotingApplication {

    public static void main(String[] args) {
        SpringApplication.run(VotingApplication.class, args);
    }
//    @Autowired
//    private AuthenticationService authenticationService;
//    @PostConstruct
//    private void registerAdminUser() throws Exception {
//        RegisterRequest request = RegisterRequest.builder()
//                .firstname("Omid")
//                .lastname("Abbasi")
//                .role(Role.ADMIN)
//                .email("omidpbvb@gmail.com")
//                .password("12345678")
//                .build();
//        AuthenticationResponse response = authenticationService.register(request);
//        System.out.println("<Admin User Added>");
//        System.out.println("AccessToken: " + response.getAccessToken());
//        System.out.println("RefreshToken: " + response.getRefreshToken());
//
//        String currentPath = Paths.get("").toAbsolutePath().toString();
//        System.out.println("Current file system path: " + currentPath);
//    }
}
