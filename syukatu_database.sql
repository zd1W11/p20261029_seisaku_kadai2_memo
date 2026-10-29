CREATE DATABASE IF NOT EXISTS syukatu_memo_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

USE syukatu_memo_db;

DROP TABLE IF EXISTS memo_records;
DROP TABLE IF EXISTS code_masters;
DROP TABLE IF EXISTS item_settings;
DROP TABLE IF EXISTS app_users;
DROP TABLE IF EXISTS app_systems;

CREATE TABLE app_systems (
   id int PRIMARY KEY AUTO_INCREMENT,
   system_code VARCHAR(50) UNIQUE NOT NULL,
   system_name VARCHAR(100) NOT NULL,
   display_order int NOT NULL
);

CREATE TABLE memo_records (
   id int PRIMARY KEY AUTO_INCREMENT,
   system_id int NOT NULL,
   item_01 VARCHAR(255),
   item_02 VARCHAR(255),
   item_03 VARCHAR(255),
   item_04 VARCHAR(255),
   item_05 VARCHAR(255),
   item_06 VARCHAR(255),
   item_07 VARCHAR(255),
   item_08 VARCHAR(255),
   item_09 VARCHAR(255),
   item_10 VARCHAR(255),
   item_11 VARCHAR(255),
   item_12 VARCHAR(255),
   item_13 VARCHAR(255),
   item_14 VARCHAR(255),
   item_15 VARCHAR(255),
   item_16 VARCHAR(255),
   item_17 VARCHAR(255),
   item_18 VARCHAR(255),
   item_19 VARCHAR(255),
   item_20 VARCHAR(255),
   item_21 VARCHAR(255),
   item_22 VARCHAR(255),
   item_23 VARCHAR(255),
   item_24 VARCHAR(255),
   item_25 VARCHAR(255),
   item_26 VARCHAR(255),
   item_27 VARCHAR(255),
   item_28 VARCHAR(255),
   item_29 VARCHAR(255),
   item_30 VARCHAR(255),
   item_31 VARCHAR(255),
   item_32 VARCHAR(255),
   item_33 VARCHAR(255),
   item_34 VARCHAR(255),
   item_35 VARCHAR(255),
   item_36 VARCHAR(255),
   item_37 VARCHAR(255),
   item_38 VARCHAR(255),
   item_39 VARCHAR(255),
   item_40 VARCHAR(255),
   item_41 VARCHAR(255),
   item_42 VARCHAR(255),
   item_43 VARCHAR(255),
   item_44 VARCHAR(255),
   item_45 VARCHAR(255),
   item_46 VARCHAR(255),
   item_47 VARCHAR(255),
   item_48 VARCHAR(255),
   item_49 VARCHAR(255),
   item_50 VARCHAR(255),
   registered_at DATETIME NOT NULL,
   registered_by VARCHAR(50) NOT NULL,
   updated_at DATETIME NOT NULL,
   updated_by VARCHAR(50) NOT NULL,
   version int NOT NULL DEFAULT 1
);

CREATE TABLE item_settings (
   system_id int NOT NULL,
   column_no int NOT NULL,
   PRIMARY KEY (system_id, column_no),
   display_name VARCHAR(100) NOT NULL,
   is_visible TINYINT(1) NOT NULL,
   is_required TINYINT(1) NOT NULL,
   data_type VARCHAR(10) NOT NULL,
   display_width int NOT NULL,
   is_url TINYINT(1) NOT NULL,
   display_order int NOT NULL,
   code_id VARCHAR(50),
   default_value VARCHAR(255),
   search_type VARCHAR(30)
);

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

CREATE TABLE app_users (
   id int PRIMARY KEY AUTO_INCREMENT,
   username VARCHAR(50) UNIQUE NOT NULL,
   password_hash VARCHAR(100) NOT NULL,
   display_name VARCHAR(100) NOT NULL
);

-- 既存データのクリア（INSERT の前に実行。データを入れ直すだけの場合も使える）
SET SQL_SAFE_UPDATES = 0;
DELETE FROM memo_records;
DELETE FROM code_masters;
DELETE FROM item_settings;
DELETE FROM app_users;
DELETE FROM app_systems;

