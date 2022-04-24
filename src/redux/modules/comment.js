import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import "moment";
import moment from "moment";
import { actionCreators as postActions } from "./post";
import axios from "axios";


const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";
const EDIT_COMMENT = "EDIT_COMMENT";
const DELETE_COMMENT = "DELETE_COMMENT";



const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({ post_id, comment_list }));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({ post_id, comment }));
const editComment = createAction(EDIT_COMMENT, (post_id, comment) => ({ post_id, comment }))
const deleteComment = createAction(DELETE_COMMENT, (post_id, comment_id) => ({ post_id, comment_id }));


const token = sessionStorage.getItem('token');

const initialState = {
    list: [],
    is_change: false,
};


const addCommentBK = (post_id, content) => {
    return function (dispatch, getState, { history }) {

        const user_info = getState().user.user_info;

        let comment = {
            post_id: parseInt(post_id),
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
            // 로그인 안했을 때(토큰 없이) comment 가지고올 수 있을까
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

const editCommentBK = (post_id = null, comment = {}) => {
    return function (dispatch, getState, { history }) {

        const comment_list = getState().comment.list
        console.log(comment_list);
        console.log(post_id);
        // const _comment_index = getState().comment.list.findIndex((l) => l.commentId === parseInt(comment_id));
        // const _comment = getState().comment.list[_comment_index];

        // console.log(_comment);

        axios({
            method: 'put',
            url: `http://junehan-test.shop/api/posts/${post_id}/comments/${comment.commentId}`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            data: {
                content: comment.content
            }
        }).then(response => {
            console.log("수정완료");
            dispatch(editComment(post_id, { ...comment }))
            history.push(`/post/${post_id}`)


        }).catch((err) => {
            console.log(err.message);
        })

    }
}



const deleteCommentBK = (post_id = null, comment_id = null) => {
    return function (dispatch, getState, { history }) {

        const post = getState().post.list.find((l) => l.postId === parseInt(post_id));

        axios({
            method: 'delete',
            url: `http://junehan-test.shop/api/posts/${post_id}/comments/${comment_id}`,
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(response => {
            console.log("삭제 완료");
            dispatch(deleteComment(post_id, comment_id));

            //이거 왜 하는지모르겠음 
            if (post) {
                dispatch(postActions.editPost(post_id, {
                    commentCnt: parseInt(post.commentCnt) - 1,
                }))
            }
        }).catch((err) => {
            console.log(err.message);
        });

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
        [DELETE_COMMENT]: (state, action) => produce(state, (draft) => {

            let index = draft.list[action.payload.post_id].findIndex((p) => p.commentId === parseInt(action.payload.comment_id));
            draft.list[action.payload.post_id].splice(index, 1);
        }),
        [EDIT_COMMENT]: (state, action) => produce(state, (draft) => {


            // 댓글 수정 시 리렌더링이 안되는 문제..
            let index = draft.list[action.payload.post_id].findIndex((p) => p.commentId === parseInt(action.payload.comment.comment_id));
            draft.list[index] = { ...draft.list[index], ...action.payload.comment };


        }),
    },
    initialState
)

const actionCreators = {
    setComment,
    addComment,
    getCommentBK,
    addCommentBK,
    editCommentBK,
    deleteCommentBK,
}

export { actionCreators };