
let amountSpent =0;
let totalBudget = 0;

async function fetchData() {
    const requestBody = {
        username: sessionStorage.getItem('username')
    };

    try {
        const response = await fetch('https://94u93wm33m.execute-api.af-south-1.amazonaws.com/test/budget-app-get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        displayIds(data.Items, data.Count);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function postData(name, amount) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}${month}${day}`;
    console.log(formattedDate,name, amount);
    const requestBody = {
            "username": sessionStorage.getItem('username'),
            "name": name,
            "amount": amount.toString(),
            "created_at": formattedDate
    };

    try {
        const response = await fetch('https://94u93wm33m.execute-api.af-south-1.amazonaws.com/test/budgets-app-resource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}


function displayIds(items, count) {
    const responseArea = document.getElementById('budget-items');
    responseArea.innerHTML = ''; // Clear previous results

    if (count === 0) {
        document.getElementById('budget-items').style.display = 'none';
    } else {
        document.getElementById('budget-items').style.display = 'block';
    
        // Reset amountSpent to 0 before calculating the total from fetched items
        amountSpent = 0;

        items.forEach(item => {
            // Create a new div element
            const div = document.createElement('div');
        
            // Set the content of the div
            div.innerHTML = `<strong>Title:</strong> ${item.name.S} <br> <strong>Amount:</strong> ${item.amount.N}`;

            // Add the item's amount to the total amountSpent
            amountSpent += parseFloat(item.amount.N);
            
            // Apply styles to the div
            div.style.padding = '20px';
            div.style.borderRadius = '5px';
            div.style.marginTop = '10px';
            div.style.marginBottom = '10px';
            div.style.backgroundColor = '#ccc';
        
            // Append the div to the responseArea
            responseArea.appendChild(div);
        });

        // Update the displayed spent amount
        document.getElementById('spent-amount').textContent = amountSpent.toFixed(2);
        const remaining = totalBudget - amountSpent;
        const remainingElement = document.getElementById('remaining-amount');
        remainingElement.textContent = remaining.toFixed(2);

        document.getElementById('spent-amount').textContent = amountSpent.toFixed(2);

        if (amountSpent / totalBudget >= 0.75) {
            remainingElement.classList.add('red');
            remainingElement.classList.remove('orange');
        } else if (amountSpent / totalBudget >= 0.50) {
            remainingElement.classList.add('orange');
            remainingElement.classList.remove('red');
        } else {
            remainingElement.classList.remove('red', 'orange');
        }
    }
}

function capitalizeFirstLetter(string) {
    if (!string) return string; // Return the original string if it's empty
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('DOMContentLoaded', function() {


    if (!sessionStorage.getItem('username')) {
        window.location.href = '../index.html';
    }



    document.getElementById('username').textContent = sessionStorage.getItem('username') || 'User';

    document.getElementById('set-budget-btn').addEventListener('click', function() {
        const budget = prompt("What's your budget for this week?");
        totalBudget = parseFloat(budget);
        if (isNaN(totalBudget)) {alert('Please enter a valid number'); return;}
        document.getElementById('total-budget').textContent = totalBudget.toFixed(2);
        if (totalBudget) {
            document.getElementById('set-budget-btn').style.display = 'none';
            fetchData();
            updateBudgetDisplay();}
        
    });

    document.getElementById('add-expense-btn').addEventListener('click', function() {
        const name = capitalizeFirstLetter(document.getElementById('expense-name').value);
        const amount = parseFloat(document.getElementById('expense-amount').value);
        if (totalBudget===0) {alert('Please set a budget first'); return;}
        else if (name && amount ) {
            amountSpent += amount;
            const div = document.createElement('div');
        
            // Set the content of the div
            div.innerHTML = `<strong>Title:</strong> ${name} <br> <strong>Amount:</strong> ${amount}`;

            // Add the item's amount to the total amountSpent
            // amountSpent += parseFloat(item.amount);
            
            // Apply styles to the div
            div.style.padding = '20px';
            div.style.borderRadius = '5px';
            div.style.marginTop = '10px';
            div.style.marginBottom = '10px';
            div.style.backgroundColor = '#ccc';

            document.getElementById('budget-items').appendChild(div);
            postData(name, amount);
            updateBudgetDisplay();
        }
    });

    function updateBudgetDisplay() {
        const remaining = totalBudget - amountSpent;
        const remainingElement = document.getElementById('remaining-amount');
        remainingElement.textContent = remaining.toFixed(2);

        document.getElementById('spent-amount').textContent = amountSpent.toFixed(2);

        if (amountSpent / totalBudget >= 0.75) {
            remainingElement.classList.add('red');
            remainingElement.classList.remove('orange');
        } else if (amountSpent / totalBudget >= 0.50) {
            remainingElement.classList.add('orange');
            remainingElement.classList.remove('red');
        } else {
            remainingElement.classList.remove('red', 'orange');
        }
    }
});
