-- ============================================================
-- 既存データベース（syukatu_memo_db）への移行用 SQL
-- コードマスタ追加／項目設定へのコードID・必須追加／ログインユーザー初期投入
-- ※ 新規に syukatu_database.sql を投入する場合は、このファイルは不要です。
-- ※ syukatu_migration_systems.sql を実行済みのDBが対象です。
-- ============================================================
USE syukatu_memo_db;

-- 1. コードマスタテーブルを作成
CREATE TABLE code_masters (
   system_id int NOT NULL,
   code_id VARCHAR(50) NOT NULL,
   setting_code VARCHAR(50) NOT NULL,
   PRIMARY KEY (system_id, code_id, setting_code),
   text_1 VARCHAR(255),
   text_2 VARCHAR(255),
   text_3 VARCHAR(255),
   num_1 DECIMAL(18,4),
   num_2 DECIMAL(18,4),
   num_3 DECIMAL(18,4),
   display_order int NOT NULL
);

-- 2. 項目設定へコードID・必須フラグを追加
ALTER TABLE item_settings
  ADD COLUMN code_id VARCHAR(50) AFTER display_order,
  ADD COLUMN is_required TINYINT(1) NOT NULL DEFAULT 0 AFTER code_id;

-- 3. 就職活動メモ（システム1）の初期コードと紐づけ
--    点数（項目2）／雇用形態（項目11）／応募状況（項目15）
INSERT INTO code_masters VALUES
(1, "score", "1", "1", NULL, NULL, 1, NULL, NULL, 1),
(1, "score", "2", "2", NULL, NULL, 2, NULL, NULL, 2),
(1, "score", "3", "3", NULL, NULL, 3, NULL, NULL, 3),
(1, "score", "4", "4", NULL, NULL, 4, NULL, NULL, 4),
(1, "score", "5", "5", NULL, NULL, 5, NULL, NULL, 5),
(1, "employment_type", "1", "正社員", NULL, NULL, NULL, NULL, NULL, 1),
(1, "employment_type", "2", "フリーランス", NULL, NULL, NULL, NULL, NULL, 2),
(1, "employment_type", "3", "派遣", NULL, NULL, NULL, NULL, NULL, 3),
(1, "employment_type", "4", "アルバイト", NULL, NULL, NULL, NULL, NULL, 4),
(1, "application_status", "1", "未応募", NULL, NULL, NULL, NULL, NULL, 1),
(1, "application_status", "2", "応募済", NULL, NULL, NULL, NULL, NULL, 2),
(1, "application_status", "3", "面接", NULL, NULL, NULL, NULL, NULL, 3),
(1, "application_status", "4", "結果", NULL, NULL, NULL, NULL, NULL, 4);

UPDATE item_settings SET code_id = "score" WHERE system_id = 1 AND column_no = 2;
UPDATE item_settings SET code_id = "employment_type" WHERE system_id = 1 AND column_no = 11;
UPDATE item_settings SET code_id = "application_status" WHERE system_id = 1 AND column_no = 15;

-- 4. ログインユーザー初期投入（パスワードはBCryptハッシュ化済みの値）
INSERT INTO app_users (username, password_hash, display_name) VALUES
("papa", "$2a$10$a.gGtD/ZucesxdDtXTb/r.3aAd4PCCzEhW7oaY2iMSBEJQwkVI.Pu", "papa"),
("mama", "$2a$10$a.gGtD/ZucesxdDtXTb/r.3aAd4PCCzEhW7oaY2iMSBEJQwkVI.Pu", "mama"),
("ko1", "$2a$10$a.gGtD/ZucesxdDtXTb/r.3aAd4PCCzEhW7oaY2iMSBEJQwkVI.Pu", "ko1"),
("ko2", "$2a$10$a.gGtD/ZucesxdDtXTb/r.3aAd4PCCzEhW7oaY2iMSBEJQwkVI.Pu", "ko2");
