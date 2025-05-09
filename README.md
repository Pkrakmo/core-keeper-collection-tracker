## About

This project is a work in progress, and I'm actively developing it.  
Feedback is very welcome — feel free to share ideas, suggestions, or bugs!

Open [https://pkrakmo.github.io/core-keeper-collection-tracker/](https://pkrakmo.github.io/core-keeper-collection-tracker/) to give it a whirl.

### Inspiration

- [Collectors Checklist Spreadsheet](https://docs.google.com/spreadsheets/d/1-JP8dCOhp6oVlJAIJcoxaX_M0SfSPAHDL2GCvFz2U9M/edit?gid=0#gid=0)
- [Reddit Post on r/CoreKeeperGame](https://www.reddit.com/r/CoreKeeperGame/comments/11k476k/collectors_checklist_version_deux/)

---

## Credits to:

Icons are sourced from [CoreKeepersWorkshop by RussDev7](https://github.com/RussDev7/CoreKeepersWorkshop).  
All credit goes to the original creators of the sprites.

Favicon is from the [Core Keper wiki](https://static.wikia.nocookie.net/core-keeper/).

---


## TODO

- Clean up the project structure
- Remove unused assets (there are — and will be — a lot 😅)
- Note: Only the required assets are loaded, even if extras are present
- When an asset is added, you will need to clear the data. I want to avoid that and add the new data seamlessly.
- Boss collections based on boss
- Fish collection based on location
- Convert images from PNG to WEBP
- Improve the UI
- Add search functionality
- Add filter functionality
- Implement PWA
- Improve README
- Add language support

## How to Contribute

- To categorize an item, it needs to be added to the corresponding `_items.py` lists found under `./script`.
- Then run `script.py`, and it will generate the needed JSON files that the front-end uses.


---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/](http://localhost:3000/) with your browser to see the result.
