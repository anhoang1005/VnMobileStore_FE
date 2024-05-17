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
	baseTable(0, 0, "EMPTY", 'EMPTY', 'EMPTY', 1);
	//Table mo dau trang
	function baseTable(status, gateway, keyword, startDate, endDate, pageNumber) {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/order/admin-search2",
			data: {
				status: status,
				gateway: gateway,
				keyword: keyword,
				startDate: startDate,
				endDate: endDate,
				pageNumber: pageNumber
			},
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					showTable(response.data);
					$("#pageCount").html(`${response.pageData}`);
					$("#pageNumberCurrent").html(pageNumber);
				} else {
					//window.location.href = "/404";
				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				//window.location.href = "/403";
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
			tableHtml = `<h4 class="mt-3">Không có đơn hàng nào!</h4>`
		}
		else {
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
												<p>${value.orderTracking.customerAdress}, ${value.orderTracking.customerWard}
												, ${value.orderTracking.customerDistrict}, ${value.orderTracking.customerProvince}</p>
											</td>`
				if (value.orderPayment === "0") {
					tableHtml += `<td>
										<p>${value.orderPayment.gateway}</p>
										<p class="text-danger">${value.orderPayment.status}</p>
									</td>`
				}
				else {
					tableHtml += `<td>
										<p>${value.orderPayment.gateway}</p>
										<p class="text-success">${value.orderPayment.status}</p>
									</td>`
				}

				tableHtml += `<td>
												<p>${value.orderTracking.carrier}</p>
												<p>Phí ship: ${value.orderTracking.fee.toLocaleString('vi-VN')}đ</p>
											</td>`
				if (value.status === "Chờ xác nhận") {
					tableHtml += `<td style="min-width: 160px">
								<button supplier-id="1" class="btn btn-secondary col-12">
									Chờ xác nhận
								</button>
							</td>`
				}
				else if (value.status === "Đang lấy hàng") {
					tableHtml += `<td style="min-width: 160px">
								<button supplier-id="1" class="btn btn-warning col-12">
									Đang lấy hàng
								</button>
							</td>`
				}
				else if (value.status === "Đang giao hàng") {
					tableHtml += `<td style="min-width: 160px">
								<button supplier-id="1" class="btn btn-primary col-12">
									Đang giao hàng
								</button>
							</td>`
				}
				else if (value.status === "GH thành công") {
					tableHtml += `<td style="min-width: 160px">
								<button supplier-id="1" class="btn btn-success col-12">
									GH thành công
								</button>
							</td>`
				}
				else if (value.status === "Đã hủy") {
					tableHtml += `<td style="min-width: 150px">
								<button supplier-id="1" class="btn btn-danger col-12">
									Đã hủy
								</button>
							</td>`
				}
				if (value.status === "GH thành công") {
					tableHtml += `<td style="min-width: 180px">
												<button order-id="${value.orderId}" class="btn btn-success view-order">
													<i class="fa-solid fa-list"></i>
												</button>
												<button order-id="${value.orderId}" id="updateSupplierBtn" class="btn btn-primary history-order">
													<i class="fa-solid fa-clock-rotate-left"></i>
												</button>
											</td>
										</tr>`
				}
				else {
					tableHtml += `<td style="min-width: 180px">
												<button order-id="${value.orderId}" class="btn btn-success view-order">
													<i class="fa-solid fa-list"></i>
												</button>
												<button order-id="${value.orderId}" id="updateSupplierBtn" class="btn btn-warning update-status">
													<i class="fa-solid fa-pen-to-square"></i>
												</button>
												<button order-id="${value.orderId}" id="updateSupplierBtn" class="btn btn-primary history-order">
													<i class="fa-solid fa-clock-rotate-left"></i>
												</button>
											</td>
										</tr>`
				}

			});
		}
		$("#bodyTable").html(tableHtml);
	}

	$("#pageNumberPrevious").click(function() {
		var currentPage = $("#pageNumberCurrent").text();
		if (parseInt(currentPage) > 1) {
			$("#pageNumberCurrent").text(parseInt(currentPage) - 1);
			var statusChange = $("#statusChange").val();
			var gatewayChange = $("#gatewayChange").val();
			var keywordChange = $("#searchOrder").val();
			if (keywordChange === "") {
				keywordChange = "EMPTY";
			}
			var startDate = $("#startDate").val();
			var endDate = $("#endDate").val();
			if (startDate === "" || endDate === "") {
				startDate = 'EMPTY';
				endDate = 'EMPTY'
			}
			baseTable(statusChange, gatewayChange, keywordChange, startDate, endDate, parseInt(currentPage) - 1);
		}
	});

	$("#pageNumberNext").click(function() {
		var pageCount = $("#pageCount").text();
		var currentPage = $("#pageNumberCurrent").text();
		if (parseInt(currentPage) < parseInt(pageCount)) {
			$("#pageNumberCurrent").text(parseInt(currentPage) + 1);
			var statusChange = $("#statusChange").val();
			var gatewayChange = $("#gatewayChange").val();
			var keywordChange = $("#searchOrder").val();
			if (keywordChange === "") {
				keywordChange = "EMPTY";
			}
			var startDate = $("#startDate").val();
			var endDate = $("#endDate").val();
			if (startDate === "" || endDate === "") {
				startDate = 'EMPTY';
				endDate = 'EMPTY'
			}
			baseTable(statusChange, gatewayChange, keywordChange, startDate, endDate, parseInt(currentPage) + 1);
		}
	});

	$(document).on('click', '.update-status', function() {
		var orderId = $(this).attr('order-id');
		$('#changeStatusModal').modal('show');
		$("#submitChangeStatusBtn").click(function() {
			var statusUpdate = $('input[name="options-outlined"]:checked').val();
			$.ajax({
				method: "POST",
				url: "http://localhost:8888/api/admin/order/update",
				data: {
					orderId: orderId,
					status: statusUpdate
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
						var statusChange = $("#statusChange").val();
						var gatewayChange = $("#gatewayChange").val();
						var currentPage = $("#pageNumberCurrent").text();
						var keywordChange = $("#searchOrder").val();
						if (keywordChange === "") {
							keywordChange = "EMPTY";
						}
						var startDate = $("#startDate").val();
						var endDate = $("#endDate").val();
						baseTable(statusChange, gatewayChange, keywordChange, startDate, endDate, currentPage);
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

	$("#statusChange").change(function() {
		var statusChange = $("#statusChange").val();
		var gatewayChange = $("#gatewayChange").val();
		var keywordChange = $("#searchOrder").val();
		if (keywordChange === "") {
			keywordChange = "EMPTY";
		}
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		if (startDate === "" || endDate === "") {
			startDate = 'EMPTY';
			endDate = 'EMPTY'
		}
		baseTable(statusChange, gatewayChange, keywordChange, startDate, endDate, 1);
	});

	$("#gatewayChange").change(function() {
		var statusChange = $("#statusChange").val();
		var gatewayChange = $("#gatewayChange").val();
		var keywordChange = $("#searchOrder").val();
		if (keywordChange === "") {
			keywordChange = "EMPTY";
		}
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		if (startDate === "" || endDate === "") {
			startDate = 'EMPTY';
			endDate = 'EMPTY'
		}
		baseTable(statusChange, gatewayChange, keywordChange, startDate, endDate, 1);
	});
	$('#searchOrder').on('input', function() {
		var statusChange = $("#statusChange").val();
		var gatewayChange = $("#gatewayChange").val();
		var keywordChange = $("#searchOrder").val();
		if (keywordChange === "") {
			keywordChange = "EMPTY";
		}
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		if (startDate === "" || endDate === "") {
			startDate = 'EMPTY';
			endDate = 'EMPTY'
		}
		baseTable(statusChange, gatewayChange, keywordChange, startDate, endDate, 1);
	});
	$("#startDate").change(function() {
		var statusChange = $("#statusChange").val();
		var gatewayChange = $("#gatewayChange").val();
		var keywordChange = $("#searchOrder").val();
		if (keywordChange === "") {
			keywordChange = "EMPTY";
		}
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		if (startDate === "" || endDate === "") {
			startDate = 'EMPTY';
			endDate = 'EMPTY'
		}
		baseTable(statusChange, gatewayChange, keywordChange, startDate, endDate, 1);
	});

	$("#endDate").change(function() {
		var statusChange = $("#statusChange").val();
		var gatewayChange = $("#gatewayChange").val();
		var keywordChange = $("#searchOrder").val();
		if (keywordChange === "") {
			keywordChange = "EMPTY";
		}
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		if (startDate === "" || endDate === "") {
			startDate = 'EMPTY';
			endDate = 'EMPTY'
		}
		baseTable(statusChange, gatewayChange, keywordChange, startDate, endDate, 1);
	});

	$("#searchOrderId").on('input', function() {
		if ($("#searchOrderId").val() === "") {
			var statusChange = $("#statusChange").val();
			var gatewayChange = $("#gatewayChange").val();
			var keywordChange = $("#searchOrder").val();
			if (keywordChange === "") {
				keywordChange = "EMPTY";
			}
			var startDate = $("#startDate").val();
			var endDate = $("#endDate").val();
			if (startDate === "" || endDate === "") {
				startDate = 'EMPTY';
				endDate = 'EMPTY'
			}
			baseTable(statusChange, gatewayChange, keywordChange, startDate, endDate, 1);
		}
		else {
			var searchChange = $("#searchOrderId").val();
			var searchId = searchChange.replace(/^#DH000/, '');
			console.log('id: ' + searchId);
			$.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/order/getorderbyid",
				data: {
					id: searchId
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
				success: function(response) {
					if (response.success) {
						var listOrderSearch = [];
						listOrderSearch.push(response.data);
						showTable(listOrderSearch);
					} else {
						var listOrderSearch = [];
						showTable(listOrderSearch);
					}
				},
				error: function(xhr, status, error) {
					var listOrderSearch = [];
					showTable(listOrderSearch);
				}
			});
		}
	});
});