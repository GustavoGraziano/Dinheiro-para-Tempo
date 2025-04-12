function formatToMoney(value) {
    const numericValue = value.replace(/\D/g, "")
    const integer = parseInt(numericValue || "0")
    const formatted = (integer / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    })
    return formatted.replace("R$", "").trim()
}

function getFloatFromFormatted(value) {
    const cleaned = value.replace(/\./g, "").replace(",", ".")
    return parseFloat(cleaned) || 0
}

function converterReaisParaTempo(valor, incluirCentavos = true) {
    const totalSegundos = incluirCentavos
        ? Math.floor(valor * 60)
        : Math.floor(valor) * 60

    const horas = Math.floor(totalSegundos / 3600)
    const minutos = Math.floor((totalSegundos % 3600) / 60)
    const segundos = totalSegundos % 60

    return { horas, minutos, segundos }
}

function atualizarTimerComValor(valor) {
    const timer = document.getElementById("timer")
    const converterCentavos = document.getElementById("convert-centavos").checked

    const { horas, minutos, segundos } = converterReaisParaTempo(valor, converterCentavos)

    const h = String(horas).padStart(2, "0")
    const m = String(minutos).padStart(2, "0")
    const s = String(segundos).padStart(2, "0")

    const tempoFormatado = `${h}:${m}:${s}`

    timer.textContent = tempoFormatado
    timer.setAttribute("datetime", tempoFormatado)
}

function setupMoneyInput(input, onInputCallback) {
    let rawValue = ""

    input.addEventListener("input", (e) => {
        const newValue = e.target.value.replace(/\D/g, "")
        rawValue = newValue
        input.value = formatToMoney(rawValue)

        if (onInputCallback && input.id === "initial-money") {
            const valor = getFloatFromFormatted(input.value)
            onInputCallback(valor)
        }
    })

    input.addEventListener("blur", () => {
        if (rawValue === "") {
            input.value = "0,00"
        }
    })

    // Forçar o cursor ao final do input
    input.addEventListener("focus", () => {
        const length = input.value.length
        setTimeout(() => {
            input.setSelectionRange(length, length)
        }, 0)
    })

    if (input.value.trim() === "") {
        input.value = "0,00"
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const initialMoneyInput = document.getElementById("initial-money")
    const addMoneyInput = document.getElementById("add-money")
    const confirmButton = document.querySelector(".confirm")
    const checkbox = document.getElementById("convert-centavos")

    setupMoneyInput(initialMoneyInput, atualizarTimerComValor)
    setupMoneyInput(addMoneyInput)

    checkbox.addEventListener("change", () => {
        const valor = getFloatFromFormatted(initialMoneyInput.value)
        atualizarTimerComValor(valor)
    })

    confirmButton.addEventListener("click", () => {
        const valorInicial = getFloatFromFormatted(initialMoneyInput.value)
        const valorAdicionar = getFloatFromFormatted(addMoneyInput.value)

        const novoValor = valorInicial + valorAdicionar

        initialMoneyInput.value = formatToMoney((novoValor * 100).toFixed(0))
        addMoneyInput.value = "0,00"

        atualizarTimerComValor(novoValor)
    })
})