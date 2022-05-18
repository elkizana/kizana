function authors_index(filter = "author_name") {                      //end author_index                        
    $("#authors_info_div , #authors_names_div").empty()
    knex_master.select("death_text" , "author_name" , "author_id" , "death_number").from("author").orderBy(filter).then(function (rows) {                       /* appendding  categories  */
      rows.forEach(author => $("#authors_names_div").append(`<span class="authors"  id="${author.author_id}" title="" > ${author.author_name}   <div class="bio_img" onclick="event.stopPropagation()" > </div>     <span id="death_date" >${author.death_text ? author.death_text : ""}</span></span>`))
      $("#authors_info_div").prepend("<div id=author_and_book_number >المؤلفون (" + $('.authors').length + ")  <img src=../icons/sort.png id=authors_filter title= 'تغيير الترتيب'/>  </span> </div>") 
      
      
      $("#authors_filter").on("click" , function () {
        filter == "author_name"  ? authors_index( filter = "death_number" )   : authors_index(  filter = "author_name" )  
      })

      $(".authors").on("mouseover" , function () {
        pointer = $(this).children(".bio_img")[0]
        knex_master.select("inf").from("bio").where("authid", this.id).then(function (info) {
          if (info[0].inf.length > 10) {
            $(".bio_img").hide()
            $(pointer).show()
            
            tippy(  pointer , {
              content: info[0].inf.replace(/(?:\r)/g, '\n') , 
              placement: 'left' ,
              arrow: true,
              interactive: true,
              
            })
          }
        }).catch(function () {
          $(".bio_img").hide()
        })
      })
  
      $("#tags1").on("keyup", function () {
        $(this).val(  Oktob.replaceEnCharsAZERTY(   $(this).val()  )   )
        var filter = $(this).val()
        count = 0;
        $('.authors').each(function () {
          if ($(this).text().search(filter) < 0 && filter.length > 2) {
            $(this).hide();
          } else {
            $(this).show();
            count++;
            $("#author_and_book_number").html(count)
          }
        })
      })
  
      $(".authors").on("click", function () {
        $("#authors_books_info_div, #authors_books_div").empty()
  
        author = $(this).clone().children().remove().end().text()
  
        knex_master.from("book").orderBy("book_name", "ASC").where("authors", this.id).then(function (rows) {
  
          rows.forEach(book => $("#authors_books_div").append(`<span class="books" id="${book.book_id}" > ${book.book_name} <div class="bio_img" onclick="event.stopPropagation()"> </div>  </span>`))
          
          $("#authors_books_info_div").html("<span id=author_and_book_number> كتب" + author + " : " + $("#authors_books_div .books").length + "</span>")
          
          $(".books").on("click", function () { add_book_and_tab($(this).text(), $(this).attr("id")) })
  
          $(".books").on("mouseover" , function () {
  
            pointer = $(this).children(".bio_img")[0]
            knex_master.select("bibliography").from("biblio").where("id", this.id).then(function (info) {
              if (info[0].bibliography.length > 5) {
                $(".bio_img").hide()
                $(pointer).show()

                tippy(  pointer , {
                  content: info[0].bibliography.replace(/(?:\r)/g, '\n') , 
                  arrow: true,
                  /* theme: 'material', */
                  trigger: 'click',
                  interactive: true,
                })
              
              }
            }).catch(function (info) {
              $(".bio_img").hide()
            })
  
  
  
          })
        })
      })
    })
  }
  