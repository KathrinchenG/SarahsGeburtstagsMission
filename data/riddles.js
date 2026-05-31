// Alle Texte, Losungen, Passworter und Orte sind hier zentral gepflegt.
// So kannst du weitere Ratsel im gleichen Stil leicht erweitern.
window.INTRO_SLIDES = [
	"assets/images/intro/Intro_1.jpg",
	"assets/images/intro/Intro_2.jpg",
	"assets/images/intro/Intro_3.jpg",
	"assets/images/intro/Intro_4.jpg",
	"assets/images/intro/Intro_5.jpg",
	"assets/images/intro/Intro_6.jpg",
	"assets/images/intro/Intro_7.jpg"
];

window.RIDDLES = [
	{
		id: 1,
		number: "RÄTSEL NR. 001",
		title: "Das Rätsel der verlorenen Erinnerungen",
		subtitle: "Nur wer sich selbst kennt, findet den Weg weiter.",
		pikarat: "80 PIKARAT",
		type: "crossword",
		intro:
			"\"Meine liebe Sarah, ein wahrer Gentleman löst jedes Rätsel - und ein wahrer Layton-Schüler kennt sein eigenes Leben am besten.\"",
		riddleText:
			"Fülle das Kreuzworträtsel. Das markierte Lösungswort führt dich zur nächsten Station.",
		crossword: {
			dimensions: { rows: 14, cols: 8 },
			cellSize: 72,
			mobileCellSize: 31,
			layout: [
				["#", "1", "#", "#", "#", "#", "#", "2"],
				["#", "", "#", "#", "#", "#", "#", ""],
				["#", "", "#", "#", "#", "#", "#", ""],
				["#", "", "#", "#", "#", "3", "#", ""],
				["#", "", "#", "4/5", "", "", "", ""],
				["#", "", "6", "", "#", "", "#", "#"],
				["7/8", "", "", "", "#", "", "#", "#"],
				["", "", "", "", "9", "", "", ""],
				["", "", "", "", "#", "", "#", "#"],
				["", "", "", "", "#", "", "#", "#"],
				["", "", "", "", "#", "#", "#", "#"],
				["", "#", "10", "", "", "", "#", "#"],
				["", "#", "#", "#", "#", "#", "#", "#"],
				["", "#", "#", "#", "#", "#", "#", "#"]
			],
			solutionCells: [
				[6, 0],
				[6, 1],
				[6, 2],
				[6, 3]
			],
			clueStarts: {
				across: [
					{ row: 4, col: 3, number: "4/5" },
					{ row: 6, col: 0, number: "7/8" },
					{ row: 7, col: 4, number: 9 },
					{ row: 11, col: 2, number: 10 }
				],
				down: [
					{ row: 0, col: 1, number: 1 },
					{ row: 0, col: 7, number: 2 },
					{ row: 3, col: 5, number: 3 },
					{ row: 5, col: 2, number: 6 }
				]
			}
		},
		clues: {
			across: [
				"5. Als Kinder, unter Trauben - wie hieß dieser Ort?",
				"7. Lösungswort.",
				"9. Samstagmorgen, Sonnenschein - vier Buchstaben für eine Münchner Auszeit.",
				"10. Sie hat denselben Namen wie eine andere - aber diese ist die Große."
			],
			down: [
				"1. Nicht der Name des griechischen Desserts - sondern das, was man unwillkürlich ruft, wenn man es auf der Karte entdeckt.",
				"2. Kein Tier, kein Mensch - und doch das Liebste.",
				"3. Man zieht einen Bogen - aber nicht mit Pfeil. Was hält man dabei in der Hand?",
				"4. Ein Name, den kaum jemand kennt. Nicht der erste - der zweite.",
				"6. Liebt Sarah. Wird von Sarah geliebt. Die Gefühle sind nicht gegenseitig.",
				"8. Die Stadt, wo alles begann."
			]
		},
		quote:
			"\"Ein guter Detektiv löst das Rätsel - ein exzellenter weiß, welches Wort ihn als nächstes führt. Ohne Hinweis.\" - Professor H. Layton",
		solution: "POOL",
		unlockPassword: "Mallorca"
	},
	{
		id: 2,
		number: "❖ RÄTSEL NR. 002 ❖",
		title: "Der mallorquinische Reiseführer",
		subtitle: "Ein Abenteuer für eine Meisterknifflerin",
		pikarat: "70 PIKARAT",
		type: "text-code",
		intro:
			"\"Ein wahrer Detektiv liest nicht alles - er weiß, was er sucht. Zahlen lügen nicht. Aber was kommt danach?\"",
		riddleText:
			"Finde die hervorgehobenen Zahlen, bringe sie in die richtige Reihenfolge und leite daraus das Lösungswort ab.",
		highlightNumbers: [3, 1, 5, 9, 2],
		guideText: [
			"Mallorca, die Perle des Mittelmeers, empfängt ihre Gäste mit warmem Licht und dem Duft von Pinien. Die Strände im Norden sind wilder, die im Süden sanfter - beide gleichermaßen atemberaubend. Wer die Insel wirklich kennenlernen will, meidet die Touristenpfade.",
			"3 Küstendörfer wie Valldemossa, Deià und Fornalutx gelten als die schönsten der Insel. Sie erzählen Geschichten, die kein Reiseführer vollständig erfassen kann. Die mallorquinische Küche lebt von Einfachheit - frisches Brot, Olivenöl, Mandelgebäck.",
			"1 Abend auf der Terrasse einer Finca genügt, um zu verstehen, warum Menschen hierher kommen und nie wieder gehen. Die Stille ist nicht leer - sie ist voll. Voll von Zikaden, Windgeräuschen, fernem Hundegebell.",
			"Wer früh aufsteht, erlebt Mallorca ohne Masken. Die Märkte öffnen bei Sonnenaufgang, die Fischer kehren vom Meer zurück. Die Insel hat mehr als 200 Sonnentage im Jahr - aber die schönsten Momente passieren im Schatten.",
			"5 Minuten zu Fuß von jeder Finca entfernt liegt immer ein Geheimnis, das nur Geduldige finden. Manchmal ist es ein alter Brunnen, manchmal ein Feigenbaum, manchmal nichts weiter als eine besondere Stille.",
			"Die alten Fincas tragen Namen, die niemand mehr ausspricht. Ihre Mauern aus Sandstein speichern die Wärme des Tages und geben sie in der Nacht zurück. Abends versammelt sich das Leben auf den Plätzen der Dörfer. Niemand hat es eilig. Niemand muss irgendwo sein.",
			"9 Inseln gehören zu den Balearen - doch nur eine trägt das Herz der ganzen Gruppe in sich. Im Inneren der Insel, fernab der Küste, liegt das eigentliche Herz: steinerne Fincas, Mandelhaine, Ruhe.",
			"Die mallorquinische Sprache, das Català, klingt nach Meer und Olivenholz. Wer ein paar Worte spricht, wird mit einem Lächeln belohnt, das kein Reiseführer beschreiben kann. Die Tramuntana, das Gebirge im Nordwesten, formt den Charakter der Insel - ihre Straßen schmal, ihre Dörfer still, ihre Ausblicke endlos.",
			"Mallorca ist eine Insel der Gegensätze: laut und still, bekannt und verborgen, touristisch und ursprünglich. Wer nur die Küste kennt, kennt nur die Hälfte. Die andere Hälfte wartet im Inneren - geduldig, schweigend, unverändert.",
			"Und wer genau hinschaut - nicht nur liest, sondern beobachtet - der findet auf dieser Insel mehr als er gesucht hat.",
			"2 Namen tragen manche Orte hier: einen auf der Karte, und einen im Gedächtnis derer, die je dort waren.",
			"Mallorca braucht Zeit, um sich zu öffnen - aber wer wartet, wird reich belohnt."
		],
		quote:
			"\"Ein guter Detektiv löst das Rätsel - ein exzellenter weiß, welches Wort ihn als nächstes führt. Ohne Hinweis.\" - Professor H. Layton",
		solution: "Kamin",
		unlockPassword: "Schallplatte",
	},
	{
		id: 3,
		number: "❖ RÄTSEL NR. 003 ❖",
		title: "Die Schallplatte der Erinnerung",
		subtitle: "Ein Abenteuer für eine Meisterknifflerin",
		pikarat: "60 PIKARAT",
		type: "audio-puzzle",
		intro:
			"\"Musik ist ein merkwürdiges Archiv. Sie bewahrt Dinge auf, die selbst Fotos vergessen.\"",
		riddleText:
			"Meine liebe Sarah, manche Lieder begleiten uns ein Leben lang. Höre oder lies die sechs Spuren. Erkenne jedes Lied und deren KünstlerInnen. Dann folge den kleinen Anweisungen - und finde heraus, wohin die nächste Erinnerung dich führt.",
		tracks: [
			{
				id: 1,
				type: "audio",
				file: "assets/audio/Song 1a.m4a",
				number: 1,
				title: "Spur 1",
				description: "Erkenne den Künstler, nehme den Anfangsbuchstaben (nicht den Artikel).",
			},
			{
				id: 2,
				type: "audio",
				file: "assets/audio/Song 2a.m4a",
				number: 2,
				title: "Spur 2",
				description: "Erkenne den Titel, nehme den letzten Buchstaben.",
			},
			{
				id: 3,
				type: "image",
				file: "assets/images/songs/Song 3a.jpg",
				number: 3,
				title: "Spur 3",
				description: "Wer ist der Künstler? Nehme den dritten Buchstaben.",
			},
			{
				id: 4,
				type: "audio",
				file: "assets/audio/Song 4a.m4a",
				number: 4,
				title: "Spur 4",
				description: "Wie ist der Titel? Nehme vom dritten Wort den ersten Buchstaben.",
			},
			{
				id: 5,
				type: "audio",
				file: "assets/audio/Song 5a.m4a",
				number: 5,
				title: "Spur 5",
				description: "Erkenne den Titel und nehme den zweiten Buchstaben.",
			},
			{
				id: 6,
				type: "image",
				file: "assets/images/songs/Song 6a.jpg",
				number: 6,
				title: "Spur 6",
				description: "Erkenne den Titel, nehme das erste Wort und davon den letzten Buchstaben.",
			}
		],
		quote:
			"\"Ein guter Detektiv löst das Rätsel - ein exzellenter weiß, welches Wort ihn als nächstes führt. Ohne Hinweis.\" - Professor H. Layton",
		solution: "KUECHE",
		unlockPassword: "Erinnerungen",

	},
	{
		id: 4,
		number: "❖ RÄTSEL NR. 004 ❖",
		title: "Das Rezept der Erinnerungen",
		subtitle: "Ein Abenteuer für eine Meisterknifflerin",
		pikarat: "75 PIKARAT",
		type: "multiple-choice-word",
		intro:
			"\"Ein gutes Rezept verlangt Genauigkeit. Doch ein außergewöhnliches Rezept verrät nicht nur, was man isst - sondern auch, wo man es genießen muss.\"",
		riddleText:
			"Liebe Sarah, bei diesem alten Rezept fehlen noch acht essentielle Zutaten. Wähle jeweils die Antwort, die am besten passt. Das Lösungswort ergibt sich aus den ersten Buchstaben jeder deiner Antworten.",
		questions: [
			{
				question: "Die verbotene Zutat",
				answers: ["Basilikum", "Tomaten", "Gurkenscheiben"]
			},
			{
				question: "Der Sommer im Glas",
				answers: ["Matcha-Latte", "Specialty Coffee", "Eisgekühlter Aperol"]
			},
			{
				question: "Die wichtigste Küchenregel",
				answers: ["Chaos", "Laune", "Rezepttreue"]
			},
			{
				question: "Die goldene Frucht",
				answers: ["Banane", "Runde Mango", "Kiwi"]
			},
			{
				question: "Der knusprige Snack",
				answers: ["Apfelchips", "Schokoriegel", "Salzstangen"]
			},
			{
				question: "Der Kuchen, der keine Eile kennt",
				subtitle: "Dunkel gebräunt, cremig und aus einer Stadt.",
				answers: ["Zitronentarte", "Marmorkuchen", "San-Sebastian-Kuchen"]
			},
			{
				question: "Die wichtigste Zutat nach Sonnenuntergang",
				subtitle: "Etwas, das über einem erscheint.",
				answers: ["Kerzen", "Sterne", "Holy Jesus"]
			},
			{
				question: "Der letzte Versuch des Abends",
				subtitle:
					"Irgendwann versucht plötzlich jemand, bei 'Fix You' eine zweite Stimme mitzusingen. Es funktioniert selten perfekt - aber manchmal entsteht dabei trotzdem ...",
				answers: ["Müdigkeit", "Lautstärke", "eine Harmonie"]
			}
		],
		quote:
			"\"Ein guter Detektiv löst das Rätsel - ein exzellenter weiß, welches Wort ihn als nächstes führt. Ohne Hinweis.\" - Professor H. Layton",
		solution: "TERRASSE",
		unlockPassword: "Mallemaeuse",
		nextStepText: "Trage die acht Buchstaben in der richtigen Reihenfolge hier ein."
	},
	{
		id: 5,
		number: "❖ RÄTSEL NR. 005 ❖",
		title: "Die Sitzordnung der Mallemäuse",
		subtitle: "Ein Abenteuer für eine Meisterknifflerin",
		pikarat: "85 PIKARAT",
		type: "logic-seating",
		intro:
			"\"Auf einer Terrasse verraten Gläser manchmal mehr als Menschen. Doch nur wer richtig ordnet, findet den nächsten Hinweis.\"",
		riddleText:
			"Auf der Terrasse warten Veri, Kathrin und Charly. Sie sitzen an drei Plätzen: links, in der Mitte und rechts. Vor ihnen stehen drei Getränke: Wasser, Kaffee und Aperol. Jedes Getränk kommt genau einmal vor. Finde heraus, wer wo sitzt und welches Getränk vor wem steht. Wenn du die Ordnung kennst, weißt du auch, wo der nächste Hinweis versteckt ist.",
		hints: [
			"Der Kaffee steht direkt rechts vom Wasser.",
			"Der Aperol steht nicht links.",
			"Charly sitzt nicht in der Mitte.",
			"Veri sitzt direkt neben Charly.",
			"Kathrin trinkt keinen Aperol.",
			"Der nächste Hinweis ist bei Charly versteckt."
		],
		positions: ["links", "mitte", "rechts"],
		people: ["Veri", "Kathrin", "Charly"],
		drinks: ["Wasser", "Kaffee", "Aperol"],
		solution: {
			left: {
				person: "Kathrin",
				drink: "Wasser"
			},
			middle: {
				person: "Veri",
				drink: "Kaffee"
			},
			right: {
				person: "Charly",
				drink: "Aperol"
			}
		},
		unlockPassword: "Charly",
		nextHint: "Richtig! Charly sitzt [PLATZ]. Gehe dorthin zum nächsten Hinweis.",
		quote:
			"\"Ein guter Detektiv löst das Rätsel - ein exzellenter weiß, welcher Platz ihn als nächstes führt. Ohne Hinweis.\" - Professor H. Layton"
	},
	{
		id: 6,
		number: "❖ RÄTSEL NR. 006 ❖",
		title: "Die vergessenen Zeiten",
		subtitle: "Ein Abenteuer für eine Meisterknifflerin",
		pikarat: "90 PIKARAT",
		type: "clock-word-puzzle",
		intro:
			"\"Nicht jede Zeit ist zufällig. Manche Daten tragen Bedeutung - wenn man weiß, wohin man blickt.\"",
		riddleText:
			"Meine liebe Sarah, manchmal verstecken sich die wichtigsten Hinweise dort, wo man sie am wenigsten erwartet. Ordne jeder Uhr den richtigen Worten zu. Die markierten Buchstaben ergeben ein Lösungswort.",
		solution: "SLEEP",
		finalLength: 5,
		finalHint: "Where _ _ _ _ _ is found, there too watches the fish.",
		unlockPassword: "Schatulle",
		nextHint: "Richtig! Du hast die letzte Erinnerung gefunden.",
		clocks: [
			{
				image: "assets/images/clocks/clock1.jpg",
				answer: "SARAH",
				markedLetters: [0]
			},
			{
				image: "assets/images/clocks/clock2.jpg",
				answer: "ELLEN",
				markedLetters: [1, 3]
			},
			{
				image: "assets/images/clocks/clock3.jpg",
				answer: "PETER",
				markedLetters: [1]
			},
			{
				image: "assets/images/clocks/clock4.jpg",
				answer: "RALPH",
				markedLetters: [3]
			}
		],
		quote:
			"\"Ein guter Detektiv sieht die Zeit. Ein exzellenter erkennt, was sie verschweigt.\" - Professor H. Layton"
	}
];
