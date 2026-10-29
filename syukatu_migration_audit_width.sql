-- =====================================================================
-- 就職活動メモシステム 移行用SQL: システム設定への日時表示幅の追加
-- 対象: 既存DB（syukatu_memo_db）。新規作成の場合は実行不要
--       （syukatu_database.sql には追加済みの定義と初期値が入っています）
-- 内容: app_systems に登録日時・更新日時の表示幅（registered_at_width /
--       updated_at_width）を追加し、初期値として 22 を設定します。
-- =====================================================================

USE syukatu_memo_db;

-- MySQL Workbench のセーフアップデートモード（Error Code: 1175）を回避するため、
-- このスクリプトの実行中だけ無効化し、終了時に戻す
SET SQL_SAFE_UPDATES = 0;

ALTER TABLE app_systems
  ADD COLUMN registered_at_width INT NULL AFTER display_order,
  ADD COLUMN updated_at_width INT NULL;

UPDATE app_systems SET registered_at_width = 22, updated_at_width = 22;

-- セーフアップデートモードを元に戻す
SET SQL_SAFE_UPDATES = 1;
