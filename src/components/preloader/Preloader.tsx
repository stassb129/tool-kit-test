import {FC} from 'react';
import style from './preloader.module.scss';

const Preloader: FC = () => {
    return (
        <div className={style.ldsRing}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default Preloader;