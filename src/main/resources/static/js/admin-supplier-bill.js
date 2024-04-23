//Token
var vnMobileToken = null;
if (localStorage.getItem('VnMobileToken') !== null) {
	var vnMobileToken = JSON.parse(localStorage.getItem('VnMobileToken'));
	if (vnMobileToken.role === "QUANLI") {
		//baseTable();
	}
	else {
		window.location.href = '/401';
	}
}
else {
	window.location.href = '/401';
}
$(document).ready(function() {

	baseTable(1);

	//Table mo dau trang
	function baseTable(pageNumber) {
		$.ajax({
			method: "GET",
			url: "http://localhost:8888/api/admin/supplier/getbill/" + pageNumber,
			headers: {
				'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
			},
			success: function(response) {
				if (response.success) {
					showTable(response.data);
					console.log(response.pageData);
					$("#pageCount").html(`${response.pageData}`);
					$("#pageNumberCurrent").html(pageNumber);
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
	
	$("#pageNumberPrevious").click(function(){
		var pageCount = $("#pageCount").text();
		var currentPage = $("#pageNumberCurrent").text();
		if(parseInt(currentPage)>1){
			$("#pageNumberCurrent").text(parseInt(currentPage)-1);
			baseTable(parseInt(currentPage)-1);
		}
	});
	
	$("#pageNumberNext").click(function(){
		var pageCount = $("#pageCount").text();
		var currentPage = $("#pageNumberCurrent").text();
		if(parseInt(currentPage)<parseInt(pageCount)){
			$("#pageNumberCurrent").text(parseInt(currentPage)+1);
			baseTable(parseInt(currentPage)+1);
		}
	});
	
	function getDateByTimeStamp(inputTime) {
		const dateObj = new Date(inputTime);
		const day = dateObj.getDate().toString().padStart(2, "0");
		const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần cộng thêm 1
		const year = dateObj.getFullYear();
		const hours = dateObj.getHours().toString().padStart(2, "0");
		const minutes = dateObj.getMinutes().toString().padStart(2, "0");
		const seconds = dateObj.getSeconds().toString().padStart(2, "0");
		const formattedTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
		return formattedTime;
	}


	//Hien table
	function showTable(listBill) {
		var tableHtml = ``;
		$.each(listBill, function(index, value) {
			tableHtml += `<tr>
								<th scope="row">${index + 1}</th>
								<td>#HD000${value.id}</td>
								<td>${value.billTitle}</td>
								<td>${value.supplierName}</td>
								<td>${value.createdBy}</td>
								<td>${getDateByTimeStamp(value.createdAt)}</td>
								<td>${value.totalPrice.toLocaleString('vi-VN')}đ</td>
								<td>${value.description}</td>
								<td>
									<button file-name="${value.description}" class="btn btn-success dowload-file">
										<i class="fa-solid fa-download"></i>
									</button>
									<button file-name="${value.description}" class="btn btn-primary view-file">
										<i class="fa-solid fa-eye"></i>
									</button>
								</td>
						</tr>`
		});
		$("#bodyTable").html(tableHtml);
	}
	
	$(document).on('click', '.dowload-file', function() {
		var filename = $(this).attr('file-name');
		$("#dowloadBillModal").modal('show');
		var url = "http://localhost:8888/api/uploadfile/file/" + filename;
		$("#confirmDơloadBillBtn").click(function(){
			window.location.href= url;
			$("#dowloadBillModal").modal('hide');
		});
	});
});