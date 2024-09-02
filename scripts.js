function saveExpense() {
  const amountInput = document.getElementById('amount');
  const categoryInput = document.getElementById('category');
  const dateInput = document.getElementById('date');
  const commentInput = document.getElementById('comment');

  const amount = amountInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const comment = commentInput.value;

  if (amount === '' || category === '' || date === '') {
    alert('Please fill in all fields.');
    return;
  }

  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  const expense = {
    id: Date.now(), // Unique ID
    amount: parseFloat(amount),
    category,
    date,
    comment
  };

  expenses.push(expense);

  localStorage.setItem('expenses', JSON.stringify(expenses));

  amountInput.value = '';
  categoryInput.selectedIndex = 0;
  dateInput.value = '';
  commentInput.value = '';

  alert('Expense saved successfully.');

  displayTotals();
  showCategoryExpenses(category);
}


function displayTotals() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const categoryTotals = {};

  // Calculate the totals for each category
  expenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });

  // Display the totals on the page
  const totalsDiv = document.getElementById('totals');
  totalsDiv.innerHTML = '';

  for (const category in categoryTotals) {
    const totalAmount = categoryTotals[category];
    const totalElement = document.createElement('p');
    totalElement.textContent = `${category}: ₹${totalAmount.toFixed(2)}`;
    totalElement.style.cursor = 'pointer';
    totalElement.onclick = () => showCategoryExpenses(category);
    totalsDiv.appendChild(totalElement);
  }
}

function showCategoryExpenses(category) {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const categoryExpensesDiv = document.getElementById('categoryExpenses');
  const selectedCategorySpan = document.getElementById('selectedCategory');
  const categoryExpensesList = document.getElementById('categoryExpensesList');

  const categoryExpenses = expenses.filter(expense => expense.category === category);

  selectedCategorySpan.textContent = category;
  categoryExpensesList.innerHTML = '';

  if (categoryExpenses.length === 0) {
    categoryExpensesList.innerHTML = 'No expenses for this category.';
  } else {
    categoryExpenses.forEach(expense => {
      const expenseItem = document.createElement('div');
      expenseItem.classList.add('expense-item');

      const deleteButton = document.createElement('div');
      deleteButton.classList.add('delete-button');
      deleteButton.innerHTML = `<button onclick="deleteExpense(${expense.id})">Delete</button>`;

      const editButton = document.createElement('div');
      editButton.classList.add('edit-button');
      editButton.innerHTML = `<button onclick="editExpense(${expense.id})">Edit</button>`;

      const expenseInfo = document.createElement('div');
      expenseInfo.classList.add('info');
      expenseInfo.innerHTML = `
        <strong>Date:</strong> ${expense.date}<br>
        <strong>Amount:</strong> ₹${expense.amount.toFixed(2)}<br>
        <strong>Comment:</strong> ${expense.comment || 'N/A'}`;

      expenseItem.appendChild(expenseInfo);
      expenseItem.appendChild(editButton);
      expenseItem.appendChild(deleteButton);

      categoryExpensesList.appendChild(expenseItem);
    });
  }

  categoryExpensesDiv.style.display = 'block';
}

function deleteExpense(id) {
  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses = expenses.filter(expense => expense.id !== id);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  displayTotals();
  const selectedCategory = document.getElementById('selectedCategory').textContent;
  showCategoryExpenses(selectedCategory);
}


function editExpense(id) {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const expense = expenses.find(expense => expense.id === id);

  if (expense) {
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;
    document.getElementById('date').value = expense.date;
    document.getElementById('comment').value = expense.comment;

    window.editingId = id;

    document.querySelector('.button-group button').textContent = 'Update Expense';
    document.querySelector('.button-group button').onclick = updateExpense;
  }
}

function updateExpense() {
  const amountInput = document.getElementById('amount');
  const categoryInput = document.getElementById('category');
  const dateInput = document.getElementById('date');
  const commentInput = document.getElementById('comment');

  const amount = amountInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const comment = commentInput.value;

  if (amount === '' || category === '' || date === '') {
    alert('Please fill in all fields.');
    return;
  }

  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const expenseIndex = expenses.findIndex(expense => expense.id === window.editingId);

  if (expenseIndex !== -1) {
    expenses[expenseIndex] = { id: window.editingId, amount: parseFloat(amount), category, date, comment };

    localStorage.setItem('expenses', JSON.stringify(expenses));

    amountInput.value = '';
    categoryInput.selectedIndex = 0;
    dateInput.value = '';
    commentInput.value = '';

    alert('Expense updated successfully.');

    document.querySelector('.button-group button').textContent = 'Save';
    document.querySelector('.button-group button').onclick = saveExpense;

    window.editingId = undefined;

    displayTotals();
    showCategoryExpenses(category);
  }
}

function downloadExpenses() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  if (expenses.length === 0) {
    alert('No expenses to download.');
    return;
  }

  // Create a new workbook and add the expenses data
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(expenses);
  XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

  // Generate a file and trigger a download
  XLSX.writeFile(wb, 'expenses.xlsx');
}

// Initial display of totals when the page loads
window.onload = displayTotals;
