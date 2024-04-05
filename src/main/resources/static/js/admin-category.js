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
								<td>img</td>
								<td>${value.categoryName}</td>
								<td>${value.desciption}</td>
								<td>
									<button class="btn btn-success"><i class="fa-solid fa-pen-to-square"></i></button>
									<button class="btn btn-danger"><i class="fa-solid fa-trash"></i></i></button>
								</td>
							</tr>`;
		});
		$("#bodyTable").html(tableHtml);
	}
});