INSERT INTO app_users (username, password_hash, display_name) VALUES
("papa", "$2a$10$a.gGtD/ZucesxdDtXTb/r.3aAd4PCCzEhW7oaY2iMSBEJQwkVI.Pu", "papa"),
("mama", "$2a$10$a.gGtD/ZucesxdDtXTb/r.3aAd4PCCzEhW7oaY2iMSBEJQwkVI.Pu", "mama"),
("ko1", "$2a$10$a.gGtD/ZucesxdDtXTb/r.3aAd4PCCzEhW7oaY2iMSBEJQwkVI.Pu", "ko1"),
("ko2", "$2a$10$a.gGtD/ZucesxdDtXTb/r.3aAd4PCCzEhW7oaY2iMSBEJQwkVI.Pu", "ko2");

INSERT INTO app_systems VALUES
(1, "syukatu-memo", "就職活動メモシステム", 1),
(2, "wagaya_kounyu", "わが家の購入品メモシステム", 2);

INSERT INTO item_settings VALUES
(1, 1, "入力年月", 1, 0, "STRING", 10, 0, 1, NULL, "%Y%m", "TEXT_FROMTO"),
(1, 2, "好き度1～5", 1, 0, "STRING", 8, 0, 2, "score", NULL, "SELECT_FROMTO"),
(1, 3, "企業名", 1, 0, "STRING", 22, 0, 3, NULL, NULL, "TEXT_PARTIAL"),
(1, 4, "言語など技術", 1, 0, "STRING", 22, 0, 4, NULL, NULL, "TEXT_PARTIAL"),
(1, 5, "サイトURL", 1, 0, "STRING", 12, 1, 5, NULL, NULL, NULL),
(1, 6, "応募要件", 1, 0, "STRING", 32, 0, 6, NULL, NULL, NULL),
(1, 7, "出勤曜日", 1, 0, "STRING", 12, 0, 7, NULL, NULL, NULL),
(1, 8, "出勤開始時間", 1, 0, "STRING", 10, 0, 8, NULL, NULL, NULL),
(1, 9, "出勤終了時間", 1, 0, "STRING", 10, 0, 9, NULL, NULL, NULL),
(1, 10, "勤務地", 1, 0, "STRING", 18, 0, 10, NULL, NULL, NULL),
(1, 11, "雇用形態", 1, 0, "STRING", 14, 0, 11, "employment_type", NULL, "SELECT"),
(1, 12, "月給目安 時給は130H、月給は4/5", 1, 0, "STRING", 10, 0, 12, NULL, NULL, NULL),
(1, 13, "月給", 1, 0, "STRING", 12, 0, 13, NULL, NULL, NULL),
(1, 14, "時給", 1, 0, "STRING", 10, 0, 14, NULL, NULL, NULL),
(1, 15, "応募状況", 1, 0, "STRING", 10, 0, 15, "application_status", NULL, "SELECT"),
(1, 16, "締切日", 1, 0, "STRING", 13, 0, 16, NULL, NULL, "TEXT_FROMTO"),
(1, 17, "応募日", 1, 0, "STRING", 13, 0, 17, NULL, NULL, NULL),
(1, 18, "メモ", 1, 0, "MEMO", 32, 0, 18, NULL, NULL, NULL),
(1, 19, "", 0, 0, "STRING", 12, 0, 19, NULL, NULL, NULL),
(1, 20, "", 0, 0, "STRING", 12, 0, 20, NULL, NULL, NULL),
(1, 21, "", 0, 0, "STRING", 12, 0, 21, NULL, NULL, NULL),
(1, 22, "", 0, 0, "STRING", 12, 0, 22, NULL, NULL, NULL),
(1, 23, "", 0, 0, "STRING", 12, 0, 23, NULL, NULL, NULL),
(1, 24, "", 0, 0, "STRING", 12, 0, 24, NULL, NULL, NULL),
(1, 25, "", 0, 0, "STRING", 12, 0, 25, NULL, NULL, NULL),
(1, 26, "", 0, 0, "STRING", 12, 0, 26, NULL, NULL, NULL),
(1, 27, "", 0, 0, "STRING", 12, 0, 27, NULL, NULL, NULL),
(1, 28, "", 0, 0, "STRING", 12, 0, 28, NULL, NULL, NULL),
(1, 29, "", 0, 0, "STRING", 12, 0, 29, NULL, NULL, NULL),
(1, 30, "", 0, 0, "STRING", 12, 0, 30, NULL, NULL, NULL),
(1, 31, "", 0, 0, "STRING", 12, 0, 31, NULL, NULL, NULL),
(1, 32, "", 0, 0, "STRING", 12, 0, 32, NULL, NULL, NULL),
(1, 33, "", 0, 0, "STRING", 12, 0, 33, NULL, NULL, NULL),
(1, 34, "", 0, 0, "STRING", 12, 0, 34, NULL, NULL, NULL),
(1, 35, "", 0, 0, "STRING", 12, 0, 35, NULL, NULL, NULL),
(1, 36, "", 0, 0, "STRING", 12, 0, 36, NULL, NULL, NULL),
(1, 37, "", 0, 0, "STRING", 12, 0, 37, NULL, NULL, NULL),
(1, 38, "", 0, 0, "STRING", 12, 0, 38, NULL, NULL, NULL),
(1, 39, "", 0, 0, "STRING", 12, 0, 39, NULL, NULL, NULL),
(1, 40, "", 0, 0, "STRING", 12, 0, 40, NULL, NULL, NULL),
(1, 41, "", 0, 0, "STRING", 12, 0, 41, NULL, NULL, NULL),
(1, 42, "", 0, 0, "STRING", 12, 0, 42, NULL, NULL, NULL),
(1, 43, "", 0, 0, "STRING", 12, 0, 43, NULL, NULL, NULL),
(1, 44, "", 0, 0, "STRING", 12, 0, 44, NULL, NULL, NULL),
(1, 45, "", 0, 0, "STRING", 12, 0, 45, NULL, NULL, NULL),
(1, 46, "", 0, 0, "STRING", 12, 0, 46, NULL, NULL, NULL),
(1, 47, "", 0, 0, "STRING", 12, 0, 47, NULL, NULL, NULL),
(1, 48, "", 0, 0, "STRING", 12, 0, 48, NULL, NULL, NULL),
(1, 49, "", 0, 0, "STRING", 12, 0, 49, NULL, NULL, NULL),
(1, 50, "", 0, 0, "STRING", 12, 0, 50, NULL, NULL, NULL);

