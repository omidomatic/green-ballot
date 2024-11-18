package com.greenballot.voting.dto;

import com.google.gson.Gson;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// LocationDto for location field
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LocationDto {
    private Double latitude;
    private Double longitude;
    @Override
    public String toString(){
        Gson gson = new Gson();
        return gson.toJson(this);
    }
}
