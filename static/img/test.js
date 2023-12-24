const fs = require('fs');

const dir = './test';
try {
	if (!fs.existsSync(dir)) { // 해당 유저의 디렉토리가 있는지 확인
	  fs.mkdirSync(dir, { recursive: true }); // 없다면 디렉토리를 생성
	}
	} catch (err) {
	console.error(err);
	}