# Falling Shapes

Test task: shapes fall through a rectangle. Click on empty space to add a shape, click on a shape to remove it.

Demo: https://rashevskyyy.github.io/falling-shapes/

## Run

```bash
npm install
npm run dev
```

`npm run deploy` builds the project and publishes it to GitHub Pages.

## Notes

- PixiJS 8, TypeScript, Vite
- all bonus points are done
- area counts only the visible part of the shapes, overlapping shapes are counted twice
- shapes are reused from a pool instead of creating new ones
