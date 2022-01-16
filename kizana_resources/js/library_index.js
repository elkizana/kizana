function library_index() {               // library index 
    $("#tags1").hide()
    $("#tags2").hide()
    knex_master.from("category").orderBy("category_order").then(function (rows) {
  
      $("#first_container_one").append(`<span class="categ"> الخزانة كلها <br></span>`)
      rows.forEach(category => $("#first_container_one").append(`<span class="categ " id="t${category.category_id}" >${category.category_name}<br></span>`))
  
      $(".categ").on("click", function () {
        let category = $(this).text()
        $("#tags2").show()
        $("#second_container_one, #second_container_two").empty()
        this.id.slice(1) != "" ? selected_category = knex_master.select("book_name", "book_id", "book_category" , "authors").from("book").orderBy("book_name", "ASC").where("book_category", this.id.slice(1))/* .andWhere("book_type" , "1") */ : selected_category = knex_master.select("book_name", "book_id", "authors", "author_name", "author_id", "book_category", "death_text").from("book").leftJoin("author", "authors", "author_id")/* .where("book_type" , "1") */.orderBy("book_name", "ASC")
  
        selected_category.then(function (rows) {
          rows.forEach(book => $("#second_container_two").append(`<span class="books" data-author="${book.authors}"  id="${book.book_id}" title="" > ${book.book_name} <div class="bio_img" > </div>  </span>`))
          $("#second_container_one").html("<div id=author_and_book_number >" + $(".books").length + " كتابا في " + category + "</div>")
  
          $(".books").on("click", function () { add_book_and_tab($(this).text(), $(this).attr("id")) })
  
          $(".books").on("mouseover" , function () {
            pointer = $(this).children(".bio_img")
  
            knex_master.select("bibliography").from("biblio").where("id", this.id).then(function (info) {
              if (info[0].bibliography.length > 5) {
                $(pointer).attr('title', info[0].bibliography)
  
              } else {
                $(pointer).attr('title', "ليس للكتاب بطاقة")
              }
  
            }).catch(function (info) {
              $(pointer).attr('title', "ليس للكتاب بطاقة")
            })
  
  
            
          })
  
  
          $("#tags2").on("keyup", function () {
            
            $(this).val(Oktob.replaceEnCharsAZERTY($(this).val()))
            var filter = $(this).val(),
              count = 0;
            $('.books').each(function () {
              if ($(this).text().search(new RegExp(filter, "i")) < 0 && filter.length > 3 ) {
                $(this).hide();
              } else {
                $(this).show();
                count++;
                $("#author_and_book_number").html(count)
              }
  
            })
          })
  
        })        
      })          
  
    })          
  
  }                         //end library_index    