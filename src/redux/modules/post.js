import { createAction, handleActions } from "redux-actions";
import { storage } from "../../shared/firebase";
import { produce } from "immer";

import moment from "moment";
import axios from "axios";

import { actionCreators as imageActions } from "./image";
import { isLogin } from "../../shared/isLogin";


const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";
const LOADING = "LOADING";
const P_LOADING = "P_LOADING"


const setPost = createAction(SET_POST, (post_list, paging) => ({ post_list, paging }));
const addPost = createAction(ADD_POST, (post, layout) => ({ post, layout }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({ post_id, post }));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));
const p_loading = createAction(P_LOADING, (p_loading) => ({ p_loading }));


const initialState = {
    list: [],
    // 1 page부터 시작해서 다음페이지가 있으면 next는 true 없으면 false
    paging: { start: 1, next: true },
    is_loading: false,
    p_loading: false,
}

const initialPost = {
    image_url: "http://i.postimg.cc/Zq3qBrgR/june.jpg",
    content: "",
    commentCnt: 0,
    likeCnt: 0,
    isLike: false,
    createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
    postId: null,
}


// 포스트 가져오기 미들웨어
const getPostBK = (start = 1) => {
    return function (dispatch, getState, { history }) {

        let _paging = getState().post.paging;

        // 다음 페이지가 없으면 그만 부르자
        if (_paging.next === false) {
            return;
        }

        dispatch(loading(true));

        // 유저마다 포스트들에 저장된 isLike(좋아요한 포스트인지 아닌지) 가져오기 위해 토큰이 있으면
        // 토큰과 함께 api 요청, 없으면 토큰 없이 api 요청
        const token = isLogin();

        if (token) {
            axios({
                method: 'get',
                // 한 페이지당 포스트 갯수는 3개씩
                url: `http://junehan-test.shop/api/posts?page=${start}`,
                headers: {
                    authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                let post_list = response.data.data;
                let paging = {
                    start: ++start,
                    // 페이지 내에 포스트 갯수가 3개보다 적으면 다음페이지가 없으므로..
                    next: post_list.length < 3 ? false : true,
                }
                dispatch(setPost(post_list, paging));
            }).catch((err) => {
                console.log(err.message);
            })
        } else {
            axios({
                method: 'get',
                url: `http://junehan-test.shop/api/posts?page=${start}`,
                data: {}
            }).then((response) => {
                let post_list = response.data.data;
                let paging = {
                    start: ++start,
                    next: post_list.length < 3 ? false : true,
                }
                dispatch(setPost(post_list, paging));
            }).catch((err) => {
                console.log(err.message);
            })
        }
    }
}


// 포스트 한 개 가져오기 미들웨어
const getOnePostBK = (post_id) => {

    const token = isLogin();

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


// 포스트 추가 미들웨어
const addPostBK = (contents = "", layout = "top") => {
    return function (dispatch, getState, { history }) {

        const token = isLogin();
        dispatch(p_loading(true));

        const _user = getState().user.user_info;
        const userInfo = {
            nickname: _user.nickname,
            userProfile: _user.userProfile,
        };
        const _post = {
            ...initialPost,
            layout: layout,
            content: contents,
        };
        const _image = getState().image.preview;
        const _upload = storage
            .ref(`images/${userInfo.nickname}_${new Date().getTime()}`)
            .putString(_image, "data_url");

        _upload.then((snapshot) => {
            snapshot.ref
                .getDownloadURL()
                .then((url) => {
                    return url;
                })
                .then((url) => {
                    axios({
                        method: 'post',
                        url: 'http://junehan-test.shop/api/posts',
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                        data: { ...userInfo, ..._post, imageUrl: url, title: "빈 타이틀" }
                    }).then((response) => {
                        let post = { ...userInfo, ..._post, postId: response.data.data.id, imageUrl: url };
                        dispatch(addPost(post));
                        dispatch(imageActions.setPreview(null));
                        history.replace("/");
                    })
                })
                .catch((error) => {
                    alert("이미지 업로드에 실패했습니다.");
                    console.log(error.message);
                });
        });
    };
};


// 포스트 수정 미들웨어
const editPostBK = (post_id = null, post = {}) => {
    return function (dispatch, getState, { history }) {

        const token = isLogin();

        if (!post_id) {
            console.log("게시물 정보가 없습니다");
        }

        const _image = getState().image.preview;
        const _post_index = getState().post.list.findIndex(p => p.postId === parseInt(post_id));
        const _post = getState().post.list[_post_index];

        // 이미지를 교체하지 않았을 경우, 인자로 받아온 포스트의 컨텐츠와 레이아웃만 교체
        if (_image === _post.imageUrl) {
            axios({
                method: 'post',
                url: `http://junehan-test.shop/api/posts/${post_id}`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
                data: { ...post }

            }).then(response => {
                dispatch(editPost(post_id, { ...post }));
                history.replace("/");

            }).catch((err) => {
                history.replace("/");
                console.log(err.message);
            })
            return;

            // 이미지를 교체한 경우
        } else {
            const user_nickname = getState().user.user_info.nickname;

            const _upload = storage
                .ref(`images/${user_nickname}_${new Date().getTime()}`)
                .putString(_image, "data_url");

            _upload.then(snapshot => {
                snapshot.ref.getDownloadURL().then(url => {
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
                        dispatch(editPost(post_id, { ...post, imageUrl: url }));
                        history.replace("/");

                    }).catch((err) => {
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


// 포스트 삭제 미들웨어
const deletePostBK = (post_id = null) => {
    return function (dispatch, getState, { history }) {

        const token = isLogin();

        dispatch(p_loading(true));
        if (!post_id) {
            window.alert("게시물 정보가 없습니다")
            dispatch(p_loading(false));
            return;
        }

        axios({
            method: 'delete',
            url: `http://junehan-test.shop/api/posts/${post_id}`,
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then(response => {
            dispatch(deletePost(post_id));
            history.replace("/");
        }).catch((err) => {
            console.log(err.message);
        });
    }
}


// 포스트 좋아요 미들웨어
const likePostBK = (post_id = null) => {
    return function (dispatch, getState, { history }) {

        const token = isLogin()
        const post = getState().post.list.find(p => p.postId === parseInt(post_id));

        // 좋아요 상태라면 좋아요 취소
        if (post.isLike === true) {
            axios({
                method: 'delete',
                url: `http://junehan-test.shop/api/posts/${post_id}/like`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }).then(response => {
                // 좋아요 상태 및 갯수 리덕스 적용
                dispatch(editPost(post_id, { ...post, isLike: false, likeCnt: parseInt(post.likeCnt) - 1 }))

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
                dispatch(editPost(post_id, { ...post, isLike: true, likeCnt: parseInt(post.likeCnt + 1) }))

            }).catch((err) => {
                console.log(err.message);
            });

        }
    }
}



// 포스트 리듀서
export default handleActions(
    {
        [SET_POST]: (state, action) => produce(state, (draft) => {
            draft.list.push(...action.payload.post_list);
            draft.paging = action.payload.paging;
            draft.is_loading = false;
        }),

        [ADD_POST]: (state, action) => produce(state, (draft) => {
            draft.list.unshift(action.payload.post);
            draft.p_loading = false;
        }),

        [EDIT_POST]: (state, action) => produce(state, (draft) => {
            let index = draft.list.findIndex((p) => p.postId === parseInt(action.payload.post_id));
            draft.list[index] = { ...draft.list[index], ...action.payload.post };
        }),

        [DELETE_POST]: (state, action) => produce(state, (draft) => {
            let index = draft.list.findIndex((p) => p.postId === parseInt(action.payload.post_id));
            draft.list.splice(index, 1);
            draft.p_loading = false;
        }),

        [LOADING]: (state, action) => produce(state, (draft) => {
            draft.is_loading = action.payload.is_loading;
        }),

        [P_LOADING]: (state, action) => produce(state, (draft) => {
            draft.p_loading = action.payload.p_loading;
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