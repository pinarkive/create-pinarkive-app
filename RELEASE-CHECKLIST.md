# Release checklist · create-pinarkive-app

- [ ] `npm install` and `npm start` / local `node index.js` smoke test
- [ ] Interactive flow: name + starter → project created, no `.git` in output
- [ ] Non-interactive: `node index.js test-next --template next --yes`
- [ ] Reject non-empty target directory
- [ ] `npm publish --access public` (npm org `pinarkive` or maintainer account)
- [ ] Tag release on GitHub
- [ ] Verify `npx create-pinarkive-app` resolves published package
