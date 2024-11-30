package com.greenballot.voting.user;

import lombok.*;
import org.springframework.context.annotation.Primary;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeRoleRequest {
    private Integer id;
    private Role newRole;
}
