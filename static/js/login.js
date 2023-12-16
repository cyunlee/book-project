async function logIn() {
    const form = document.forms["login"];

    try {
        const response = await axios({
            method: "POST",
            url: "/login",
            data: {
                u_id: form.id.value,
                u_pw: form.pw.value,
            },
        });

        if(response.data.result){
            alert('로그인 성공!');
        }
    }catch(error){
        console.log(error);
    }
}