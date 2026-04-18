package com.eswaradithya.clients.service;

import com.eswaradithya.clients.entity.Admins;
import com.eswaradithya.clients.models.AdminRequestDTO;
import com.eswaradithya.clients.models.SignInRequestDTO;

public interface AdminService {
	
	public Admins createAdminAccount(AdminRequestDTO request);
	
	public Admins signIn(SignInRequestDTO request);

}
