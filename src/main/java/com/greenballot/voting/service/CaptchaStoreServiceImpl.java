package com.greenballot.voting.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class CaptchaStoreServiceImpl implements CaptchaStoreService {

    private final ConcurrentHashMap<String, String> captchaStorage = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> captchaExpiration = new ConcurrentHashMap<>();

    @Override
    public void storeCaptcha(String captchaId, String answer) {
        captchaStorage.put(captchaId, answer);
        // Set captcha to expire after 10 minutes
        captchaExpiration.put(captchaId, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(10));
    }

    @Override
    public boolean validateCaptcha(String captchaId, String userInput) {
        Long expirationTime = captchaExpiration.get(captchaId);
        if (expirationTime == null || System.currentTimeMillis() > expirationTime) {
            // Captcha is expired or does not exist
            captchaStorage.remove(captchaId);
            captchaExpiration.remove(captchaId);
            return false;
        }
        String correctAnswer = captchaStorage.remove(captchaId);
        captchaExpiration.remove(captchaId);
        return correctAnswer != null && correctAnswer.equals(userInput);
    }

    // Scheduled task to clean up expired captchas
    @Scheduled(fixedDelay = 60000) // runs every 60 seconds
    public void cleanupExpiredCaptchas() {
        long now = System.currentTimeMillis();
        Iterator<String> iterator = captchaExpiration.keySet().iterator();

        while (iterator.hasNext()) {
            String key = iterator.next();
            Long expirationTime = captchaExpiration.get(key);
            if (expirationTime == null || now > expirationTime) {
                iterator.remove();
                captchaStorage.remove(key);
            }
        }
    }
}
