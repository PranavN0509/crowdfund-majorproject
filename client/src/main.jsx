import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
// import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
// import Layout from './components/Layout';
import { CampaignDetails, CreateCampaign, Home, Profile, CampaignProgress } from './pages/index';
import { StateContextProvider } from './context/index';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
        <Route path="" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="create-campaign" element={<CreateCampaign />} />
        <Route path="campaign-details/:id" element={<CampaignDetails />} />
        <Route path="campaign-details/campaign-progress/:id" element={<CampaignProgress />} />

    </Route>
  )
)

root.render(
  <React.StrictMode>
    <StateContextProvider>
      <RouterProvider router={router}>
      </RouterProvider>
    </StateContextProvider>
  </React.StrictMode>
)
