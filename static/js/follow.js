async function follow() {
	const otherUser = document.querySelector('#follow').value;
	const response = await axios({
		method: "POST",
		url: "/follow",
		data: {
			followingId: otherUser
		}
	});
}

async function unfollow() {
	const otherUser = document.querySelector('#follow').value;
	const response = await axios({
		method: "POST",
		url: "/unfollow",
		data: {
			followingId: otherUser
		}
	});
}