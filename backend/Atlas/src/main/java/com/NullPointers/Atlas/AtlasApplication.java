package com.NullPointers.Atlas;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AtlasApplication {
	public static void main(String[] args) {
		SpringApplication.run(AtlasApplication.class, args);
	}
}
