package com.example.app.domain;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class ItemSetting {

	@NotNull
	private Integer systemId;

	@NotNull
	private Integer columnNo;

	@Size(max = 100)
	private String displayName;

	private Boolean isVisible;

	/** 必須項目かどうか（必須の場合は編集画面で項目名に赤い「*」を表示し、未入力は保存不可） */
	private Boolean isRequired;

	@Pattern(regexp = "STRING|MEMO|NUMERIC|CHECKBOX")
	private String dataType;

	@Min(1)
	@Max(200)
	private Integer displayWidth;

	private Boolean isUrl;

	private Integer displayOrder;

	/** コードマスタのコードID（指定時は編集画面でドロップダウン表示になる） */
	@Size(max = 50)
	private String codeId;

	/** 初期値（新規登録時にあらかじめセットされる値。%Y・%m・%d・%H・%i・%s の日時書式文字を組み合わせ可能） */
	@Size(max = 255)
	private String defaultValue;

	/** 検索項目の種別（未指定の項目は検索対象にしない） */
	@Pattern(regexp = "TEXT_EXACT|TEXT_PREFIX|TEXT_SUFFIX|TEXT_PARTIAL|TEXT_FROMTO|SELECT|SELECT_FROMTO|CHECKBOX")
	private String searchType;

}
