package com.greenballot.voting.auth;

import com.google.gson.Gson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {

  private String email;
  private String password;

  @Override
  public String toString(){
    return new Gson().toJson(this);
  }
}
