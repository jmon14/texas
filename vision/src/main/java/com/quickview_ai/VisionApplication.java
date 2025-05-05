package com.quickview_ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class VisionApplication {
	public static void main(String[] args) {
		SpringApplication.run(VisionApplication.class, args);
	}
}
