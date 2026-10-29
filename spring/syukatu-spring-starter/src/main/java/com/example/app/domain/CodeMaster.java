package com.example.app.domain;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;

/**
 * コードマスタ
 * システムごとに、コードID配下の設定コード（ドロップダウンの選択肢など）を管理する。
 * 項目設定（item_settings）のコードIDと紐づき、メモに保存される値は設定コード、
 * 画面表示には文字列1を使う。
 */
@Data
public class CodeMaster {

	@NotNull
	private Integer systemId;

	@NotBlank
	@Size(max = 50)
	private String codeId;

	@NotBlank
	@Size(max = 50)
	private String settingCode;

	@Size(max = 255)
	private String text1;

	@Size(max = 255)
	private String text2;

	@Size(max = 255)
	private String text3;

	private BigDecimal num1;

	private BigDecimal num2;

	private BigDecimal num3;

	@NotNull
	@Min(0)
	private Integer displayOrder;

}
