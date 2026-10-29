package com.example.app.controller;

import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.domain.AppSystem;
import com.example.app.service.MemoService;

import lombok.RequiredArgsConstructor;

/**
 * システム設定（アプリ種別）の API
 * システムを追加すると、そのシステム専用の項目設定（項目1〜50）が用意される。
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/systems")
public class SystemApiController {
	private final MemoService service;

	// システムリストの取得（表示順）
	@GetMapping
	public ResponseEntity<List<AppSystem>> getSystems() {
		return new ResponseEntity<>(service.getAllSystems(), HttpStatus.OK);
	}

	// システムの追加（項目設定も初期作成される）
	@PostMapping
	public ResponseEntity<Void> addSystem(
			@RequestBody @Valid AppSystem appSystem,
			Errors errors) {
		if (errors.hasErrors()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		service.addSystem(appSystem);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	// システムの編集（システム名・表示順）
	@PutMapping
	public ResponseEntity<Void> updateSystem(
			@RequestBody @Valid AppSystem appSystem,
			Errors errors) {
		if (errors.hasErrors()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		service.editSystem(appSystem);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	// システムの削除（メモが存在するシステム・最後のシステムは削除不可）
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteSystem(@PathVariable int id) {
		try {
			service.deleteSystem(id);
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("message", e.getMessage()));
		}
	}

}
