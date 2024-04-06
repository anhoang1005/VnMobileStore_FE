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
								<button class="btn btn-success update-account"><i class="fa-solid fa-pen-to-square"></i></button>
								<button class="btn btn-danger lock-account"><i class="fa-solid fa-lock"></i></button>
							</td>`
			}
			else {
				tableHtml += `<td>
								<button class="btn btn-success update-account"><i class="fa-solid fa-pen-to-square"></i></button>
								<button class="btn btn-warning unlock-account"><i class="fa-solid fa-unlock"></i></button>
							</td>`
			}

			tableHtml += ` </tr>`
		});
		$("#bodyTable").html(tableHtml);
	}
	
	//Phan quyen tai khoan
	$(document).on('click', '.update-account', function() {
		$("#phanquyenModal").modal('show');
	});
	
	//Khoa tai khoan
	$(document).on('click', '.lock-account', function() {
		$("#lockModal").modal('show');
	});
	
	//Mo khoa tai khoan
	$(document).on('click', '.unlock-account', function() {
		$("#unlockModal").modal('show');
	});
});