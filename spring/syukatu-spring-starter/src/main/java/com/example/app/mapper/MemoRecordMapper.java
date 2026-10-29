package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.domain.MemoRecord;
import com.example.app.domain.MemoSearchCondition;

@Mapper
public interface MemoRecordMapper {

	List<MemoRecord> selectAll(@Param("systemId") Integer systemId);

	List<MemoRecord> selectBySearch(@Param("systemId") Integer systemId,
			@Param("conditions") List<MemoSearchCondition> conditions);

	/** 指定項目の既存値一覧（列名はサーバー側で item_%02d 形式に生成したものだけを渡す） */
	List<String> selectDistinctValues(@Param("systemId") Integer systemId,
			@Param("columnName") String columnName);

	int countBySystemId(@Param("systemId") Integer systemId);

	MemoRecord selectById(Integer id);

	void insert(MemoRecord memoRecord);

	/** 更新件数を返す（排他制御: バージョン不一致の場合は0） */
	int update(MemoRecord memoRecord);

	void delete(Integer id);

}
