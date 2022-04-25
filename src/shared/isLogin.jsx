
// 로그아웃 후 다른 아이디로 로그인했을 때 바뀐 토큰값을 확인하기 위한 함수
export const isLogin = () => {

    const token = sessionStorage.getItem('token')
    if (token) {
        return token
    } else {
        return false
    }
}