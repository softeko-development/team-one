# Intern Team Task — Post CRUD

## 1. Team Rules

- Everybody will create a branch on GitHub **with your own name** and push your
  work on that branch.
- **Never push directly to `main`.** Open a **Pull Request** into `main`.
- The team will **divide the task** between yourselves.
- Every member must have real commits.

---

## 2. How to run the project

One command runs the full project — the database **and** the Next.js app.

```bash
cd /your-project-path
cp .env.example .env
sudo docker compose up --build
```

Open http://localhost:3000

To stop everything:

```bash
sudo docker compose down
```

Useful:

```bash
sudo docker compose logs -f app   # see the Next.js logs
sudo docker compose ps            # what is running
```

The first start is slow because it installs the packages inside the container.
After that it is fast. Your code is mounted live, so when you save a file the
app reloads by itself.

---

## 3. Task / Requirements

**Deadline:** **\_\_\_** (your team will be told this separately)

### 3.1 — Post schema

Create a `Post` table with these fields:

- `id`
- `title`
- `slug` — must be **unique**
- `content`
- `published` — true / false, default false
- `createdAt`
- `updatedAt`

The schema file is empty right now. You have to write the model yourself.

### 3.2 — CRUD

- Build the backend API first: create, read (list + single), update, delete.
- Then build the frontend on top of it.

### 3.3 — Listing page

Show the list of posts, with:

- newest post first
- pagination
- search by title
- filter by published / unpublished

### 3.4 — Single post page

- Open one post on its own page using the **`slug`**, not the `id`.
- A slug that does not exist must show a proper "not found" page, not a crash.

### 3.5 — Validation and XSS

- Validate the input before saving. Empty or invalid data must be rejected.
- A duplicate `slug` must be handled properly, with a clear message.
- Every error must be **shown to the user on the screen** with a clear message.

### 3.7 — Caching (bonus)

- The listing page should not hit the database on every single request.
