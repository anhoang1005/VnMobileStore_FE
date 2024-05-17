$(document).ready(function() {
	orderChart(" ", " ");
	
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
});