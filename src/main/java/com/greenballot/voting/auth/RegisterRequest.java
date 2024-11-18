package com.greenballot.voting.auth;

import com.greenballot.voting.user.Role;
import com.google.gson.Gson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {


  private String firstname;
  private String lastname;
  private String email;
  private String walletAddress;
  private String password;
  private Role role;

  @Override
  public String toString(){
    return new Gson().toJson(this);
  }
}
