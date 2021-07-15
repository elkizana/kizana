var Oktob = oktob();

function library_index() {
  
       
 var knex = require("knex")({
      client: "sqlite3",
      connection: {                                   
      filename: path.join(__dirname, 'kizana_resources/databases/master.sqlite')
                  } });
$("#tags1").hide()
$("#tags2").hide()
 knex.from("category").orderBy("category_order").then(function(rows){ 

  $("#first_container_one").append( `<span class="categ"> الخزانة كلها <br></span>`)
  rows.forEach(category  => $("#first_container_one").append( `<span class="categ " id="t${category.category_id}" >${category.category_name }<br></span>`))

  $(".categ").on("click" , function() { 
  let category = $(this).text()
  $("#tags2").show()
  $("#second_container_one, #second_container_two").empty()
  this.id.slice(1) != "" ? selected_category = knex.select("book_name" , "book_id" , "book_category").from("book").orderBy("book_name","ASC" ).where("book_category" , this.id.slice(1) )/* .andWhere("book_type" , "1") */  : selected_category =  knex.select("book_name" , "book_id"  , "authors" , "author_name" , "author_id" , "book_category" , "death_text").from("book").leftJoin("author" , "authors" , "author_id" )/* .where("book_type" , "1") */.orderBy("book_name","ASC" )

  selected_category.then(function(rows) { 
    rows.forEach(book => $("#second_container_two").append(`<span class="books" id="${book.book_id}" title="" > ${book.book_name} <div class="bio_img" > </div>  </span>`)) //src="./kizana_resources/icons/outline_book_grey_24dp.png"
    //${"المؤلف : " + book.author_name }  &#13;&#10; ${book.death_text ? "توفي : " +  book.death_text + "" : ""   }    
    $("#second_container_one").html("<div id=author_and_book_number >" + $(".books").length + " كتابا في " + category + "</div>")   
    $(".books").on("click" , function() {  add_book_and_tab($(this).text() , $(this).attr("id"))  })        

    var knex = require("knex")({
      client: "sqlite3",
      connection: {
        filename: path.join(__dirname, 'kizana_resources/databases/master.sqlite')
                  }
                            })

        $( ".books").mouseover(function() { 
              pointer =  $(this).children(".bio_img")
              
              knex.select("bibliography").from("biblio").where("id" , this.id).then(function(info) {
                if (info.length  != 0   ) { 
                  $(pointer ).attr('title', info[0].bibliography  )
                  //$(pointer ).tooltip()
              
              } else {
                
                $(pointer ).attr('title', "ليس فيه بطاقة للكتاب" )
              }             

              } )

          
})


    $("#tags2").on( "keyup" , function() {
      var Oktob = oktob();
            $(this).val(Oktob.replaceEnCharsAZERTY( $(this).val()       )      )
      var filter = $(this).val(),
        count = 0;
      $('.books').each(function() {
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
          $(this).hide();
        } else {
          $(this).show();
          count++;
        }

      })
    })

    })        //  end selected_category
  })                      // end category on click 

   })          // end knex from category
                              
}                         //end library_index                        

