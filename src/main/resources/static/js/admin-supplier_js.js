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
			url: "http://localhost:8888/api/admin/supplier",
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
	function showTable(listSupplier) {
		var tableHtml = ``;
		$.each(listSupplier, function(index, value) {
			tableHtml += `<tr>
							<th scope="row">
								<input class="form-check-input" type="checkbox" value=""
								id="flexCheckDefault">
							</th>
							<td>#A0000${value.id}</td>
							<td>${value.supplierName}</td>
							<td>${value.email}</td>
							<td>${value.phoneNumber}</td>
							<td>${value.adress}</td>`;
			//if (value.deleted === true) {
			//tableHtml += `<td>
			//<button account-id="${value.id}" class="btn btn-success update-account"><i class="fa-solid fa-pen-to-square"></i></button>
			//<button account-id="${value.id}" class="btn btn-danger lock-account"><i class="fa-solid fa-lock"></i></button>
			//</td>`
			//}
			//else {
			//tableHtml += `<td>
			//<button account-id="${value.id}" class="btn btn-success update-account"><i class="fa-solid fa-pen-to-square"></i></button>
			//<button account-id="${value.id}" class="btn btn-warning unlock-account"><i class="fa-solid fa-unlock"></i></button>
			//</td>`
			//}
			if (value.deleted === true) {
				tableHtml += `<td>
							<button supplier-id="${value.id}" supplier-deleted="${value.deleted}" class="btn btn-success import-product"><i
								class="fa-solid fa-cart-plus"></i></button>
							<button supplier-id="${value.id}" class="btn btn-primary update-supplier"><i
								class="fa-solid fa-pen-to-square"></i></button>
							<button supplier-id="${value.id}" class="btn btn-danger lock-supplier"><i
								class="fa-solid fa-lock"></i></i></button>
							</td>`
			}
			else {
				tableHtml += `<td>
							<button supplier-id="${value.id}" supplier-deleted="${value.deleted}" class="btn btn-success import-product"><i
								class="fa-solid fa-cart-plus"></i></button>
							<button supplier-id="${value.id}" class="btn btn-primary update-supplier"><i
								class="fa-solid fa-pen-to-square"></i></button>
							<button supplier-id="${value.id}" class="btn btn-warning unlock-supplier"><i
								class="fa-solid fa-unlock"></i></i></button>
							</td>`
			}

			tableHtml += ` </tr>`
		});
		$("#bodyTable").html(tableHtml);
	}

	$(document).on('click', '.import-product', function() {
		var supplierId = $(this).attr('supplier-id');
		var supplierStatus = $(this).attr('supplier-deleted');
		if(supplierStatus === 'true'){
			window.location.href = '/admin-import-product' + '?supplier-id=' + supplierId;
		}
		else{
			$("#confirmMess").html(`<i style="color: red" class="fa-solid fa-circle-xmark"></i> Nhà cung cấp này đã bị khóa! Không thể nhập hàng!`);
			$("#confirmModal").modal('show');
		}
	});

	//Insert Supplier
	$("#insertSupplierBtn").click(function() {
		$("#insertSupplierModal").modal('show');
		$("#supplier-name").val(``);
		$("#supplier-phonenumber").val(``);
		$("#supplier-email").val(``);
		$("#supplier-adress").val(``);
		$("#supplier-des").val(``);
		$("#submitInsertSupplier").click(function() {
			var supplierName = $("#supplier-name").val();
			var supplierPhoneNumer = $("#supplier-phonenumber").val();
			var supplierEmail = $("#supplier-email").val();
			var supplierAdress = $("#supplier-adress").val();
			var supplierDes = $("#supplier-des").val();
			if (supplierName === "") {
				$("#upnameMessage").html(`Tên không được trống!`);
				return;
			}
			else if (supplierPhoneNumer === "") {
				$("#upphoneNumberMessage").html(`Số điện thoại không được trống!`);
				return;
			}
			else if (supplierEmail === "") {
				$("#upemailMessage").html(`Email không được để trống!`);
				return;
			}
			else if (supplierAdress === "") {
				$("#upadressMessage").html(`Địa chỉ không được làm trống!`);
				return;
			}
			else if (supplierAdress === "") {
				supplierDes = "Không có mô tả";
			}
			else {
				$.ajax({
					method: "POST",
					url: "http://localhost:8888/api/admin/supplier",
					data: JSON.stringify({
						supplierName: supplierName,
						phoneNumber: supplierPhoneNumer,
						email: supplierEmail,
						adress: supplierAdress,
						description: supplierDes
					}),
					headers: {
						'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token,
						'Content-Type': 'application/json' // Thêm Content-Type header
					},
					success: function(response) {
						$("#insertSupplierModal").modal('hide');
						if (response.success) {
							baseTable();
							$("#confirmMess").html(`<i style="color: green" class="fa-solid fa-circle-check"></i> Thêm nhà cung cấp thành công!`);
							$("#confirmModal").modal('show');
						} else {
							baseTable();
							$("#confirmMess").html(`<i style="color: red" class="fa-solid fa-circle-xmark"></i> Thêm nhà cung cấp thất bại!`);
							$("#confirmModal").modal('show');
						}
					},
					error: function(xhr, status, error) {
						$("#overlay").hide();
						window.location.href = "/403";
					}
				});
			}
		});

	});

	//Update Supplier
	$(document).on('click', '.update-supplier', function() {
		var supplierId = $(this).attr('supplier-id');
		$("#update-supplier-name").val(``);
		$("#update-supplier-phonenumber").val(``);
		$("#update-supplier-email").val(``);
		$("#update-supplier-adress").val(``);
		$("#update-supplier-des").val(``);
		$("#updateSupplierModal").modal('show');
		$("#submitUpdateSupplier").click(function() {
			var supplierName = $("#update-supplier-name").val();
			var supplierPhoneNumer = $("#update-supplier-phonenumber").val();
			var supplierEmail = $("#update-supplier-email").val();
			var supplierAdress = $("#update-supplier-adress").val();
			var supplierDes = $("#update-supplier-des").val();
			if (supplierName === "") {
				$("#upnameMessage").html(`Tên không được trống!`);
				return;
			}
			else if (supplierPhoneNumer === "") {
				$("#upphoneNumberMessage").html(`Số điện thoại không được trống!`);
				return;
			}
			else if (supplierEmail === "") {
				$("#upemailMessage").html(`Email không được để trống!`);
				return;
			}
			else if (supplierAdress === "") {
				$("#upadressMessage").html(`Địa chỉ không được làm trống!`);
				return;
			}
			else if (supplierAdress === "") {
				supplierDes = "Không có mô tả";
			}
			else {

				$.ajax({
					method: "PUT",
					url: "http://localhost:8888/api/admin/supplier",
					data: JSON.stringify({
						id: supplierId,
						supplierName: supplierName,
						phoneNumber: supplierPhoneNumer,
						email: supplierEmail,
						adress: supplierAdress,
						description: supplierDes
					}),
					headers: {
						'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token,
						'Content-Type': 'application/json' // Thêm Content-Type header
					},
					success: function(response) {
						$("#updateSupplierModal").modal('hide');
						if (response.success) {
							baseTable();
							$("#confirmMess").html(`<i style="color: green" class="fa-solid fa-circle-check"></i> Sửa nhà cung cấp thành công!`);
							$("#confirmModal").modal('show');
						} else {
							baseTable();
							$("#confirmMess").html(`<i style="color: red" class="fa-solid fa-circle-xmark"></i> Sửa nhà cung cấp thất bại!`);
							$("#confirmModal").modal('show');
						}
					},
					error: function(xhr, status, error) {
						$("#overlay").hide();
						window.location.href = "/403";
					}
				});


			}
		});
	});

	$(document).on('click', '.lock-supplier', function() {
		var supplierId = $(this).attr('supplier-id');
		$("#lockModal").modal('show');
		$("#confirmLockBtn").click(function() {
			$.ajax({
				method: "DELETE",
				url: "http://localhost:8888/api/admin/supplier",
				data: {
					id: supplierId,
					deleted: false
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token,
				},
				success: function(response) {
					$("#lockModal").modal('hide');
					if (response.success) {
						baseTable();
						$("#confirmMess").html(`<i style="color: green" class="fa-solid fa-circle-check"></i> Khóa nhà cung cấp thành công!`);
						$("#confirmModal").modal('show');
					} else {
						baseTable();
						$("#confirmMess").html(`<i style="color: red" class="fa-solid fa-circle-xmark"></i> Khóa nhà cung cấp thất bại!`);
						$("#confirmModal").modal('show');
					}
				},
				error: function(xhr, status, error) {
					$("#overlay").hide();
					window.location.href = "/403";
				}
			});
		});
	});

	$(document).on('click', '.unlock-supplier', function() {
		var supplierId = $(this).attr('supplier-id');
		$("#unlockModal").modal('show');
		$("#confirmUnLockBtn").click(function() {
			$.ajax({
				method: "DELETE",
				url: "http://localhost:8888/api/admin/supplier",
				data: {
					id: supplierId,
					deleted: true
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token,
				},
				success: function(response) {
					$("#unlockModal").modal('hide');
					if (response.success) {
						baseTable();
						$("#confirmMess").html(`<i style="color: green" class="fa-solid fa-circle-check"></i> Mở khóa nhà cung cấp thành công!`);
						$("#confirmModal").modal('show');
					} else {
						baseTable();
						$("#confirmMess").html(`<i style="color: red" class="fa-solid fa-circle-xmark"></i> Mở khóa nhà cung cấp thất bại!`);
						$("#confirmModal").modal('show');
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