const editBtn = document.querySelector('.edit');
const upload = document.querySelector('.upload');
const uploadBtn = document.querySelector('.upload-text');
const selectBtn = document.querySelector('.select-text');
const profileContainer = document.querySelector('.profile-container');
const profileForm = document.querySelector('.profile-form');
const myInput = document.querySelector('#my-input');
const myButton = document.querySelector('#my-button');

function init() {
editBtn.addEventListener('click', () => {
    upload.classList.remove('hidden');
});
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

    formData.append('userfile', file.files[0]);
    
    axios({
        method: 'post',
        url: '/upload',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then((res)=>{
        const {
            file
        } = res.data;

        console.log(res.data.path);
    })
}

init();
selectPhoto();
uploadPhoto();
