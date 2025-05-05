package com.quickview_ai.entities;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Action {
    @NotNull
    private ActionType type;

    @NotNull
    private Float percentage;
}
