import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentList from "../components/comment/CommentList";
import CommentWrite from "../components/comment/CommentWrite";
import Footer from "../components/Footer";
import Post from "../components/post/Post";
import { Grid } from "../elements";
import { actionCreators as postActions } from "../redux/modules/post";
import Permit from "../shared/Permit";


const PostDetail = (props) => {

    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user_info);
    const post_id = props.match.params.id;
    const post_index = post_list.findIndex(p => p.postId === parseInt(post_id));
    console.log(post_index);
    const post = post_list[post_index];
    const dispatch = useDispatch();


    useEffect(() => {
        if (post) {
            return;
        }
        dispatch(postActions.getOnePostBK(post_id));
    }, []);



    return (
        <>
            <Grid
                bg="#f4f4f4" padding="15px 0px 47px 0px">
                <Grid

                    margin="8px 0px" bg="#ffffff" paddingBottom="55px">
                    {post && (
                        <Post {...post} is_me={post.nickname === user_info?.nickname} />
                    )}
                    <Permit>
                        <CommentWrite post_id={post_id} />
                    </Permit>
                    <CommentList post_id={post_id} is_me />
                </Grid>
            </Grid>
            <Footer></Footer>
        </>
    )
}

export default PostDetail;