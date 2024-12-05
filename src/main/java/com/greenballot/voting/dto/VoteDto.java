package com.greenballot.voting.dto;

import com.google.gson.Gson;
import com.greenballot.voting.model.enums.Vote;
import jakarta.persistence.Entity;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VoteDto {


    private Long userId;
    private Vote vote;
    private Long projectId;

    @Override
    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this);

    }

}
