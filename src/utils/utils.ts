import { Datapass, User } from './../types/types';
export const toDatapass = (data: any) => {
    const dataPass: Datapass = {
        title: data.title,
        username: data.username,
        password: data.password,
    }

    return dataPass
}

export const toUserFirestore = (data: any) => {
    const user: User = {
        id: data.uid,
        username: data.username,
    }

    return user
}