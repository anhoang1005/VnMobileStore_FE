$(document).ready(function() {

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

	//Ham cap nhat gia tong

	//Lay api Tinh, thanh pho
	function getApiProviceGHN(callback) {
		$.ajax({
			method: "GET",
			url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
			headers: {
				'token': "b8262cb5-dfc9-11ee-a2c1-ca2feb4b63fa"
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
			url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
			data: {
				province_id: provinceId
			},
			headers: {
				'token': "b8262cb5-dfc9-11ee-a2c1-ca2feb4b63fa"
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
			url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
			data: {
				"district_id": districtId
			},
			headers: {
				'token': "b8262cb5-dfc9-11ee-a2c1-ca2feb4b63fa"
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
			url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
			data: {
				shop_id: 4949314,
				from_district: 1542,
				to_district: to_districtId
			},
			headers: {
				'token': "b8262cb5-dfc9-11ee-a2c1-ca2feb4b63fa"
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
			method: "GET",
			url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
			data: {
				service_id: serviceId,
				insurance_value: orderPrice,
				coupon: null,
				from_district_id: 1542,
				to_district_id: to_districtId,
				to_ward_code: to_wardCode,
				height: 20,
				length: 20,
				weight: weight,
				width: 20
			},
			headers: {
				'token': "b8262cb5-dfc9-11ee-a2c1-ca2feb4b63fa"
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

	//Api du kien thoi gian giao hang
	function getApiThoiGianDuKienGHN(serviceId, to_districtId, to_wardCode, callback) {
		$.ajax({
			method: "GET",
			url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime",
			data: {
				from_district_id: 1542,
				from_ward_code: "1B1507",
				to_district_id: to_districtId,
				to_ward_code: to_wardCode,
				service_id: serviceId
			},
			headers: {
				'ShopId': "4949314",
				'token': "b8262cb5-dfc9-11ee-a2c1-ca2feb4b63fa"
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
	
	
	//Ham lay gia tri co ban cua don hang
	function getBaseTotalPrice(){
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
		var cartOrderStoraged = "VNMobileOrderCart_" + vnMobileToken.email;
		var orderCart = [];
		var baseTotalPrice = 0;
		if(localStorage.getItem(cartOrderStoraged)!==null){
			orderCart = JSON.parse(localStorage.getItem(cartOrderStoraged));
			$.each(orderCart, function(index, value) {
				baseTotalPrice = BigInt(baseTotalPrice) + BigInt(value.quantity*value.price);
			});
		}
		else{
			window.location.href='/403';
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
	
	//An nut thanh toan
	$("#submitOrderCart").click(function() {
		var customer_name = $('#customerName').val();
		var customer_phoneNumber = $('#phoneNumber').val();
		var customer_email = $('#customerEmail').val();
		var customer_note = $('#customerNote').val();
		
		var to_houseno = $('#houseName').val();
		var to_ward = $('#xaphuongName option:selected').val();
		var to_district = $('#districtName option:selected').val();
		var to_province = $('#provinceName option:selected').val();
		
		//var totalOrderPrice = $('#').html();
		//var feeOrder = $('#').html();
	});
	
	
});