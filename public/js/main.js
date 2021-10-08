const startButton = document.querySelector("#start-button");
const stopButton = document.querySelector("#stop-button");
startButton.addEventListener("click", function () {
	run();
	startButton.classList.add("hidden");
	stopButton.classList.remove("hidden");
});

const enableVideo = document.querySelector("#enable-video");
enableVideo.addEventListener("change", function (ev) {
	if (this.checked) {
		startButton.innerText = "Start camera + microphone";
	} else {
		startButton.innerText = "Start microphone";
	}
});

function showMusicFile() {
	const music = document.querySelector("#music");
	const audioFile = document.querySelector("#music-file");
	audioFile.volume = 0.2;
	music.classList.remove("hidden");
	music.classList.add("flex");
}

function hideMusicFile() {
	const music = document.querySelector("#music");
	music.classList.remove("flex");
	music.classList.add("hidden");
}

function startMusic() {
	const audioFile = document.querySelector("#music-file");
	audioFile.currentTime = 0;
	audioFile.play();
}

function stopMusic() {
	const audioFile = document.querySelector("#music-file");
	audioFile.pause();
}

function run() {
	console.log("running");
	let options;
	let blobType;
	let outputMediaElement;
	if (enableVideo.checked) {
		options = {
			video: {
				aspectRatio: {
					ideal: 1,
				},
			},
			audio: true,
		};
		blobType = { type: "video/mp4" };
		outputMediaElement = document.querySelector("#recorded-video");
	} else {
		options = {
			video: false,
			audio: true,
		};
		blobType = { type: "audio/mp4" };
		outputMediaElement = document.querySelector("#recorded-voice");
	}

	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices
			.getUserMedia(options)
			.then((stream) => {
				if (enableVideo.checked) {
					const videoElement = document.querySelector("#inputVideo");
					videoElement.srcObject = stream;
				}

				const mediaRecorder = new MediaRecorder(stream);
				const recoredButton = document.querySelector("#record");
				const outputElement = document.querySelector("#output");
				let chunks = [];

				showMusicFile();

				recoredButton.addEventListener("click", function () {
					stream.getTracks().forEach((t) => (t.enabled = true));
					if (mediaRecorder.state === "recording") {
						mediaRecorder.stop();
						stopMusic();
						recoredButton.classList.remove("bg-red-500");
						recoredButton.classList.remove("animate-pulse");
						recoredButton.classList.add("bg-white");
						return;
					}

					console.log("recorder state:", mediaRecorder.state);

					mediaRecorder.start();
					startMusic();
					recoredButton.classList.remove("bg-white");
					recoredButton.classList.add("bg-red-500");
					recoredButton.classList.add("animate-pulse");
				});

				mediaRecorder.onstart = function () {
					outputElement.classList.add("hidden");
					outputMediaElement.src = null;
				};

				mediaRecorder.ondataavailable = function (e) {
					chunks.push(e.data);
				};

				mediaRecorder.onstop = function (e) {
					console.log("recorder state:", mediaRecorder.state);
					const blob = new Blob(chunks, blobType);
					chunks = [];
					const mediaURL = window.URL.createObjectURL(blob);
					outputMediaElement.src = mediaURL;
					outputElement.classList.remove("hidden");

					outputMediaElement.classList.remove("hidden");
				};

				stopButton.addEventListener("click", function () {
					startButton.classList.remove("hidden");
					stopButton.classList.add("hidden");
					stream.getTracks().forEach((t) => t.stop());

					outputElement.classList.add("hidden");
					outputMediaElement.src = null;
					hideMusicFile();
				});

				outputMediaElement.addEventListener("play", function () {
					stream.getTracks().forEach((t) => (t.enabled = false));
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
