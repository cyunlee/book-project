const { User } = require('../models/index');
const axios = require('axios')

exports.main = (req, res) => {
	res.render('index');
}
exports.signin = (req, res) => {
	res.render('login');
}
exports.signup = (req, res) => {
	res.render('signup');
}

exports.search = async (req, res) => {
	console.log('Cmain search req.query >' ,req.query);
	const query = req.query.title
	const currentPage = req.query.page

	try{
		const search = await axios({
			method: 'get',
            url: 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx',
			params: {
				ttbkey: 'ttbclue91204001',
				Query: query,
				QueryType: 'Title',
				Start: currentPage,
				Output: 'JS',
				MaxResults: 20,
				InputEncoding: 'utf-8',
				Cover: 'Big',
				Sort: 'Accuracy',
				Version: 20131101,
			}
		})
		console.log('Cmain search 알라딘 요청 결과 >', search.data.totalResults)
		let totalResults = search.data.totalResults // 알라딘 api에서 검색 결과 수
		// 알라딘 api에서 검색 결과를 200개 까지만 제공!!!!
		if(!totalResults) {
			totalResults = 0
		} else if(totalResults <= 200) {
            totalResults = totalResults
        } else {
            totalResults = 200
        }
		const totalPages = Math.ceil(totalResults / 20);
		const searchData = search.data.item; // 검색 결과 책 데이터
		console.log('page 수 >', totalPages);
		res.render('search', { query, searchData, totalPages });
	} catch(err) {
		console.log(err)
	}
}

exports.searchDetail = async (req, res) => {
	console.log('hiddenform으로 보내기 >',req.query);
	const query = req.query.isbn
	try{
		const searchDetail = await axios({
			method: 'get',
            url: 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
			params: {
				ttbkey: 'ttbclue91204001',
				ItemId: query,
				ItemIdType: 'ISBN',
				Output: 'JS',
				Cover: 'Big',
				Version: 20131101
			}
		})
		console.log('Cmain searchDetail 알라딘 요청 결과 >', searchDetail.data.item)
		const detailData = searchDetail.data.item[0];
		res.render('searchDetail', {query, detailData});
	} catch(err) {
		console.log(err)
	}

}

