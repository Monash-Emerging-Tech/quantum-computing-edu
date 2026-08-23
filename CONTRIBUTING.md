# Contributing to Quantum Circuit Education Tool

## MNET members

### Organisation

MNET members should use the designated internal communication channels for notifying each other of
progress, pending reviews, completed reviews, and merges.

Please also use the designated internal documentation for adding ideas and self-allocating tasks.


## Outside contributors

Currently, our roadmap is only visible to internal MNET members, however if you'd like to contribute
to this project, please open an issue and/or reach out.


## Pull requests

### Branch names
Please push your changes to a branch with a concise, descriptive name,
optionally prefixed by your (user)name or a classification
(like "anthony/qpe_circuit" or "docs/terminology").

### Drafts
Feel free to open a draft PR for early review, however a draft will be assumed to be in-progress.

When a PR is ready for review and intended to be merged, it should no longer be a draft.

### Reviews
Small changes made by MNET members may be merged without review.

Large changes made by MNET members may be merged after approval of the feature by the wider
portfolio group (such as in a meeting) and review by any other MNET member.

Changes made by outside contributors should be approved by the majority of portfolio members and
reviewed by at least one MNET member before merging.

### Merging process
Branches should be rebased on the target branch and fast-forward merged,
avoiding merge conflicts and extraneous merge commits.
After a branch is merged, expect the remote branch to be deleted (or delete it yourself),
unless specified otherwise.


## Style guidelines

### Linting rules

This project uses Next JS's default ES Lint configuration for warnings,
and enforces TypeScript type checking at build time.

While developing, it is recommended to run `npm run ts:check` and `npm run lint` to quickly identify
TypeScript and linting errors, respectively, in addition to your preferred IDE linting plugins.

### Auto-formatting

Prettier, or an equivalent and compatible auto-formatter, is recommended to be used on all files.
Our Prettier formatting rules are defined in `prettierrc.ts`.

### Line length

Try to keep lines within 100 characters long, however this is not a strict limit.
Long, unbroken single-line strings are exempt.

### Markdown & LaTeX

Most pages are written in [MDX](https://mdxjs.com/), which allows us to embed JSX components
into our markdown files.
In general, you should try to avoid adding more custom components to markdown files, instead aiming
to create MDX files as close as possible to mainstream markdown.

A tentative goal is to transition away from JSX in markdown and towards custom MDX plugins, making
our pages more portable.

### CSS

This project supports Tailwind, however does not yet make effective use of it.
For now, most component-specific styles live in `component_name.module.css` files,
page-specific styles in `page_name.module.css`,
and global styles in `quantum-computing-edu-next/app/globals.css`.
Regardless, it is entirely acceptable to use inline Tailwind classes.

### Miscellaneous

- Ensure all files end with a newline character.
- 2-space indentation is the default for all source files.
- Extraneous whitespace, such as indented empty lines or trailing whitespace, should be removed.
- Lines in source files end in one LF character.
- All source files use UTF-8 encoding.
