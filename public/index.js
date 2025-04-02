document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        
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
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('posts-list').innerHTML = '<p>Error loading posts.</p>';
    }
}); 