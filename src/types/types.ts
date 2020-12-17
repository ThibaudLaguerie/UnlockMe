export type RootStackParamsList = {
    Auth: undefined,
    PasswordList: {
        username: string;
    },

}

export type User = {
    id: string;
    username: string;
    datapasses?: Datapass[];
}

export type Datapass = {
    title: string;
    username: string;
    password: string;
}