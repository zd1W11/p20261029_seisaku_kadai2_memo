package com.example.app.service;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.app.domain.AppSystem;
import com.example.app.domain.AppUser;
import com.example.app.domain.CodeMaster;
import com.example.app.domain.ItemSetting;
import com.example.app.domain.MemoRecord;
import com.example.app.domain.MemoSearchCondition;
import com.example.app.mapper.AppSystemMapper;
import com.example.app.mapper.AppUserMapper;
import com.example.app.mapper.CodeMasterMapper;
import com.example.app.mapper.ItemSettingMapper;
import com.example.app.mapper.MemoRecordMapper;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Transactional
@Service
@RequiredArgsConstructor
public class MemoServiceImpl implements MemoService {

	private final AppSystemMapper appSystemMapper;
	private final MemoRecordMapper memoRecordMapper;
	private final ItemSettingMapper itemSettingMapper;
	private final CodeMasterMapper codeMasterMapper;
	private final AppUserMapper appUserMapper;
	private final PasswordEncoder passwordEncoder;
	private final ObjectMapper objectMapper;

	@Override
	public List<AppSystem> getAllSystems() {
		return appSystemMapper.selectAll();
	}

	@Override
	public void addSystem(AppSystem appSystem) {
		appSystemMapper.insert(appSystem);
		// 新規システム用に、項目1〜50の項目設定（初期状態）を作成する
		for (int no = 1; no <= 50; no++) {
			ItemSetting setting = new ItemSetting();
			setting.setSystemId(appSystem.getId());
			setting.setColumnNo(no);
			setting.setDisplayName("");
			setting.setDataType("STRING");
			setting.setDisplayWidth(12);
			setting.setIsUrl(false);
			setting.setIsVisible(false);
			setting.setDisplayOrder(no);
			setting.setCodeId(null);
			setting.setIsRequired(false);
			setting.setDefaultValue(null);
			setting.setSearchType(null);
			itemSettingMapper.insert(setting);
		}
	}

	@Override
	public void editSystem(AppSystem appSystem) {
		appSystemMapper.update(appSystem);
	}

	@Override
	public void deleteSystem(Integer id) {
		if (appSystemMapper.selectAll().size() <= 1) {
			throw new IllegalStateException("最後のシステムは削除できません");
		}
		if (memoRecordMapper.countBySystemId(id) > 0) {
			throw new IllegalStateException("メモが登録されているシステムは削除できません。先にメモを削除してください");
		}
		itemSettingMapper.deleteBySystemId(id);
		codeMasterMapper.deleteBySystemId(id);
		appSystemMapper.delete(id);
	}

	/** システムIDが未指定の場合は、表示順が先頭のシステムを対象とする */
	private Integer resolveSystemId(Integer systemId) {
		if (systemId != null) {
			return systemId;
		}
		List<AppSystem> systems = appSystemMapper.selectAll();
		return systems.isEmpty() ? null : systems.get(0).getId();
	}

	@Override
	public List<MemoRecord> getAllMemos(Integer systemId) {
		return memoRecordMapper.selectAll(resolveSystemId(systemId));
	}

	/**
	 * 検索条件JSONに基づくメモ検索。
	 * JSON形式: {"項目番号": {"value": "x", "from": "a", "to": "b"}}
	 * item_settings の search_type が未設定の項目と、空の条件は無視する。
	 */
	@Override
	public List<MemoRecord> searchMemos(Integer systemId, String searchJson) {
		Integer resolvedSystemId = resolveSystemId(systemId);
		List<MemoSearchCondition> conditions = buildSearchConditions(resolvedSystemId, searchJson);
		if (conditions.isEmpty()) {
			return memoRecordMapper.selectAll(resolvedSystemId);
		}
		return memoRecordMapper.selectBySearch(resolvedSystemId, conditions);
	}

