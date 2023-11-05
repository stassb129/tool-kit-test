import { Buffer } from 'buffer';

export const generatePageCursor = (pageSize: number, countEl: number, pageNumber: number): string | null => {
    const currentPage = Math.min(Math.max(pageNumber, 1), Math.ceil(countEl / pageSize));
    const currentCount = (currentPage - 1) * pageSize + 1;

    if (currentCount <= countEl) {
        const cursor: string = Buffer.from(`cursor:${currentCount}`).toString('base64');
        return cursor;
    }

    return null; // Возвращаем null, если страница выходит за пределы допустимого диапазона
};
