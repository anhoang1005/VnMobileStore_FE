package com.example.Zztest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

	@GetMapping("/signin")
	public String signinFrm() {
		return "signin";
	}
	
	@GetMapping("/signup")
	public String signupFrm() {
		return "signup";
	}
	
	@GetMapping("/home")
	public String homeFrm() {
		return "home";
	}
	
	@GetMapping("/cart")
	public String cartFrm() {
		return "cart";
	}
	
	@GetMapping("/detail/{slug}/{vesion}")
	public String detailFrm() {
		return "detail";
	}
	
	@GetMapping("/product-detail/{slug}/{vesion}")
	public String productDetailFrm() {
		return "product-detail";
	}
	
	@GetMapping("/401")
	public String unAuthorFrm() {
		return "401";
	}
	
	@GetMapping("/403")
	public String forbiddenFrm() {
		return "403";
	}
	
	@GetMapping("/404")
	public String notFoundFrm() {
		return "404";
	}
	
	@GetMapping("/checkout")
	public String checkoutFrm() {
		return "checkout";
	}
	
	
	@GetMapping("/test")
	public String testFrm() {
		return "test";
	}
	
	@GetMapping("/profile")
	public String profileFrm() {
		return "profile";
	}
	
	@GetMapping("/contact")
	public String contactFrm() {
		return "contact";
	}
	
	@GetMapping("/create-order")
	public String createOrderFrm() {
		return "create-order";
	}
	
	@GetMapping("/customer-order")
	public String customerOrderFrm() {
		return "customer-order";
	}
}
