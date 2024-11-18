package com.greenballot.voting.model.error;

import com.google.gson.Gson;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Error {

    private Integer status;
    private String message;

    @Override
    public String toString(){
        Gson g = new Gson();
        return g.toJson(this);
    }

}
