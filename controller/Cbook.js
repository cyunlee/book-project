const book = require('../models/index');
const axios = require('axios');
const xml2js = require('xml2js');

exports.link = (req,res)=>{
    res.render('index')
}

exports.main = (req,res)=>{
    res.render('main')
}

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
      console.log('response > ',response.data.item);
      const items = response.data.item;
      res.json(items);
    
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}

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

    console.log('response > ',response.data.item);
    const items = response.data.item;
    res.json(items);

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

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
    console.log('response > ',response.data.item);
    const items = response.data.item;
    res.json(items);

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// exports.goDetail = (req,res)=>{
//   const isbn13 = req.query.isbn13;
//   console.log('goDetail > ',isbn13);
//   res.render('detail');
//   // res.render('detail',{isbn13:isbn13});
// }

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

    console.log('responsesssssssssssssssssss > ',response.data.item);
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

exports.goDetail = (req,res)=>{
  res.render('detail')
}

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

    console.log('responsesssssssssssssssssss > ',response.data.item);
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
