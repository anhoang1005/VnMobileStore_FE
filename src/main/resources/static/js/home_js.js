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
								<img class="card-img-top position-relative"
									src="${value.thumbnail}"
									alt="Card image cap">
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
										<p style="text-align: left; font-size: 1.1em; margin: 0; color: red">
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
				window.location.href="/403";
			}
		},
		error: function(xhr, status, error) {
			window.location.href="/404";
			console.error(xhr.responseText);
			console.log('Đã xảy ra lỗi khi gửi yêu cầu.' + status + error);
			document.getElementById('loginMessage').innerHTML = 'Lỗi Server!';
		}
	});
});