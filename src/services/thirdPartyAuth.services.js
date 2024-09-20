

const thirdPartyAuthServices = {
    async SignupWithGoogle(id, accessToken){
        const oauthClient = new OAuth();
        
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