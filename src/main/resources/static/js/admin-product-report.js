$(document).ready(function() {

	orderChart(" ", " ");
	saleChart(" ", " ");

	function orderChart(listLabels, listData) {
		const ctxSale = document.getElementById("categoryChart").getContext('2d');
		const myChartSale = new Chart(ctxSale, {
			type: 'bar',
			data: {
				labels: ["APPLE", "SAMSUNG", "VIVO", "NOKIA", "OPPO", "REALME", "XIAOMI"],
				datasets: [{
					label: 'Số lượt xem',
					backgroundColor: '#0074D9',
					borderColor: 'rgb(47, 128, 237)',
					data: [1000, 900, 200, 500, 800, 900, 200, 300, 500, 400, 200, 145],
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
		const ctxOrder = document.getElementById("productChart").getContext('2d');
		const myChart2 = new Chart(ctxOrder, {
			type: 'bar',
			data: {
				labels: ["APPLE", "SAMSUNG", "VIVO", "NOKIA", "OPPO", "REALME", "XIAOMI"],
				datasets: [{
					label: 'Số đánh giá',
					backgroundColor: '#009900',
					borderColor: 'rgb(47, 128, 237)',
					data: [100, 92, 75, 34, 50, 83, 44, 33, 37, 64, 71, 64],
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

	const ctx = document.getElementById("1Chart").getContext('2d');
	const myChart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: ["rice", "yam", "tomato", "potato",
				"beans", "maize", "oil"],
			datasets: [{
				label: 'food Items',
				backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00"],
				data: [30, 40, 20, 50, 80, 90, 20],
			}]
		},
	});

	const ctx1 = document.getElementById("2Chart").getContext('2d');
	const myChart1 = new Chart(ctx1, {
		type: 'doughnut',
		data: {
			labels: ["rice", "yam", "tomato", "potato", "beans",
				"maize", "oil"],
			datasets: [{
				label: 'food Items',
				data: [30, 40, 20, 50, 80, 90, 20],
				backgroundColor: ["#0074D9", "#FF4136", "#2ECC40",
					"#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00",
					"#001f3f", "#39CCCC", "#01FF70", "#85144b",
					"#F012BE", "#3D9970", "#111111", "#AAAAAA"]
			}]
		},
	});
});