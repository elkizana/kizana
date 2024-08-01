function library_index() {               // library index 
    
    $("#tags2").hide()
    knex_master.from("category").orderBy("category_order").then(function (rows) {
  
      $("#categ_div").append(`<span class="categ"> الخزانة كلها <br></span>`)
      rows.forEach(category => $("#categ_div").append(`<span class="categ " id="t${category.category_id}" >${category.category_name}<br></span>`))
  
      $("#categ_div").on("click", ".categ"   , function () {
        $(this).addClass("active").siblings().removeClass("active")
        let category = $(this).text()
        $("#tags2").show()
        $("#categ_info_div, #categ_books_div").empty()
        this.id.slice(1) != "" ? selected_category = knex_master.select("book_name", "book_id", "book_category" , "authors").from("book").orderBy("book_name", "ASC").where("book_category", this.id.slice(1))/* .andWhere("book_type" , "1") */ : selected_category = knex_master.select("book_name", "book_id", "authors", "author_name", "author_id", "book_category", "death_text").from("book").leftJoin("author", "authors", "author_id")/* .where("book_type" , "1") */.orderBy("book_name", "ASC")
  
        selected_category.then(function (rows) {
          rows.forEach(book => $("#categ_books_div").append(`<span  class="books" data-author="${book.authors}"  id="${book.book_id}" title="" > ${book.book_name} 
          <div class="bio_img book_card"  >  </div>  
          <div class="bio_img person_card" " ></div>  
          </span>`))
          $("#categ_info_div").html("<div id=author_and_book_number >" + $(".books").length + " كتابا في " + category + "</div>")
  
          $(".books").on("click", function () { add_book_and_tab($(this).text(), $(this).attr("id")  ) })
          $(".bio_img").hide()

          $("#categ_books_div").on("mouseenter", ".books", function() {

            var $bioImg = $(".bio_img");
            var $bookCard = $(this).children(".book_card");
            var $personCard = $(this).children(".person_card");
            var bookCardPointer = $bookCard[0];
            var personCardPointer = $personCard[0];

            knex_master.select("bibliography").from("biblio").where("id", this.id).then(function(info) {
              if (info[0].bibliography.length > 10) {
                $bioImg.hide();
                $bookCard.show();
          
                var tippyOptions = {
                  content: info[0].bibliography.replace(/(?:\r)/g, '\n'),
                  placement: 'auto',
                  arrow: true,
                  interactive: true,
                  delay: [300, 0],
                  zIndex: 9999,
                  onHidden(instance) {
                    instance.destroy(); // Destroy the tooltip when it's hidden
                  }

                }
          
                tippy(bookCardPointer, tippyOptions) ; 
                //console.log(instance); 
              }
            }).catch(function(error) {
              $(".bio_img").hide();
            });
          
            knex_master.select("inf").from("bio").where("authid", $(this).attr("data-author")).then(function(info) {
              if (info[0].inf.length > 10) {
                $personCard.show();
          
                var tippyOptions = {
                  content: info[0].inf.replace(/(?:\r)/g, '\n'),
                  placement: 'auto',
                  arrow: true,
                  interactive: true,
                  delay: [300, 0],
                  onHidden(instance) {
                    instance.destroy(); // Destroy the tooltip when it's hidden
                  }
                };
          
                tippy(personCardPointer, tippyOptions);
              }
            }).catch(function(info) {
              $(".bio_img").hide();
            });
          });
          
  

          $('#tags2').on('search', function () {
            $('.books').show()
        });
  
          $("#tags2").on("keyup", function () {
            
            $(this).val(Oktob.replaceEnCharsAZERTY($(this).val()))
            var filter = $(this).val(),
              count = 0;
              
              if (filter.length > 3  ) { 
                
                $('.books').each(function () {
              
                  if ($(this).text().search(filter) < 0 && filter.length > 3 ) {
                    $(this).hide();
                  }   
                  
                  else {
                    $(this).show();
                    count++;
                    $("#author_and_book_number").html(count)
                  }
      
                })


              }
              
              else if (filter.length == 0 ) { 
                $(".books").show()
              }
              
              else { 
                null
              }
            
           




          })
  
        })        
      })          
  
    })          
  
  }                         //end library_index    