function authors_index() {
 var knex = require("knex")({
      client: "sqlite3",
      connection: {
      filename: path.join(__dirname, 'kizana_resources/databases/master.sqlite')
                  } });
                  $("#tags1").show()
                  $("#tags2").hide()
        knex.from("author").orderBy("author_name").then(function(rows){                       /* appendding  categories  */
          rows.forEach(author  => $("#first_container_one").append( `<span class="authors"  id="${author.author_id}" title="" > ${author.author_name}      <span id="death_date" >${author.death_text ?  author.death_text : ""}</span></span>`))
          $("#first_container_one").prepend( "<div id=author_and_book_number >المؤلفون (" +   $('.authors').length  + ")</div>"   )
          

           $( ".authors").mouseover(function() { 
            var get_book_info = require("knex")({
              client: "sqlite3",
              connection: {
                filename: path.join(__dirname, './kizana_resources/databases/master.sqlite')
                          }
                                    });
       
            let theid = this.id
            get_book_info.select("inf").from("bio").where("authid" , this.id).then(function(info) {
              if ( info[0].inf != null ) { 
                $("#" + theid ).attr('title', info[0].inf )
              }

              else {
                  $("#" + theid ).attr('title', "ليس قيه بطاقة" )
                }
            }).catch(function(error){
              $("#" + theid ).attr('title', "ليس قيه بطاقة" )
             })
  })
 



          $("#tags1").on( "keyup" ,  function() {
            var Oktob = oktob();
            $(this).val(Oktob.replaceEnCharsAZERTY( $(this).val()       )      )
            var filter =  $(this).val()  
              count = 0;
            $('.authors').each(function() {
              if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
              } else {
                $(this).show();
                count++;
              }
            })
          })

                    $(".authors").on("click" , function() { 
                      $("#second_container_one, #second_container_two").empty()  
                     // let author =  $(this).text().not("#date")
                     author =  $(this).clone().children() .remove().end().text()
                      
                       knex.from("book").orderBy("book_name","ASC" ).where("authors" , this.id).then(function(rows) { 
                        
                        rows.forEach(book => $("#second_container_two").append(`<span class="books" id="${book.book_id}" > ${book.book_name} <div class="bio_img" > </div>  </span>`))
                        $("#second_container_one").html( "<span id=author_and_book_number> كتب" + author + " (" + $(".books").length + ")</span>"  )
                        $(".books").on("click" , function() { add_book_and_tab($(this).text() , $(this).attr("id"))})  
                     
                        $( ".books").mouseover(function() { 
              
                          pointer =  $(this).children(".bio_img")
                          knex.select("bibliography").from("biblio").where("id" , this.id).then(function(info) {
                            if (info.length  != 0   ) { 
                              $(pointer ).attr('title', info[0].bibliography )
                              //$(pointer ).tooltip()
                          
                          } else {
                            
                            $(pointer ).attr('title', "ليس فيه بطاقة للكتاب" )
                          }             
                          } )
            })
                      }) 
                      })                            
                  })
}


  let books_to_search = []

async function show_by_categ() { 
  var knex = require("knex")({
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, 'kizana_resources/databases/master.sqlite')
                } })

$('#first_search_input').on("keyup" , function(event){var keycode = (event.keyCode ? event.keyCode : event.which);if(keycode == '13'){search()}}) // on Enter press

$("#first_search_input").on("keyup" , function() { 
                  
  $(this).val(Oktob.replaceEnCharsAZERTY( $(this).val()       )      )

})

await knex.from("category").orderBy("category_order").then(function(rows){  
  $("#search_window_1").append( `<span class="categ"> الخزانة كلها <br></span>`)
    rows.forEach(c  => $("#search_window_1").append( `<span class="categ " id="t${c.category_id}" >${c.category_name }<br></span>`))
  })
    //$("#search_window_1").append(`<input type="checkbox" id="checkall_categ">  `)
   
    $(".categ").on("click" , function() {
       $("#search_window_2").empty() ; 
       this.id.slice(1) != "" ? selected_category = knex.select("book_name" , "book_id"  , "book_category").from("book").orderBy("book_name","ASC" ).where("book_category" , this.id.slice(1) )  : selected_category =  knex.select("book_name" , "book_id"  , "authors" , "author_name" , "author_id" , "book_category" , "death_text").from("book").leftJoin("author" , "authors" , "author_id" ).orderBy("book_name","ASC" )


      selected_category.then(function(rows) { 
        $("#search_window_2").append(`<input type="checkbox" id="checkall_books">  `)
        rows.forEach(b => $("#search_window_2").append(`<label for="l${b.book_id}" class="books_to_search"> ${b.book_name} <div class="bio_img"> </div>  <input type="checkbox" class="single_book_checkbox" id="l${b.book_id}" ></label>  ` ))


        $( ".books_to_search").mouseover(function() { 
          theid = $(this).attr("for").slice(1)       
          pointer =  $(this).children(".bio_img")
          knex.select("bibliography").from("biblio").where("id" , theid).then(function(info) {
            
            if (info.length  != 0   ) { 
              $(pointer ).attr('title', info[0].bibliography )
              //$(pointer ).tooltip()
          
          } else {
            
            $(pointer ).attr('title', "ليس فيه بطاقة للكتاب" )
          }             
          } )
})

     
        $("#second_search_input").on( "keyup" , function() {
          var Oktob = oktob();
            $(this).val(Oktob.replaceEnCharsAZERTY( $(this).val()       )      )
          var filter = $(this).val(),
            count = 0;
          $('.books_to_search').each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
              $(this).hide();
            } else {
              $(this).show();
              count++;
            }
          })
        })
     
        $(".single_book_checkbox").on("change"  , function() {
          this.checked  ? books_to_search.push([ $("label[for=" + this.id).text() , "b" + this.id.slice(1) ] ) : books_to_search = books_to_search.filter(element => element[0] !==  $("label[for=" + this.id).text() ) 
          $("#progress_status").html(  books_to_search.length )
        }) 
  
         $("#checkall_books").on("change"  , function() {
          $('input:checkbox').not(this).prop('checked', this.checked);
          this.checked ? $(".books_to_search").each(function(){books_to_search.push([$(this).text() ,  "b" +  $(this).attr("for").slice(1) ] )}) : books_to_search = []
          $("#progress_status").html(  books_to_search.length )
        }) 
     
     
      })  
      

    })
   
}


