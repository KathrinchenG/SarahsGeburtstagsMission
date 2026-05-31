const riddles = window.RIDDLES || [];
const introSlides = window.INTRO_SLIDES || [];
const outroSlides = [
	{
		image: "assets/images/outro/Outro_1.jpg",
		speaker: "",
		text: "Du hast alle Erinnerungen gefunden.",
		showConfetti: false,
		showMissionTitle: false,
		nextButton: "Weiter"
	},
	{
		image: "assets/images/outro/Outro_2.jpg",
		speaker: "Professor Layton",
		text: "Herzlichen Glückwunsch, Sarah!\nIch wusste, dass nur du dieses Abenteuer meistern kannst!",
		showConfetti: true,
		showMissionTitle: true,
		nextButton: "Spiel neu starten"
	}
];

const STORAGE_KEY = "detective-riddle-progress-v2";
const GAME_COMPLETED_KEY = "gameCompleted";

const ui = {
	welcomeCard: document.getElementById("welcomeCard"),
	introSequenceCard: document.getElementById("introSequenceCard"),
	missionCard: document.getElementById("missionCard"),
	completeCard: document.getElementById("completeCard"),
	outroCard: document.getElementById("outroCard"),
	outroImage: document.getElementById("outroImage"),
	outroSpeaker: document.getElementById("outroSpeaker"),
	outroText: document.getElementById("outroText"),
	outroMissionTitle: document.getElementById("outroMissionTitle"),
	outroNextBtn: document.getElementById("outroNextBtn"),
	outroRestartBtn: document.getElementById("outroRestartBtn"),
	outroConfetti: document.getElementById("outroConfetti"),
	introSlideImage: document.getElementById("introSlideImage"),
	introNextBtn: document.getElementById("introNextBtn"),
	startBtn: document.getElementById("startBtn"),
	riddleResetBtn: document.getElementById("riddleResetBtn"),
	resetBtn: document.getElementById("resetBtn"),
	playAgainBtn: document.getElementById("playAgainBtn"),
	riddleNumber: document.getElementById("riddleNumber"),
	stationTitle: document.getElementById("stationTitle"),
	stationSubtitle: document.getElementById("stationSubtitle"),
	pikaratBadge: document.getElementById("pikaratBadge"),
	progressText: document.getElementById("progressText"),
	progressBar: document.getElementById("progressBar"),
	introText: document.getElementById("introText"),
	riddleText: document.getElementById("riddleText"),
	answerLabel: document.getElementById("answerLabel"),
	answerInput: document.getElementById("answerInput"),
	checkAnswerBtn: document.getElementById("checkAnswerBtn"),
	feedback: document.getElementById("feedback"),
	passwordPanel: document.getElementById("passwordPanel"),
	passwordInput: document.getElementById("passwordInput"),
	unlockBtn: document.getElementById("unlockBtn"),
	locationHint: document.getElementById("locationHint"),
	crosswordArea: document.getElementById("crosswordArea"),
	crosswordGrid: document.getElementById("crosswordGrid"),
	extractWordBtn: document.getElementById("extractWordBtn"),
	cluesArea: document.getElementById("cluesArea"),
	acrossList: document.getElementById("acrossList"),
	downList: document.getElementById("downList"),
	closingQuote: document.getElementById("closingQuote"),
	textCodeContent: document.getElementById("textCodeContent"),
	audioPuzzleArea: document.getElementById("audioPuzzleArea"),
	audioTrackList: document.getElementById("audioTrackList"),
	audioWordSlots: document.getElementById("audioWordSlots"),
	mcPuzzleArea: document.getElementById("mcPuzzleArea"),
	mcQuestionList: document.getElementById("mcQuestionList"),
	mcWordSlots: document.getElementById("mcWordSlots"),
	mcHelperText: document.getElementById("mcHelperText"),
	logicSeatingArea: document.getElementById("logicSeatingArea"),
	logicHintList: document.getElementById("logicHintList"),
	logicSeatGrid: document.getElementById("logicSeatGrid"),
	clockPuzzleArea: document.getElementById("clockPuzzleArea"),
	clockPuzzleGrid: document.getElementById("clockPuzzleGrid"),
	clockFinalHint: document.getElementById("clockFinalHint"),
	clockFinalSlots: document.getElementById("clockFinalSlots")
};

const state = {
	started: false,
	currentStation: 0,
	solvedCurrent: false,
	introSlideIndex: 0,
	stationDrafts: {},
	gameCompleted: false,
	outroSlideIndex: 0
};

let activeCrosswordInputs = [];
let audioLetterInputs = [];
let mcSelectedLetters = [];
let mcSelectedAnswerIndexes = [];
let logicSelectRefs = [];
let clockWordInputs = [];
let completionTimer = null;
let outroTypingTimer = null;

function scrollToTop() {
	const runScroll = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Run after DOM updates are painted so Safari/Chrome apply smooth scrolling reliably.
	if (typeof window.requestAnimationFrame === "function") {
		window.requestAnimationFrame(() => {
			window.requestAnimationFrame(runScroll);
		});
		return;
	}

	setTimeout(runScroll, 0);
}

function normalize(value) {
	return value
		.toLowerCase()
		.trim()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]/g, "");
}

function saveProgress() {
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			started: state.started,
			currentStation: state.currentStation,
			solvedCurrent: state.solvedCurrent,
			introSlideIndex: state.introSlideIndex,
			stationDrafts: state.stationDrafts,
			gameCompleted: state.gameCompleted,
			outroSlideIndex: state.outroSlideIndex
		})
	);
}

function loadProgress() {
	try {
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
		if (!saved) {
			return;
		}
		if (typeof saved.currentStation === "number") {
			state.currentStation = Math.min(Math.max(saved.currentStation, 0), riddles.length);
		}
		state.started = Boolean(saved.started);
		state.solvedCurrent = Boolean(saved.solvedCurrent);
		if (typeof saved.introSlideIndex === "number") {
			state.introSlideIndex = Math.max(saved.introSlideIndex, 0);
		}
		if (saved.stationDrafts && typeof saved.stationDrafts === "object") {
			state.stationDrafts = saved.stationDrafts;
		}
		state.gameCompleted = Boolean(saved.gameCompleted) || localStorage.getItem(GAME_COMPLETED_KEY) === "true";
		if (typeof saved.outroSlideIndex === "number") {
			state.outroSlideIndex = Math.max(saved.outroSlideIndex, 0);
		}
	} catch {
		localStorage.removeItem(STORAGE_KEY);
	}
}

