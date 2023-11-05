import {FC, useEffect} from 'react';
import {Link, useParams, useNavigate} from "react-router-dom";
import useViewRepositoryStore from "../../store/viewRepositoryStore";
import style from './viewRepositoryPage.module.scss';
import starIcon from '../../assets/star-icon.svg';
import arrowLeftIcon from '../../assets/arrow-left-solid.svg';

const ViewRepositoryPage: FC = () => {

    const setQueryForFetch = useViewRepositoryStore(state => state.setQueryForFetch)
    const getRepository = useViewRepositoryStore(state => state.getRepository)
    const repositoryName = useViewRepositoryStore(state => state.name)
    const repositoryOwner = useViewRepositoryStore(state => state.owner)
    const stargazers = useViewRepositoryStore(state => state.stargazers)
    const pushedAt = useViewRepositoryStore(state => state.pushedAt)
    const languages = useViewRepositoryStore(state => state.languages)
    const description = useViewRepositoryStore(state => state.description)
    const isLoading = useViewRepositoryStore(state => state.status === 'loading')

    const {owner, name} = useParams()

    const navigate = useNavigate();

    useEffect(() => {
        setQueryForFetch({owner, name})
    }, [])

    useEffect(() => {
        if (repositoryName)
            getRepository();
    }, [repositoryName])

    const goBackHandler = () => {
        navigate(-1);
    }


    return (
        <main className={style.wrapper}>

            <img src={arrowLeftIcon} onClick={goBackHandler} className={style.goBack} alt=""/>

            <hr/>
            <div className={style.header}>
                <div className={style.owner}>
                    <img src={repositoryOwner.avatarUrl} alt=""/>
                    <span>{repositoryOwner.login}</span>
                </div>
                <div className={style.repInfo}>
                    <h2>{repositoryName}</h2>
                    <span>Repository rating: {stargazers} <img src={starIcon} alt=""/></span>
                    <p>Last commit date: {pushedAt}</p>
                </div>
            </div>

            <div className={style.repositoryDescription}>
                <div className={style.languages}>
                    <h3>Used programming languages:</h3>
                    <ul>
                        {languages.length && languages.map(lang => <li>{lang}</li>)}
                    </ul>
                </div>
                <p>Description: {description}</p>
            </div>

        </main>
    );
};

export default ViewRepositoryPage;