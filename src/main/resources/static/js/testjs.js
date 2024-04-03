$.ajax({
	method: "GET",
	url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime",
	data: {
		from_district_id: 1542,
		from_ward_code: awda,
		to_district_id: to_districtId,
		to_ward_code: to_wardCode,
		service_id: serviceId
	},
	headers: {
		'ShopId': "4949314",
		'token': "b8262cb5-dfc9-11ee-a2c1-ca2feb4b63fa"
	},
	success: function(response) {
		if (response.message === "Success") {
			callback(response.data);
		} else {
			console.log('get thanh pho that bai!');
			callback(null);
		}
	},
	error: function(xhr, status, error) {
		console.log('Loi server!');
		callback(null);
		window.location.href = "/403";
	}
});
