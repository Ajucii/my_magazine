import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Input, Button } from "../../elements";
import { actionCreators as commentActions } from "../../redux/modules/comment";



const CommentWrite = (props) => {

    const [comment_text, setCommentText] = useState("");
    const dispatch = useDispatch();

    const onChange = (e) => {
        setCommentText(e.target.value);
    }

    const write = () => {
        if (comment_text === "") {
            window.alert("댓글을 입력해주세요")
            return null;
        }
        dispatch(commentActions.addCommentBK(props.post_id, comment_text));
        setCommentText("");
    }

    return (

        <Grid padding="16px" is_flex>
            <Input
                placeholder="댓글 내용을 입력해주세요"
                _onChange={onChange}
                value={comment_text}
                onSubmit={write}
                is_submit="is_submit" />
            <Button width="70px" margin="0px 2px 0px 2px"
                _onClick={write}
            >
                작성</Button>

        </Grid>
    )
}

export default CommentWrite;