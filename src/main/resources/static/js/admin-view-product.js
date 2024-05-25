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
	$("#overlay").hide();
	function getProductSlugUrlParam() {
		var currentUrl = window.location.href;
		var searchParams = new URLSearchParams(new URL(currentUrl).search);
		var pageValue = searchParams.get('slug');
		var actionValue = searchParams.get('action');
		if (pageValue === null) {
			window.location.href = '/404';
			return;
		}
		return { pageValue, actionValue };
	}
	var params = getProductSlugUrlParam();
	async function getProductDetail(slug) {
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/product/detail/" + slug
			});
			if (response.success) {
				return response.data;
			} else {
				window.location.href = "/403";
			}
		} catch (error) {
			window.location.href = "/403";
		}
	} (async function() {
		var productDetail = await getProductDetail(params.pageValue);
		showInfo(productDetail);
		showThumbnail(productDetail.listThumbnail);
		showType(productDetail.listType);

		$(document).on('click', '.color-view', function() {
			var typeId = $(this).attr('type-id');
			var typeChange = productDetail.listType.find(type => type.id === parseInt(typeId));
			$("#versionTypeColor").html(`${typeChange.ram + 'GB - ' + typeChange.room + 'GB'}`)
			showColor(typeChange.listTypeColor);
		});
	})();

	if (params.actionValue === "view") {
		$('#layoutSidenav_content input').attr('disabled', true);
		$('textarea').attr('disabled', true);
		$('select').attr('disabled', true);
		$('button').attr('disabled', true);
		$("#productStatus").html(`Thông tin mặt hàng`);
		document.title = "Thông tin mặt hàng";
	}

	function showInfo(data) {
		$("#productTitle").val(data.title);
		$("#productBasePrice").val(data.basePrice);
		$("#productDescription").val(data.description);
		$("#productCategory").val('a');
		$("#productSupplier").val('a');
		$("#productScreen").val(data.productInfo.screen);
		$("#productFrontCamera").val(data.productInfo.frontCamera);
		$("#productBackCamera").val(data.productInfo.backCamera);
		$("#productCpu").val(data.productInfo.cpu);
		$("#productGpu").val(data.productInfo.gpu);
		$("#productOperatingSystem").val(data.productInfo.operatingSystem);
		$("#productBattery").val(data.productInfo.battery);
		$("#productWeight").val(data.productInfo.weight);
		$("#thumbnailImg").attr('src', data.thumbnail);
	}

	function showType(listType) {
		var typeHtml = ``;
		$.each(listType, function(index, value) {
			typeHtml += `<tr>
							<td><strong>${index + 1}<strong></td>
							<td>${value.ram}GB</td>
							<td>${value.room}GB</th>
							<td>${value.basePrice.toLocaleString('vi-VN')}đ</th>
							<td>${value.price.toLocaleString('vi-VN')}đ</th>
							<td>${value.discount.toLocaleString('vi-VN')}đ</th>`
			if (params.actionValue === 'view') {
				typeHtml += `<td>
								<button type-id="${value.id}" class="btn btn-success color-view"><i class="fa-solid fa-list"></i></button>
							</td>
							</tr>`;
			}
			else{
				typeHtml += `<td>
								<button type-id="${value.id}" class="btn btn-success color-view col-4"><i class="fa-solid fa-list"></i></button>
								<button type-id="${value.id}" class="btn btn-danger col-4"><i class="fa-solid fa-trash"></i></button>
							</td>
							</tr>`
			}
		});
		$("#typeTableBody").html(typeHtml);
	}

	function showThumbnail(listThumbnail) {
		var thumbnailHtml = ``;
		$.each(listThumbnail, function(index, value) {
			thumbnailHtml += `<th>
											<div class="avatar-container me-2"
												style="width: 150px; height: 150px; overflow: hidden;">
												<img id="plusImg" class="avatar"
													style="width: 100%; height: 100%; object-fit: cover;"
													src="${value.thumbnail}" alt="Avatar">
											</div>
										</th>`;
		});
		$("#listPlusthumbnail").html(thumbnailHtml);
	}

	function showColor(listColor) {
		var colorHtml = ``;
		$.each(listColor, function(index, value) {
			colorHtml += `<tr>
							<td>${index + 1}</th>
							<td>${value.color}</td>
							<td>${value.inventoryQuantity}</td>
							<td>
								<button color-id="${value.id}" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
							</td>
						</tr>`;
		});
		$("#colorBody").html(colorHtml);
	}

});