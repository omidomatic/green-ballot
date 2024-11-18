package com.greenballot.voting.dto;


import com.google.gson.Gson;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FundingAllocationDto {
    private String title;
    private Integer percentage;

    @Override
    public String toString(){
        Gson gson = new Gson();
        return gson.toJson(this);
    }
}
