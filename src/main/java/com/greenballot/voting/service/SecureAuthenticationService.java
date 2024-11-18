package com.greenballot.voting.service;

import com.greenballot.voting.auth.AuthenticationRequest;
import com.greenballot.voting.auth.AuthenticationResponse;
import com.greenballot.voting.auth.RegisterRequest;
import com.greenballot.voting.token.Token;
import com.greenballot.voting.repository.TokenRepository;
import com.greenballot.voting.token.TokenType;
import com.greenballot.voting.user.User;
import com.greenballot.voting.repository.UserRepository;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SecureAuthenticationService {

    private final Gson gson;

    @Value("${accountServer.address}")
    private String secureServerUrl;

    @Value("${accountServer.authUrl}")
    private String authUrl;

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    public AuthenticationResponse register(RegisterRequest request) throws Exception {
        String url = secureServerUrl + authUrl + "/register";

        HttpClient httpClient = HttpClient.newHttpClient();
        String requestBody = request.toString();
        HttpRequest registerRequest = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .version(HttpClient.Version.HTTP_2)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
        try {
            HttpResponse<String> response = httpClient.send(registerRequest, HttpResponse.BodyHandlers.ofString());

            HttpHeaders headers = response.headers();
            for (Map.Entry<String, java.util.List<String>> entry : headers.map().entrySet()) {
                System.out.println(entry.getKey() + ": " + entry.getValue());
            }
            JsonParser jsonParser = new JsonParser();
            JsonObject jsonObject = jsonParser.parse(response.body()).getAsJsonObject();

            AuthenticationResponse authenticationResponse = AuthenticationResponse.builder()
                    .accessToken(jsonObject.get("access_token").getAsString())
                    .refreshToken(jsonObject.get("refresh_token").getAsString())
                    .build();


            return authenticationResponse;
        } catch (Exception e) {
            System.err.println("Error making POST request: " + e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) throws Exception {
        String url = secureServerUrl + authUrl + "/authenticate";

        HttpClient httpClient = HttpClient.newHttpClient();
        String requestBody = request.toString();
        HttpRequest registerRequest = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .version(HttpClient.Version.HTTP_2)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
        try {
            HttpResponse<String> response = httpClient.send(registerRequest, HttpResponse.BodyHandlers.ofString());

            HttpHeaders headers = response.headers();
            for (Map.Entry<String, java.util.List<String>> entry : headers.map().entrySet()) {
                System.out.println(entry.getKey() + ": " + entry.getValue());
            }
            JsonParser jsonParser = new JsonParser();
            JsonObject jsonObject = jsonParser.parse(response.body()).getAsJsonObject();

            AuthenticationResponse authenticationResponse = AuthenticationResponse.builder()
                    .accessToken(jsonObject.get("access_token").getAsString())
                    .refreshToken(jsonObject.get("refresh_token").getAsString())
                    .build();
            return authenticationResponse;
        } catch (Exception e) {
            System.err.println("Error making POST request: " + e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    public String getRole(String authorization) throws Exception {
        String baseUrl = secureServerUrl + authUrl + "/getRole";

        HttpClient httpClient = HttpClient.newHttpClient();
        Map<String, String> params = new HashMap<>();
        params.put("Authorization", authorization);

        // Build the query string
        StringBuilder queryString = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (queryString.length() > 0) {
                queryString.append("&");
            }
            queryString.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
            queryString.append("=");
            queryString.append(URLEncoder.encode(entry.getValue(), "UTF-8"));
        }

        // Create the full URL with parameters
        String url = baseUrl + "?" + queryString.toString();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            return response.body();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }

    }

}
