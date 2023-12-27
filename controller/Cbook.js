const {Sequelize,User, Comment, Book} = require('../models/index');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const jwtSecret = 'kskdajfsalkfj3209243jkwef' // env

const tokenCheck = async (req) => {
	const token = req.cookies.jwtCookie;
	if(!token) {
		return false;
	} else {
		const result = jwt.verify(token, jwtSecret);
		const checkID = await User.findOne({
			where: {u_id : result.id}
		})
		if (checkID){
			return (result.id);
		} else {
			return false;
		}
	}
}

exports.main = async (req,res)=>{
  const tokenId = await tokenCheck(req);
    res.render('mainpage',{id:tokenId});
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
          itemsPerPage:'5',
          totalResults:'5'
        },
      });
      // console.log('Cbook getBooks response > ',response.data.item);
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

    // console.log('Cbook getBestSeller response > ',response.data.item);
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
    // console.log('Cbook getBrendNew response > ',response.data.item);
    const items = response.data.item;
    res.json(items);

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}


// 상세페이지로 이동
exports.go_detail = async (req,res)=>{
  const tokenId = await tokenCheck(req);
  console.log('tokenid > ',tokenId);
  res.render('detail',{id:tokenId})
}

// 상세페이지 내용 불러오기
exports.get_detail= async (req,res)=>{
  try {
    const isbn = req.query.ItemId;
    const tokenId = await tokenCheck(req);
    console.log('상세페이지의 isbn > ',isbn);
    const response = await axios.get('https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx', {
    params: {
        ttbkey: 'ttbwonluvv0940001',
        ItemId: isbn,
        version: '20131101',
        ItemIdType:'ISBN',
        Output:'JS',
        Cover:'Big',
      },
    });

    console.log('Cbook getDetail response > ',response);
    console.log('Cbook getDetail tokenId > ',tokenId);
    const items = response.data.item;

    res.send({items,id:tokenId});

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
    const tokenId = await tokenCheck(req);
    const{c_isbn, u_id, c_content}=req.body;
    console.log(req.body)
    const newComment = await Comment.create({
      c_isbn,
      u_id,
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
exports.patch_comment = async (req,res)=>{
  try {
    const {c_no,c_content} = req.body;
    console.log(c_no,c_content);

    const updatedComment = await Comment.update({
        c_content
    },{
        where:{c_no}
    })
    res.send(updatedComment);
    
  } catch (err) {
    console.log(err);
    res.send('Internal Server Error');
  }
}

// 상세페이지 댓글 삭제하기
exports.delete_comment = async (req,res)=>{
  try {
    const c_no = req.body.c_no;
    console.log(c_no);
    const isDeleted = await Comment.destroy({
      where:{
        c_no: c_no,
      }
    })

    if(isDeleted==true){
      res.send({isDeleted:true})
    }else{
      res.send({isDeleted:true})
    }
    
  } catch (err) {
    console.log(err);
    res.send('Internal Server Error');
  }

}

// 상세페이지 대댓글 입력하기
exports.post_reply = async (req,res)=>{
  try{
    const tokenId = await tokenCheck(req);
    const{c_isbn, u_id, c_content,parent_c_no}=req.body;
    const newComment = await Comment.create({
      c_isbn,
      u_id,
      c_content,
      c_date: Sequelize.literal('CURRENT_TIMESTAMP'),
      parent_c_no,
    })
    res.send(newComment);
    // res.send('hi');
  }catch(err){
      console.log(err)
      res.send("Internal Server Error!")
  }
}