-- 項目設定（システム2: わが家の購入品メモシステム）
INSERT INTO item_settings VALUES
(2, 1, "購入日", 1, 0, "STRING", 12, 0, 1, NULL, "%Y%m%d", "TEXT_PREFIX"),
(2, 2, "購入品種別", 1, 0, "STRING", 13, 0, 2, "konyuKind", NULL, "SELECT"),
(2, 3, "購入品名", 1, 0, "STRING", 18, 0, 3, NULL, NULL, NULL),
(2, 4, "メーカー", 1, 0, "STRING", 12, 0, 4, NULL, NULL, NULL),
(2, 5, "型番", 1, 0, "STRING", 12, 0, 5, NULL, NULL, NULL),
(2, 6, "購入金額", 1, 0, "STRING", 12, 0, 6, NULL, NULL, NULL),
(2, 7, "購入店", 1, 0, "STRING", 12, 0, 7, NULL, NULL, NULL),
(2, 8, "取扱説明書URL", 1, 0, "STRING", 16, 1, 8, NULL, NULL, NULL),
(2, 9, "購入時URL", 1, 0, "STRING", 12, 1, 9, NULL, NULL, NULL),
(2, 10, "メモ", 1, 0, "STRING", 12, 0, 10, NULL, NULL, NULL),
(2, 11, "保証期限", 1, 0, "STRING", 13, 0, 11, NULL, NULL, NULL),
(2, 12, "保証書の処理", 1, 0, "STRING", 15, 0, 12, "hosyo_syori", NULL, NULL),
(2, 13, "破棄日", 1, 0, "STRING", 13, 0, 13, NULL, NULL, NULL),
(2, 14, "使用者", 1, 0, "STRING", 12, 0, 14, "siyou_sya", NULL, NULL),
(2, 15, "", 0, 0, "STRING", 12, 0, 15, NULL, NULL, NULL),
(2, 16, "", 0, 0, "STRING", 12, 0, 16, NULL, NULL, NULL),
(2, 17, "", 0, 0, "STRING", 12, 0, 17, NULL, NULL, NULL),
(2, 18, "", 0, 0, "STRING", 12, 0, 18, NULL, NULL, NULL),
(2, 19, "", 0, 0, "STRING", 12, 0, 19, NULL, NULL, NULL),
(2, 20, "", 0, 0, "STRING", 12, 0, 20, NULL, NULL, NULL),
(2, 21, "", 0, 0, "STRING", 12, 0, 21, NULL, NULL, NULL),
(2, 22, "", 0, 0, "STRING", 12, 0, 22, NULL, NULL, NULL),
(2, 23, "", 0, 0, "STRING", 12, 0, 23, NULL, NULL, NULL),
(2, 24, "", 0, 0, "STRING", 12, 0, 24, NULL, NULL, NULL),
(2, 25, "", 0, 0, "STRING", 12, 0, 25, NULL, NULL, NULL),
(2, 26, "", 0, 0, "STRING", 12, 0, 26, NULL, NULL, NULL),
(2, 27, "", 0, 0, "STRING", 12, 0, 27, NULL, NULL, NULL),
(2, 28, "", 0, 0, "STRING", 12, 0, 28, NULL, NULL, NULL),
(2, 29, "", 0, 0, "STRING", 12, 0, 29, NULL, NULL, NULL),
(2, 30, "", 0, 0, "STRING", 12, 0, 30, NULL, NULL, NULL),
(2, 31, "", 0, 0, "STRING", 12, 0, 31, NULL, NULL, NULL),
(2, 32, "", 0, 0, "STRING", 12, 0, 32, NULL, NULL, NULL),
(2, 33, "", 0, 0, "STRING", 12, 0, 33, NULL, NULL, NULL),
(2, 34, "", 0, 0, "STRING", 12, 0, 34, NULL, NULL, NULL),
(2, 35, "", 0, 0, "STRING", 12, 0, 35, NULL, NULL, NULL),
(2, 36, "", 0, 0, "STRING", 12, 0, 36, NULL, NULL, NULL),
(2, 37, "", 0, 0, "STRING", 12, 0, 37, NULL, NULL, NULL),
(2, 38, "", 0, 0, "STRING", 12, 0, 38, NULL, NULL, NULL),
(2, 39, "", 0, 0, "STRING", 12, 0, 39, NULL, NULL, NULL),
(2, 40, "", 0, 0, "STRING", 12, 0, 40, NULL, NULL, NULL),
(2, 41, "", 0, 0, "STRING", 12, 0, 41, NULL, NULL, NULL),
(2, 42, "", 0, 0, "STRING", 12, 0, 42, NULL, NULL, NULL),
(2, 43, "", 0, 0, "STRING", 12, 0, 43, NULL, NULL, NULL),
(2, 44, "", 0, 0, "STRING", 12, 0, 44, NULL, NULL, NULL),
(2, 45, "", 0, 0, "STRING", 12, 0, 45, NULL, NULL, NULL),
(2, 46, "", 0, 0, "STRING", 12, 0, 46, NULL, NULL, NULL),
(2, 47, "", 0, 0, "STRING", 12, 0, 47, NULL, NULL, NULL),
(2, 48, "", 0, 0, "STRING", 12, 0, 48, NULL, NULL, NULL),
(2, 49, "", 0, 0, "STRING", 12, 0, 49, NULL, NULL, NULL),
(2, 50, "", 0, 0, "STRING", 12, 0, 50, NULL, NULL, NULL);

