const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');

// Configure marked for security
marked.setOptions({
    headerIds: false,
    mangle: false
});

// Function to process markdown files
function processMarkdownFiles() {
    const posts = [];
    const postsDir = path.join(__dirname, 'posts');
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

    files.forEach(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
        const { attributes, body } = frontMatter(content);
        const html = marked.parse(body);
        
        posts.push({
            slug: file.replace('.md', ''),
            title: attributes.title || 'Untitled',
            date: attributes.date || new Date().toISOString(),
            author: attributes.author || 'Anonymous',
            excerpt: attributes.excerpt || '',
            content: html
        });
    });

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Write posts.json
    fs.writeFileSync(path.join(__dirname, 'public', 'posts.json'), JSON.stringify(posts, null, 2));
}

// Create public directory if it doesn't exist
fs.ensureDirSync(path.join(__dirname, 'public'));

// Process files
processMarkdownFiles();

// Export for Vercel
module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true }));
}; 