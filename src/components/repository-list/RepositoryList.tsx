import React from "react";
import {Repository} from "../../store/types";
import style from "./repositoryList.module.scss";
import starIcon from '../../assets/star-icon.svg';
import Preloader from "../preloader/Preloader";
import {Link} from "react-router-dom";

interface RepositoryListProps {
    repositories: Repository[];
    isLoading: boolean;
    classname?: string;
}

const RepositoryList: React.FC<RepositoryListProps> = ({
                                                           repositories,
                                                           isLoading,
                                                           classname
                                                       }) => {
    if (isLoading) {
        return <div className={style.preloader}>
            <Preloader/>
        </div>;
    }

    return (
        <ul className={`${style.repositoryList} ${classname}`}>
            {repositories.map((repo) => (
                <li key={repo.id}>
                    <Link to={`${repo.owner.login}/${repo.name}`}>
                        <h3>{repo.name}</h3>
                    </Link>
                    <p>Last Commit: {new Date(repo.lastCommit).toLocaleString()}</p>
                    <span>
                        <a href={repo.owner.url} target="_blank" rel="noopener noreferrer">
                        View on GitHub
                        </a>
                        <div>
                            {repo.stars}<img src={starIcon}/>
                        </div>
                    </span>
                </li>
            ))}
        </ul>
    );
};

export default RepositoryList;