INSERT INTO code_masters VALUES
(1, "score", "1", "好き1", NULL, NULL, 1, NULL, NULL, 1),
(1, "score", "2", "好き2", NULL, NULL, 2, NULL, NULL, 2),
(1, "score", "3", "好き3", NULL, NULL, 3, NULL, NULL, 3),
(1, "score", "4", "好き4", NULL, NULL, 4, NULL, NULL, 4),
(1, "score", "5", "好き5", NULL, NULL, 5, NULL, NULL, 5),
(1, "employment_type", "1", "正社員", NULL, NULL, NULL, NULL, NULL, 1),
(1, "employment_type", "2", "フリーランス", NULL, NULL, NULL, NULL, NULL, 2),
(1, "employment_type", "3", "派遣", NULL, NULL, NULL, NULL, NULL, 3),
(1, "employment_type", "4", "アルバイト", NULL, NULL, NULL, NULL, NULL, 4),
(1, "application_status", "1", "未応募", NULL, NULL, NULL, NULL, NULL, 1),
(1, "application_status", "2", "応募済", NULL, NULL, NULL, NULL, NULL, 2),
(1, "application_status", "3", "面接", NULL, NULL, NULL, NULL, NULL, 3),
(1, "application_status", "4", "結果", NULL, NULL, NULL, NULL, NULL, 4);