function clearCompletionTimer() {
	if (!completionTimer) {
		return;
	}
	clearTimeout(completionTimer);
	completionTimer = null;
}

function scheduleCompletion(action, delay) {
	clearCompletionTimer();
	completionTimer = setTimeout(() => {
		completionTimer = null;
		action();
	}, delay);
}

function clearOutroTypingTimer() {
	if (!outroTypingTimer) {
		return;
	}
	clearTimeout(outroTypingTimer);
	outroTypingTimer = null;
}

function typeOutroText(text) {
	clearOutroTypingTimer();
	ui.outroText.textContent = "";
	const chars = String(text || "").split("");
	let index = 0;

	const step = () => {
		if (index >= chars.length) {
			outroTypingTimer = null;
			return;
		}
		ui.outroText.textContent += chars[index];
		index += 1;
		outroTypingTimer = setTimeout(step, 16);
	};

	step();
}

function renderOutroConfetti(enabled) {
	ui.outroConfetti.innerHTML = "";
	if (!enabled) {
		ui.outroConfetti.classList.add("hidden");
		return;
	}

	for (let index = 0; index < 24; index += 1) {
		const piece = document.createElement("span");
		piece.className = "confetti-piece";
		piece.style.setProperty("--confetti-x", `${(index * 31) % 100}%`);
		piece.style.setProperty("--confetti-delay", `${(index % 8) * 120}ms`);
		piece.style.setProperty("--confetti-rotate", `${(index * 27) % 360}deg`);
		ui.outroConfetti.appendChild(piece);
	}

	ui.outroConfetti.classList.remove("hidden");
}

function renderOutroSequence() {
	const slide = outroSlides[Math.min(state.outroSlideIndex, outroSlides.length - 1)] || outroSlides[0];

	ui.introSequenceCard.classList.add("hidden");
	ui.welcomeCard.classList.add("hidden");
	ui.missionCard.classList.add("hidden");
	ui.completeCard.classList.add("hidden");
	ui.outroCard.classList.remove("hidden");

	ui.outroImage.src = slide.image;
	ui.outroImage.alt = `Outro Szene ${Math.min(state.outroSlideIndex + 1, outroSlides.length)}`;
	ui.outroImage.classList.remove("outro-image-fade");
	void ui.outroImage.offsetWidth;
	ui.outroImage.classList.add("outro-image-fade");

	if (slide.speaker) {
		ui.outroSpeaker.textContent = slide.speaker;
		ui.outroSpeaker.classList.remove("hidden");
	} else {
		ui.outroSpeaker.classList.add("hidden");
		ui.outroSpeaker.textContent = "";
	}

	typeOutroText(slide.text || "");
	renderOutroConfetti(Boolean(slide.showConfetti));

	ui.outroMissionTitle.classList.toggle("hidden", !slide.showMissionTitle);
	ui.outroCard.classList.toggle("outro-final-glow", Boolean(slide.showMissionTitle));

	const lastSlide = state.outroSlideIndex >= outroSlides.length - 1;
	ui.outroNextBtn.classList.toggle("hidden", lastSlide);
	ui.outroNextBtn.textContent = slide.nextButton || "Weiter";
	ui.outroRestartBtn.classList.toggle("hidden", !lastSlide);
	scrollToTop();
}

function completeGame() {
	state.gameCompleted = true;
	state.outroSlideIndex = 0;
	localStorage.setItem(GAME_COMPLETED_KEY, "true");
	saveProgress();
	renderOutroSequence();
}

function getStationDraft(station = riddles[state.currentStation]) {
	if (!station) {
		return {};
	}
	const draftKey = String(station.id ?? state.currentStation);
	return state.stationDrafts[draftKey] || {};
}

function saveStationDraft(station, patch) {
	if (!station) {
		return;
	}
	const draftKey = String(station.id ?? state.currentStation);
	state.stationDrafts[draftKey] = {
		...getStationDraft(station),
		...patch
	};
	saveProgress();
}

function clearStationDraft(station = riddles[state.currentStation]) {
	if (!station) {
		return;
	}
	const draftKey = String(station.id ?? state.currentStation);
	delete state.stationDrafts[draftKey];
	saveProgress();
}

function persistCurrentStationDraft(extra = {}) {
	const station = riddles[state.currentStation];
	if (!station || !state.started) {
		return;
	}

	saveStationDraft(station, {
		answerInput: ui.answerInput.value,
		passwordInput: ui.passwordInput.value,
		crosswordValues: activeCrosswordInputs.map((entry) => entry.input.value || ""),
		audioLetters: audioLetterInputs.map((input) => input.value || ""),
		mcSelectedLetters: [...mcSelectedLetters],
		mcSelectedAnswerIndexes: [...mcSelectedAnswerIndexes],
		logicSelections: getCurrentLogicMapping(),
		clockInputs: clockWordInputs.map((entry) => entry.input.value || ""),
		...extra
	});
}

function resetCurrentRiddle() {
	clearCompletionTimer();
	if (!state.started || state.currentStation >= riddles.length) {
		return;
	}
	state.solvedCurrent = false;
	clearStationDraft();
	saveProgress();
	renderStation();
}

function renderIntroSequence() {
	if (!introSlides.length) {
		startMission();
		return;
	}

	state.introSlideIndex = Math.min(Math.max(state.introSlideIndex, 0), introSlides.length - 1);
	const slideIndex = state.introSlideIndex;

	ui.introSequenceCard.classList.remove("hidden");
	ui.welcomeCard.classList.add("hidden");
	ui.missionCard.classList.add("hidden");
	ui.completeCard.classList.add("hidden");
	ui.outroCard.classList.add("hidden");

	ui.introSlideImage.src = introSlides[slideIndex];
	ui.introSlideImage.alt = `Einführungsbild ${slideIndex + 1} von ${introSlides.length}`;
	ui.introNextBtn.textContent = slideIndex === introSlides.length - 1 ? "Mission starten" : "Weiter";

	ui.introSlideImage.classList.remove("intro-slide-fade");
	void ui.introSlideImage.offsetWidth;
	ui.introSlideImage.classList.add("intro-slide-fade");
	scrollToTop();
}

function setFeedback(message, kind = "") {
	ui.feedback.textContent = message;
	ui.feedback.classList.remove("ok", "bad");
	if (kind === "ok") {
		ui.feedback.classList.add("ok");
	}
	if (kind === "bad") {
		ui.feedback.classList.add("bad");
	}
}

