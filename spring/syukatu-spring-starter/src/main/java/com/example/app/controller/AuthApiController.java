package com.example.app.controller;

import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.domain.AppUser;
import com.example.app.domain.LoginRequest;
import com.example.app.service.MemoService;

import lombok.RequiredArgsConstructor;

/**
 * ログイン API
 * ユーザーIDとパスワードを app_users の BCrypt ハッシュと照合する。
 * 成功時はユーザーIDと表示名のみを返し、パスワードハッシュは返さない。
 * フロント側はログイン中のユーザーIDを保持し、メモ保存時に
 * 登録ユーザー／更新ユーザーとして送信する。
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthApiController {
	private final MemoService service;

	@PostMapping("/login")
	public ResponseEntity<?> login(
			@RequestBody @Valid LoginRequest request,
			Errors errors) {
		if (errors.hasErrors()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("message", "ユーザーIDとパスワードを入力してください"));
		}
		AppUser user = service.login(request.getUsername(), request.getPassword());
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "ユーザーIDまたはパスワードが違います"));
		}
		return new ResponseEntity<>(
				Map.of("username", user.getUsername(), "displayName", user.getDisplayName()),
				HttpStatus.OK);
	}

}
