import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import Post from "../components/post/Post";
import { Grid } from "../elements";
import { actionCreators as postActions } from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";

const PostList = (props) => {

    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user_info);
    const dispatch = useDispatch();

    const is_loading = useSelector((state) => state.post.is_loading);
    const paging = useSelector((state) => state.post.paging);




    return (
        <>
            <Grid bg="#f4f4f4" padding="15px 0px 47px 0px">
                <InfinityScroll
                    callNext={() => {
                        dispatch(postActions.getPostBK(paging.start));
                    }}
                    is_next={paging.next ? true : false}
                    loading={is_loading}
                >
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
                </InfinityScroll>
            </Grid>
            <Footer />
        </>
    )
}




export default PostList;