package com.greenballot.voting.dto;

import com.greenballot.voting.user.Role;
import com.google.gson.Gson;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private Role role;

    @Override
    public String toString(){
        return new Gson().toJson(this);
    }
}
