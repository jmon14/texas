package com.quickview_ai.entities;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "ranges")
@Data
public class Range {
    @Id
    private String id;
    
    @NotNull
    @Indexed(unique = true)
    @Field("name")
    private String name;

    @NotNull
    @Valid
    @Field("hands_range")
    private HandRange[] handsRange;

    @NotNull
    @Field("user_id")
    private String userId;
}