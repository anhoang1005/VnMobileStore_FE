$(document).ready(function() {
	//Token
	var vnMobileToken = null;
	if (localStorage.getItem('VnMobileToken') !== null) {
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
		if (vnMobileToken.role === "QUANLI") {
			showListBill();
			getSupplier();
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

	//Nha cung cap
	function getSupplier() {
		var supplierId = getUrlParam();
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/supplier/getById/" + supplierId,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					$("#supplierNameChoose").html(`${response.data.supplierName}`);
					$("#supplierName").val(`${response.data.supplierName}`);
					$("#supplierName").attr('disabled', true);
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

	function showListBill() {
		var vnMobileBill = [];
		if (localStorage.getItem('vnMobileBill') !== null) {
			vnMobileBill = JSON.parse(localStorage.getItem('vnMobileBill'));
			$("#cartItemQuantity").html(`Hóa đơn (${vnMobileBill.length})`)
			$("#checkedCartIemquantity").html(`${vnMobileBill.length}`);
			$("#createdBillPerson").val(`${vnMobileToken.fullName}`);
			$("#createdBillPerson").attr('disabled', true);
		}
		var cartHtml = ``;
		var totalPrice = 0;
		$.each(vnMobileBill, function(index, value) {
			cartHtml += `<tr>
								<th class="text-center" scope="row">
									<input id="cartItem${index}" class="check-cartItem" type="checkbox" name="cartItemChecked" value="${index}" aria-label="Checkbox for following text input">
								</th>
								<th>
									<img style="width: 100px; height: auto" src="${value.thumbnail}" alt="alt" />
								</th>
								
							</tr>

				`;
			totalPrice = BigInt(totalPrice) + BigInt(value.quantity * value.type.basePrice);
		});
		$("#cartItemColumn").html(cartHtml);
	}
});