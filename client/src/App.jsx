import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Sidebar, Navbar } from './components/index';
// import { CampaignDetails, CreateCampaign, Home, Profile } from './pages/index';
import { ThemeProvider } from './context/theme';
import { Outlet } from 'react-router-dom'
import { useStateContext } from './context';

function App() {

    const [themeMode, setThemeMode] = useState("light")
    const { connectWallet } = useStateContext();

    const lightTheme = ()=>{
        setThemeMode("light");
    }

    const darkTheme = ()=>{
        setThemeMode("dark");
    }


    useEffect(()=>{
        const init = async()=>{
            document.querySelector("html").classList.remove("light", "dark")
            document.querySelector("html").classList.add(themeMode)
            await connectWallet();

        }
        init();
    }, [themeMode])



    return (
        <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
            <div className="relative sm:-8 p-4 bg-[#f7f7f7] dark:bg-[#13131a] min-h-screen flex flex-row">
                <div className="sm:flex hidden mr-10 relative">
                    <Sidebar />
                </div>

                <div className="flex-1 max-sm:w-full max-w-[1560px] mx-auto sm:pr-5">
                    <Navbar />
                    <Outlet />
                </div>
            </div>
        </ThemeProvider>
    )
}

export default App;