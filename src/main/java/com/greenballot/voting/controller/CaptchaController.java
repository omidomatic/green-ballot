package com.greenballot.voting.controller;

import com.greenballot.voting.dto.CaptchaValidationRequest;
import com.greenballot.voting.util.CaptchaUtil;
import cn.apiclub.captcha.Captcha;
import com.greenballot.voting.service.CaptchaStoreService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
@RestController
@RequestMapping("api/v1/captcha")
@RequiredArgsConstructor
@CrossOrigin
public class CaptchaController {

    private final CaptchaStoreService captchaStoreService;
    @GetMapping(value = "/generateCaptcha", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String,String> generateCaptcha(HttpServletRequest request) {
        Captcha captcha = CaptchaUtil.createCaptcha(240, 70);
        String captchaId = UUID.randomUUID().toString();
        String encodedImage = CaptchaUtil.encodeCaptcha(captcha);

        captchaStoreService.storeCaptcha(captchaId, captcha.getAnswer());
        Map<String, String> response = new HashMap<>();
        response.put("captchaId", captchaId);
        response.put("data", "data:image/png;base64," + encodedImage);
        return response;
    }

    @PostMapping("/validateCaptcha")
    public Map<String,String> validateCaptcha(@RequestBody CaptchaValidationRequest request) {
            boolean isValid = captchaStoreService.validateCaptcha(request.getCaptchaId(), request.getUserInput());

        if (isValid) {
            return Map.of("status","success");
        } else {
        return Map.of("status","captcha failed!");
        }
    }


}
