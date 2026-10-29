package com.example.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.domain.ItemSetting;

@Mapper
public interface ItemSettingMapper {

	List<ItemSetting> selectAll(@Param("systemId") Integer systemId);

	void insert(ItemSetting itemSetting);

	void update(ItemSetting itemSetting);

	void deleteBySystemId(@Param("systemId") Integer systemId);

}
