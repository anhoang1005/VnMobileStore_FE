$(document).ready(function() {
	//Token
	var vnMobileToken = null;
	if (localStorage.getItem('VnMobileToken') !== null) {
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
		if (vnMobileToken.role === "QUANLI") {
			baseTable();
		}
		else {
			window.location.href = '/401';
		}
	}
	else {
		window.location.href = '/401';
	}

	//Table mo dau trang
	function baseTable() {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/user/getall",
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					showTable(response.data);
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

	//Hien table
	function showTable(listAccount) {
		var tableHtml = ``;
		$.each(listAccount, function(index, value) {
			tableHtml += `<tr>
							<th scope="row">
								<input class="form-check-input" type="checkbox" value=""
								id="flexCheckDefault">
							</th>
							<td>#A0000${value.id}</td>
							<td>
								<div class="avatar-container"
									style="width: 40px; height: 40px; overflow: hidden; border-radius: 50%;">
									<img id="userAvatar" class="avatar" style="width: 100%; height: auto; object-fit: cover;"
									src="${value.avatar}" alt="Avatar">
								</div>
							</td>
							<td>${value.fullName}</td>
							<td>${value.email}</td>
							<td>${value.phoneNumber}</td>
							<td>${value.role}</td>`;
			if (value.enable === true) {
				tableHtml += `<td>Đã xác thực</td>`;
			}
			else {
				tableHtml += `<td>Chưa xác thực</td>`;
			}

			if (value.deleted === true) {
				tableHtml += `<td>
								<button account-id="${value.id}" class="btn btn-success update-account"><i class="fa-solid fa-pen-to-square"></i></button>
								<button account-id="${value.id}" class="btn btn-danger lock-account"><i class="fa-solid fa-lock"></i></button>
							</td>`
			}
			else {
				tableHtml += `<td>
								<button account-id="${value.id}" class="btn btn-success update-account"><i class="fa-solid fa-pen-to-square"></i></button>
								<button account-id="${value.id}" class="btn btn-warning unlock-account"><i class="fa-solid fa-unlock"></i></button>
							</td>`
			}

			tableHtml += ` </tr>`
		});
		$("#bodyTable").html(tableHtml);
	}

	//Phan quyen tai khoan
	$(document).on('click', '.update-account', function() {
		var userId = $(this).attr('account-id');
		$("#phanquyenModal").modal('show');

		$("#submitUpdateAccount").click(function() {
			var updateRole = $("#roleSelect").val();
			if (updateRole === "") {
				$("#phanquyenMessage").html('Bạn phải chọn quyền!');
				return;
			}

			$.ajax({
				method: "POST",
				url: "http://localhost:8888/api/admin/user/updateRole",
				data: {
					id: userId,
					updateRole: updateRole
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
				success: function(response) {
					$("#phanquyenModal").modal('hide');
					if (response.success) {
						$("#confirmMess").html('<i style="color: green" class="fa-regular fa-circle-check"></i> Cập nhật quyền thành công!')
						$("#confirmModal").modal('show');
						baseTable();
					} else {
						$("#confirmMess").html('<i style="color: red" class="fa-regular fa-circle-xmark"></i> Cập nhật quyền thất bại!')
						$("#confirmModal").modal('show');
					}
				},
				error: function(xhr, status, error) {
					console.log(error);
					//window.location.href = "/403";
				}
			});
		});
	});

	//Khoa tai khoan
	$(document).on('click', '.lock-account', function() {
		var userId = $(this).attr('account-id');
		$("#lockModal").modal('show');

		$("#confirmLockBtn").click(function() {
			$.ajax({
				method: "POST",
				url: "http://localhost:8888/api/admin/user/lockStatus",
				data: {
					id: userId,
					deleted: false
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
				success: function(response) {
					$("#lockModal").modal('hide');
					if (response.success) {
						$("#confirmMess").html('<i style="color: green" class="fa-regular fa-circle-check"></i> Khóa tài khoản thành công!')
						$("#confirmModal").modal('show');
						baseTable();
					} else {
						$("#confirmMess").html('<i style="color: red" class="fa-regular fa-circle-xmark"></i> Khóa tài khoản thất bại!')
						$("#confirmModal").modal('show');
					}
				},
				error: function(xhr, status, error) {
					console.log(error);
					//window.location.href = "/403";
				}
			});
		});
	});

	//Mo khoa tai khoan
	$(document).on('click', '.unlock-account', function() {
		var userId = $(this).attr('account-id');
		$("#unlockModal").modal('show');

		$("#confirmUnLockBtn").click(function() {
			$.ajax({
				method: "POST",
				url: "http://localhost:8888/api/admin/user/lockStatus",
				data: {
					id: userId,
					deleted: true
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
				success: function(response) {
					$("#unlockModal").modal('hide');
					if (response.success) {
						$("#confirmMess").html('<i style="color: green" class="fa-regular fa-circle-check"></i> Mở khóa tài khoản thành công!')
						$("#confirmModal").modal('show');
						baseTable();
					} else {
						$("#confirmMess").html('<i style="color: red" class="fa-regular fa-circle-xmark"></i> Mở khóa tài khoản thất bại!')
						$("#confirmModal").modal('show');
					}
				},
				error: function(xhr, status, error) {
					console.log(error);
					//window.location.href = "/403";
				}
			});
		});
	});
});