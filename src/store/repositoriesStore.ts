import {create} from 'zustand'
import {immer} from "zustand/middleware/immer";
import {devtools, persist} from "zustand/middleware";
import {Repository} from "./types";
import {fetchRepositories, fetchUserRepositories} from "../api/githubApi";
import {generatePageCursor} from "../utils/cursorGenerator";

interface repositoriesStore {
    repositories: Repository[];
    searchQuery: string;
    currentPage: number;
    totalPages: number;
    repositoryCount: number;
    endCursor: null | string;
    status: "idle" | "loading" | "failed";
    setPage: (page: number) => void;
    setCursor: (cursor: string | null) => void;
    setSearchQuery: (query: string) => void;
    searchRepositories: () => void;
    searchUserRepositories: () => void;
}


const useRepositoriesStore = create<repositoriesStore>()(
    persist(
        devtools(
            immer((set, get) => ({
                repositories: [],
                searchQuery: '',
                currentPage: 1,
                repositoryCount: 0,
                endCursor: null,
                totalPages: 0,
                status: "idle",
                setPage: (page) => set((state) => {
                    state.currentPage = page;
                }),
                setCursor: (cursor) => set((state) => {
                    state.endCursor = cursor;
                }),
                setSearchQuery: (query) => set((state) => {
                    state.searchQuery = query;
                    state.currentPage = 1;
                    state.endCursor = generatePageCursor(10, 1, 1);
                }),
                searchUserRepositories: async () => {
                    set({status: "loading"});
                    const response = await fetchUserRepositories(10, get().endCursor);

                    set({
                        repositories: response.repositories,
                        totalPages: response.totalPages,
                        repositoryCount: response.repositoryCount,
                        status: "idle",
                    });
                },
                searchRepositories: async () => {
                    set({status: "loading"});
                    const response = await fetchRepositories(get().searchQuery, 10, get().endCursor);

                    set({
                        repositories: response.repositories,
                        totalPages: response.totalPages,
                        repositoryCount: response.repositoryCount,
                        status: "idle",
                    });
                },
            })),
        ),
        {
            name: 'repositories-store',
            getStorage: () => sessionStorage, // храним стейт в sessionStorage
        }
    ),
);

export default useRepositoriesStore