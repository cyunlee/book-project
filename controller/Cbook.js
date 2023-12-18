const book = require('../models/index');
const axios = require('axios');

exports.link = (req,res)=>{
    res.render('index')
}

exports.main = (req,res)=>{
    res.render('main')
}

// 알라딘 검색 api
exports.getBooks=async (req, res) => {
    try {
        const title = req.query.title;
        console.log(title);
        const response = await axios.get('https://www.aladin.co.kr/ttb/api/ItemSearch.aspx', {
        params: {
          ttbkey: 'ttbwonluvv0940001',
          Query: title,
          version: '20131101',
          SearchTarget:'Book',
          MaxResults:'5',
          Output:'JS',
          Cover:'Big',
        },
      });
      console.log('Cbook getBooks response > ',response.data.item);
      const items = response.data.item;
      res.json(items);
    
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}

// 알라딘 베스트셀러 api
exports.getBestSeller = async (req,res)=>{
  try {
    const response = await axios.get('http://www.aladin.co.kr/ttb/api/ItemList.aspx', {
    params: {
        ttbkey: 'ttbwonluvv0940001',
        QueryType: 'BestSeller',
        version: '20131101',
        SearchTarget:'Book',
        MaxResults:'5',
        Output:'JS',
        Cover:'Big',
      },
    });

    console.log('Cbook getBestSeller response > ',response.data.item);
    const items = response.data.item;
    res.json(items);

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// 알라딘 추천 신간 api
exports.getBrendNew = async (req,res)=>{
  try {
    const response = await axios.get('http://www.aladin.co.kr/ttb/api/ItemList.aspx', {
    params: {
        ttbkey: 'ttbwonluvv0940001',
        QueryType: 'ItemNewSpecial',
        version: '20131101',
        SearchTarget:'Book',
        MaxResults:'5',
        Output:'JS',
        Cover:'Big',
      },
    });
    console.log('Cbook getBrendNew response > ',response.data.item);
    const items = response.data.item;
    res.json(items);

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// 클릭한 책의 isbn 받아오기
exports.getIsbn= async (req,res)=>{
  try {
    const isbn = req.query.ItemId;
    console.log('isbnnnnnnn',isbn);
    const response = await axios.get('https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx', {
    params: {
        ttbkey: 'ttbwonluvv0940001',
        ItemId: isbn,
        version: '20131101',
        ItemIdType:'ISBN13',
        Output:'JS',
      },
    });

    console.log('Cbook getIsbn response > ',response.data.item);
    const items = response.data.item;

    // const jsonItems = JSON.stringify(items);
    res.json(items);
    // res.render('detail',{items});

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
  // res.render('detail');
}

// 상세페이지로 이동
exports.goDetail = (req,res)=>{
  res.render('detail')
}

// 상세페이지 내용 불러오기
exports.getDetail= async (req,res)=>{
  try {
    const isbn = req.query.ItemId;
    console.log('isbnnnnnnn',isbn);
    const response = await axios.get('https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx', {
    params: {
        ttbkey: 'ttbwonluvv0940001',
        ItemId: isbn,
        version: '20131101',
        ItemIdType:'ISBN13',
        Output:'JS',
        Cover:'Big',
      },
    });

    console.log('Cbook getDetail response > ',response.data.item);
    const items = response.data.item;

    // const jsonItems = JSON.stringify(items);
    res.json(items);
    // res.render('detail',{items});

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
  // res.render('detail');
}
