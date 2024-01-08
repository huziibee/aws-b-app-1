

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: 'af-south-1_lURIH3IFw',
    ClientId: '23hinerifjsno4tbq6bbrcencc', // Generated in the Cognito User Pool settings
});




function registerUser(name,email,phone_number, password) {
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: 'email',
            Value: email,
        }),
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: 'phone_number',
            Value: phone_number, 
        }),
    ];

    userPool.signUp(name, password, attributeList, null, (err, result) => {
        if (err) {
            console.error(err);
            alert(err.message)
            return;
        }
        console.log('User registration successful:', result);
        sessionStorage.setItem('username', name);
        alert('User registration successful');
        window.location.href = '../Verification/verify.html';
    });
}


document.getElementById('signup-form').addEventListener('submit', function(event){
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-name').value;
    const phone_number = document.getElementById('signup-phone-number').value;
    registerUser(name,email, phone_number, password);
    // window.location.href = 'login.html';
});


