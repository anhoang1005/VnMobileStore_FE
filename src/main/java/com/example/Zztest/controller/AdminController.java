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
	
	@GetMapping("/admin-insert-product")
	public String addProductFrm() {
		return "admin-insert-product";
	}
	
	@GetMapping("/admin-update-product")
	public String updateProductFrm() {
		return "admin-update-product";
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
	
	@GetMapping("/admin-cart-bill")
	public String cartBillFrm() {
		return "admin-cart-bill";
	}
	
	@GetMapping("/quanli-account")
	public String quanliAccountFrm() {
		return "quanli-account";
	}
	
	@GetMapping("/admin-template-dashboard")
	public String adminDashBoardFrm() {
		return "admin-template-dashboard";
	}
	
	@GetMapping("/admin-order-report")
	public String adminOrderReportFrm() {
		return "admin-order-report";
	}
	
	@GetMapping("/admin-supplier-report")
	public String supplierReportFrm() {
		return "admin-supplier-report";
	}
	
	@GetMapping("/admin-product-report")
	public String productReportFrm() {
		return "admin-product-report";
	}
	
}
