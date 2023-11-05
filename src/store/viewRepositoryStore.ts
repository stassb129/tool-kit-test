import {create} from 'zustand'
import {immer} from "zustand/middleware/immer";
import {devtools} from "zustand/middleware";
import {fetchRepository} from "../api/githubApi";

interface viewRepositoryStore {
    name: string;
    stargazers: number;
    pushedAt: string;
    owner: {
        avatarUrl: string,
        login: string,
        url: string,
    };
    languages: string[],
    description: string,
    setQueryForFetch: ({owner, name}: { name: string, owner: string }) => void
    getRepository: () => void,
    status: "idle" | "loading" | "failed";
}


const useViewRepositoryStore = create<viewRepositoryStore>()(
    devtools(
        immer((set, get) => ({
            name: '',
            stargazers: 0,
            pushedAt: '',
            owner: {
                avatarUrl: '',
                login: '',
                url: '',
            },
            languages: [],
            description: '',
            status: "idle",
            setQueryForFetch: ({name, owner}) => set((state) => {
                state.name = name
                state.owner.login = owner
            }),
            getRepository: async () => {
                set({status: "loading"});

                try {
                    const response = await fetchRepository(get().owner.login, get().name);

                    set({
                        stargazers: response.stars,
                        pushedAt: response.pushedAt,
                        owner: {
                            avatarUrl: response.owner.avatarUrl,
                            login: response.owner.login,
                            url: response.owner.avatarUrl,
                        },
                        languages: response.languages,
                        description: response.description
                    });
                } catch (error) {
                    console.error("Error searching repositories:", error);
                    set({status: "failed"});
                }
            },
        })),
    ),
);

export default useViewRepositoryStore