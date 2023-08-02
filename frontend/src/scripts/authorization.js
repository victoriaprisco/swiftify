
function generateKey(length){
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdefghijklmnopqrstuvwxyz";
    var key = "";
    for(var i = 0; i < length;  i++){
        key += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return key;
}

async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
  
    return base64encode(digest);
  }
let args = "";
export function completeAuth(){
    const clientID = "f9056af9d3e0426a8f240b854ca03363";
    // const redirectURI = 'https://victoriaprisco.github.io/swiftify/';
    const redirectURI = 'http://localhost:3000/'
    var codeVerifier = generateKey(128);
    
    generateCodeChallenge(codeVerifier).then(challenge => {
      var state = generateKey(16);
      var scope = 'user-read-private user-read-email';
      localStorage.setItem('code_verifier', codeVerifier);
      args = new URLSearchParams({
          response_type: 'code',
          client_id: clientID,
          scope: scope,
          redirect_uri: redirectURI,
          state: state,
          code_challenge_method: 'S256',
          code_challenge: challenge
      });
    window.location = 'https://accounts.spotify.com/authorize?' + args;
  });
  // return args;  
}

export async function getToken(code){
  const verifier = localStorage.getItem("code_verifier");
  const redirectURI = 'http://localhost:3000/'
  const params = new URLSearchParams();
  params.append("client_id", "f9056af9d3e0426a8f240b854ca03363");
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectURI);
  params.append("code_verifier", verifier);
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });
  const token = await result.json();
  return token;
}