function onPageLoad() {
    // Wire all event handlers
    document.getElementById("createBtn").onclick = onCreateBtnClicked;
    document.getElementById("cancelBtn").onclick = onCancelBtnClicked;
    document.getElementById("newBtn").onclick = onNewBtnClicked;
    document.getElementById("reroll").onclick = onRerollClicked;

    // Populate table
    var items = modelGetAllCharacters();
    for (var i = 0; i < items.length; i++) {
        addTableItem(items[i])
    }

    // Resets the input form
    clearInputForm();
};

function onNewBtnClicked() {
    characterStatsDoer()
    document.getElementById("characterEditArea").style.display = "block";
    document.getElementById("characterListArea").style.display = "none";
    document.getElementById("createBtn").style.display = "inline";
    document.getElementById("herocreator").innerText =  "Hero Creator";
    document.getElementById("updateBtn").style.display = "none";
}

function onCancelBtnClicked() {
    clearInputForm();
}

function onCreateBtnClicked() {
    if (!validateControls()) {
        return;
    }

    var form = document.forms["editForm"];
    var newCharacter = modelCreateCharacter(
        form.characterName.value,
        form.raceSelect.value,
        form.classSelect.value,
        form.genderMaleRadio.checked,
        form.handedCheckbox.checked,
    );

    addTableItem(newCharacter);

    clearInputForm();
}

function onRerollClicked() {
    characterStatsDoer()
}


function addTableItem(character) {
    var table = document.getElementById("characterTable");

    var row = table.insertRow(table.rows.length);
    row.id = 'row' + character.id;

    var cell = row.insertCell(0);
    cell.innerText = character.name

    var cell = row.insertCell(1);
    cell.innerText = character.race

    var cell = row.insertCell(2);
    cell.innerText = character.charClass

    var cell = row.insertCell(3);
    cell.innerText = character.gender? "Male" : "Female";

    var editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.innerText = "Edit";
    editBtn.onclick = function () {
        onEditBtnClicked(character.id);
    }

    var cell = row.insertCell(4);
    cell.appendChild(editBtn);

    var deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = function() {
        onDeleteBtnClicked(character.id);
    }

    cell = row.insertCell(4);
    cell.appendChild(deleteBtn);
}

// Edit Function
function onEditBtnClicked(id) {
    // Fetch our character record from the store
    var character = modelGetCharacter(id);
    if (!character) {
        alert("Unable to find Character with ID" + id)
    }

    // Set the form's title
    document.getElementById("herocreator").innerText =  "Hero Edit";

    // Populate all form conrols
    var form = document.forms["editForm"];
    
    // Grabs the Character name
    form.characterName.value = character.name;

    for (var race in form.raceSelect.options) {
        var option = form.raceSelect.options[race];
        if (option.value === character.race) {
            option.selected = true;
        }
    }
    
    for (var clss in form.classSelect.options) {
        var option = form.classSelect.options[clss];
        if (option.value === character.charClass) {
            option.selected = true;
        }
    }

    // Grabs the gender
    if (character.gender) {
        form.gender[0].checked = true;
    } 
    else {
        form.gender[1].checked = true;
    }

    form.handedCheckbox.checked = character.handedCheckbox; 

    // Show the Form, Hide the contact list.
    document.getElementById("characterEditArea").style.display = "block";
    document.getElementById("characterListArea").style.display = "none";
    document.getElementById("createBtn").style.display = "none";

    var updateBtn = document.getElementById("updateBtn");
    updateBtn.style.display = "inline";
    updateBtn.onclick = function() {
        onUpdateBtnClick(character.id);
    }
}

// For the update character button

function onUpdateBtnClick(id) {
    if (!validateControls()) {
        return;
    }

    var form = document.forms["editForm"];
    var character = modelUpdateChar(
        id,
        form.characterName.value,
        form.raceSelect.value,
        form.classSelect.value,
        form.genderMaleRadio.checked,
        form.handedCheckbox.checked
    );

    if (!character) {
        alert("Unable to update character with ID=" + id)
        return;
    } 

    // Update the row in the table
    let tr = document.getElementById("row" + id)
    tr.childNodes[0].innerText = character.name;
    tr.childNodes[1].innerText = character.race;
    tr.childNodes[2].innerText = character.charClass;
    tr.childNodes[3].innerText = character.gender ? "Male" : "Female";

    // Reset the form
    clearInputForm();
}

//Delete Function
function onDeleteBtnClicked(id) {
    var character = modelGetCharacter(id);
    if (!character) {
        alert("Unable to find character ID" + id);
        return;
    }

    if (!confirm("Are you sure you want to delete " + character.name)) {
        return;
    }

    modelDeleteChar(id);
    var tr = document.getElementById("row" + character.id);
    tr.remove();
}

function validateControls() {
    var form = document.forms['editForm'];
    var isValidated = true;

    if (form.characterName.value === "") {
        document.getElementById("characterNameError").innerText = "Character name is required";
        isValidated = false;
    } else {
        document.getElementById("characterNameError").innerText = "";
    }

    if (form.raceSelect.value === "") {
        document.getElementById("raceError").innerText = "Race is required";
        isValidated = false;
    } else {
        document.getElementById("raceError").innerText = "";
    }

    if (form.classSelect.value === "") {
        document.getElementById("classError").innerText = "Class is required";
        isValidated = false;
    } else {
        document.getElementById("classError").innerText = "";
    }

    if (!form.genderMaleRadio.checked && !form.genderFemaleRadio.checked) {
        document.getElementById("genderError").innerText = "Gender not given";
        isValidated = false;
    } else {
        document.getElementById("genderError").innerText = "";
    }

    return isValidated;
}

function clearInputForm() {
    document.getElementById("characterEditArea").style.display = "none";
    document.getElementById("characterListArea").style.display = "block";

    var form = document.forms["editForm"];

    form.characterName.value = "";
    document.getElementById("characterNameError").innerText = "";

    form.genderMaleRadio.checked = false;
    form.genderFemaleRadio.checked = false;
    document.getElementById("genderError").innerText = "";

    form.raceSelect.selectedIndex = -1;
    document.getElementById("raceError").innerText = "";

    form.classSelect.selectedIndex = -1;
    document.getElementById("classError").innerText = "";

    form.handedCheckbox.checked = false;
}

function roll() {
    var numberOfDice = 2;
    var numberOfSides = 6;
    var total = 0;

    for (i=numberOfDice; i>0; i--) {
      total += Math.floor(Math.random()*numberOfSides) + 1;
    }
  
    return total;
  }

function characterStatsDoer() {
    document.getElementById("strength").innerText = roll()
    document.getElementById("dexterity").innerText = roll()
    document.getElementById("constitution").innerText = roll()
    document.getElementById("intelligence").innerText = roll()
    document.getElementById("wisdom").innerText = roll()
    document.getElementById("charisma").innerText = roll()
    document.getElementById("statTotal").innerText = parseInt(document.getElementById("strength").innerText) +
                                                        parseInt(document.getElementById("dexterity").innerText) + 
                                                        parseInt(document.getElementById("constitution").innerText) + 
                                                        parseInt(document.getElementById("intelligence").innerText) + 
                                                        parseInt(document.getElementById("wisdom").innerText) + 
                                                        parseInt(document.getElementById("charisma").innerText);
}