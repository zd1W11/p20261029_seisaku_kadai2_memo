package com.example.app.service;

import java.util.List;

import com.example.app.domain.AppSystem;
import com.example.app.domain.AppUser;
import com.example.app.domain.CodeMaster;
import com.example.app.domain.ItemSetting;
import com.example.app.domain.MemoRecord;

public interface MemoService {

	List<AppSystem> getAllSystems();

	void addSystem(AppSystem appSystem);

	void editSystem(AppSystem appSystem);

	void deleteSystem(Integer id);

	List<MemoRecord> getAllMemos(Integer systemId);

	/** 検索条件JSON（{"項目番号":{"value":..,"from":..,"to":..}}形式）に基づくメモ検索 */
	List<MemoRecord> searchMemos(Integer systemId, String searchJson);

	/** 指定項目の既存値の distinct 一覧（ドロップダウン検索の選択肢用） */
	List<String> getDistinctValues(Integer systemId, Integer columnNo);

	MemoRecord getMemoById(Integer id);

	void addMemo(MemoRecord memoRecord);

	void editMemo(MemoRecord memoRecord);

	void deleteMemo(Integer id);

	List<ItemSetting> getAllItemSettings(Integer systemId);

	void editItemSetting(ItemSetting itemSetting);

	List<CodeMaster> getAllCodeMasters(Integer systemId);

	List<CodeMaster> getCodeMastersByCodeId(Integer systemId, String codeId);

	void addCodeMaster(CodeMaster codeMaster);

	void editCodeMaster(CodeMaster codeMaster);

	void deleteCodeMaster(CodeMaster codeMaster);

	/** ログイン照合（成功時はユーザー情報、失敗時は null を返す） */
	AppUser login(String username, String password);

}
