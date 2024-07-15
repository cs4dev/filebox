# FileBox

## Introduction

- FileBox is a simple personal, web-based, api-driven file/document management service.

## Requirements:

- As a user, I should be able to upload new documents to FileBox.
- Only PDF, JPG and PNG files are allowed. File types should be validated not just based on the file extension, but based on file contents.
- Maximum file size allowed is 10MB

- As a user, I should be able to view all uploaded documents as a table/list.
- This file/document entry in this table should have attributes such as file name, uploaded date, file type (example PDF, JPG etc.) and file size in KB.

- As a user, I should be able to hide a single or multiple files from my uploaded files.
  By default, the table/list view of files should not list hidden fil es. A separate checkbox/toggle saying “show hidden filesˮ, should allow to view all hidden and normal files in the same list.
- Hidden files in the list should have a demarcation flag indicating those are hidden files.

- As a user, I should be able to delete a single or multiple files from my uploaded files.

---

Written entirely in TypeScript, using [Next.js](https://nextjs.org/) and [Convex](https://www.convex.dev/), an open-source backend as a service.

Convex offers Server Functions, Database, and File Storage, which perfectly meet FileBox's needs.

For styling, I chose [shadcn](https://ui.shadcn.com/docs), a set of reusable components built on top of [tailwindcss](https://tailwindcss.com)

## Getting Started

Install dependencies

```
npm install
```

Create an `.env.local` at the root directory of the project
(dev credentials will be provided via email)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
CLERK_ISSUER=
```

Run the Convex dev server

- [reference](https://docs.convex.dev/cli#run-the-convex-dev-server)

```
npx convex dev
```

Run the Next.js dev server, go to `localhost:3000`

```
npm run dev
```

## Production Demo

```
https://filebox.cs4dev.org
```
