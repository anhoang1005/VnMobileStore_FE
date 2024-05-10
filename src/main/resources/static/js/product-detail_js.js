$(document).ready(function() {
	//Get slug va version
	var currentUrl = window.location.href;
	console.log(currentUrl);
	var parts = currentUrl.split("/");
	var slug = parts[parts.length - 2];
	var version = parts[parts.length - 1];
	console.log(slug);
	console.log(version);

	//Load page bar
	$('html, body').animate({
		scrollTop: $('#productNoId').offset().top
	}, 'slow');

	// Minus Pluss quantity
	$('.plus-btn').click(function() {
		var inputField = $(this).parent().prev('.quantity-input');
		var value = parseInt(inputField.val());
		inputField.val(value + 1);
	});

	$('.minus-btn').click(function() {
		var inputField = $(this).parent().next('.quantity-input');
		var value = parseInt(inputField.val());
		if (value > 1) {
			inputField.val(value - 1);
		}
	});

	//Add TO Cart
	function addToCart(productCart, username) {
		let cart = [];
		var cartStoraged = "vnMobileCart_" + username;

		if (localStorage.getItem(cartStoraged) !== null) {
			cart = JSON.parse(localStorage.getItem(cartStoraged));
		}

		let existingProductIndex = cart.findIndex(item => item.colorTypeId === productCart.colorTypeId);
		if (existingProductIndex !== -1) {
			cart[existingProductIndex].quantity += parseInt(productCart.quantity);
		} else {
			productCart.stt = cart.length + 1;
			productCart.quantity = parseInt(productCart.quantity);
			cart.push(productCart);
		}
		localStorage.setItem(cartStoraged, JSON.stringify(cart));
	}


	//Token JWT
	var vnMobileToken = null;
	if (localStorage.getItem('VnMobileToken') !== null) {
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
	}
	console.log(vnMobileToken);


	//Product Detail
	$.ajax({
		method: "GET",
		url: "http://localhost:8888/api/product/detail/" + slug,
		success: function(response) {
			if (response.success) {
				document.getElementById('productSlugNav').innerHTML = response.data.title; //Thanh menu
				document.title = response.data.title; //Page title
				$("#productThumbnail").attr("src", response.data.thumbnail);
				$("#productNoId").html(`(No.0000${response.data.id})`); //Product Id
				$("#productTitle").html(`<strong>${response.data.title}</strong>`); //Product Title
				$("#productPrice").html(`${response.data.price.toLocaleString('vi-VN')}đ`); //Product Price version
				$("#productDiscount").html(`${response.data.discount.toLocaleString('vi-VN')}đ`); //Product Discount Version
				$("#productDescription").html(`${response.data.description}`)
				$("#productScreen").html(`${response.data.productInfo.screen}`);
				$("#productBackCamera").html(`${response.data.productInfo.backCamera}`);
				$("#productFrontCamera").html(`${response.data.productInfo.frontCamera}`);
				$("#productCpu").html(`${response.data.productInfo.cpu}`);
				$("#productGpu").html(`${response.data.productInfo.gpu}`);
				$("#productBattery").html(`${response.data.productInfo.battery}`);
				$("#productSystem").html(`${response.data.productInfo.operatingSystem}`);
				$("#productWeight").html(`${response.data.productInfo.weight}`);

				$("#customScreen").html(`<i class="fa-solid fa-mobile-screen"></i> ${response.data.productInfo.screen}`);
				$("#customBackCamera").html(`<i class="fa-solid fa-video"></i> ${response.data.productInfo.backCamera}`);
				$("#customFrontCamera").html(`<i class="fa-solid fa-camera"></i> ${response.data.productInfo.frontCamera}`);
				$("#customCpu").html(`<i class="fa-solid fa-microchip"></i> ${response.data.productInfo.cpu}`);
				$("#customRom").html(`<i class="fa-solid fa-hard-drive"></i> ${response.data.productInfo.operatingSystem}`);

				var integerStar = Math.floor(response.data.ratingStar);
				var decimalStar = response.data.ratingStar - integerStar;
				var html = ``;
				for (var i = 1; i <= integerStar; i++) {
					html += `<i style="color: orange" class="fa-solid fa-star"></i>`;
				}
				if (decimalStar !== 0) {
					html += `<i class="fa-solid fa-star-half" style="color: orange;"></i>`;
					for (var i = 1; i <= 5 - 1 - integerStar; i++) {
						html += `<i style="color: #CCC" class="fa-solid fa-star"></i>`;
					}
				}
				else {
					for (var i = 1; i <= 5 - integerStar; i++) {
						html += `<i style="color: #CCC" class="fa-solid fa-star"></i>`;
					}
				}
				html += `(${response.data.ratingStar.toFixed(1)}) | ${response.data.listReview} đánh giá`;
				$("#productRateStar").html(html);
				$("#reviewRateStar").html(`${response.data.ratingStar.toFixed(1)}`);
				$("#reviewComment").html(`${response.data.listReview} đánh giá`);

				//Type da chon
				var typeProduct = response.data.listType.find(type => type.room == version); //Type Product
				$("#productPrice").html(`${typeProduct.price.toLocaleString('vi-VN')}đ`); //Product Price version
				$("#productDiscount").html(`${typeProduct.discount.toLocaleString('vi-VN')}đ`); //Product Discount Version
				$("#productRam").html(`${typeProduct.ram} GB`);
				$("#productRoom").html(`${typeProduct.room} GB`);
				//list Product Type
				var typeHtml = ``;
				$.each(response.data.listType, function(index, value) {
					typeHtml += `<input type="radio" class="btn-check" name="versionOption${value.id}" id="versionOption${value.id}"
									autocomplete="off" value="${value.id}">
								<label class="btn btn-outline-success col-sm-3" for="versionOption${value.id}">${value.room} GB</label>`;
				});
				$("#formVersion").append(typeHtml);
				$("#versionOption" + typeProduct.id).prop("checked", true);
				$("#formVersion input[type='radio']").change(function() {
					var selectedTypeId = $(this).val();
					var selectedType = response.data.listType.find(type => type.id == selectedTypeId);
					console.log(selectedType.room);
					window.location.href = "/detail/" + slug + "/" + selectedType.room;
					// Di chuyển trình duyệt đến phần tử có id là "productVersion" bằng jQuery
				});

				//list Color Type
				var colorHtml = ``;
				$.each(typeProduct.listTypeColor, function(index, value) {
					colorHtml += `<input type="radio" class="btn-check" name="colorOptions" id="colorOption${value.id}"
									autocomplete="off" value="${value.id}">
								 <label id="colorLabel${value.id}" style="background-color: ${value.color}; border-color: black; width: 30px; height: 30px; border-radius: 50%" class="btn checked-custom mr-2 col-sm-1" for="colorOption${value.id}"></label>`;
				});
				$("#formColor").append(colorHtml);
				$("#colorOption" + typeProduct.listTypeColor[0].id).prop("checked", true);
				$("#soldQuantity").html(`<i style="color: green" class="fa-solid fa-circle-check"></i> <strong>Đã bán:</strong> ${typeProduct.listTypeColor[0].soldQuantity}`);
				$("#inventoryQuantity").html(`<i style="color: green" class="fa-solid fa-circle-check"></i> <strong>Tồn kho:</strong> ${typeProduct.listTypeColor[0].inventoryQuantity}`);
				$("#formColor input[type='radio']").change(function() {
					var selectedColorId = $(this).val();
					//$("#formColor input[type='radio']").prop('checked', false);
					var selectedColor = typeProduct.listTypeColor.find(type => type.id == selectedColorId);
					$("#soldQuantity").html(`<i style="color: green" class="fa-solid fa-circle-check"></i> <strong>Đã bán:</strong> ${selectedColor.soldQuantity}`);
					$("#inventoryQuantity").html(`<i style="color: green" class="fa-solid fa-circle-check"></i> <strong>Tồn kho:</strong> ${selectedColor.inventoryQuantity}`);
					console.log(selectedColor.color);
				});

				$("#addToCartBtn").on("click", function() {
					var selectedColorSubmit = $("#formColor input[type='radio']:checked").val();
					var selectedTypeSubmit = $("#formVersion input[type='radio']:checked").val();
					var productColor = typeProduct.listTypeColor.find(color => color.id == selectedColorSubmit);
					var quantitySubmit = $("#quantitySubmit").val();
					if (vnMobileToken === null) {
						$("#messageConfirm").html(`<i style="color: red" class="fa-solid fa-circle-xmark"></i> <strong> Bạn phải đăng nhập mới sử dụng được giỏ hàng!</strong>`);
						$("#confirmModal").modal('show');
					}
					else {
						const productCartItem = {
							"stt": 0,
							"productSlug": slug,
							"title": response.data.title,
							"thumbnail": response.data.thumbnail,
							"productTypeId": parseInt(selectedTypeSubmit),
							"colorTypeId": parseInt(selectedColorSubmit),
							"typeName": parseInt(typeProduct.room),
							"color": productColor.color,
							"weight": parseInt(response.data.productInfo.weight),
							"price": typeProduct.price,
							"quantity": quantitySubmit
						}
						addToCart(productCartItem, vnMobileToken.email);
						console.log("Mau sac:" + parseInt(selectedColorSubmit));
						$("#addCartSuccessModal").modal('show');
					}
				});
			} else {
				alert('thất bại');
			}
		},
		error: function(xhr, status, error) {
			alert('lỗi server!')
			console.error(xhr.responseText);
			console.log('Đã xảy ra lỗi khi gửi yêu cầu.' + status + error);
		}
	});


	//Review
	var pageNumber = 1;
	$.ajax({
		method: "GET",
		url: "http://localhost:8888/api/review/getbySlug/" + slug + "/" + pageNumber,
		success: function(responseReview) {
			if (responseReview.success) {
				if (vnMobileToken !== null) {
					var myReview = responseReview.data.find(review => review.username == vnMobileToken.email);
					if (myReview === undefined) {
						var reviewHtml = `
							<div class="card-body">
                                <p class="card-text">
                                	<div class="d-flex align-items-center">
										<div class="avatar-container"
											style="width: 35px; height: 35px; overflow: hidden; border-radius: 50%;">
											<img id="userAvatar" class="avatar"
												style="width: 100%; height: 100%; object-fit: cover;" src="${vnMobileToken.avatar}" alt="Avatar">
										</div>
										<span class="ml-1"><strong>${vnMobileToken.fullName}(${vnMobileToken.role.toLowerCase()})</strong></span>
									</div>
                                </p>
                                <p class="card-text">
                                    <span>Bạn chưa đánh giá cho sản phẩm này!</span>
                                    <br>
                                <p class="d-flex justify-content-between align-items-center">
                                    <!--<span><a href=""><i class="fa-solid fa-thumbs-up"></i>10</a></span>-->
                                    <span class="ml-auto">
                                        <button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#insertReviewModal">
											Thêm đánh giá
										</button>
                                    </span>
                                </p>
                                </p>
                            </div>
                            <hr style="margin-top:-2%; margin-bottom: -1%" class="bg-dark d-inline-block mx-auto w-100">
						`;
						$("#productReview").append(reviewHtml);

						//Insert review
						$("#submitInsertReview").on("click", function() {
							var insertStar = $("#insert_rating").val();
							var insertComment = $("#insert_comment").val();

							$.ajax({
								method: "POST",
								url: "http://localhost:8888/api/customer/review/insert",
								data: JSON.stringify({
									productSlug: slug,
									username: vnMobileToken.email,
									ratingStar: insertStar,
									comment: insertComment
								}),
								contentType: 'application/json',
								headers: {
									'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
								},
								success: function(response) {
									if (response.success) {
										$('#insertReviewModal').modal('hide');
										$("successMessage").html(`Thành công!`);
										$("#successConfirm").html(`Đánh giá của bạn đã được thêm thành công! Cảm ơn bạn đã đưa ra đánh giá về sản phẩm của chúng tôi!`);
										$("#successModal").modal('show');
										$("#successBtn").on("click", function() {
											window.location.reload();
										});
									} else {
										$('#insertReviewModal').modal('hide');
										$("#messageConfirm").html(`<i style="color: red" class="fa-solid fa-circle-xmark"></i> <strong>Thêm đánh giá không thành công!</strong>`);
										$("#confirmModal").modal('show');
										$("#confirmButton").on("click", function() {
											window.location.reload();
										});
									}
								},
								error: function(xhr, status, error) {
									$('#insertReviewModal').modal('hide');
									$("#messageConfirm").html(`<i style="color: red" class="fa-solid fa-circle-xmark"></i> <strong>Thêm đánh giá thất bại (403)!</strong>`);
									$("#confirmModal").modal('show');
									$("#confirmButton").on("click", function() {
										window.location.reload();
									});
									console.log('Đã xảy ra lỗi khi gửi yêu cầu (403). ' + status + error);
								}
							});
						});
					}
					else {
						var myReviewHtml = `
								<div class="card-body">
                                    <p class="card-text">
                                        <div class="d-flex align-items-center">
											<div class="avatar-container"
												style="width: 35px; height: 35px; overflow: hidden; border-radius: 50%;">
												<img id="userAvatar" class="avatar"
													style="width: 100%; height: 100%; object-fit: cover;" src="${myReview.avatar}" alt="Avatar">
											</div>
											<span class="ml-1"><strong>${myReview.fullName}(Me)</strong></span>
										</div>
                                    <p style="font-size: 0.8em mt-2">`;
						for (var i = 1; i <= myReview.rateStar; i++) {
							myReviewHtml += `<i style="color: orange" class="fa fa-star"></i>`;
						}
						for (var i = 1; i <= 5 - myReview.rateStar; i++) {
							myReviewHtml += ` <i style="color: #CCC" class="fa fa-star"></i>`;
						}

						myReviewHtml += ` <span style="font-size: 0.8em"><i class="fa-regular fa-clock"></i> ${myReview.createdAt}</span>
                                    </p>
                                    </p>
                                    <p class="card-text">
                                        <span>${myReview.comment}</span>
                                        <br>
                                    <p class="d-flex justify-content-between align-items-center">
                                        <span><a href=""><i class="fa-solid fa-thumbs-up"></i> Thích (${myReview.like})</a></span>
                                        <span class="ml-auto">
											<button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#updateReviewModal">
												Sửa đánh giá
											</button>
                                        	<button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#deleteReviewModal">
												Xóa đánh giá
											</button>
                                    	</span>
                                    </p>
                                    </p>
                                </div>
                                <hr style="margin-top:-2%; margin-bottom: -1%" class="bg-dark d-inline-block mx-auto w-100">
							`;
						$("#productReview").append(myReviewHtml);

						//Update Review
						$("#submitUpdateReview").on("click", function() {
							var updateStar = $("#update_rating").val();
							var updateComment = $("#update_comment").val();
							$.ajax({
								method: "POST",
								url: "http://localhost:8888/api/customer/review/update",
								data: JSON.stringify({
									id: myReview.reviewId,
									productSlug: slug,
									username: vnMobileToken.email,
									ratingStar: updateStar,
									comment: updateComment
								}),
								contentType: 'application/json',
								headers: {
									'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
								},
								success: function(response) {
									if (response.success) {
										$('#updateReviewModal').modal('hide');
										$("successMessage").html(`Thành công!`);
										$("#successConfirm").html(`Sửa đánh giá thành công!`);
										$("#successModal").modal('show');
										$("#successBtn").on("click", function() {
											window.location.reload();
										});
									} else {
										$('#updateReviewModal').modal('hide');
										$("#messageConfirm").html(`<i style="color: red" class="fa-solid fa-circle-xmark"></i> <strong> Sửa đánh giá thất bại!</strong>`);
										$("#confirmModal").modal('show');
										$("#confirmButton").on("click", function() {
											window.location.reload();
										});
									}
								},
								error: function(xhr, status, error) {
									$('#updateReviewModal').modal('hide');
									$("#messageConfirm").html(`<i style="color: red" class="fa-solid fa-circle-xmark"></i> <strong> Sửa đánh giá thất bại (403)!</strong>`);
									$("#confirmModal").modal('show');
									$("#confirmButton").on("click", function() {
										window.location.reload();
									});
									console.error(xhr.responseText);
									console.log('Đã xảy ra lỗi khi gửi yêu cầu.' + status + error);
								}
							});
						});

						//Delete Review
						$("#submitDeleteReview").on("click", function() {
							console.log('Xoa: ' + myReview.reviewId);
							$.ajax({
								method: "DELETE",
								url: "http://localhost:8888/api/customer/review/delete",
								data: {
									id: myReview.reviewId,
								},
								headers: {
									'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
								},
								success: function(response) {
									//console.log(response);
									if (response.success) {
										window.location.reload();
									} else {
										window.location.reload();
									}
								},
								error: function(xhr, status, error) {
									$('#deleteReviewModal').modal('hide');
									$("#messageConfirm").html(`<i style="color: red" class="fa-solid fa-circle-xmark"></i> Xóa đánh giá thất bại (403)!</strong>`);
									$("#confirmModal").modal('show');
									$("#confirmButton").on("click", function() {
										window.location.reload();
									});
									console.log('Đã xảy ra lỗi khi gửi yêu cầu.' + status + error);
								}
							});
						});
					}
				}
				else {
					var customReviewHtml = `
							<div class="card-body">
                                <p class="card-text">
                                    <span>Bạn phải đăng nhập để đánh giá sản phẩm!</span>
                                    <br>
                                <p class="d-flex justify-content-between align-items-center">
                                    <!--<span><a href=""><i class="fa-solid fa-thumbs-up"></i>10</a></span>-->
                                    <span class="ml-auto">
                                        <a id="customReviewLogin" href="/signin" class="btn btn-sm btn-success" data-toggle="modal">Đăng nhập</a>
                                    </span>
                                </p>
                                </p>
                            </div>
                            <hr style="margin-top:-2%; margin-bottom: -1%" class="bg-dark d-inline-block mx-auto w-100">
						`;
					$("#productReview").append(customReviewHtml);
					$("#customReviewLogin").on("click", function() {
						window.location.href = "/signin";
					});
				}
				var userReviewHtml = ``;
				$.each(responseReview.data, function(index, value) {
					userReviewHtml += `
								<div class="card-body">
                                    <p class="card-text">
                                        <div class="d-flex align-items-center">
											<div class="avatar-container"
												style="width: 35px; height: 35px; overflow: hidden; border-radius: 50%;">
												<img id="userAvatar" class="avatar"
													style="width: 100%; height: 100%; object-fit: cover;" src="${value.avatar}" alt="Avatar">
											</div>
											<span class="ml-1"><strong>${value.fullName}(Me)</strong></span>
										</div>
                                    <p>`;
					for (var i = 1; i <= value.rateStar; i++) {
						userReviewHtml += `<i style="color: orange" class="fa fa-star"></i>`;
					}
					for (var i = 1; i <= 5 - value.rateStar; i++) {
						userReviewHtml += ` <i style="color: #CCC" class="fa fa-star"></i>`;
					}

					userReviewHtml += ` <span style="font-size: 0.8em"><i class="fa-regular fa-clock"></i> ${value.createdAt}</span>
                                    </p>
                                    </p>
                                    <p class="card-text">
                                        <span>${value.comment}</span>
                                        <br>
                                    <p class="d-flex justify-content-between align-items-center">
                                        <span><a href=""><i class="fa-solid fa-thumbs-up"></i> Thích (${value.like})</a></span>
                                    </p>
                                    </p>
                                </div>
                                <hr style="margin-top:-2%; margin-bottom: -1%" class="bg-light d-inline-block mx-auto w-100">
							`;
				});
				$("#productReview").append(userReviewHtml);
			} else {
				window.location.href = '/403';
			}
		},
		error: function(xhr, status, error) {
			window.location.href = '/404';
			console.error(xhr.responseText);
			console.log('Đã xảy ra lỗi khi gửi yêu cầu.' + status + error);
		}
	});

	$('a[star-cnt]').click(function() {
		var selectedStarCnt = parseInt($(this).attr('star-cnt')); // Lấy giá trị star-cnt
		$('a[star-cnt]').each(function() {
			var starCnt = parseInt($(this).attr('star-cnt'));
			var starColor = starCnt <= selectedStarCnt ? 'orange' : 'grey'; // Chọn màu cho sao
			$(this).find('i').css('color', starColor); // Thay đổi màu của sao
		});
		
		$("#insert_rating").val(selectedStarCnt);
	});
	
	$('a[upstar-cnt]').click(function() {
		var selectedStarCnt = parseInt($(this).attr('upstar-cnt')); // Lấy giá trị star-cnt
		$('a[upstar-cnt]').each(function() {
			var starCnt = parseInt($(this).attr('upstar-cnt'));
			var starColor = starCnt <= selectedStarCnt ? 'orange' : 'grey'; // Chọn màu cho sao
			$(this).find('i').css('color', starColor); // Thay đổi màu của sao
		});
		
		$("#update_rating").val(selectedStarCnt);
	});

});