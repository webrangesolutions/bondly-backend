import { OAuth2Client } from "google-auth-library";


const thirdPartyAuthServices = {
    async verifyGoogleToken(accessToken){
        let client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
        const {token} = await client.getToken(accessToken);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          
        const payload = ticket.getPayload();

       return {payload} 
        // try {
        //     const response = await oauthClient.verifyIdToken({
        //         idToken,
        //         audience: [
        //             // Add your android & apple client_id here
        //         ],
        //     });
        //     const payload = response.getPayload();

        //     if (payload) {
        //         const { email, name } = payload;

        //         return await this.logInOrRegister(email, name);
        //     } else {
        //         console.log('token is invalid!');
        //     }
        // } catch (e) {
        //     console.log('error', e);
        // }
    },

    async SignupWithApple(id, accessToken){

    }
}

export default thirdPartyAuthServices;