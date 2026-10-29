package com.example.app.domain;

import lombok.Data;

/**
 * メモ検索の1条件（項目1件分）。
 * columnName はサーバー側で item_%02d 形式に生成したものだけを保持し、
 * ユーザー入力をそのまま列名には使わない。
 * type は item_settings.search_type の値
 * （TEXT_EXACT / TEXT_PREFIX / TEXT_SUFFIX / TEXT_PARTIAL / TEXT_FROMTO / SELECT / SELECT_FROMTO / CHECKBOX）。
 * value は単一値条件（PREFIX/SUFFIX の場合はワイルドカード付与・エスケープ済み）、
 * from / to は範囲条件（どちらか一方だけでも可）で使う。
 */
@Data
public class MemoSearchCondition {

	private Integer columnNo;

	private String columnName;

	private String type;

	private String value;

	private String from;

	private String to;

}
