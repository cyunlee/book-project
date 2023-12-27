const form = document.forms['register']
const namediv = document.querySelector('.namediv');
const emaildiv = document.querySelector('.emaildiv');
const iddiv = document.querySelector('.iddiv');
const pwdiv = document.querySelector('.pwdiv');

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
        if (response.data.result == 'empty') {
            namediv.innerHTML='';
            namediv.innerHTML='<span style="color: red; font-size: 12px;">닉네임은 필수로 입력해주세요</span>';
        } else 
        if (response.data.result) {
            namediv.innerHTML='';
            namediv.innerHTML='<span style="color: red; font-size: 12px;">중복된 닉네임이 있습니다</span>';
        } else {
            namediv.innerHTML='';
            namediv.innerHTML='<span style="color: blue; font-size: 12px;">사용 가능한 닉네임입니다</span>';
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
        if (response.data.result == 'empty') {
            iddiv.innerHTML='';
            iddiv.innerHTML='<span style="color: red; font-size: 12px;">아이디는 필수로 입력해주세요</span>';
        } else 
        if (response.data.result) {
            iddiv.innerHTML='';
            iddiv.innerHTML='<span style="color: red; font-size: 12px;">중복된 아이디가 있습니다</span>';
        } else {
            iddiv.innerHTML='';
            iddiv.innerHTML='<span style="color: blue; font-size: 12px;">사용 가능한 아이디입니다</span>';
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
            else if(response.data.msg == 'id duplicated') {
                alert('id가 중복됩니다');
            } else {
                alert('db error');
            }
        }
    } catch(error){
        console.log(error);
    }
}