function playTone(kind) {
	const candidates =
		kind === "ok"
			? ["assets/audio/success.mp3"]
			: ["assets/audio/error.mp3"];

	const playCandidate = (index) => {
		if (index >= candidates.length) {
			const Ctx = window.AudioContext || window.webkitAudioContext;
			if (!Ctx) {
				return;
			}
			const ctx = new Ctx();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.frequency.value = kind === "ok" ? 650 : 190;
			gain.gain.value = 0.06;
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + 0.12);
			return;
		}

		const audio = new Audio(candidates[index]);
		audio.volume = 0.45;
		audio.play().catch(() => playCandidate(index + 1));
	};

	playCandidate(0);
}

function renderClues(station) {
	ui.acrossList.innerHTML = "";
	ui.downList.innerHTML = "";
	if (!station.clues) {
		ui.cluesArea.classList.add("hidden");
		return;
	}

	ui.cluesArea.classList.remove("hidden");
	(station.clues.across || []).forEach((clue) => {
		const item = document.createElement("li");
		item.textContent = clue;
		ui.acrossList.appendChild(item);
	});
	(station.clues.down || []).forEach((clue) => {
		const item = document.createElement("li");
		item.textContent = clue;
		ui.downList.appendChild(item);
	});
}

function getCrosswordInput(row, col) {
	return activeCrosswordInputs.find((entry) => entry.row === row && entry.col === col)?.input || null;
}

function focusNextCell(index, direction) {
	const target = activeCrosswordInputs[index + direction];
	if (target) {
		target.input.focus();
	}
}

function renderCrossword(station) {
	ui.crosswordGrid.innerHTML = "";
	activeCrosswordInputs = [];
	const draft = getStationDraft(station);

	if (station.type !== "crossword" || !station.crossword?.layout) {
		ui.crosswordArea.classList.add("hidden");
		ui.extractWordBtn.classList.add("hidden");
		return;
	}

	const layout = station.crossword.layout;
	const clueStarts = station.crossword.clueStarts || {};
	const startCells = [
		...(clueStarts.across || []),
		...(clueStarts.down || []),
		...(station.crossword.startCells || [])
	];
	const isMobile = window.matchMedia("(max-width: 700px)").matches;
	const cellSize = isMobile
		? station.crossword.mobileCellSize || 32
		: station.crossword.cellSize || 42;
	ui.crosswordArea.classList.remove("hidden");
	ui.extractWordBtn.classList.remove("hidden");
	ui.crosswordGrid.style.setProperty("--cw-size", `${cellSize}px`);
	ui.crosswordGrid.style.gridTemplateColumns = `repeat(${layout[0].length}, ${cellSize}px)`;

	layout.forEach((row, rowIndex) => {
		row.forEach((cell, colIndex) => {
			const startEntry = startCells.find((entry) => entry.row === rowIndex && entry.col === colIndex);
			const cellToken = typeof cell === "string" ? cell.trim() : "";
			const inlineNumber = /^\d+(?:\/\d+)?$/.test(cellToken) ? cellToken : "";

			if (cell === "#") {
				const blocked = document.createElement("div");
				blocked.className = "crossword-cell block";
				ui.crosswordGrid.appendChild(blocked);
				return;
			}

			const cellWrap = document.createElement("div");
			cellWrap.className = "crossword-cell-wrap";

			const input = document.createElement("input");
			input.type = "text";
			input.maxLength = 1;
			input.className = "crossword-cell";
			input.setAttribute("aria-label", `Kreuzworträtsel Feld ${rowIndex + 1}-${colIndex + 1}`);
			const cellIndex = activeCrosswordInputs.length;

			const entry = { row: rowIndex, col: colIndex, input };
			activeCrosswordInputs.push(entry);

			if ((station.crossword.solutionCells || []).some(([r, c]) => r === rowIndex && c === colIndex)) {
				input.classList.add("solution");
				cellWrap.classList.add("solution");
			}

			if (startEntry || inlineNumber) {
				input.classList.add("start");
				const number = String(startEntry?.number ?? inlineNumber);
				const marker = document.createElement("span");
				marker.className = "crossword-number";
				marker.textContent = number;
				cellWrap.appendChild(marker);
			}

			input.addEventListener("input", () => {
				input.value = input.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, "").slice(0, 1);
				persistCurrentStationDraft();
				if (input.value) {
					const index = activeCrosswordInputs.indexOf(entry);
					focusNextCell(index, 1);
				}
			});

			input.addEventListener("keydown", (event) => {
				const index = activeCrosswordInputs.indexOf(entry);
				if (event.key === "Backspace" && !input.value) {
					event.preventDefault();
					focusNextCell(index, -1);
				}

				if (event.key === "ArrowLeft") {
					event.preventDefault();
					focusNextCell(index, -1);
				}

				if (event.key === "ArrowRight") {
					event.preventDefault();
					focusNextCell(index, 1);
				}

				if (event.key === "Enter") {
					event.preventDefault();
					extractSolutionWord(station);
				}
			});

			if (cellToken && !inlineNumber) {
				input.placeholder = cellToken.slice(0, 1).toUpperCase();
			}

			const draftValue = draft.crosswordValues?.[cellIndex];
			if (draftValue) {
				input.value = String(draftValue).slice(0, 1).toUpperCase();
			}

			cellWrap.appendChild(input);
			ui.crosswordGrid.appendChild(cellWrap);
		});
	});
}

function extractSolutionWord(station) {
	if (station.type !== "crossword" || !station.crossword?.solutionCells) {
		return;
	}

	const letters = station.crossword.solutionCells
		.map(([row, col]) => getCrosswordInput(row, col)?.value || "")
		.join("");

	ui.answerInput.value = letters;
	persistCurrentStationDraft({ answerInput: letters });
	ui.answerInput.focus();
}

function renderQuote(station) {
	if (station.quote) {
		ui.closingQuote.textContent = station.quote;
		ui.closingQuote.classList.remove("hidden");
		return;
	}
	ui.closingQuote.classList.add("hidden");
}

function appendParagraphWithHighlightedNumbers(container, text, highlightNumbers) {
	const paragraph = document.createElement("p");
	const marked = new Set((highlightNumbers || []).map((value) => String(value)));
	const parts = text.split(/(\b\d+\b)/g);

	parts.forEach((part) => {
		if (marked.has(part)) {
			const marker = document.createElement("span");
			marker.className = "number-mark";
			marker.textContent = part;
			paragraph.appendChild(marker);
			return;
		}
		paragraph.appendChild(document.createTextNode(part));
	});

	container.appendChild(paragraph);
}

