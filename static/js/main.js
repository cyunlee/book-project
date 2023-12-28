const eventTitle = document.getElementById('title');
        
        // 메인페이지 로드 시, 책 정보들 불러오기
        document.addEventListener("DOMContentLoaded", ()=>{
            const resultBox = document.getElementById('result');
            const bestResultBox = document.getElementById('best-result');
            const newResultBox = document.getElementById('new-result');
            const likeResultBox = document.getElementById('like-result');
			const searchBox = document.getElementById('search');

			console.log(`버튼 토큰 아이디 > <%= id%>`);
			
			if(`<%= id%>`=='false'){
				const html1 =`<button class="buttonlog" onclick="location.href='/login'">SIGN IN</button>
				<button class="buttonlog" onclick="location.href='/signup'">SIGN UP</button>`;
				searchBox.insertAdjacentHTML("beforeend",html1);
				
			}else{
				const html2= `<button class="buttonlog" onclick="location.href='/mypage'">MY PAGE</button>
				<button class="buttonlog" onclick="location.href='/logout'">LOGOUT</button>`;
				searchBox.insertAdjacentHTML("beforeend",html2);
			}
        
            // 베스트셀러 api
            $.ajax({
                method:'get',
                url:'/bestSeller',
            }).done((res) => {
                    console.log('알라딘 bestseller >' , res);
                    res.forEach(a => {
                        console.log('알라딘 bestseller a.isbn > ',a.isbn);

                        let html = `
                        <div class="each-selection">
                            <button type="button" onclick="detail('${a.isbn}')">
                                <img src="${a.cover}">
                                <div>${a.title}</div>
                            </button>
                        </div>
                        `;
                        bestResultBox.insertAdjacentHTML('beforeend',html);
                    });
            });
        
            // 신간 api
            $.ajax({
            method:'get',
            url:'/brendNew',
            }).done((res) => {
				console.log('알라딘 brendnew res >' , res);
				res.forEach(a => {
					console.log('알라딘 brendnew a.isbn > ',a.isbn);
					let html = `
					<div class="each-selection">
						<button type="button" onclick="detail('${a.isbn}')">
							<img src="${a.cover}">
							<div>${a.title}</div>
						</button>
					</div>
					`;
					newResultBox.insertAdjacentHTML('beforeend',html);
				});
			});

			// 프론트에서 받기
			$.ajax({
			method:'get',
			url:'/mostLike',
			}).done((res) => {
				if(res.length==0){
					let html =`
						<div style="text-align:center; width:100%; height:30vh; line-height:30vh;">
							좋아요한 책이 없어요!
						</div>`
					likeResultBox.insertAdjacentHTML('beforeend',html);
				}else{
					console.log('좋아요 res >' , res);
					res.forEach(a => {
						console.log('좋아요 a.isbn > ',a.isbn);
						let html = `
						<div class="each-selection">
							<button type="button" onclick="detail(${a.isbn})">
								<img src="${a.cover}">
								<div>${a.title}</div>
							</button>
						</div>
						`;
						likeResultBox.insertAdjacentHTML('beforeend',html);
					});
				}					
        });

	});

		eventTitle.addEventListener("focus",()=>{
			const resultBox = document.getElementById('result');
			resultBox.innerHTML = '';
			if (eventTitle =''){
				resultBox.style.height='0px'
			}else{
				resultBox.style.height='500px'
			}
		})
        
        // keyup 이벤트 발생시 내용들이 화면에 보이게
        eventTitle.addEventListener("keyup", () => {
            search();
        });
        
		
        // 책 검색 함수(알라딘 책 검색 api)
        function search() {
            // const title = document.getElementById('title').value;
            const resultBox = document.getElementById('result');
        
            $.ajax({
            method: 'get',
            url: '/search', // 서버에 요청을 보내는 주소로 변경
            data:{
                title:document.getElementById('title').value,
            }
            }).done((res) => {
                console.log('res >' , res);
                // console.log('object >', JSON.parse(res));
                res.forEach(a => {
                    console.log('알라딘 bestseller a.isbn > ',a.isbn);
                        let html = `
                        <div>
                            <button type="button" onclick="detail('${a.isbn}')">
                                
                                <div>${a.title}</div>
                            </button>
                        </div>
                        `;
                        resultBox.insertAdjacentHTML('beforeend',html);
                });
            });
            removeAllChildren(resultBox);
            // console.log('title> ',title)
            // document.getElementById('result').value=title;
        }
        
        
        
        function removeAllChildren(element) {
            while (element.firstChild) {
                removeAllChildren(element.firstChild);
                element.removeChild(element.firstChild);
            }
        }
        
        function detail(isbn){
            const detailBox = document.getElementById('detail-result');
			console.log(isbn);
            $.ajax({
                method:'get',
                url:'/getDetail',
                data:{
                    ItemId:`${isbn}`,
                }
            }).done((res)=>{
				// console.log(isbn);
                console.log(res);
                console.log('res detail aaaaaaaaaaa > ',res.items[0].isbn);
                location.href=`/detailGo?isbn=${isbn}`;
            })
        }