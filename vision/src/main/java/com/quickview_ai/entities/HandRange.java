package com.quickview_ai.entities;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HandRange {
    @NotNull
    private Float rangeFraction;

    @NotNull
    private String label;

    @NotNull
    @Valid
    private Action[] actions;
}
