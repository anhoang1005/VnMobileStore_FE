$(document).ready(function() {

	$("#overlay").hide();

	//Token
	var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
	if (vnMobileToken !== null && vnMobileToken.role === "QUANLI") {
		showAllCategory();
		showAllSupplier();
	} else {
		window.location.href = '/401';
	}

	function showAllCategory() {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/category/getall",
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					var categoryHtml = `<option value="" selected>--Danh mục--</option>`;
					$.each(response.data, function(index, value) {
						if (value.deleted === true) {
							categoryHtml += `<option value="${value.id}">${value.categoryName}</option>`
						}
						else {
							categoryHtml += `<option class="text-danger" value="${value.id}" disabled>${value.categoryName}</option>`
						}
					});
					$("#productCategory").html(categoryHtml);
				} else {

				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				window.location.href = "/403";
			}
		});
	}

	function showAllSupplier() {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/supplier",
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					var supplierHtml = `<option value="" selected>--Nhà cung cấp--</option>`;
					$.each(response.data, function(index, value) {
						if (value.deleted === true) {
							supplierHtml += `<option value="${value.id}">${value.supplierName}</option>`
						}
						else {
							supplierHtml += `<option class="text-danger" value="${value.id}" disabled>${value.supplierName}</option>`
						}
					});
					$("#productSupplier").html(supplierHtml);
				} else {

				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				window.location.href = "/403";
			}
		});
	}

	var file = null;
	$('#productThumbail').change(function() {
		$("#thumbnailMessage").html(``);
		var fileInput = $(this)[0];
		file = fileInput.files[0]; // Lấy file đầu tiên trong danh sách các file được chọn
		if (file) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#thumbnailImg').attr('src', e.target.result)
			};
			reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
		} else {
			$("#thumbnailMessage").html(`Bạn chưa chọn ảnh!`);
			$('#thumbnailImg').attr('src', '/img/avatar/user.png');
		}
	});


	var listFiles = [];
	$('#plusThumbail').change(function() {
		$("#thumbnailMessage").html('');
		$("#listPlusthumbnail").empty();
		var newFiles = $(this)[0].files;

		for (var i = 0; i < newFiles.length; i++) {
			listFiles.push(newFiles[i]);
		}
		showListPlusThumbnail();
	});

	function showListPlusThumbnail() {
		if (listFiles.length === 0) {
			$("#listPlusthumbnail").empty();
			$("#listPlusthumbnail").append(`<div class="avatar-container ms-2"
												style="width: 150px; height: 150px; overflow: hidden;">
												<img id="plusImg" class="avatar"
													style="width: 100%; height: 100%; object-fit: cover;"
													src="https://via.placeholder.com/300x300?text=300x300">
											</div>`);
		}
		else {
			$("#listPlusthumbnail").empty();
			for (var i = 0; i < listFiles.length; i++) {
				var file = listFiles[i];
				var reader = new FileReader();

				reader.onload = (function(theFile, index) {
					return function(e) {
						var thumbnailHtml = `<div>
												<div class="avatar-container ms-2" style="width: 150px; height: 150px; overflow: hidden;">
                                            		<img class="avatar" style="width: 100%; height: 100%; object-fit: cover;"
                                                		src="${e.target.result}" alt="Avatar">
                                        		</div>
                                        		<center><button img-stt="${index}" class="btn btn-sm btn-danger mt-2">Xóa</button></center>
                                        	</div>`
							;
						$("#listPlusthumbnail").append(thumbnailHtml); // Sửa thumbnail thành thumbnailHtml
					};
				})(file);

				reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
			}
		}
	}

	$(document).on("click", "#listPlusthumbnail button", function() {
		var imgIndex = $(this).attr("img-stt");
		listFiles.splice(imgIndex, 1); // Xóa file từ danh sách listFiles
		$(this).parent().remove(); // Xóa thẻ cha của nút "Xóa"
		showListPlusThumbnail();
		console.log(listFiles.length);
	});

	function checkTypeNotEmpty() {
		var isEmpty = true;
		$("#cardType input").each(function() {
			var inputVal = $(this).val().trim();
			if (inputVal === "") {
				var parentDiv = $(this).parent();
				var smallElements = parentDiv.find("small");
				smallElements.html('Không được để trống!');
				isEmpty = false;
			}
		});
		return isEmpty;
	}

	function checkColorNotEmpty() {
		var isEmpty = true;
		$("#cardColor input").each(function() {
			var inputVal = $(this).val().trim();
			if (inputVal === "") {
				var parentDiv = $(this).parent();
				var smallElements = parentDiv.find("small");
				smallElements.html('Không được để trống!');
				isEmpty = false;
			}
		});
		return isEmpty;
	}
	
	function checkNotEmpty() {
		var isEmpty = true;
		$("#cardInfo input").each(function() {
			var inputVal = $(this).val().trim();
			if (inputVal === "") {
				var parentDiv = $(this).parent();
				var smallElements = parentDiv.find("small");
				smallElements.html('Không được để trống!');
				isEmpty = false;
			}
		});
		return isEmpty;
	}
	
	function checkNotEmptyListTypeColor(){
		var isNotEmpty = true;
		for(var i = 0; i<listProductType.length; i++){
			if(listProductType[i].listTypeColor.length===0){
				isNotEmpty = false;
			}
		}
		return isNotEmpty;
	}
	
	//Tao them Type
	var listProductType = [];
	$("#createProductType").click(function() {
		$('small').empty();
		console.log(checkTypeNotEmpty());
		if (!checkTypeNotEmpty()) {
			return;
		}
		var typeExist = listProductType.find(type => type.ram === $("#productRam").val() && type.room === $("#productRom").val());
		if(typeExist!==undefined){
			$("#ramMessage").html(`Trùng version khác!`);
			$("#roomMessage").html(`Trùng version khác!`);
			return;
		}
		var productType = {
			"ram": $("#productRam").val(),
			"room": $("#productRom").val(),
			"price": parseInt($("#productPrice").val()),
			"discount": parseInt($("#productDiscount").val()),
			"basePrice": parseInt($("#productbasePrice").val()),
			"listTypeColor": []
		};
		listProductType.push(productType);
		showListType(listProductType);
		$('#cardType input').val(``);
	});
	
	//Tao them color
	$("#createColorType").click(function() {
		$('small').empty();
		if (!checkColorNotEmpty()) {
			return;
		}
		var typeIndex = parseInt($("#versionTypeColor").attr('type-index'));
		var listColorCurrent = listProductType[typeIndex].listTypeColor;
		var colorExist = listColorCurrent.find(color => color.color === $("#productColor").val());
		if(colorExist){
			$("#colorMessage").html(`Trùng màu đã thêm trước đó!`);
			return;
		}
		var productColor = {
			"color": $("#productColor").val(),
			"soldQuantity": 0,
			"inventoryQuantity": $("#productInventory").val()
		};
		listColorCurrent.push(productColor);
		listProductType[typeIndex].listTypeColor = listColorCurrent;
		showListColor(listProductType[typeIndex].listTypeColor);
		$('#cardColor input').val(``);
	});

	function showListType(listType) {
		var typeHtml = ``;
		$.each(listType, function(index, value) {
			typeHtml += `<tr>
							<th scope="row">${index + 1}</th>
							<td>${value.ram}GB</td>
							<td>${value.room}GB</td>
							<td>${value.basePrice.toLocaleString('vi-VN')}đ</td>
							<td>${value.price.toLocaleString('vi-VN')}đ</td>
							<td>${value.discount.toLocaleString('vi-VN')}đ</td>
							<td>
								<button type-index="${index}" class="btn btn-success view-color"><i class="fa-regular fa-eye"></i></button>
								<button type-index="${index}" class="btn btn-danger delete-type"><i class="fa-solid fa-trash-can"></i></button>
							</td>
						</tr>`
		});
		$("#typeTableBody").html(typeHtml);
	}

	function showListColor(listColor) {
		var colorHtml = ``;
		$.each(listColor, function(index, value) {
			colorHtml += `<tr>
							<th scope="row">${index + 1}</th>
							<td>${value.color}</td>
							<td>${value.inventoryQuantity}</td>
							<td>
								<button color-index="${index}" class="btn btn-danger delete-color"><i
									class="fa-solid fa-trash-can"></i></button>
							</td>
						</tr>`
		});
		$("#colorBody").html(colorHtml);
	}

	$(document).on('click', '.delete-type', function() {
		var typeIndex = $(this).attr('type-index');
		listProductType.splice(typeIndex, 1)
		showListType(listProductType);
	});

	$(document).on('click', '.view-color', function() {
		var typeIndex = $(this).attr('type-index');
		console.log(typeIndex);
		var listColorIndex = listProductType[typeIndex].listTypeColor;
		$("#versionTypeColor").html(`Phiên bản: ${listProductType[typeIndex].ram}GB-${listProductType[typeIndex].room}GB`);
		$("#versionTypeColor").attr('type-index', typeIndex);
		showListColor(listColorIndex);
	});
	
	$(document).on('click', '.delete-color', function(){
		var colorIndex = parseInt($(this).attr('color-index'));
		var typeIndex = parseInt($("#versionTypeColor").attr('type-index'));
		listProductType[typeIndex].listTypeColor.splice(colorIndex, 1);
		var listColorIndex = listProductType[typeIndex].listTypeColor;
		showListColor(listColorIndex);
	});

	$("#cancelInsertProduct").click(function() {
		window.location.href = '/admin-product';
	});
	$("#submitInsertProduct").click(function() {
		$('small').empty();

		var fileInput = $("#productThumbail")[0];
		file = fileInput.files[0];

		if ($("#productTitle").val() === "") {
			$("#nameMessage").html(`Không được để trống!`);
			$("#errorMess").html(`Bạn thiếu thông tin về tên sản phẩm! Vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
			return;
		}
		else if ($("#productBasePrice").val() === "") {
			$("#priceMessage").html(`Không được để trống!`);
			$("#errorMess").html(`Bạn thiếu thông tin về giá cơ bản sản phẩm! Vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
			return;
		}
		else if ($("#productDescription").val() === "") {
			$("#desMessage").html(`Không được để trống!`);
			$("#errorMess").html(`Bạn thiếu thông tin về mô tả sản phẩm! Vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
			return;
		}
		else if ($("#productCategory").val() === "") {
			$("#categoryMessage").html(`Bạn phải chọn danh mục!`);
			$("#errorMess").html(`Bạn thiếu thông tin về danh mục sản phẩm! Vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
			return;
		}
		else if ($("#productSupplier").val() === "") {
			$("#supplierMessage").html(`Bạn phải chọn nhà cung cấp!`);
			$("#errorMess").html(`Bạn thiếu thông tin về nhà cung cấp sản phẩm! Vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
			return;
		}
		else if (!checkNotEmpty()) {
			$("#errorMess").html(`Bạn thiếu thông tin về chi tiết sản phẩm! Vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
			return;
		}

		else if (!file) {
			$("#thumbnailMessage").html('Bạn phải chọn ảnh chính sản phẩm!');
			$("#errorMess").html(`Bạn thiếu thông tin ảnh chính sản phẩm! Vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
			return;
		}
		else if (listFiles.length === 0) {
			$("#plusThumbnailMessage").html('Bạn phải chọn ảnh phụ sản phẩm!');
			$("#errorMess").html(`Bạn thiếu thông tin về ảnh phụ sản phẩm! Vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
			return;
		}
		else if(listProductType.length===0){
			$("#errorMess").html(`Bạn chưa thêm phiên bản sản phẩm nào! Vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
			return;
		}
		else if(!checkNotEmptyListTypeColor()){
			$("#errorMess").html(`Bạn chưa thêm màu sản phẩm cho một số phiên bản sản phẩm ! Vui lòng kiểm tra lại!`);
			$("#errorModal").modal('show');
			return;
		}

		var productInfo = {
			"screen": $("#productScreen").val(),
			"cpu": $("#productCpu").val(),
			"gpu": $("#productGpu").val(),
			"weight": $("#productWeight").val(),
			"frontCamera": $("#productFrontCamera").val(),
			"backCamera": $("#productBackCamera").val(),
			"oreraionSystem": $("#productOperatingSystem").val(),
			"battery": $("#productBattery").val()
		}

		var insertProduct = {
			"title": $("#productTitle").val(),
			"productSlug": "",
			"thumbnail": "OK",
			"price": $("#productBasePrice").val(),
			"discount": "35000000",
			"description": $("#productDescription").val(),
			"categoryId": parseInt($("#productCategory").val()),
			"supplierId": parseInt($("#productSupplier").val()),
			"productInfo": productInfo,
			"listThumbnail": [],
			"listProdductType": listProductType
		};


		var formData = new FormData();
		formData.append('file', file);
		formData.append('insertProductRequest', JSON.stringify(insertProduct));

		// Thêm danh sách các file vào FormData
		console.log(listFiles.length);
		for (var j = 0; j < listFiles.length; j++) {
			formData.append('listFile', listFiles[j]);
		}
		$("#overlay").show();
		$.ajax({
			method: "POST",
			url: "http://localhost:8888/api/admin/product/insert",
			data: formData,
			processData: false,  // Không xử lý dữ liệu trước khi gửi
			contentType: false,  // Không đặt header Content-Type, để FormData tự định dạng
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				$("#overlay").hide();
				if (response.success) {
					$("#successModal").modal('show');
					$("#confirmBtn").click(function() {
						window.location.href = '/admin-insert-product';
					});
					$("#dismissBtn").click(function() {
						window.location.href = '/admin-product';
					});
				} else {
					alert('no');
					console.log(response);
				}
			},
			error: function(xhr, status, error) {
				$("#overlay").hide();
				console.log(error);
				console.log(status);
				console.log(xhr);
				//window.location.href = "/403";
			}
		});
	});
});