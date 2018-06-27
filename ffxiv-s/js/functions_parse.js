// Encounter Header
var encounterDefine = "({title}:<span class='enc'>{duration}</span>) Total: <span class='enc'>{dps}dps</span> | <span class='enc'>{enchps}hps</span>, MVP: <span class='enc'>{maxhit}</span> <hr>";

// HTML Encounter always set to true
var useHTMLEncounterDefine = true;

// Table Header Keys
var headerDefine =
[
	{ html: "<span class='tableHeader'>name</span>", width: "35%", align: "left" },
	{ html: "<span class='tableHeader'>info</span>", width: "65%", align: "left" },
];

// Rows & Columns
var bodyDefine =
[
	{ html: "<img src='../images/glow/{JobOrName}.png' style='width=14px;height:14px;vertical-align:text-bottom;' /> <span class='{JobOrName}'>{name}</span>", width: "", align: "left", effect: myCharacterEffect },
	{ text: "{encdps}dps (C:{crithit%}, DH:{DirectHitPct}) [{maxhit}]", width: "", align: "left"},
	/*	
		if you want to add the hps in the context, simply add {enchps} in the text above in the quotations. 
		although i wouldn't recommend it unless you are planning to have the parse width fit all the information as it will cut off some of the details.
	*/
];

// Your personal color setup function
function myCharacterEffect(cell, combatant, index) {
	var myname = "YOU";
	if (myname == combatant["name"]) {
		$(cell).parents("tr").addClass("mc");
	}
}

//Renders the table chart
function graphRendering(table) {
	$("tr:eq(0) > td.graphCell", table).each(function(){
		var max = 0;
		$("tr > td:nth-child("+($("tr:eq(0) td", table).index($(this))+1)+")", table).each(function(){
			max = (max < parseInt($(this).text().replace(/[^\d]/g,""))) ? parseInt($(this).text().replace(/[^\d]/g,"")) : max;
		});
		$("tr > td:nth-child("+($("tr:eq(0) td", table).index($(this))+1)+")", table).each(function(){
			p = (max == 0) ? "0%" : (parseInt($(this).text().replace(/[^\d]/g,"")) / max *100) + "%";
			$(this).css("background-size", p+" 100%, 100% 100%");
		});
	});
}

document.addEventListener("onOverlayDataUpdate", function (e) {
	update(e.detail);
});

// Update function
function update(data) {
	updateEncounter(data);
	if (document.getElementById("combatantTableHeader") == null) {
		updateCombatantListHeader();
	}
	updateCombatantList(data);
}

// Updates the encounter
function updateEncounter(data) {
	var encounterElem = document.getElementById('encounter');
	
	var elementText;
	if (typeof encounterDefine === 'function') {
		elementText = encounterDefine(data.Encounter);
		if (typeof elementText !== 'string') {
					console.log("updateEncounter: 'encounterDefine' is declared as function but not returns a value as string.");
				return;
				}
	} else if (typeof encounterDefine === 'string') {
		elementText = parseActFormat(encounterDefine, data.Encounter);
	} else {
		console.log("updateEncounter: Could not update the encounter element due to invalid type.");
		return;
	}
	
	if (!useHTMLEncounterDefine) {
		encounterElem.innerText = parseActFormat(encounterDefine, data.Encounter);
	} else {
		encounterElem.innerHTML = parseActFormat(encounterDefine, data.Encounter);
	}
}

// Updates combat header
function updateCombatantListHeader() {
	var table = document.getElementById('combatantTable');
	var tableHeader = document.createElement("thead");
	tableHeader.id = "combatantTableHeader";
	var headerRow = tableHeader.insertRow();

	for (var i = 0; i < headerDefine.length; i++) {
		var cell = document.createElement("th");
		
		if (typeof headerDefine[i].text !== 'undefined') {
			cell.innerText = headerDefine[i].text;
		} else if (typeof headerDefine[i].html !== 'undefined') {
			cell.innerHTML = headerDefine[i].html;
		}
		
		cell.style.width = headerDefine[i].width;
		cell.style.maxWidth = headerDefine[i].width;
		
		if (typeof headerDefine[i].span !== 'undefined') {
			cell.colSpan = headerDefine[i].span;
		}
		
		if (typeof headerDefine[i].align !== 'undefined') {
			cell.style["textAlign"] = headerDefine[i].align;
		}
		headerRow.appendChild(cell);
	}

	table.tHead = tableHeader;
}

