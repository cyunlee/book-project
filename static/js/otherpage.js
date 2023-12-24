const followBtn = document.querySelector('.follow');
const unfollowBtn = document.querySelector('.unfollow');

function follow() {
    followBtn.addEventListener('click', () => {
        followBtn.classList.add('hidden');
        unfollowBtn.classList.remove('hidden');
    });
}

function unfollow() {
    unfollowBtn.addEventListener('click', () => {
        followBtn.classList.remove('hidden');
        unfollowBtn.classList.add('hidden');
    });
}