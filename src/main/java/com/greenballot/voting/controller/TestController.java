package com.greenballot.voting.controller;

import com.google.gson.Gson;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping("/authorization")
    public ResponseEntity<String> test(){
        Gson g = new Gson();
        Map<String,String> response = new HashMap<>();
        response.put("authenticated","true");
        response.put("test","success");
        return ResponseEntity.ok(g.toJson(response));
    }
}
