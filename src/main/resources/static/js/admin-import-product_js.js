$(document).ready(function() {
	//Token
	localStorage.removeItem('vnMobileBill');
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
									<div class="avatar-container" style="width: 80px; overflow: hidden;">
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

	function showListVersion(listVersion) {
		var versionHtml = ``;
		for (var i = 0; i < listVersion.length; i++) {
			if (i === 0) {
				versionHtml += `<option value="${listVersion[i].id}" selected>${listVersion[i].ram}GB - ${listVersion[i].room}GB</option>`
			}
			else {
				versionHtml += `<option value="${listVersion[i].id}">${listVersion[i].ram}GB - ${listVersion[i].room}GB</option>`
			}
		}
		$("#versionSelect").html(versionHtml);
		showVersion(listVersion[0]);
	}
	function showVersion(version) {
		var quantity = $("#quantitySubmit").val();
		$("#basePrice").html(`<strong>${version.basePrice.toLocaleString('vi-VN')}đ</strong>`);
		$("#totalPrice").html(`<strong>${(version.basePrice * quantity).toLocaleString('vi-VN')}đ</strong>`);
	}

	function showListColor(listColor) {
		var colorHtml = ``;
		for (var i = 0; i < listColor.length; i++) {
			if (i === 0) {
				colorHtml += `<option value="${listColor[i].id}" selected>${listColor[i].color.toUpperCase()}</option>`
			}
			else {
				colorHtml += `<option value="${listColor[i].id}">${listColor[i].color.toUpperCase()}</option>`
			}
		}
		$("#colorSelect").html(colorHtml);
		showColor(listColor[0])
	}
	function showColor(color) {
		$("#quantitySold").html(`${color.soldQuantity}`);
		$("#quantityInventory").html(`${color.inventoryQuantity}`);
	}

	var listType = [];
	var listColor = [];
	var productId = null;
	$(document).on('click', '.import-product', function() {
		$("#quantityMessage").empty();
		productId = $(this).attr('product-id');
		productThumbnail = $(this).attr('product-thumbnail');
		$("#thumbnailImg").attr('src', productThumbnail);
		$("#productTitleBill").html(`${$(this).attr('product-title')}`);
		$("#categoryBill").html(`Danh mục: ${$(this).attr('product-category')}`)
		$("#addSupplierBillModal").modal('show');
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/product/gettype/" + productId,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					showListVersion(response.data);
					showListColor(response.data[0].listTypeColor);
					listType = response.data;
					listColor = response.data[0].listTypeColor;
					//console.log(listType);
				} else {
					window.location.href = "/403";
				}
			},
			error: function(xhr, status, error) {
				window.location.href = "/403";
			}
		});
	});
	//Chon version
	$("#versionSelect").change(function() {
		var versionValue = $(this).val();
		var selectedType = listType.find(type => type.id == versionValue);
		listColor = selectedType.listTypeColor;
		showListColor(listColor);
		showVersion(selectedType);
	});
	//Chon color
	$("#colorSelect").change(function() {
		var colorValue = $(this).val();
		var selectedColor = listColor.find(color => color.id == colorValue);
		showColor(selectedColor);
	});
	//Chon so luong
	$("#quantitySubmit").change(function() {
		var versionValue = $("#versionSelect").val();
		var selectedType = listType.find(type => type.id == versionValue);
		showVersion(selectedType);
	});

	//Nhan nut xac nhan them
	var vnMobileBill = [];
	$("#submitAddBill").click(function() {
		if ($("#quantitySubmit").val() === "" || $("#quantitySubmit").val() === '0') {
			$("#quantityMessage").html(`Số lượng khôn đươc trống!`);
			return;
		}
		var typeId = $("#versionSelect").val();
		var colorId = $("#colorSelect").val();
		var quantity = $("#quantitySubmit").val();
		var billItems = {
			id: productId,
			thumbnail: $("#thumbnailImg").attr('src'),
			title: $("#productTitleBill").text(),
			category: $("#categoryBill").text(),
			type: listType.find(type => type.id == typeId),
			color: listColor.find(color => color.id == colorId),
			quantity: parseInt(quantity)
		};
		vnMobileBill.push(billItems);
		$("#billQuantity").html(`(${vnMobileBill.length})`);
		$("#confirmIcon").html(`<i style="color: green; font-size: 2em" class="fa-regular fa-circle-check"></i>`);
		$("#subMess").html(`Thành công!`);
		$("#confirmMess").html(`Thêm sản phẩm vào hóa đơn thành công!`);
		$("#addSupplierBillModal").modal('hide');
		$("#confirmModal").modal('show');
	});

	$("#cancelBill").click(function() {
		$("#cancelModal").modal('show');
		$("#confirmCancelBtn").click(function() {
			$("#cancelModal").modal('hide');
			localStorage.removeItem('vnMobileBill');
			window.location.href = '/admin-supplier';
		});
	});

	$("#viewBill").click(function() {
		if (vnMobileBill.length === 0) {
			$("#confirmIcon").html(`<i style="color: red; font-size: 2em" class="fa-regular fa-circle-xmark"></i>`);
			$("#subMess").html(`Hóa đơn trống!`);
			$("#confirmMess").html(`Hóa đơn của bạn đang trống, vui lòng thêm sản phẩm!`);
			$("#confirmModal").modal('show');
			return;
		}
		else {
			localStorage.setItem('vnMobileBill', JSON.stringify(vnMobileBill));
			window.location.href = '/admin-cart-bill?supplier-id=' + getUrlParam();
		}
	});
});