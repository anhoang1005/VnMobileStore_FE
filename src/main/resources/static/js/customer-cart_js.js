$(document).ready(function() {

	function showCartItem(cartStoraged) {
		var cart = [];
		if (localStorage.getItem(cartStoraged) !== null) {
			cart = JSON.parse(localStorage.getItem(cartStoraged));
			if (cart.length > 0) {
				$("#emptyCart").hide();
				$("#cartItemQuantity").html(`Giỏ hàng(${cart.length})`)
				var cartHtml = ``;
				var totalPrice = 0;
				$.each(cart, function(index, value) {
					cartHtml += `<tr>
								<th class="text-center" scope="row">
									<input id="cartItem${value.colorTypeId}" class="check-cartItem" type="checkbox" name="cartItemChecked" value="${value.colorTypeId}" aria-label="Checkbox for following text input">
								</th>
								<th>
									<img style="width: 100px; height: auto" src="${value.thumbnail}" alt="alt" />
								</th>
								<td>
									<strong><span>${value.title}</span></strong>
									<br>
									<span class="mr-2">${value.typeName}GB</span><span>${value.color}</span>
									<div style="display: flex; flex-direction: column;">
										<span class="mt-3"><strong>${value.price.toLocaleString('vi-VN')}đ</strong></span>
									</div>
								</td>
								<td>
									<div class="input-group">
										<div class="input-group-prepend">
											<button minus-id="${value.colorTypeId}" class="btn btn-danger minus-btn" type="button">-</button>
										</div>
										<input id="quantitySubmit${value.stt}" type="number"
											class="form-control quantity-input col-4" name="quantity${value.stt}" min="1" max="10"
											value="${value.quantity}">
										<div class="input-group-append">
											<button plus-id="${value.colorTypeId}" class="btn btn-success plus-btn" type="button">+</button>
										</div>
									</div>
									<br>
								</td>
								<td class="text-center" style="color: red"><strong>${(value.quantity * value.price).toLocaleString('vi-VN')}đ</strong></td>
								<td class="text-center">
									<button deleteCart-id="${value.colorTypeId}" class="btn btn-sm btn-danger deleteCart-btn" data-toggle="modal" data-target="#deleteCartItemModal">
										<i class="fa fa-trash"></i>
									</button>
								</td>
							</tr>

				`;
					totalPrice = BigInt(totalPrice) + BigInt(value.quantity * value.price);
				});

				$("#cartItemColumn").html(cartHtml);

				$("#checkedCartIemquantityd").html(`${cart.length}`);

				$("#cartInMenuQuantity").html(`${cart.length}`);

				$("input[type='checkbox']").prop("checked", true);

				//$("#totalCheckedCart").html(`${totalPrice.toLocaleString('vi-VN')}đ`);
				$("#totalCheckedCart").html(`${getToTalPriceItemChecked(cart).toLocaleString('vi-VN')}đ`);

			}
			else {
				$("#cartItemQuantity").html(`Giỏ hàng(0)`)
				$("#emptyCart").show();
				$("#cartTable").hide();
			}
		}
		else {
			$("#cartItemQuantity").html(`Giỏ hàng(0)`)
			$("#emptyCart").show();
			$("#cartTable").hide();
		}
	}

	function updateCartItemQuantity(typeColorId, value) {
		var cart = [];
		if (localStorage.getItem(cartStoraged) !== null) {
			cart = JSON.parse(localStorage.getItem(cartStoraged));
			//var cartItemChanged = cart.find(item => item.colorTypeId === minusId);
			const index = cart.findIndex(cartItem => cartItem.colorTypeId === parseInt(typeColorId));
			cart[index].quantity = value;
			localStorage.setItem(cartStoraged, JSON.stringify(cart));
			showCartItem(cartStoraged);
			console.log("Ma mau: " + typeColorId + " -> " + " update thanh cong! -> quantity:" + value);
		}
	}

	function deleteCartItem(typeColorId) {
		var cart = [];
		if (localStorage.getItem(cartStoraged) !== null) {
			cart = JSON.parse(localStorage.getItem(cartStoraged));
			const index = cart.findIndex(cartItem => cartItem.colorTypeId === parseInt(typeColorId));
			cart.splice(index, 1);
			localStorage.setItem(cartStoraged, JSON.stringify(cart));
			showCartItem(cartStoraged);
			console.log("Ma mau: " + typeColorId + " -> " + " deelete thanh cong!");
		}
	}

	//Token;
	var vnMobileToken = null;
	if (localStorage.getItem('VnMobileToken') !== null) {
		var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
		var cartStoraged = "vnMobileCart_" + vnMobileToken.email;
		showCartItem(cartStoraged);
		console.log('in thanh cong');
	}
	else {
		window.location.href = '/signin';
	}

	//tang so luong
	$(document).on('click', '.plus-btn', function() {
		var inputField = $(this).parent().prev('.quantity-input');
		var plusId = $(this).attr("plus-id");
		var value = parseInt(inputField.val());
		if (value < 10) {
			inputField.val(value + 1);
			updateCartItemQuantity(plusId, value + 1);
		}
	});

	//giam so luong
	$(document).on('click', '.minus-btn', function() {
		var inputField = $(this).parent().next('.quantity-input');
		var minusId = $(this).attr("minus-id");
		var value = parseInt(inputField.val());
		if (value > 1) {
			inputField.val(value - 1);
			updateCartItemQuantity(minusId, value - 1);
		}

	});

	//XOa 1 phan tu
	$(document).on('click', '.deleteCart-btn', function() {
		var deleteCartColorId = $(this).attr("deleteCart-id");
		$("#deleteCartItemModal").show();
		$("#submitDeleteCartItem").off('click').on('click', function() {
			$("#deleteCartItemModal").modal('hide');
			deleteCartItem(deleteCartColorId);
		});
	});

	//xoa toan bo
	$("#deleteAllCartItem").click(function() {
		cart = [];
		$("#messageConfirm").html(`<i style="color: red" class="fa fa-trash"></i> <strong style="color: red">Bạn có chắc muốn bỏ các sản phẩm đã chọn khỏi giỏ hàng?</strong>`)
		$("#confirmModal").modal('show');
		$("#confirmModalButton").off('click').on('click', function() {
			$("#deleteCartItemModal").modal('hide');
			localStorage.setItem(cartStoraged, JSON.stringify(cart));
			showCartItem(cartStoraged);
			console.log("Xoa thanh cong!");
		});
	});

	//Ấn nút thanh toán
	$(document).on('click', '#checkoutCart', function() {
		if (getCheckedItems().length === 0) {
			$("#exampleModalLabel").html(`Thông báo`);
			$("#messageConfirm").html(`<i style="color: red" class="fa fa-shopping-cart"></i> <strong style="color: red"> Bạn chưa chọn sản phẩm nào trong giỏ hàng!</strong>`)
			$("#confirmModal").modal('show');
			$("#confirmModalButton").off('click').on('click', function() {
				$("#confirmModal").modal('hide');
			});
		}
		else {
			$("#messageConfirm").html(`<i style="color: green" class="fa fa-shopping-cart"></i> <strong style="color: green">Tạo đơn hàng với các mặt hàng đã chọn trong giỏ hàng?</strong>`)
			$("#confirmModal").modal('show');

			$("#confirmModalButton").off('click').on('click', function() {
				$("#deleteCartItemModal").modal('hide');
				console.log(getCheckedItems());
				console.log("Test: tạo đơn hàng thành công -> checkout");
				var confirmCart = [];
				var cart = [];
				cart = JSON.parse(localStorage.getItem(cartStoraged));
				var checkedItems = getCheckedItems();
				$.each(checkedItems, function(index, value) {
					var cartItem = cart.find(item => item.colorTypeId === parseInt(value));
					confirmCart.push(cartItem);
				});
				localStorage.setItem("VNMobileOrderCart_" + vnMobileToken.email, JSON.stringify(confirmCart));
				window.location.href='/create-order';
			});
		}
	});

	// Xử lí nút chọn tất cả
	$("#allCartItemChecked").change(function() {
		var isChecked = $(this).prop("checked");
		// Đặt trạng thái checked cho tất cả các ô input khác
		$("input[type='checkbox']").prop("checked", isChecked);
		if (isChecked == false) {
			$("#totalCheckedCart").html(`0đ`);
		}
		else {
			showCartItem(cartStoraged);
		}
	});

	//Xử lí khi click vào tích 1 checked cart item
	$(document).on('change', '.check-cartItem', function() {
		var isChecked = $(this).prop("checked");
		if (isChecked === false) {
			$("#allCartItemChecked").prop("checked", false);
		}
		var cart = [];
		cart = JSON.parse(localStorage.getItem(cartStoraged));
		$("#totalCheckedCart").html(`${getToTalPriceItemChecked(cart).toLocaleString('vi-VN')}đ`);
		console.log("Tong gia: " + getToTalPriceItemChecked(cart));
		console.log("San pham duoc chon: " + getCheckedItems())
	});

	//Lấy tất cả các cart item được tích chọn
	function getCheckedItems() {
		var checkedItems = []; // Khởi tạo một mảng để lưu trữ các giá trị của các phần tử được kiểm tra
		$(".check-cartItem:checked").each(function() {
			checkedItems.push($(this).val()); // Thêm giá trị của phần tử được kiểm tra vào mảng
		});
		return checkedItems; // Trả về danh sách các giá trị đã được kiểm tra
	}

	//Hàm tính tổng giá của các mặt hàng được tích checked
	function getToTalPriceItemChecked(listCart) {
		var checkedItems = [];
		var totalPrice = 0;
		$(".check-cartItem:checked").each(function() {
			checkedItems.push($(this).val());
		});
		$.each(checkedItems, function(index, value) {
			var cartItem = listCart.find(item => item.colorTypeId === parseInt(value));
			totalPrice = BigInt(totalPrice) + BigInt(cartItem.price * cartItem.quantity);
		});
		return totalPrice;
	}
});