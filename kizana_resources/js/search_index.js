let books_to_search = []

async function search_index() {                         // Search index

    $('#first_search_input').on("keyup", function (event) { var keycode = (event.keyCode ? event.keyCode : event.which); if (keycode == '13') { search() } }) // on Enter press
    $("#first_search_input").on("keyup", function () {
      $(this).val(Oktob.replaceEnCharsAZERTY($(this).val()))
    })
  
    await knex_master.from("category").orderBy("category_order").then(function (rows) {
      $("#search_window_1").append(`<span class="categ"> الخزانة كلها <br></span>`)
      rows.forEach(c => $("#search_window_1").append(`<span class="categ " id="t${c.category_id}" >${c.category_name}<br></span>`))
    })
    //$("#search_window_1").append(`<input type="checkbox" id="checkall_categ">  `)
  
    $(".categ").on("click", function () {
      $("#search_window_2").empty();
      this.id.slice(1) != "" ? selected_category = knex_master.select("book_name", "book_id", "book_category").from("book").orderBy("book_name", "ASC").where("book_category", this.id.slice(1)) : selected_category = knex_master.select("book_name", "book_id", "authors", "author_name", "author_id", "book_category", "death_text").from("book").leftJoin("author", "authors", "author_id").orderBy("book_name", "ASC")
  
  
      selected_category.then(function (rows) {
        $("#search_window_2").append(`<input type="checkbox" id="checkall_books">  `)
        rows.forEach(b => $("#search_window_2").append(`<label for="l${b.book_id}" class="books_to_search"> ${b.book_name} <div class="bio_img"> </div>  <input type="checkbox" class="single_book_checkbox" id="l${b.book_id}" ></label>  `))
  
  
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