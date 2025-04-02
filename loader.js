const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');

// Configure marked for security
marked.setOptions({
    headerIds: false,
    mangle: false
});

// Create posts directory if it doesn't exist
const postsDir = path.join(__dirname, 'posts');
fs.ensureDirSync(postsDir);

// Function to process markdown files
function processMarkdownFiles() {
    const posts = [];
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
    fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));

    // If we're in a browser environment, update the DOM
    if (typeof document !== 'undefined') {
        const postsList = document.getElementById('posts-list');
        if (postsList) {
            postsList.innerHTML = posts.map(post => `
                <article>
                    <div class="post-meta">
                        <span>${new Date(post.date).toLocaleDateString()}</span>
                        <span> • </span>
                        <span>${post.author}</span>
                    </div>
                    <h2 class="post-title">
                        <a href="/post.html?post=${post.slug}.md">${post.title}</a>
                    </h2>
                    <div class="post-excerpt">${post.excerpt}</div>
                </article>
            `).join('');
        }
    }
}

// If we're in Node.js environment, process files immediately
if (typeof require !== 'undefined' && require.main === module) {
    processMarkdownFiles();
}

// Export for browser use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { processMarkdownFiles };
} 