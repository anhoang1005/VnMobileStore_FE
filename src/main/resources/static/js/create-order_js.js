$(document).ready(function() {

	//Token
	var vnMobileToken = null;
	if (localStorage.getItem('VnMobileToken') !== null) {
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
		$("#nameCheckOut").val(`${vnMobileToken.fullName}`);
		$("#emailUser").val(`${vnMobileToken.email}`);
		var cartOrderStoraged = "VNMobileOrderCart_" + vnMobileToken.email;
		showTrackingInfo(cartOrderStoraged)
	}
	else {
		window.location.href = '/401';
	}

	getUrlParam();

	function changeURL() {
		var newURL = '/create-order'; // URL mới bạn muốn đổi
		var newTitle = 'Tạo đơn hàng'; // Tiêu đề mới của trang

		history.pushState(null, newTitle, newURL);

		// Cập nhật tiêu đề của trang
		document.title = newTitle;
	}

	function getUrlParam() {
		var currentUrl = window.location.href;
		var searchParams = new URLSearchParams(new URL(currentUrl).search);
		var pageValue = searchParams.get('vnp_TransactionStatus');
		changeURL();
		if (pageValue !== null && pageValue === "00") {
			var vnpay_order = JSON.parse(sessionStorage.getItem('VNPAY_Order_Create'));
			vnpay_order.orderPayment.status = "Đã thanh toán";
			$.ajax({
				method: "POST",
				url: "http://localhost:8888/api/customer/order/inserttest",
				data: JSON.stringify(vnpay_order),
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
				contentType: 'application/json',
				success: function(response) {
					if (response.success) {
						$("#vnPaySuccessModal").modal('show');
						changeURL();
					} else {
						$("subError").html(`Đặt hàng thất bại!`);
						$("#errorMess").html(`Đặt hàng lỗi, chúg tôi sẽ khắc phục lỗi này sớm nhất có thể!`);
						changeURL();
						$("#errorModal").modal('show');
					}
				},
				error: function(xhr, status, error) {
					$("#overlay").hide();
					window.location.href = "/403";
				}
			});
			console.log(vnpay_order);
		}
		else if (pageValue !== null && pageValue === "02") {
			changeURL();
			$("subError").html(`Thanh toán thất bại!`);
			$("#errorMess").html(`Bạn chưa thanh toán thành công nên đơn hàng sẽ bị hủy, vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
		}
	}

	function showTrackingInfo(cartOrderStoraged) {
		var orderCart = [];
		if (localStorage.getItem(cartOrderStoraged) !== null) {
			console.log('in thanh cong');
			orderCart = JSON.parse(localStorage.getItem(cartOrderStoraged));
			if (orderCart.length > 0) {
				var cartOrderHtml = ``;
				var totalOrderPrice = 0;
				$.each(orderCart, function(index, value) {
					cartOrderHtml += `<li class="list-group-item d-flex justify-content-between lh-condensed">
						<div>
							<img src="${value.thumbnail}" style="height: 50px; width: auto" />
							<h6 class="my-0">${value.title}</h6>
							<small class="text-muted">${value.typeName}GB | ${value.color} | Số lượng: ${value.quantity}</small>
							<br>
							<small class="text-muted">Đơn giá: ${value.price.toLocaleString('vi-VN')}đ</small>
						</div>
						<span class="text-muted">${(value.quantity * value.price).toLocaleString('vi-VN')}đ</span>
						</li>`;
					totalOrderPrice = BigInt(totalOrderPrice) + BigInt(value.quantity * value.price);
				});
				cartOrderHtml += `<li class="list-group-item d-flex justify-content-between">
									<div class="card p-2 my-border">
										<div class="input-group">
											<input type="text" class="form-control" placeholder="Mã giảm giá">
											<div class="input-group-append">
												<button type="submit" class="btn btn-danger">Xác nhận</button>
											</div>
										</div>
									</div>
								</li>`;
				cartOrderHtml += `<li class="list-group-item d-flex justify-content-between">
									<span>Phí giao hàng:</span>
									<span id="totalOrderFee" totalFee-order=""></span>
								</li>
								<li class="list-group-item d-flex justify-content-between">
									<span>Thành tiền:</span>
									<input id="baseTotalPrice" type="hidden" value="${totalOrderPrice}">
									<strong id="totalOrderPrice" totalprice-order="${totalOrderPrice}">${totalOrderPrice.toLocaleString('vi-VN')}đ</strong>
								</li>`;
				$("#listOrderItem").html(cartOrderHtml);
				$("#orderCartQuantity").html(`(${orderCart.length})`);

				getApiProviceGHN(function(listProvince) {
					var provinceHtml = `<option value="INVALID" selected>--Tỉnh, Thành phố--</option>`;
					$.each(listProvince, function(index, provinceCode) {
						provinceHtml += `<option value="${provinceCode.ProvinceID}" province-name="${provinceCode.ProvinceName}">${provinceCode.ProvinceName}</option>`;
					});
					$("#provinceName").html(provinceHtml);
					$("#districtName").prop("disabled", true);
					$("#xaphuongName").prop("disabled", true);
					$("#houseName").prop("disabled", true);
				});
			}
			else {
				window.location.href = '/403';
			}
		}
		else {
			window.location.href = '/403';
		}
	}

	//Ham cap nhat gia tong

	//Lay api Tinh, thanh pho
	function getApiProviceGHN(callback) {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/ghn/getprovince",
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.message === "Success") {
					response.data.sort(function(a, b) {
						var nameA = a.ProvinceName.toUpperCase(); // Chuyển đổi tên thành chữ hoa để sắp xếp
						var nameB = b.ProvinceName.toUpperCase(); // Chuyển đổi tên thành chữ hoa để sắp xếp
						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						return 0; // Nếu hai tên bằng nhau
					});

					callback(response.data);
				} else {
					console.log('get thanh pho that bai!');
					callback(null);
				}
			},
			error: function(xhr, status, error) {
				console.log('Loi server!');
				callback(null);
				window.location.href = "/403";
			}
		});
	}

	//Lay api Quận, huyện
	function getApiDistrictGHN(provinceId, callback) {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/ghn/getdistrict/" + provinceId,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.message === "Success") {
					response.data.sort(function(a, b) {
						var nameA = a.DistrictName.toUpperCase(); // Chuyển đổi tên thành chữ hoa để sắp xếp
						var nameB = b.DistrictName.toUpperCase(); // Chuyển đổi tên thành chữ hoa để sắp xếp
						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						return 0; // Nếu hai tên bằng nhau
					});

					callback(response.data);
				} else {
					console.log('get thanh pho that bai!');
					callback(null);
				}
			},
			error: function(xhr, status, error) {
				console.log('Loi server!');
				callback(null);
				window.location.href = "/403";

			}
		});
	}

	//Lay api Xã, Phường
	function getApiXaPhuongGHN(districtId, callback) {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/ghn/getward/" + districtId,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.message === "Success") {
					response.data.sort(function(a, b) {
						var nameA = a.WardName.toUpperCase(); // Chuyển đổi tên thành chữ hoa để sắp xếp
						var nameB = b.WardName.toUpperCase(); // Chuyển đổi tên thành chữ hoa để sắp xếp
						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						return 0; // Nếu hai tên bằng nhau
					});

					callback(response.data);
				} else {
					console.log('get thanh pho that bai!');
					callback(null);
				}
			},
			error: function(xhr, status, error) {
				console.log('Loi server!');
				callback(null);
				window.location.href = "/403";
			}
		});
	}

	//Api lấy thông tin gói dịch vụ
	function getApiLayDichVuGHN(from_districtId, to_districtId, callback) {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/ghn/getservice/" + to_districtId,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.message === "Success") {
					callback(response.data);
				} else {
					console.log('get thanh pho that bai!');
					callback(null);
				}
			},
			error: function(xhr, status, error) {
				console.log('Loi server!');
				callback(null);
				window.location.href = "/403";
			}
		});
	}


	//Api tinh phi ship
	function getApiTinhPhiShipGHN(serviceId, to_districtId, orderPrice, to_wardCode, weight, callback) {
		$.ajax({
			method: "POST",
			url: "http://localhost:8888/api/ghn/getFee",
			data: JSON.stringify({
				service_id: serviceId,
				insurance_value: orderPrice.toString(),
				//coupon: null,
				//from_district_id: 1542,
				to_district_id: to_districtId,
				to_ward_code: to_wardCode,
				height: 20,
				length: 20,
				weight: weight,
				width: 20
			}),
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			contentType: 'application/json',
			success: function(response) {
				if (response.message === "Success") {
					callback(response.data);
				} else {
					console.log('get thanh pho that bai!');
					callback(null);
				}
			},
			error: function(xhr, status, error) {
				console.log('Loi server!');
				callback(null);
				window.location.href = "/403";
			}
		});
	}

	//Api du kien thoi gian giao hang
	function getApiThoiGianDuKienGHN(serviceId, to_districtId, to_wardCode, callback) {
		$.ajax({
			method: "POST",
			url: "http://localhost:8888/api/ghn/getTime",
			data: JSON.stringify({
				//from_district_id: 1542,
				//from_ward_code: "1B1507",
				to_district_id: to_districtId,
				to_ward_code: to_wardCode,
				service_id: serviceId
			}),
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			contentType: 'application/json',
			success: function(response) {
				if (response.message === "Success") {
					callback(response.data);
				} else {
					console.log('get thanh pho that bai!');
					callback(null);
				}
			},
			error: function(xhr, status, error) {
				console.log('Loi server!');
				callback(null);
				window.location.href = "/403";
			}
		});
	}


	//Ham lay gia tri co ban cua don hang
	function getBaseTotalPrice() {
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
		var cartOrderStoraged = "VNMobileOrderCart_" + vnMobileToken.email;
		var orderCart = [];
		var baseTotalPrice = 0;
		if (localStorage.getItem(cartOrderStoraged) !== null) {
			orderCart = JSON.parse(localStorage.getItem(cartOrderStoraged));
			$.each(orderCart, function(index, value) {
				baseTotalPrice = BigInt(baseTotalPrice) + BigInt(value.quantity * value.price);
			});
		}
		else {
			window.location.href = '/403';
		}
		return baseTotalPrice;
	}


	//Xu li su kiện chọn TỈnh thành phố
	$("#provinceName").change(function() {
		var selectedValue = $(this).val();
		if (selectedValue !== "INVALID") {
			//console.log("Đã chọn giá trị khác --Tinh, Thanh pho--: " + selectedValue);
			//console.log("Tinh duoc chon: " + $('#provinceName option:selected').attr('province-name') + " : " + selectedValue);
			$("#districtName").prop("disabled", false);
			getApiDistrictGHN(selectedValue, function(listDistrict) {
				var districtHtml = `<option value="INVALID" selected>--Quận,Huyện--</option>`;
				$.each(listDistrict, function(index, districtCode) {
					districtHtml += `<option value="${districtCode.DistrictID}" district-name="${districtCode.DistrictName}">${districtCode.DistrictName}</option>`;
				});
				$("#districtName").html(districtHtml);
				$("#xaphuongName").prop("disabled", true);
				$("#houseName").prop("disabled", true);
			});
		}
		else {
			$("#districtName").prop("disabled", true);
			$("#xaphuongName").prop("disabled", true);
			$("#houseName").prop("disabled", true);
		}
	});

	//Xu li su kiện chọn Quận, Huyện
	$("#districtName").change(function() {
		var selectedValue = $(this).val();
		if (selectedValue !== "INVALID") {
			//console.log("Đã chọn giá trị khác --Quận, Huyện--: " + selectedValue);
			//console.log("Quan, Huyen duoc chon: " + $('#districtName option:selected').attr('district-name') + " : " + selectedValue);

			getApiXaPhuongGHN(selectedValue, function(listWard) {
				var wardHtml = `<option value="INVALID" selected>--Xã, Phường--</option>`;
				$.each(listWard, function(index, wardCode) {
					wardHtml += `<option value="${wardCode.WardCode}" ward-name="${wardCode.WardName}" >${wardCode.WardName}</option>`;
				});
				$("#xaphuongName").html(wardHtml);
			});

			//			getApiLayDichVuGHN(1542, selectedValue, function(listSerVice) {
			//			console.log("Dich vu duoc chon: " + listSerVice[0].short_name + " : " + listSerVice[0].service_id);
			//			});
			$("#xaphuongName").prop("disabled", false);

		}
		else {
			$("#xaphuongName").prop("disabled", true);
			$("#houseName").prop("disabled", true);
		}
	});

	//Xu li su kiện chọn Xã, phường
	$("#xaphuongName").change(function() {
		var selectedValue = $(this).val();
		if (selectedValue !== "INVALID") {
			//console.log("Đã chọn giá trị khác --Xã, Phường--: " + selectedValue);
			//console.log("Xa, Phuong duoc chon: " + $('#xaphuongName option:selected').attr('ward-name') + " : " + selectedValue);
			$("#houseName").prop("disabled", false);
			var to_district = $('#districtName option:selected').val();
			var to_province = $('#provinceName option:selected').val();
			var to_wardCode = selectedValue;
			var orderCart = [];
			orderCart = JSON.parse(localStorage.getItem(cartOrderStoraged));
			var totalWeight = 0;
			var totalPrice = 0;
			$.each(orderCart, function(index, value) {
				totalPrice = BigInt(totalPrice) + BigInt(value.quantity * value.price);
				totalWeight = totalWeight + value.weight;
			});
			console.log("Tong gia: " + totalPrice);
			console.log("Tong can nang: " + totalWeight);
			getApiLayDichVuGHN(1542, to_district, function(listSerVice) {
				console.log("Dich vu duoc chon: " + listSerVice[0].short_name + " : " + listSerVice[0].service_id);
				var serviceId = listSerVice[0].service_id;
				console.log(to_wardCode + ", " + to_district + ", " + to_province + "/ Service: " + serviceId)
				getApiTinhPhiShipGHN(serviceId, to_district, totalPrice, to_wardCode, totalWeight, function(feeData) {
					console.log("Tien ship tam tinh la: " + feeData.service_fee);
					$("#feePrice").html(`${feeData.service_fee.toLocaleString('vi-VN')}đ`);
					$("#totalOrderFee").html(`${feeData.service_fee.toLocaleString('vi-VN')}đ`);
					$("#totalOrderFee").html(`${feeData.service_fee.toLocaleString('vi-VN')}đ`);
					$('#totalOrderFee').attr('totalFee-order', feeData.service_fee);
					var finalTotalPrice = BigInt($("#baseTotalPrice").val()) + BigInt(feeData.service_fee);
					console.log("finalPrice: " + finalTotalPrice);
					//var finalTotalPrice = BigInt(getBaseTotalPrice) + BigInt(feeData.service_fee);
					$('#totalOrderPrice').html(`${finalTotalPrice.toLocaleString('vi-VN')}đ`);
					$('#totalOrderPrice').attr('final-price', finalTotalPrice);
				});
				getApiThoiGianDuKienGHN(serviceId, to_district, to_wardCode, function(timeOrderData) {
					console.log("Thoi gian timestamp: " + timeOrderData.leadtime);
					const leadtimeDate = new Date(timeOrderData.leadtime * 1000);

					const leadtimeDay = leadtimeDate.getDate();
					const leadtimeMonth = leadtimeDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
					const leadtimeYear = leadtimeDate.getFullYear();

					const leadtimeDateString = leadtimeDay + '/' + leadtimeMonth + '/' + leadtimeYear;
					console.log("Ngày dự kiến:", leadtimeDateString);

					const currentTime = Math.floor(Date.now() / 1000);
					const leadtimeInSeconds = timeOrderData.leadtime - currentTime;
					const remainingDays = Math.floor(leadtimeInSeconds / (24 * 3600));
					console.log("So ngay van chuyen:", remainingDays);
					$("#deliveryForecast").html(`${remainingDays} - ${remainingDays + 1} ngày`);
					$("#deliveryForecastAt").html(`<i class="fa-solid fa-truck-fast"></i> Nhận hàng dự kiến ${leadtimeDateString}`);
				});
			});

			$("#xaphuongName").prop("disabled", false);

		}
		else {
			$("#houseName").prop("disabled", true);
		}
	});


	//Chon phuong thuc thanh toan
	$('#debit').change(function() {
		if ($(this).is(':checked')) {
			$("#introMessage").html(`<strong>(*)Huớng dẫn:</strong> Thực hiện thanh toán vào tài khoản doanh nghiệp VnPay của chúng tôi.
							Phương thức này đã được đảm bảo bởi bên thứ ba VnPay và cửa hàng chúng tôi.
						   Mã đơn hàng của bạn sẽ được ghi vào nội dung thanh toán, đơn hàng sẽ được tạo khi tiền đã chuyển thành công.`);
		}
	});
	//Chon phuong thuc thanh toan
	$('#credit').change(function() {
		if ($(this).is(':checked')) {
			$("#introMessage").html(``);
		}
	});

	function checkNotEmpty() {
		var isEmpty = true;
		$("#createOrderInfo input").each(function() {
			var inputVal = $(this).val().trim();
			if (inputVal === "" || inputVal === "INVALID") {
				var parentDiv = $(this).parent();
				var smallElements = parentDiv.find("small");
				smallElements.html('Không được để trống!');
				isEmpty = false;
			}
		});
		return isEmpty;
	}

	//An nut thanh toan
	$("#submitOrderCart").click(function() {
		$('#createOrderInfo small').empty();

		if (!checkNotEmpty()) {
			$("subError").html(`Thiếu thông tin!`);
			$("#errorMess").html(`Bạn nhập thiếu thông tin đơn hàng, vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
			return;
		}

		var totalPrice = $('#totalOrderPrice').attr('final-price');
		if (!totalPrice) {
			return;
		}
		var cartOrderStoraged = "VNMobileOrderCart_" + vnMobileToken.email;
		var orderCart = JSON.parse(localStorage.getItem(cartOrderStoraged));

		var listItem = [];

		$.each(orderCart, function(index, value) {
			var cartItem = {
				"orderColorId": value.colorTypeId,
				"color": value.color,
				"price": value.price,
				"quantity": value.quantity,
				"totalPrice": 0
			}
			listItem.push(cartItem);
		});

		var finalSubmitOrder = {
			"email": vnMobileToken.email,
			"customerNote": $('#customerNote').val(),
			"totalPrice": $('#totalOrderPrice').attr('final-price'),
			"listItem": listItem,
			"orderTracking": {
				"carrier": "GIAO HANG NHANH",
				"url": "url1",
				"fee": $('#totalOrderFee').attr('totalFee-order'),
				"shippingCode": "shippingcode",
				"customerProvince": $('#provinceName option:selected').text(),
				"customerDistrict": $('#districtName option:selected').text(),
				"customerWard": $('#xaphuongName option:selected').text(),
				"customerAdress": $("#houseName").val(),
				"customerName": $('#customerName').val(),
				"customerTelephone": $('#phoneNumber').val(),
				"customerEmail": $('#customerEmail').val()
			},
			"orderPayment": {
				"gateway": $('input[name="checkmethod"]:checked').val(),
				"bankCode": "NO",
				"paymentInfo": "THANH TOÁN ĐƠN HÀNG VNMOBILE",
				"status": "Chưa thanh toán"
			}
		}

		console.log(finalSubmitOrder);

		var customer_name = $('#customerName').val();
		var customer_phoneNumber = $('#phoneNumber').val();
		var customer_email = $('#customerEmail').val();
		var customer_note = $('#customerNote').val();


		var to_houseno = $('#houseName').val();
		var to_ward = $('#xaphuongName option:selected').text();
		var to_district = $('#districtName option:selected').text();
		var to_province = $('#provinceName option:selected').text();
		console.log(to_ward + ' ' + to_district + ' ' + to_province);

		if ($('input[name="checkmethod"]:checked').val() === "Thanh toán khi nhận hàng") {
			$.ajax({
				method: "POST",
				url: "http://localhost:8888/api/customer/order/inserttest",
				data: JSON.stringify(finalSubmitOrder),
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
				contentType: 'application/json',
				success: function(response) {
					if (response.success) {
						$("#successModal").modal('show');
					} else {
						$("subError").html(`Đặt hàng thất bại!`);
						$("#errorMess").html(`Đặt hàng lỗi, chúg tôi sẽ khắc phục lỗi này sớm nhất có thể!`);
						$("#errorModal").modal('show');
					}
				},
				error: function(xhr, status, error) {
					$("#overlay").hide();
					window.location.href = "/403";
				}
			});
		}
		else if ($('input[name="checkmethod"]:checked').val() === "VNPAY") {
			sessionStorage.setItem('VNPAY_Order_Create', JSON.stringify(finalSubmitOrder));
			$.ajax({
				method: "POST",
				url: "http://localhost:8888/api/payment/create",
				data: {
					total: $('#totalOrderPrice').attr('final-price')
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
				success: function(response) {
					if (response.success) {
						window.location.href = response.data;
					} else {
						$("#subError").html(`Đặt hàng thất bại!`);
						$("#errorMess").html(`Đặt hàng lỗi, chúg tôi sẽ khắc phục lỗi này sớm nhất có thể!`);
						$("#errorModal").modal('show');
					}
				},
				error: function(xhr, status, error) {
					$("#overlay").hide();
					window.location.href = "/403";
				}
			});
		}

	});

	$(document).on('click', '.close-vnpay-modal', function() {
		$("#vnPaySuccessModal").modal('hide');
	});

	$(document).on('click', '.confirm-vnpay-success', function() {
		$("#vnPaySuccessModal").modal('hide');
		window.location.href = '/customer-order';
	});

	$(document).on('click', '.confirm-success', function() {
		$("#successModal").modal('hide');
		window.location.href = '/customer-order';
	});

	$(document).on('click', '.close-modal', function() {
		$("#errorModal").modal('hide');
	});

	$(document).on('click', '.close-success-modal', function() {
		$("#successModal").modal('hide');
		window.location.href = '/home';
	});
	
	$("#mapFrame").click(function(){
		$("#mapModal").modal('show');
	});

});