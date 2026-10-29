package com.example.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

/**
 * ログインユーザー（app_users）
 * パスワードは BCrypt のハッシュ値で保持し、API レスポンスには含めない。
 */
@Data
public class AppUser {

	private Integer id;

	private String username;

	@JsonIgnore
	private String passwordHash;

	private String displayName;

}
