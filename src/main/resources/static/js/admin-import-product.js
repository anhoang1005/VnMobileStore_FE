$(document).ready(function() {
	//Token
	var vnMobileToken = null;
	if (localStorage.getItem('VnMobileToken') !== null) {
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
		if (vnMobileToken.role === "QUANLI") {
			baseTable(1);
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

	$("#backPage").click(function() {
		window.location.href = '/admin-supplier';
	});

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
					$("#supplierNameChoose").html(`${response.data.supplierName} (${response.data.productQuantity} sản phẩm)`);
					$("#supplierName").html(`${response.data.supplierName} (${response.data.productQuantity} sản phẩm)`)
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

	//Table mo dau trang
	function baseTable(pageNumber) {
		var supplierId = getUrlParam();
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/product/getbysupplier/" + supplierId + "/" + pageNumber,
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
	function showTable(listProduct) {
		var tableHtml = ``;
		$.each(listProduct, function(index, value) {
			tableHtml += `<tr>
								<td>#P000${value.id}</td>
								<td>
									<div class="avatar-container" style="width: 70px; overflow: hidden;">
										<img id="userAvatar" class="avatar" style="width: 100%; height: auto; object-fit: cover;"
											src="${value.thumbnail}" alt="san-pham">
									</div>
								</td>
								<td>${value.title}</td>
								<td>${value.category}</td>
								<td>${value.rateStar.toFixed(1)}</td>
								<td>${value.versionQuantity}</td>
								<td>${value.quantitySold}</td>
								<td>
									<button product-id="${value.id}" 
											product-thumbnail=${value.thumbnail} 
											product-title="${value.title}"
											product-category=${value.category} 
											class="btn btn-success btn-sm col-sm-12 import-product">
										<i class="fa-solid fa-cart-plus"></i> Thêm
									</button>
								</td>
							</tr>`
		});
		$("#bodyTable").html(tableHtml);
	}

	var listType = [];
	$(document).on('click', '.import-product', function() {
		$("#colorMessage").empty();
		$("#versionMessage").empty();
		$("#quantityMessage").empty();
		var productId = $(this).attr('product-id');
		var productThumbnail = $(this).attr('product-thumbnail');
		$("#productTitleBill").html(`${$(this).attr('product-title')}`);
		$("#categoryBill").html(`Danh mục: ${$(this).attr('product-category')}`)

		$("#thumbnailImg").attr('src', productThumbnail);
		$("#addSupplierBillModal").modal('show');
		$("#colorSelect").html(`<option value="INVALID" selected>--Màu sắc--</option>`);
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/product/gettype/" + productId,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					$("#colorSelect").attr('disabled', true);
					$("#quantitySubmit").attr('disabled', true);
					var versionHtml = `<option value="INVALID" selected>--Phiên bản--</option>`;
					$.each(response.data, function(index, value) {
						versionHtml += `<option value="${value.id}">${value.ram}GB - ${value.room}GB</option>`
					});
					$("#versionSeclect").html(versionHtml);
					listType = response.data;
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
	var listColor = [];
	var basePrice = null;
	$("#versionSeclect").change(function() {
		var selectedValue = $(this).val();
		if(selectedValue === "INVALID"){
			$("#totalPrice").empty();
			$("#basePrice").empty();
			$("#colorSelect").html(`<option value="INVALID" selected>--Màu sắc--</option>`);
			$("#colorSelect").attr('disabled', true);
		}
		else{
			$("#colorSelect").attr('disabled', false);
		}
		var selectedType = listType.find(type => type.id == selectedValue);
		listColor = selectedType.listTypeColor;
		basePrice = selectedType.basePrice;
		var colorHtml = `<option value="INVALID" selected>--Màu sắc--</option>`;
		$.each(selectedType.listTypeColor, function(index, color) {
			colorHtml += `<option value="${color.id}">${color.color}</option>`
		});
		$("#colorSelect").html(colorHtml);
		$("#basePrice").html(`<strong>${selectedType.basePrice.toLocaleString('vi-VN')}đ</strong>`);
	});
	$("#colorSelect").change(function() {
		var selectedValue = $(this).val();
		if(selectedValue === "INVALID"){
			$("#quantitySold").empty();
			$("#totalPrice").empty();
			$("#quantityInventory").empty();
			$("#quantitySubmit").val(1);
			$("#quantitySubmit").attr('disabled', true);
		}
		else{
			$("#quantitySubmit").attr('disabled', false);
			var quantity = $("#quantitySubmit").val();
			$("#totalPrice").html(`<strong>${(basePrice * quantity).toLocaleString('vi-VN')}đ</strong>`);
		}
		var selectedColor = listColor.find(color => color.id == selectedValue);
		$("#quantitySold").html(`${selectedColor.soldQuantity}`);
		$("#quantityInventory").html(`${selectedColor.inventoryQuantity}`);
	});

	$("#quantitySubmit").change(function() {
		var quantity = $(this).val();
		var version = $("#versionSeclect").val();
		var color = $("#colorSelect").val();
		if (quantity == "") {
			$("#quantityMessage").html(`Số lượng không được để trống!`);
			$("#totalPrice").empty();
			return;
		}
		$("#totalPrice").html(`<strong>${(basePrice * quantity).toLocaleString('vi-VN')}đ</strong>`);
	});

	$("#submitAddBill").click(function() {
		var version = $("#versionSeclect").val();
		var color = $("#colorSelect").val();
		var quantity = $("#quantitySubmit").val();
		if (version === "INVALID") {
			$("#versionMessage").html(`Bạn phải chọn version!`);
			return;
		}
		else if (color === "INVALID") {
			$("#colorMessage").html(`Bạn phải chọn màu sắc!`);
			return;
		}
		else if (quantity === "") {
			$("#quantityMessage").html(`Số lượng không được để trống!`);
			return;
		}
	});
});