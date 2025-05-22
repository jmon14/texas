package com.quickview_ai.controllers;

import com.quickview_ai.entities.Range;
import com.quickview_ai.services.RangeServiceImpl;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
public class RangeController {
    private final RangeServiceImpl rangeServiceImpl;

    public RangeController(RangeServiceImpl rangeServiceImpl) {
        this.rangeServiceImpl = rangeServiceImpl;
    }

    @GetMapping("/ranges")
    public List<Range> getRanges() {
        return this.rangeServiceImpl.getAllRanges();
    }

    @GetMapping("/ranges/user/{userId}")
    public List<Range> getRangesByUserId(@PathVariable("userId") String userId) {
        return this.rangeServiceImpl.getRangesByUserId(userId);
    }

    @PostMapping("/ranges")
    public String createRange(@Valid @RequestBody Range range) {
        try {
            this.rangeServiceImpl.saveRange(range);
            return "Range created successfully";
        } catch (Exception e) {
            return "Failed to create range";
        }
    }

    @GetMapping("/ranges/{id}")
    public Range getRangeById(@PathVariable("id") String id) {
        return this.rangeServiceImpl.getRangeById(id);
    }

    @PutMapping("/ranges/{id}")
    public String updateRange(@PathVariable("id") String id, @RequestBody Range range) {
        try {
            this.rangeServiceImpl.updateRange(id, range);
            return "Range updated successfully";
        } catch (Exception e) {
            return "Failed to update range";
        }
    }

    @DeleteMapping("/ranges/{id}")
    public String deleteRange(@PathVariable("id") String id) {
        try {
            this.rangeServiceImpl.deleteRange(id);
            return "Range deleted successfully";
        } catch (Exception e) {
            return "Failed to delete range";
        }
    }
}
