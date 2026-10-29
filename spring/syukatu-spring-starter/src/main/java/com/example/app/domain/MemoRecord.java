package com.example.app.domain;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class MemoRecord {

	private Integer id;

	private Integer systemId;

	private String item01;
	private String item02;
	private String item03;
	private String item04;
	private String item05;
	private String item06;
	private String item07;
	private String item08;
	private String item09;
	private String item10;
	private String item11;
	private String item12;
	private String item13;
	private String item14;
	private String item15;
	private String item16;
	private String item17;
	private String item18;
	private String item19;
	private String item20;
	private String item21;
	private String item22;
	private String item23;
	private String item24;
	private String item25;
	private String item26;
	private String item27;
	private String item28;
	private String item29;
	private String item30;
	private String item31;
	private String item32;
	private String item33;
	private String item34;
	private String item35;
	private String item36;
	private String item37;
	private String item38;
	private String item39;
	private String item40;
	private String item41;
	private String item42;
	private String item43;
	private String item44;
	private String item45;
	private String item46;
	private String item47;
	private String item48;
	private String item49;
	private String item50;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime registeredAt;

	private String registeredBy;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime updatedAt;

	private String updatedBy;

	/** 排他制御用バージョン（登録時は1、更新のたびに+1） */
	private Integer version;

}
