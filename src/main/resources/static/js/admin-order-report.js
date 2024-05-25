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
	
	let saleChartInstance = null;
    let orderChartInstance = null;
	
	async function getProductDetailAll() {
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/report/getOrderall",
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
			});
			if (response.success) {
				return response.data;
			} else {
				alert('khong co ket qua!');
			}
		} catch (error) {
			alert('loi');
		}
	}

	async function getProductDetailOn10Year() {
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/report/getSaleOrderOn10YearNear",
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
			});
			if (response.success) {
				return response.data;
			} else {
				alert('khong co ket qua!')
			}
		} catch (error) {
			alert('loi');
		}
	}
	
	async function getProductDetailQuaterByYear(year) {
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/report/getOrderQuater",
				data: {
					year: year
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
			});
			if (response.success) {
				return response.data;
			} else {
				alert('khong co ket qua!')
			}
		} catch (error) {
			alert('loi');
		}
	}

	async function getProductDetailMonthByYear(year) {
		try {
			let response = await $.ajax({
				method: "GET",
				url: "http://localhost:8888/api/admin/report/getSaleOrderOnYear",
				data: {
					year: year
				},
				headers: {
					'Authorization': vnMobileToken.tokenType + ' ' + vnMobileToken.token
				},
			});
			if (response.success) {
				return response.data;
			} else {
				alert('khong co ket qua!')
			}
		} catch (error) {
			alert('loi');
		}
	}

	(async function() {
		var today = new Date();
		var year = today.getFullYear();
		var saleOrder = await getProductDetailMonthByYear(year);
		showChart(saleOrder);
	})();

	$("#yearChange").change(async function() {
		var yearChange = $(this).val();
		var reportChage = $("#reportChange").val();
		if(reportChage === "3"){
			var saleOrderMonth = await getProductDetailMonthByYear(yearChange);
			showChart(saleOrderMonth);
		}else{
			var saleOrderQuater = await getProductDetailQuaterByYear(yearChange);
			var labelsQuater = [];
			var totalPriceQuater = [];
			var totalCountQuater = [];
			for(var i = 0; i<saleOrderQuater.length; i++){
				labelsQuater.push(saleOrderQuater[i][0]);
				totalPriceQuater.push(saleOrderQuater[i][1]);
				totalCountQuater.push(saleOrderQuater[i][2]);
			}
			saleChart(labelsQuater, totalPriceQuater);
			orderChart(labelsQuater, totalCountQuater);
			$("#yearReport").show();
		}
	});

	$("#reportChange").change(async function() {
		var reportChange = $(this).val();
		if (reportChange === "0") {
			console.log('Year changed to:', reportChange);
			var report10Year = await getProductDetailOn10Year();
			var labels = [];
			var totalPrice = [];
			var totalCount = [];
			for(var i = 0; i<report10Year.length; i++){
				labels.push(report10Year[i][0]);
				totalPrice.push(report10Year[i][1]);
				totalCount.push(report10Year[i][2]);
			}
			saleChart(labels, totalPrice);
			orderChart(labels, totalCount);
			$("#yearReport").hide();
		} else if(reportChange === "1"){
			var saleOrderAll = await getProductDetailAll();
			var labelsAll = [];
			var totalPriceAll = [];
			var totalCountAll = [];
			for(var i = 0; i<saleOrderAll.length; i++){
				labelsAll.push(saleOrderAll[i][0]);
				totalPriceAll.push(saleOrderAll[i][1]);
				totalCountAll.push(saleOrderAll[i][2]);
			}
			saleChart(labelsAll, totalPriceAll);
			orderChart(labelsAll, totalCountAll);
			$("#yearReport").hide();
		} else if(reportChange === "2"){
			var today = new Date();
			var year = today.getFullYear();
			var saleOrderQuaterYear = await getProductDetailQuaterByYear(year);
			var labelsQuater = [];
			var totalPriceQuater = [];
			var totalCountQuater = [];
			for(var i = 0; i<saleOrderQuaterYear.length; i++){
				labelsQuater.push(saleOrderQuaterYear[i][0]);
				totalPriceQuater.push(saleOrderQuaterYear[i][1]);
				totalCountQuater.push(saleOrderQuaterYear[i][2]);
			}
			saleChart(labelsQuater, totalPriceQuater);
			orderChart(labelsQuater, totalCountQuater);
			$("#yearReport").show();
		} else if (reportChange === "3") {
			var today = new Date();
			var year = today.getFullYear();
			var saleOrderMonthYear = await getProductDetailMonthByYear(year);
			showChart(saleOrderMonthYear);
			$("#yearReport").show();
		} 
	});

	function showChart(saleOrder) {
		var saleValue = [];
		var totalOrderValue = [];
		var labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
		for (var i = 0; i < saleOrder.length; i++) {
			saleValue.push(saleOrder[i].revenue);
			totalOrderValue.push(saleOrder[i].totalOrders);
		}
		saleChart(labels, saleValue);
		orderChart(labels, totalOrderValue);
	}

	function orderChart(listLabels, listData) {
		if (orderChartInstance) {
            orderChartInstance.destroy();
        }
		const ctxSale = document.getElementById("orderChart").getContext('2d');
		orderChartInstance = new Chart(ctxSale, {
			type: 'bar',
			data: {
				labels: listLabels,
				datasets: [{
					label: 'Số đơn hàng',
					backgroundColor: '#0074D9',
					borderColor: 'rgb(47, 128, 237)',
					data: listData,
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
						}
					}]
				}
			},
		});
	}

	function saleChart(listLabels, listData) {
		if (saleChartInstance) {
            saleChartInstance.destroy();
        }
		const ctxOrder = document.getElementById("saleChart").getContext('2d');
		saleChartInstance = new Chart(ctxOrder, {
			type: 'line',
			data: {
				labels: listLabels,
				datasets: [{
					label: 'Doanh thu',
					backgroundColor: 'rgba(161, 198, 247, 1)',
					borderColor: 'rgb(47, 128, 237)',
					data: listData,
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
						}
					}]
				}
			},
		});
	}

});