package com.example.app.domain;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

/** ログインリクエスト（ユーザーIDと平文パスワード。照合は BCrypt で行う） */
@Data
public class LoginRequest {

	@NotBlank
	private String username;

	@NotBlank
	private String password;

}
