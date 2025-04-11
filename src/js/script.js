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

function setupMoneyInput(input, onInputCallback) {
    let rawValue = ""

    input.addEventListener("input", (e) => {
        const newValue = e.target.value.replace(/\D/g, "")
        rawValue = newValue
        input.value = formatToMoney(rawValue)

        if (onInputCallback) {
            onInputCallback(getFloatFromFormatted(input.value))
        }
    })

    input.addEventListener("blur", () => {
        if (rawValue === "") {
            input.value = "0,00"
        }
    })

    if (input.value.trim() === "") {
        input.value = "0,00"
    }
}

function getFloatFromFormatted(value) {
    return parseFloat(value.replace(/\./g, "").replace(",", "."))
}

function converterReaisParaTempo(valor) {
    const totalMinutos = parseFloat(valor)
    const horas = Math.floor(totalMinutos / 60)
    const minutos = Math.floor(totalMinutos % 60)
    const segundos = Math.round((totalMinutos % 1) * 60)

    return { horas, minutos, segundos }
}

function atualizarTimerComValor(valor) {
    const timer = document.getElementById("timer")
    const { horas, minutos, segundos } = converterReaisParaTempo(valor)

    const h = String(horas).padStart(2, "0")
    const m = String(minutos).padStart(2, "0")
    const s = String(segundos).padStart(2, "0")

    const tempoFormatado = `${h}:${m}:${s}`

    timer.textContent = tempoFormatado
    timer.setAttribute("datetime", tempoFormatado)
}

document.addEventListener("DOMContentLoaded", () => {
    const initialMoneyInput = document.getElementById("initial-money")
    const addMoneyInput = document.getElementById("add-money")
    const confirmButton = document.querySelector(".confirm")

    // Atualiza timer com initialMoney automaticamente ao digitar
    setupMoneyInput(initialMoneyInput, (valor) => {
        atualizarTimerComValor(valor)
    })

    // Formata o addMoneyInput, mas sem atualizar o timer
    setupMoneyInput(addMoneyInput)

    // Botão de confirmação da adição de valor
    confirmButton.addEventListener("click", () => {
        const initialValue = getFloatFromFormatted(initialMoneyInput.value)
        const addValue = getFloatFromFormatted(addMoneyInput.value)

        const novoTotal = initialValue + addValue

        // Atualiza o input inicial com o novo valor somado
        initialMoneyInput.value = formatToMoney(novoTotal.toFixed(2))

        // Atualiza o cronômetro com o novo total
        atualizarTimerComValor(novoTotal)

        // Zera o campo de adição
        addMoneyInput.value = "0,00"
    })

    // Ao carregar, mostra o timer com o valor inicial
    const valorInicial = getFloatFromFormatted(initialMoneyInput.value)
    atualizarTimerComValor(valorInicial)
})
