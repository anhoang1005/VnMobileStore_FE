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
			url: "http://localhost:8888/api/admin/supplier/getall",
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
			tableHtml += `<td>
							<button supplier-id="${value.id}" class="btn btn-success import-product"><i
								class="fa-solid fa-cart-plus"></i></button>
							<button supplier-id="${value.id}" class="btn btn-warning update-supplier"><i
								class="fa-solid fa-pen-to-square"></i></button>
							<button supplier-id="${value.id}" class="btn btn-danger lock-supplier"><i
								class="fa-solid fa-lock"></i></i></button>
							</td>`
			tableHtml += ` </tr>`
		});
		$("#bodyTable").html(tableHtml);
	}


	$("#insertSupplierBtn").click(function() {
		$("#insertSupplierModal").modal('show');
	});
	
	$(document).on('click', '.import-product', function() {
		var supplierId = $(this).attr('supplier-id');
		window.location.href = '/admin-import-supplier' + '?supplier-id=' + supplierId;
	});
	
	$(document).on('click', '.update-supplier', function() {
		var supplierId = $(this).attr('supplier-id');
		$("#updateSupplierModal").modal('show');
		
	});
	
	$(document).on('click', '.lock-supplier', function() {
		//var supplierId = $(this).attr('supplier-id');
		$("#lockModal").modal('show');
	});

	$("#unlockSupplierBtn").click(function() {
		//var supplierId = $(this).attr('supplier-id');
		$("#unlockModal").modal('show');
	});
});