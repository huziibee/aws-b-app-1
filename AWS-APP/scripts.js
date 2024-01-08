// AWS.config.region = 'af-south-1';

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: 'af-south-1_lURIH3IFw',
    ClientId: '23hinerifjsno4tbq6bbrcencc', // Generated in the Cognito User Pool settings
});



function loginUser(name, password) {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: name,
        Password: password,
    });

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: name,
        Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            console.log('User login successful:', result);
            sessionStorage.setItem('username', name);
            window.location.href = '../Dashboard/dashboard.html';

        },
        onFailure: function(err) {
            console.error('User login failed:', err);
            alert(err.message || JSON.stringify(err));
        },
    });
}


document.getElementById('login-form').addEventListener('submit', function(event){
    event.preventDefault();
    // Here you would validate the user's credentials
    // For demonstration, we'll just redirect
    const name = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    loginUser(name, password);
});