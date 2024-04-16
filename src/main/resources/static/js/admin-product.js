$(document).ready(function() {
	//Token
	var vnMobileToken = null;
	if (localStorage.getItem('VnMobileToken') !== null) {
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
		if (vnMobileToken.role === "QUANLI") {
			baseTable(1);
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

	$("#insertProductBtn").click(function() {
		window.location.href = '/admin-insert-product';
	});

	//Table mo dau trang
	function baseTable(pageNumber) {
		//var supplierId = getUrlParam();
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/product/dashboard/" + pageNumber,
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
	function showTable(listProduct) {
		var tableHtml = ``;
		$.each(listProduct, function(index, value) {

			if (value.deleted === true) {
				tableHtml += `<tr>
								<th scope="row">
									<input class="form-check-input" type="checkbox" value=""
									id="flexCheckDefault">
								</th>
								<td>#P000${value.id}</td>
								<td>
									<div class="avatar-container" style="width: 80px; overflow: hidden;">
										<img id="userAvatar" class="avatar" style="width: 100%; height: auto; object-fit: cover;"
											src="${value.thumbnail}" alt="san-pham">
									</div>
								</td>
								<td>${value.title}</td>
								<td>${value.category}</td>
								<td>${value.supplier}</td>
								<td>${getDateByTimeStamp(value.createdAt)}</td>`

				if (value.rateStar === 0) {
					tableHtml += `<td>Không</td>`
				}
				else {
					tableHtml += `<td>${value.rateStar.toFixed(1)}</td>`
				}
				tableHtml += `<td>${value.quantitySold}</td>`
				tableHtml += `<td>
									<button product-slug="${value.productSlug}" class="btn btn-success btn-md product-detail">
										<i class="fa-solid fa-list"></i>
									</button>
									<button product-slug="${value.productSlug}" class="btn btn-primary btn-md product-update">
										<i class="fa-solid fa-pen-to-square"></i>
									</button>
									<button product-id="${value.id}" class="btn btn-danger btn-md product-lock">
										<i class="fa-solid fa-trash"></i>
									</button>
								</td>`
			}
			else {
				tableHtml += `<tr>
								<th scope="row">
									<input class="form-check-input" type="checkbox" value=""
									id="flexCheckDefault">
								</th>
								<td class="text-danger">#P000${value.id}</td>
								<td class="text-danger">
									<div class="avatar-container" style="width: 80px; overflow: hidden;">
										<img id="userAvatar" class="avatar" style="width: 100%; height: auto; object-fit: cover;"
											src="${value.thumbnail}" alt="san-pham">
									</div>
								</td>
								<td class="text-danger">${value.title}</td>
								<td class="text-danger">${value.category}</td>
								<td class="text-danger">${value.supplier}</td>
								<td class="text-danger">${getDateByTimeStamp(value.createdAt)}</td>`

				if (value.rateStar === 0) {
					tableHtml += `<td class="text-danger">Không</td>`
				}
				else {
					tableHtml += `<td class="text-danger">${value.rateStar.toFixed(1)}</td>`
				}
				tableHtml += `<td class="text-danger">${value.quantitySold}</td>`
				tableHtml += `<td>
									<button product-slug="${value.productSlug}" class="btn btn-success btn-md product-detail">
										<i class="fa-solid fa-list"></i>
									</button>
									<button product-slug="${value.productSlug}" class="btn btn-primary btn-md product-update">
										<i class="fa-solid fa-pen-to-square"></i>
									</button>
									<button product-id="${value.id}" class="btn btn-warning btn-md product-unlock">
										<i class="fa-solid fa-rotate-left"></i>
									</button>
								</td>`
			}
			tableHtml += `</tr>`;
		});
		$("#bodyTable").html(tableHtml);
	}

	$(document).on('click', '.product-detail', function() {
		var slug = $(this).attr('product-slug');
		//window.location.href='/admin-addproduct?slug=' + slug;
	});

	$(document).on('click', '.product-update', function() {
		var slug = $(this).attr('product-slug');
		window.location.href = '/admin-update-product?slug=' + slug;
	});

	$(document).on('click', '.product-lock', function() {
		var productId = $(this).attr('product-id');
		var formData = {
			id: productId,
			deleted: false
		};
		$("#lockModal").modal('show');
		$("#confirmLockBtn").click(function() {
			$.ajax({
				method: "DELETE",
				url: "http://localhost:8888/api/admin/product/delete",
				data: formData,
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
				success: function(response) {
					$("#lockModal").modal('hide');
					$("#confirmModal").modal('show');
					if (response.success) {
						$("#confirmIcon").html(`<i style="color: green; font-size: 1.5em" class="fa-regular fa-circle-check"></i>`);
						$("#subMess").html(`Thành công`);
						$("#confirmMess").html(`Xóa sản phẩm thành công!`);
						baseTable(1);
					} else {
						$("#confirmIcon").html(`<i style="color: green; font-size: 1.5em" class="fa-regular fa-circle-xmark"></i>`);
						$("#subMess").html(`Xóa sản phẩm`);
						$("#confirmMess").html(`Xóa sản phẩm thất bại!`);
					}
				},
				error: function(xhr, status, error) {
					$("#overlay").hide();
					window.location.href = "/403";
				}
			});
		});
	});

	$(document).on('click', '.product-unlock', function() {
		var productId = $(this).attr('product-id');
		var formData = {
			id: productId,
			deleted: true
		};
		$("#unlockModal").modal('show');
		$("#confirmUnLockBtn").click(function() {
			$.ajax({
				method: "DELETE",
				url: "http://localhost:8888/api/admin/product/delete",
				data: formData,
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
				success: function(response) {
					$("#unlockModal").modal('hide');
					$("#confirmModal").modal('show');
					if (response.success) {
						$("#confirmIcon").html(`<i style="color: green; font-size: 1.5em" class="fa-regular fa-circle-check"></i>`);
						$("#subMess").html(`Thành công`);
						$("#confirmMess").html(`Khôi phục sản phẩm thành công!`);
						baseTable(1);
					} else {
						$("#confirmIcon").html(`<i style="color: green; font-size: 1.5em" class="fa-regular fa-circle-xmark"></i>`);
						$("#subMess").html(`Thất bại`);
						$("#confirmMess").html(`Khôi phục sản phẩm thất bại!`);
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