package com.example.Zztest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {
	
	@GetMapping("/quanli")
	public String admindashboardFrm() {
		return "admin-dashboard";
	}
	
	@GetMapping("/admin-product")
	public String productManagerFrm() {
		return "admin-product";
	}
	
	@GetMapping("/admin-addproduct")
	public String addProductFrm() {
		return "admin-addproduct";
	}
	
	@GetMapping("/admin-category")
	public String categoryFrm() {
		return "admin-category";
	}
	
	@GetMapping("/admin-account")
	public String accountFrm() {
		return "admin-account";
	}
}
