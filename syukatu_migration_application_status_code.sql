-- =====================================================================
-- 就職活動メモシステム 移行用SQL: 応募状況（application_status）の設定コード連番化
-- 対象: 既存DB（syukatu_memo_db）。新規作成の場合は実行不要
--       （syukatu_database.sql には連番化済みの初期データが入っています）
-- 内容: 設定コードを名称そのもの（未応募／応募済／面接／結果）から
--       連番（1／2／3／4）に変更します。文字列1（表示名）は名称のままです。
--   1 = 未応募、2 = 応募済、3 = 面接、4 = 結果
-- =====================================================================

USE syukatu_memo_db;

-- MySQL Workbench のセーフアップデートモード（Error Code: 1175）を回避するため、
-- このスクリプトの実行中だけ無効化し、終了時に戻す
SET SQL_SAFE_UPDATES = 0;

-- 1) 既存メモの項目15（応募状況）の保存値を、名称から設定コードへ変換する
UPDATE memo_records SET item_15 = "1" WHERE system_id = 1 AND item_15 = "未応募";
UPDATE memo_records SET item_15 = "2" WHERE system_id = 1 AND item_15 = "応募済";
UPDATE memo_records SET item_15 = "3" WHERE system_id = 1 AND item_15 = "面接";
UPDATE memo_records SET item_15 = "4" WHERE system_id = 1 AND item_15 = "結果";

-- 2) コードマスタの application_status を削除して入れ直す
DELETE FROM code_masters WHERE system_id = 1 AND code_id = "application_status";

INSERT INTO code_masters (system_id, code_id, setting_code, text_1, text_2, text_3, num_1, num_2, num_3, display_order) VALUES
(1, "application_status", "1", "未応募", NULL, NULL, NULL, NULL, NULL, 1),
(1, "application_status", "2", "応募済", NULL, NULL, NULL, NULL, NULL, 2),
(1, "application_status", "3", "面接", NULL, NULL, NULL, NULL, NULL, 3),
(1, "application_status", "4", "結果", NULL, NULL, NULL, NULL, NULL, 4);

-- セーフアップデートモードを元に戻す
SET SQL_SAFE_UPDATES = 1;
