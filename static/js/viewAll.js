async function get_data_and_stack(u_id) {
    const response = await axios({
      method: "GET",
      url: "/getViewAllData",
      params: {
        u_id : u_id,
      },
    });
    console.log(response);
    const data = response.data.viewAllData;
    
    const bookStackList = document.querySelector('.bookstack-list');

    const stack = [];
    const title = [];


    for(let i=0; i<data.length; i++){
        const stackElement = document.createElement('div');
        const titleElement = document.createElement('div');

        stack.push(stackElement);
        title.push(titleElement);
    }
    
    console.log(stack);
    console.log(title);

    for(let i=0; i<data.length; i++){
        stack[i].classList.add('bookstack');
        title[i].classList.add('bookstack-title');

        title[i].innerHTML=data[i].title;
        stack[i].style.backgroundImage="url(" + data[i].cover + ")";

        stack[i].appendChild(title[i]);
    }

    for(let i=data.length-1; i>=0; i--){
        bookStackList.appendChild(stack[i]);
    }


    console.log(stack);



  }
