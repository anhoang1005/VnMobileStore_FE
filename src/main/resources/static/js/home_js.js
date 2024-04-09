$(document).ready(function() {
	var pageNumber = 1;
	$.ajax({
		method: "GET",
		url: "http://localhost:8888/api/product/getall/" + pageNumber,
		success: function(response) {
			if (response.success) {
				$.each(response.data, function(index, value) {
					var html = `
						<div class="col-12 col-md-6 col-lg-4 mb-3" onmouseover="this.style.transform = 'scale(1.03)'"
						onmouseout="this.style.transform = 'scale(1)'" style="transition: 0.3s">
						<a href="/detail/${value.productSlug}/${value.listType[0].room.toString()}">
							<div style="border: 1px solid #CCC" class="card my-border">
								<div class="d-flex justify-content-center align-items-center">
									<div style="border: 3px solid red; border-radius: 10px; border-top: none;width: 95%">
										<img style="width: 100%; height: auto"
											src="/img/khuyenmai.jpg"
											alt="Card image cap">
										<center><img class="card-img-top" style="position: relative; width: 80%; height: auto"
											src="${value.thumbnail}"
											alt="Card image cap"></center>
										<div class="bg-danger" style="position: absolute; top: 36%; left: -2%; width: 120px; height: 22px; border-radius: 5px" >
											<p class="text-white ml-2" style="font-size: 0.8em">
												Giảm ${(value.listType[0].discount-value.listType[0].price).toLocaleString('vi-VN')}đ
											</p>
										</div>
										<div class="bg-danger" style="position: absolute; top: 31%; left: -2%; width: 60px; height: 22px; border-radius: 5px" >
											<p class="text-white ml-2" style="font-size: 0.8em">
												${value.ratingStar.toFixed(1)} <i style="color: orange" class="fa-solid fa-star"></i>
											</p>
										</div>
									</div>
								</div>
								<div class="card-body">
									<h4 class="card-title" style="font-size: 1em">
										<a href="#" title="View Product">${value.title}</a>
									</h4>
									<center>
										<div class="d-flex mb-2">`;
					$.each(value.listType, function(index1, value1) {
						if (index1 === 0) {
							html += `<button style="font-size: 0.7em; border-top: 1px" class="btn btn-dark flex-fill">
											${value1.room} GB
									 </button>`;
						}
						else {
							html += `<button style="font-size: 0.7em; border-top: 1px" class="btn btn-light flex-fill">
											${value1.room} GB
									 </button>`;
						}
					});


					html += `</div>
									</center>
									<div style="display: flex; justify-content: space-between;">
										<p class="mb-2" style="text-align: left; font-size: 1.1em; margin: 0; color: red">
											<strong>${value.price.toLocaleString('vi-VN')}đ</strong>
										</p>
										<p style="text-align: right; font-size: 1em; margin: 0;">
											<span style="text-decoration: line-through;">${value.discount.toLocaleString('vi-VN')}đ</span>
										</p>
									</div>
									<p class="card-text" style="font-size: 0.7em">
										<i class="fa-solid fa-microchip"></i> ${value.productInfo.cpu}
										<i style="margin-left: 5px;" class="fa-solid fa-mobile-screen"></i> ${value.productInfo.screen.substr(0, 9)}
									</p>
									<p class="card-text" style="font-size: 0.7em">
										<i class="fa-solid fa-memory"></i> ${value.listType[0].ram} GB
										<i style="margin-left: 5px;" class="fa-solid fa-hard-drive"></i> ${value.listType[0].room} GB
										<i style="margin-left: 5px;" class="fa-solid fa-robot"></i> ${value.productInfo.operatingSystem}
									</p>
									<div class="d-flex mb-3">
										<div class="avatar-container mr-2"
											style="width: 50px; height: 50px; overflow: hidden; border-radius: 50%; border: 1px solid #CCC">
											<img class="avatar"
												style="width: 100%; height: auto; object-fit: cover;" src="https://cdn.bio.link/uploads/profile_pictures/2023-08-09/ZCXnagobVPlSSCAOrumGbLsEQI1KPYsq.png" alt="Avatar">
										</div>
										<div class="avatar-container mr-2"
											style="width: 50px; height: 50px; overflow: hidden; border-radius: 50%; border: 1px solid #CCC">
											<img class="avatar"
												style="width: 100%; height: auto; object-fit: cover;" src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png">
										</div>
										<div class="avatar-container mr-2"
											style="width: 50px; height: 50px; overflow: hidden; border-radius: 50%; border: 1px solid #CCC">
											<img class="avatar"
												style="width: 100%; height: auto; object-fit: cover;" src="https://play-lh.googleusercontent.com/oPEbg7Lgj98vzT9qmq9sOiY-t6IR_frAY-ON7KHOBMqQpt_qxDQmom8lCWlNM1cJIIZ2">
										</div>
									</div>
									<button id="submitLogin" class="btn btn-danger btn-block">
										MUA NGAY
									</button>
								</div>
							</div>
						</a>
					</div>
					`;
					$("#rowItems").append(html);
				});
			} else {
				window.location.href = "/403";
			}
		},
		error: function(xhr, status, error) {
			window.location.href = "/404";
			console.error(xhr.responseText);
			console.log('Đã xảy ra lỗi khi gửi yêu cầu.' + status + error);
			document.getElementById('loginMessage').innerHTML = 'Lỗi Server!';
		}
	});
});