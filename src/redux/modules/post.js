// 액션과 리듀서를 편하게 만들어주는 역할
import { createAction, handleActions } from "redux-actions";
import { storage } from "../../shared/firebase";

// 불변성 관리
import { produce } from "immer";

import moment from "moment";
import axios from "axios";

import { actionCreators as imageActions } from "./image";
import { history } from "../configStore";


const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";
const LIKE_POST = "LIKE_POST";

const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post, layout) => ({ post, layout }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({ post_id, post }));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));
const likePost = createAction(LIKE_POST, (post_id, post) => ({ post_id, post }));

const token = sessionStorage.getItem('token');

const initialState = {
    list: [],
    paging: { start: null, next: null, size: 3 },
    is_loading: false,
    p_loading: false,
}

const initialPost = {
    image_url: "http://i.postimg.cc/Zq3qBrgR/june.jpg",
    content: "",
    commentCnt: null,
    likeCnt: null,
    isLike: false,
    created: moment().format("YYYY-MM-DD hh:mm:ss"),
    postId: null,
}


const getPostBK = () => {
    return function (dispatch, getState, { history }) {
        const log = sessionStorage.getItem('token') ? true : false
        console.log("login : ", log)
        if (log) {
            axios({
                method: 'get',
                url: 'http://junehan-test.shop/api/posts',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                dispatch(setPost(response.data.data))
            }).catch((err) => {
                console.log(err.message);
            })
        }
        else {
            axios({
                method: 'get',
                url: 'http://junehan-test.shop/api/posts',
                data: {

                }
            }).then((response) => {
                dispatch(setPost(response.data.data))
            }).catch((err) => {
                console.log(err.message);
            })
        }
    }
}



