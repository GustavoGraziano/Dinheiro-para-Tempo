const timerDisplay = document.getElementById("timer");
const initialMoneyInput = document.getElementById("initial-money");
const addMoneyInput = document.getElementById("add-money");
const confirmButton = document.getElementById("confirm");
const deleteButton = document.getElementById("delete");
const convertCentavosCheckbox = document.getElementById("convert-centavos");
const convertAnimCheckbox = document.getElementById("convert-anim");

let totalSeconds = 0;

// Função para formatar R$ para número
function parseMoney(value) {
    const cleaned = value.replace(/\./g, "").replace(",", ".");
    const number = parseFloat(cleaned);
    return isNaN(number) ? 0 : number;
}

// Função para formatar número para R$
function formatToMoney(value) {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Função para mover o cursor para o fim do input
function moveCursorToEnd(input) {
    const len = input.value.length;
    input.setSelectionRange(len, len);
}

// Converte R$ para segundos
function moneyToSeconds(money, converterCentavos = true) {
    const totalMinutes = converterCentavos ? money : Math.floor(money);
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    return minutes * 60 + (converterCentavos ? seconds : 0);
}

// Atualiza o cronômetro
function renderTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    timerDisplay.textContent = `${h}:${m}:${s}`;
    timerDisplay.setAttribute("datetime", `${h}:${m}:${s}`);
}

// Atualiza cronômetro com animação se ativada
function updateTimer(newSeconds) {
    const shouldAnimate = convertAnimCheckbox.checked;
    if (shouldAnimate) {
        animateTimer(totalSeconds, newSeconds);
    } else {
        totalSeconds = newSeconds;
        renderTime(totalSeconds);
    }
}

// Animação suave do cronômetro
function animateTimer(from, to) {
    const duration = 600; // duração da animação em ms
    const startTime = performance.now();

    function animate(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.round(from + (to - from) * progress);
        renderTime(current);
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            totalSeconds = to;
        }
    }

    requestAnimationFrame(animate);
}

// Setup dos inputs de dinheiro
function setupMoneyInput(input, onChange, disableLive = false) {
    let rawValue = "";

    input.addEventListener("input", (e) => {
        const newValue = e.target.value.replace(/\D/g, "");
        rawValue = newValue;

        const numeric = parseFloat((parseInt(rawValue || "0") / 100).toFixed(2));
        input.value = formatToMoney(numeric);

        moveCursorToEnd(input);

        if (!disableLive && typeof onChange === "function") {
            onChange(numeric);
        }
    });

    input.addEventListener("blur", () => {
        if (rawValue === "") {
            input.value = "0,00";
        }
    });

    if (input.value.trim() === "") {
        input.value = "0,00";
    }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    setupMoneyInput(initialMoneyInput, (value) => {
        const useCentavos = convertCentavosCheckbox.checked;
        updateTimer(moneyToSeconds(value, useCentavos));
    });

    setupMoneyInput(addMoneyInput, null, true);

    confirmButton.addEventListener("click", () => {
        const current = parseMoney(initialMoneyInput.value);
        const add = parseMoney(addMoneyInput.value);
        const newValue = current + add;

        initialMoneyInput.value = formatToMoney(newValue);
        addMoneyInput.value = "0,00";

        const useCentavos = convertCentavosCheckbox.checked;
        updateTimer(moneyToSeconds(newValue, useCentavos));
    });

    const deleteButton = document.querySelector(".delete");

    deleteButton.addEventListener("click", () => {
        initialMoneyInput.value = "0,00";
        totalSeconds = 0;
        updateTimer(0);
    });

    // Mover cursor pro fim ao clicar no input
    [initialMoneyInput, addMoneyInput].forEach(input => {
        input.addEventListener("focus", () => moveCursorToEnd(input));
    });

    // Atualizar cronômetro se mudar a opção de converter centavos
    convertCentavosCheckbox.addEventListener("change", () => {
        const current = parseMoney(initialMoneyInput.value);
        const useCentavos = convertCentavosCheckbox.checked;
        updateTimer(moneyToSeconds(current, useCentavos));
    });
});