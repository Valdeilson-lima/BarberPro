import React from "react";

export function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
  let value = event.target.value;

  // Remove tudo que não for número
  value = value.replace(/\D/g, "");

  if (value) {
    value = (parseInt(value) / 100).toFixed(2);
    value = value.replace(".", ",");
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    event.target.value = "R$ " + value;
  }
}



/**
 * Converte um valor em reais (formato string) para centavos (formato numérico).
 *
 * @export
 * @param {string} amount - Valor em reais no formato string (ex: "R$ 50,00")
 * @returns {number} - Valor em centavos (ex: 5000)
 * @example
 * const cents = convertRealToCents("R$ 50,00");
 * console.log(cents); // 5000 
 */
export function convertRealToCents(amount: string) {
  const numericPrice = parseFloat(amount.replace(/\D/g, "").replace(",", "."));
  const cents = Math.round(numericPrice);
  return cents;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

export function formatValue(value: number) {
  return CURRENCY_FORMATTER.format(value / 100);
}