function renderTextCode(station) {
	ui.textCodeContent.innerHTML = "";
	if (station.type !== "text-code" || !Array.isArray(station.guideText)) {
		ui.textCodeContent.classList.add("hidden");
		return;
	}

	ui.textCodeContent.classList.remove("hidden");
	station.guideText.forEach((paragraph) => {
		appendParagraphWithHighlightedNumbers(ui.textCodeContent, paragraph, station.highlightNumbers);
	});
}

function updateAudioWordSlots() {
	const letters = audioLetterInputs.map((input) => input.value || "");
	ui.audioWordSlots.innerHTML = "";

	letters.forEach((letter) => {
		const slot = document.createElement("div");
		slot.className = "audio-word-slot";
		slot.textContent = letter;
		ui.audioWordSlots.appendChild(slot);
	});

	ui.answerInput.value = letters.join("");
}

function checkAudioPuzzleWord(station) {
	if (state.solvedCurrent) {
		return;
	}

	const word = audioLetterInputs.map((input) => input.value).join("");
	if (audioLetterInputs.some((input) => input.value.length !== 1)) {
		return;
	}

	const expected = normalize(station.solution || "");
	if (normalize(word) === expected && expected) {
		state.solvedCurrent = true;
		saveProgress();
		ui.passwordPanel.classList.remove("hidden");
		ui.locationHint.textContent = station.nextLocation || station.locationHint || "";
		setFeedback(station.nextHint || "Richtig! Gehe zum neuen Ort.", "ok");
		ui.audioPuzzleArea.classList.remove("audio-puzzle-error");
		ui.audioPuzzleArea.classList.add("audio-puzzle-success");
		playTone("ok");
		return;
	}

	setFeedback("Falsch. Überprüfe die sechs Buchstaben noch einmal.", "bad");
	ui.audioPuzzleArea.classList.remove("audio-puzzle-success");
	ui.audioPuzzleArea.classList.add("audio-puzzle-error");
	playTone("bad");
}

function renderAudioPuzzle(station) {
	ui.audioTrackList.innerHTML = "";
	ui.audioWordSlots.innerHTML = "";
	audioLetterInputs = [];
	ui.audioPuzzleArea.classList.remove("audio-puzzle-success", "audio-puzzle-error");
	const draft = getStationDraft(station);

	if (station.type !== "audio-puzzle" || !Array.isArray(station.tracks)) {
		ui.audioPuzzleArea.classList.add("hidden");
		return;
	}

	ui.audioPuzzleArea.classList.remove("hidden");

	station.tracks.forEach((track, index) => {
		const item = document.createElement("article");
		item.className = "audio-track-item";
		item.classList.toggle("audio-track-image", track.type === "image");

		const number = document.createElement("div");
		number.className = "audio-track-number";
		number.textContent = String(track.number || track.id || index + 1);

		const meta = document.createElement("div");
		const title = document.createElement("p");
		title.className = "audio-track-title";
		title.textContent = track.title || `Spur ${index + 1}`;
		const description = document.createElement("p");
		description.className = "audio-track-description";
		description.textContent = track.description || "";
		meta.append(title, description);
		if (track.tip) {
			const tip = document.createElement("p");
			tip.className = "audio-track-tip";
			tip.textContent = track.tip ? `„${track.tip}“` : "";
			tip.classList.toggle("hidden", !track.tip);
			meta.appendChild(tip);
		}

		if (track.type === "image") {
			const mediaWrap = document.createElement("div");
			mediaWrap.className = "audio-track-media";
			const image = document.createElement("img");
			image.className = "audio-track-image-file";
			image.src = track.file || "";
			image.alt = track.title || `Bildspur ${index + 1}`;
			image.loading = "lazy";
			mediaWrap.appendChild(image);
			meta.appendChild(mediaWrap);
		} else {
			const players = document.createElement("div");
			players.className = "audio-players";
			const audio = document.createElement("audio");
			audio.controls = true;
			audio.preload = "none";
			audio.src = track.file || "";
			players.appendChild(audio);
			meta.appendChild(players);
		}

		const letterInput = document.createElement("input");
		letterInput.type = "text";
		letterInput.maxLength = 1;
		letterInput.className = "audio-letter-input";
		letterInput.setAttribute("aria-label", `Buchstabe Spur ${index + 1}`);

		letterInput.addEventListener("input", () => {
			letterInput.value = letterInput.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, "").slice(0, 1);
			updateAudioWordSlots();
			persistCurrentStationDraft();
			if (letterInput.value && audioLetterInputs[index + 1]) {
				audioLetterInputs[index + 1].focus();
			}
			if (audioLetterInputs.every((entry) => entry.value.length === 1)) {
				checkAudioPuzzleWord(station);
			}
		});

		letterInput.addEventListener("keydown", (event) => {
			if (event.key === "Backspace" && !letterInput.value && audioLetterInputs[index - 1]) {
				audioLetterInputs[index - 1].focus();
			}
		});

		audioLetterInputs.push(letterInput);
		if (draft.audioLetters?.[index]) {
			letterInput.value = String(draft.audioLetters[index]).slice(0, 1).toUpperCase();
		}
		item.append(number, meta, letterInput);
		ui.audioTrackList.appendChild(item);
	});

	updateAudioWordSlots();
}

function updateMcWordSlots() {
	ui.mcWordSlots.innerHTML = "";
	mcSelectedLetters.forEach((letter) => {
		const slot = document.createElement("div");
		slot.className = "mc-word-slot";
		slot.textContent = letter || "";
		ui.mcWordSlots.appendChild(slot);
	});
	ui.answerInput.value = mcSelectedLetters.join("");
}

function checkMultipleChoiceWord(station) {
	if (state.solvedCurrent) {
		return;
	}

	if (!mcSelectedLetters.length || mcSelectedLetters.some((letter) => !letter)) {
		return;
	}

	const word = mcSelectedLetters.join("");
	const expected = normalize(station.solution || "");

	if (normalize(word) === expected && expected) {
		state.solvedCurrent = true;
		saveProgress();
		ui.passwordPanel.classList.remove("hidden");
		ui.locationHint.textContent = station.nextLocation || station.locationHint || "";
		setFeedback(station.nextHint || "Richtig! Gehe zum neuen Ort.", "ok");
		ui.mcPuzzleArea.classList.remove("mc-puzzle-error");
		ui.mcPuzzleArea.classList.add("mc-puzzle-success");
		playTone("ok");
		return;
	}

	setFeedback("Falsch. Prüfe deine Auswahl noch einmal.", "bad");
	ui.mcPuzzleArea.classList.remove("mc-puzzle-success");
	ui.mcPuzzleArea.classList.add("mc-puzzle-error");
	playTone("bad");
}

