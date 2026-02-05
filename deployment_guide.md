# Deployment Guide

This guide describes how to deploy the KaarigarHub application for free using **Render** (Backend) and **Vercel** (Frontend).

## Prerequisites

1.  **GitHub Account**: Ensure your project is pushed to GitHub.
2.  **MongoDB Atlas**: You should have your MongoDB connection string ready.
3.  **Cloudinary & Razorpay**: Have your API keys handy.

---

## Part 1: Deploy Backend (Render)

1.  **Sign Up/Login**: Go to [render.com](https://render.com/) and log in with your GitHub account.
2.  **New Web Service**:
    *   Click on "New" -> "Web Service".
    *   Select "Build and deploy from a Git repository".
    *   Connect your KaarigarHub repository.
3.  **Configure Service**:
    *   **Name**: `kaarigarhub-backend` (or any unique name).
    *   **Region**: Choose the one closest to you (e.g., Singapore).
    *   **Branch**: `main`.
    *   **Root Directory**: `backend` (IMPORTANT: set this because your backend is in a subdirectory).
    *   **Runtime**: `Node`.
    *   **Build Command**: `npm install`.
    *   **Start Command**: `node index.js`.
4.  **Environment Variables**:
    *   Scroll down to "Environment Variables".
    *   Add the following keys and values from your local `.env`:
        *   `MONGODB_URL`: Your MongoDB connection string.
        *   `JWT_SECRET`: Your secret key.
        *   `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`: Your email settings.
        *   `CLOUD_NAME`, `API_KEY`, `API_SECRET`: Cloudinary credentials.
        *   `RAZORPAY_KEY`, `RAZORPAY_SECRET`: Razorpay credentials.
        *   `PORT`: `4000` (Render might override this, but good to have).
        *   `FRONTEND_URL`: *Leave this blank for now, we will update it after deploying the frontend.*
5.  **Deploy**: Click "Create Web Service".
6.  **Copy URL**: Once deployed, copy the backend URL (e.g., `https://kaarigarhub-backend.onrender.com`).

---

## Part 2: Deploy Frontend (Vercel)

1.  **Sign Up/Login**: Go to [vercel.com](https://vercel.com/) and log in with GitHub.
2.  **Add New Project**:
    *   Click "Add New..." -> "Project".
    *   Import your KaarigarHub repository.
3.  **Configure Project**:
    *   **Framework Preset**: Select `Vite`.
    *   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    *   Expand "Environment Variables".
    *   Add:
        *   `VITE_API_URL`: Paste your Render Backend URL + `/api/v1` (e.g., `https://kaarigarhub-backend.onrender.com/api/v1`).
5.  **Deploy**: Click "Deploy".
6.  **Copy URL**: Once deployed, copy the frontend URL (e.g., `https://kaarigarhub-frontend.vercel.app`).

---

## Part 3: Final Link

1.  Go back to your **Render Dashboard** (Backend).
2.  Go to "Environment Variables".
3.  Add/Update `FRONTEND_URL` with your **Vercel Frontend URL** (no trailing slash).
4.  Save changes. Render will redeploy automatically.

**Congratulations! Your KaarigarHub app is now live!**
