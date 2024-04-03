$(document).ready(function() {
	$("#overlay").hide();
	$("#submitSignup").on("click", function() {
		var fullName = $('#fullName').val();
		var phoneNumber = $('#phoneNumber').val();
		var username = $('#username').val();
		var password = $('#password').val();
		var repassword = $('#rePassword').val();

		var nameRegex = /^[^0-9!@#$%^&*(),.?":{}|<>]*$/;
		var emailRegex = /^[A-Za-z0-9]+[A-Za-z0-9]*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)$/;
		var phoneNumberRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;

		$('#nameMessage').text('');
		$('#emailMessage').text('');
		$('#telephoneMessage').text('');

		if (password != repassword) {
			$('#passwordMessage').text('Mật khẩu nhập lại không trùng!');
			document.getElementById('password').value = '';
			document.getElementById('rePassword').value = '';
			return; // Ngăn chặn gửi yêu cầu nếu mật khẩu không khớp
		}
		else if (password === "") {
			$('#passwordMessage').text('Mật khẩu không được để trống!');
			document.getElementById('password').value = '';
			document.getElementById('rePassword').value = '';
			return;
		}
		else if (password.length < 8) {
			$('#passwordMessage').text('Mật khẩu phải có ít nhất 8 kí tự!');
			document.getElementById('password').value = '';
			document.getElementById('rePassword').value = '';
			return;
		}
		else if (!nameRegex.test(fullName) || fullName === "") {
			$('#nameMessage').text('Họ tên không hợp lệ!');
			document.getElementById('fullName').value = '';
			return;
		}
		else if (!phoneNumberRegex.test(phoneNumber) || phoneNumber === "") {
			$('#telephoneMessage').text('Só điện thoại không hợp lệ!');
			document.getElementById('phoneNumber').value = '';
			return;
		}
		else if (!emailRegex.test(username) || username === "") {
			$('#emailMessage').text('Email không hợp lệ!');
			document.getElementById('username').value = '';
			return;
		}
		else if (!$("#exampleCheck").is(":checked")) {
			$("#dieukhoanMessage").text('Bạn phải đông ý với điều khoản của chúng tôi!');
			return;
		}

		$("#overlay").show();
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/user/checkExist/" + username,
			success: function(response) {
				if (response.success) {
					$.ajax({
						method: "POST",
						url: "http://localhost:8888/api/user/signup",
						data: JSON.stringify({
							fullName: fullName,
							phoneNumber: phoneNumber,
							email: username,
							password: password
						}),
						contentType: 'application/json',
						success: function(response) {
							$("#overlay").hide();
							if (response.success) {
								//alert('Gửi tin nhắn xác nhận thành công!');
								$("#verifyUserModal").modal('show');
								//window.location.href = "/signin";
							} else {
								$("#overlay").hide();
								$('#signupMessage').text('Gửi tin nhắn xác nhận không thành công!');
							}
						},
						error: function(xhr, status, error) {
							$("#overlay").hide();
							console.error(xhr.responseText);
							console.log('Đã xảy ra lỗi khi gửi yêu cầu.' + status + error);
							document.getElementById('signupMessage').innerHTML = 'Lỗi Server!';
						}
					});

				} else {
					$("#overlay").hide();
					$('#emailMessage').text('Email đã tồn tại, vui lòng nhập email khác!');
				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				console.error(xhr.responseText);
				console.log('Đã xảy ra lỗi khi gửi yêu cầu.' + status + error);
				document.getElementById('signupMessage').innerHTML = 'Lỗi Server!';
			}
		});
		
		$("#submitverifyCode").click(function() {
			var verifyCode = $("#verify_code").val();
			var usernameSubmit = $('#username').val();
			if(verifyCode === ""){
				$('#verifyMessage').text('Mã xác nhận không đúng!');
				return;
			}
			$("#overlay").show();
			$.ajax({
				method: "GET",
				url: "http://localhost:8888/api/user/verify/" + usernameSubmit +"/" + verifyCode,
				success: function(response) {
					$("#overlay").hide();
					if (response.success) {
						$("#verifyUserModal").modal('hide');
						$("#messageConfirm").html(`<i style="color: green" class="fa-solid fa-circle-check"></i> Xác nhận thành công!`);
						$("#confirmModal").modal('show');
						$("#confirmModalButton").click(function(){
							window.location.href='/signin';
						});
					} else {
						$('#verifyMessage').text('Mã xác nhận không đúng!');
					}
				},
				error: function(xhr, status, error) {
					window.location.href='/403';
					$("#overlay").hide();
				}
			});

		});

	});
});