function renderMultipleChoiceWord(station) {
	ui.mcQuestionList.innerHTML = "";
	ui.mcWordSlots.innerHTML = "";
	mcSelectedLetters = [];
	mcSelectedAnswerIndexes = [];
	ui.mcPuzzleArea.classList.remove("mc-puzzle-success", "mc-puzzle-error");
	const draft = getStationDraft(station);

	if (station.type !== "multiple-choice-word" || !Array.isArray(station.questions)) {
		ui.mcPuzzleArea.classList.add("hidden");
		return;
	}

	ui.mcPuzzleArea.classList.remove("hidden");
	mcSelectedLetters = Array.from({ length: station.questions.length }, () => "");
	mcSelectedAnswerIndexes = Array.from({ length: station.questions.length }, () => -1);
	ui.mcHelperText.textContent =
		station.nextStepText || "Trage die acht Buchstaben in der richtigen Reihenfolge hier ein.";

	station.questions.forEach((entry, qIndex) => {
		const card = document.createElement("article");
		card.className = "mc-question-card";

		const number = document.createElement("div");
		number.className = "mc-question-number";
		number.textContent = String(qIndex + 1);

		const content = document.createElement("div");
		const title = document.createElement("p");
		title.className = "mc-question-title";
		title.textContent = entry.question || `Frage ${qIndex + 1}`;
		content.appendChild(title);

		if (entry.subtitle) {
			const subtitle = document.createElement("p");
			subtitle.className = "mc-question-subtitle";
			subtitle.textContent = `„${entry.subtitle}“`;
			content.appendChild(subtitle);
		}

		const answers = document.createElement("div");
		answers.className = "mc-answer-grid";

		(entry.answers || []).forEach((answer, answerIndex) => {
			const option = document.createElement("button");
			option.type = "button";
			option.className = "mc-answer-option";
			option.textContent = answer;

			option.addEventListener("click", () => {
				answers.querySelectorAll(".mc-answer-option").forEach((el) => el.classList.remove("selected"));
				option.classList.add("selected");
				const letter = String(answer).trim().charAt(0).toUpperCase();
				mcSelectedLetters[qIndex] = letter;
				mcSelectedAnswerIndexes[qIndex] = answerIndex;
				if (smallSlot) {
					smallSlot.textContent = letter;
				}
				updateMcWordSlots();
				persistCurrentStationDraft();
				checkMultipleChoiceWord(station);
			});

			answers.appendChild(option);
		});

		content.appendChild(answers);

		const smallSlot = document.createElement("div");
		smallSlot.className = "mc-letter-slot";

		const selectedIndex = draft.mcSelectedAnswerIndexes?.[qIndex];
		if (Number.isInteger(selectedIndex) && selectedIndex >= 0 && selectedIndex < (entry.answers || []).length) {
			const selectedAnswer = String(entry.answers[selectedIndex] || "");
			mcSelectedLetters[qIndex] = selectedAnswer.trim().charAt(0).toUpperCase();
			mcSelectedAnswerIndexes[qIndex] = selectedIndex;
			smallSlot.textContent = mcSelectedLetters[qIndex];
			const selectedOption = answers.children[selectedIndex];
			if (selectedOption) {
				selectedOption.classList.add("selected");
			}
		}

		card.append(number, content, smallSlot);
		ui.mcQuestionList.appendChild(card);
	});

	updateMcWordSlots();
}

function normalizeSeatKey(value) {
	if (!value) {
		return "";
	}
	const normalized = normalize(value);
	if (normalized.includes("links") || normalized.includes("left")) {
		return "left";
	}
	if (normalized.includes("mitt") || normalized.includes("middle") || normalized.includes("center")) {
		return "middle";
	}
	if (normalized.includes("rechts") || normalized.includes("right")) {
		return "right";
	}
	return normalized;
}

function getCurrentLogicMapping() {
	const mapping = { left: null, middle: null, right: null };
	logicSelectRefs.forEach((entry) => {
		const slotKey = normalizeSeatKey(entry.position);
		if (!slotKey || !mapping.hasOwnProperty(slotKey)) {
			return;
		}
		mapping[slotKey] = {
			person: entry.personSelect.value,
			drink: entry.drinkSelect.value
		};
	});
	return mapping;
}

function updateLogicSelectAvailability() {
	const selectedPeople = logicSelectRefs
		.map((entry) => entry.personSelect.value)
		.filter((value) => Boolean(value));
	const selectedDrinks = logicSelectRefs
		.map((entry) => entry.drinkSelect.value)
		.filter((value) => Boolean(value));

	logicSelectRefs.forEach((entry) => {
		Array.from(entry.personSelect.options).forEach((option) => {
			if (!option.value || option.value === entry.personSelect.value) {
				option.disabled = false;
				return;
			}
			option.disabled = selectedPeople.includes(option.value);
		});

		Array.from(entry.drinkSelect.options).forEach((option) => {
			if (!option.value || option.value === entry.drinkSelect.value) {
				option.disabled = false;
				return;
			}
			option.disabled = selectedDrinks.includes(option.value);
		});

		const personInitial = entry.personSelect.value ? entry.personSelect.value.trim().charAt(0).toUpperCase() : "";
		const drinkInitial = entry.drinkSelect.value ? entry.drinkSelect.value.trim().charAt(0).toUpperCase() : "";
		entry.slot.textContent = personInitial || drinkInitial ? `${personInitial}/${drinkInitial}` : "";
	});
}

