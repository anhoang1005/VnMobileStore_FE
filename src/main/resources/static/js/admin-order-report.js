$(document).ready(function() {

	orderChart(" ", " ");
	saleChart(" ", " ");

	function orderChart(listLabels, listData) {
		const ctxSale = document.getElementById("orderChart").getContext('2d');
		const myChartSale = new Chart(ctxSale, {
			type: 'bar',
			data: {
				labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
				datasets: [{
					label: 'Số đơn hàng',
					backgroundColor: '#0074D9',
					borderColor: 'rgb(47, 128, 237)',
					data: [300, 400, 200, 500, 800, 900, 200, 300, 500, 1000, 20, 145],
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
		const ctxOrder = document.getElementById("saleChart").getContext('2d');
		const myChart2 = new Chart(ctxOrder, {
			type: 'line',
			data: {
				labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
				datasets: [{
					label: 'Doanh thu',
					backgroundColor: 'rgba(161, 198, 247, 1)',
					borderColor: 'rgb(47, 128, 237)',
					data: [3000000000, 4000000000, 2000000000, 5000000000, 8000000000, 9000000000, 2000000000, 3000000000, 5000000000, 10000000000, 200000000, 1450000000],
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