import {gql, request} from "graphql-request";
import {Repository} from "../store/types";

const GITHUB_API_ENDPOINT = "https://api.github.com/graphql";
const GITHUB_TOKEN = "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";

export const fetchRepositories = async (
    query: string,
    pageSize: number,
    after: string | null
): Promise<{ repositories: Repository[]; totalPages: number; repositoryCount: number; endCursor: string; }> => {
    const searchQuery = query.trim();

    const graphQLQuery = gql`
        query SearchRepositories(
            $query: String!
            $pageSize: Int!
            $after: String
        ) {
            search(query: $query, type: REPOSITORY, first: $pageSize, after: $after) {
                repositoryCount
                pageInfo {
                    endCursor
                }
                nodes {
                    ... on Repository {
                        id
                        name
                        stargazerCount
                        pushedAt
                        owner {
                            login
                            url
                        }
                    }
                }
            }
        }
    `;

    const variables = {
        query: searchQuery,
        pageSize,
        after,
    };

    const headers = {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
    };

    try {
        const response = await request<any>(GITHUB_API_ENDPOINT, graphQLQuery, variables, headers);

        const repositories = response.search.nodes.map((node: any) => ({
            id: node.id,
            name: node.name,
            stars: node.stargazerCount,
            lastCommit: node.pushedAt,
            owner: {
                login: node.owner.login,
                url: node.owner.url,
            },
        }));

        const totalPages = Math.ceil(response.search.repositoryCount / pageSize);

        return {
            repositories,
            repositoryCount: response.search.repositoryCount,
            totalPages,
            endCursor: response.search.pageInfo.endCursor,
        };
    } catch (error) {
        console.error("Error fetching repositories:", error);
        throw error;
    }
};


export const fetchRepository = async (owner: string, name: string) => {
    const graphQLQuery = gql`
        query GetRepository($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
                name
                stargazers {
                    totalCount
                }
                pushedAt
                owner {
                    avatarUrl
                    login
                    url
                }
                languages(first: 5) {
                    nodes {
                        name
                    }
                }
                description
            }
        }
    `;

    const variables = {
        owner,
        name,
    };

    const headers = {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
    };

    try {
        const response = await request<any>(GITHUB_API_ENDPOINT, graphQLQuery, variables, headers);

        const repository = response.repository;
        const languages = repository.languages.nodes.map((node: any) => node.name);

        return {
            name: repository.name,
            stars: repository.stargazers.totalCount,
            pushedAt: repository.pushedAt,
            owner: {
                login: repository.owner.login,
                avatarUrl: repository.owner.avatarUrl,
                url: repository.owner.url,
            },
            languages,
            description: repository.description,
        };

    } catch (error) {
        console.error('Error fetching repository:', error);
        throw error;
    }
};

const getUserLogin = async () => {
    const graphQLQuery = gql`
        query {
            viewer {
                login
            }
        }
    `;

    const headers = {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
    };

    try {
        const response = await request<any>(GITHUB_API_ENDPOINT, graphQLQuery, null, headers);
        const login = response.viewer.login;
        return login;
    } catch (error) {
        console.error("Error fetching user login:", error);
        throw error;
    }
}

export const fetchUserRepositories = async (
    pageSize: number,
    after: string | null
): Promise<{ repositories: Repository[]; totalPages: number; repositoryCount: number; endCursor: string; }> => {
    const graphQLQuery = gql`
        query GetRepositories(
            $login: String!
            $pageSize: Int!
            $after: String
        ) {
            user(login: $login) {
                repositories(
                    first: $pageSize,
                    after: $after
                ) {
                    totalCount
                    pageInfo {
                        endCursor
                    }
                    nodes {
                        id
                        name
                        stargazerCount
                        pushedAt
                        owner {
                            login
                            url
                        }
                    }
                }
            }
        }
    `;

    const login = await getUserLogin();

    const variables = {
        login: login,
        pageSize,
        after,
    };

    const headers = {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
    };

    try {
        const response = await request<any>(GITHUB_API_ENDPOINT, graphQLQuery, variables, headers);

        const repositories = response.user.repositories.nodes.map((node: any) => ({
            id: node.id,
            name: node.name,
            stars: node.stargazerCount,
            lastCommit: node.pushedAt,
            owner: {
                login: node.owner.login,
                url: node.owner.url,
            },
        }));

        const totalPages = Math.ceil(response.user.repositories.totalCount / pageSize);

        return {
            repositories,
            repositoryCount: response.user.repositories.totalCount,
            totalPages,
            endCursor: response.user.repositories.pageInfo.endCursor,
        };
    } catch (error) {
        console.error("Error fetching repositories:", error);
        throw error;
    }
};
