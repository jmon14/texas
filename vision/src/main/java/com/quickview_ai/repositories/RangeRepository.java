package com.quickview_ai.repositories;

import com.quickview_ai.entities.Range;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RangeRepository extends MongoRepository<Range, String> {
}
