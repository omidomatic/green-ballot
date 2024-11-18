package com.greenballot.voting.service;

public interface CaptchaStoreService {
    void storeCaptcha(String captchaId, String answer);
    boolean validateCaptcha(String captchaId, String userInput);
}
