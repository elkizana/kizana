function authors_index(filter = "author_name") { //end author_index                        
  $("#authors_info_div , #authors_names_div").empty()
  knex_master.select("death_text", "author_name", "author_id", "death_number").from("author").orderBy(filter).then(function(rows) {
      /* appendding  categories  */
      rows.forEach(author => $("#authors_names_div").append(`<span class="authors"  id="${author.author_id}" title="" > ${author.author_name}    <div class="bio_img person_card"  > </div>     <span id="death_date" >${author.death_text ? author.death_text : ""}</span></span>`))
      $("#authors_info_div").prepend("<div id=author_and_book_number >المؤلفون (" + $('.authors').length + ")  <img src=../icons/sort.png id=authors_filter title= 'تغيير الترتيب'/>  </span> </div>")


      $("#authors_filter").on("click", function() {
          filter == "author_name" ? authors_index(filter = "death_number") : authors_index(filter = "author_name")
      })
      

      $("#authors_first_block").on("mouseenter", ".authors" ,  function() {
       

          pointer = $(this).children(".person_card")[0]
          
          knex_master.select("inf").from("bio").where("authid", this.id).then(function(info) {
              if (info[0].inf.length > 10) {
                  $(".bio_img").hide()
                  $(pointer).show()

                  tippy(pointer, {
                      content: info[0].inf.replace(/(?:\r)/g, '\n'),
                      arrow: true,
                      interactive: true,
                      delay: [300 , 0],
                      placement: 'auto' ,


                  })
              }
          }).catch(function() {
              $(".bio_img").hide()
          })
      })


      $('#tags1').on('search', function() {
          $('.authors').show()
      });

      $("#tags1").on("keyup", function() {
          $(this).val(Oktob.replaceEnCharsAZERTY($(this).val()))
          var filter = $(this).val()
          count = 0;

          if (filter.length > 3) {

              $('.authors').each(function() {

                  if ($(this).text().search(filter) < 0 && filter.length > 2) {
                      $(this).hide();
                      $("#author_and_book_number").show()
                  } else {
                      $(this).show();
                      count++;
                      //$("#author_and_book_number").html(count)
                      //$("#author_and_book_number").hide()
                  }

              })

          } else if (filter.length == 0) {
              $(".authors").show()
          } else {
              null
          }



      })

      $("#authors_first_block").on("click", ".authors" , function() {
          $(this).addClass("active").siblings().removeClass("active")
          $("#authors_books_info_div, #authors_books_div").empty()

          author = $(this).clone().children().remove().end().text()

          knex_master.from("book").orderBy("book_name", "ASC").where("authors", this.id).then(function(rows) {

              rows.forEach(book => $("#authors_books_div").append(`<span class="books authors_books" id="${book.book_id}" > ${book.book_name} <div class="bio_img book_card" > </div>  </span>`))

              $("#authors_books_info_div").html("<span id=author_and_book_number> كتب" + author + " : " + $("#authors_books_div .books").length + "</span>")

              $(".books").on("click", function() {
                  add_book_and_tab($(this).text(), $(this).attr("id"))
              })



           

              $(".authors_books").mouseenter(function() {

                let pointer =  $(this).children(".book_card")[0]

                  knex_master.select("bibliography").from("biblio").where("id", this.id).then(function(info) {
                      if (info[0].bibliography.length > 10) {
                          $(".bio_img").hide()
                          $(pointer).show()
                         tippy(pointer, {
                              content: info[0].bibliography.replace(/(?:\r)/g, '\n'),
                              arrow: true,
                              interactive: true,
                              delay: [300 , 0],
                              placement: 'auto' ,
                              
                          })  

                      }
                  }).catch(function(info) {
                      $(".bio_img").hide()
                  })



              })



              
          })
      })
  })
} 