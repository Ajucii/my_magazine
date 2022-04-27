import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import "moment";
import moment from "moment";
import { actionCreators as postActions } from "./post";
import axios from "axios";
import { realtime } from "../../shared/firebase";
import { getToken } from "../../shared/getToken";


const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";
const EDIT_COMMENT = "EDIT_COMMENT";
const DELETE_COMMENT = "DELETE_COMMENT";


const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({ post_id, comment_list }));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({ post_id, comment }));
const editComment = createAction(EDIT_COMMENT, (post_id, comment) => ({ post_id, comment }))
const deleteComment = createAction(DELETE_COMMENT, (post_id, comment_id) => ({ post_id, comment_id }));


const initialState = {
    list: [],
    is_change: false,
};



// 댓글 가져오기 미들웨어
const getCommentBK = (post_id = null) => {
    return function (dispatch, getState, { history }) {

        const token = sessionStorage.getItem('token')

        if (!post_id) {
            return;
        }
        axios({
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


// 댓글 추가 미들웨어
const addCommentBK = (post_id, content) => {
    return function (dispatch, getState, { history }) {

        const token = sessionStorage.getItem('token')

        const user_info = getState().user.user_info;
        const post = getState().post.list.find((l) => l.postId === parseInt(post_id));
        console.log(post);

        let comment = {
            post_id: parseInt(post_id),
            nickname: user_info.nickname,
            imageUrl: user_info.userProfile,
            content: content,
            created: moment().format("YYYY-MM-DD hh:mm:ss"),
        }

        axios({
            method: 'post',
            url: `http://junehan-test.shop/api/posts/${post_id}/comments`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            data: comment

        }).then((response) => {
            comment = { ...comment, commentId: response.data.data.id };
            dispatch(addComment(post_id, comment));
            if (post) {
                // 코멘트 갯수 리렌더링을 위한 리듀서 적용
                dispatch(postActions.editPost(post_id, {
                    commentCnt: parseInt(post.commentCnt) + 1,
                }))

                // 여기서 작성자(user nickname)과 포스트에 기록된 (nickname)과 비교하여 자기가 쓴글이면 알람안울리게 할 것

                // list애다가 알림내역 모두 저장
                const _noti_item = realtime.ref(`noti/${post.nickname}/list`).push();

                _noti_item.set({
                    post_id: post.postId,
                    user_name: comment.nickname,
                    image_url: post.imageUrl,
                    insert_dt: comment.created
                }, (err) => {
                    if (err) {
                        console.log("알림 저장 실패");
                    } else {
                        const notiDB = realtime.ref(`noti/${post.nickname}`);
                        notiDB.update({ read: false });
                    }
                });
            }
        })
    }
}



// 댓글 수정 미들웨어
const editCommentBK = (post_id = null, comment = {}) => {
    return function (dispatch, getState, { history }) {

        const token = sessionStorage.getItem('token')
        const comment_list = getState().comment.list

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
            // 댓글 수정 시 리듀서를 호출해도 수정한 댓글 리렌더링이 안되는 문제 해결 필요
            dispatch(editComment(post_id, { ...comment }))

        }).catch((err) => {
            console.log(err.message);
        })

    }
}


// 댓글 삭제 미들웨어
const deleteCommentBK = (post_id = null, comment_id = null) => {
    return function (dispatch, getState, { history }) {

        const token = sessionStorage.getItem('token')

        const post = getState().post.list.find((l) => l.postId === parseInt(post_id));

        axios({
            method: 'delete',
            url: `http://junehan-test.shop/api/posts/${post_id}/comments/${comment_id}`,
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(response => {
            dispatch(deleteComment(post_id, comment_id));

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



// 댓글 리듀서
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
            let index = draft.list[action.payload.post_id].findIndex((p) => p.commentId === parseInt(action.payload.comment.commentId));
            draft.list[action.payload.post_id][index] = { ...draft.list[index], ...action.payload.comment };

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