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
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Export for Vercel
module.exports = async (req, res) => {
    try {
        const posts = processMarkdownFiles();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(posts));
    } catch (error) {
        console.error('Error processing posts:', error);
        res.status(500).json({ error: 'Failed to process posts' });
    }
}; 