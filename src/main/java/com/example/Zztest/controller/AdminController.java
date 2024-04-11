package com.example.Zztest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {
	
	@GetMapping("/admin-dashboard")
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
	
	@GetMapping("/admin-order")
	public String orderFrm() {
		return "admin-order";
	}
	
	@GetMapping("/admin-account")
	public String accountFrm() {
		return "admin-account";
	}
	
	@GetMapping("/admin-supplier")
	public String supplierFrm() {
		return "admin-supplier";
	}
	
	@GetMapping("/admin-supplier-bill")
	public String supplierBillFrm() {
		return "admin-supplier-bill";
	}
	
	@GetMapping("/admin-import-product")
	public String importProductFrm() {
		return "admin-import-product";
	}
}
