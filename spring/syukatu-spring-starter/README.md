# プロジェクト概要

- 「就職活動メモ」用Web API（練習問題08スターターを土台に、新仕様で作り替え）

## セットアップ

- syukatu_database.sql をMySQL Workbenchにインポート（プロジェクトの2階層上にあります）
- application.properties のDB接続設定はスターターと同じ形式（DB名のみ syukatu_memo_db に変更）

## ライブラリ

- Spring Web
- Lombok
- Validation
- MyBatis Framework
- MySQL Driver
- Spring Boot Devtools
- Spring Security Crypto（BCrypt: パスワードのハッシュ化用）

※ Thymeleaf は導入していない

## 構成（スターターとの対応）

- ドメイン: MemoRecord（項目1〜50＋年月＋登録/更新の日時・ユーザー）/ ItemSetting（項目設定）/ CalcSetting（計算設定）
- マッパー・サービス・コントローラーはスターターと同じ流儀（interface + Impl、MyBatis XML、ResponseEntity）
- 設定ファイル: application.properties でアプリを指定（app.code / app.name）
- API: /api/memos、/api/settings/items、/api/settings/calc、/api/app-info

## システム設定 API
- GET/POST/PUT /api/systems、DELETE /api/systems/{id}（システムの追加時は項目設定50件を初期作成。メモのあるシステムと最後のシステムは削除不可）
- メモ・項目設定・計算設定は systemId でシステム別に管理する（未指定時は表示順先頭のシステム）
