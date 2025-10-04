# Pharmacy AI Newsletter - Hugo Site

This is the source code for the Pharmacy AI Newsletter website built with Hugo and the PaperMod theme.

## Local Development

To run the site locally:

```bash
hugo server
```

This will start a local server at `http://localhost:1313`. The site will automatically reload when you make changes.

## Deployment to GitHub Pages

**Important:** Never deploy the output from `hugo server` as it uses localhost URLs.

### Using the Deployment Script (Recommended)

Run the deployment script:

```bash
./deploy.sh
```

This script will:
1. Build the production site with `hugo --minify`
2. Navigate to the `public/` directory
3. Commit and push to the `gh-pages` branch

### Manual Deployment

If you need to deploy manually:

```bash
# Build production site
hugo --minify

# Navigate to public directory
cd public

# Initialize git if needed
git init
git branch -M gh-pages
git remote add origin https://github.com/bishopbpharmd/Pharmacy-AI-Newsletter.git

# Commit and push
git add .
git commit -m "Deploy site"
git push -f origin gh-pages

cd ..
```

## Site Structure

- `content/posts/` - Blog posts in Markdown format
- `layouts/` - Custom layouts (overrides theme defaults)
- `assets/css/extended/` - Custom CSS
- `static/` - Static assets
- `public/` - Generated site (not committed to main branch)

## Post Frontmatter

Each post should include:

```toml
+++
date = '2025-10-04T09:41:46-04:00'
draft = false
title = 'Post Title'
description = 'Brief description for tiles'
authors = 'Author names'
journal = 'Journal citation'
doi = 'DOI number'
+++
```

## Configuration

Site configuration is in `hugo.toml`. The baseURL is set to:
```
baseURL = "https://bishopbpharmd.github.io/Pharmacy-AI-Newsletter/"
```

This ensures all links work correctly in production.

