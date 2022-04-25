import React, { useEffect, useState } from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../redux/configStore";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";



const PostWrite = (props) => {

    const is_session = sessionStorage.getItem('token') ? true : false;
    const preview = useSelector((state) => state.image.preview);
    const dispatch = useDispatch();

    const post_list = useSelector((state) => state.post.list);

    const post_id = props.match.params.id;
    const is_edit = post_id ? true : false;

    let _post = is_edit ? post_list.find((p) => p.postId === parseInt(post_id)) : null;

    const [contents, setContents] = useState(_post ? _post.content : "");
    const [layout, setLayout] = useState(_post ? _post.layout : "top");


    // 리덕스에 데이터가 없으면(새로고침하면) 뒤로 가게..
    useEffect(() => {
        if (is_edit && !_post) {
            console.log('포스트 정보가 없어요!');
            history.goBack();
            return;
        }
        // is_edit이 true(수정모드)면 _post의 이미지 받아오기
        if (is_edit) {
            dispatch(imageActions.setPreview(_post.imageUrl));
        }
    }, []);

    const changeContents = (e) => {
        setContents(e.target.value);
    }


    const addPost = () => {
        if (preview === null) {
            window.alert("이미지를 업로드해주세요");
            return;
        }
        dispatch(postActions.addPostBK(contents, layout));
    }

    const editPost = () => {
        dispatch(postActions.editPostBK(post_id, { ..._post, content: contents, layout }))
    }


    // 로그인 상태가 아니면 PostWrite페이지 들어왔을 때 막히게끔
    if (!is_session) {
        return (
            <Grid margin="100px 0px" padding="16px" >
                <Text size="32px" bold>
                    로그인이 필요한 기능입니다.
                </Text>
                <Text size="16px">
                    로그인 부탁드립니다.
                </Text>
                <Button
                    _onClick={() => {
                        history.replace("/login");
                    }}
                >
                    로그인 하러가기
                </Button>
            </Grid>
        );
    }


    return (
        <>
            <Grid padding="16px">
                <Text margin="20px 0px 30px 0px" size="36px" bold>
                    {is_edit ? "수정하기" : "새 게시글"}
                </Text>
                <Text margin="0px" size="22px" bold>이미지</Text>
                <Upload />
            </Grid>

            <Grid padding="16px">
                <Text margin="0px" size="22px" bold>레이아웃</Text>
            </Grid>
            <ToggleButtonGroup
                style={{ margin: "0px 0px 0px 15px" }}
                value={layout}
                exclusive
                onChange={(e) => {
                    setLayout(e.target.value);
                }}
            >
                <ToggleButton value="top">이미지 위</ToggleButton>
                <ToggleButton value="bottom">이미지 아래</ToggleButton>
                <ToggleButton value="left">이미지 왼쪽</ToggleButton>
                <ToggleButton value="right">이미지 오른쪽</ToggleButton>
            </ToggleButtonGroup>

            <Grid padding="16px">
                <Text margin="0px" size="22px" bold>미리보기</Text>
            </Grid>


            {layout === "top" && (
                <>
                    <Grid>
                        <Image shape="preview" src={preview ? preview : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"} />
                    </Grid>

                    <Grid padding="16px">
                        <Input value={contents} _onChange={changeContents} label="게시글 작성" placeholder="게시글 작성" multiLine />
                    </Grid>
                </>
            )}

            {layout === "bottom" && (
                <>
                    <Grid padding="16px">
                        <Input value={contents} _onChange={changeContents} label="게시글 작성" placeholder="게시글 작성" multiLine />
                    </Grid>
                    <Grid>
                        <Image shape="rectangle" src={preview ? preview : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"} />
                    </Grid>
                </>
            )}


            {layout === "left" && (

                <Grid is_left>
                    <Grid padding="16px">
                        <Input value={contents} _onChange={changeContents} label="게시글 작성" placeholder="게시글 작성" multiLine />
                    </Grid>
                    <Grid>
                        <Image shape="rectangle" src={preview ? preview : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"} />
                    </Grid>
                </Grid>


            )}

            {layout === "right" && (
                <>
                    <Grid is_flex>
                        <Grid padding="16px">
                            <Input value={contents} _onChange={changeContents} label="게시글 작성" placeholder="게시글 작성" multiLine />
                        </Grid>
                        <Grid>

                            <Image shape="preview" src={preview ? preview : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.png"} />
                        </Grid>
                    </Grid>

                </>
            )}


            <Grid padding="16px">
                {is_edit ? (
                    <Button disabled={contents === "" || preview === null} text="게시글 수정" _onClick={editPost}>게시글 수정</Button>
                ) : (
                    <Button disabled={contents === "" || preview === null} text="게시글 작성" _onClick={addPost}>게시글 작성</Button>
                )}
            </Grid>
        </>

    )
}

export default PostWrite;