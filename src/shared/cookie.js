

// 쿠키 가져오기
const getCookie = (name) => {
    let value = "; " + document.cookie;
    let parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        // parts 라는 원본 배열에 맨뒤에 있는게 사라짐.
        return parts.pop().split(";").shift();
    }

}


// 쿠키 만들기
const setCookie = (name, value, exp = 5) => {

    let date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;

}


// 쿠키 삭제
const deleteCookie = (name) => {
    let date = new Date("2020-01-01").toUTCString();

    document.cookie = name + "=; expires=" + date;

}


export { getCookie, setCookie, deleteCookie };