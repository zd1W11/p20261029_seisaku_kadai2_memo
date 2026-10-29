# 就職活動メモ（JSRP.08 練習問題スターター土台版）

練習問題08のスターターキット（`practice08-react-starter` / `practice08-spring-starter` / `practice08_database.sql`）を土台に、構成と流儀をそのまま活かして、項目などの仕様を「就職活動メモ」の新仕様に作り替えたプロジェクトです。

## 構成
```
syukatu-app/
  syukatu_database.sql            DB定義＋初期データ（土台の practice08_database.sql と同じ形式）
  spring/syukatu-spring-starter/  Spring Boot API（土台: practice08-spring-starter）
  react/syukatu-react-starter/    React フロントエンド（土台: practice08-react-starter）
```

## 土台から変えた点 / 変えていない点
- 変えていない: パッケージ構成（com.example.app の domain / mapper / service(interface+Impl) / controller / config）、MyBatis XML の置き場所、application.properties 形式、CORS（localhost:3000）、Vite ポート3000、TanStack Query のフック構成、Jotai、React Router、React Hook Form、React Bootstrap、Maven Wrapper
- 変えた: 題材を単語（Vocab）からメモ（MemoRecord）に置き換え、DB名・APIパス・画面・項目を新仕様に変更
- 追加した: 項目設定（item_settings）、コードマスタ（code_masters）、ログイン機能（app_users + BCrypt照合）、アプリ設定（application.properties の app.code / app.name を返す /api/app-info）

## 新仕様の概要
- メインテーブル `memo_records`: ID（自動採番、表示名 No.）、年月（文字列 YYYYMM）、項目1〜項目50、登録日時・登録ユーザー・更新日時・更新ユーザー、バージョン（排他制御用。登録時は1、更新のたびに+1し、更新時はバージョンの一致を条件とする）
- `item_settings`（設定テーブル）: 項目ごとに表示名、型（文字列型 STRING / 数値型 NUMERIC / メモ型 MEMO）、表示桁数、URLかどうか、表示/非表示、表示順、コードID、必須かどうか
- `code_masters`（コードマスタ）: システムID・コードID・設定コード・文字列1〜3・数値1〜3・表示順を持ち、主キーは (システムID, コードID, 設定コード)。項目設定にコードIDを指定すると、その項目は編集画面でドロップダウンになり、保存される値は設定コード、表示は文字列1。初期データとして score（項目2 点数 1〜5）、employment_type（項目11 雇用形態）、application_status（項目15 応募状況）を投入し、各項目に紐づけ済み
- 就職活動メモの項目: 項目1=入力年月、2=好き度1～5、3=企業名、4=言語など技術、5=サイトURL（URL扱い）、6=応募要件、7=出勤曜日、8=出勤開始時間、9=出勤終了時間、10=勤務地、11=雇用形態、12=月給目安 時給は130H、月給は4/5、13=月給、14=時給、15=応募状況、16=締切日、17=応募日、18=メモ（メモ型）。項目19〜50は未使用（非表示、設定で有効化可能）
- 項目12「月給目安 時給は130H、月給は4/5」は手動で入力する（自動計算は行わない）
- サンプルデータ3件（項目12の値入り: 360000 / 487500 / 260000）
- 必須項目: 項目設定で必須に指定した項目は、編集画面で項目名に赤い「*」が表示され、未入力では保存できません（フロントとバックエンドの両方でチェック）

## システム（アプリ種別）の管理
- 利用するシステムの切り替えは、システム一覧画面の各行の「メモ入力」「項目設定」「コードマスタ」ボタンで行う。選択はブラウザに保持される。ヘッダーのタイトルは対象システム名で、「システム一覧」ボタン・ログイン中ユーザー・ログアウトを表示し、その下段に「メモ入力」「項目設定」「コードマスタ」ボタンも表示する
- 「システム設定」画面（/systems）でシステムの追加・編集（システム名・表示順）・削除ができる。システム設定テーブル（app_systems）は、ID／システムコード／システム名／表示順を持つ
- システム一覧の各行: 操作列は「保存」「削除」、メモ列の「メモ入力」でそのシステムのメモ一覧へ、「項目設定」で項目設定画面（/settings）へ、「コードマスタ」でコードマスタ画面（/code-masters）へ遷移する（いずれも使用システムを切り替える）
- メモ一覧画面の「エクスポート」で表示中のメモをCSV（カンマ区切り、memo_export.csv）に書き出す（列はIDと表示項目、見出しは表示名。コード項目はコード名称、それ以外の項目は保存値で出力）
- 共通の設定（登録日時・更新日時の表示、編集テキストボックス幅）は、コードマスタのシステムID=0 で管理する。編集は共通項目設定画面（/common-settings）で行い、システム一覧画面の「共通項目設定」ボタン（「新規作成」ボタンの横）、項目設定画面の「共通設定」ボタンから遷移する
- 項目設定・メモはシステムごとに分かれている。システムを追加すると、そのシステム専用の項目設定（項目1〜50、初期は名称なし・非表示）が自動で用意される
- メモが登録されているシステムと、最後の1システムは削除できない
- 既存のデータベースをお使いの場合は、syukatu_migration_systems.sql を実行すると既存データを「就職活動メモシステム」として引き継げます（新規構築の場合は不要）
- コードマスタ追加・ログイン用ユーザー投入に対応する移行SQLとして syukatu_migration_codemaster_login.sql も同梱しています（システム設定の移行済みDBが対象）

