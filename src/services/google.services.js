
const googleServices = {
    async getGoogleLoginLink(){
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
        
        return {url}
    }
}

export default googleServices;