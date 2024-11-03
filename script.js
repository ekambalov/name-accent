// 1. Находим элементы на странице
const inputData = document.querySelector('.name'); // Инпут с классом "name"
const checkBtn = document.querySelector('.check'); // Кнопка с классом "check"

// Фугкцыя якая спрацоўвае пры націску: 
function btnClick() {
    const names = (inputData.value + '');
    let result = processStringWithAccent(names);
    updateResultDiv(result);
    console.log(result);
}

// 2. Алгарытм пошуку націска
function findAccent(a) {

    let accent = 0;
    if (a == '') return;
    if (!isBelarusianText(a)) return -1;
    if (findO(a) != -1) {
        accent = findO(a);
    } else if (findYo(a) != -1) {
        accent = findYo(a);
    } else if (checkEnding(a) != -1) {
        accent = checkEnding(a);
    } else {
        accent = findSpecialVowelPosition(a);
    }
    if (accent == -1) {
        console.log('няма галосных нешта не так');
        return NaN;
    }
    return accent;

}

function findO(word) {
    const oindex = word.lastIndexOf('о');
    const Oindex = word.lastIndexOf('О');
    if (oindex <= Oindex) return Oindex;
    return oindex;
}

function findYo(word) {
    const yoIndex = word.lastIndexOf('ё');
    const YoIndex = word.lastIndexOf('Ё');
    if (yoIndex <= YoIndex) return YoIndex;
    return yoIndex;
}

function checkEnding(word) {
    // Правяраем, што уведзенае значэнне з'яўляецца радком і мае дастатковую даўжыню
    if (typeof word !== 'string' || word.length < 2) {
        return -1;
    }

    // Пералічваем зададзеныя канчаткі
    const endings = ['ай', 'ан', 'ой', 'уй', 'эй'];

    // Правяраем, ці заканчваецца слова на адзін з канчаткаў
    for (const ending of endings) {
        if (word.endsWith(ending)) {
            // Вяртаем парадкавы нумар перадапошняй літары
            return word.length - 2;
        }
    }

    // Калі ні адзін з канчаткаў не супадае
    return -1;
}

function findSpecialVowelPosition(word) {
    // Спіс галосных літар беларускага алфавіту
    const vowels = 'аеёіоуыэюяАЕЁІОУЫЭЮЯ';
    // Спіс глухіх літар
    const voicelessConsonants = 'пхтшчсцкфПХТШЧСЦКФ';

    // Масіў для захоўвання індэксаў усіх галосных літар у слове
    const vowelIndices = [];

    // Прайдзем па ўсіх літарах у слове і знойдзем галосныя
    for (let i = 0; i < word.length; i++) {
        if (vowels.includes(word[i])) {
            vowelIndices.push(i); // Дадаем індэкс літары, калі гэта галосная
        }
    }

    // Праверка на колькасць галосных літар
    if (vowelIndices.length === 0) {
        return -1; // Калі няма галосных
    } else if (vowelIndices.length === 1) {
        return vowelIndices[0]; // Калі толькі адна галосная
    } else {
        // Калі галосных больш за адну, знаходзім перадапошнюю галосную
        const preLastVowelIndex = vowelIndices[vowelIndices.length - 2];
        const preLastVowel = word[preLastVowelIndex];

        // Калі перадапошняя галосная НЕ "і", "І", "у", "У", вяртаем яе індэкс
        if (!['і', 'І', 'у', 'У'].includes(preLastVowel)) {
            return preLastVowelIndex;
        }

        // Праверка на глухія літары злева і справа
        const leftLetter = word[preLastVowelIndex - 1];
        const rightLetter = word[preLastVowelIndex + 1];

        if (
            voicelessConsonants.includes(leftLetter) &&
            voicelessConsonants.includes(rightLetter)
        ) {
            // Калі абедзве літары злева і справа ад перадапошняй галоснай з’яўляюцца глухімі
            return vowelIndices[vowelIndices.length - 1];
        } else {
            // У іншых выпадках вяртаем парадкавы нумар перадапошняй галоснай
            return preLastVowelIndex;
        }
    }
}

// функцыя дадае націск у слова
function addAccent(word) {
    let position = findAccent(word);
    if (position == -1) return;
    // Правяраем, ці пазіцыя знаходзіцца ў межах даўжыні слова
    if (position < 0 || position >= word.length) {
        return "Памылка: пазіцыя па-за межамі слова";
    }

    // Спецсімвал націску
    const accent = "\u0301";

    // Дадаем націск у пазначаную пазіцыю
    return word.slice(0, position + 1) + accent + word.slice(position + 1);
}
// фунцыя якая улічвае прабелы
function processStringWithAccent(inputString) {
    // Разбіваем радок на масіў, выкарыстоўваючы як падзельнікі прабелы і рыскі, захоўваючы іх
    const parts = inputString.split(/([ -])/);

    // Пройдземся па масіве і прымяняем addAccent да кожнага элемента, які не з’яўляецца прабелам ці рыскай
    const accentedParts = parts.map(part => {
        if (part === ' ' || part === '-') {
            return part; // Пакідаем прабелы і рыскі як ёсць
        } else {
            return addAccent(part); // Дадаем націск да слова
        }
    });

    // Аб'ядноўваем масіў назад у радок
    return accentedParts.join('');
}
// функцыя праверкі тыпу данных
function isBelarusianText(input) {
    // 1. Проверяем, что input является строкой
    if (typeof input !== 'string') {
        alert('Увядзіце карэктнае імя');

    }

    // 2. Проверяем, что input состоит только из белорусских букв
    const belarusianPattern = /^[А-ЯЁІЎа-яёіў]+$/;
    if (belarusianPattern.test(input)) return true;
    alert('Увядзіце карэктнае імя');
    return false;
}

function updateResultDiv(newText) {
    // Знаходзім элемент з класам 'result'
    const resultDiv = document.querySelector('.result');

    // Правяраем, ці элемент існуе
    if (resultDiv) {
        // Абнаўляем тэкст элемента
        resultDiv.textContent = newText;
    } else {
        console.error("Элемент з класам 'result' не знойдзены на старонцы.");
    }
}

// 5. Добавляем обработчик события на кнопку
checkBtn.addEventListener('click', btnClick);