-- コードマスタ（共通: システムID=0。登録日時・更新日時の表示と編集テキストボックス幅）
INSERT INTO code_masters VALUES
(0, "registered_at", "1", "登録日時", "表示桁数", "22", NULL, NULL, NULL, 1),
(0, "registered_at", "2", "登録日時", "初期値", "%Y/%m/%d %H:%i:%s", NULL, NULL, NULL, 1),
(0, "updated_at", "1", "更新日時", "表示桁数", "22", NULL, NULL, NULL, 1),
(0, "updated_at", "2", "更新日時", "初期値", "%Y/%m/%d %H:%i:%s", NULL, NULL, NULL, 1),
(0, "width_edit_textbox", "1", "編集テキストボックス", "幅", "60", NULL, NULL, NULL, 1);

-- コードマスタ（システム2: わが家の購入品メモシステム）
INSERT INTO code_masters VALUES
(2, "hosyo_syori", "1", "保証書あり", NULL, NULL, NULL, NULL, NULL, 1),
(2, "hosyo_syori", "2", "保証書なし", NULL, NULL, NULL, NULL, NULL, 2),
(2, "hosyo_syori", "3", "保証書破棄済", NULL, NULL, NULL, NULL, NULL, 3),
(2, "konyuKind", "1", "電化製品", NULL, NULL, NULL, NULL, NULL, 1),
(2, "konyuKind", "2", "パソコン", NULL, NULL, NULL, NULL, NULL, 2),
(2, "konyuKind", "3", "スマホ", NULL, NULL, NULL, NULL, NULL, 3),
(2, "siyou_sya", "1", "papa", NULL, NULL, NULL, NULL, NULL, 1),
(2, "siyou_sya", "2", "mama", NULL, NULL, NULL, NULL, NULL, 2),
(2, "siyou_sya", "3", "ko1", NULL, NULL, NULL, NULL, NULL, 3),
(2, "siyou_sya", "4", "ko2", NULL, NULL, NULL, NULL, NULL, 4);

