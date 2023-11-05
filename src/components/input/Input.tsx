import {FC} from 'react';
import style from './input.module.scss';

interface InputProps {
    value: string;
    handleCallback: (e: string) => void;
    placeholder: string;
    className?: string;
}

const Input: FC<InputProps> = ({value, handleCallback, className, placeholder}) => {
    return (
        <input
            className={`${style.input} ${className}`}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleCallback(e.target.value)}
        />
    );
};

export default Input;