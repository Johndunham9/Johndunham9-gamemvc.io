
var characterList = [];

var nextCharacterId = 1000;

function Character(
    name,
    race,
    charClass,
    gender,
    isHanded
) {
    this.id = nextCharacterId++;
    this.name = name;
    this.race = race;
    this.charClass = charClass;
    this.gender = gender;
    this.isHanded = isHanded;
};

function modelCreateCharacter(
    name,
    race,
    charClass,
    gender,
    isHanded
) {
    var newCharacter = new Character(name, race, charClass, gender, isHanded);
    characterList.push(newCharacter);
    return newCharacter;
};

function modelGetAllCharacters() {
    return characterList;
};

function modelGetCharacter(id) {
    for (x in characterList) {
        if (characterList[x].id === id) {
            return characterList[x];
        };
    }

    return undefined;
}

function modelUpdateChar(id, name, race, charClass, gender, isHanded) {
    var char = modelGetCharacter(id);
    if (!char) {
        return undefined
    }
    char.id = id
    char.name = name;
    char.race = race;
    char.charClass = charClass;
    char.gender = gender;
    char.isHanded = isHanded;

    return char;
}

function modelDeleteChar (id) {
    for (var x in characterList) {
        if (characterList[x].id === id) {
            characterList.splice(x, 1);
            break;
        }
    }
}