//Token
var vnMobileToken = null;
if (localStorage.getItem('VnMobileToken') !== null) {
	var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
	if (vnMobileToken.role === "KHACHHANG") {
		console.log('ok');
	}
	else {
		window.location.href = '/401';
	}
}
else {
	window.location.href = '/401';
}
$(document).ready(function() {
	var statusCurrent = "Chờ xác nhận"
	baseTable(statusCurrent, 1);

	//Table mo dau trang
	function baseTable(status, pageNumber) {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/customer/order/getorderuser",
			data: {
				email: vnMobileToken.email,
				status: status,
				pageNumber: pageNumber
			},
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					showTable(response.data);
					console.log(response.pageData);
					$("#pageCount").html(`${response.pageData}`);
					$("#pageNumberCurrent").html(pageNumber);
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

	function getDateByTimeStamp(inputTime) {
		const dateObj = new Date(inputTime);
		const day = dateObj.getDate().toString().padStart(2, "0");
		const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần cộng thêm 1
		const year = dateObj.getFullYear();
		const hours = dateObj.getHours().toString().padStart(2, "0");
		const minutes = dateObj.getMinutes().toString().padStart(2, "0");
		const seconds = dateObj.getSeconds().toString().padStart(2, "0");
		const formattedTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
		return formattedTime;
	}

	//Hien table
	function showTable(listOrder) {
		var tableHtml = ``;
		if (listOrder.length === 0) {
			tableHtml += `Không có đơn hàng nào!`;
		}
		else {
			$.each(listOrder, function(index, value) {
				tableHtml += `<tr class="table-bordered">
											<td>
												<div class="avatar-container" style="width: 70px; overflow: hidden;">
													<img id="userAvatar" class="avatar"
														style="width: 100%; height: auto; object-fit: cover;"
														src="/img/order.jpg" alt="Avatar">
												</div>
											</td>
											<td>
												<p class="mb-0"><strong>#DH000${value.orderId}</strong></p>
												<p class="mb-0">Ngày đặt: ${getDateByTimeStamp(value.createdAt)}</p>
												<p class="mb-0">${value.createdBy}</p>
												<p class="mb-0">
													Thành tiền: <strong><span
															style="color: red;">${value.totalPrice.toLocaleString('vi-VN')}đ</span></strong>
												</p>
											</td>
											<td>
												<p class="mb-0">${value.orderTracking.customerName}</p>
												<p class="mb-0">${value.orderTracking.customerTelephone}</p>
												<p class="mb-0">
													${value.orderTracking.customerAdress + ', ' + value.orderTracking.customerWard + ', '
													+ value.orderTracking.customerDistrict + ', ' + value.orderTracking.customerProvince}
												</p>
											</td>
											<td style="min-width: 120px;">
												<p class="mb-0">${value.status}</p>
											</td>
						</tr>`
			});
		}
		$("#bodyTable").html(tableHtml);
	}

	$(document).on('change', '#option1', function() {
		var btnHtml = `						<label class="btn btn-danger btn-sm active col-4">
												<input type="radio" name="options" id="option1" autocomplete="off"
													checked> Chờ xác nhận
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option2" autocomplete="off">
												Đang lấy hàng
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option3" autocomplete="off">
												Đang giao hàng
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option4" autocomplete="off">
												GH thành công
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option5" autocomplete="off">
												Đã hủy
											</label>`
		$("#statusBtn").html(btnHtml);
		statusCurrent = "Chờ xác nhận";
		baseTable(statusCurrent, 1);
	});

	$(document).on('change', '#option2', function() {
		var btnHtml = `						
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option1" autocomplete="off">
												Chờ xác nhận
											</label>
											<label class="btn btn-danger btn-sm active col-4">
												<input type="radio" name="options" id="option2" autocomplete="off"
													checked> Đang lấy hàng
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option3" autocomplete="off">
												Đang giao hàng
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option4" autocomplete="off">
												GH thành công
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option5" autocomplete="off">
												Đã hủy
											</label>`
		$("#statusBtn").html(btnHtml);
		statusCurrent = "Đang lấy hàng";
		baseTable(statusCurrent, 1);
	});

	$(document).on('change', '#option3', function() {
		var btnHtml = `						
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option1" autocomplete="off">
												Chờ xác nhận
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option2" autocomplete="off">
												Đang lấy hàng
											</label>
											<label class="btn btn-danger btn-sm active col-4">
												<input type="radio" name="options" id="option3" autocomplete="off"
													checked> Đang giao hàng
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option4" autocomplete="off">
												GH thành công
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option5" autocomplete="off">
												Đã hủy
											</label>`
		$("#statusBtn").html(btnHtml);
		statusCurrent = "Đang giao hàng";
		baseTable(statusCurrent, 1);
	});

	$(document).on('change', '#option4', function() {
		var btnHtml = `						
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option1" autocomplete="off">
												Chờ xác nhận
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option2" autocomplete="off">
												Đang lấy hàng
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option3" autocomplete="off">
												Đang giao hàng
											</label>
											<label class="btn btn-danger btn-sm active col-4">
												<input type="radio" name="options" id="option4" autocomplete="off"
													checked> GH thành công
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option5" autocomplete="off">
												Đã hủy
											</label>`
		$("#statusBtn").html(btnHtml);
		statusCurrent = "GH thành công";
		baseTable(statusCurrent, 1);
	});
	$(document).on('change', '#option5', function() {
		var btnHtml = `						
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option1" autocomplete="off">
												Chờ xác nhận
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option2" autocomplete="off">
												Đang lấy hàng
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option3" autocomplete="off">
												Đang giao hàng
											</label>
											<label class="btn btn-outline-secondary btn-sm col-4">
												<input type="radio" name="options" id="option4" autocomplete="off">
												GH thành công
											</label>
											<label class="btn btn-danger btn-sm active col-4">
												<input type="radio" name="options" id="option5" autocomplete="off"
													checked> Đã hủy
											</label>`
		$("#statusBtn").html(btnHtml);
		statusCurrent = "Đã hủy";
		baseTable(statusCurrent, 1);
	});

	$("#pageNumberPrevious").click(function() {
		var pageCount = $("#pageCount").text();
		var currentPage = $("#pageNumberCurrent").text();
		if (parseInt(currentPage) > 1) {
			$("#pageNumberCurrent").text(parseInt(currentPage) - 1);
			baseTable(statusCurrent, parseInt(currentPage) - 1);
		}
	});
	$("#pageNumberNext").click(function() {
		var pageCount = $("#pageCount").text();
		var currentPage = $("#pageNumberCurrent").text();
		if (parseInt(currentPage) < parseInt(pageCount)) {
			$("#pageNumberCurrent").text(parseInt(currentPage) + 1);
			baseTable(statusCurrent, parseInt(currentPage) + 1);
		}
	});
});