function renderLogicSeating(station) {
	ui.logicSeatGrid.innerHTML = "";
	ui.logicHintList.innerHTML = "";
	logicSelectRefs = [];
	ui.logicSeatingArea.classList.remove("logic-success", "logic-error");
	const draft = getStationDraft(station);

	if (station.type !== "logic-seating") {
		ui.logicSeatingArea.classList.add("hidden");
		return;
	}

	ui.logicSeatingArea.classList.remove("hidden");
	(station.hints || []).forEach((hint) => {
		const li = document.createElement("li");
		li.textContent = hint;
		ui.logicHintList.appendChild(li);
	});

	const positions = station.positions || ["links", "mitte", "rechts"];
	const people = station.people || [];
	const drinks = station.drinks || [];

	positions.forEach((position, index) => {
		const card = document.createElement("article");
		card.className = "logic-seat-card";

		const badge = document.createElement("div");
		badge.className = "logic-seat-badge";
		badge.textContent = String(index + 1);

		const content = document.createElement("div");
		const title = document.createElement("p");
		title.className = "logic-seat-title";
		title.textContent = `Platz: ${position.charAt(0).toUpperCase()}${position.slice(1)}`;

		const selectRow = document.createElement("div");
		selectRow.className = "logic-select-row";

		const personSelect = document.createElement("select");
		personSelect.className = "logic-select";
		personSelect.setAttribute("aria-label", `Person für Platz ${position}`);
		personSelect.innerHTML = "<option value=''>Person wählen</option>";
		people.forEach((person) => {
			const option = document.createElement("option");
			option.value = person;
			option.textContent = person;
			personSelect.appendChild(option);
		});

		const drinkSelect = document.createElement("select");
		drinkSelect.className = "logic-select";
		drinkSelect.setAttribute("aria-label", `Getränk für Platz ${position}`);
		drinkSelect.innerHTML = "<option value=''>Getränk wählen</option>";
		drinks.forEach((drink) => {
			const option = document.createElement("option");
			option.value = drink;
			option.textContent = drink;
			drinkSelect.appendChild(option);
		});

		selectRow.append(personSelect, drinkSelect);
		content.append(title, selectRow);

		const slot = document.createElement("div");
		slot.className = "logic-mini-slot";

		card.append(badge, content, slot);
		ui.logicSeatGrid.appendChild(card);

		const ref = { position, personSelect, drinkSelect, slot };
		logicSelectRefs.push(ref);

		const slotKey = normalizeSeatKey(position);
		const savedValues = draft.logicSelections?.[slotKey];
		if (savedValues) {
			personSelect.value = savedValues.person || "";
			drinkSelect.value = savedValues.drink || "";
		}

		personSelect.addEventListener("change", () => {
			updateLogicSelectAvailability();
			persistCurrentStationDraft();
		});
		drinkSelect.addEventListener("change", () => {
			updateLogicSelectAvailability();
			persistCurrentStationDraft();
		});
	});

	updateLogicSelectAvailability();
}

function computeClockFinalWord(station) {
	const fragments = clockWordInputs.flatMap((entry) => {
		const raw = entry.input.value || "";
		const letters = raw.toUpperCase().replace(/[^A-ZÄÖÜ]/g, "").split("");
		return entry.markedLetters
			.map((index) => letters[index] || "")
			.filter((letter) => Boolean(letter));
	});

	const targetLength = Number(station.finalLength || (station.solution ? String(station.solution).length : 5));
	return {
		word: fragments.join("").slice(0, targetLength),
		targetLength
	};
}

function updateClockFinalSlots(station) {
	const { word, targetLength } = computeClockFinalWord(station);
	ui.clockFinalSlots.innerHTML = "";

	for (let index = 0; index < targetLength; index += 1) {
		const slot = document.createElement("div");
		slot.className = "clock-final-slot";
		slot.textContent = word[index] || "";
		ui.clockFinalSlots.appendChild(slot);
	}

	ui.answerInput.value = word;
	return word;
}

function checkClockWordPuzzle(station) {
	if (state.solvedCurrent) {
		return;
	}

	const word = updateClockFinalSlots(station);
	const expected = normalize(station.solution || "");

	if (!word || normalize(word).length < expected.length) {
		return;
	}

	if (normalize(word) === expected && expected) {
		state.solvedCurrent = true;
		saveProgress();
		setFeedback(station.nextHint || "Richtig! Du hast die letzte Erinnerung gefunden.", "ok");
		ui.clockPuzzleArea.classList.remove("clock-puzzle-error");
		ui.clockPuzzleArea.classList.add("clock-puzzle-success");
		ui.passwordPanel.classList.remove("hidden");
		ui.locationHint.textContent = station.nextLocation || station.locationHint || "";
		playTone("ok");
		return;
	}

	setFeedback("Noch nicht ganz richtig. Prüfe die markierten Buchstaben erneut.", "bad");
	ui.clockPuzzleArea.classList.remove("clock-puzzle-success");
	ui.clockPuzzleArea.classList.add("clock-puzzle-error");
	playTone("bad");
}

function renderClockWordPuzzle(station) {
	ui.clockPuzzleGrid.innerHTML = "";
	ui.clockFinalSlots.innerHTML = "";
	clockWordInputs = [];
	ui.clockPuzzleArea.classList.remove("clock-puzzle-success", "clock-puzzle-error");
	const draft = getStationDraft(station);

	if (station.type !== "clock-word-puzzle" || !Array.isArray(station.clocks)) {
		ui.clockPuzzleArea.classList.add("hidden");
		return;
	}

	ui.clockPuzzleArea.classList.remove("hidden");
	ui.clockFinalHint.textContent = station.finalHint || "Where _ _ _ _ _ is found, there too watches the fish.";

	station.clocks.forEach((clock, index) => {
		const card = document.createElement("article");
		card.className = "clock-card";

		const label = document.createElement("p");
		label.className = "clock-card-label";
		label.textContent = `Uhr ${index + 1}`;

		const image = document.createElement("img");
		image.className = "clock-card-image";
		image.src = clock.image || "";
		image.alt = `Uhr ${index + 1}`;
		image.loading = "lazy";

		const input = document.createElement("input");
		input.type = "text";
		input.className = "clock-card-input";
		input.setAttribute("aria-label", `Wort für Uhr ${index + 1}`);
		input.placeholder = "Wort eingeben";

		const lettersRow = document.createElement("div");
		lettersRow.className = "clock-letter-row";
		const answerLength = Math.max(5, String(clock.answer || "").length || 0, ...(clock.markedLetters || [0]).map((value) => value + 1));
		lettersRow.style.gridTemplateColumns = `repeat(${answerLength}, minmax(20px, 1fr))`;

		for (let letterIndex = 0; letterIndex < answerLength; letterIndex += 1) {
			const cell = document.createElement("div");
			cell.className = "clock-letter-cell";

			const char = document.createElement("span");
			char.className = "clock-letter-char";
			char.textContent = "";

			const marker = document.createElement("span");
			marker.className = "clock-letter-marker";
			marker.textContent = (clock.markedLetters || []).includes(letterIndex) ? "★" : "";

			cell.append(char, marker);
			lettersRow.appendChild(cell);
		}

		input.addEventListener("input", () => {
			input.value = input.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, "");
			const chars = input.value.split("");
			lettersRow.querySelectorAll(".clock-letter-char").forEach((el, letterIndex) => {
				el.textContent = chars[letterIndex] || "";
			});
			persistCurrentStationDraft();
			checkClockWordPuzzle(station);
		});

		const savedClockInput = draft.clockInputs?.[index];
		if (savedClockInput) {
			input.value = String(savedClockInput).toUpperCase();
			const chars = input.value.split("");
			lettersRow.querySelectorAll(".clock-letter-char").forEach((el, letterIndex) => {
				el.textContent = chars[letterIndex] || "";
			});
		}

		card.append(label, image, input, lettersRow);
		ui.clockPuzzleGrid.appendChild(card);
		clockWordInputs.push({ input, markedLetters: clock.markedLetters || [] });
	});

	updateClockFinalSlots(station);
}

