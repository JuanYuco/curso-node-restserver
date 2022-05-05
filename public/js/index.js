window.onload = () => {
    let button = document.getElementById('googleSignOut');
    button.addEventListener( 'click', () => {
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke( localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
    })   
}

function handleCredentialResponse ( response ) {
    /* Google Token: ID_TOKEN */
    // console.log('id_token', response.credential);
    fetch( '/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_token: response.credential })
    })
        .then( resp => resp.json() )
        .then( resp => {
            console.log(resp);
            localStorage.setItem('email', resp.user.email);
        })
        .catch( error => console.log(error) );
}