	/** 検索条件JSONを解釈し、item_settings の search_type と突き合わせて条件リストを作る */
	private List<MemoSearchCondition> buildSearchConditions(Integer systemId, String searchJson) {
		List<MemoSearchCondition> conditions = new ArrayList<>();
		if (searchJson == null || searchJson.isBlank()) {
			return conditions;
		}
		JsonNode root;
		try {
			root = objectMapper.readTree(searchJson);
		} catch (Exception e) {
			throw new IllegalArgumentException("検索条件の形式が不正です");
		}
		if (root == null || !root.isObject()) {
			throw new IllegalArgumentException("検索条件の形式が不正です");
		}
		Map<Integer, ItemSetting> settingsByColumnNo = itemSettingMapper.selectAll(systemId).stream()
				.collect(Collectors.toMap(ItemSetting::getColumnNo, s -> s, (a, b) -> a));
		for (Map.Entry<String, JsonNode> field : root.properties()) {
			int columnNo;
			try {
				columnNo = Integer.parseInt(field.getKey());
			} catch (NumberFormatException e) {
				continue;
			}
			ItemSetting setting = settingsByColumnNo.get(columnNo);
			if (setting == null || setting.getSearchType() == null || setting.getSearchType().isBlank()) {
				continue;
			}
			JsonNode cond = field.getValue();
			if (cond == null || !cond.isObject()) {
				continue;
			}
			String type = setting.getSearchType();
			MemoSearchCondition condition = new MemoSearchCondition();
			condition.setColumnNo(columnNo);
			condition.setColumnName(String.format("item_%02d", columnNo));
			condition.setType(type);
			switch (type) {
			case "TEXT_EXACT", "SELECT" -> {
				String value = textOrNull(cond.get("value"));
				if (value == null || value.isBlank()) {
					continue;
				}
				condition.setValue(value);
			}
			case "CHECKBOX" -> {
				// チェックされた場合のみ「ONのメモ」に絞り込む。OFFの指定は条件にしない
				if (!"1".equals(textOrNull(cond.get("value")))) {
					continue;
				}
				condition.setValue("1");
			}
			case "TEXT_PREFIX" -> {
				String value = textOrNull(cond.get("value"));
				if (value == null || value.isBlank()) {
					continue;
				}
				condition.setValue(escapeLike(value) + "%");
			}
			case "TEXT_SUFFIX" -> {
				String value = textOrNull(cond.get("value"));
				if (value == null || value.isBlank()) {
					continue;
				}
				condition.setValue("%" + escapeLike(value));
			}
			case "TEXT_PARTIAL" -> {
				String value = textOrNull(cond.get("value"));
				if (value == null || value.isBlank()) {
					continue;
				}
				condition.setValue("%" + escapeLike(value) + "%");
			}
			case "TEXT_FROMTO", "SELECT_FROMTO" -> {
				String from = textOrNull(cond.get("from"));
				String to = textOrNull(cond.get("to"));
				if ((from == null || from.isBlank()) && (to == null || to.isBlank())) {
					continue;
				}
				condition.setFrom(from == null || from.isBlank() ? null : from);
				condition.setTo(to == null || to.isBlank() ? null : to);
			}
			default -> {
				continue;
			}
			}
			conditions.add(condition);
		}
		return conditions;
	}

	private String textOrNull(JsonNode node) {
		if (node == null || node.isNull()) {
			return null;
		}
		return node.isTextual() ? node.textValue() : node.toString();
	}

	/** LIKE パターン内の %, _, \ をエスケープする（SQL側で ESCAPE '\' を指定） */
	private String escapeLike(String value) {
		return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
	}

	@Override
	public List<String> getDistinctValues(Integer systemId, Integer columnNo) {
		if (columnNo == null || columnNo < 1 || columnNo > 50) {
			throw new IllegalArgumentException("項目番号が不正です");
		}
		String columnName = String.format("item_%02d", columnNo);
		return memoRecordMapper.selectDistinctValues(resolveSystemId(systemId), columnName);
	}

