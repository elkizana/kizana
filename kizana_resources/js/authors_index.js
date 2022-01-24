function authors_index(filter = "author_name") {                      //end author_index                        
    //$("#tags1").show()
    //$("#tags2").hide()
    $("#authors_info_div").empty()
    knex_master.select("death_text" , "author_name" , "author_id" , "death_number").from("author").orderBy(filter).then(function (rows) {                       /* appendding  categories  */
      rows.forEach(author => $("#authors_names_div").append(`<span class="authors"  id="${author.author_id}" title="" > ${author.author_name}   <div class="bio_img" > </div>     <span id="death_date" >${author.death_text ? author.death_text : ""}</span></span>`))
      $("#authors_info_div").prepend("<div id=author_and_book_number >المؤلفون (" + $('.authors').length + ")  <img src=../icons/sort.png id=authors_filter title= 'تغيير الترتيب'/>  </span> </div>") 
      
      
      $("#authors_filter").on("click" , function () {
        filter == "author_name"  ? authors_index(filter = "death_number" )   : authors_index(filter = "author_name" )  
      })

      $(".authors").on("mouseover" , function () {
        pointer = $(this).children(".bio_img")
        knex_master.select("inf").from("bio").where("authid", this.id).then(function (info) {
          if (info[0].inf.length > 10) {
            $(pointer).attr('title', info[0].inf)
          }
        }).catch(function () {
          $(pointer).attr('title', "ليس للمؤلف بطاقة")
        })
      })
  
      $("#tags1").on("keyup", function () {
        $(this).val(  Oktob.replaceEnCharsAZERTY(   $(this).val()  )   )
        var filter = $(this).val()
        count = 0;
        $('.authors').each(function () {
          if ($(this).text().search(new RegExp(filter, "i")) < 0 && filter.length > 2) {
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
  
          rows.forEach(book => $("#authors_books_div").append(`<span class="books" id="${book.book_id}" > ${book.book_name} <div class="bio_img" > </div>  </span>`))
          
          $("#authors_books_info_div").html("<span id=author_and_book_number> كتب" + author + " : " + $(".books").length + "</span>")
          
          $(".books").on("click", function () { add_book_and_tab($(this).text(), $(this).attr("id")) })
  
          $(".books").on("mouseover" , function () {
  
            pointer = $(this).children(".bio_img")
            knex_master.select("bibliography").from("biblio").where("id", this.id).then(function (info) {
              if (info[0].bibliography.length > 5) {
                $(pointer).attr('title', info[0].bibliography)
              }
            }).catch(function (info) {
              $(pointer).attr('title', "ليس للكتاب بطاقة")
            })
  
  
  
          })
        })
      })
    })
  }
  