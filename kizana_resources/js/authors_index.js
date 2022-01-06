function authors_index() {                      //end author_index                        
    $("#tags1").show()
    $("#tags2").hide()
    knex_master.select("death_text" , "author_name" , "author_id").from("author").orderBy("author_name").then(function (rows) {                       /* appendding  categories  */
      rows.forEach(author => $("#first_container_one").append(`<span class="authors"  id="${author.author_id}" title="" > ${author.author_name}   <div class="bio_img" > </div>     <span id="death_date" >${author.death_text ? author.death_text : ""}</span></span>`))
      $("#first_container_one").prepend("<div id=author_and_book_number >المؤلفون (" + $('.authors').length + ")</div>")
  
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
        $("#second_container_one, #second_container_two").empty()
  
        author = $(this).clone().children().remove().end().text()
  
        knex_master.from("book").orderBy("book_name", "ASC").where("authors", this.id).then(function (rows) {
  
          rows.forEach(book => $("#second_container_two").append(`<span class="books" id="${book.book_id}" > ${book.book_name} <div class="bio_img" > </div>  </span>`))
          
          $("#second_container_one").html("<span id=author_and_book_number> كتب" + author + " (" + $(".books").length + ")</span>")
          
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
  