const getOnePostBK = (post_id) => {
    return function (dispatch, getState, { history }) {

        axios({
            method: 'get',
            url: `http://junehan-test.shop/api/posts/${post_id}`,
            headers: {
                authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            dispatch(setPost([response.data.data]));
        }).catch((err) => {
            console.log(err.message);
        })
    }
}



const addPostBK = (contents = "", layout = "top") => {
    return function (dispatch, getState, { history }) {

        const _user = getState().user.user_info;
        console.log(_user);
        const userInfo = {
            userNickname: _user.nickname,
            userProfile: _user.userProfile,
        };
        const _post = {
            ...initialPost,
            layout: layout,
            content: contents,
            created: moment().format("YYYY-MM-DD hh:mm:ss"),
        };

        const _image = getState().image.preview;
        const _upload = storage
            .ref(`images/${userInfo.userId}_${new Date().getTime()}`)
            .putString(_image, "data_url");

        _upload.then((snapshot) => {
            snapshot.ref
                .getDownloadURL()
                .then((url) => {
                    return url;
                })
                .then((url) => {
                    let post = { ..._post, title: "황연준짱", imageUrl: url };
                    axios({
                        method: 'post',
                        url: 'http://junehan-test.shop/api/posts',
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                        data: post


                    }).then((response) => {
                        dispatch(addPost(post));
                        dispatch(imageActions.setPreview(null));
                        history.replace("/");
                    })

                })
                .catch((error) => {
                    alert("IMAGE UPLOAD FAILED");
                    console.log("IMAGE UPLOAD FAILED!", error);
                });
        });
    };
};


const editPostBK = (post_id = null, post = {}) => {
    return function (dispatch, getState, { history }) {
        if (!post_id) {
            console.log("게시물 정보가 없습니다");
        }

        const _image = getState().image.preview;
        const _post_index = getState().post.list.findIndex(p => p.postId === parseInt(post_id));
        const _post = getState().post.list[_post_index];

        if (_image === _post.imageUrl) {
            axios({
                method: 'post',
                url: `http://junehan-test.shop/api/posts/${post_id}`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
                data: { ...post }
            }).then(response => {
                console.log("수정완료");
                dispatch(editPost(post_id, { ...post }));
                history.replace("/");
            }).catch((err) => {
                console.log("수정실패");
                history.replace("/");
                console.log(err.message);
            })
            return;

        } else {
            const user_nickname = getState().user.user_info.nickname;

            const _upload = storage
                .ref(`images/${user_nickname}_${new Date().getTime()}`)
                .putString(_image, "data_url");

            _upload.then(snapshot => {
                snapshot.ref.getDownloadURL().then(url => {
                    console.log(url);
                    return url;

                }).then(url => {
                    axios({
                        method: 'post',
                        url: `http://junehan-test.shop/api/posts/${post_id}`,
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                        data: { ...post, imageUrl: url }
                    }).then(response => {
                        console.log("수정완료");
                        dispatch(editPost(post_id, { ...post, imageUrl: url }));
                        history.replace("/");
                    }).catch((err) => {
                        console.log("수정실패");
                        history.replace("/");
                        console.log(err.message);
                    })

                }).catch((err) => {
                    window.alert("이미지 업로드에 문제가 있습니다");
                    console.log("이미지 업로드에 문제가 있습니다", err);
                })
            });
        }
    }
}


const deletePostBK = (post_id = null) => {
    return function (dispatch, getState, { history }) {

        if (!post_id) {
            console.log("게시물 정보가 없습니다");
            return;
        }

        axios({
            method: 'delete',
            url: `http://junehan-test.shop/api/posts/${post_id}`,
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(response => {
            console.log("삭제완료");
            dispatch(deletePost(post_id));
            history.replace("/");
        }).catch((err) => {
            console.log(err.message);
        });
    }
}


const likePostBK = (post_id = null) => {
    return function (dispatch, getState, { history }) {

        // 포스트 id불러와서 그 포스트의 isLike를 true로 해주고 count도 올려주고
        // 그 포스트의 isLike가 true였으면 false로해주고 count -1 해주고

        const post = getState().post.list.find(p => p.postId === parseInt(post_id));

        if (post.isLike === true) {

            axios({
                method: 'delete',
                url: `http://junehan-test.shop/api/posts/${post_id}/like`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }).then(response => {
                console.log("좋아요 취소 완료");
                dispatch(likePost(post_id, { ...post, isLike: false, likeCnt: parseInt(post.likeCnt) - 1 }))

            }).catch((err) => {
                console.log(err.message);
            });

        } else {

            axios({
                method: 'post',
                url: `http://junehan-test.shop/api/posts/${post_id}/like`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }).then(response => {

                console.log("좋아요 완료");
                dispatch(likePost(post_id, { ...post, isLike: true, likeCnt: parseInt(post.likeCnt + 1) }))

            }).catch((err) => {
                console.log(err.message);
            });

        }
    }
}




export default handleActions(
    {
        [SET_POST]: (state, action) => produce(state, (draft) => {
            console.log("SET POST : ", action.payload.post_list);
            draft.list = action.payload.post_list;
        }),

        [ADD_POST]: (state, action) => produce(state, (draft) => {
            draft.list.unshift(action.payload.post);
        }),

        [EDIT_POST]: (state, action) => produce(state, (draft) => {
            let index = draft.list.findIndex((p) => p.postId === parseInt(action.payload.post_id));
            draft.list[index] = { ...draft.list[index], ...action.payload.post };
        }),

        [DELETE_POST]: (state, action) => produce(state, (draft) => {
            let index = draft.list.findIndex((p) => p.postId === parseInt(action.payload.post_id));
            draft.list.splice(index, 1);
        }),

        [LIKE_POST]: (state, action) => produce(state, (draft) => {
            let index = draft.list.findIndex((p) => p.postId === parseInt(action.payload.post_id));
            draft.list[index] = { ...draft.list[index], ...action.payload.post };
        })
    },
    initialState
);


const actionCreators = {
    setPost,
    addPost,
    getPostBK,
    getOnePostBK,
    addPostBK,
    editPost,
    editPostBK,
    deletePostBK,
    likePostBK,
};


export { actionCreators };