## ログイン
- ログイン画面（/login）でユーザーIDとパスワードを照合する（app_users の BCrypt ハッシュと照合。API は POST /api/auth/login）
- 初期ユーザーは papa / mama / ko1 / ko2 の4件（パスワードは同一のBCryptハッシュ化済みの値を syukatu_database.sql に投入済み）
- 未ログイン時はログイン画面へ遷移し、使用システムドロップダウンなどはログイン後のヘッダーに表示される。ヘッダーにはログイン中のユーザーIDとログアウトボタンを表示
- ログインしたユーザーIDが、メモの登録ユーザー / 更新ユーザーとして記録される

## 画面の流れ
- 一覧画面（/）: 絞り込み（年月）と一覧を表示。「新規登録」ボタンで登録画面へ遷移（登録フォームは一覧には置かない）。各行に「詳細」と「削除」ボタンがあり、削除は確認ダイアログで確認が取れた場合のみ実行される
- 詳細・編集画面（/memo/new、/memo/:id、/memo/:id/edit）: 詳細と編集は統合した1画面。詳細モードでは値はラベル表示、編集モードではテキストボックス／テキストエリア（コードID指定項目はコードマスタのドロップダウン）で入力する。新規登録も同じ画面の編集モードを使う。保存後は新規登録→一覧、編集→詳細モードへ戻る。キャンセルも同じ戻り先。削除ボタンは置かない（削除は一覧からのみ）

## 起動手順
### 1. MySQL起動とDB投入
MySQLを起動し、`syukatu_database.sql` を MySQL Workbench でインポート（または mysql コマンドで実行）してください。DB名は `syukatu_memo_db` です。接続パスワードが空でない環境では `spring/syukatu-spring-starter/src/main/resources/application.properties` の `spring.datasource.password` を合わせてください。

### 2. バックエンド（Eclipse / STS、土台と同じ方法）
Eclipseで `spring/syukatu-spring-starter` を既存Mavenプロジェクトとしてインポートし、`Application.java` を Spring Boot App として実行してください。コマンドから実行する場合は同梱の Maven Wrapper が使えます:
```bat
cd spring\syukatu-spring-starter
.\mvnw.cmd spring-boot:run
```
確認: `http://localhost:8080/api/app-info` で `{"code":"syukatu-memo","name":"就職活動メモ"}` が返ればOKです。

### 3. フロントエンド
```bat
cd react\syukatu-react-starter
npm install
npm start
```
`http://localhost:3000` で一覧画面が表示されます。

## 検証状況
- フロントエンド: この環境で `npm install` → `npm run build` 成功、`eslint` エラーなしを確認済み
- バックエンド: 作成環境のネットワーク制約で Maven の依存取得ができず、コンパイル実行は未確認です（Javaソースの構文解析チェックでは依存不足以外のエラーなし、MyBatis XML / pom.xml の形式チェック済み）。お使いのPC（Eclipse内蔵Maven）での初回ビルド結果を教えてもらえれば、エラーがあればすぐ直します
- 土台スターターに含まれていた `target` フォルダと `Vocab-api.jar`（単語アプリのデモ用jar）は、新仕様では不要なため含めていません

## 設計書（docs フォルダー）
サンプル文書（JavaClub会員管理システム）の様式に準拠した設計書一式を docs フォルダーに同梱しています。
- 就職活動メモシステム.要件定義書.docx
- 就職活動メモシステム.機能一覧.xlsx
- 就職活動メモシステム.システム構成図.xlsx
- 就職活動メモシステム.画面設計書.xlsx
- 就職活動メモシステム.データ設計書.xlsx
- 就職活動メモシステム.プログラム設計書.docx
- 就職活動メモシステム.テスト仕様書.xlsx
