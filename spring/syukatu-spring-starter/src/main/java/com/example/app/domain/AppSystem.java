package com.example.app.domain;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Data;

/**
 * システム設定（アプリ種別）
 * 「就職活動メモシステム」など、項目1〜50の項目設定を持つ単位。
 */
@Data
public class AppSystem {

	private Integer id;

	@NotBlank
	@Size(max = 50)
	@Pattern(regexp = "[a-z0-9][a-z0-9_-]*", message = "システムコードは半角英小文字・数字・ハイフンで入力してください")
	private String systemCode;

	@NotBlank
	@Size(max = 100)
	private String systemName;

	@NotNull
	@Min(0)
	private Integer displayOrder;

}
