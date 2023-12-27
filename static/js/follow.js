async function follow() {
	const otherUser = document.querySelector('#follow').value;
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

async function follow_set(){
    const follower = document.querySelector('#follower')
    const following = document.querySelector('#following')
	try {
		const response = await axios({
			method: "GET",
			url: "/follow_get",
		})
		follower.innerHTML = response.data.followerNum;
		following.innerHTML = response.data.followingNum;
	} catch (error) {
		console.log('interval error : ',error);
	}
}