let books_to_search = []


    
  setTimeout(() => {
    $('#first_search_input').on("keyup", function (event) { var keycode = (event.keyCode ? event.keyCode : event.which); if (keycode == '13') { search() } }) // on Enter press
    $("#first_search_input").on("keyup", function () {
      $(this).val(Oktob.replaceEnCharsAZERTY($(this).val()))
    })
  }, 1000);



    async function categ_index() {
      $("#search_block_2_div2 .authors_search_block_2 , #search_block_2_div2 .categ").remove()
      $("#search_block_2_div2 #books_filter").hide()
      $("#books_filter").hide()


    await knex_master.from("category").orderBy("category_order").then(function (rows) {
      rows.forEach(c => $("#search_block_2_div2").append(`<span class="categ " id="t${c.category_id}" >${c.category_name}<br></span>`))
    })
  
    $(".categ").on("click", function () {
      $("#search_block_3_div1").empty()
      $("#second_search_input").show()
      this.id.slice(1) != "" ? selected_category = knex_master.select("book_name", "book_id", "book_category").from("book").orderBy("book_name", "ASC").where("book_category", this.id.slice(1)) : selected_category = knex_master.select("book_name", "book_id", "authors", "author_name", "author_id", "book_category", "death_text").from("book").leftJoin("author", "authors", "author_id").orderBy("book_name", "ASC")
  
      selected_category.then(function (rows) {
        $("#search_block_3_div1").append(`<input type="checkbox" id="checkall_books">  `)
        rows.forEach(b => $("#search_block_3_div1").append(`<label for="l${b.book_id}" class="books_to_search"> ${b.book_name} <div class="bio_img"> </div>  <input type="checkbox" class="single_book_checkbox" id="l${b.book_id}" ></label>  `))
  
        $(".books_to_search").on("mouseover" , function () {
          theid = $(this).attr("for").slice(1)
          pointer = $(this).children(".bio_img")
          knex_master.select("bibliography").from("biblio").where("id", theid).then(function (info) {
  
            if (info.length != 0) {
              $(pointer).attr('title', info[0].bibliography)
            } else {
              $(pointer).attr('title', "ليس للكتاب بطاقة")
            }
          })
        })
  
  
        $("#second_search_input").on("keyup", function () {
          $(this).val(Oktob.replaceEnCharsAZERTY($(this).val()))
          var filter = $(this).val(),
            count = 0;
          $('.books_to_search').each(function () {
            if ($(this).text().search(new RegExp(filter, "i")  ) < 0 && filter.length > 2) {
              $(this).hide();
            } else {
              $(this).show();
              count++;
                      }
          })
        })
  
        $(".single_book_checkbox").on("change", function () {
          this.checked ? books_to_search.push([$("label[for=" + this.id).text(), "b" + this.id.slice(1)]) : books_to_search = books_to_search.filter(element => element[0] !== $("label[for=" + this.id).text())
          $("#progress_status").html(books_to_search.length)
        })
  
        $("#checkall_books").on("change", function () {
          $('input:checkbox').not(this).prop('checked', this.checked);
          this.checked ? $(".books_to_search").each(function () { books_to_search.push([$(this).text(), "b" + $(this).attr("for").slice(1)]) }) : books_to_search = []
          $("#progress_status").html(books_to_search.length)
        })
  
  
      })
  
  
    })




  
  }

  //categ_index() 
  
  $("#categ_list").on("click", function () {
    categ_index()
      })
  


function authors_index_for_search() {
  
  $("#search_block_2_div2 .categ , #search_block_2_div2 .authors_search_block_2").remove()
  $("#books_filter").show()
  $("#second_search_input").hide()

  knex_master.select("death_text" , "author_name" , "author_id").from("author").orderBy("author_name").then(function (rows) {                       /* appendding  categories  */
rows.forEach(author => $("#search_block_2_div2").append(`<span class="authors_search_block_2"  id="${author.author_id}" title="" > ${author.author_name}   <div class="bio_img" > </div>     <span id="death_date" >${author.death_text ? author.death_text : ""}</span></span>`))


$(".authors_search_block_2").on("mouseover" , function () {

pointer = $(this).children(".bio_img")
knex_master.select("inf").from("bio").where("authid", this.id).then(function (info) {
  if (info[0].inf.length > 10) {
    $(pointer).attr('title', info[0].inf)
  }
}).catch(function () {
  $(pointer).attr('title', "ليس للمؤلف بطاقة")
})
})

$("#books_filter").on("keyup", function () {
  $(this).val(  Oktob.replaceEnCharsAZERTY(   $(this).val()  )   )
  var filter = $(this).val()
  count = 0;
  $('.authors_search_block_2').each(function () {
    if ($(this).text().search(new RegExp(filter, "i")) < 0 && filter.length > 2) {
      $(this).hide();
    } else {
      $(this).show();
      count++;
               // $("#author_and_book_number").html(count)
    }
  })
})


$(".authors_search_block_2").on("click", function () {

  $("#search_block_3_div1").empty()

author = $(this).clone().children().remove().end().text()

knex_master.from("book").orderBy("book_name", "ASC").where("authors", this.id).then(function (rows) {
  $("#search_block_3_div1").append(`<input type="checkbox" id="checkall_books">  `)
  rows.forEach(b => $("#search_block_3_div1").append(`<label for="l${b.book_id}" id="${b.book_id}" class="books_to_search"> ${b.book_name} <div class="bio_img"> </div>  <input type="checkbox" class="single_book_checkbox" id="l${b.book_id}" ></label>  `))

  $(".single_book_checkbox").on("change", function () {
    this.checked ? books_to_search.push([$("label[for=" + this.id).text(), "b" + this.id.slice(1)]) : books_to_search = books_to_search.filter(element => element[0] !== $("label[for=" + this.id).text())
    $("#progress_status").html(books_to_search.length)
  })

  $("#checkall_books").on("change", function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
    this.checked ? $(".books_to_search").each(function () { books_to_search.push([$(this).text(), "b" + $(this).attr("for").slice(1)]) }) : books_to_search = []
    $("#progress_status").html(books_to_search.length)
  })

   $(".books_to_search").on("mouseover" , function () {

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

$("#author_list").on("click", function () {
  authors_index_for_search()
})







