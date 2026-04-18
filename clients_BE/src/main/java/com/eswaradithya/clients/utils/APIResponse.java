package com.eswaradithya.clients.utils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class APIResponse<T> {
	
	private int code;
	private String message;
	private T data;
	private boolean success;
	
	public static <T> APIResponse<T> success(int code, String message, T data) {
		return APIResponse.<T>builder()
				.code(code)
				.message(message)
				.data(data)
				.success(true)
				.build();
	}
	 public static <T> APIResponse<T> error(int code, String message) {
	        return APIResponse.<T>builder()
	                .code(code)
	                .message(message)
	                .success(false)
	                .build();
	    }
	public static <T> APIResponse<T> error(int code, String message, T data) {
		return APIResponse.<T>builder()
				.code(code)
				.message(message)
				.data(data)
				.success(false)
				.build();
	}

}
