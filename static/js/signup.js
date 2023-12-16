async function signUp() {

const form = document.forms['register'];


try{
    const response = await axios({
        method: 'POST',
        url: '/register',
        data: {
            u_name: form.name.value,
            u_email: form.email.value,
            u_id: form.id.value,
            u_pw: form.pw.value,
        },
    });

    console.log(response);

    if(response.data.result){
        alert('회원가입을 축하드립니다');
        document.location.href='/';
    }
} catch(error){
    console.log(error);
}
}