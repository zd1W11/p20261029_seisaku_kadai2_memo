package com.example.app.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.domain.MemoRecord;
import com.example.app.service.MemoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/memos")
public class MemoApiController {
	private final MemoService service;

	// メモリストの取得（検索条件JSONが指定されれば絞り込む）
	@GetMapping
	public ResponseEntity<?> getMemos(
			@RequestParam(required = false) Integer systemId,
			@RequestParam(required = false) String search) {
		try {
			List<MemoRecord> memos = (search == null || search.isBlank())
					? service.getAllMemos(systemId)
					: service.searchMemos(systemId, search);
			return new ResponseEntity<>(memos, HttpStatus.OK);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(java.util.Map.of("message", e.getMessage()));
		}
	}

	// 指定項目の既存値一覧（ドロップダウン検索の選択肢用）
	@GetMapping("/distinct-values")
	public ResponseEntity<?> getDistinctValues(
			@RequestParam(required = false) Integer systemId,
			@RequestParam Integer columnNo) {
		try {
			return new ResponseEntity<>(service.getDistinctValues(systemId, columnNo), HttpStatus.OK);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(java.util.Map.of("message", e.getMessage()));
		}
	}

	// ID に基づくメモの取得
	@GetMapping("/{id}")
	public ResponseEntity<MemoRecord> getMemoById(@PathVariable int id) {
		MemoRecord memo = service.getMemoById(id);
		HttpStatus status = memo == null ? HttpStatus.NOT_FOUND : HttpStatus.OK;
		return new ResponseEntity<>(memo, status);
	}

	// メモの追加
	@PostMapping
	public ResponseEntity<?> addMemo(
			@RequestBody @Valid MemoRecord memoRecord,
			Errors errors) {
		if (errors.hasErrors()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		try {
			service.addMemo(memoRecord);
		} catch (IllegalArgumentException e) {
			// 必須項目チェックなどの業務エラーは理由を返す
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(java.util.Map.of("message", e.getMessage()));
		}
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	// メモの編集
	@PutMapping
	public ResponseEntity<?> updateMemo(
			@RequestBody @Valid MemoRecord memoRecord,
			Errors errors) {
		if (errors.hasErrors()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		try {
			service.editMemo(memoRecord);
		} catch (IllegalStateException e) {
			// 排他制御（バージョン不一致）は 409 で理由を返す
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(java.util.Map.of("message", e.getMessage()));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(java.util.Map.of("message", e.getMessage()));
		}
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	// メモの削除
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteMemo(@PathVariable int id) {
		service.deleteMemo(id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
