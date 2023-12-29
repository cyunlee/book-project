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

const followBtn = document.querySelector('.follow');
const unfollowBtn = document.querySelector('.unfollow');


function close4() {
    closeFollowingBtn.addEventListener('click', () => {
        followingList.classList.add('hidden1');
    });
}

function close5() {
    closeFollowerBtn.addEventListener('click', () => {
        followerList.classList.add('hidden1');
    });
}


function following() {
    followingList.classList.remove('hidden4');
    followerList.classList.add('hidden5');
}

function follower() {
    followingList.classList.add('hidden4');
    followerList.classList.remove('hidden5');
}

function closeFollowing() {
    followingList.classList.add('hidden4');
}

function closeFollower() {
    followerList.classList.add('hidden5');
}


async function follow() {
	followBtn.addEventListener('click', () => {
        followBtn.classList.add('hidden');
        unfollowBtn.classList.remove('hidden');
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

// 읽은 책 개수
(async () => {
    try {
        const readNum = await axios({
            url: '/readNum',
            method: 'get',
            params: {
                u_id : otherId,
                b_wish : null
            }
        })
        console.log('내가 읽은 책 개수>',readNum.data);
        const rNums = readNum.data.rNumResult;
        document.querySelector('.number.read').innerHTML = rNums;
        // console.log('!!!!!',rNums);
    } catch(err) {
        console.log(err)
    }

})();

// 위시리스트 개수
(async () => {
    try {
        const wishNum = await axios({
            url: '/wishNum',
            method: 'get',
            params: {
                u_id : otherId,
                b_wish : null
            }
        })
        console.log('내가 읽은 책 개수>',wishNum.data);
        const wNums = wishNum.data.wNumResult;
        document.querySelector('.number.wish').innerHTML = wNums;
        // console.log('!!!!!',rNums);
    } catch(err) {
        console.log(err)
    }

})();