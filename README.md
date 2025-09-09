# NSFW Detection App (MERN + React + TypeScript)

A full-stack web application for detecting NSFW (Not Safe For Work) content in images. Users can either **upload images** or **submit image URLs** for NSFW detection. The backend uses **Node.js, Express, TypeScript**, and the **NSFWJS model**, while the frontend is built with **React, TypeScript, and Tailwind CSS**.

---

## 🔗 Live Demo

- https://nsfw-detector-93nm.onrender.com


---

## 🗂 Project Structure

```
root/
│
├── frontend/ # React frontend
│ ├── src/
│ ├── public/
│ └── package.json
│
├── backend/ # Node.js + Express backend
│ ├── src/
│ └── package.json
│
└── README.md
```


---

## ⚙️ Features

- Upload images directly or provide image URLs for NSFW detection
- Uses **NSFWJS** for automatic detection
- TypeScript support in both frontend and backend
- Tailwind CSS for responsive UI
- Separate services for frontend and backend (deployed on Render)

---

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Axios
- **Backend:** Node.js, Express, TypeScript, NSFWJS
- **Database:** Optional (MongoDB if you extend the project)
- **Deployment:** Render.com

---

## 🚀 Installation (Development)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/nsfw-detection.git
cd nsfw-detection
```

2. Install dependencies

Backend

```bash
cd backend
bun install
```

Frontend

```bash
cd ../frontend
bun install
```
3. Run Development Servers

From root folder:

```
bun install -d concurrently
bun run dev
```

- http://localhost:5000

## 🏗 Build for Production

### Build Command

```bash
bun run build
```

### Start Command

```bash
bun start
```

- Serve frontend build through Render or via backend static hosting.

⚡ Usage

1. Open the URL

2. Upload an image or enter an image URL

3. The backend analyzes it with NSFWJS

4. View the NSFW probability results

---

📄 License

This project is open source and available under the MIT License.