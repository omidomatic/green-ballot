package com.greenballot.voting.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CaptchaValidationRequest {
    private String captchaId;
    private String userInput;

    // Getters and setters omitted for brevity
}
