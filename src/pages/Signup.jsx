import { Grid, Text, Button } from "../elements";
import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { history } from "../redux/configStore";


const Signup = () => {

    const dispatch = useDispatch();
    const is_session = sessionStorage.getItem('token') ? true : false;
    // react hook form을 통한 유효성 검사
    const { register, formState: { errors }, handleSubmit } = useForm({ mode: "onChange" });


    if (is_session) {
        window.alert("이미 로그인이 되어있습니다")
        history.replace("/");
    }


    const onSubmit = ({ nickname, password, passwordCheck }) => {
        if (password !== passwordCheck) {
            window.alert("비밀번호가 일치하지 않습니다.")
            return;
        }
        dispatch(userActions.signupBK(nickname, password, passwordCheck));
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid padding="16px" height="100vh">
                <Text size="32px" bold>
                    회원가입
                </Text>

                <Grid padding="16px 0px">
                    <InputBox>
                        <p>이메일</p><br></br>
                        {errors && <span>{errors?.email?.message}</span>}

                        <input
                            type="text"
                            placeholder="이메일을 입력해주세요"
                            {...register("email",
                                {
                                    required: "이메일은 필수입니다.",
                                    pattern: {
                                        value: /^[0-9a-zA-Z]([-_.0-9a-zA-Z])*@[0-9a-zA-Z]([-_.0-9a-zA-z])*.([a-zA-Z])*/,
                                        message: "올바른 이메일 형식이 아닙니다.",
                                    }
                                })}></input>
                    </InputBox>

                    <InputBox>
                        <p>아이디</p><br></br>
                        {errors && <span>{errors?.nickname?.message}</span>}
                        <input
                            type="text"
                            placeholder="아이디를 입력해주세요"
                            {...register("nickname",
                                {
                                    required: "아이디는 필수입니다.",
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{3,}$/,
                                        message: "아이디는 대,소문자 각각 1개, 숫자 1개가 포함되어야 합니다.",
                                    }
                                })}></input>
                    </InputBox>

                    <InputBox>
                        <p>비밀번호</p><br></br>
                        {errors && <span>{errors?.password?.message}</span>}
                        <input
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            {...register("password",
                                {
                                    required: "비밀번호는 필수입니다.",
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                                        message: "비밀번호는 대,소문자 각각 1개, 숫자 1개, 6자 이상으로 만들어주세요",
                                    }
                                })}></input>
                    </InputBox>

                    <InputBox>
                        <p>비밀번호 확인</p><br></br>
                        {errors && <span>{errors?.passwordCheck?.message}</span>}
                        <input
                            type="password"
                            placeholder="비밀번호를 다시 입력해주세요"
                            {...register("passwordCheck",
                                {
                                    required: "",
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                                        message: "",
                                    }
                                })}></input>
                    </InputBox>
                </Grid>
                <Button text="회원가입하기"></Button>
            </Grid>
        </form>
    )
}


const InputBox = styled.div`
  background : white;
  margin-bottom: 30px;

  & p{
    display: inline-block;
    font-size: 15px;

    margin: 0px;
    padding-bottom : 0px;
  }

  & span{
    color:tomato;
    font-size: 12px;
    margin-top: 0px;
  }

  & input {


    border:1px solid #212121;
    width : 100%;
    padding : 12px 4px;
    box-sizing : border-box;
  }

  & input:focus {
    outline: none !important;
    border: 2px tomato solid ;
  }
`;

export default Signup;