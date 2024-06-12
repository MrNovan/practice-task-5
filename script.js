const API_KEY = 'c9b1a8b3c456f009680bf020';
const BASE_URL = 'https://v6.exchangerate-api.com/v6/';
const converterBtn = document.getElementById('converter-btn');
const converterResult = document.getElementById('converter-result');
const ratesList = document.getElementById('rates-list');
const baseCurrencySelect = document.getElementById('base-currency');
let baseCurrency = 'RUB';

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    const pageId = e.target.getAttribute('href').replace('#', '');
    document.querySelectorAll('.page').forEach((page) => {
      page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
  });
});

converterBtn.addEventListener('click', async () => {
  const inputValue = document.getElementById('converter-input').value.trim();
  const match = inputValue.match(/(\d+)\s+(\w{3})\s+in\s+(\w{3})/i);

  if (match) {
    const amount = match[1];
    const fromCurrency = match[2].toUpperCase();
    const toCurrency = match[3].toUpperCase();

    fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`)
      .then((response) => response.json())
      .then((data) => {
        converterResult.textContent = `${amount} ${fromCurrency} = ${data.conversion_result} ${toCurrency}`;
      })
      .catch((error) => console.error('Error:', error)); //eslint-disable-line
  } else {
    converterResult.textContent = 'Invalid format. Use format like "15 usd in rub".';
  }
});

async function updateRates() {
  const response = await fetch(`${BASE_URL}${API_KEY}/latest/${baseCurrency}`);
  const data = await response.json();
  const rates = data.conversion_rates;
  ratesList.innerHTML = '';
  Object.keys(rates).forEach((currency) => {
    const rate = rates[currency];
    const listItem = document.createElement('li');
    listItem.textContent = `1 ${baseCurrency} = ${rate} ${currency}`;
    ratesList.appendChild(listItem);
  });
}

baseCurrencySelect.addEventListener('change', async () => {
  baseCurrency = baseCurrencySelect.value;
  await updateRates();
});

updateRates();
