
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: 'af-south-1_lURIH3IFw',
    ClientId: '23hinerifjsno4tbq6bbrcencc', // Generated in the Cognito User Pool settings
});

document.addEventListener('DOMContentLoaded', function () {
    if (!sessionStorage.getItem('username')) {
        window.location.href = '../index.html';
    }
})

document.getElementById('otp-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const otpCode = document.getElementById('otp-code').value;
    verifyUser(otpCode);
});



function verifyUser(otpCode) {
    // Assuming you have the user's username stored or passed from the previous page
    // const username = sessionStorage.getItem('username');
    console.log("OTP Code:", otpCode);
    const username = sessionStorage.getItem('username');
    console.log("Username from session storage:", username);

    if (!username) {
        console.error("Username not found in session storage");
        return;
    }
    const user = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool,
    });

    user.confirmRegistration(otpCode, true, function (err, result) {
        if (err) {
            console.error(err);
            return;
        }
        alert(result);
        window.location.href = '../index.html';
    });
}
