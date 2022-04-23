import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import "moment";
import moment from "moment";
import { actionCreators as postActions } from "./post";
import axios from "axios";


const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";


const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({ post_id, comment_list }));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({ post_id, comment }));

const token = sessionStorage.getItem('token');

const initialState = {
    list: [],
};


const addCommentBK = (post_id, content) => {
    return function (dispatch, getState, { history }) {

        const user_info = getState().user.user_info;

        let comment = {

            nickname: user_info.nickname,
            imageUrl: user_info.userProfile,
            content: content,
            created: moment().format("YYYY-MM-DD hh:mm:ss"),
        }

        const post = getState().post.list.find((l) => l.postId === parseInt(post_id));

        axios({
            method: 'post',
            url: `http://junehan-test.shop/api/posts/${post_id}/comments`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            data: comment

        }).then((response) => {
            comment = { ...comment, commentId: response.data.data.id };
            console.log("댓글 저장 완료");
            dispatch(addComment(post_id, comment));
            if (post) {
                dispatch(postActions.editPost(post_id, {
                    commentCnt: parseInt(post.commentCnt) + 1,
                }))
            }
        })
    }
}


const getCommentBK = (post_id = null) => {
    return function (dispatch, getState, { history }) {

        if (!post_id) {
            return;
        }

        axios({
            // 로그인 안했을 때(토큰 없이) comment 가지고올 수 있음??
            method: 'get',
            url: `http://junehan-test.shop/api/posts/${post_id}`,
            headers: {
                authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            dispatch(setComment(post_id, response.data.data.comments))

        }).catch((err) => {
            console.log(err.message);
        })
    }
}


export default handleActions(
    {
        [SET_COMMENT]: (state, action) => produce(state, (draft) => {
            draft.list[action.payload.post_id] = action.payload.comment_list;
        }),
        [ADD_COMMENT]: (state, action) => produce(state, (draft) => {
            draft.list[action.payload.post_id].unshift(action.payload.comment);
        }),
    },
    initialState
)

const actionCreators = {
    setComment,
    addComment,
    getCommentBK,
    addCommentBK,
}

export { actionCreators };