function checkLogicSeating(station) {
	if (!logicSelectRefs.length) {
		setFeedback("Bitte fülle erst die Sitzordnung aus.", "bad");
		return;
	}

	const mapping = getCurrentLogicMapping();
	const slots = ["left", "middle", "right"];
	if (
		slots.some((slot) => !mapping[slot] || !mapping[slot].person || !mapping[slot].drink)
	) {
		setFeedback("Bitte wähle für jeden Platz Person und Getränk.", "bad");
		ui.logicSeatingArea.classList.remove("logic-success");
		ui.logicSeatingArea.classList.add("logic-error");
		playTone("bad");
		return;
	}

	const people = slots.map((slot) => mapping[slot].person);
	const drinks = slots.map((slot) => mapping[slot].drink);
	if (new Set(people).size !== 3 || new Set(drinks).size !== 3) {
		setFeedback("Jede Person und jedes Getränk darf nur einmal vorkommen.", "bad");
		ui.logicSeatingArea.classList.remove("logic-success");
		ui.logicSeatingArea.classList.add("logic-error");
		playTone("bad");
		return;
	}

	const expected = station.solution || {};
	const isCorrect = slots.every((slot) => {
		const expectedRow = expected[slot];
		const actualRow = mapping[slot];
		if (!expectedRow || !actualRow) {
			return false;
		}
		return (
			normalize(expectedRow.person) === normalize(actualRow.person) &&
			normalize(expectedRow.drink) === normalize(actualRow.drink)
		);
	});

	if (!isCorrect) {
		setFeedback("Die Sitzordnung stimmt noch nicht ganz. Prüfe die Hinweise erneut.", "bad");
		ui.logicSeatingArea.classList.remove("logic-success");
		ui.logicSeatingArea.classList.add("logic-error");
		playTone("bad");
		return;
	}

	const charlySlot = slots.find((slot) => normalize(mapping[slot].person) === "charly") || "right";
	const placeLabel = charlySlot === "left" ? "links" : charlySlot === "middle" ? "in der Mitte" : "rechts";
	const hint = (station.nextHint || "Richtig! Charly sitzt [PLATZ]. Gehe dorthin zum nächsten Hinweis.").replace(
		"[PLATZ]",
		placeLabel
	);

	state.solvedCurrent = true;
	saveProgress();
	setFeedback(hint, "ok");
	ui.logicSeatingArea.classList.remove("logic-error");
	ui.logicSeatingArea.classList.add("logic-success");
	ui.passwordPanel.classList.remove("hidden");
	ui.locationHint.textContent = station.nextLocation || station.locationHint || "";
	playTone("ok");
}

function renderStation() {
	clearCompletionTimer();
	clearOutroTypingTimer();

	if (!Array.isArray(riddles) || riddles.length === 0) {
		ui.introSequenceCard.classList.add("hidden");
		ui.welcomeCard.classList.remove("hidden");
		ui.missionCard.classList.add("hidden");
		ui.completeCard.classList.add("hidden");
		ui.outroCard.classList.add("hidden");
		setFeedback("Rätseldaten konnten nicht geladen werden.", "bad");
		scrollToTop();
		return;
	}

	if (state.gameCompleted || localStorage.getItem(GAME_COMPLETED_KEY) === "true") {
		state.gameCompleted = true;
		state.outroSlideIndex = 0;
		renderOutroSequence();
		return;
	}

	if (!state.started) {
		renderIntroSequence();
		return;
	}

	if (state.currentStation >= riddles.length) {
		ui.introSequenceCard.classList.add("hidden");
		ui.welcomeCard.classList.add("hidden");
		ui.missionCard.classList.add("hidden");
		ui.completeCard.classList.remove("hidden");
		ui.outroCard.classList.add("hidden");
		scrollToTop();
		return;
	}

	const station = riddles[state.currentStation];
	const stationIndex = state.currentStation + 1;
	const progressPct = (stationIndex / riddles.length) * 100;

	ui.introSequenceCard.classList.add("hidden");
	ui.welcomeCard.classList.add("hidden");
	ui.completeCard.classList.add("hidden");
	ui.outroCard.classList.add("hidden");
	ui.missionCard.classList.remove("hidden");

	ui.riddleNumber.textContent = station.number || `RÄTSEL NR. ${String(stationIndex).padStart(3, "0")}`;
	ui.stationTitle.textContent = station.title;
	ui.stationSubtitle.textContent = station.subtitle || "";
	ui.pikaratBadge.textContent = station.pikarat || "0 PIKARAT";
	ui.progressText.textContent = `Station ${stationIndex} von ${riddles.length}`;
	ui.progressBar.style.width = `${progressPct}%`;
	ui.progressBar.parentElement.setAttribute("aria-valuenow", String(stationIndex));
	ui.progressBar.parentElement.setAttribute("aria-valuemax", String(riddles.length));
	ui.introText.textContent = station.intro || "";
	ui.riddleText.textContent = station.riddleText || "";
	const draft = getStationDraft(station);
	ui.answerInput.value = draft.answerInput || "";
	ui.passwordInput.value = draft.passwordInput || "";
	ui.answerLabel.classList.remove("hidden");
	ui.answerInput.classList.remove("hidden");
	ui.checkAnswerBtn.classList.remove("hidden");
	ui.checkAnswerBtn.disabled = false;
	ui.checkAnswerBtn.textContent = "Lösung prüfen";

	renderCrossword(station);
	renderTextCode(station);
	renderAudioPuzzle(station);
	renderMultipleChoiceWord(station);
	renderLogicSeating(station);
	renderClockWordPuzzle(station);
	renderClues(station);
	renderQuote(station);

	if (station.type === "audio-puzzle") {
		ui.answerLabel.classList.add("hidden");
		ui.answerInput.classList.add("hidden");
		ui.checkAnswerBtn.classList.add("hidden");
	}

	if (station.type === "multiple-choice-word") {
		ui.answerLabel.classList.add("hidden");
		ui.answerInput.classList.add("hidden");
		ui.checkAnswerBtn.classList.add("hidden");
	}

	if (station.type === "logic-seating") {
		ui.answerLabel.classList.add("hidden");
		ui.answerInput.classList.add("hidden");
		ui.checkAnswerBtn.classList.remove("hidden");
		ui.checkAnswerBtn.textContent = "Lösung prüfen";
	}

	if (station.type === "clock-word-puzzle") {
		ui.answerLabel.classList.add("hidden");
		ui.answerInput.classList.add("hidden");
		ui.checkAnswerBtn.classList.add("hidden");
	}

	if (state.solvedCurrent) {
		ui.passwordPanel.classList.remove("hidden");
		ui.locationHint.textContent = station.nextLocation || station.locationHint || "";
		setFeedback(station.nextHint || "Richtig! Gehe zum neuen Ort.", "ok");
	} else {
		ui.passwordPanel.classList.add("hidden");
		ui.locationHint.textContent = "";
		setFeedback("");
	}

	scrollToTop();
}

