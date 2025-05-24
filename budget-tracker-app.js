//@ts-nocheck
//! 🛠 Personal Budget Tracker Challenge (Phase 10 – add theme)
/*
📌 Challenge Requirements:
add theme and store the preference in local storage
*/

const toggleBtn = document.getElementById('darkModeToggle');
const budgetChart = document.getElementById('budgetChart');
const root = document.documentElement;

const userNameElement = document.getElementById('userName');
const incomeElement = document.getElementById('income');
const numExpensesElement = document.getElementById('numExpenses');
const startBudgetElement = document.getElementById('startBudget');
const expenseInputsElement = document.getElementById('expenseInputs');
const clearBudgetElement = document.getElementById('clearBudget');
const resetBudgetElement = document.getElementById('resetBudget');
const calculateBudgetElement = document.getElementById('calculateBudget');
const budgetResultElement = document.getElementById('budgetResult');

toggleBtn.addEventListener('click', toggleDarkMode);
startBudgetElement.addEventListener('click', getExpenses);
calculateBudgetElement.addEventListener('click', startCalculateBudget);
clearBudgetElement.addEventListener('click', clearBudget);
resetBudgetElement.addEventListener('click', fullReset);

userNameElement.addEventListener('input', validateForm);
incomeElement.addEventListener('input', validateForm);
numExpensesElement.addEventListener('input', validateForm);

startBudgetElement.disabled = true;

function validateForm() {
  const incomeValid = parseFloat(incomeElement.value) > 0;
  const userNameValid = userNameElement.value.trim().length > 0;
  const numberOfExpensesValid = parseInt(numExpensesElement.value) >= 0;

  startBudgetElement.disabled = !(
    incomeValid &&
    userNameValid &&
    numberOfExpensesValid
  );
}

function fullReset() {
  userNameElement.value = '';
  incomeElement.value = '';
  numExpensesElement.value = '';
  clearBudgetFromLocal();
  budgetResultElement.innerHTML = '';
  expenseInputsElement.innerHTML = '';
  calculateBudgetElement.style.display = 'none';
  clearBudgetElement.style.display = 'none';
  // startBudgetElement.disabled = true;
}

// save the userBudget data to the localStorage
function saveBudgetToLocal(userBudget) {
  localStorage.setItem('userBudget', JSON.stringify(userBudget));
}

// get the userBudget data from the localStorage
function getBudgetFromLocal() {
  const savedBudget = localStorage.getItem('userBudget');
  return savedBudget ? JSON.parse(savedBudget) : null;
}

// clear the userBudget data from the localStorage
function clearBudgetFromLocal(userBudget) {
  localStorage.removeItem('userBudget');
  alert('Budget data cleared from local storage');
}

function clearBudget() {
  clearBudgetFromLocal();
  budgetResultElement.innerHTML = '';
  expenseInputsElement.innerHTML = '';
  calculateBudgetElement.style.display = 'none';
  clearBudgetElement.style.display = 'none';
}

function isValidNumber(value) {
  return !isNaN(value) && value >= 0;
}

function getExpenses() {
  const numberOfExpenses = numExpensesElement.value;
  // expenseInputsElement.innerHTML = '';

  if (isNaN(numberOfExpenses) || numberOfExpenses < 0) {
    alert('⚠️ Enter a valid number of expenses.');
    return;
  }

  for (let i = 1; i <= numberOfExpenses; i++) {
    let expenseLabel = document.createElement('label');
    expenseLabel.textContent = `Enter expense ${i}: `;

    let expenseInput = document.createElement('input');
    expenseInput.type = 'number';
    expenseInput.classList.add('expenseValue');

    expenseInputsElement.appendChild(expenseLabel);
    expenseInputsElement.appendChild(expenseInput);
    expenseInputsElement.appendChild(document.createElement('br'));
  }
  calculateBudgetElement.style.display = 'inline-block';
  clearBudgetElement.style.display = 'inline-block';
}

function calculateTotalExpenses(expensesArray) {
  console.log(expensesArray);
  let total = 0;
  for (const expense of expensesArray) {
    total = total + expense;
  }
  return total;
}

