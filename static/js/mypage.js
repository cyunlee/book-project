const editBtn = document.querySelector('.edit');
const upload = document.querySelector('.upload');
const uploadBtn = document.querySelector('.upload-text');
const selectBtn = document.querySelector('.select-text');
const profileContainer = document.querySelector('.profile-container');
const profileForm = document.querySelector('.profile-form');
const myInput = document.querySelector('#my-input');
const myButton = document.querySelector('#my-button');

const top1 = document.getElementById('top1');
const top2 = document.getElementById('top2');
const top3 = document.getElementById('top3');

const search1 = document.getElementById('search1');
const search2 = document.getElementById('search2');
const search3 = document.getElementById('search3');

const closeBtn1 = document.querySelector('.close1');
const closeBtn2 = document.querySelector('.close2');
const closeBtn3 = document.querySelector('.close3');

function showSearch1() {
    top1.addEventListener('click', () => {
        search1.classList.remove('hidden1');
        search2.classList.add('hidden2');
        search3.classList.add('hidden3');
    });
    // setTimeout(()=> {
    //     console.log('top1 검색창 닫음');
    //     search1.classList.add('hidden1');
    // }, 10000);
}

function showSearch2() {
    top2.addEventListener('click', () => {
        search1.classList.add('hidden1');
        search2.classList.remove('hidden2');
        search3.classList.add('hidden3');
    });
    // setTimeout(()=> {
    //     console.log('top2 검색창 닫음');
    //     search2.classList.add('hidden2');
    // }, 10000);
}

function showSearch3() {
    top3.addEventListener('click', () => {
        search1.classList.add('hidden1');
        search2.classList.add('hidden2');
        search3.classList.remove('hidden3');
    });
    // setTimeout(()=> {
    //     console.log('top3 검색창 닫음');
    //     search3.classList.add('hidden3');
    // }, 10000);
}

function close1() {
    closeBtn1.addEventListener('click', () => {
        search1.classList.add('hidden1');
    });
}

function close2() {
    closeBtn2.addEventListener('click', () => {
        search2.classList.add('hidden2');
    });

}

function close3() {
    closeBtn3.addEventListener('click', () => {
        search3.classList.add('hidden3');
    });
}

function init() {
editBtn.addEventListener('click', () => {
    upload.classList.remove('hidden');
});
setTimeout(()=> {
    console.log('프로필 버튼 닫음');
    upload.classList.add('hidden');
}, 10000);
}

// setTimeout(() => {
//     // console.log('프로필 버튼 닫음');
//     uploadBtn.classList.add('hidden');
// }, 10000);

//이걸 좀 바꿔주면 될 것 같군..


function selectPhoto() {
selectBtn.addEventListener('click', () => {
    myInput.click();
});
}

function uploadPhoto() {
uploadBtn.addEventListener('click', ()=>{
    myButton.click();
});
}

function submit() {
    const formData = new FormData();
    const file = document.querySelector('#my-input');
    const imageSetting = document.querySelector('.image-setting');

    formData.append('userfile', file.files[0]);
    
    axios({
        method: 'post',
        url: '/upload',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then((res)=>{
        const item = res.data;
        console.log('res.data.data.path >', item.data.path);
        console.log('res.data.id > ',item.id);
        axios({
            method:'patch',
			url:'/patchImg',
			data:{
                id : item.id,
				path: item.data.path,
			}
		}).then(()=> {
            location.reload();
        })
    })
}

async function delete_user() {
    const response = await axios({
        method: 'delete',
        url: '/deleteUser',
    })
    if (response.data.result) {
        location.href = '/';
        alert('회원이 탈퇴 되셨습니다');
    } else {
        console.log('Interval error');
    }
}

selectPhoto();
uploadPhoto();
