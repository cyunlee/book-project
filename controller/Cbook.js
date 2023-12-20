const model = require('../models/index');
const {Sequelize, Comment} = model;
const axios = require('axios');

exports.main = (req,res)=>{
    res.render('main')
}

// 알라딘 검색 api
exports.get_books=async (req, res) => {
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
exports.get_bestSeller = async (req,res)=>{
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
exports.get_brendNew = async (req,res)=>{
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
exports.get_isbn= async (req,res)=>{
  try {
    const isbn = req.query.ItemId;
    console.log('클릭한 책의 isbn',isbn);
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
exports.go_detail = (req,res)=>{
  res.render('detail')
}

// 상세페이지 내용 불러오기
exports.get_detail= async (req,res)=>{
  try {
    const isbn = req.query.ItemId;
    console.log('상세페이지의 isbn > ',isbn);
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

// 상세페이지 댓글 불러오기
exports.get_comments = async (req,res)=>{
  try {
    
    console.log('isbn > ',req.body.c_isbn);
    const comments = await Comment.findAll({
      where:{
        c_isbn:req.body.c_isbn,
      }
    })

    res.send(comments);
  } catch (error) {
    console.log(error)
    res.send("Internal Server Error!")
  }
}

// 상세페이지 댓글 입력하기
exports.post_comment = async (req,res)=>{
  try{
    const{c_isbn, c_id, c_content}=req.body;
    const newComment = await Comment.create({
      c_isbn,
      c_id,
      c_content,
      c_date: Sequelize.literal('CURRENT_TIMESTAMP'),
    })
    res.send(newComment);
    // res.send('hi');
  }catch(err){
      console.log(err)
      res.send("Internal Server Error!")
  }
}

// 상세페이지 댓글 수정하기
exports.patch_comment = (req,res)=>{

}

// 상세페이지 댓글 삭제하기
exports.delete_comment = (req,res)=>{

}
