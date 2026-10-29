package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.app.domain.AppSystem;

@Mapper
public interface AppSystemMapper {

	List<AppSystem> selectAll();

	AppSystem selectById(Integer id);

	void insert(AppSystem appSystem);

	void update(AppSystem appSystem);

	void delete(Integer id);

}
