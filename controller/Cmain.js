const fs = require('fs');
const { Op } = require('sequelize');
const { User, Book, Comment, OtherUser, LifeBook,sequelize} = require('../models/index');
const model = require('../models/index');
const axios = require('axios')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const exp = require('constants');

const jwtSecret = 'kskdajfsalkfj3209243jkwef' // env

const cookieConfig = {
	httpOnly: true,
	maxAge: 300 * 60 * 1000, //300분
}

const saltRounds = 10;

const tokenCheck = async (req) => {
	const token = req.cookies.jwtCookie;
	if (!token) {
		return false;
	} else {
		const result = jwt.verify(token, jwtSecret);
		const checkID = await User.findOne({
			where: { u_id: result.id }
		})
		if (checkID) {
			return (result.id);
		} else {
			return false;
		}
	}
}

//로그인 성공해서 jwt 갖고있을시 서버에서 토큰을 조회해서 확인되면 user이름 홈화면에 반영되어 렌더되도록.
exports.main = async (req, res) => {
	const tokenId = await tokenCheck(req);
	if (!tokenId) {
		res.render('index', { isLogin: false })
	} else {
		res.render('index', { isLogin: true, id: tokenId });
	}
}

exports.signin = (req, res) => {
	res.render('login');
}

exports.idCheck = async (req, res) => {
	try {
		const id = req.body.u_id;
		const checkID = await User.findOne({
			where: { u_id: id }
		})
		if (id === '') res.send({ result: 'empty' })
		else if (checkID) res.send({ result: true })
		else res.send({ result: false })
	} catch (error) {
		res.send(error);
	}
}

exports.nameCheck = async (req, res) => {
	try {
		const u_name = req.body.u_name;
		const checkName = await User.findOne({
			where: { u_name: u_name }
		})
		if (u_name === '') {
			res.send({ result: 'empty' })
		} else if (checkName) res.send({ result: true })
		else res.send({ result: false })
	} catch (error) {
		res.send(error);
	}
}

exports.logout = (req, res) => {
	// res.clearCookie('jwtCookie').redirect(req.originalUrl);
	res.clearCookie('jwtCookie');
	// 여기에 현재 페이지로 리다이렉트하는 로직 추가
	res.redirect(req.get('referer'));
}

exports.login_post = async (req, res) => {
	try {
		const { id, pw } = req.body;
		const checkID = await User.findOne({
			where: { u_id: id }
		});
		if (!checkID) res.send({ result: false })
		else {
			const checkPW = checkID.dataValues.u_pw;
			// const result = await bcrypt.compare(pw, checkPW);

			if (checkPW !== pw) {
				// (!result) {
				res.send({ result: false })
			}
			else { // 성공시
				const token = jwt.sign({ id: id }, jwtSecret)
				res.cookie('jwtCookie', token, cookieConfig);
				res.send({ result: true });
			}
		}
	} catch (error) {
		res.send(error);
	}
}

exports.signup_post = async (req, res) => {
	try {
		const { u_name, u_email, u_id, u_pw } = req.body;
		const newname = await User.findOne({
			where: { u_name: u_name }
		});
		const newid = await User.findOne({
			where: { u_id: u_id }
		})
		if (newname) {
			res.send({ result: false, msg: 'name duplicated' })
		} else if (newid) {
			res.send({ result: false, msg: 'id duplicated' })
		} else {
			// const hash = bcrypt.hashSync(u_pw, saltRounds);
			await User.create({u_name : u_name, u_id : u_id, u_pw: u_pw, u_email : u_email});
			await OtherUser.create({u_id : u_id});
			res.send({result : true});
		}
	} catch (error) {
		res.send(error);
	}
}

exports.signup = (req, res) => {
	res.render('signup');
}

exports.mypage = async (req, res) => {
	const id = await tokenCheck(req);
	try {
		const userInfo = await User.findOne({
			where: { u_id: id }
		})
		res.render('mypage', { userInfo: userInfo });
	} catch (error) {
		console.log(error);
	}
}

