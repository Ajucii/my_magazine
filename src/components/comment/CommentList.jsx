import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Image, Text } from "../../elements";

import { actionCreators as commentActions } from "../../redux/modules/comment";

import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import CommentEdit from "./CommentEdit";



const CommentList = (props) => {

    const dispatch = useDispatch();
    const comment_list = useSelector((state) => state.comment.list);
    const user_info = useSelector((state) => state.user.user_info);

    useEffect(() => {
        dispatch(commentActions.getCommentBK(props.post_id));
    }, []);

    // comment_list가 없고 post_id가 안 넘어왔을 때 return null
    if (!comment_list[props.post_id] || !props.post_id) {
        return null;
    }

    return (
        <Grid padding="0px 16px 0px 0px">
            {comment_list[props.post_id].map((c, index) => {
                // 코멘트를 작성한 유저와 접속한 유저의 닉네임(아이디)가 같을 경우 댓글 수정, 삭제를 위한 is_me prop 전달
                if (c.nickname === user_info?.nickname) {
                    return (
                        <Grid key={c.commentId}>
                            <CommentItem is_me {...c} />
                        </Grid>
                    )
                } else {
                    return (
                        <Grid key={c.commentId}>
                            <CommentItem {...c} />
                        </Grid>
                    )
                }
            })}
        </Grid>
    )
}


CommentList.defaultProps = {
    post_id: null,
}

export default CommentList;



const CommentItem = (props) => {

    const dispatch = useDispatch();
    const [is_edit, setIs_edit] = useState(false);

    const editComment = () => {
        setIs_edit(!is_edit)
    }

    return (
        <>
            <Grid is_flex>
                <CardHeader
                    avatar={
                        <Avatar src="https://i.postimg.cc/Zq3qBrgR/june.jpg">
                        </Avatar>
                    }
                    title={props.nickname}
                    subheader={props.created}
                />

                {props.is_me &&
                    <Grid is_flex width="auto">
                        <Button is_edit margin="2px" width="40px" _onClick={editComment}>수정
                        </Button>
                        <Button is_edit margin="2px" width="40px" _onClick={() => {
                            if (window.confirm("삭제하시겠습니까?")) {
                                dispatch(commentActions.deleteCommentBK(props.post_id, props.commentId));
                            }
                        }}>삭제</Button>
                    </Grid>}
            </Grid>
            <Grid is_flex margin="0px 0px 10px 10px">
                {is_edit ? <CommentEdit is_edit={setIs_edit} postId={props.post_id} commentId={props.commentId} /> : <Text margin="0px 0px 10px 10px">{props.content}</Text>}
            </Grid>
        </>
    )
}


CommentItem.defaultProps = {
    commentId: null,
    user_profile: "https://i.postimg.cc/Zq3qBrgR/june.jpg",
    nickname: "june",
    userId: null,
    post_id: null,
    content: "귀여운 연준이네요!",
    created: "2022.04.14 19:00:00",
}