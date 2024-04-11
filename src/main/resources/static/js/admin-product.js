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

	//Table mo dau trang
	function baseTable(pageNumber) {
		//var supplierId = getUrlParam();
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/product/getbysupplier/1/" + pageNumber,
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
								<th scope="row">
									<input class="form-check-input" type="checkbox" value=""
									id="flexCheckDefault">
								</th>
								<td>#P000${value.id}</td>
								<td>
									<div class="avatar-container" style="width: 70px; overflow: hidden;">
										<img id="userAvatar" class="avatar" style="width: 100%; height: auto; object-fit: cover;"
											src="${value.thumbnail}" alt="san-pham">
									</div>
								</td>
								<td>${value.title}</td>
								<td>${value.category}</td>
								<td>thoi gian tao</td>
								<td>${value.rateStar.toFixed(1)}</td>
								<td>${value.versionQuantity}</td>
								<td>${value.quantitySold}</td>
								<td>
									<button product-id="${value.id}" class="btn btn-success btn-sm col-sm-12">
										<i class="fa-solid fa-cart-plus"></i> Thêm
									</button>
								</td>
							</tr>`
		});
		$("#bodyTable").html(tableHtml);
	}

});