async function search() { 
 // console.time('doSomething')

  let i = 1 

  var knex = require("knex")({
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, 'kizana_resources/databases/kizana_all_books.sqlite')
                } });
                
                
                
  $("#b001").animate({ scrollTop: 500 }, 1000);
  let search_input_value  = $("#first_search_input").val().removeTashkel()
  
  

  $("td").remove()

 $("#search_window_3").html("<table><tr><th></th><th>المعثور</th><th>الكتاب</th><th>ص</th><th>ج</th></tr></table>")
 for ( book of books_to_search) { 
  book_name = book[0]
  found_in  = []
  await knex.select("content", "page" , "part" , "id").from(book[1]).then(function(results) { 
     // found_in = results جساسة
  
  
     for (row of results) { 
      $("#progress_status").html( (books_to_search.indexOf(book) + 1 )  +   "/"  + books_to_search.length) 
     let content_raw =  row.content.removeTashkel()
      if (content_raw.includes(search_input_value) ) {
         index  = content_raw.search(search_input_value)
         output = content_raw.split(search_input_value)[0].slice(-60) + "<span id=found_word> " + search_input_value + "</span>" +  content_raw.split(search_input_value)[1].slice(0,60)
         $("table").append( `<tr>    <td> ${i++} </td>    <td  class="${book[1]}" id="${row.id}" > ${output} </td>     <td>  ${ book_name }  </td>      <td>  ${row.page}  </td>     <td>  ${row.part || ""}  </td>   </tr> `)                           
         $(  "." + book[1]  + ":last").on("click" , function() { add_book_and_tab( $(this).next().text() , this.className.slice(1) , initial_rowid = this.id   )} )
     }
   
     else { null }  
                         }
  
  
    }  ,  function(error) {console.log(error) }
  
  ) 
                     
                        }
                       // console.timeEnd('doSomething') 
                        
}










let unique = 0
function add_book(table_id , initial_rowid="1")   { 
  
  let table_id_original = table_id
  table_id = table_id + unique
  
  let slider_id = "#s" + table_id
  let content_id = ".c" + table_id
  let sidebar_id = ".side" + table_id
  let hashia_id = ".h" + table_id
  let next = "#next" + table_id
  let previous = "#previous" + table_id
  let sidebar_icon = "#sidebar_icon" + table_id
  let delimeter = "_________" 
  let line_breaking = /(?:\r\n|\r|\n)/g 
  let prentheses  = /\(([^(١|٢|٣|٤|٥|٦|٧|٨|٩)]+)\)/g                       
  let curly_brackets = /{([^}]*)}/g
  //let curly_brackets_digits =  /{([١|٢]*)}/g
  let quotation = /"([^"]*)"/g
  let table_length  = ""
  let page_input = ".page_input" + table_id 
  let part_input = ".part_input" + table_id
  let book_info = ".book_info" + table_id
  
  
  $("body").append(`<div class="book_div" id="b${table_id}" > <div id="book_toolbox">  <div class=slider id=s${table_id}> </div>  <img src="./kizana_resources/icons/outline_keyboard_arrow_up_black_24dp.png" class="previous" id=previous${table_id} />  <img src="./kizana_resources/icons/outline_keyboard_arrow_down_black_24dp.png" class="next" id=next${table_id} />   <input type="text" class="page_input${table_id}" id="page_input"> <input type="text" class="part_input${table_id}" id="part_input"><img src="./kizana_resources/icons/outline_book_black_24dp.png" title="" class="book_info${table_id}"  id="book_info" />  <img src="./kizana_resources/icons/baseline_menu_open_black_24dp.png" class="sidebar_icon" id="sidebar_icon${table_id}" /> </div> <div class="sidebar side${table_id}">  </div>    <div class="content c${table_id}">   </div>  <div class="hashia h${table_id}">   </div> </div>`) //add html for book
   
  var knex = require("knex")({
            client: "sqlite3",
            connection: {
              filename: path.join(__dirname, 'kizana_resources/databases/kizana_all_books.sqlite')
                        }
                                  });