exports.otherpage = async (req, res) => {
	let otherId = req.params.other_id;

	console.log(otherId)
	otherId = otherId.substr(1);
	try {
		const OtherUserInfo = await User.findOne({
			where: { u_id : otherId}
		})

		const tokenId = await tokenCheck(req);
		const getTop1 = await LifeBook.findAll({
			attributes: ['l_no','l_cover'],
			where: {
				u_id: otherId,
				l_ranking: 1,
			},
			order: [[model.sequelize.literal('l_no'), 'DESC']],
			limit:1
		});
		const getTop2 = await LifeBook.findAll({
			attributes: ['l_no','l_cover'],
			where: {
				u_id: otherId,
				l_ranking: 2,
			},
			order: [[model.sequelize.literal('l_no'), 'DESC']],
			limit:1
			
		});
		const getTop3 = await LifeBook.findAll({
			attributes: ['l_no','l_cover'],
			where: {
				u_id: otherId,
				l_ranking: 3,
			},
			order: [[model.sequelize.literal('l_no'), 'DESC']],
			limit:1
		});
		console.log(getTop1);
		// console.log(getTop1);
		let img1 ='';
		let img2 ='';
		let img3 ='';
		if(getTop1.length==0){
			img1 ='../static/img/no-data.jpg';
		}else{
			img1 =`${getTop1[0].l_cover}`;
		}
		if(getTop2.length==0){
			img2 ='../static/img/no-data.jpg';
		}else{
			img2 = `${getTop2[0].l_cover}`;
		}
		if(getTop3.length==0){
			img3 ='../static/img/no-data.jpg';
		}else{
			img3 = `${getTop3[0].l_cover}`;
		}

		
		res.render('otherpage', {userInfo : OtherUserInfo,img1,img2,img3});
	} catch (error) {
		console.log('interval error : ',error);
	}
}

exports.following = (req, res) => {
	res.render('following');
}

exports.follower = (req, res) => {
	res.render('follower');
}

//나의 위시리스트
exports.myWish = async (req, res) => {
    const {u_id, b_wish} = req.query
    try{
        const myWish = await Book.findAll({
            attributes: ['b_isbn'],
            where: {
                u_id, b_wish
            }
        })
        // console.log('———내 위시리스트————',myWish);
        if(myWish=='') {
            res.send('위시리스트에 추가한 책이 없습니다.')
        } else {
            const myWishIsbn = myWish.map(wish => wish.b_isbn);
            // console.log('여기!!!!!!!!!!!!!!!!!', myWishIsbn);
            const myWishData = myWishIsbn.map(isbn => {
                return axios({
                    method: 'get',
                    url: 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
                    params: {
                        ttbkey: 'ttbclue91204001',
                        ItemId: isbn,
                        ItemIdType: 'ISBN',
                        Output: 'JS',
                        Cover: 'Big',
                        Version: 20131101
                    }
                });
            });
            const myWishResponse = await Promise.all(myWishData);
            // console.log('@@@@@@@@@@@@@@@@', myWishResponse);
            // 각각의 응답에서 데이터 추출 및 처리
            const wishBooks = myWishResponse.map(res => res.data.item);
            // console.log('$$$$$$$$$$',wishBooks);
            const myWishList = wishBooks.map(innerArray => innerArray[0]);
            // console.log('!@#%^&^%$#@#$%^&*&^%$#', myWishList);
            res.send(myWishList);
        }
    } catch(err) {
        console.error(err);
    }

}

