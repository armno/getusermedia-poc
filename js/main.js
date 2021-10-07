function run() {
	console.log("running");
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices
			.getUserMedia({ video: {} })
			.then((stream) => {
				const videoElement = document.querySelector("#inputVideo");
				videoElement.srcObject = stream;
			})
			.catch((e) => {
				console.log(e);
				document.querySelector("#error-message").innerText = e;
			});
	} else {
		console.warn("getUserMedia() is not supported");
		document.querySelector("#error-message").innerText =
			"getUserMedia() is not supported";
	}
}

run();