	@Override
	public MemoRecord getMemoById(Integer id) {
		return memoRecordMapper.selectById(id);
	}

	@Override
	public void addMemo(MemoRecord memoRecord) {
		memoRecord.setSystemId(resolveSystemId(memoRecord.getSystemId()));
		if (memoRecord.getRegisteredBy() == null || memoRecord.getRegisteredBy().isBlank()) {
			memoRecord.setRegisteredBy("system");
		}
		memoRecord.setUpdatedBy(memoRecord.getRegisteredBy());
		validateRequiredItems(memoRecord);
		memoRecordMapper.insert(memoRecord);
	}

	@Override
	public void editMemo(MemoRecord memoRecord) {
		memoRecord.setSystemId(resolveSystemId(memoRecord.getSystemId()));
		if (memoRecord.getUpdatedBy() == null || memoRecord.getUpdatedBy().isBlank()) {
			memoRecord.setUpdatedBy("system");
		}
		validateRequiredItems(memoRecord);
		int updated = memoRecordMapper.update(memoRecord);
		if (updated == 0) {
			// バージョンが一致しない（他のユーザーが先に更新した）場合は保存しない
			throw new IllegalStateException("このメモは他のユーザーによって更新されています。画面を再読み込みしてから編集してください");
		}
	}

	/**
	 * 必須チェック: 項目設定で必須に指定された項目が未入力の場合は保存できない。
	 */
	private void validateRequiredItems(MemoRecord record) {
		for (ItemSetting setting : itemSettingMapper.selectAll(record.getSystemId())) {
			if (!Boolean.TRUE.equals(setting.getIsRequired())) {
				continue;
			}
			String value = getItem(record, setting.getColumnNo());
			if (value == null || value.isBlank()) {
				String name = (setting.getDisplayName() == null || setting.getDisplayName().isBlank())
						? "項目" + setting.getColumnNo()
						: setting.getDisplayName();
				throw new IllegalArgumentException("「" + name + "」は必須項目です");
			}
		}
	}

	@Override
	public void deleteMemo(Integer id) {
		memoRecordMapper.delete(id);
	}

	@Override
	public List<ItemSetting> getAllItemSettings(Integer systemId) {
		return itemSettingMapper.selectAll(resolveSystemId(systemId));
	}

	@Override
	public void editItemSetting(ItemSetting itemSetting) {
		itemSettingMapper.update(itemSetting);
	}

	@Override
	public List<CodeMaster> getAllCodeMasters(Integer systemId) {
		return codeMasterMapper.selectAll(resolveSystemId(systemId));
	}

	@Override
	public List<CodeMaster> getCodeMastersByCodeId(Integer systemId, String codeId) {
		return codeMasterMapper.selectByCodeId(resolveSystemId(systemId), codeId);
	}

	@Override
	public void addCodeMaster(CodeMaster codeMaster) {
		codeMaster.setSystemId(resolveSystemId(codeMaster.getSystemId()));
		codeMasterMapper.insert(codeMaster);
	}

	@Override
	public void editCodeMaster(CodeMaster codeMaster) {
		codeMasterMapper.update(codeMaster);
	}

	@Override
	public void deleteCodeMaster(CodeMaster codeMaster) {
		codeMasterMapper.delete(codeMaster);
	}

	@Override
	public AppUser login(String username, String password) {
		if (username == null || password == null) {
			return null;
		}
		AppUser user = appUserMapper.selectByUsername(username);
		if (user == null) {
			return null;
		}
		return passwordEncoder.matches(password, user.getPasswordHash()) ? user : null;
	}

	private String getItem(MemoRecord record, int columnNo) {
		try {
			Method m = MemoRecord.class.getMethod(String.format("getItem%02d", columnNo));
			Object v = m.invoke(record);
			return v == null ? null : v.toString();
		} catch (Exception e) {
			return null;
		}
	}

}
