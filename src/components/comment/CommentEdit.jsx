import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Input, Button } from "../../elements";
import { actionCreators as commentActions } from "../../redux/modules/comment";


const CommentEdit = (props) => {

    const comment_list = useSelector((state) => state.comment.list);
    const post_id = props.postId;

    const index = comment_list[post_id].findIndex((c) => c.commentId === parseInt(props.commentId));
    const comment = comment_list[post_id][index];
    const [content, setContent] = useState(comment.content);
    const dispatch = useDispatch();


    const onChange = (e) => {
        setContent(e.target.value);
    }

    const commentEdit = () => {

        if (content === "") {
            window.alert("댓글을 입력해주세요")
            return null;
        }

        dispatch(commentActions.editCommentBK(post_id, { ...comment, content: content }));
        // 자식에서 부모 컴포넌트ㄹ에게 is_edit 상태 날리기
        props.is_edit(false);
        setContent("");
    }


    return (
        <Grid padding="16px" is_flex>
            <Input
                placeholder="댓글 내용을 입력해주세요"
                _onChange={onChange}
                value={content}
                onSubmit={commentEdit}
                is_submit="is_submit" />
            <Button width="70px" margin="0px 2px 0px 2px"
                _onClick={commentEdit}
            >
                수정</Button>
        </Grid>
    )
}

export default CommentEdit;