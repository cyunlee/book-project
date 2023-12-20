const form = document.forms['register']

async function nameCheck() {
    try{
        const response = await axios({
            method: 'POST',
            url: '/nameCheck_post',
            data: {
                u_name: form.name.value
            }
        })
        //시윤님 여기입니다!!!!!!!!!!!
        if (response.data.result) {
            alert('중복된 닉네임이 있어요');
        } else {
            alert('사용 가능한 닉네임입니다');
        }
    } catch (error){
        console.log(error);
    }
}

async function idCheck() {
    try{
        const response = await axios({
            method: 'POST',
            url: '/idCheck_post',
            data: {
                u_id: form.id.value
            }
        })
        //시윤님 여기입니다!!!!!!!!!!!
        if (response.data.result) {
            alert('중복된 아이디가 있어요');
        } else {
            alert('사용 가능한 아이디입니다');
        }
    } catch (error){
        console.log(error);
    }
}

async function signUp() {
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