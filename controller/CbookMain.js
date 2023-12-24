//const BookMain = require('../../book_page/model/BookMain');
const axios = require('axios');
const xml2js = require('xml2js');

exports.get_bookshelf = (req, res) => {
    res.render('bookShelf');
    console.log('컨트롤러북쉘프')
}

/*exports.get_description = (req, res) => {
    res.render('book');
}*/



exports.get_description = async (req, res) => {
    //res.render('bookShelf/test');
    console.log('get descripytion')
    //console.log('리퀘스트 ', req);
    const bookTitle = req.query.title; // 데이터로 받은 책 제목

    try {
        const response = await axios.get('https://www.aladin.co.kr/ttb/api/ItemSearch.aspx', {
            params: {
                ttbkey: 'ttbwonluvv0940001',
                Query: bookTitle,
                version: '20131101',
                SearchTarget: 'Book',
                MaxResults: '5',
                Output: 'JS',
                Cover: 'Big',
            },
        });
        console.log('response > ', response.data.item);
        const items = response.data.item;
        res.json(items);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

};

exports.load_detail = (req, res) => {
    console.log('load detail이 받은 요청 쿼리 ', req.query);
    res.render('bookDetail');
}