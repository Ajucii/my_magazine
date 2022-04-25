import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import Post from "../components/post/Post";
import { Grid } from "../elements";
import { actionCreators as postActions } from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";

const PostList = (props) => {

    const dispatch = useDispatch();

    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user_info);

    // 무한스크롤 상태값 가져오기
    const is_loading = useSelector((state) => state.post.is_loading);
    const paging = useSelector((state) => state.post.paging);

    useEffect(() => {
        // 게시물이 하나도 없을때 추가할 경우 리덕스에 저장된 포스트 1개만 보여지는 것을 방지하기 위함
        if (post_list.length < 2) {
            dispatch(postActions.getPostBK(paging.start));
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
                        return (
                            <Grid
                                bg="#ffffff"
                                margin="8px 0px"
                                key={p.postId}>
                                <Post {...p} is_me={p.nickname === user_info?.nickname} />
                            </Grid>
                        )
                    })}
                </InfinityScroll>
            </Grid>
            <Footer />
        </>
    )
}




export default PostList;