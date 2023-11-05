import React, {useState, useEffect, useCallback, memo, useRef} from "react";
import useRepositoriesStore from "../../store/repositoriesStore";
import useDebounce from "../../hooks/useDebounce";
import {generatePageCursor} from "../../utils/cursorGenerator";
import style from './homePage.module.scss';
import Input from "../../components/input/Input";
import RepositoryList from "../../components/repository-list/RepositoryList";
import Paginator from "../../components/paginator/Paginator";

const HomePage: React.FC = () => {

    const repositories = useRepositoriesStore(state => state.repositories);
    const repCount = useRepositoriesStore(state => state.repositoryCount);
    const currentPage = useRepositoriesStore(state => state.currentPage);
    const totalPages = useRepositoriesStore(state => state.totalPages);
    const searchRepositories = useRepositoriesStore(state => state.searchRepositories);
    const searchUserRepositories = useRepositoriesStore(state => state.searchUserRepositories);
    const isLoading = useRepositoriesStore(state => state.status === 'loading');
    const setPage = useRepositoriesStore(state => state.setPage);
    const cursor = useRepositoriesStore(state => state.endCursor);
    const setCursor = useRepositoriesStore(state => state.setCursor);
    const searchQuery = useRepositoriesStore(state => state.searchQuery);
    const setSearchQuery = useRepositoriesStore(state => state.setSearchQuery);

    const debouncedSearchQuery = useDebounce<string>(searchQuery, 400)
    const scrollRepositoryList = useRef() as React.MutableRefObject<HTMLDivElement>;
    const [fetchUserData, setFetchUserData] = useState<boolean>(false);

    console.log(scrollRepositoryList)


    useEffect(() => {
        if (debouncedSearchQuery !== '')
            searchRepositories();
    }, [debouncedSearchQuery, cursor, setCursor]);

    useEffect(() => {
        if (debouncedSearchQuery === '')
            searchUserRepositories();
    }, [debouncedSearchQuery, cursor]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setPage(page);
    }, []);

    const handleCursorChange = useCallback((cursor: string | null) => {
        setCursor(cursor);
    }, []);

    return (
        <div className={style.wrapper}>
            <header className={style.header}>
                <Input
                    value={searchQuery}
                    handleCallback={handleSearch}
                    placeholder="Search repositories"
                />
            </header>

            <main className={style.repositoriesBlock} ref={scrollRepositoryList}>
                <RepositoryList repositories={repositories} isLoading={isLoading}/>
                <Paginator
                    pageSize={10}
                    repositoryCount={repCount}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={handlePageChange}
                    setCursor={handleCursorChange}
                />
            </main>
        </div>
    );
};

export default memo(HomePage);