function calculateTax(income, rate = 0.1) {
  return income * rate;
}
function calculateNetIncome(income, tax) {
  return income - tax;
}
function calculateBalance(netIncome, totalExpenses) {
  return netIncome - totalExpenses;
}
function calculateSavings(balance, rate = 0.2) {
  return balance * rate;
}

function getFinancialStatus(savings) {
  let financialStatusMessage = '';
  if (savings >= 1000) {
    financialStatusMessage = '💰 Excellent! You are saving well!';
  } else if (savings >= 500) {
    financialStatusMessage = '✅ Good! You have a decent savings amount.';
  } else if (savings >= 100) {
    financialStatusMessage =
      '⚠️ Needs Improvement. Consider reducing expenses.';
  } else {
    financialStatusMessage = '🚨 Critical! Your savings are too low!';
  }
  return financialStatusMessage;
}

function checkOverSpending(totalExpenses, income) {
  return totalExpenses > income
    ? '⚠️ Warning: You are spending more than your income!'
    : '';
}

// Main part

function startCalculateBudget() {
  const userBudget = {
    userName: userNameElement.value,
    income: parseFloat(incomeElement.value),
    numberOfExpenses: parseInt(numExpensesElement.value),
    expenses: [],
    totalExpenses: 0,
    tax: 0,
    netIncome: 0,
    balance: 0,
    savings: 0,
    financialStatusMessage: '',
    overspendingMessage: '',
  };

  // get expenses
  let expenseInputs = document.getElementsByClassName('expenseValue');
  for (let i = 0; i < expenseInputs.length; i++) {
    let expense = parseFloat(expenseInputs[i].value);
    userBudget.expenses.push(isNaN(expense) || expense < 0 ? 0 : expense);
  }
  calculateBudget(userBudget);
  saveBudgetToLocal(userBudget);
  displayResults(userBudget);
}

function calculateBudget(userBudget) {
  userBudget.totalExpenses = calculateTotalExpenses(userBudget.expenses);
  userBudget.tax = calculateTax(userBudget.income);
  userBudget.netIncome = calculateNetIncome(userBudget.income, userBudget.tax);
  userBudget.balance = calculateBalance(
    userBudget.netIncome,
    userBudget.totalExpenses
  );
  userBudget.savings = calculateSavings(userBudget.balance);
  userBudget.financialStatusMessage = getFinancialStatus(userBudget.savings);
}

function displayResults(userBudget) {
  budgetResultElement.innerHTML = `
<p>📊 Personal Budget Tracker</p>
<p> User: ${userBudget.userName} </p>
<p> 💰 Total Income: $${userBudget.income} </p>
<p> 💸 Total Expenses: $${userBudget.totalExpenses} </p>
<p> 📉 Tax Deducted (10%): $${userBudget.tax} </p>
<p> 💲 Net Income After Tax: $${userBudget.netIncome} </p>
<p> 🟢 Remaining Balance: $${userBudget.balance} </p>
<p> Savings (20% of balance): $${userBudget.savings}</p> 
<p>${userBudget.financialStatusMessage} </p>
  `;
}

function toggleDarkMode() {
  const isDark = root.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function runBudgetTracker() {
  const savedBudget = getBudgetFromLocal();
  if (savedBudget) displayResults(savedBudget);
  if (localStorage.getItem('theme') === 'dark') {
    root.classList.add('dark-mode');
  }
  renderChart(savedBudget);
}

function renderChart(savedBudget) {
  const ctx = budgetChart.getContext('2d');
  if (window.budgetPieChart) window.budgetPieChart.destroy();
  window.budgetPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['income', 'expenses', 'savings'],
      datasets: [
        {
          label: 'Budget Breakdown',
          data: [
            savedBudget.income,
            savedBudget.totalExpenses,
            savedBudget.savings,
          ],
          backgroundColor: ['#e74c3c', '#27ae60', '#f1c40f'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Income Distribution',
        },
      },
    },
  });
}

window.addEventListener('load', runBudgetTracker);
