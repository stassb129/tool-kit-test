import React, {useMemo, useCallback} from "react";
import {generatePageCursor} from "../../utils/cursorGenerator";
import style from './paginator.module.scss';

interface PaginatorProps {
    totalPages: number;
    repositoryCount: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    setCursor: (cursor: string | null) => void;
    pageSize: number;
    classname?: string;
}

const Paginator: React.FC<PaginatorProps> = ({
                                                 totalPages,
                                                 setCurrentPage,
                                                 currentPage,
                                                 setCursor,
                                                 pageSize,
                                                 repositoryCount,
                                                 classname
                                             }) => {
    const handleClick = useCallback(
        (pageNumber: number) => {
            setCurrentPage(pageNumber);
            const cursor = generatePageCursor(pageSize, repositoryCount, pageNumber);
            setCursor(cursor);
        },
        [setCurrentPage, setCursor, pageSize, repositoryCount]
    );

    const pageNumbers = useMemo(() => {
        const numbers: number[] = [];

        if (totalPages <= 10) {
            for (let i = 1; i <= totalPages; i++) {
                numbers.push(i);
            }
        } else if (currentPage <= 6) {
            for (let i = 1; i <= 10; i++) {
                numbers.push(i);
            }
        } else if (currentPage >= totalPages - 5) {
            for (let i = totalPages - 9; i <= totalPages; i++) {
                numbers.push(i);
            }
        } else {
            for (let i = currentPage - 4; i <= currentPage + 5; i++) {
                numbers.push(i);
            }
        }

        return numbers;
    }, [totalPages, currentPage]);

    const renderPageButton = useCallback(
        (pageNumber: number) => (
            <button
                key={pageNumber}
                onClick={() => handleClick(pageNumber)}
                className={`${style.button} ${currentPage === pageNumber ? style.active : ""}`}
            >
                {pageNumber}
            </button>
        ),
        [currentPage, handleClick]
    );

    const renderPages = useMemo(() => pageNumbers.map(renderPageButton), [
        pageNumbers,
        renderPageButton,
    ]);

    return (
        <div className={style.paginator}>
            <div>
                {renderPages}
            </div>
            {!!totalPages && <div className={style.totalPages}>Total Pages: {totalPages}</div>}
        </div>
    );
};

export default Paginator;
