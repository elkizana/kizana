let unique = 0


async function add_book_and_tab(tab_title, id, initial_rowid, not_resume = false) {
    $('#001').show()
    var el = document.querySelector('.chrome-tabs');
    var chromeTabs = new ChromeTabs();
    chromeTabs.init(el, {
        tabOverlapDistance: 14,
        minWidth: 45,
        maxWidth: 243
    });
    unique++
    chromeTabs.addTab({
        title: tab_title,
        id: id + unique
    })
    $(".book_div").hide()

    let rawdata = fs.readFileSync(last_opened);
    let last_opened_list = JSON.parse(rawdata);

    const idToCheck = id;

    const foundObject = last_opened_list.find(obj => obj.id === idToCheck);

    if (foundObject && not_resume == false) {
        add_book(id, foundObject['page_id'])


    } else if (foundObject && not_resume == true) {
        add_book(id, initial_rowid)


    } else {
        add_book(id, initial_rowid)


    }

}

function add_book(table_id, initial_rowid = "1") { // add book 
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
    let line_breaking = /(?:\r\n|\r|\n)/g
    let footnote_number = /[\u0660-\u0669]/g
    //let line_breaking = /(?:\r)/g
    let prentheses = /\(([^(١|٢|٣|٤|٥|٦|٧|٨|٩)]+)\)/g
    let curly_brackets = /{([^}]*)}/g
    let quotation = /"(.*?)"/g
    let bayt = /.*[.]{3}.*/g
    let table_length = ""
    let page_input = ".page_input" + table_id
    let part_input = ".part_input" + table_id
    let sidebar_toggle = "#sidebar_toggle" + table_id
    let search_book_loop = "#search_book_loop" + table_id
    let single_book_search_input = ".single_book_search_input" + table_id
    let search_block = ".search_block" + table_id
    let previous_found = ".previous_found" + table_id
    let next_found = ".next_found" + table_id
    let single_book_search_num = ".single_book_search_num" + table_id
    let sidebar_search_input = ".sidebar_search_input" + table_id
    let close_search = ".close_search" + table_id
    //let toggle_id = "#toggle" + table_id


    $("body").append(`<div  class="book_div" id="b${table_id}"  > 
    <div id="book_toolbox">
      <div class=slider id=s${table_id}> </div>
        <img src="./../icons/arrow_up.png" class="previous" id=previous${table_id} />
          <img src="./../icons/arrow_down.png" class="next" id=next${table_id} />  
            <input type="text" class="page_input${table_id}" id="page_input"> 
            <input type="text" class="part_input${table_id}" id="part_input">
            <img src="./../icons/search.png" class="search_book_loop" id=search_book_loop${table_id} title="البحث في هذاسالكتاب" />  
            <img src="./../icons/sidebar_toggle.png" class="sidebar_toggle"  id=sidebar_toggle${table_id} title="غلق الفهرس و فتحه"/>  
  
            </div> 
            
            <div class=search_block${table_id} id=search_block> 
            <input type="search" placeholder="ثلاثة أحرف على الأقل"  class="single_book_search_input${table_id}" id="single_book_search_input"> 
            <div id="single_book_search_num" class="single_book_search_num${table_id}"> </div>
            <img src="./../icons/arrow_up.png" class="previous_found${table_id}" id="previous_found" />
            <img src="./../icons/arrow_down.png" class="next_found${table_id}" id="next_found"   />  
            <span id="close_search" class="close_search${table_id}" > </span>
            </div>
  
            <div class="sidebar resizable-element side${table_id}">  <div class="resize-handle"></div> <input type="search" placeholder="حرفان على الأقل" class="sidebar_search_input${table_id}" id="sidebar_search_input" >   </div>    
               
            <div   class="content  c${table_id}" tabindex="0" >   </div>  
              <div class="hashia   h${table_id}">    </div>  </div>`)

    //<img title="ضم أوبسط العناوين" src="./../icons/toggle.png" class="toggle_all" id=toggle${table_id} />
    knex_all.raw("SELECT COUNT(*) FROM b" + table_id_original).then(function(text_table) {
        table_length = Object.values(text_table[0])
    }) // table length for slider length                                                                    

    function content_updater(table_id_original, row_id, content_id) { // book text content changer
        knex_all.from("b" + table_id_original).where("id", row_id).then(function(row) {

            $(content_id + "," + hashia_id).scrollTop(0)
            $(content_id).trigger('focus')
            if (row[0].content.includes(delimeter)) {
                hashia = row[0].content.split(delimeter)[1], row[0].content = row[0].content.split(delimeter)[0]
                $(content_id).html(`${row[0].content/* .replace(line_breaking, '<br>') */.replace(prentheses, "<h5 class=aya>$1</h5>").replace(curly_brackets, "<h5 class=aya>$1</h5>").replaceAll("¬" , "") }   `)
                $(page_input).val(` ${row[0].page || ""}  `) //  
                $(part_input).val(` ${row[0].part || ""}  `)
                $(hashia_id).html(hashia.replace(line_breaking, "<br>").slice(4).replaceAll("¬", ""))
                $(content_id).attr('id', row_id);
                $(content_id).css("height", "75%");
                $(hashia_id).css("height", "23%");
            } else {
                $(content_id).html(`${row[0].content/* .replace(line_breaking, '<br>') */.replace(prentheses, "<h5 class=aya>$1</h5>").replace(curly_brackets, "<h5 class=aya>$1</h5>").replaceAll("¬" , "") }   `)
                $(page_input).val(` ${row[0].page || ""}  `)
                $(part_input).val(` ${row[0].part || ""}  `)
                $(content_id).attr('id', row_id);
                $(hashia_id).empty()
                $(content_id).css("height", "100%");
            }
        }).catch(function() {
            null
        })
    }



    function book_text_formation() {

        knex_all.from("b" + table_id_original).where("id", initial_rowid).then(function(row) {
            if (row[0].content.includes(delimeter)) {
                hashia = row[0].content.split(delimeter)[1], row[0].content = row[0].content.split(delimeter)[0]
                $(content_id).html(`${row[0].content.replace(prentheses, "<h5 class=aya>$1</h5>").replace(curly_brackets, "<h5 class=aya>$1</h5>").replaceAll("¬" , "") }   `)
                $(page_input).val(` ${row[0].page || ""}  `) //  
                $(part_input).val(` ${row[0].part || ""}  `)
                $(hashia_id).html(hashia.replace(line_breaking, "<br>").slice(4).replaceAll("¬", ""))
                $(content_id).attr('id', initial_rowid);
                $(content_id).css("height", "70%");

            } else {
                $(content_id).html(`${row[0].content.replace(prentheses, "<h5 class=aya>$1</h5>").replace(curly_brackets, "<h5 class=aya>$1</h5>").replaceAll("¬" , "") }   `)
                $(page_input).val(` ${row[0].page || ""}  `)
                $(part_input).val(` ${row[0].part || ""}  `)
                $(content_id).attr('id', initial_rowid);
                $(hashia_id).empty()
                $(content_id).css("height", "100%");
            }

            $(slider_id).slider({
                value: initial_rowid,
                orientation: "vertical",
                min: 1,
                isRTL: true,
                max: table_length,
                slide: function(event, ui) {
                    row_id = ui.value
                    content_updater(table_id_original, row_id, content_id)
                }
            })

            $(content_id).trigger('focus')


            // Cache jQuery objects
            const $content = $(content_id);
            const $slider = $(slider_id);

            // Define the keydown event handler
            $content.on('keydown', function(event) {
                const code = event.which;

                if (code === 39) {
                    moveToNextSlide();
                } else if (code === 32 && $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 1) {
                    moveToNextSlide();
                } else if (code === 37) {
                    moveToPreviousSlide();
                } else if (code === 107 || code === 187) {
                    increaseFontSize();
                } else if (code === 109 || code === 219) {
                    decreaseFontSize();
                } else if (code === 9) {
                    close_index();
                } else if (code === 70) {
                    $(search_block).slideToggle();
                    setTimeout(() => {
                        $(single_book_search_input).trigger("focus")
                    }, 100);
                }
            });

            // Move to the next slide
            function moveToNextSlide() {
                const id = parseInt($content.attr("id"));
                $slider.slider("value", id + 1);
                content_updater(table_id_original, id + 1, content_id);
            }

            // Move down the table
            function moveDownTable() {
                const rowId = parseInt(this.id);
                content_updater(table_id_original, rowId + 1, content_id);
                $slider.slider("value", rowId);
            }

            // Move to the previous slide
            function moveToPreviousSlide() {
                const id = parseInt($content.attr("id"));
                $slider.slider("value", id - 1);
                content_updater(table_id_original, id - 1, content_id);
            }

            // Increase the font size
            function increaseFontSize() {
                const fontSize = parseInt($content.css("font-size"));
                const newFontSize = `${fontSize + 1}px`;
                $content.css({
                    'font-size': newFontSize
                });
            }

            // Decrease the font size
            function decreaseFontSize() {
                const fontSize = parseInt($content.css("font-size"));
                const newFontSize = `${fontSize - 1}px`;
                $content.css({
                    'font-size': newFontSize
                });
            }




            $(content_id).on('mousewheel', function(e) {
                delta = e.originalEvent.deltaY;
                row_id = parseInt(this.id);

                if (delta > 0 && $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 1) {
                    content_updater(table_id_original, row_id + 1, content_id)
                    $(slider_id).slider("value", row_id);

                } else if (delta < 0 && $(this).scrollTop() <= 0) {
                    content_updater(table_id_original, row_id - 1, content_id);
                    $(slider_id).slider("value", row_id);
                }

            })

            $(previous).on("click", function() {
                let a = parseInt($(content_id).attr("id"));
                $(slider_id).slider("value", a - 1);
                content_updater(table_id_original, a - 1, content_id);
            })
            $(next).on("click", function() {
                let a = parseInt($(content_id).attr("id"));
                $(slider_id).slider("value", a + 1);
                content_updater(table_id_original, a + 1, content_id);
            })
            $(search_book_loop).on("click", function() {
                $(search_block).slideToggle();
                $(single_book_search_input).trigger("focus")
            })
            $(sidebar_toggle).on("click", function() {
                close_index()
            })

             $( sidebar_id + ".resizable-element").resizable({
                handles: {
                  'w': '.resize-handle'
                }
              }); 


            let found_in = []
            $(search_block).draggable()

            //$(sidebar_search_input).on("keyup change", debounce(function () {
            $(single_book_search_input).on("keyup", debounce(function(event) {
                $(this).val(Oktob.replaceEnCharsAZERTY($(this).val()));
                $(single_book_search_input).val().length > 2 ? search_in_single_book() : null
            }, 500))


            $(close_search).on("click", function() {
                $(search_block).slideToggle()
            })

            async function search_in_single_book() {
                $(next_found).off();
                $(previous_found).off();
                found_in = [];

                const search_input_value = $(single_book_search_input).val().removeTashkel();

                const results = await knex_all
                    .select('content', 'id')
                    .from('b' + table_id_original);

                results.forEach((row) => {
                    if (row.content.removeTashkel().includes(search_input_value)) {
                        $(previous_found).show();
                        $(next_found).show();
                        found_in.push(row.id);
                    }
                });

                $(single_book_search_num).html(found_in.length > 0 ? found_in.length : 'لا شيئ');
                $(previous_found).toggle(found_in.length > 0);
                $(next_found).toggle(found_in.length > 0);

                let i = 0;
                let a = 1;

                const updateContent = (index) => {
                    content_updater(table_id_original, found_in[index], content_id);
                    $(single_book_search_num).html(`${i + 1} / ${found_in.length}`);
                    setTimeout(() => {
                        $(content_id)
                            .html($(content_id).html().removeTashkel().split(search_input_value).join(`<span class='${content_id}   found_single_word'>${search_input_value}</span>`));
                    }, 500);
                    setTimeout(() => {
                        document.querySelector(`${content_id}  .found_single_word`).scrollIntoView({
                            block: "center"
                        });
                    }, 1000);
                };

                $(next_found).on('click', () => {
                console.log("i ===  "  + i )
                  console.log("legnth ===  " +  found_in.length )
                  if (       i < found_in.length ) { 
                    updateContent(i)
                    i++ 
                  }
                          
                })

                $(previous_found).on('click', () => {
                    if (       i > 0  ) { 
                        i--
                        updateContent(i)
                      }


                })

            }

            let book_inf
            knex_master.select("bibliography").from("biblio").where("id", table_id_original).then(function(info) {
                if (info[0].bibliography.length > 15) {
                    book_inf = info[0].bibliography.replace(line_breaking, "\n")
                }
            }).catch(function() {
                book_inf = "ليس للكتاب بطاقة"
            })

            //let author_inf
            //let author_id
            knex_master.select("authors").from("book").where("book_id", table_id_original).then(function(results) {
                author_id = results[0].authors
               
                knex_master.select("inf").from("bio").where("authid", author_id).then(function(results) {

                    if (results[0].inf.length > 15) {
                        author_inf = results[0].inf.replace(line_breaking, "\n")
                    } 

                }).catch(function() {
                    author_inf = "ليس للمؤلف بطاقة"

                })
            })


            setTimeout(() => {

                $.contextMenu({
                    selector: content_id,
                    items: {

                        "fold1": {
                            "name": "بطاقة الكتاب",
                            "items": {
                                "fold1-key": {
                                    "name": book_inf
                                }
                            }
                        },

                        "fold2": {
                            "name": " بطاقة المؤلف",
                            "items": {
                                "fold2-key": {
                                    "name": author_inf
                                }
                            }
                        },

                        "bookmark": {
                            "name": "جعل هذا الموضع في المنشورة",
                            callback: function(itemKey, opt, e) {
                                add_to_bookmarks()
                            }
                        }

                    }

                })
            }, 100);

        }) // end text table  selection

    } // end book_text_formation

    let index_list = []

    function index_formation_and_behaviors() {

        knex_all.from("t" + table_id_original).then(function(index) { /// start of book index 


            for (x in index) {
                if (index.length < 10000) {
                    if (index[x].parent == 0) {
                        var aaa = "h1-" + unique++
                        //<div class=header_block>  </div> 
                        index_list.push(`<span class="expand_arrow left" >  </span>   <H1 class="${aaa}" id=I${index[x].id}>  ${index[x].content}</H1><br>`)
                    } else {
                        index_list.push(`<H2  class="${aaa}" id=I${index[x].id}>  ${index[x].content}</H2> `)
                    }
                } else if (index.length > 10000 && index[x].parent == 0) {
                    var aaa = "h1-" + unique++
                    index_list.push(`<div class=header_block> <span class="expand_arrow left" >  </span>   <H1 class="${aaa}" id=I${index[x].id}>  ${index[x].content}</H1> </div><br>`)
                }

            }

        }).then(function() {
            $(sidebar_id).append(index_list)
            $(sidebar_id).append("<H1></H1>")

            $(sidebar_id + " H2").toggle() // Initiate the index in collappsed state 
            $("h1").each(function() {
                $(this).nextUntil("h1").is("h2") ? null : $(this).prev(".expand_arrow").attr('class', 'circle')

            })


            $(sidebar_search_input).on('search', function() {
                $(sidebar_id + " H1,H2").show()
            });


            $(sidebar_search_input).on("keyup change", debounce(function() {


                $(this).val(Oktob.replaceEnCharsAZERTY($(this).val()))
                var filter = $(this).val()
                count = 0

                if (filter.length >= 2) {

                    $(sidebar_id + " H1,H2").each(function() {

                        if ($(this).text().search(filter, "i") < 0) {
                            $(this).hide() && $(this).prev(".expand_arrow , .circle ").hide()
                        } else {
                            $(this).show() //&& $(this).prev(".expand_arrow").show()
                            this.scrollIntoView({
                                block: "center"
                            })
                            count++
                        }

                    })

                } else if (filter.length == 0) {
                    $(sidebar_id + " H1,H2").show()
                } else {
                    null
                }



            }, 500));


            $(sidebar_id).on("click", ".expand_arrow", function() {
                $(this).next("h1").nextUntil("h1").is("h2") ? $(this).next("h1").nextUntil(".expand_arrow").toggle() : null
            })

            $(sidebar_id).on("click", ('h1,h2'), function() { // On click  toggle the title sub-titles and scroll to correspondent text in main book window                     

                row_id = $(this).attr("id").slice(1)
                $(sidebar_id + " H1, H2").removeClass("active")
                $(this).addClass("active")
                knex_all.from("b" + table_id_original).where('content', 'like', '%toc-' + $(this).attr("id").slice(1) + '%').then(function(title) {
                    content_updater(table_id_original, title[0].id, content_id)
                    $(slider_id).slider("value", title[0].id);

                }).catch(function() {
                    null
                })

                this.tagName == "H1" && $(this).nextUntil(sidebar_id + " H1").is(sidebar_id + " H2") ? $(this).nextUntil(sidebar_id + " .expand_arrow").toggle() : null;


            })

        })




        /// end of book index 


        $(content_id).on('DOMSubtreeModified', function() { // menu tracker 
            if ($(content_id + " [data-type='title']").length != 0) {
                theid = "#I" + $(content_id + " [data-type=title]").attr('id').slice(4)
                theclass = "." + $(theid).attr("class").split(' ')[0]
                $(sidebar_id + " H1.active,H2.active").removeClass("active")
                $(sidebar_id + " " + theid).addClass("active")
                document.querySelector("H1.active,H2.active").scrollIntoView({
                    block: "center"
                })
                $(sidebar_id + " H2.active").is(":hidden") ? $(theclass).show().one() && $(sidebar_id + " H2").not(theclass).hide().one() : null

            } else {}

        })

    } //end index_formation_and_behaviors

    book_text_formation()
    index_formation_and_behaviors()

    $(".chrome-tab-close").on("click", function() { // closing tabs

        let rawdata = fs.readFileSync(last_opened);
        let last_opened_list = JSON.parse(rawdata);
        let updated = false;

        for (let i = 0; i < last_opened_list.length; i++) {
            if (last_opened_list[i].name === book_title) {
                last_opened_list[i].page = $(page_input).val() || "1";
                last_opened_list[i].page_id = $(content_id).attr("id");
                last_opened_list[i].part = $(part_input).val();
                last_opened_list[i].id = table_id_original;
                updated = true;
                break;
            }
        }

        if (!updated) {
            last_opened_list.push({
                "name": book_title,
                "page": $(page_input).val() || "1",
                "page_id": $(content_id).attr("id"),
                "part": $(part_input).val(),
                "id": table_id_original
            });
        }

        // write updated last_opened_list to file
        fs.writeFileSync(last_opened, JSON.stringify(last_opened_list));

        last_opened_list = JSON.stringify(last_opened_list)
        fs.writeFileSync(last_opened, last_opened_list)

        // Closing tabs
        $(".chrome-tab").prev().length >= 2 ? $(".chrome-tab").prev().trigger("click") : $("#001").trigger("click")
        $("#" + this.id.substring(1)).remove()
        $("#b" + this.id.substring(1)).remove()
    })



    $(".chrome-tab").on("click", function() { //          navigating between tabs            
        $(".book_div").hide()
        $("#b" + this.id).show()
        $(this).attr("id") == "001" ? $(".chrome-tabs .chrome-tab[active]").removeAttr("active") : null
    })

    let width

    function close_index() { // close/open book index 

        if ($(sidebar_id).width() != 0) {
            width = $(sidebar_id).width()
            $(sidebar_id).animate({
                width: '0'
            })
            $(sidebar_search_input).animate({
                width: '0'
            }) && $(sidebar_search_input).hide()
            //$(sidebar_id).slideUp()
            $(content_id).animate({
                width: 'auto'
            })

        } else {
            $(sidebar_id).animate({
                width: Math.round(width) + 'px'
            })
            $(sidebar_search_input).animate({
                width: Math.round(width) + 'px'
            }) && $(sidebar_search_input).show()
            $(content_id).animate({
                width: 'auto'
            })
            $(sidebar_id).show()
        }
    }

    function add_to_bookmarks() { // add_to_bookmarks
        let rawdata = fs.readFileSync(bookmark_file);
        let bookmarks_list = JSON.parse(rawdata);
        bookmarks_list.push({
            "name": book_title,
            "page": $(page_input).val() || "1",
            "page_id": $(content_id).attr("id"),
            "part": $(part_input).val(),
            "id": table_id_original
        })
        bookmarks_list = JSON.stringify(bookmarks_list)
        fs.writeFileSync(bookmark_file, bookmarks_list)
    }

}