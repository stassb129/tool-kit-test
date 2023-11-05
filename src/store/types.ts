export interface Repository {
    id: string;
    name: string;
    stars: number;
    lastCommit: string;
    owner: {
        login: string;
        avatarUrl: string;
        url: string;
    };
}