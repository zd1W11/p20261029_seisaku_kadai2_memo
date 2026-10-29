package com.example.app.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.app.domain.AppUser;

@Mapper
public interface AppUserMapper {

	AppUser selectByUsername(@Param("username") String username);

}
