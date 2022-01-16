var Oktob = oktob()
var knex_all = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, '../kizana_all_books.sqlite')
  }
})

var knex_master = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, '../index.sqlite')
  }
})

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

function authors_index() {                      //end author_index                        
  $("#tags1").show()
  $("#tags2").hide()
  knex_master.select("death_text" , "author_name" , "author_id").from("author").orderBy("author_name").then(function (rows) {                       /* appendding  categories  */
    rows.forEach(author => $("#first_container_one").append(`<span class="authors"  id="${author.author_id}" title="" > ${author.author_name}   <div class="bio_img" > </div>     <span id="death_date" >${author.death_text ? author.death_text : ""}</span></span>`))
    $("#first_container_one").prepend("<div id=author_and_book_number >المؤلفون (" + $('.authors').length + ")</div>")

    $(".authors").on("mouseover" , function () {

      pointer = $(this).children(".bio_img")
      knex_master.select("inf").from("bio").where("authid", this.id).then(function (info) {
        if (info[0].inf.length > 2) {
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


async function search() {                                         // Search 
  let i = 1

  $("#b001").animate({ scrollTop: 500 }, 1000);
  let search_input_value = $("#first_search_input").val().removeTashkel()

  $("td").remove()

  $("#search_window_3").html("<table class=search_table><tr><th></th><th>المعثور</th><th>الكتاب</th><th>ص</th><th>ج</th></tr></table>")
  for (book of books_to_search) {
    book_name = book[0]
    found_in = []
    await knex_all.select("content", "page", "part", "id").from(book[1]).then(function (results) {
      for (row of results) {
        $("#progress_status").html((books_to_search.indexOf(book) + 1) + "/" + books_to_search.length)
        let content_raw = row.content.removeTashkel()
        if (content_raw.includes(search_input_value)) {
          index = content_raw.search(search_input_value)
          output = content_raw.split(search_input_value)[0].slice(-60) + "<span id=found_word> " + search_input_value + "</span>" + content_raw.split(search_input_value)[1].slice(0, 60)
          $(".search_table").append(`<tr>    <td> ${i++} </td>    <td  class="${book[1]}" id="${row.id}" > ${output} </td>     <td>  ${book_name}  </td>      <td>  ${row.page}  </td>     <td>  ${row.part || ""}  </td>   </tr> `)
          $("." + book[1] + ":last").on("click", function () { add_book_and_tab($(this).next().text(), this.className.slice(1), initial_rowid = this.id) })
        }

        else { null }
      }


    }, function (error) { console.log(error) }

    )

  }
}


let unique = 0
function add_book(table_id, initial_rowid = "1") {                    // add book 
  let table_id_original = table_id
  table_id = table_id + unique
  let book_title = $("#" + table_id + " .chrome-tab-title").text()  
  let slider_id = "#s" + table_id
  let content_id = ".c" + table_id
  let sidebar_id = ".side" + table_id
  let hashia_id = ".h" + table_id
  let next = "#next" + table_id
  let previous = "#previous" + table_id
  let delimeter = "_________"
  //let line_breaking = /(?:\r\n|\r|\n)/g
  let line_breaking = /(?:\r)/g
  let prentheses = /\(([^(١|٢|٣|٤|٥|٦|٧|٨|٩)]+)\)/g
  let curly_brackets = /{([^}]*)}/g
  let quotation = /"(.*?)"/g
  let table_length = ""
  let page_input = ".page_input" + table_id
  let part_input = ".part_input" + table_id
  let single_book_search_input = ".single_book_search_input" + table_id
  let search_block = ".search_block" + table_id
  let previous_found = ".previous_found" + table_id
  let next_found = ".next_found" + table_id
  let single_book_search_num = ".single_book_search_num" + table_id
  let sidebar_search_input = ".sidebar_search_input" + table_id
  let close_search = ".close_search" + table_id

  $("body").append(`<div class="book_div" id="b${table_id}" > 
  <div id="book_toolbox">
    <div class=slider id=s${table_id}> </div>
      <img src="./../icons/arrow_up.png" class="previous" id=previous${table_id} />
        <img src="./../icons/arrow_down.png" class="next" id=next${table_id} />  
          <input type="text" class="page_input${table_id}" id="page_input"> 
          <input type="text" class="part_input${table_id}" id="part_input">

          </div> 
          
          <div class=search_block${table_id} id=search_block> 
          <input type="text" placeholder="ثلاثة أحرف على الأقل"  class="single_book_search_input${table_id}" id="single_book_search_input"> 
          <img src="./../icons/arrow_down.png" class="next_found${table_id}" id="next_found"   />  
          <img src="./../icons/arrow_up.png" class="previous_found${table_id}" id="previous_found" />
          <div id="single_book_search_num" class="single_book_search_num${table_id}"> </div>
          <span id="close_search" class="close_search${table_id}" > x</span>
          </div>

          <div class="sidebar side${table_id}">   </div>    
             <input type="text" class="sidebar_search_input${table_id}" id="sidebar_search_input" >
          <div class="content c${table_id}">   </div>  
            <div class="hashia h${table_id}">   </div> </div>`) 

  knex_all.raw("SELECT COUNT(*) FROM b" + table_id_original).then(function (text_table) { table_length = Object.values(text_table[0]) })  // table length for slider length                                                                    

  function content_updater(table_id_original, row_id, content_id) {                 // book text content changer
    knex_all.from("b" + table_id_original).where("id", row_id).then(function (row) {
      $(content_id).animate({ scrollTop: 0 }, 0);
      if (row[0].content.includes(delimeter)) {
        hashia = row[0].content.split(delimeter)[1], row[0].content = row[0].content.split(delimeter)[0]
        $(content_id).html(`${row[0].content.replace(line_breaking, '<br>').replace(prentheses, "<h5 class=aya>”$1“</h5>").replace(curly_brackets, "<h5 class=aya>”$1“</h5>").replaceAll("¬" , "") }   `)      //.replace(quotation , "<h5 class=aya>”$1“</h5>" )
        $(page_input).val(` ${row[0].page || ""}  `)         //  
        $(part_input).val(` ${row[0].part || ""}  `)
        $(hashia_id).html(hashia.replace(line_breaking, "<br>").slice(4).replaceAll("¬", ""))
        $(content_id).attr('id', row_id);
      }
      else {
        $(content_id).html(`${row[0].content.replace(line_breaking, '<br>').replace(prentheses, "<h5 class=aya>”$1“</h5>").replace(curly_brackets, "<h5 class=aya>”$1“</h5>").replaceAll("¬" , "") }   `)
        $(page_input).val(` ${row[0].page || ""}  `)
        $(part_input).val(` ${row[0].part || ""}  `)
        $(content_id).attr('id', row_id);
        $(hashia_id).empty()
      }
    }).catch(function () {
      null
    })
  }



  function book_text_formation() {

    knex_all.from("b" + table_id_original).where("id", initial_rowid).then(function (text_table) {
      $(content_id).append(`    ${text_table[0].content.replace(line_breaking, '<br>')}      `)
      $(page_input).val(` ${text_table[0].page || ""}  `)   
      $(content_id).attr('id', initial_rowid);
      $(slider_id).slider({
        value: initial_rowid,
        orientation: "vertical",
        min: 1,
        isRTL: true,
        max: table_length,
        slide: function (event, ui) {
          row_id = ui.value
          content_updater(table_id_original, row_id, content_id)
        }
      })
  
      $(content_id).on('mousewheel', function (e) { delta = e.originalEvent.deltaY ; row_id = parseInt(this.id) ; delta > 0 ? content_updater(table_id_original, row_id + 1, content_id) : content_updater(table_id_original, row_id - 1, content_id); $(slider_id).slider("value", row_id);})
      $(previous).on("click", function () { let a = parseInt($(content_id).attr("id")) ;  $(slider_id).slider("value", a - 1); content_updater(table_id_original, a - 1, content_id)  ; })
      $(next).on("click", function () { let a = parseInt($(content_id).attr("id"))  ; $(slider_id).slider("value", a + 1); content_updater(table_id_original, a + 1, content_id)  ;})
      
  
      let found_in = [] 
      $( search_block ).draggable()
      $(single_book_search_input).on("keyup", function (event) { 
        $(this).val(  Oktob.replaceEnCharsAZERTY(     $(this).val()  )   ) ;
         $(single_book_search_input).val().length  > 2 ? search_in_single_book() : null 
      })   

      $(close_search).on("click" , function () {                      
        $(search_block).slideToggle()
      })
      
      async function search_in_single_book() {                   
        $( next_found ).off()
        $(previous_found).off()
        found_in = []
    
        let search_input_value =   $(single_book_search_input).val().removeTashkel() 
        
        await knex_all.select("content", "id").from("b" + table_id_original).then(function (results) {
              for (row of results) {
                if (row.content.removeTashkel().includes(search_input_value)) {
                  $( previous_found ).show()
                  $( next_found ).show()
                  found_in.push(row.id)
              }
            }
          })
          found_in.length > 0 ? $(single_book_search_num).html(found_in.length) : $(single_book_search_num).html("لا شيئ") && $(previous_found).hide() && $(next_found).hide() 
        
      let i = 0 
      let a = 1     
  
         $(next_found).on("click" , function () {               // next of found single book search results
         content_updater(table_id_original,  found_in[i] , content_id)
          $(single_book_search_num).html(  a  + " / "  + found_in.length)
  
                i == (found_in.length - 1) ? null :  i++
                a == found_in.length ? null : a++ 
  
                setTimeout(() => {
                  $(content_id).text().removeTashkel()
                  $( `${content_id}:contains(${search_input_value}) , ${hashia_id}:contains(${search_input_value}) `).html(function(_, html) {
                    return html.split(search_input_value).join(`<span class='found_single_word'>${search_input_value}</span>`);
                })
                }, 500);
              })
       
      $(previous_found).on("click" , function () {                      // previous of found single book search results
          a ==  1 ?   null :   a--
          i == 0 ? null : i--
  
          content_updater(table_id_original,  found_in[i] , content_id)
          
          $(single_book_search_num).html( a  + " / "  +  found_in.length  )
            setTimeout(() => {
              $(`${content_id}:contains(${search_input_value}) , ${hashia_id}:contains(${search_input_value}) ` ).html(function(_, html) {
                return html.split(search_input_value).join(`<span class='found_single_word'>${search_input_value}</span>`);
            });
            }, 500);
      })


  
  
      }
      
         let book_inf          
          knex_master.select("bibliography").from("biblio").where("id", table_id_original ).then(function (info) {
           if (info[0].bibliography.length > 5) {
             book_inf = info[0].bibliography.replace(line_breaking , "\n")
           }
         }).catch(function () {
           book_inf = "ليس للكتاب بطاقة"
         })
  
        let author_inf
        let author_id
        
        knex_master.select("authors").from("book").where("book_id" , table_id_original).then(function (results) { 
          author_id = results[0].authors
  
          knex_master.select("inf").from("bio").where("authid" , author_id ).then(function (results) { 
            
            if (results[0].inf.length > 5 ) { 
             author_inf = results[0].inf.replace(line_breaking , "\n")
            }
  
          }).catch(function () {
            author_inf = "ليس للمؤلف بطاقة"
          })
        }) 
  
  
         setTimeout(() => {
  
        $.contextMenu({
            selector: content_id, 
            items: {
                  "close" : {"name"  : "غلق أو فتح الفهرس" ,
                  callback: function(itemKey, opt, e) {
                    close_index()
                }
                } ,
  
                 
                "search" : { "name" : "البحث في هذا الكتاب" , 
                callback: function(itemKey, opt, e) {
                  $(search_block).slideToggle()  ; $(single_book_search_input).trigger("focus") ;
              }
              
              } ,
                "fold1": {
                    "name": "بطاقة الكتاب", 
                    "items": {
                        "fold2-key": {"name": book_inf }
                    }
                }  , 
  
                "fold2": {
                  "name": " بطاقة المؤلف", 
                  "items": {
                      "fold2-key": {"name": author_inf}
                  }
              } , 
              
              "bookmark" : { "name" : "جعل هذا الموضع في المفضلات" , 
                callback: function(itemKey, opt, e) {
                  add_to_bookmarks()
              }}
  
  
            }
        })
    }, 100);
  
    })                                                               // end text table  selection



    
  }

  


  async  function index_formation_and_behaviors() {

      await knex_all.from("t" + table_id_original).then(function (index) {                         /// start of book index 
        for (x in index) {
          if (index[x].parent == 0) {
            $(sidebar_id).append(`<H1 id=I${index[x].id}>  ${index[x].content}</H1>`)
          }
          else if (index[x].parent != 0) {
            $(sidebar_id).append(`<H2 id=I${index[x].id}>${index[x].content}</H2>`) // grab sub titles and put them under the previous level 1 tilte. 
          }
        }
        $(sidebar_id).append("<H1></H1>")
        $(sidebar_search_input).on("keyup", function () {
              
          $(this).val(Oktob.replaceEnCharsAZERTY($(this).val()))
          var filter = $(this).val() 
            count = 0;
          $(sidebar_id + " H1,H2").each(function () {
            if ($(this).text().search(new RegExp(filter, "i")) < 0 && filter.length > 2 ) {
              $(this).hide();
            } else {
              $(this).show();
              count++;
            }
    
          })
        })
        
        $(sidebar_search_input).css("width" , $(sidebar_id).width() ) // give width to sidebar_search_input
      })                                                                          /// end of book index 

    $('body').on('DOMSubtreeModified', content_id, function () {                               // menu tracker 
      if ($(content_id + " [data-type='title']").length != 0 && $(sidebar_id).width() != 0) {
        theid = "#I" + $(content_id + " [data-type=title]").attr('id').slice(4)
        $(sidebar_id + " " + theid).is(":hidden") ? $(sidebar_id + " " + theid).prev("H1").one().click() : null
        $(sidebar_id + " H1, H2").removeClass("active")
        $(sidebar_id + " " + theid).addClass("active")
        document.querySelector(sidebar_id + " " + theid).scrollIntoView({ behavior: 'smooth', block: "center" })
      }
      else { null }
    })
  
  
    $(sidebar_id + " H2").toggle()                                  // Initiate the index in collappsed state 

    $(sidebar_id + " H1 , H2").on("click", function () {                        // On click  toggle the title sub-titles and scroll to correspondent text in main book window                     
      this.tagName == "H1" ? $(this).nextUntil("H1").toggle('slow') : null;
      row_id = $(this).attr("id").slice(1)
      knex_all.from("b" + table_id_original).where('content', 'like', '%toc-' + $(this).attr("id").slice(1) + '%').then(function (title) {
        $(slider_id).slider("value", title[0].id);
        content_updater(table_id_original, title[0].id, content_id)
      }).catch(function () {
        null
      })

    })
  

  }


  book_text_formation()
  index_formation_and_behaviors()

  
  












  $(".chrome-tab-close").on("click", function () {              //          closing tabs            
    $("#" + this.id.substring(1)).remove()
    $("#b" + this.id.substring(1)).remove()
  })

  $(".chrome-tab").on("click", function () {                                    //          navigating between tabs            
    $(".book_div").hide()
    $("#b" + this.id).show()
  })

  let width
   function close_index() {                           // close/open book index 

    if ($(sidebar_id).width() != 0) {
      width = $(sidebar_id).width()
      $(sidebar_id).animate({ width: '0' })
      $(sidebar_search_input).animate({ width: '0' }) && $(sidebar_search_input).hide()
      //$(sidebar_id).slideUp()
      $(content_id).animate({ width: 'auto' })
      
    }
    else {
      $(sidebar_id).animate({ width: Math.round(width) + 'px' })
      $(sidebar_search_input).animate({ width: Math.round(width) + 'px' }) && $(sidebar_search_input).show()
      $(content_id).animate({ width: 'auto' })
      $(sidebar_id).show()
    }
  }

function add_to_bookmarks() {                           // add_to_bookmarks
let rawdata = fs.readFileSync('bookmark.json');
let bookmarks_list = JSON.parse(rawdata);
bookmarks_list.push({"name" : book_title , "page" : $(page_input ).val() || "1" , "page_id" : $(content_id).attr("id") , "part" : $(part_input).val()  ,   "id" : table_id_original} )
bookmarks_list = JSON.stringify(bookmarks_list)
fs.writeFileSync('bookmark.json', bookmarks_list ) 
}



}                  /// end add_book

function add_book_and_tab(tab_title, id, initial_rowid) {
  $('#001').show()  
  var el = document.querySelector('.chrome-tabs');
  var chromeTabs = new ChromeTabs();
  chromeTabs.init(el, { tabOverlapDistance: 14, minWidth: 45, maxWidth: 243 });
  unique++
  chromeTabs.addTab({ title: tab_title, id: id + unique })
  $(".book_div").hide()
  add_book(id, initial_rowid)
}

function jsontotable() {      // form html table from json file
  let rawdata = fs.readFileSync('bookmark.json');
let bookmarks_list = JSON.parse(rawdata);
  let i = 0 
      var transform = {"tag":"table", "id" : "bookmark_table" , "children":[
          {"tag":"tr","children":[
              {"tag":"td",'id':"${id}" ,"class" : "bookmarked_book" , "data-page-id" : "${page_id}" , "html": "${name}"  },
              {"tag":"td",'id':"${id}"  , "html": "${page}"  },
              {"tag":"td",'id':"${id}"  , "html": "${part}"  },
              {"tag":"td" , "html": "<p  id=${id} class=remove_book >___</p>"  }
          ]}
    ]}
    $('#bookmark_table').html(json2html.transform(bookmarks_list,transform))
    $('#bookmark_table').prepend('<th>الكتاب</th><th>الصفحة</th><th>الجزء</th><th>إزالة</th>')

    $(".bookmarked_book").on("click" , function () {
      add_book_and_tab( $(this).text(), $(this).attr("id") , initial_rowid = $(this).attr("data-page-id") )
          })

$(".remove_book").on("click" , function () {
  remove_from_bookmarks(this.id)
  $(this).parents("tbody").remove()
})

}


function remove_from_bookmarks(id) { 
  console.log(id +  " removed" )
  let rawdata = fs.readFileSync('bookmark.json');
  let bookmarks_list = JSON.parse(rawdata);

  bookmarks_list = $.grep(bookmarks_list, function(e){ 
    return e.id != id; 
})

bookmarks_list = JSON.stringify(bookmarks_list)
fs.writeFileSync('bookmark.json', bookmarks_list ) 

}