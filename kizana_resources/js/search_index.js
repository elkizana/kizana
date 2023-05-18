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
      $("#search_block_2_div2").append(  ` <span class="categ"> الخزانة كلها <br></span> ` )
      rows.forEach(c => $("#search_block_2_div2").append(`<span class="categ " id="t${c.category_id}" >${c.category_name}<br></span>`))
    })
  
    $(".categ").on("click", function () {
      $(this).addClass("active").siblings().removeClass("active")
      $("#search_block_3_div1").empty()
      $("#second_search_input").show()
      this.id.slice(1) != "" ? selected_category = knex_master.select("book_name", "book_id", "book_category").from("book").orderBy("book_name", "ASC").where("book_category", this.id.slice(1)) : selected_category = knex_master.select("book_name", "book_id", "authors", "author_name", "author_id", "book_category", "death_text").from("book").leftJoin("author", "authors", "author_id").orderBy("book_name", "ASC")
  
      selected_category.then(function (rows) {
        $("#search_block_3_div1").append(`<input type="checkbox" id="checkall_books">  `)
        rows.forEach(b => $("#search_block_3_div1").append(`<label for="l${b.book_id}" class="books_to_search"> ${b.book_name} <input type="checkbox" class="single_book_checkbox" id="l${b.book_id}" >  <div  class="bio_img book_card"  > </div>   <div  class="bio_img open_book_icon"  role="img" title="نشر الكتاب"> </div>   </label>        `))
  
        $(".books_to_search").on("mouseenter", function () {
          const bioImgElements = $(this).children(".bio_img");
          const openBookIcon = bioImgElements[1];
          const pointer = bioImgElements[0];
          const theId = $(this).attr("for").slice(1);
        
          $(".bio_img").hide();
          $(openBookIcon).show();
          $(openBookIcon).off("click");
        
          $(openBookIcon).on("click", function (event) {
            const bookTitle = $(this).parent().text();
            const inputId = $(this).prevAll("input").attr("id").slice(1);
            add_book_and_tab(bookTitle, inputId, "1", true);
          });
        
          knex_master
            .select("bibliography")
            .from("biblio")
            .where("id", theId)
            .then(function (info) {
              const bibliography = info[0].bibliography.replace(/(?:\r)/g, '\n');
        
              if (bibliography.length > 10) {
                $(pointer).show();
        
                tippy(pointer, {
                  content: bibliography,
                  arrow: true,
                  interactive: true,
                  delay: [300, 0],
                  placement: 'auto',
                });
              }
            })
            .catch(function () {
              $(pointer).hide();
            });
        });
        
  
        $("#second_search_input").on("keyup", debounce( function () {
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
        },500))
  
        $(".single_book_checkbox").on("change", function () {
          this.checked ? books_to_search.push([$("label[for=" + this.id).text(), "b" + this.id.slice(1)]) : books_to_search = books_to_search.filter(element => element[0] !== $("label[for=" + this.id).text())
          $("#progress_status").html("البحث في " + books_to_search.length +  " كتاب")
        })
  
        $("#checkall_books").on("change", function () {
          $('input:checkbox').not(this).prop('checked', this.checked);
          this.checked ? $(".books_to_search").each(function () { books_to_search.push([$(this).text(), "b" + $(this).attr("for").slice(1)]) }) : books_to_search = []
          $("#progress_status").html("البحث في " + books_to_search.length +  " كتاب")
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
rows.forEach(author => $("#search_block_2_div2").append(`<span class="authors_search_block_2"  id="${author.author_id}" title="" > ${author.author_name}   <div class="bio_img person_card" > </div>     <span id="death_date" >${author.death_text ? author.death_text : ""}</span></span>`))


$(".authors_search_block_2").on("mouseenter", function () {
  const pointer = $(this).children(".bio_img")[0];
  const authId = this.id;

  knex_master
    .select("inf")
    .from("bio")
    .where("authid", authId)
    .then(function (info) {
      const inf = info[0].inf.replace(/(?:\r)/g, '\n');

      if (inf.length > 10) {
        $(".bio_img").hide();
        $(pointer).show();

        tippy(pointer, {
          content: inf,
          placement: 'auto',
          arrow: true,
          interactive: true,
          delay: [300, 0],
        });
      }
    })
    .catch(function () {
      $(".bio_img").hide();
    });
});

$('#books_filter').on('search', function () {
  $('.authors_search_block_2').show();
});


$("#books_filter").on("keyup", debounce( function () {

  $(this).val(  Oktob.replaceEnCharsAZERTY(   $(this).val()  )   )
  var filter = $(this).val()
  count = 0;

  if (filter.length > 2  ) { 

  $('.authors_search_block_2').each(function () {
    
    if ($(this).text().search(new RegExp(filter, "i")) < 0 && filter.length > 3) {
      $(this).hide();
    } 
    
    else {
      $(this).show();
      count++;
               // $("#author_and_book_number").html(count)
    }
  })
}

else if (filter.length == 0 ) { 
  $(".authors_search_block_2").show()
}

else { 
  null
}




},500))


$(".authors_search_block_2").on("click", function () {

  $("#search_block_3_div1").empty()

author = $(this).clone().children().remove().end().text()

knex_master.from("book").orderBy("book_name", "ASC").where("authors", this.id).then(function (rows) {
  $("#search_block_3_div1").append(`<input type="checkbox" id="checkall_books">  `)
  rows.forEach(b => $("#search_block_3_div1").append(`<label for="l${b.book_id}" id="${b.book_id}" class="books_to_search"> ${b.book_name}  <input type="checkbox" class="single_book_checkbox" id="l${b.book_id}" >   <div class="bio_img book_card"> </div>  <div  class="bio_img open_book_icon" > </div>  </label>  `))

  $(".single_book_checkbox").on("change", function () {
    this.checked ? books_to_search.push([$("label[for=" + this.id).text(), "b" + this.id.slice(1)]) : books_to_search = books_to_search.filter(element => element[0] !== $("label[for=" + this.id).text())
    $("#progress_status").html(books_to_search.length)
  })

  $("#checkall_books").on("change", function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
    this.checked ? $(".books_to_search").each(function () { books_to_search.push([$(this).text(), "b" + $(this).attr("for").slice(1)]) }) : books_to_search = []
    $("#progress_status").html(books_to_search.length)
  })

   $(".books_to_search").on("mouseenter" , function () {
    $(".bio_img").hide()

    open_book_icon = $(this).children(".bio_img")[1]
    $(open_book_icon).show()
    $(open_book_icon).off("click");

     $(open_book_icon).on("click" , function(event) {
      add_book_and_tab(  $(this).parent().text()  , $(this).prevAll("input").attr("id").slice(1),"1",true) 
    } )   

    pointer = $(this).children(".bio_img")[0]
    theid = $(this).attr("for").slice(1)

    knex_master.select("bibliography").from("biblio").where("id", theid).then(function (info) {
            
      if (info[0].bibliography.length > 10) {
      $(pointer).show()
  

  tippy(  pointer , {
    content: info[0].bibliography.replace(/(?:\r)/g, '\n') , 
    arrow: true,
    interactive: true,
    delay: [300 , 0],
    placement: 'auto' ,
  })

}
  }).catch(function () {
    $(pointer).hide()
  })
})


})
})
})


}

$("#author_list").on("click", function () {
  authors_index_for_search()
})