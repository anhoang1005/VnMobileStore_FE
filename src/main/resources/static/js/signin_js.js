$(document).ready(function() {
	$("#overlay").hide();

	//Click đăng nhập
	$("#submitLogin").on("click", function() {
		var username = $('#username').val();
		var password = $('#password').val();
		$("#overlay").show();
		$.ajax({
			method: "POST",
			url: "http://localhost:8888/api/user/login",
			data: {
				username: username,
				password: password
			},
			success: function(response) {
				//console.log(response);
				if (response.success) {
					localStorage.setItem("VnMobileToken", JSON.stringify(response.data));
					window.location.href = "/home";
				} else {
					$("#overlay").hide();
					document.getElementById('loginMessage').innerHTML = 'Sai tài khoản hoặc mật khẩu!';
				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				window.location.href = "/403";
			}
		});
	});


	//Click quên mật khẩu
	$("#forgotPassword").click(function(event) {
		event.preventDefault();
		var usernameForgot = $("#username").val();
		if (usernameForgot === "") {
			$('#forgotMessage').text('Nhập email để sử dụng quên mật khẩu!');
			return;
		}
		var emailRegex = /^[A-Za-z0-9]+[A-Za-z0-9]*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)$/;
		if (!emailRegex.test(usernameForgot)) {
			$("#forgotMessage").html(`Email không hợp lệ, vui lòng nhập email hợp lệ để lấy lại mật khẩu!`);
			return;
		}

		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/user/checkExist/" + usernameForgot,
			success: function(response) {
				if (response.success) {
					$("#forgotMessage").html(`Email này chưa đăng kí tài khoản nào!`);
				} else {
					$("#overlay").show();
					$.ajax({
						method: "POST",
						url: "http://localhost:8888/api/user/forgotPassword",
						data: {
							email: usernameForgot,
						},
						success: function(response) {
							$("#overlay").hide();
							if (response.success) {
								$("#verifyForgotModal").modal('show');
								cconsole.log('verify Modal');
							} else {
								$("#overlay").hide();
								$('#forgotMessage').text('Gửi tin nhắn xác nhận không thành công!');
							}
						},
						error: function(xhr, status, error) {
							$("#overlay").hide();
							window.location.href = '/403';
							console.error(xhr.responseText);
							console.log('Đã xảy ra lỗi khi gửi yêu cầu.' + status + error);
							document.getElementById('signupMessage').innerHTML = 'Lỗi Server!';
						}
					});
				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				console.error(xhr.responseText);
				console.log('Đã xảy ra lỗi khi gửi yêu cầu.' + status + error);
				document.getElementById('signupMessage').innerHTML = 'Lỗi Server!';
			}
		});
	});

	//Click xác nhận code
	$("#submitverifyCode").click(function() {
		var usernameForgot = $("#username").val();
		var verifyCode = $("#verify_code").val();
		var newPass = $("#new_password").val();
		var reNewPass = $("#renew_password").val();

		console.log(usernameForgot + " " + verifyCode + " " + newPass);

		if (newPass !== reNewPass) {
			$("#newPassMessage").text('Mật khẩu nhập lại không trùng!');
			$("#new_password").val('');
			$("#renew_password").val('');
			return;
		}
		else if (newPass === "") {
			$("#newPassMessage").text('Mật khẩu không được để trống!');
			$("#new_password").val('');
			$("#renew_password").val('');
			return;
		}
		else if (newPass.length < 6) {
			$("#newPassMessage").text('Mật khẩu phải cí ít nhất 6 kí tu!');
			$("#new_password").val('');
			$("#renew_password").val('');
		}

		$.ajax({
			method: "POST",
			url: "http://localhost:8888/api/user/verifyPassword",
			data: {
				email: usernameForgot,
				verifyCode: verifyCode,
				newPassword: newPass
			},
			success: function(response) {
				if (response.success) {
					$("#messageConfirm").html(`<i style="color: green" class="fa-solid fa-circle-check"></i> Đổi mật khẩu thành công!`);
					$("#verifyForgotModal").modal('hide');
					$("#confirmModal").modal('show');
				} else {
					if (arguments.message === "Verify code khong dung!") {
						$("#verifyMessage").text('Mã xác nhận không đúng!');
					}
					else {
						$("#verifyMessage").text('Mã xác nhận không đúng!');
					}
				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				window.location.href = '/403';
			}
		});
	});

	//

	//Click xác nhận confirm
	$("#confirmModalButton").click(function() {
		window.location.href = '/signin';
	});

	//Gui lai ma xac nhan
	$("#sendAgainCode").click(function() {
		var usernameForgot = $("#username").val();
		$("#overlay").show();
		$.ajax({
			method: "POST",
			url: "http://localhost:8888/api/user/forgotPassword",
			data: {
				email: usernameForgot,
			},
			success: function(response) {
				$("#overlay").hide();
				if (response.success) {
					$('#verifyMessage').html('<span style="color: green">Gửi lại xác nhận thành công!</span>');
				} else {
					$("#overlay").hide();
					$('#verifyMessage').text('Gửi tin nhắn xác nhận không thành công!');
				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				window.location.href = '/403';
				console.error(xhr.responseText);
				console.log('Đã xảy ra lỗi khi gửi yêu cầu.' + status + error);
				document.getElementById('signupMessage').innerHTML = 'Lỗi Server!';
			}
		});
	});

});