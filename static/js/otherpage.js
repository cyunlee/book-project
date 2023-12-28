const followBtn = document.querySelector('.follow');
const unfollowBtn = document.querySelector('.unfollow');

async function follow() {
	followBtn.addEventListener('click', () => {
        followBtn.classList.add('hidden');
        unfollowBtn.classList.remove('hidden');
    });
	const otherUser = document.querySelector('#id').value;
	otherUser = otherUser.substr(1)
	console.log('idCheck>>>@@@@>>', otherUser);
	try {
		await axios({
			method: "POST",
			url: "/follow",
			data: {
				followingId: otherUser
			}
		});	} catch (error) {
		console.log('interval error : ',error);
	}
}

async function unfollow() {
	unfollowBtn.addEventListener('click', () => {
        followBtn.classList.remove('hidden');
        unfollowBtn.classList.add('hidden');
    });
	const otherUser = document.querySelector('#follow').value;
	try {
		await axios({
			method: "POST",
			url: "/unfollow",
			data: {
				followingId: otherUser
			}
		});
	} catch (error) {
		console.log('interval error : ',error);
	}
}
