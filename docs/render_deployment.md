# Lab Gateway - Render Deployment Guide

This guide outlines how to deploy the standalone Lab Gateway API to **Render**, connecting it to a **MongoDB Atlas** cloud database.

## 1. MongoDB Atlas Setup
Before deploying the API, you need a public database.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. Build a new Cluster (the free `M0 Sandbox` is perfect).
3. Under **Database Access**, create a new database user (e.g., `admin`). Note the password.
4. Under **Network Access**, add the IP address `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** on your cluster, choose **Connect your application**, and copy the connection string.
   - It will look like: `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with the password you created.
   - Add a database name before the `?` (e.g., `...mongodb.net/lab_db?...`).

## 2. GitHub Repository
Render deploys directly from a Git repository.

1. Open your terminal in the `lab-gateway` folder.
2. Initialize and commit your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Lab Gateway"
   ```
3. Create a new repository on GitHub.
4. Push your local code to the GitHub repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

## 3. Render Web Service Deployment

### Option A: Blueprint (render.yaml)
1. Go to the [Render Dashboard](https://dashboard.render.com/).
2. Click **New** > **Blueprint**.
3. Connect your GitHub account and select your `lab-gateway` repository.
4. Render will read the `render.yaml` file and prompt you for the `MONGO_URI`.

### Option B: Manual Web Service Setup
1. In the Render Dashboard, click **New** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the following:
   - **Name:** `caresphere-lab-gateway`
   - **Environment:** `Docker`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Expand **Environment Variables** and add:
   - `MONGO_URI`: (Your Atlas connection string)
   - `JWT_SECRET`: (A long, random string)
5. Click **Create Web Service**.

## 4. Obtaining the URL
1. Wait for the deployment to finish and show **Live**.
2. Copy the public URL provided by Render (e.g., `https://caresphere-lab-gateway.onrender.com`).
3. Verify it is running by appending `/health` to the URL.

## 5. Seeding the Database
1. Run the seed script to inject dummy lab results into your database.
2. On Render, go to the **Shell** tab for your Web Service.
3. Run the command: `npm run seed`
4. *(If on the free tier without Shell access, run `npm run seed` locally with the `.env` configured).*
