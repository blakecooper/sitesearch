const noResultsMessage = "No results found";
const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

let dictionary = { "a": [], "b": [], "c": [], "d": [], "e": [], "f": [], "g": [], "h": [], "i": [], "j": [], "k": [], "l": [], "m": [], "n": [], "o": [], "p": [], "q": [], "r": [], "s": [], "t": [], "u": [], "v": [], "w": [], "x": [], "y": [], "z": [] };

let results = [];
let resultsHTML = "";
let shiftTable = [];
let windowBeginsAtIdx = 0;
let currentCharIdx = 0;

function init() {
	makedictionary();
};

function makedictionary() {
	for (let term of terms) {
		let firstLetter = term.substr(0,1);
		dictionary[firstLetter.toLowerCase()].push(term);
	};
};

function search() {
	let needle = $("search").value;
	results = [];
	
	resetResultsDisplay();

	if (needle.length < 2) {
		if (needle.length === 1) {
			for (let term of dictionary[needle]){
				results.push(term);
			};
		}
	} else {
		updateShiftTable(needle);
		
		for (let haystack of terms) {
			if (isFoundIn(needle, haystack)) {
				results.push(haystack);
			};
		};
	};

	if (results.length === 0 && needle.length > 1) {
		$("results").innerHTML = noResultsMessage;
	} else {
		resultsHTML = "";
		for (let result of results) {
			resultsHTML = resultsHTML + "<br>" + result;
		};
		
		$("results").innerHTML = resultsHTML;
	};
};

function resetResultsDisplay() {	
	$("results").innerHTML = "";
};

function updateShiftTable(needle) {

	for (let i = 0; i < needle.length; i++) {
		shiftTable[i] = {};
		
		for (let letter of alphabet) {
			if (i === 0) {
				shiftTable[i][letter] = -1;	
			} else {
				shiftTable[i][letter] = shiftTable[i-1][letter];	
			};
		};
		
		shiftTable[i][needle.substr(i-1,1).toLowerCase()] = i-1;

	};

};

function isFoundIn(needle, haystack) {
	windowBeginsAtIdx = 0;
	currentCharIdx = needle.length - 1;
	
	while ((windowBeginsAtIdx + currentCharIdx) < haystack.length + 1) {

		if (charsAreEqual(needle, haystack)) {
			currentCharIdx = 0;

			if (charsAreEqual(needle, haystack)) {
				currentCharIdx = needle.length - 2;

				while (currentCharIdx > 0) {
					if (charsAreEqual(needle, haystack)) {
						currentCharIdx--;
					} else {
						shift(currentCharIdx, getCurrentHaystackChar(haystack));
						break;
					};
				};
				
				if (currentCharIdx < 1 ) {
					return true;
				};
			} else {
				shift(currentCharIdx, getCurrentHaystackChar(haystack));
			};
		} else {
			shift(currentCharIdx, getCurrentHaystackChar(haystack));
		};
	};

	return false;
};

function charsAreEqual(needle, haystack) {
	return needle.substr(currentCharIdx,1).toLowerCase() === haystack.substr(windowBeginsAtIdx + currentCharIdx,1).toLowerCase();
};

function getCurrentHaystackChar (haystack) {
	return haystack.substr(windowBeginsAtIdx + currentCharIdx,1).toLowerCase();
};

function shift(needleCharIdx, badChar) {

	let shiftOffset = shiftTable[needleCharIdx][badChar];

	if (typeof shiftOffset === "undefined") {
		windowBeginsAtIdx++;
	} else {
		if (shiftOffset === -1) {
			windowBeginsAtIdx += needleCharIdx + 1;
		} else {
			windowBeginsAtIdx += needleCharIdx - shiftTable[needleCharIdx][badChar];
		};
	};
};

function $(id) {
	return document.getElementById(id);
};
