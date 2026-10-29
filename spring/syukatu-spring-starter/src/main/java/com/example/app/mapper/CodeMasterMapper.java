package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.domain.CodeMaster;

@Mapper
public interface CodeMasterMapper {

	List<CodeMaster> selectAll(@Param("systemId") Integer systemId);

	List<CodeMaster> selectByCodeId(@Param("systemId") Integer systemId, @Param("codeId") String codeId);

	void insert(CodeMaster codeMaster);

	void update(CodeMaster codeMaster);

	void delete(CodeMaster codeMaster);

	void deleteBySystemId(@Param("systemId") Integer systemId);

}
