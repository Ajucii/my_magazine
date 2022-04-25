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

    const dispatch = useDispatch();

    const post_list = useSelector((state) => state.post.list);
    const post_id = props.match.params.id;
    const post_index = post_list.findIndex(p => p.postId === parseInt(post_id));
    const post = post_list[post_index];

    // post의 is_me prop이 true인지 false인지 판별하기 위해 유저정보 가져오기
    const user_info = useSelector((state) => state.user.user_info);


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
                <Grid margin="8px 0px" bg="#ffffff" paddingBottom="55px">
                    {post && (
                        // 해당 포스트의 작성자 닉네임(아이디)와 접속한 유저(접속하지 않았을 경우를 위해 옵셔널체이닝 사용)의 닉네임(아이디)가 같을 경우 is_me는 true
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