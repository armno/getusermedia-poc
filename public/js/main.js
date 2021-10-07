const startButton = document.querySelector("#start-button");
const stopButton = document.querySelector("#stop-button");
startButton.addEventListener("click", function () {
	run();
	startButton.classList.add("hidden");
	stopButton.classList.remove("hidden");
});

function run() {
	console.log("running");
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices
			.getUserMedia({
				video: {
					aspectRatio: {
						ideal: 1,
					},
				},
				audio: true,
			})
			.then((stream) => {
				const videoElement = document.querySelector("#inputVideo");
				videoElement.srcObject = stream;

				const mediaRecorder = new MediaRecorder(stream);
				const recoredButton = document.querySelector("#record");
				const recordedVideoElement = document.querySelector("#recorded-video");
				const outputElement = document.querySelector("#output");
				let chunks = [];

				recoredButton.addEventListener("click", function () {
					if (mediaRecorder.state === "recording") {
						mediaRecorder.stop();
						recoredButton.classList.remove("bg-red-500");
						recoredButton.classList.remove("animate-pulse");
						recoredButton.classList.add("bg-white");
						return;
					}

					mediaRecorder.start();
					console.log(mediaRecorder.state);
					recoredButton.classList.remove("bg-white");
					recoredButton.classList.add("bg-red-500");
					recoredButton.classList.add("animate-pulse");
				});

				mediaRecorder.onstart = function () {
					outputElement.classList.add("hidden");
					recordedVideoElement.src = null;
				};

				mediaRecorder.ondataavailable = function (e) {
					chunks.push(e.data);
				};

				mediaRecorder.onstop = function (e) {
					console.log(chunks);
					const blob = new Blob(chunks, { type: "video/mp4" });
					chunks = [];
					const videoUrl = window.URL.createObjectURL(blob);
					recordedVideoElement.src = videoUrl;
					outputElement.classList.remove("hidden");
				};

				stopButton.addEventListener("click", function () {
					startButton.classList.remove("hidden");
					stopButton.classList.add("hidden");
					stream.getTracks().forEach((t) => t.stop());

					outputElement.classList.add("hidden");
					recordedVideoElement.src = null;
				});
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