INSERT INTO memo_records (id, system_id, item_01, item_02, item_03, item_04, item_05, item_06, item_07, item_08, item_09, item_10, item_11, item_12, item_13, item_14, item_15, item_16, item_17, item_18, item_19, item_20, item_21, item_22, item_23, item_24, item_25, item_26, item_27, item_28, item_29, item_30, item_31, item_32, item_33, item_34, item_35, item_36, item_37, item_38, item_39, item_40, item_41, item_42, item_43, item_44, item_45, item_46, item_47, item_48, item_49, item_50, registered_at, registered_by, updated_at, updated_by, version) VALUES
(NULL, 1, "202704", "5", "株式会社サンプルテック", "Java / Spring Boot / React / MySQL", "https://example.com/jobs/sample-tech", "Java実務経験3年以上、Spring BootでのAPI開発経験必須。React経験歓迎。", "月〜金", "09:00", "18:00", "東京都（リモート併用）", "1", "360000", "450000", "", "2", "2026-10-31", "2026-10-10", "一次面接の日程調整中。企業研究メモを追記すること。", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", NOW(), "sample", NOW(), "sample", 1),
(NULL, 1, "202704", "4", "フリーランス案件エージェントABC", "JavaScript / React / Bootstrap", "https://example.com/jobs/abc", "Reactでの画面開発経験2年以上。即日〜翌月開始可能な方。", "月〜金", "10:00", "19:00", "大阪府（フルリモート可）", "2", "487500", "600000", "3750", "3", "2026-11-05", "2026-10-15", "単価交渉の余地あり。稼働率について確認する。", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", NOW(), "sample", NOW(), "sample", 1),
(NULL, 1, "202705", "3", "サンプルシステムズ株式会社", "Java / MyBatis / MySQL", "https://example.com/jobs/sample-systems", "Java基礎知識、SQLが書けること。未経験応相談の記載あり。", "月〜金", "09:30", "18:30", "福岡県", "3", "260000", "320000", "2000", "1", "2026-11-15", "", "勤務地が遠いため、交通費条件を確認してから応募を判断する。", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", NOW(), "sample", NOW(), "sample", 1);


-- 購入品メモ（システム2）のデータ（移行前データから移行した13件。購入日は初期データなし）
INSERT INTO memo_records (id, system_id, item_01, item_02, item_03, item_04, item_05, item_06, item_07, item_08, item_09, item_10, item_11, item_12, item_13, item_14, item_15, item_16, item_17, item_18, item_19, item_20, item_21, item_22, item_23, item_24, item_25, item_26, item_27, item_28, item_29, item_30, item_31, item_32, item_33, item_34, item_35, item_36, item_37, item_38, item_39, item_40, item_41, item_42, item_43, item_44, item_45, item_46, item_47, item_48, item_49, item_50, registered_at, registered_by, updated_at, updated_by, version) VALUES
(NULL, 2, "20231029", "1", "iPhone 16 Pro", "Apple", "A3307", "159800", "Apple Store Online", "https://apple.com", "https://apple.com", "パパのメイン端末。壊さないようにケース必須。", "2026-09-09", "1", "", "papa", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "2025-09-10 10:00:00", "papa", "2025-09-10 10:00:00", "papa", 1),
(NULL, 2, "20231029", "1", "Google Pixel 7a", "Google", "G82U8", "62700", "Googleストア", "https://google.com", "https://google.com", "子供の習い事の連絡用。画面割れに注意。", "2024-05-19", "1", "", "kodomo1", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "2023-05-20 14:30:00", "papa", "2023-05-20 14:30:00", "papa", 1),
(NULL, 2, "20231029", "2", "MacBook Air 13インチ M3", "Apple", "A3113", "164800", "ヨドバシカメラ", "https://apple.com", "", "ママの在宅ワーク・家計簿用。サクサク動いて快適。", "", "2", "", "mama", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "2026-02-15 11:15:00", "mama", "2026-09-09 15:15:55", "mama", 3),
(NULL, 2, "20231029", "3", "4K 27インチ モニター", "Dell", "U2723QE", "59800", "Amazon.co.jp", "https://dell.com", "https://amazon.co.jp", "パパのリモートワーク兼、子供のゲーム用。画質が良い。", "2027-12-24", "1", "", "papa", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "2024-12-25 09:00:00", "papa", "2026-01-10 18:22:00", "mama", 3),
(NULL, 2, "20231029", "1", "電気圧力鍋 ヘルシオ ホットクック", "シャープ", "KN-HW24G", "45000", "エディオン", "https://jp.sharp", "", "内鍋のコーティングが剥がれて使わなくなったため処分。", "2023-03-31","3", "2026-05-10", "mama", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "2022-04-01 16:00:00", "mama", "2026-05-10 21:00:00", "mama", 2);
