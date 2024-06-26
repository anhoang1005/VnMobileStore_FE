$(document).ready(function() {
	$("#overlay").hide();
	//Token
	var vnMobileToken = null;
	if (localStorage.getItem('VnMobileToken') !== null) {
		vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
	}
	else {
		window.location.href = '/401';
	}
	showInfo(vnMobileToken);

	function showInfo(vnMobileToken) {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/custom/user/getInfo/" + vnMobileToken.email,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(userInfo) {
				if (userInfo.success) {
					localStorage.setItem("CURRENT_USER_INFO", JSON.stringify(userInfo.data));
					var userInfoHtml = `<div class="card-body text-center">
								<div class="d-flex justify-content-center align-items-center">
									<div class="avatar-container"
										style="width: 200px; height: 200px; overflow: hidden; border-radius: 50%;">
										<img id="userAvatar" class="avatar"
											style="width: 100%; height: 100%; object-fit: cover;" src="${userInfo.data.avatar}"
											alt="Avatar">
									</div>
								</div>
								<h5 id="userFullName" class="my-3">${userInfo.data.fullName}</h5>
								<p id="userRole" class="text-muted mb-1">${userInfo.data.role.toLowerCase()}</p>
								<p id="userPhoneNumber" class="text-muted mb-4">${userInfo.data.phoneNumber}</p>
								<div class="d-flex justify-content-center mb-2">
									<button id="changePasswordBtn" type="button" class="btn btn-danger mr-2 col-sm-5">Đổi mật khẩu</button>
									<button id="changeAvatarBtn" class="btn btn-success col-sm-5">Đổi avatar</button>
								</div>
							</div>`
					$("#userInfomation").html(userInfoHtml);
					$("#fullName").html(userInfo.data.fullName);
					$("#email").html(userInfo.data.email);
					$("#role").html(userInfo.data.role.toLowerCase());
					$("#phoneNumber").html(`${userInfo.data.phoneNumber}`);

					var date = new Date(userInfo.data.createdAt);
					var day = date.getDate().toString().padStart(2, '0'); // Định dạng ngày thành hai chữ số
					var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Định dạng tháng thành hai chữ số
					var year = date.getFullYear();
					var hours = date.getHours().toString().padStart(2, '0'); // Định dạng giờ thành hai chữ số
					var minutes = date.getMinutes().toString().padStart(2, '0'); // Định dạng phút thành hai chữ số
					var seconds = date.getSeconds().toString().padStart(2, '0'); // Định dạng giây thành hai chữ số
					var formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
					$("#createdAt").html(`${formattedDate}`)
				} else {
					window.location.href = "/404";
				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				window.location.href = "/403";
			}
		});
	}

	//Chinh sua thong tin ca nhan
	function editProfile(fullName, phoneNumber, email) {
		$.ajax({
			method: "POST",
			url: "http://localhost:8888/api/custom/user/editProfile",
			data: JSON.stringify({
				fullName: fullName,
				phoneNumber: phoneNumber,
				email: email
			}),
			contentType: 'application/json',
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					$("#updateProfileModal").modal('hide');
					localStorage.setItem('VnMobileToken', JSON.stringify(response.data));
					window.location.href = '/profile';
					//showInfo(vnMobileToken);
				} else {
					window.location.href = "/404";
				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				console.log(error);
				//window.location.href = "/403";
			}
		});
	}

	//Click nut sua
	$("#updateProfileBtn").click(function() {
		$("#updateProfileModal").modal('show');
		var userInfo = [];
		if (localStorage.getItem("CURRENT_USER_INFO") !== null) {
			userInfo = JSON.parse(localStorage.getItem("CURRENT_USER_INFO"));
			$("#update_fullName").val(`${userInfo.fullName}`);
			$("#update_email").val(`${userInfo.email}`);
			$("#update_email").prop("disabled", true);
			$("#update_phoneNumber").val(`${userInfo.phoneNumber}`);
			$("#update_role").val(`${userInfo.role}`);
			$("#update_role").prop("disabled", true);

			var nameRegex = /^[^0-9!@#$%^&*(),.?":{}|<>]*$/;
			var phoneNumberRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
			$("#submitUpdateProfile").click(function() {
				var fullName = $("#update_fullName").val();
				var phoneNumber = $("#update_phoneNumber").val();
				if (!nameRegex.test(fullName) || fullName === "") {
					$('#nameMessage').text('Họ tên không hợp lệ!');
					document.getElementById('fullName').value = '';
					return;
				}
				else if (!phoneNumberRegex.test(phoneNumber) || phoneNumber === "") {
					$('#telephoneMessage').text('Só điện thoại không hợp lệ!');
					document.getElementById('phoneNumber').value = '';
					return;
				}
				editProfile(fullName, phoneNumber, userInfo.email, userInfo.avatar);
			});
		}
		else {
			window.location.href = '/403';
		}
	});


	$(document).on('click', '#changeAvatarBtn', function() {
		$("#changeAvatarModal").modal('show');
		$('#update-avatar').change(function() {
			$("#avatarMessage").html(``);
			var fileInput = $(this)[0];
			var file = fileInput.files[0]; // Lấy file đầu tiên trong danh sách các file được chọn
			if (file) {
				var reader = new FileReader();
				reader.onload = function(e) {
					$('#changeAvatarImg').attr('src', e.target.result)
				};
				reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
			} else {
				$("#avatarMessage").html(`Bạn chưa chọn ảnh!`);
				$('#changeAvatarImg').attr('src', '/img/avatar/user.png');
			}
		});
	});

	$(document).on('click', '#submitChangeAvatar', function() {
		var fileInput = $('#update-avatar')[0];
		var file = fileInput.files[0];
		var fullName = vnMobileToken.fullName;
		var phoneNumber = vnMobileToken.phoneNumber;
		var email = vnMobileToken.email;
		if(!file){
			$("#avatarMessage").html(`Bạn chưa chọn ảnh!`);
			return;
		}
		var formData = new FormData();
		formData.append('email', email)
		formData.append('file', file);
		$("#changeAvatarModal").modal('hide');
		$("#overlay").show();
		$.ajax({
			method: "PUT",
			url: "http://localhost:8888/api/custom/user/changeAvatar",
			data: formData,
			processData: false,
			contentType: false,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				$("#overlay").hide();
				if (response.success) {
					localStorage.setItem('VnMobileToken', JSON.stringify(response.data));
					window.location.href = '/profile';
				} else {
					window.location.href = "/403";
				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				console.log(error);
				window.location.href = "/403";
			}
		});
	});



	$(document).on('click', '#changePasswordBtn', function() {
		$("#changePasswordModal").modal('show');
	});

	$(document).on('click', '#submitChangePassword', function() {
		var emailUser = vnMobileToken.email;
		var currentPassword = $("#current_password").val();
		var newPassword = $("#update_password").val();
		var reNewPassword = $("#reupdate_password").val();

		if (currentPassword === "") {
			$("#passwordMessage").text('Mật khẩu không được để trống!');
			return;
		}
		else if (newPassword === "") {
			$("#uppasswordMessage").text('Mật khẩu mới không được để trống!');
			return;
		}
		else if (reNewPassword === "") {
			$("#repasswordMessage").text('Mật khẩu nhập lại không được để trống!');
			return;
		}
		else if (newPassword !== reNewPassword) {
			$("#uppasswordMessage").text('Mật khẩu mới nhập lại không trùng!');
			$("#update_password").val('');
			$("#reupdate_password").val('');
			return;
		}
		else if (newPassword === currentPassword) {
			$("#uppasswordMessage").text('Mật khẩu mới không được trùng với mật khẩu cũ!');
			return;
		}

		$.ajax({
			method: "PUT",
			url: "http://localhost:8888/api/custom/user/changePassword",
			data: {
				email: emailUser,
				password: currentPassword,
				newPassword: newPassword
			},
			//contentType: 'application/json',
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					$("#changePasswordModal").modal('hide');
					$("#messageConfirm").html(`<i style="color: green" class="fa-solid fa-circle-check"></i> Đôi mật khẩu thành công!`)
					$("#confirmModal").modal('show');
					showInfo(vnMobileToken);
				} else {
					$("#passwordMessage").text('Mật khẩu sai!');
					$("#current_password").val('');
				}
			},
			error: function(xhr, status, error) {
				//$("#overlay").hide();
				console.log(error);
				window.location.href = "/403";
			}
		});
	});

});