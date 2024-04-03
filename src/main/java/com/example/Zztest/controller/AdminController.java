package com.example.Zztest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {
	
	@GetMapping("/quanli")
	public String admindashboardFrm() {
		return "admindashboard";
	}
	
	@GetMapping("/admin-productmanager")
	public String productManagerFrm() {
		return "admin-productmanager";
	}
	
	@GetMapping("/admin-addproduct")
	public String addProductFrm() {
		return "admin-addproduct";
	}
}
