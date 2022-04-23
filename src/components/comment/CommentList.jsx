import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Image, Text } from "../../elements";

import { actionCreators as commentActions } from "../../redux/modules/comment";



const CommentList = (props) => {

    const { post_id } = props;

    const dispatch = useDispatch();
    const comment_list = useSelector((state) => state.comment.list)


    console.log(comment_list);

    useEffect(() => {

        dispatch(commentActions.getCommentBK(post_id));

    }, []);

    // comment_list가 없고 post_id가 안 넘어왔을 때
    if (!comment_list[post_id] || !post_id) {
        return null;
    }

    return (

        <Grid padding="16px">
            {comment_list[post_id].map((c, index) => {
                return (
                    <CommentItem key={c.commentId} {...c} />
                )
            })}
        </Grid>


    )
}

// props로 받아온거가 있으니까 디폴트props설정
CommentList.defaultProps = {
    post_id: null,
}


export default CommentList;



const CommentItem = (props) => {

    const { imageUrl, nickname, userId, postId, content, created } = props;
    return (
        <Grid is_flex>
            <Grid is_flex width="auto">
                <Image shape="circle" />
                <Text bold>{nickname}</Text>
            </Grid>
            <Grid is_flex margin="0px 4px">
                <Text margin="0px">{content}</Text>
                <Text margin="0px">{created}</Text>
            </Grid>
        </Grid>
    )
}


CommentItem.defaultProps = {
    commentId: null,
    user_profile: "https://i.postimg.cc/Zq3qBrgR/june.jpg",
    nickname: "june",
    userId: null,
    postId: null,
    content: "귀여운 연준이네요!",
    created: "2022.04.14 19:00:00",
}