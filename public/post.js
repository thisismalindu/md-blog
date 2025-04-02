document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get('post');

    if (!postFile) {
        document.getElementById('post-content').innerHTML = '<p>No post specified.</p>';
        return;
    }

    try {
        const response = await fetch('posts.json');
        const posts = await response.json();
        
        const post = posts.find(p => `${p.slug}.md` === postFile);
        
        if (!post) {
            document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
            return;
        }

        // Update page title
        document.title = post.title;

        // Render post content
        document.getElementById('post-content').innerHTML = `
            <div class="post-meta">
                <span>${new Date(post.date).toLocaleDateString()}</span>
                <span> • </span>
                <span>${post.author}</span>
            </div>
            <h1 class="post-title">${post.title}</h1>
            <div class="post-content">${post.content}</div>
        `;
    } catch (error) {
        console.error('Error loading post:', error);
        document.getElementById('post-content').innerHTML = '<p>Error loading post.</p>';
    }
}); 