knex.raw("SELECT COUNT(*) FROM b" + table_id_original  ).then(function(text_table){ table_length = Object.values(text_table[0]) })  // table length for slider length                                                                    

function content_updater (table_id_original , row_id , content_id ) { 
  knex.from("b" + table_id_original).where("id" , row_id).then(function(row){
    //handle.text( row[0].page  );
    //console.log(row[0].content)
    $(content_id).animate({ scrollTop: 0 }, 0);
    if (  row[0].content.includes(delimeter)    ) {
          hashia = row[0].content.split(delimeter)[1] , row[0].content = row[0].content.split(delimeter)[0]
          $(content_id).html(  `${row[0].content.replace(line_breaking, '<br>')/* .replace(prentheses, "<h5 class=aya>”$1“</h5>" ) */  }   `)  //.replace(quotation , "<h5 class=aya>”$1“</h5>" )
          $(page_input).val(` ${row[0].page || "" }  `)         //  
          $(part_input).val(` ${row[0].part || ""}  `)
          $(hashia_id).html( hashia.replace(line_breaking , "<br>" ).slice(4).replaceAll("¬" , "") )
          $(content_id).attr('id', row_id);
    }
    else { 
      $(content_id).html(  `${row[0].content.replace(line_breaking, '<br>')/* .replace(prentheses, "<h5 class=aya>”$1“</h5>" ).replace(curly_brackets , "<h5 class=aya>”$1“</h5>" )  */}   `)
      $(page_input).val(` ${row[0].page || "" }  `) 
      $(part_input).val(` ${row[0].part || ""}  `)
      $(content_id).attr('id', row_id);
      $(hashia_id).empty()
    }
  })
}

 

  knex.from("t" +  table_id_original).then(function(index){                         /// start of book index 
    for ( x in index) { 
      if ( index[x].parent == 0 ) {       
    $(sidebar_id).append(`<H1 id=I${index[x].id}>  ${index[x].content}</H1>`)
    }
      else if (index[x].parent != 0 ) { 
    $(sidebar_id).append(`<H2 id=I${index[x].id}>${index[x].content}</H2>`) // grab sub titles and put them under the previous level 1 tilte. 
    } 
   }
   $(sidebar_id).append("<H1></H1>")
  })                                                                          /// end of book index 
  
                                                        /// Book content 
    knex.from("b" + table_id_original).where("id" , initial_rowid).then(function(text_table){   
      $(content_id).append(`${text_table[0].content.replace(line_breaking, '<br>')} `)
      $(content_id).attr('id', initial_rowid);
        $( slider_id ).slider({
          value :  initial_rowid , 
          orientation : "vertical" ,   
          min :  1 , 
          isRTL: true,
          max : table_length , 
          /* create: function() {
          handle.text( $( this ).slider( "value" ) );
          }, */
          slide: function( event, ui ) {
            row_id = ui.value
            content_updater(table_id_original, row_id , content_id)
        }
                    })
                    
                /*     $(page_input).on("change" , function () {  
                      content_updater(table_id_original , this.value  , content_id)
                      $(slider_id ).slider( "value", this.value );
                      } )        */             

      $(content_id).on('mousewheel', function(e){ 
        delta = e.originalEvent.deltaY
        row_id = parseInt(this.id)
        delta > 0 ? content_updater(table_id_original, row_id + 1   ,  content_id)  : content_updater(table_id_original, row_id - 1   ,  content_id)
        $(slider_id ).slider( "value", row_id );
      })      

      $(previous).on("click" , function () { 
        let a = parseInt(   $(content_id).attr("id")  ) 
        $(slider_id ).slider( "value", a - 1  );
        content_updater(table_id_original , a - 1 , content_id)

      })

      $(next).on("click" , function () { 
        let a = parseInt(   $(content_id).attr("id")  ) 
        $(slider_id ).slider( "value", a + 1  );
        content_updater(table_id_original , a + 1 , content_id)

      })

     
         var get_book_info = require("knex")({
          client: "sqlite3",
          connection: {
            filename: path.join(__dirname, 'kizana_resources/databases/master.sqlite')
                      }
                                });

      get_book_info.select("bibliography").from("biblio").where("id" , book_info.slice(10 , -1)).then(function(info) {

        if (info[0].bibliography.length > 2 ) { 
          $(book_info).tooltip({
            content : info[0].bibliography.replace(line_breaking , "<br>")
          })
        }
    }).catch(function() { 
      $(book_info).tooltip({
        content : "ليس فيه بطاقة للكتاب"
      })
      
    })
        
      $('body').on('DOMSubtreeModified', content_id, function(){                               // menu tracker 
        
        if  ($(content_id +  " [data-type='title']").length != 0) {     
          theid = "#I"  + $(content_id + " [data-type=title]").attr('id').slice(4)
          $(sidebar_id + " " + theid).is(":hidden") ? $(sidebar_id + " " + theid).prev("H1").one().click()   : null   
          $(sidebar_id + " H1, H2").removeClass("active")
          $(sidebar_id + " " + theid).addClass("active")
          document.querySelector(sidebar_id + " " + theid).scrollIntoView({behavior: 'smooth'  ,block: "center"}) 
          
        }
        else { null }          
         })
      
             $(sidebar_id + " H2").toggle()                                  // Initiate the index in collappsed state 
              $( sidebar_id + " H1 , H2" ).on("click" , function() {                        // On click  toggle the title sub-titles and scroll to correspondent text in main book window                     
                  this.tagName == "H1" ? $( this ).nextUntil("H1").toggle('slow') : null ;           
                  row_id = $(this).attr("id").slice(1)
                  knex.from("b" + table_id_original).where('content', 'like', '%toc-' + $(this).attr("id").slice(1) + '%').then(function(title) { 
                    $( slider_id ).slider( "value", title[0].id  );
                    content_updater(table_id_original, title[0].id , content_id)
              })
        } )
        })                                                               // end text table  selection

  $(".chrome-tab-close").on("click" , function() {              /*          closing tabs            */ 
    $("#" + this.id.substring(1)).remove()
    $("#b" + this.id.substring(1)).remove()
    }) 
  
    $(".chrome-tab").on("click" , function() {                                    /*          navigating between tabs            */ 
      $(".book_div").hide()
      $("#b" + this.id).show() 
    }) 

    let width 
    //setTimeout(function() { width = $(sidebar_id).width()  }, 1000)

    $(sidebar_icon).on("click" , function() { 
  
  if (  $(sidebar_id).width() != 0   ) { 
    width  = $(sidebar_id).width()
    $(sidebar_id).animate({width: '0'})    
    $(sidebar_id).slideUp()
    $(content_id).animate({width: 'auto'})    
}    
  else { 
    $(sidebar_id).animate({width: Math.round( width )   + 'px'  })
    $(content_id).animate({width: 'auto'})
    $(sidebar_id).show()
}  
   
      
})

}                  /// end add_book



  function add_book_and_tab (tab_title , id , initial_rowid) {
    var el = document.querySelector('.chrome-tabs');
      var chromeTabs = new ChromeTabs();
      chromeTabs.init(el, { tabOverlapDistance: 14, minWidth: 45, maxWidth: 243 });
      unique++
    chromeTabs.addTab({ title : tab_title , id : id + unique })
  $(".book_div").hide()
  add_book (id , initial_rowid)
  }




/* 
const options = {
  includeMatches : true , 
  //includeScore: true,
  //shouldSort : true , 
  //findAllMatches : true ,
  //ignoreLocation : true , 
  threshold : 0.5 , 
  
  keys: ['content'  , 'page' , 'part'] , 
  //minMatchCharLength : 7
}

const fuse = new Fuse(found_in, options)
const result = fuse.search('رسول الله')
 console.log(result.map( row => row )  ) */












/*

 var availableTags = []               
 $( ".books" ).each(function() {availableTags.push(this.outerHTML)}) 
   $( "#tags2" ).autocomplete({ 
    minLength : 3 ,   
     source: function(request, response) {
    var results = $.ui.autocomplete.filter(availableTags, request.term) 
    $("#second_container_two .books").hide()
    $("#second_container_two").prepend(results.slice(0,15))  
    $("#second_container_two .books:visible").addClass("filtered")
    $("input").on("keyup" , function() {if (!this.value) {$("#second_container_two .filtered").remove() && $("#second_container_two .books").show() } })    
    $(".filtered").on("click" , function() { add_book_and_tab($(this).text() , $(this).attr("id"))  })        
  }         // end source  
})  // end #tags 



*/