async function signUp() {
    const form = document.forms['register'];
    try{
        const response = await axios({
            method: 'POST',
            url: '/signup_post',
            data: {
                u_name: form.name.value,
                u_email: form.email.value,
                u_id: form.id.value,
                u_pw: form.pw.value,
            },
        });

        if(response.data.result){
            alert('회원가입을 축하드립니다');
            document.location.href='/';
        }
        else {
            if (response.data.msg == 'name duplicated') {
                alert('name이 중복됩니다');
            }
            else {
                alert('id가 중복됩니다');
            }
        }
    } catch(error){
        console.log(error);
    }
}