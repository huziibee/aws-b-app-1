
let amountSpent = 0;
let totalBudget = 0;


const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: 'af-south-1_lURIH3IFw',
    ClientId: '23hinerifjsno4tbq6bbrcencc', // Generated in the Cognito User Pool settings
});


function logout() {

    const cognitoUser = userPool.getCurrentUser();
    // console.log(cognitoUser);

    if (cognitoUser != null) {
        cognitoUser.signOut();
        alert("You have been logged out.");
        window.location.href = '../index.html';
        // Redirect to login page or update UI
    }
    else {
        alert("Error occured while logging you out.");
    }
}

async function fetchData() {
    const requestBody = {
        username: sessionStorage.getItem('username')
    };

    try {
        const response = await fetch('https://j0hy1rsjrj.execute-api.af-south-1.amazonaws.com/test/budget-app-get', {
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



async function sendTransactions(transactions) {
    const email = 'mhbangie@gmail.com'; // Replace with the email you want to send to

    const lambdaEndpoint = 'https://j0hy1rsjrj.execute-api.af-south-1.amazonaws.com/test/lala'; // Replace with your Lambda endpoint

    console.log(JSON.stringify({ transactions, email }));
    try {
        const response = await fetch(lambdaEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ transactions, email })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error('There was an error sending the transactions:', error);
    }
}

// Add a button to your HTML with id 'send-transactions-btn'
// <button id="send-transactions-btn">Send Transactions</button>

document.getElementById('email-btn').addEventListener('click', () => {
    console.log('Collecting budget items data...');
    const budgetItems = document.getElementById('budget-items');
    // Initialize an array to hold the transactions
    const transactions = [];

    // Iterate over each child div of budgetItems
    budgetItems.querySelectorAll('div').forEach((div) => {
        // Extract the text content of each div
        const titleText = div.querySelector('strong:nth-of-type(1)').nextSibling.textContent.trim();
        const amountText = div.querySelector('strong:nth-of-type(2)').nextSibling.textContent.trim();
        const dateText = div.querySelector('strong:nth-of-type(3)').nextSibling.textContent.trim();


        // Add a transaction object to the transactions array
        transactions.push({
            title: titleText,
            amount: amountText,
            date: dateText
        });
    });

    //   console.log('Transactions:', transactions);
    sendTransactions(transactions);

});


async function postData(name, amount) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const formattedDate = `${year}${month}${day}`;
    console.log(formattedDate, name, amount);
    const requestBody = {
        "username": sessionStorage.getItem('username'),
        "name": name,
        "amount": amount.toString(),
        "created_at": formattedDate
    };

    try {
        const response = await fetch('https://j0hy1rsjrj.execute-api.af-south-1.amazonaws.com/test/budget-app-post', {
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
function formatDate(dateString) {
    // Create a date object from the input format 'YYYYMMDD'
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = parseInt(dateString.substring(6, 8), 10); // Convert day to number to remove leading 0

    // Define an array of month names
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const monthIndex = parseInt(month, 10) - 1; // Convert month to number and get the index (0-based)
    const monthName = months[monthIndex];

    // Function to get ordinal indicator for a given day
    function getOrdinalIndicator(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

    // Combine the parts to create the final string
    return `${day}${getOrdinalIndicator(day)} ${monthName} ${year}`;
}

function displayIds(items, count) {
    const responseArea = document.getElementById('budget-items');
    responseArea.innerHTML = ''; // Clear previous results

    if (count === 0) {
        document.getElementById('budget-items').style.display = 'none';

        document.getElementById('email-btn-container').style.display = 'none';

    } else {
        document.getElementById('budget-items').style.display = 'block';
        document.getElementById('email-btn-container').style.display = 'flex';




        // Reset amountSpent to 0 before calculating the total from fetched items
        amountSpent = 0;

        items.forEach(item => {
            // Create a new div element
            const div = document.createElement('div');

            // Set the content of the div
            div.innerHTML = `<strong>Title:</strong> ${item.name.S} <br> <strong>Amount:</strong> R${item.amount.N}<br> <strong>Date:</strong> ${formatDate(item.created_at.S)}`;

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

document.addEventListener('DOMContentLoaded', function () {


    if (!sessionStorage.getItem('username')) {
        window.location.href = '../index.html';
    }



    document.getElementById('username').textContent = sessionStorage.getItem('username') || 'User';

    document.getElementById('set-budget-btn').addEventListener('click', function () {
        const budget = prompt("What's your budget for this week?");
        totalBudget = parseFloat(budget);
        if (isNaN(totalBudget)) { alert('Please enter a valid number'); return; }
        document.getElementById('total-budget').textContent = totalBudget.toFixed(2);
        if (totalBudget) {
            document.getElementById('set-budget-btn').style.display = 'none';
            fetchData();
            updateBudgetDisplay();
        }

    });

    document.getElementById('add-expense-btn').addEventListener('click', function () {
        const name = capitalizeFirstLetter(document.getElementById('expense-name').value);
        const amount = parseFloat(document.getElementById('expense-amount').value);
        if (totalBudget === 0) { alert('Please set a budget first'); return; }
        else if (name && amount) {
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
