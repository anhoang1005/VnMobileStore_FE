//Token
var vnMobileToken = null;
if (localStorage.getItem('VnMobileToken') !== null) {
	var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
	if (vnMobileToken.role === "QUANLI") {
		//baseTable();
	}
	else {
		window.location.href = '/401';
	}
}
else {
	window.location.href = '/401';
}

$(document).ready(function() {

	baseTable(1)
	//Table mo dau trang
	function baseTable(pageNumber) {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/order/getall/" + pageNumber,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					showTable(response.data);
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
		$.each(listOrder, function(index, value) {
			tableHtml += `<tr>
											<td><strong>#DH000${value.orderId}</strong></td>
											<td>
												<p>Người tạo: ${value.createdBy}</p>
												<p>Ngày tạo: ${getDateByTimeStamp(value.createdAt)}</p>
												<p><strong>Thành tiền: ${value.totalPrice.toLocaleString('vi-VN')}đ</strong></p>
											</td>
											<td>
												<p>Họ tên: ${value.orderTracking.customerName}</p>
												<p>Email: ${value.orderTracking.customerEmail}</p>
												<p>Sđt: ${value.orderTracking.customerTelephone}</p>
											</td>
											<td>
												<p>${value.orderTracking.customerAdress}</p>
												<p>${value.orderTracking.customerWard}</p>
												<p>${value.orderTracking.customerDistrict}</p>
												<p>${value.orderTracking.customerProvince}</p>
											</td>
											<td>${value.orderPayment.gateway}</td>
											<td>
												<p>${value.orderTracking.carrier}</p>
												<p>Phí ship: ${value.orderTracking.fee.toLocaleString('vi-VN')}đ</p>
											</td>`
			if (value.status === "Chờ xác nhận") {
				tableHtml += `<td>
								<button supplier-id="1" class="btn btn-secondary col-12">
									Chờ xác nhận
								</button>
							</td>`
			}
			else if (value.status === "Đang lấy hàng") {
				tableHtml += `<td>
								<button supplier-id="1" class="btn btn-warning col-12">
									Đang lấy hàng
								</button>
							</td>`
			}
			else if (value.status === "Đang giao hàng") {
				tableHtml += `<td>
								<button supplier-id="1" class="btn btn-primary col-12">
									Đang giao hàng
								</button>
							</td>`
			}
			else if (value.status === "GH thành công") {
				tableHtml += `<td>
								<button supplier-id="1" class="btn btn-success col-12">
									GH thành công
								</button>
							</td>`
			}
			else if (value.status === "Đã hủy") {
				tableHtml += `<td>
								<button supplier-id="1" class="btn btn-danger col-12">
									Đã hủy
								</button>
							</td>`
			}
			tableHtml += `<td>
												<button order-id="${value.orderId}" class="btn btn-success view-order">
													<i class="fa-solid fa-list"></i>
												</button>
												<button order-id="${value.orderId}" supplier-id="1" id="updateSupplierBtn" class="btn btn-warning update-status">
													<i class="fa-solid fa-pen-to-square"></i>
												</button>
											</td>
										</tr>`

		});
		$("#bodyTable").html(tableHtml);
	}

	$("#pageNumberPrevious").click(function() {
		var pageCount = $("#pageCount").text();
		var currentPage = $("#pageNumberCurrent").text();
		if (parseInt(currentPage) > 1) {
			$("#pageNumberCurrent").text(parseInt(currentPage) - 1);
			baseTable(parseInt(currentPage) - 1);
		}
	});

	$("#pageNumberNext").click(function() {
		var pageCount = $("#pageCount").text();
		var currentPage = $("#pageNumberCurrent").text();
		if (parseInt(currentPage) < parseInt(pageCount)) {
			$("#pageNumberCurrent").text(parseInt(currentPage) + 1);
			baseTable(parseInt(currentPage) + 1);
		}
	});

	$(document).on('click', '.update-status', function() {
		var orderId = $(this).attr('order-id');
		$('#changeStatusModal').modal('show');
		$("#submitChangeStatusBtn").click(function() {
			var statusUpdate = $("#statusUpdate").val();
			var statusChange = '';
			if (statusUpdate === '1') {
				statusChange = "Chờ xác nhận";
			}
			else if (statusUpdate === '2') {
				statusChange = "Đang lấy hàng";
			}
			else if (statusUpdate === '3') {
				statusChange = "Đang giao hàng";
			}
			else if (statusUpdate === '4') {
				statusChange = "GH thành công";
			}
			else if (statusUpdate === '5') {
				statusChange = "Đã hủy";
			}
			console.log(statusChange + " " + orderId);
			$.ajax({
				method: "POST",
				url: "http://localhost:8888/api/admin/order/update",
				data: {
					orderId: orderId,
					status: statusChange
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
				success: function(response) {
					$('#changeStatusModal').modal('hide');
					if (response.success) {
						$("#confirmIcon").html(`<i style="color: green; font-size: 2em" class="fa-regular fa-circle-check"></i>`);
						$("#subMess").html(`Thành công!`);
						$("#confirmMess").html(`Cập nhật trạng thái dơn hàng thành công!`);
						$("#confirmModal").modal('show');
						baseTable(1);
					} else {
						window.location.href = "/404";
					}
				},
				error: function(xhr, status, error) {
					$("#overlay").hide();
					window.location.href = "/403";
				}
			});
		});
	});

	function showDetailOrder(orderId) {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/order/getbyid/" + orderId,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					var detailHtml = `<p>Mã đơn hàng: #DH00${response.data.orderId}</p>
							<p>Ngày đặt: ${getDateByTimeStamp(response.data.createdAt)}</p>
							<p>Người đặt: ${response.data.createdBy}</p>
							<p>Thông tin người nhận: ${response.data.orderTracking.customerName}, ${response.data.orderTracking.customerTelephone}</p>
							<p>Địa chỉ giao hàng: ${response.data.orderTracking.customerAdress}, ${response.data.orderTracking.customerWard}
												, ${response.data.orderTracking.customerDistrict}, ${response.data.orderTracking.customerProvince}
							</p>
							<p>Cổng giao hàng: ${response.data.orderTracking.carrier}</p>
							<p>Cổng thanh toán: ${response.data.orderPayment.gateway}</p>
							<p>Tình trạng thanh toán: ${response.data.orderPayment.status}</p>`;
					detailHtml += `<div class="table-responsive" style="max-height: 300px; min-height: 300px;">
								<table class="table table-bordered table-striped table-hover">
									<thead>
										<tr>
											<th scope="col">Ảnh</th>
											<th scope="col">Tên sản phẩm</th>
											<th scope="col">Số lượng</th>
											<th scope="col">Thành tiền</th>
										</tr>
									</thead>
									<tbody id="detailOrderTable">`

					$.each(response.data.orderItems, function(index, value) {
						detailHtml += `<tr>
											<td>
												<div class="avatar-container" style="width: 80px; overflow: hidden;">
													<img id="userAvatar" class="avatar" style="width: 100%; height: auto; object-fit: cover;"
													src="${value.thumbnail}" alt="san-pham">
												</div>
											</td>
											<td>
												<p>${value.title}</p>
												<p>${value.version} ${value.color}</p>
												<p><strong>Đơn giá: ${value.price.toLocaleString('vi-VN')}đ</strong></p>
											</td>
											<td>
												<p>Số lượng: ${value.quantity}</p>
											</td>
											<td>
												<p><strong>Thành tiền: ${value.totalPrice.toLocaleString('vi-VN')}đ</strong></p>
											</td>
										</tr>`
					});
					detailHtml += `</tbody>
								</table>
							</div>`
					$("#detailModalBody").html(detailHtml);
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

	$(document).on('click', '.view-order', function() {
		var orderId = $(this).attr('order-id');
		showDetailOrder(orderId);
		$("#viewOrderModal").modal('show');
	});

});