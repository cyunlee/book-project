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

const followingContainer = document.querySelector('.following-container');
const follwerContainer = document.querySelector('.follower-container');

const followingList = document.querySelector('.following-list');
const followerList = document.querySelector('.follower-list');

const closeFollowingBtn = document.querySelector('.close4');
const closeFollowerBtn = document.querySelector('.close5');


function lifeSearch(no) {
    // const title = document.getElementById('title').value;
    const resultBox = document.getElementById(`lifelist-result${no}`);

    $.ajax({
    method: 'get',
    url: '/lifeSearch', // 서버에 요청을 보내는 주소로 변경
    data:{
        title:document.getElementById(`lifelist${no}`).value,
    }
    }).done((res) => {
        console.log('res >' , res);
        // console.log('object >', JSON.parse(res));
        res.forEach(a => {
            // console.log('알라딘 bestseller a.isbn > ',a.isbn);
                let html = `
                <div>
                    <button type="button" class="life-btn" onclick="addLifeBook('${a.isbn}','${a.cover}',${no})">
                        <div>${a.title}</div>
                    </button>
                </div>
                `;
                resultBox.insertAdjacentHTML('beforeend',html);
        });
    });
    removeAllChildren(resultBox);
    // console.log('title> ',title)
    // document.getElementById('result').value=title;
}

function addLifeBook(isbn,cover,no){
    axios({
        method:'post',
        url:'/regLifeBook',
        data:{
            l_isbn:isbn,
            l_cover:cover,
            l_ranking:no,
        }
    }).then((res)=>{
        alert('인생작이 선택되었어요!');
        const cover=res.data.newLifeBook.l_cover;
        const changeCover = document.querySelector(`#top${no}`);
        const input = document.querySelector(`#lifelist${no}`);
        input.textContent="";
        changeCover.innerHTML=`<img class="lifeBook-cover" src="${cover}">`;

    })
    console.log(isbn);
}

//여기 에러나네요??
// document.addEventListener("DOMContentLoaded", ()=>{
//     getLifeBook();
// });

function getLifeBook(){
    axios({
        method:'get',
        url:'/getTop',
    }).then((res)=>{
        const lifeBookCover1 =  res.data.getTop1[0].l_cover;
        const lifeBookCover2 =  res.data.getTop2[0].l_cover;
        const lifeBookCover3 =  res.data.getTop3[0].l_cover;
        top1.innerHTML=`<img class="lifeBook-cover" src="${lifeBookCover1}">`;
        top2.innerHTML=`<img class="lifeBook-cover" src="${lifeBookCover2}">`;
        top3.innerHTML=`<img class="lifeBook-cover" src="${lifeBookCover3}">`;
        console.log(lifeBookCover1);
    })
}

function removeAllChildren(element) {
    while (element.firstChild) {
        removeAllChildren(element.firstChild);
        element.removeChild(element.firstChild);
    }
}

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

