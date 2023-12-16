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
        },
      });

      // XML을 JSON으로 파싱
    const parser = new xml2js.Parser();
    parser.parseString(response.data, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        // 'item' 배열 추출
        const items = result.object.item;
        res.json(items);
        console.log(items);
      }
    });
    
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};

exports.getBestSeller = async (req,res)=>{
  try {
    const response = await axios.get('http://www.aladin.co.kr/ttb/api/ItemList.aspx', {
    params: {
        ttbkey: 'ttbwonluvv0940001',
        QueryType: 'BestSeller',
        version: '20131101',
        SearchTarget:'Book',
        MaxResults:'5',
      },
    });

      // XML을 JSON으로 파싱
    const parser = new xml2js.Parser();
    parser.parseString(response.data, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        // 'item' 배열 추출
        console.log('result > ',result.object.item);
        const items = result.object.item;
        res.json(items);
        // console.log(items);
      }
    });

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
      },
    });

      // XML을 JSON으로 파싱
    const parser = new xml2js.Parser();
    parser.parseString(response.data, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        // 'item' 배열 추출
        console.log('result > ',result.object.item);
        const items = result.object.item;
        res.json(items);
        // console.log(items);
      }
    });

    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}