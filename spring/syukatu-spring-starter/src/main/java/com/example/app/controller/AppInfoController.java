package com.example.app.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/app-info")
public class AppInfoController {

	private final String code;
	private final String name;

	public AppInfoController(
			@Value("${app.code}") String code,
			@Value("${app.name}") String name) {
		this.code = code;
		this.name = name;
	}

	// アプリ設定（application.properties の app.code / app.name）の取得
	@GetMapping
	public ResponseEntity<Map<String, String>> getAppInfo() {
		return new ResponseEntity<>(Map.of("code", code, "name", name), HttpStatus.OK);
	}

}