exports.getViewAllData = async(req, res) => {
	const u_id = req.query.u_id;
try{
    const myBooks = await Book.findAll({
		attributes: ['b_isbn'],
		where: {
			u_id,
			b_wish: null
		}
	})
	// console.log('------내가읽은책~---------',myBooks);
	if(myBooks=='') {
		res.send({viewAllData: []})
	} else {
		const myBooksIsbn = myBooks.map(book => book.b_isbn);
		// console.log('여기!!!!!!!!!!!!!!!!!', myBooksIsbn);
		const mybooksData = myBooksIsbn.map(isbn => {
			return axios({
				method: 'get',
				url: 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
				params: {
					ttbkey: 'ttbclue91204001',
					ItemId: isbn,
					ItemIdType: 'ISBN',
					Output: 'JS',
					Cover: 'Big',
					Version: 20131101
				}
			});
		});
		const myBooksResponse = await Promise.all(mybooksData);
		// console.log('@@@@@@@@@@@@@@@@', myBooksResponse);
		// 각각의 응답에서 데이터 추출 및 처리

		const booksViewall = myBooksResponse.map(res => res.data.item);
		// console.log('$$$$$$$$$$',booksViewall);
		const viewAllData = booksViewall.map(innerArray => innerArray[0]);
		// console.log(viewAllData)

		// [{},{}]
		res.send({viewAllData});
	}
} catch(err) {
	console.error(err);
}
};
// 내가 읽은 책(좋아요 싫어요 전부)
exports.viewAll = async (req, res) => {
	//console.log('token 유무', req.cookies.jwtCookie);
	console.log('req.params > ', req.params);
	const { u_id } = req.params;
	try {
		const myBooks = await Book.findAll({
			attributes: ['b_isbn'],
			where: {
				u_id,
				b_wish : null
			}
		})
		// console.log('------내가읽은책-------',myBooks);
		if (myBooks == '') {
			res.render('viewAll', { viewAllData: [] })
		} else {
			const myBooksIsbn = myBooks.map(book => book.b_isbn);
			// console.log('여기!!!!!!!!!!!!!!!!!', myBooksIsbn);
			const mybooksData = myBooksIsbn.map(isbn => {
				return axios({
					method: 'get',
					url: 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
					params: {
						ttbkey: 'ttbclue91204001',
						ItemId: isbn,
						ItemIdType: 'ISBN',
						Output: 'JS',
						Cover: 'Big',
						Version: 20131101
					}
				});
			});
			const myBooksResponse = await Promise.all(mybooksData);
			// console.log('@@@@@@@@@@@@@@@@', myBooksResponse);
			// 각각의 응답에서 데이터 추출 및 처리

		const booksViewall = myBooksResponse.map(res => res.data.item);
		// console.log('$$$$$$$$$$',booksViewall);
		const viewAllData = booksViewall.map(innerArray => innerArray[0]);

		res.render('viewAll', {viewAllData});
	}
} catch(err) {
	console.error(err);
}
};

exports.get_my_comments = async (req, res) => {
	try {
		console.log('loadComment req ', req.body);
		const userIDphrase=req.body.c_userID.split('@')[1];
		console.log('loadComment serch ',userIDphrase)
		const comments = await Comment.findAll({
			where: {
				u_id: userIDphrase,
			}
		})

		res.send({ comments });
		console.log('loadComment send ', comments);

	} catch (error) {
		res.send('Internal Server Error! : ', error);
	}
}

exports.viewLikes = (req, res) => {
	res.render('viewLikes');
}

exports.viewDislikes = (req, res) => {
	res.render('viewDislikes');
}

exports.upload_post = async (req, res) => {

	try {
		const tokenId = await tokenCheck(req);

		const path = req.file.path;
		console.log('tokenId > ', tokenId);
		console.log('req.file > ', req.file);
		console.log('req.file.path > ', req.file.path);

		res.send({ data: req.file, id: tokenId });
	} catch (error) {
		console.log(error);
		res.send('Internal Server Error!');
	}

}

exports.upload_patch = async (req, res) => {
	try {
		// const path = req.file.path;
		console.log('req.body > ', req.body);
		const delUser = await User.findOne({ where: { u_id: req.body.id } })
		if (delUser.u_profile) {
			fs.unlinkSync(delUser.u_profile)
		}
		const uploadProfile = await User.update({
			u_profile: req.body.path,
		}, {
			where: { u_id: req.body.id, }
		})
		res.send(uploadProfile);
	} catch (error) {
		console.log(error);
		res.send('Internal Server Error!');
	}
}

exports.delete_user = async (req, res) => {
	try {
		const tokenId = await tokenCheck(req);
		const delUser = await User.findOne({ where: { u_id: tokenId } })
		if (delUser.u_profile) {
			fs.unlinkSync(delUser.u_profile)
		}
		await User.destroy({where: {u_id : tokenId}})
		await OtherUser.destroy({where: {u_id : tokenId}})
		await Follower.destroy({where: {u_id : tokenId}})
		await Following.destroy({where: {u_id : tokenId}})
		res.send({result : true});
	} catch (error) {
		res.send('Internal Server Error! : ', error);
	}
}

exports.get_my_comments = async (req, res) => {
	try {
		console.log('loadComment req ', req.body);
		const userIDphrase=req.body.c_userID.split('@')[1];
		console.log('loadComment serch ',userIDphrase)
		const comments = await Comment.findAll({
			where: {
				u_id: userIDphrase,
			}
		})

		res.send({ comments });
		console.log('loadComment send ', comments);

	} catch (error) {
		res.send('Internal Server Error! : ', error);
	}
}

