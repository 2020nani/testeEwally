export default function verificaBoleto(linhaDigitavel) {
    let confirmaLinhaDigitavel = false;
    const campo1 = linhaDigitavel.substr(0, 9);
    const campo2 = linhaDigitavel.substr(10, 10);
    const campo3 = linhaDigitavel.substr(21, 10);
    const digitoVerificadorC1 = calculaDigitoVerificador(campo1);
    const digitoVerificadorC2 = calculaDigitoVerificador(campo2);
    const digitoVerificadorC3 = calculaDigitoVerificador(campo3);
    const boleto = campo1.substr(0, 4) + linhaDigitavel.substr(32, 1) + linhaDigitavel.substr(33, 14) + campo1.substr(4, 5) + campo2 + campo3
    const digitoVerificadorBoleto = calculaDigitoVerificadorBoleto(boleto)
    digitoVerificadorC1 == linhaDigitavel.substr(9, 1) && digitoVerificadorC2 == linhaDigitavel.substr(20, 1) &&
        digitoVerificadorC3 == linhaDigitavel.substr(31, 1) && digitoVerificadorBoleto == linhaDigitavel.substr(32, 1)
        ? confirmaLinhaDigitavel = true : confirmaLinhaDigitavel = false;
    let amountNaoFormatado = boleto.substr(9, 10).replace(/\b(0(?!\b))+/g, "")
    const amount = amountNaoFormatado.substr(0, amountNaoFormatado.length - 2) + "." + amountNaoFormatado.substr(amountNaoFormatado.length -2, 2)
    const expirationDate = verificaDataVencimentoBoleto(linhaDigitavel.substr(33, 4))

    const dados = {
        boleto,
        confirmaLinhaDigitavel,
        amount,
        expirationDate
    }
    return dados

}
/**
 *
 * @param {campo da linha_digitavel que retorna digito verificador} campo
 * @returns digito verificador da linha digitavel conforme campo recebido
 */
function calculaDigitoVerificador(campo) {

    let total = 0
    if (campo.length == 10) {
        for (let i = campo.length; i > 0; i--) {

            if (i % 2 == 0) {
                if (parseInt(campo.substr(i - 1, 1)) * 2 > 10) {
                    let valor = parseInt(campo.substr(i - 1, 1)) * 2
                    total += somarDigitos(valor)
                } else {
                    total += parseInt(campo.substr(i - 1, 1)) * 2
                }

            } else {
                total += parseInt(campo.substr(i - 1, 1)) * 1
            }
        }
        let dv = 10 - total % 10

        return dv
    } else {
        let total = 0
        if (campo.length == 9) {
            for (let i = campo.length; i > 0; i--) {

                if (i % 2 == 0) {
                    total += parseInt(campo.substr(i - 1, 1)) * 1

                } else {
                    if (parseInt(campo.substr(i - 1, 1)) * 2 > 10) {
                        let valor = parseInt(campo.substr(i - 1, 1)) * 2
                        total += somarDigitos(valor)
                    } else {
                        total += parseInt(campo.substr(i - 1, 1)) * 2
                    }

                }
            }
            let dv = 10 - total % 10

            return dv
        }
    }
}
/**
 *
 * @param {44 numeros que conteem o boleto} boleto
 * @returns digito verificador do boleto
 */
function calculaDigitoVerificadorBoleto(boleto) {
    let somaBlocos = 0
    const bloco1 = boleto.substr(36, 8)
    const bloco2 = boleto.substr(28, 8)
    const bloco3 = boleto.substr(20, 8)
    const bloco4 = boleto.substr(12, 8)
    const bloco5 = boleto.substr(3, 1) + boleto.substr(5, 7)
    const bloco6 = boleto.substr(0, 3)
    somaBlocos += multiplicaAlgarismosBoleto(bloco1) + multiplicaAlgarismosBoleto(bloco2) + multiplicaAlgarismosBoleto(bloco3)
        + multiplicaAlgarismosBoleto(bloco4) + multiplicaAlgarismosBoleto(bloco5) + multiplicaAlgarismosBoleto(bloco6)
    return 11 - somaBlocos % 11
}
/**
 *
 * @param {bloco de 8 algarismos extraidos do boleto} blocoBoleto
 * @returns valor da soma de cada valor contido no bloco do boleto multiplicado conforme seu peso
 */
function multiplicaAlgarismosBoleto(blocoBoleto) {
    let total = 0
    let fatorMultiplicador = 0
    if (blocoBoleto.length == 3) {
        fatorMultiplicador = 4
        for (let i = 0; i < blocoBoleto.length; i++) {
            total += blocoBoleto.substr(i, 1) * fatorMultiplicador
            fatorMultiplicador--
        }
    } else {
        fatorMultiplicador = 9
        for (let i = 0; i < 8; i++) {
            total += blocoBoleto.substr(i, 1) * fatorMultiplicador
            fatorMultiplicador--
        }
    }
    return total
}
/**
 *
 * @param {*} numero
 * @returns soma dos digitos do numero recebido
 */
function somarDigitos(numero) {
    var soma = 0;

    while (numero != 0) {
        soma += numero % 10;
        numero = parseInt(numero / 10); // <--- atenção
    }

    return soma;
}

/**
 *
 * @param {numero de dias passado da database especificado na linha digitavel} numeroDias
 * @returns data de vencimento do boleto
 */
function verificaDataVencimentoBoleto(numeroDias) {
    const dataBaseVerificarVencimento = new Date('1997-10-07');
    let milissegundosDataVencimento = (Math.ceil(numeroDias * (1000 * 60 * 60 * 24)))
    let dataVencimento = new Date(milissegundosDataVencimento + dataBaseVerificarVencimento.getTime())
    let ano = dataVencimento.getFullYear()
    let month
    if(dataVencimento.getMonth() + 1 <= 9) month = "0" + `${dataVencimento.getMonth() + 1}`
    else month = dataVencimento.getMonth() + 1
    let dia = dataVencimento.getDate() + 1
    return (dataVencimento.getFullYear() + "-" + (( month )) + "-" + (dia))

}