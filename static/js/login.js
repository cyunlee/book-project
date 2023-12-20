async function logIn() {
    const form = document.forms["login"];

    try {
        const response = await axios({
            method: "POST",
            url: "/login_post",
            data: {
                id: form.id.value,
                pw: form.pw.value,
            },
        });
        if(response.data.result){
            alert('로그인 성공!');
            document.location.href = '/'
        } else {
            alert('아이디나 비밀번호를 확인하세요')
        }
    }catch(error){
        console.log(error);
    }
}

function logout() {
    location.href = '/logout';
}