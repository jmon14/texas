package com.quickview_ai.repositories;

import com.quickview_ai.entities.Range;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RangeRepository extends MongoRepository<Range, String> {
    List<Range> findByUserId(String userId);
}