// Updates combat players' list
function updateCombatantList(data) {

	var table = document.getElementById('combatantTable');
	var oldTableBody = table.tBodies.namedItem('combatantTableBody');
	var newTableBody = document.createElement("tbody");
	newTableBody.id = "combatantTableBody";
	
	var combatantIndex = 0;
	for (var combatantName in data.Combatant) {
		var combatant = data.Combatant[combatantName];
		combatant.JobOrName = combatant.Job || combatantName;
		var egiSearch = combatant.JobOrName.indexOf("-Egi (");
		
		if (egiSearch != -1) {
			combatant.JobOrName = combatant.JobOrName.substring(0, egiSearch);
		}
		else if (combatant.JobOrName.indexOf("Eos (") == 0) {
			combatant.JobOrName = "Eos";
		}
		else if (combatant.JobOrName.indexOf("Selene (") == 0) {
			combatant.JobOrName = "Selene";
		}
		else if (combatant.JobOrName.indexOf("Carbuncle (") != -1) {
			// currently no carbuncle pics
		}
		else if (combatant.JobOrName.indexOf(" (") != -1) {
			combatant.JobOrName = "choco";
		}
					
		var tableRow = newTableBody.insertRow(newTableBody.rows.length);
		for (var i = 0; i < bodyDefine.length; i++){
			var cell = tableRow.insertCell(i);
			
			if (typeof bodyDefine[i].text !== 'undefined') {
				var cellText;
				if (typeof bodyDefine[i].text === 'function') {
					cellText = bodyDefine[i].text(combatant, combatantIndex);
				} else {
					cellText = parseActFormat(bodyDefine[i].text, combatant);
				}
				cell.innerText = cellText;
			} else if (typeof bodyDefine[i].html !== 'undefined') {
				var cellHTML;
				if (typeof bodyDefine[i].html === 'function') {
					cellHTML = bodyDefine[i].html(combatant, combatantIndex);
				} else {
					cellHTML = parseActFormat(bodyDefine[i].html, combatant);
				}
				cell.innerHTML = cellHTML;
			}
			
			cell.style.width = bodyDefine[i].width;
			cell.style.maxWidth = bodyDefine[i].width;
			
			if (typeof(bodyDefine[i].align) !== 'undefined') {
				cell.style.textAlign = bodyDefine[i].align;
			}
			
			if (typeof bodyDefine[i].effect === 'function') {
				bodyDefine[i].effect(cell, combatant, combatantIndex);
			}
		}
		combatantIndex++;
	}

	graphRendering(newTableBody);

	if (oldTableBody != void(0)) {
		table.replaceChild(newTableBody, oldTableBody);
	}
	else {
		table.appendChild(newTableBody);
	}
}

// Miniparse format
function parseActFormat(str, dictionary)
{
	var result = "";

	var currentIndex = 0;
	do {
		var openBraceIndex = str.indexOf('{', currentIndex);
		if (openBraceIndex < 0) {
			result += str.slice(currentIndex);
			break;
		} else {
			result += str.slice(currentIndex, openBraceIndex);
			var closeBraceIndex = str.indexOf('}', openBraceIndex);
			if (closeBraceIndex < 0) {
				// parse error!
				console.log("parseActFormat: Parse error: missing close-brace for " + openBraceIndex.toString() + ".");
				return "ERROR";
			}
			else {
				var tag = str.slice(openBraceIndex + 1, closeBraceIndex);
				if (typeof dictionary[tag] !== 'undefined') {
					result += dictionary[tag];
				} else {
					console.log("parseActFormat: Unknown tag: " + tag);
					result += "ERROR";
				}
				currentIndex = closeBraceIndex + 1;
			}
		}
	} while (currentIndex < str.length);

	return result;
}