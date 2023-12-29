const { Op } = require('sequelize');
const {Sequelize,User, Comment, Book} = require('../models/index');
const axios = require('axios');
const model = require('../models/index');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

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
  if(!tokenId) {
    res.render('detail',{id:tokenId, idFor: null, isLogin: false})}
    else {res.render('detail',{id:tokenId, idFor: tokenId, isLogin: true})}
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

    // console.log('Cbook getDetail response > ',response.data.item);
    // console.log('Cbook getDetail tokenId > ',tokenId);
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
    const tokenId = await tokenCheck(req);
    const comments = await Comment.findAll({
      where:{
        c_isbn:req.body.c_isbn,
      },
	  include: [{
        model: User,
        attributes: ['u_profile'],
      }],
    })

    res.send({comments,id:tokenId});
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
    res.send({data:newComment,id:tokenId});
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

// 좋아요 싫어요 유무 렌더
exports.ratingData = async (req, res) => {
	console.log('rating query >', req.query);
	const { b_isbn, u_id } = req.query;
	try {
		const result = await Book.findOne({
			attributes: ['b_rating'],
			where: {
				b_isbn: b_isbn,
				u_id: u_id,
				b_wish: null,
			},
			raw: true
		})
		console.log('~~~~~Cmain ratingData~~~~>', result);
		if (result == null) {
			res.send('평가하지 않음')
		} else {
			console.log('------이 책에 남긴 평가------', result.b_rating)
			res.send(result.b_rating)
		}
		console.log(result)
	} catch (error) {
		// 오류 처리
		console.log('--------------')
		console.error(error);
		res.status(500).send('서버 오류');
	}

};

// 좋아요
exports.createLike = async (req, res) => {
	try {
		console.log('좋아요 데이터 전송', req.body);
		const { b_isbn, u_id, b_rating } = req.body;
		// const newBook = 
		await Book.create({
			b_isbn, u_id, b_rating
		})
		// res.send(newBook)
	} catch (err) {
		console.error(err);
		res.send('Internal Server Error!')
	}

};

// 좋아요 취소
exports.deleteLike = async (req, res) => {
	try {
		const { b_isbn, u_id, b_rating } = req.body;
		await Book.destroy({
			where: {
				b_isbn, u_id, b_rating
			}
		})
	} catch (err) {
		console.error(err);
		res.send('Internal Server Error!')
	}
};

// 싫어요
exports.createBad = async (req, res) => {
	try {
		console.log('싫어요 데이터 전송', req.body);
		const { b_isbn, u_id, b_rating } = req.body;
		await Book.create({
			b_isbn, u_id, b_rating
		})
	} catch (err) {
		console.error(err);
		res.send('Internal Server Error!')
	}

};

// 싫어요 취소
exports.deleteBad = async (req, res) => {
	try {
		const { b_isbn, u_id, b_rating } = req.body;
		await Book.destroy({
			where: {
				b_isbn, u_id, b_rating
			}
		})
	} catch (err) {
		console.error(err);
		res.send('Internal Server Error!')
	}
};

// 유저들이 이 책과 함께 좋아한 다른 책 렌더
exports.otherLikes = async (req, res) => {
	console.log('----좋아요 기반 데이터 쿼리----', req.query);
	const { b_isbn, b_rating, u_id } = req.query;
	try {
		const likeUser = await Book.findAll({
			attributes: ['u_id'],
			where: {
				b_isbn, b_rating,
				u_id: {
					[Op.not]: u_id 
				},
			},
			order: model.sequelize.random(),
			limit: 1,
			raw: true,
		})
		console.log('---------findall---------')
		console.log(likeUser[0])
		if (likeUser == '') {
			// res.send('이 책을 좋아한 유저가 없음')
		} else {
			const isbnResult = await Book.findAll({
				attributes: ['b_isbn'],
				where: {
					u_id: likeUser[0].u_id,
					b_rating: 'like',
					b_isbn: {
						[Op.not]: b_isbn
					}
				},
				order: model.sequelize.random(),
				limit: 5,
				raw: true
			})
			// console.log(likeUser[0].u_id)
			// res.send(isbnResult);

			// console.log(isbnResult);
			const isbnList = isbnResult.map(result => result.b_isbn);
			console.log('map 메서드 적용>', isbnList);
			// res.send(isbnList);

			const isbnDetail = isbnList.map(isbn => {
				return axios({
					method: 'get',
					url: 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
					params: {
						ttbkey: 'ttbwonluvv0940001',
						ItemId: isbn,
						ItemIdType: 'ISBN',
						Output: 'JS',
						Cover: 'Big',
						Version: 20131101
					}
				});
			});
			// 모든 요청이 완료될 때까지 기다리기
			const isbnDetailResponses = await Promise.all(isbnDetail);
			// console.log('-----await Promise.all------',isbnDetailResponses);

			// 각각의 응답에서 데이터 추출 및 처리
			const bookDetails = isbnDetailResponses.map(response => response.data.item);
			// console.log('----bookDetails----',bookDetails); // [[{}], [{}], ...]
			const newData = bookDetails.map(innerArray => innerArray[0]);
			// const newData = bookDetails[0];
			// console.log('--------각각의 알라딘 데이터--------', newData);
			res.send(newData);
		}

	} catch (err) {
		console.log(err)
	}
};

// 위시리스트 유무 렌더
exports.wishData = async (req, res) => {
	console.log('------------wishData query', req.query);
	const {b_isbn, u_id, b_wish} = req.query
	try {
		const wishResult = await Book.findOne({
			attributes: ['b_wish'],
			where: {
				b_isbn,
				u_id,
				b_wish,
			},
			raw: true
		})
		console.log('Cmain wishData>', wishResult);
		if (wishResult == null) {
			res.send('평가하지 않음')
		} else {
			console.log('------이 책에 위시를 했니??????------', wishResult.b_wish)
			res.send(wishResult.b_wish)
		}
	} catch (error) {
		// 오류 처리
		console.log('--------------')
		console.error(error);
		res.status(500).send('서버 오류');
	}
};

// 위시리스트 추가
exports.createWish = async (req, res) => {
	try {
		console.log('-------------위시 데이터 전송', req.body);
		const { b_isbn, u_id, b_wish } = req.body;
		await Book.create({
			b_isbn, u_id, b_wish
		})
	} catch (err) {
		console.error(err);
		res.send('Internal Server Error!')
	}
};

// 위시리스트 취소
exports.deleteWish = async (req, res) => {
	try {
		const { b_isbn, u_id, b_wish } = req.body;
		await Book.destroy({
			where: {
				b_isbn, u_id, b_wish
			}
		})
	} catch (err) {
		console.error(err);
		res.send('Internal Server Error!')
	}
};