// 검색 결과
exports.searchList = async (req, res) => {
	console.log('Cmain search req.query >', req.query);
	const query = req.query.title
	const currentPage = req.query.page

	try {
		const searchList = await axios({
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
		console.log('Cmain search 알라딘 요청 결과 >', searchList.data.totalResults)
		let totalResults = searchList.data.totalResults // 알라딘 api에서 검색 결과 수
		// 알라딘 api에서 검색 결과를 200개 까지만 제공!!!!
		if (!totalResults) {
			totalResults = 0
		} else if (totalResults <= 200) {
			totalResults = totalResults
		} else {
			totalResults = 200
		}
		const totalPages = Math.ceil(totalResults / 20);
		const searchData = searchList.data.item; // 검색 결과 책 데이터
		// console.log('----프론트에서 forEach 돌릴 데이터----', searchData)
		console.log('page 수 >', totalPages);
		res.render('search', { query, searchData, totalPages });
	} catch (err) {
		console.log(err)
	}
};

// 검색 결과 -> 특정 책 클릭
exports.searchDetail = async (req, res) => {
	console.log('hiddenform으로 보내기 >', req.query);
	console.log('token 유무', req.cookies.jwtCookie);
	const query = req.query.isbn
	try {
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

		const tokenId = await tokenCheck(req);
		if (!tokenId) {
			res.render('searchDetail', { query, detailData, isLogin: false, id: null });
		} else {
			res.render('searchDetail', { query, detailData, isLogin: true, id: tokenId });
		}

	} catch (err) {
		console.log(err)
	}
};


// 메인 페이지에 좋아요 많은 책 렌더
exports.mostLike = async (req, res) => {
    try {
      const mostLike = await Book.findAll({
        attributes: ['b_isbn', [model.sequelize.fn('COUNT', model.sequelize.literal('b_rating')), 'like_count']],
        where: {
          b_rating: 'like',
        },
        group: ['b_isbn'],
        order: [[model.sequelize.literal('like_count'), 'DESC']],
        limit: 5,
      });
    //   console.log('---------메인좋아요!!!', mostLike);

    if(!mostLike) {
        res.send('좋아요한 책이 없음')
    }
    else{
        const mostLikeIsbn = mostLike.map(liked => liked.b_isbn);
    // console.log('---------메인좋아요!!!', mostLikeIsbn);
    
    const mostLikeData = mostLikeIsbn.map(isbn => {
        return axios({
            method: 'get',
            url: 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
            params: {
                ttbkey: 'ttbclue91204001',
                ItemId: isbn,
                ItemIdType: 'ISBN',
                Output: 'JS',
                Cover: 'Big',
                Version: 20131101
            }
        });
    });
    // 모든 요청이 완료될 때까지 기다리기
    const mostLikeDataResponse = await Promise.all(mostLikeData);

    // 각각의 응답에서 데이터 추출 및 처리
    const likeListData = mostLikeDataResponse.map(res => res.data.item);

    const mainLikes = likeListData.map(innerArray => innerArray[0]);

    // console.log('————메인페이지 좋아요 책 리스트————', mainLikes);

    res.send(mainLikes);

    }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  // 댓글 많은 순 api
exports.get_mostComments = async (req,res)=>{
	try {
	  const mostComment = await Comment.findAll({
		attributes: ['c_isbn', [model.sequelize.fn('COUNT', model.sequelize.literal('c_isbn')), 'counting']],
		group: ['c_isbn'],
		order: [[model.sequelize.literal('counting'), 'DESC']],
		limit: 5,
	  });
  
	  if(!mostComment) {
		  res.send('댓글을 단 책이 없음')
	  }
	  else{
		  const mostCommentIsbn = mostComment.map(Comment => Comment.c_isbn);
	  // console.log('---------메인좋아요!!!', mostLikeIsbn);
	  
	  const mostCommentData = mostCommentIsbn.map(isbn => {
		  return axios({
			  method: 'get',
			  url: 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
			  params: {
				  ttbkey: 'ttbclue91204001',
				  ItemId: isbn,
				  ItemIdType: 'ISBN',
				  Output: 'JS',
				  Cover: 'Big',
				  Version: 20131101
			  }
		  });
	  });
	  // 모든 요청이 완료될 때까지 기다리기
	  const mostCommentDataResponse = await Promise.all(mostCommentData);
  
	  // 각각의 응답에서 데이터 추출 및 처리
	  const CommentListData = mostCommentDataResponse.map(res => res.data.item);
  
	  const mainComments = CommentListData.map(innerArray => innerArray[0]);
  
	  // console.log('————메인페이지 좋아요 책 리스트————', mainLikes);
  
	  res.send(mainComments);
  
	  }
	} catch (error) {
	  console.error(error);
	  res.status(500).send('Internal Server Error');
	}
  }

  exports.get_lifeBooks=async (req, res) => {
    try {
        const title = req.query.title;
        console.log(title);
        const response = await axios.get('https://www.aladin.co.kr/ttb/api/ItemSearch.aspx', {
        params: {
          ttbkey: 'ttbwonluvv0940001',
          Query: title,
          version: '20131101',
          SearchTarget:'Book',
          MaxResults:'50',
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

exports.post_lifeBook= async (req,res)=>{
	try {
		console.log(req.body);
		const tokenId = await tokenCheck(req);
		const{l_isbn,l_cover,l_ranking}=req.body;
		const newLifeBook = await LifeBook.create({
			l_isbn,
			l_cover,
			u_id:tokenId,
			l_ranking,
		})
		res.send({newLifeBook,id:tokenId});
		// res.send('hi');
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
}

exports.get_top = async (req,res)=>{
	try {
		const tokenId = await tokenCheck(req);
		const getTop1 = await LifeBook.findAll({
			attributes: ['l_no','l_cover'],
			where: {
				u_id: tokenId,
				l_ranking: 1,
			},
			order: [[model.sequelize.literal('l_no'), 'DESC']],
			limit:1
		});
		const getTop2 = await LifeBook.findAll({
			attributes: ['l_no','l_cover'],
			where: {
				u_id: tokenId,
				l_ranking: 2,
			},
			order: [[model.sequelize.literal('l_no'), 'DESC']],
			limit:1
			
		});
		const getTop3 = await LifeBook.findAll({
			attributes: ['l_no','l_cover'],
			where: {
				u_id: tokenId,
				l_ranking: 3,
			},
			order: [[model.sequelize.literal('l_no'), 'DESC']],
			limit:1
		});
	
	
		res.send({getTop1,getTop2,getTop3});
	
		
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
}


// 위시리스트 책 데이터
exports.myWish = async (req, res) => {
	const {u_id, b_wish} = req.query
	try{
        const myWish = await Book.findAll({
			attributes: ['b_isbn'],
			where: {
				u_id, b_wish
			}
		})
		// console.log('------내 위시리스트---------',myWish);
		if(myWish=='') {
			res.send('위시리스트에 추가한 책이 없습니다.')
		} else {
			const myWishIsbn = myWish.map(wish => wish.b_isbn);
			// console.log('여기!!!!!!!!!!!!!!!!!', myWishIsbn);
			const myWishData = myWishIsbn.map(isbn => {
				return axios({
					method: 'get',
					url: 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx',
					params: {
						ttbkey: 'ttbclue91204001',
						ItemId: isbn,
						ItemIdType: 'ISBN',
						Output: 'JS',
						Cover: 'Big',
						Version: 20131101
					}
				});
			});
			const myWishResponse = await Promise.all(myWishData);
			// console.log('@@@@@@@@@@@@@@@@', myWishResponse);
			// 각각의 응답에서 데이터 추출 및 처리
			const wishBooks = myWishResponse.map(res => res.data.item);
			// console.log('$$$$$$$$$$',wishBooks);
			const myWishList = wishBooks.map(innerArray => innerArray[0]);
			// console.log('!@#%^&^%$#@#$%^&*&^%$#', myWishList);
			res.send(myWishList);
		}
    } catch(err) {
		console.error(err);
	}

};


// 읽은 책 개수
exports.readNum = async (req, res) => {
	// console.log('~~~~~~~~~~~~읽은책 개수 쿼리',req.query);
	const {u_id} = req.query;
	try {
		const readNum = await Book.findAll({
			where: {
				u_id,
				b_wish: null
			},
			raw: true
		});
		console.log('~~~~~~~~~~~개수', readNum.length);
		const rNumResult = readNum.length;
		res.send({rNumResult})
	} catch(err) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
};

// 위시리스트 개수
exports.wishNum = async (req, res) => {
	// console.log('~~~~~~~~~~~~위시리스트 개수 쿼리',req.query);
	const {u_id} = req.query;
	try {
		const wishNum = await Book.findAll({
			where: {
				u_id,
				b_rating: null
			},
			raw: true
		});
		console.log('~~~~~~~~~~~개수', wishNum.length);
		const wNumResult = wishNum.length;
		res.send({wNumResult})
	} catch(err) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
};
