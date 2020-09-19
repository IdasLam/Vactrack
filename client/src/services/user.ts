import Axios from "axios"

type Credantials2 = {
    email: string,
    password: string
}

export const login = async (credantials: Credantials2) => {
    const response = await Axios.post('/api/login', credantials)

    console.log(response);
    
}