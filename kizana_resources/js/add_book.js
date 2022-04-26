let unique = 0


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



function add_book(table_id, initial_rowid = "1") {                    // add book 
    let table_id_original = table_id
    table_id = table_id + unique
    let book_id = "#b" + table_id
    let book_title = $("#" + table_id + " .chrome-tab-title").text()  
    let slider_id = "#s" + table_id
    let content_id = ".c" + table_id
    let sidebar_id = ".side" + table_id
    let hashia_id = ".h" + table_id
    let next = "#next" + table_id
    let previous = "#previous" + table_id
    let delimeter = "_________"
    //let line_breaking = /(?:\r\n|\r|\n)/g
    //let footnote_number =  /\([\u0660-\u0669]\)/g
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
  
    $("body").append(`<div  class="book_div" id="b${table_id}"  > 
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
  
            <div class="sidebar side${table_id}">  <input type="text" class="sidebar_search_input${table_id}" id="sidebar_search_input" >  </div>    
               
            <div   class="content c${table_id}" tabindex="0" >   </div>  
              <div class="hashia h${table_id}">   </div> </div>`) 
  
    knex_all.raw("SELECT COUNT(*) FROM b" + table_id_original).then(function (text_table) { table_length = Object.values(text_table[0]) })  // table length for slider length                                                                    
  
    function content_updater(table_id_original, row_id, content_id) {                 // book text content changer
      knex_all.from("b" + table_id_original).where("id", row_id).then(function (row) {
       
        $(content_id + "," + hashia_id).scrollTop(0)
        $(content_id).trigger('focus')
      
        if (row[0].content.includes(delimeter)) {
          hashia = row[0].content.split(delimeter)[1], row[0].content = row[0].content.split(delimeter)[0]
          $(content_id).html(`${row[0].content.replace(line_breaking, '<br>').replace(prentheses, "<h5 class=aya>”$1“</h5>").replace(curly_brackets, "<h5 class=aya>”$1“</h5>").replaceAll("¬" , "") }   `)      //.replace(quotation , "<h5 class=aya>”$1“</h5>" )
          $(page_input).val(` ${row[0].page || ""}  `)         //  
          $(part_input).val(` ${row[0].part || ""}  `)
          $(hashia_id).html(hashia.replace(line_breaking, "<br>").slice(4).replaceAll("¬", ""))
          $(content_id).attr('id', row_id);
          $(content_id).css("height", "80%");

        }
        else {
          $(content_id).html(`${row[0].content.replace(line_breaking, '<br>').replace(prentheses, "<h5 class=aya>”$1“</h5>").replace(curly_brackets, "<h5 class=aya>”$1“</h5>").replaceAll("¬" , "") }   `)
          $(page_input).val(` ${row[0].page || ""}  `)
          $(part_input).val(` ${row[0].part || ""}  `)
          $(content_id).attr('id', row_id);
          $(hashia_id).empty()
          $(content_id).css("height", "100%");
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
        
      $(content_id).trigger('focus')
  
  
      $(content_id).on('keydown', function(e){
        // get keycode of current keypress event
        
        var code = (e.keyCode || e.which);
        
        if(code == 39  ) {
          let a = parseInt($(content_id).attr("id"))  ; $(slider_id).slider("value", a + 1); content_updater(table_id_original, a + 1, content_id)
        }

        else if (code == 32  &&  $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 1  )  { 
          row_id = parseInt(this.id)
          content_updater(table_id_original, row_id + 1, content_id)
          $(slider_id).slider("value", row_id);
          
        }
         else if(code == 37 ) {
          let a = parseInt($(content_id).attr("id")) ;  $(slider_id).slider("value", a - 1); content_updater(table_id_original, a - 1, content_id)  ;
      } 
  
  else if(code == 107 || code == 187  ) {
    var fontSize = parseInt($(this).css("font-size"));
    fontSize = fontSize + 1 + "px";
    $(content_id).css({'font-size':fontSize}); 
      }
    
      else if(code == 109 || code == 219 ) {
        var fontSize = parseInt($(this).css("font-size"));
        fontSize = fontSize - 1 + "px";
        $(content_id).css({'font-size':fontSize}); 
          }
/* 
      else if(code == 70 ) {
        $(search_block).slideToggle()  ; $(single_book_search_input).trigger("focus") ;
      }
      else if(code == 108 || code == 76 ) {
          close_index()
      } */
  
    
    })
    
          /* $(content_id).on('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            console.log("bottom!");
            row_id = parseInt(this.id)
            content_updater(table_id_original, row_id + 1, content_id)
        }
    }) */

    $(content_id).on('mousewheel', function (e) { 
      delta = e.originalEvent.deltaY ; row_id = parseInt(this.id) ;
      
      if ( delta > 0 && $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 1 ) { 
        content_updater(table_id_original, row_id + 1, content_id)
        $(slider_id).slider("value", row_id);
        
      }
      /* else if ( delta > 0  ) { 
        console.log(delta)  
        console.log($(this).scrollTop() + $(this).innerHeight() )
        console.log($(this)[0].scrollHeight)  

      
      }  */
      else if (delta < 0 && $(this).scrollTop() <= 0)  { 
        content_updater(table_id_original, row_id - 1, content_id); 
        $(slider_id).slider("value", row_id);
      }
       
    })
     
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
                  }, 1000);
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
              }, 1000);
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

                /* "tashkeel" : { "name" : "بيان التشكيل أو إخفاءه" , 
                type: 'checkbox', 
                selected: false , */
                
          
              /*  className: 'tashkeel' 
                   callback: function(itemKey, opt, e) {
                     $(content_id).on('DOMSubtreeModified', function(){
                      setTimeout(() => {
                        $(content_id).html( $(content_id).html().removeTashkel() )
                      }, 500);
     
                    }); 
                                    }} */

               /*  events: {
                  click: function(itemKey, opt, e) {

                    $(".tashkeel input").on("change" , function() {
                      if (this.checked) { 
                        $(content_id).on('DOMSubtreeModified', function(){
                          setTimeout(() => {
                            $(content_id).html( $(content_id).html().removeTashkel() )
                          }, 1000);
                                                })
                        
                      } else { console.log("unchecked") 
                    
                      $( content_id ).off(  "change" );
                    }
                    })


              
                                          
                                          
                                          }} 
    
                                          }*/

    
              } 
              
          })
      }, 100);
    
      })                                                               // end text table  selection
  
  
      
      
    }// end book_text_formation
  
    
  let index_list = []
  
     async function index_formation_and_behaviors() {
  
        await knex_all.from("t" + table_id_original).then(function (index) {                         /// start of book index 
        
          for (x in index) {
           // index_list.push(`<H1 id=I${index[x].id}>  ${index[x].content}</H1>`)
            //$(sidebar_id).append(`<H1 id=I${index[x].id}>  ${index[x].content}</H1>`)
             if (index[x].parent == 0) {
              //$(sidebar_id).append(`<H1 id=I${index[x].id}>  ${index[x].content}</H1>`)
              index_list.push(`<H1 id=I${index[x].id}>  ${index[x].content}</H1>`)
            }
            else  {
              //$(sidebar_id).append(`<H2 id=I${index[x].id}>${index[x].content}</H2>`) // grab sub titles and put them under the previous level 1 tilte. 
              index_list.push(`<H2 id=I${index[x].id}>  ${index[x].content}</H2>`)
            } 
          }
          
          $(sidebar_id).append(index_list)
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
          
          //$(sidebar_search_input).css("width" , $(sidebar_id).width() ) // give width to sidebar_search_input
        })                                                                          /// end of book index 
  
      $('body').on('DOMSubtreeModified', content_id, function () {                               // menu tracker 
        if ($(content_id + " [data-type='title']").length != 0 && $(sidebar_id).width() != 0) {
          theid = "#I" + $(content_id + " [data-type=title]").attr('id').slice(4)
          $(sidebar_id + " " + theid).is(":hidden") ? $(sidebar_id + " " + theid).prev("H1").one().trigger("click") : null
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
          if (title.length == 1) {
            
          
          
          } else { null}
          content_updater(table_id_original, title[0].id, content_id)
          $(slider_id).slider("value", title[0].id);

        }).catch(function () {
          null
        })
  
      })
    
  
    } //end index_formation_and_behaviors
  
  
    book_text_formation()
    index_formation_and_behaviors()
  
    
    
  
  
  
  
  
  
  
  
  
  
  
  
    $(".chrome-tab-close").on("click", function () {              //          closing tabs            
      //console.log($("#" + this.id.substring(1)) )
      $(".chrome-tab").prev().length >= 2  ? $(".chrome-tab").prev().trigger("click") :  $("#001").trigger("click")
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
  let rawdata = fs.readFileSync(bookmark_file);
  let bookmarks_list = JSON.parse(rawdata);
  bookmarks_list.push({"name" : book_title , "page" : $(page_input ).val() || "1" , "page_id" : $(content_id).attr("id") , "part" : $(part_input).val()  ,   "id" : table_id_original} )
  bookmarks_list = JSON.stringify(bookmarks_list)
  fs.writeFileSync(bookmark_file, bookmarks_list ) 
  }
  
  
  
  }  

 


  
