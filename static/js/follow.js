async function follow_set(otherId){
    const follower = document.querySelector('.follower-container .number')
    const following = document.querySelector('.following-container .number')
	try {
		const response = await axios({
			method: "GET",
			url: "/follow_number_get",
			params: {
				otherId : otherId,
			},
		})
		follower.innerHTML = response.data.followerNum;
		following.innerHTML = response.data.followingNum;
	} catch (error) {
		console.log('interval error : ',error);
	}
}

async function follow_list_set(otherId){
	const following = document.querySelector('.following-list .followings-container');
	const follower = document.querySelector('.follower-list .followers-container');
	
	let followingListHTML = ``;
	let followerListHTML = ``;
	try {
		const response = await axios({
			method : "GET",
			url: "/follow_list_get",
			params: {
				otherId : otherId,
			},
		})
		const followingObj = response.data.followingObj;
		const followerObj = response.data.followerObj;
		followingObj.forEach(user => {
				followingListHTML += 	`		<div class="following-account">
			<div class="account-image">
				<img src="/${user.u_profile}" alt="프사"></img>
			</div>
			<div class="account-info">
				<div class="account-name">${user.u_name}</div>
				<div class="account-id">@${user.u_id}</div>
			</div>
		</div>
		`
		})
		followerObj.forEach(user => {
			followerListHTML += 	`		<div class="following-account">
		<div class="account-image">
			<img src="/${user.u_profile}" alt=""></img>
		</div>
		<div class="account-info">
			<div class="account-name">${user.u_name}</div>
			<div class="account-id">@${user.u_id}</div>
		</div>
	</div>
	`
	})
	} catch (error) {
		console.log('interval error : ',error);
	}
	
	following.innerHTML = followingListHTML;
	follower.innerHTML = followerListHTML;
	
	
	


}