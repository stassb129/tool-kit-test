import React from "react";
import {Routes, Route} from 'react-router-dom';
import HomePage from "./pages/home-page/HomePage";
import ViewRepositoryPage from "./pages/view-repository-page/ViewRepositoryPage";

const App: React.FC = () => {

    return (
        <Routes>
            <Route element={<HomePage/>} path='/'/>
            <Route element={<ViewRepositoryPage/>} path='/:owner/:name/'/>
        </Routes>
    );
};

export default App;
