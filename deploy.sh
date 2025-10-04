#!/bin/bash

# Build the production site
echo "Building production site..."
hugo --minify

# Navigate to public directory
cd public

# Initialize git if not already initialized
if [ ! -d .git ]; then
    git init
    git branch -M gh-pages
    git remote add origin https://github.com/bishopbpharmd/Pharmacy-AI-Newsletter.git
fi

# Add all files
echo "Adding files to git..."
git add .

# Commit with timestamp
echo "Committing changes..."
git commit -m "Deploy site - $(date)"

# Force push to gh-pages branch
echo "Pushing to GitHub Pages..."
git push -f origin gh-pages

# Return to root directory
cd ..

echo "Deployment complete!"

