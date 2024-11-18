package com.greenballot.voting.auth;


import com.google.gson.Gson;
import lombok.*;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateWalletRequestDto {


  private String firstname;
  private String lastname;
  private String email;


  @Override
  public String toString(){
    return new Gson().toJson(this);
  }
}
