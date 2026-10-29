-- ============================================================
-- 既存データベース（syukatu_memo_db）への移行用 SQL
-- システム設定テーブルを追加し、既存データを「就職活動メモシステム」(id=1) に所属させます。
-- ※ 新規に syukatu_database.sql を投入する場合は、このファイルは不要です。
-- ============================================================
USE syukatu_memo_db;

-- 1. システム設定テーブルを作成し、既存システムを登録
CREATE TABLE app_systems (
   id int PRIMARY KEY AUTO_INCREMENT,
   system_code VARCHAR(50) UNIQUE NOT NULL,
   system_name VARCHAR(100) NOT NULL,
   display_order int NOT NULL
);
INSERT INTO app_systems VALUES (1, "syukatu-memo", "就職活動メモシステム", 1);

-- 2. メモへシステムIDを追加（既存データはシステム1に所属）
ALTER TABLE memo_records ADD COLUMN system_id int NOT NULL DEFAULT 1 AFTER id;

-- 3. 項目設定へシステムIDを追加し、主キーを (system_id, column_no) に変更
ALTER TABLE item_settings ADD COLUMN system_id int NOT NULL DEFAULT 1 FIRST;
ALTER TABLE item_settings DROP PRIMARY KEY, ADD PRIMARY KEY (system_id, column_no);

-- 4. 計算設定へシステムIDを追加し、ユニークキーをシステム別に変更
ALTER TABLE calc_settings ADD COLUMN system_id int NOT NULL DEFAULT 1 AFTER id;
ALTER TABLE calc_settings DROP INDEX uq_calc_target_priority,
  ADD UNIQUE KEY uq_calc_system_target_priority (system_id, target_column_no, priority);
