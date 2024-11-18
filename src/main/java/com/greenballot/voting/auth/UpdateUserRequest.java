package com.greenballot.voting.auth;

import com.google.gson.Gson;
import lombok.*;

@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {

  private String oldEmail;
  private String firstname;
  private String lastname;
  private String email;
  private String walletAddress;


  @Override
  public String toString(){
    return new Gson().toJson(this);
  }
}
