$(document).ready(function() {
	var vnMobileTokenString = localStorage.getItem('VnMobileToken');
	var vnMobileToken = JSON.parse(vnMobileTokenString);
	if (vnMobileToken !== null) {
		const specificDateTime = vnMobileToken.expiresAt;
		const specificDate = new Date(specificDateTime);
		const currentDate = new Date();
		if(specificDate> currentDate){
			alert('Hết phiên đăng nhập, bạn cần đăng nhập lại!');
			localStorage.removeItem('VnMobileToken');
			window.location.href='/login';
		}
		if (vnMobileToken.role === 'QUANLI') {
			$("#userfullName").text(vnMobileToken.fullName);
			$("#orderHistory").hide();
			$("#cartInMenuBtn").hide();
			$('#loginMenu').hide();
			$("#userDropdown").show();
		}
		else if (vnMobileToken.role === 'KHACHHANG') {
			$("#userfullName").text(vnMobileToken.fullName);
			$("#adminDashBoard").hide();
			$('#loginMenu').hide();
			$("#userDropdown").show();
			var cartStoraged = "vnMobileCart_" + vnMobileToken.email;
			var cart = [];
			if (localStorage.getItem(cartStoraged) !== null) {
				cart = JSON.parse(localStorage.getItem(cartStoraged));
			}
			$("#cartInMenuQuantity").html(`${cart.length}`);
			$("#cartInMenuBtn").show();
			console.log("So san pham: " + cart.length);
		}
		else if (vnMobileToken.role === 'NHANVIENBANHANG') {
			$("#userfullName").text(vnMobileToken.fullName);
			$('#loginMenu').hide();
			$("#userDropdown").show();
			$("#cartInMenuBtn").hide();
		}
		else if (vnMobileToken.role === 'NHANVIENKHO') {
			$("#userfullName").text(vnMobileToken.fullName);
			$('#loginMenu').hide();
			$("#userDropdown").show();
			$("#cartInMenuBtn").hide();

		}
		if (vnMobileToken.avatar !== null) {
			$('#userAvatar').attr('src', vnMobileToken.avatar);
			$("#cartMenuBtn").hide();
		}

		$("#logoutAdmin").on("click", function() {
			localStorage.removeItem('VnMobileToken');
			localStorage.removeItem('CURRENT_USER_INFO');
			window.location.href = '/home';
		});
	}
	else {

	}
	 //setInterval(updateUserInfo, 1000);
});






