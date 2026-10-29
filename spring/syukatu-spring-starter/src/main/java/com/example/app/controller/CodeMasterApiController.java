package com.example.app.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.domain.CodeMaster;
import com.example.app.service.MemoService;

import lombok.RequiredArgsConstructor;

/**
 * コードマスタの API
 * 項目設定のコードIDと紐づく選択肢（設定コード・文字列・数値・表示順）を管理する。
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/code-masters")
public class CodeMasterApiController {
	private final MemoService service;

	// コードマスタリストの取得（codeId 指定時はそのコードのみ、表示順）
	@GetMapping
	public ResponseEntity<List<CodeMaster>> getCodeMasters(
			@RequestParam(required = false) Integer systemId,
			@RequestParam(required = false) String codeId) {
		List<CodeMaster> codes = (codeId == null || codeId.isBlank())
				? service.getAllCodeMasters(systemId)
				: service.getCodeMastersByCodeId(systemId, codeId);
		return new ResponseEntity<>(codes, HttpStatus.OK);
	}

	// コードマスタの追加
	@PostMapping
	public ResponseEntity<Void> addCodeMaster(
			@RequestBody @Valid CodeMaster codeMaster,
			Errors errors) {
		if (errors.hasErrors()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		service.addCodeMaster(codeMaster);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	// コードマスタの編集（文字列・数値・表示順。コードIDと設定コードは変更不可）
	@PutMapping
	public ResponseEntity<Void> updateCodeMaster(
			@RequestBody @Valid CodeMaster codeMaster,
			Errors errors) {
		if (errors.hasErrors()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		service.editCodeMaster(codeMaster);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	// コードマスタの削除
	@DeleteMapping
	public ResponseEntity<Void> deleteCodeMaster(
			@RequestParam Integer systemId,
			@RequestParam String codeId,
			@RequestParam String settingCode) {
		CodeMaster key = new CodeMaster();
		key.setSystemId(systemId);
		key.setCodeId(codeId);
		key.setSettingCode(settingCode);
		service.deleteCodeMaster(key);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