function startMission() {
	state.started = true;
	state.currentStation = 0;
	state.solvedCurrent = false;
	state.introSlideIndex = 0;
	state.gameCompleted = false;
	state.outroSlideIndex = 0;
	localStorage.removeItem(GAME_COMPLETED_KEY);
	clearCompletionTimer();
	clearOutroTypingTimer();
	saveProgress();
	renderStation();
}

function resetMission() {
	clearCompletionTimer();
	clearOutroTypingTimer();
	state.started = false;
	state.currentStation = 0;
	state.solvedCurrent = false;
	state.introSlideIndex = 0;
	state.stationDrafts = {};
	state.gameCompleted = false;
	state.outroSlideIndex = 0;
	localStorage.removeItem(STORAGE_KEY);
	localStorage.removeItem(GAME_COMPLETED_KEY);
	renderStation();
}

function checkAnswer() {
	const station = riddles[state.currentStation];
	if (station.type === "audio-puzzle") {
		checkAudioPuzzleWord(station);
		return;
	}
	if (station.type === "multiple-choice-word") {
		checkMultipleChoiceWord(station);
		return;
	}
	if (station.type === "logic-seating") {
		checkLogicSeating(station);
		return;
	}
	if (station.type === "clock-word-puzzle") {
		checkClockWordPuzzle(station);
		return;
	}
	const given = normalize(ui.answerInput.value);
	const expected = normalize(station.solution);

	if (!given) {
		setFeedback("Bitte gib eine Lösung ein.", "bad");
		playTone("bad");
		return;
	}

	if (given === expected) {
		state.solvedCurrent = true;
		saveProgress();
		persistCurrentStationDraft();
		ui.passwordPanel.classList.remove("hidden");
		ui.locationHint.textContent = station.nextLocation || station.locationHint || "";
		setFeedback(station.nextHint || "Richtig! Gehe zum neuen Ort.", "ok");
		playTone("ok");
		return;
	}

	setFeedback("Falsch. Versuche es erneut.", "bad");
	playTone("bad");
}

function unlockNext() {
	const station = riddles[state.currentStation];
	const given = normalize(ui.passwordInput.value);
	const expected = normalize(station.unlockPassword);

	if (!state.solvedCurrent) {
		setFeedback("Lösung zuerst korrekt beantworten.", "bad");
		playTone("bad");
		return;
	}

	if (!given) {
		setFeedback("Bitte Passwort eingeben.", "bad");
		playTone("bad");
		return;
	}

	if (given !== expected) {
		setFeedback("Passwort ist nicht korrekt.", "bad");
		playTone("bad");
		return;
	}

	if (station.type === "clock-word-puzzle") {
		state.solvedCurrent = false;
		clearStationDraft(station);
		completeGame();
		playTone("ok");
		return;
	}

	state.currentStation += 1;
	state.solvedCurrent = false;
	clearStationDraft(station);
	saveProgress();
	playTone("ok");
	renderStation();
}

function registerServiceWorker() {
	if (!("serviceWorker" in navigator)) {
		return;
	}
	navigator.serviceWorker
		.register("./service-worker.js")
		.catch(() => navigator.serviceWorker.register("./sw.js"))
		.catch(() => {
			// Ignore registration errors in file mode.
		});
}

ui.startBtn.addEventListener("click", startMission);
ui.introNextBtn.addEventListener("click", () => {
	if (!introSlides.length) {
		startMission();
		return;
	}

	if (state.introSlideIndex < introSlides.length - 1) {
		state.introSlideIndex += 1;
		saveProgress();
		renderIntroSequence();
		return;
	}

	startMission();
});
ui.playAgainBtn.addEventListener("click", resetMission);
ui.outroNextBtn.addEventListener("click", () => {
	state.outroSlideIndex = Math.min(state.outroSlideIndex + 1, outroSlides.length - 1);
	saveProgress();
	renderOutroSequence();
});
ui.outroRestartBtn.addEventListener("click", resetMission);
ui.riddleResetBtn.addEventListener("click", resetCurrentRiddle);
ui.resetBtn.addEventListener("click", resetMission);
ui.checkAnswerBtn.addEventListener("click", checkAnswer);
ui.unlockBtn.addEventListener("click", unlockNext);
ui.extractWordBtn.addEventListener("click", () => {
	const station = riddles[state.currentStation];
	extractSolutionWord(station);
});
ui.answerInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		checkAnswer();
	}
});
ui.answerInput.addEventListener("input", () => {
	persistCurrentStationDraft();
});
ui.passwordInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		unlockNext();
	}
});
ui.passwordInput.addEventListener("input", () => {
	persistCurrentStationDraft();
});

loadProgress();
registerServiceWorker();
renderStation();
