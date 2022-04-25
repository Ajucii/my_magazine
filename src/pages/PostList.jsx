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


    useEffect(() => {

        // 게시글을 추가하면 이미 리덕스에 리스트가 있으니까 getPost를 하지 않음. 그럼 이미 있던 리덕스에
        // 새로추가한 게시물을 추가. 가지고 올 때 게시글 정렬을 최신순으로 해도 됨.
        // 즉 새로고침하면 post_list.length === 0이 되어 getPostFB 실행. 그럼 리덕스에도 리스트가 들어가므로
        // 다시 게시글을 추가하면 length가 0이 아님. 그래서 추가했을때 맨위로 올라가는것. [ADD_POST]에서 unshift해줬으니까..

        // post_list.length < 2로 바꿔준 이유는 게시물이 하나도 없을때 추가하면 getPostFB를 안해서 리덕스에 들어간 그거 하나밖에 안떠서
        if (post_list.length < 2) {
            dispatch(postActions.getPostBK());
        }
    }, []);

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