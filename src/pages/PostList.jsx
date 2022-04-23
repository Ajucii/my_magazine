import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import Post from "../components/post/Post";
import { Grid } from "../elements";
import { actionCreators as postActions } from "../redux/modules/post";


const PostList = (props) => {

    const post_list = useSelector((state) => state.post.list);
    console.log(post_list);
    const user_info = useSelector((state) => state.user.user_info);
    const dispatch = useDispatch();





    return (
        <>
            <Grid bg="#f4f4f4" padding="15px 0px 47px 0px">
                <Grid>
                    {post_list.map((p, index) => {
                        if (p.nickname === user_info?.nickname) {
                            return (
                                <Grid
                                    bg="#ffffff"
                                    margin="8px 0px"
                                    key={p.postId}>
                                    <Post {...p} is_me />
                                </Grid>
                            )
                        } else {
                            return (
                                <Grid
                                    bg="#ffffff"
                                    margin="8px 0px"
                                    key={p.postId}>
                                    <Post {...p} />
                                </Grid>
                            )
                        }
                    })}
                </Grid>
            </Grid>
            <Footer />
        </>
    )
}




export default PostList;