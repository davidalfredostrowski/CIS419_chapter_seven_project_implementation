import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Post from './components/post';
const GET_POSTS = gql`
	    {
	    posts {
                id
                text
                user {
                    avatar
                    username
                }
            }
        }
`;






const ADD_POST = gql`
    mutation addPost($post : PostInput!) {
        addPost(post : $post) {
            id
            text
  	    user {
	    	username
		avatar
		}
  	}
    }
`;


const Feed = () => {
    const [postContent, setPostContent] = useState('');
    const { loading, error, data, fetchMore } = useQuery(GET_POSTS);




const [addPost] = useMutation(ADD_POST, {
       optimisticResponse: {
            __typename: "mutation",
            addPost: {
                __typename: "Post",
                text: postContent,
                id: -1,
                user: {
                    __typename: "User",
                    username: "Loading...",
		avatar: "/public/loading.png"
                }
            }
        }, 
        update(cache, { data: { addPost } }) {
	 cache.modify({
                fields: {
                    posts(existingPosts = []) {
                        const newPostRef = cache.writeFragment({
                            data: addPost,
                            fragment: gql`
                                fragment NewPost on Post {
                                    id
                                    type
                                }
                            `
                        });
                        return
                          [newPostRef, ...existingPosts];
                        
                    }
                }
            });
        }
    });




    const handleSubmit = (event) => {
        event.preventDefault();
        addPost({ variables: { post: { text: postContent } } });
        setPostContent('');
    };



    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    const { posts } = data;
    return (
        <div className="container">
            <div className="postForm">
                <form onSubmit={handleSubmit}>
                    <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Write your custom post!"/>
                    <input type="submit" value="Submit" />
                </form>
            </div>
            <div className="feed">
                {posts.map((post, i) =>
               	<Post key={post.id} post={post} />     



		)}
</div>
    </div> )}






export default Feed 
