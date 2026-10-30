# StudySpace — Module 1: Study Space Discovery

A Next.js App Router project implementing the first module of P06:
search and discover study spaces by location, availability, and type.

## Requirements
- Node.js 18.17+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Module 1 features
- Browse study spaces
- Search by space name, building, floor, or location
- Filter by study type and availability
- View capacity, facilities, and usage rules
- Open a dynamic detail page for each space

## Current scope
This first version uses sample data stored in `src/lib/spaces.js`.
Booking, occupancy updates, authentication, database integration, and admin
management are intentionally not included yet. They belong to later project work.

## Next step
After Module 1 is reviewed and working, Module 2 can add booking and occupancy
using a database and server-side validation.
