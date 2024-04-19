$(document).ready(function() {
	//Token
	var vnMobileToken = null;
	if (localStorage.getItem('VnMobileToken') !== null) {
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
		if (vnMobileToken.role === "QUANLI") {
			$("#userAvatar").attr('src', vnMobileToken.avatar);
			$("#userfullName").html(`${vnMobileToken.fullName} (${vnMobileToken.role.toLowerCase()})`)
		}
		else {
			window.location.href = '/401';
		}
	}
	else {
		window.location.href = '/401';
	}

	$("#logoutUser").click(function() {
		localStorage.removeItem('VnMobileToken');
		localStorage.removeItem('CURRENT_USER_INFO');
		window.location.href = '/home';
	});
});