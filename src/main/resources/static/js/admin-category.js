$(document).ready(function() {

	//Token
	var vnMobileToken = null;
	if (localStorage.getItem('VnMobileToken') !== null) {
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
		if (vnMobileToken.role === "QUANLI") {
			baseTable();
		}
		else {
			window.location.href = '/401';
		}
	}
	else {
		window.location.href = '/401';
	}

	//Table mo dau trang
	function baseTable() {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/category/getall",
			success: function(response) {
				//console.log(response);
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
	function showTable(listCategory) {
		var tableHtml = ``;
		$.each(listCategory, function(index, value) {
			tableHtml += `<tr>
								<th scope="row">
									<input class="form-check-input" type="checkbox" value="" id="category${value.id}">
								</th>
								<td>#C000${value.id}</td>
								<td>
									<img src="${value.images}" class="img-fluid" alt="Responsive image">
								</td>
								<td>${value.categoryName}</td>
								<td>${value.desciption}</td>
								`;
			if (value.deleted === false) {
				tableHtml += `<td>
									<button category-id="${value.id}" class="btn btn-success btn-sm col-sm-4 update-btn"><i class="fa-solid fa-pen-to-square"></i></button>
									<button category-id="${value.id}" class="btn btn-warning btn-sm col-sm-4 unlock-btn"><i class="fa-solid fa-reply"></i></button>
								</td>`;
			} else {
				tableHtml += `<td>
									<button category-id="${value.id}" class="btn btn-success btn-sm col-sm-4 update-btn"><i class="fa-solid fa-pen-to-square"></i></button>
									<button category-id="${value.id}" class="btn btn-danger btn-sm col-sm-4 lock-btn"><i class="fa-solid fa-trash"></i></button>
								</td>`;
			}
			tableHtml += `</tr>`;
		});
		$("#bodyTable").html(tableHtml);
	}

	//An them hang
	$("#insertCategoryBtn").click(function() {
		$("#insertCategoryModal").modal('show');
		$("#desMessage").html('');
		$("#imageMessage").html('');
		$("#nameMessage").html('');
		$("#category-name").val('');
		$("#message-text").val('');
		$("#category-image").val('');
	});

	//An Xac nhan them hang
	$("#submitInsertCategory").off('click').on('click', function() {
		var categoryName = $("#category-name").val();
		var file = $("#category-image")[0].files[0];
		var desCategory = $("#message-text").val();
		if (categoryName === "") {
			$("#desMessage").html('');
			$("#imageMessage").html('');
			$("#nameMessage").html('');
			$("#nameMessage").html('Tên hãng không được để trống');
			return
		}
		else if (desCategory === "") {
			$("#desMessage").html('');
			$("#imageMessage").html('');
			$("#nameMessage").html('');
			$("#desMessage").html('Mô tả không được để trống');
			return
		}
		else if (!file) {
			$("#desMessage").html('');
			$("#imageMessage").html('');
			$("#nameMessage").html('');
			$("#imageMessage").html('Ảnh không được để trống');
			return
		}
		console.log(file.name);
		$.ajax({
			method: "POST",
			url: "http://localhost:8888/api/admin/category/insert",
			data: JSON.stringify({
				categoryName: categoryName,
				images: file.name,
				desciption: desCategory
			}),
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			contentType: 'application/json',
			success: function(response) {
				$("#insertCategoryModal").modal('hide');
				if (response.success) {
					$("#category-name").val('');
					$("#message-text").val('');
					$("#confirmMess").html('<i style="color: green" class="fa-regular fa-circle-check"></i> Thêm hãng thành công!')
					$("#confirmModal").modal('show');
					baseTable();
				} else {
					$("#confirmMess").html('<i style="color: red" class="fa-regular fa-circle-xmark"></i> Thêm hãng thất bại!')
					$("#confirmModal").modal('show');
				}
			},
			error: function(xhr, status, error) {
				console.log(error);
				window.location.href = "/403";
			}
		});
	});

	//An nut sua danh muc
	$(document).on('click', '.update-btn', function() {
		var categoryId = $(this).attr('category-id');
		$("#hidden-id").val(categoryId);
		$("#updateCategoryModal").modal('show');
		$("#upDesMessage").html('');
		$("#upImageMessage").html('');
		$("#upNameMessage").html('');
		$("#upcategory-name").val('');
		$("#upmessage-text").val('');
		$("#upcategory-image").val('');
	});
	$("#submitUpdateCategory").off('click').on('click', function() {
		var upCategoryId = $("#hidden-id").val();
		console.log(upCategoryId);
		var upCategoryName = $("#upcategory-name").val();
		var upCategoryImages = $("#upcategory-image")[0].files[0];
		var upCategoryDes = $("#upmessage-text").val();
		if (upCategoryName === "") {
			$("#upDesMessage").html('');
			$("#upImageMessage").html('');
			$("#upNameMessage").html('');
			$("#upNameMessage").html('Tên hãng không được để trống');
			return
		}
		else if (upCategoryDes === "") {
			$("#upDesMessage").html('');
			$("#upImageMessage").html('');
			$("#upNameMessage").html('');
			$("#upDesMessage").html('Mô tả không được để trống');
			return
		}
		else if (!upCategoryImages) {
			$("#upDesMessage").html('');
			$("#upImageMessage").html('');
			$("#upNameMessage").html('');
			$("#upImageMessage").html('Ảnh không được để trống');
			return
		}

		$.ajax({
			method: "POST",
			url: "http://localhost:8888/api/admin/category/update",
			data: JSON.stringify({
				id: upCategoryId,
				categoryName: upCategoryName,
				images: upCategoryImages.name,
				desciption: upCategoryDes,
				deleted: true
			}),
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			contentType: 'application/json',
			success: function(response) {
				$("#updateCategoryModal").modal('hide');
				if (response.success) {
					$("#confirmMess").html('<i style="color: green" class="fa-regular fa-circle-check"></i> Cập nhật hãng thành công!')
					$("#confirmModal").modal('show');
					baseTable();
				} else {
					$("#confirmMess").html('<i style="color: red" class="fa-regular fa-circle-xmark"></i> Cập nhật hãng thất bại!')
					$("#confirmModal").modal('show');
				}
			},
			error: function(xhr, status, error) {
				console.log(error);
				window.location.href = "/403";
			}
		});
	});

	//Khoa danh muc
	$(document).on('click', '.lock-btn', function() {
		var deletedId = $(this).attr('category-id');
		console.log(deletedId);
		$("#deleteModal").modal('show');
		$("#deleted-id").val(deletedId);
	});
	$("#confirmDeleteBtn").off('click').on('click', function() {
		var deletedId = $("#deleted-id").val();
		console.log(deletedId);
		$.ajax({
			method: "POST",
			url: "http://localhost:8888/api/admin/category/status",
			data: {
				id: deletedId,
				deleted: false
			},
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				$("#deleteModal").modal('hide');
				if (response.success) {
					$("#confirmMess").html('<i style="color: green" class="fa-regular fa-circle-check"></i> Khóa hãng thành công!')
					$("#confirmModal").modal('show');
					baseTable();
				} else {
					$("#confirmMess").html('<i style="color: red" class="fa-regular fa-circle-xmark"></i> Khóa hãng thất bại!')
					$("#confirmModal").modal('show');
				}
			},
			error: function(xhr, status, error) {
				console.log(error);
				//window.location.href = "/403";
			}
		});
	});

	//Mo Khoa danh muc
	$(document).on('click', '.unlock-btn', function() {
		var undeletedId = $(this).attr('category-id');
		$("#undeleteModal").modal('show');
		$("#undeleted-id").val(undeletedId);
	});
	$("#confirmUnLockDeleteBtn").off('click').on('click', function() {
		var undeletedId = $("#undeleted-id").val();
		console.log(undeletedId);
		$.ajax({
			method: "POST",
			url: "http://localhost:8888/api/admin/category/status",
			data: {
				id: undeletedId,
				deleted: true
			},
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				$("#undeleteModal").modal('hide');
				if (response.success) {
					$("#confirmMess").html('<i style="color: green" class="fa-regular fa-circle-check"></i> Mở khóa hãng thành công!')
					$("#confirmModal").modal('show');
					baseTable();
				} else {
					$("#confirmMess").html('<i style="color: red" class="fa-regular fa-circle-xmark"></i>Mở khóa hãng thất bại!')
					$("#confirmModal").modal('show');
				}
			},
			error: function(xhr, status, error) {
				console.log(error);
				//window.location.href = "/403";
			}
		});
	});



	$("#confirmBtn").click(function() {
		$("#confirmModal").modal('hide');
	});

});