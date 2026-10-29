package com.example.app.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.domain.ItemSetting;
import com.example.app.service.MemoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/settings")
public class SettingApiController {
	private final MemoService service;

	// 項目設定リストの取得
	@GetMapping("/items")
	public ResponseEntity<List<ItemSetting>> getItemSettings(
			@RequestParam(required = false) Integer systemId) {
		return new ResponseEntity<>(service.getAllItemSettings(systemId), HttpStatus.OK);
	}

	// 項目設定の編集
	@PutMapping("/items")
	public ResponseEntity<Void> updateItemSetting(
			@RequestBody @Valid ItemSetting itemSetting,
			Errors errors) {
		if (errors.hasErrors()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		service.editItemSetting(itemSetting);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
