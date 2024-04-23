$(document).ready(function() {
	//Token
	var vnMobileToken = null;
	if (localStorage.getItem('VnMobileToken') !== null) {
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
		if (vnMobileToken.role === "QUANLI") {
			showListBill();
			getSupplier();
		}
		else {
			window.location.href = '/401';
		}
	}
	else {
		window.location.href = '/401';
	}

	function getUrlParam() {
		var currentUrl = window.location.href;
		var searchParams = new URLSearchParams(new URL(currentUrl).search);
		var pageValue = searchParams.get('supplier-id');
		if (pageValue === null) {
			window.location.href = '/404';
		}
		return pageValue;
	}

	//Nha cung cap
	function getSupplier() {
		var supplierId = getUrlParam();
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/supplier/getById/" + supplierId,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					$("#supplierNameChoose").html(`${response.data.supplierName}`);
					$("#supplierName").val(`${response.data.supplierName}`);
					$("#supplierName").attr('disabled', true);
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

	function showListBill() {
		var vnMobileBill = [];
		if (localStorage.getItem('vnMobileBill') !== null) {
			vnMobileBill = JSON.parse(localStorage.getItem('vnMobileBill'));
			$("#cartItemQuantity").html(`Hóa đơn (${vnMobileBill.length})`)
			$("#checkedCartIemquantity").html(`${vnMobileBill.length}`);
			$("#createdBillPerson").val(`${vnMobileToken.fullName}`);
			$("#createdBillPerson").attr('disabled', true);
		}
		var cartHtml = ``;
		var totalPrice = 0;
		$.each(vnMobileBill, function(index, value) {
			cartHtml += `<tr>
								<th class="text-center" scope="row">
									<input id="cartItem${index}" class="check-cartItem" type="checkbox" name="cartItemChecked" value="${index}" aria-label="Checkbox for following text input">
								</th>
								<th>
									<img style="width: 100px; height: auto" src="${value.thumbnail}" alt="alt" />
								</th>
								<td>
									<strong><span>${value.title}</span></strong>
									<br>
									<span class="mr-2">Phiên bản: ${value.type.ram}GB-${value.type.room}GB</span>
									<br>
									<span>Màu: ${value.color.color}</span>
									<div style="display: flex; flex-direction: column;">
										<span class="mt-3"><strong>Đơn giá: ${value.type.basePrice.toLocaleString('vi-VN')}đ</strong></span>
									</div>
								</td>
								<td>
									<div class="input-group">
										<div class="input-group-prepend">
											<button minus-id="${value.color.id}" class="btn btn-danger minus-btn" type="button">-</button>
										</div>
										<input id="inputQuantity${value.color.id}" type="number"
											class="form-control quantity-input col-4" name="quantity${index}" min="1" max="10"
											value="${value.quantity}">
										<div class="input-group-append">
											<button plus-id="${value.color.id}" class="btn btn-success plus-btn" type="button">+</button>
										</div>
									</div>
									<br>
								</td>
								<td class="text-center" style="color: red"><strong>${(value.quantity * value.type.basePrice).toLocaleString('vi-VN')}đ</strong></td>
								<td class="text-center">
									<button delete-bill=${value.color.id} class="btn btn-sm btn-danger deletebill-btn" data-toggle="modal" data-target="#deleteCartItemModal">
										<i class="fa fa-trash"></i>
									</button>
								</td>
							</tr>`;
			totalPrice = BigInt(totalPrice) + BigInt(value.quantity * value.type.basePrice);
		});
		$("#cartItemColumn").html(cartHtml);
		$("#totalCheckedCart").html(`${totalPrice.toLocaleString('vi-VN')}đ`);
	}

	$("#backPage").click(function() {
		var supplierId = getUrlParam();
		console.log(supplierId);
		window.location.href = "admin-import-product?supplier-id=" + supplierId;
	});

	function updateCartBillQuantity(colorId, value) {
		var vnMobileBill = [];
		if (localStorage.getItem('vnMobileBill') !== null) {
			vnMobileBill = JSON.parse(localStorage.getItem('vnMobileBill'));
			var index = vnMobileBill.findIndex(product => product.color.id == colorId);
			console.log(index);
			vnMobileBill[index].quantity = value;
			localStorage.setItem('vnMobileBill', JSON.stringify(vnMobileBill));
			showListBill();
		}
	}

	function deleteBillItem(colorId) {
		var vnMobileBill = [];
		if (localStorage.getItem('vnMobileBill') !== null) {
			vnMobileBill = JSON.parse(localStorage.getItem('vnMobileBill'));
			var index = vnMobileBill.findIndex(product => product.color.id == colorId);
			vnMobileBill.splice(index, 1);
			localStorage.setItem('vnMobileBill', JSON.stringify(vnMobileBill));
			showListBill();
		}
	}

	$(document).on('click', '.minus-btn', function() {
		var productId = $(this).attr('minus-id');
		var value = $("#inputQuantity" + productId).val();
		if (value > 1) {
			updateCartBillQuantity(productId, value - 1);
			$("#inputQuantity" + productId).val(value - 1);
		};
	});

	$(document).on('click', '.plus-btn', function() {
		var productId = $(this).attr('plus-id');
		var currentQuantity = $("#inputQuantity" + productId).val();
		if (currentQuantity < 100) {
			var newValue = parseInt(currentQuantity) + 1;
			updateCartBillQuantity(productId, newValue);
			$("#inputQuantity" + productId).val(newValue);
		};
	});

	$(document).on('click', '.deletebill-btn', function() {
		var productId = $(this).attr('delete-bill');
		$("#cancelModal").modal('show');

		$("#confirmCancelBtn").click(function() {
			deleteBillItem(productId);
			$("#cancelModal").modal('hide');
		});
	});

	$("#checkoutCart").click(function() {
		var vnMobileBill = [];
		var supplierId = getUrlParam();
		if (localStorage.getItem('vnMobileBill') !== null) {
			vnMobileBill = JSON.parse(localStorage.getItem('vnMobileBill'));
		}
		if(vnMobileBill.length===0){
			$("#huyModal").modal('show');
			return;
		}
		$("#addBillModal").modal('show');
		var listBillItems = [];
		$.each(vnMobileBill, function(index, value) {
			var billItems = {
				productId: value.id,
				typeId: value.type.id,
				colorId: value.color.id,
				quantity: value.quantity
			}
			listBillItems.push(billItems);
		});

		$("#confirmAddBillBtn").click(function() {
			var BillRequest = {
				emailUser: vnMobileToken.email,
				supplierId: supplierId,
				listBillItems: listBillItems
			};

			$.ajax({
				method: "POST",
				url: "http://localhost:8888/api/admin/supplier/createbill",
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token,
					'Content-Type': 'application/json'
				},
				data: JSON.stringify(BillRequest),
				success: function(response) {
					$("#addBillModal").modal('hide');
					if (response.success) {
						$("#successModal").modal('show');
						vnMobileBill = [];
						localStorage.setItem('vnMobileBill', JSON.stringify(vnMobileBill));
						showListBill();
						$("#confirmExportBill").click(function() {
							var url = "http://localhost:8888/api/uploadfile/file/" + response.data;
							console.log(url);
							$("#successModal").modal('hide');
							window.location.href = url;
						});
					} else {
						window.location.href = "/403";
					}
				},
				error: function(xhr, status, error) {
					$("#overlay").hide();
					window.location.href = "/403";
				}
			});
		});
	});


});