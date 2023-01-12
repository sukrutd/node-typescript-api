import PostModel from '@/resources/post/post.model';
import Post from '@/resources/post/post.interface';

class PostService {
    private post = PostModel;

    /**
     * Create a new post
     * @param title
     * @param body
     */
    public async create(title: string, body: string): Promise<Post> {
        try {
            const post = await this.post.create({ title, body });
            return post;
        } catch (err) {
            throw new Error('Unable to create post.');
        }
    }
}

export default PostService;
