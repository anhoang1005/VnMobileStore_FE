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
					var categoryHtml = `<option value="INVALID" selected>--Danh mục--</option>`;
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
					var supplierHtml = `<option value="INVALID" selected>--Nhà cung cấp--</option>`;
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




	var productInfo = {};
	var listThumbnail = [];
	var listProductType = [];
	var listTypeColor = [];

	$("#cancelInsertProduct").click(function() {
		window.location.href = '/admin-product';
	});

	$("#submitInsertProduct").click(function() {
		$("#productTitle").val();
		$("#productBasePrice").val();
		$("#productDescription").val();
		$("#productCategory").val();
		$("#productSupplier").val();
	});


	var insertProduct = {
		"title": "sAn PhaM  144",
		"productSlug": "",
		"thumbnail": "OK",
		"price": 34000000,
		"discount": "35000000",
		"description": "mo ta san pham 1",
		"categoryId": 2,
		"supplierId": 1,
		"productInfo": {
			"screen": "6.67",
			"cpu": "Apple 17",
			"gpu": "Apple 17",
			"weight": 200,
			"frontCamera": "12MP",
			"backCamera": "64MP",
			"oreraionSystem": "Android 13",
			"battery": "5000"
		},
		"listThumbnail": [],
		"listProdductType": [
			{
				"ram": 8,
				"room": 256,
				"price": 25000000,
				"discount": 27000000,
				"basePrice": 23000000,
				"listTypeColor": [
					{
						"color": "black",
						"soldQuantity": 0,
						"inventoryQuantity": 24
					},
					{
						"color": "blue",
						"soldQuantity": 1,
						"inventoryQuantity": 22
					}
				]
			}
		]
	};

	$("#submitInsertProduct").click(function() {
		var fileInput = $("#productThumbail")[0];
		file = fileInput.files[0];
		
		if (!file) {
			return;
		}
		else if (listFiles.length===0) {
			return
		}

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
					alert('ok');
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